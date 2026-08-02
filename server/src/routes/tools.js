import express from 'express';
import { calculateBrutToNet, calculateNetToBrut } from '../services/payrollService.js';

const router = express.Router();

// --------------------------------------------------------------------------
// 1. POST /api/tools/calculate-payroll (Maaş: Brüt-Net / Net-Brüt)
// --------------------------------------------------------------------------
router.post('/calculate-payroll', (req, res) => {
  try {
    const { amount, type = 'brutToNet', year = 2026 } = req.body;
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen geçerli bir tutar giriniz.'
      });
    }

    // Gelen 'type' değerine göre ilgili servisi çalıştırıyoruz
    const monthlyDetails = type === 'netToBrut'
      ? calculateNetToBrut(numericAmount, Number(year))
      : calculateBrutToNet(numericAmount, Number(year));

    // Yıllık Toplamlar
    const totalBrut = monthlyDetails.reduce((sum, item) => sum + item.brut, 0);
    const totalNet = monthlyDetails.reduce((sum, item) => sum + item.net, 0);
    const totalSgk = monthlyDetails.reduce((sum, item) => sum + (item.sgkIsci || 0) + (item.issizlikIsci || 0), 0);
    const totalTax = monthlyDetails.reduce((sum, item) => sum + (item.finalGv || 0) + (item.finalDamga || 0), 0);

    return res.json({
      success: true,
      data: {
        type,
        year: Number(year),
        annualTotals: {
          totalBrut: Number(totalBrut.toFixed(2)),
          totalNet: Number(totalNet.toFixed(2)),
          totalSgk: Number(totalSgk.toFixed(2)),
          totalTax: Number(totalTax.toFixed(2))
        },
        monthlyDetails
      }
    });

  } catch (error) {
    console.error('Maaş hesaplama hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Maaş hesaplanırken sunucu tarafında bir hata oluştu.'
    });
  }
});

// --------------------------------------------------------------------------
// 2. POST /api/tools/calculate-severance (Kıdem ve İhbar Tazminatı)
// --------------------------------------------------------------------------
router.post('/calculate-severance', (req, res) => {
  try {
    const { startDate, endDate, grossSalary, additionalBenefits = 0, includeNotice = true } = req.body;
    const numGrossSalary = Number(grossSalary);
    const numBenefits = Number(additionalBenefits);

    if (!startDate || !endDate || !numGrossSalary || numGrossSalary <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen gerekli tarih ve ücret bilgilerini eksiksiz giriniz.'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({
        success: false,
        message: 'İşten ayrılış tarihi, başlama tarihinden sonra geçerli bir tarih olmalıdır.'
      });
    }

    // Yıl, Ay, Gün Hesaplama
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalYearsExact = totalDays / 365.25;

    // 1475 Sayılı İş Kanunu Md. 14 uyarınca 1 yıldan az çalışan kıdem tazminatına hak kazanamaz
    const isEligibleForSeverance = totalYearsExact >= 1;

    // Kıdem Tazminatı Tavanı ve Giydirilmiş Brüt Kontrolü
    const KIDEM_TAVANI_2026 = 46398.00; 
    const rawGiydirilmisBrut = numGrossSalary + numBenefits;

    let tavanApplied = false;
    let basisBrut = rawGiydirilmisBrut;
    if (basisBrut > KIDEM_TAVANI_2026) {
      basisBrut = KIDEM_TAVANI_2026;
      tavanApplied = true;
    }

    // Kıdem Tazminatı Hesabı (Gelir vergisinden müstesna, binde 7.59 damga vergisi)
    let severanceGross = 0;
    let severanceStampTax = 0;
    let severanceNet = 0;

    if (isEligibleForSeverance) {
      severanceGross = basisBrut * totalYearsExact;
      severanceStampTax = severanceGross * 0.00759;
      severanceNet = severanceGross - severanceStampTax;
    }

    // İhbar Tazminatı Hesabı (4857 Sayılı Kanun Md. 17)
    let noticeWeeks = 0;
    if (totalDays < 180) noticeWeeks = 2;          // 6 aydan az: 2 Hafta
    else if (totalDays < 540) noticeWeeks = 4;     // 6 ay - 1.5 yıl: 4 Hafta
    else if (totalDays < 1080) noticeWeeks = 6;    // 1.5 yıl - 3 yıl: 6 Hafta
    else noticeWeeks = 8;                          // 3 yıldan fazla: 8 Hafta

    let noticeGross = 0;
    let noticeIncomeTax = 0;
    let noticeStampTax = 0;
    let noticeNet = 0;

    if (includeNotice) {
      const dailyGross = rawGiydirilmisBrut / 30;
      noticeGross = dailyGross * (noticeWeeks * 7);
      noticeIncomeTax = noticeGross * 0.15; // Standart %15 vergi dilimi varsayımı
      noticeStampTax = noticeGross * 0.00759;
      noticeNet = noticeGross - (noticeIncomeTax + noticeStampTax);
    }

    return res.json({
      success: true,
      data: {
        duration: { years, months, days, totalDays },
        severance: {
          isEligible: isEligibleForSeverance,
          basisBrut: Number(basisBrut.toFixed(2)),
          tavanApplied,
          gross: Number(severanceGross.toFixed(2)),
          stampTax: Number(severanceStampTax.toFixed(2)),
          net: Number(severanceNet.toFixed(2))
        },
        notice: {
          weeks: noticeWeeks,
          gross: Number(noticeGross.toFixed(2)),
          incomeTax: Number(noticeIncomeTax.toFixed(2)),
          stampTax: Number(noticeStampTax.toFixed(2)),
          net: Number(noticeNet.toFixed(2))
        },
        totalNetPayout: Number((severanceNet + noticeNet).toFixed(2))
      }
    });

  } catch (error) {
    console.error('Tazminat hesaplama hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Tazminat hesaplanırken sunucu tarafında bir hata oluştu.'
    });
  }
});

// --------------------------------------------------------------------------
// 3. POST /api/tools/calculate-late-fee (Gecikme Zammı ve Faizi)
// --------------------------------------------------------------------------
router.post('/calculate-late-fee', (req, res) => {
  try {
    const { amount, dueDate, paymentDate, monthlyRate = 4.50 } = req.body;
    const numAmount = Number(amount);
    const numRate = Number(monthlyRate);

    if (!numAmount || numAmount <= 0 || !dueDate || !paymentDate) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen tutar ve tarih bilgilerini eksiksiz giriniz.'
      });
    }

    const start = new Date(dueDate);
    const end = new Date(paymentDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({
        success: false,
        message: 'Ödeme tarihi, vade tarihinden sonra geçerli bir tarih olmalıdır.'
      });
    }

    // Gün ve Ay Hesaplama
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalMonths = (years * 12) + months;
    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    // AATUHK Md. 51 Uygun Hesaplama Mantığı:
    // - Tam aylar için belirlenen aylık oran (%)
    // - Ay kesirleri (kalan gün) için günlük oran = (Aylık Oran / 30)
    const rateDecimal = numRate / 100;
    const dailyRateDecimal = rateDecimal / 30;

    const fullMonthsFee = numAmount * (totalMonths * rateDecimal);
    const fractionDaysFee = numAmount * (days * dailyRateDecimal);

    const totalLateFee = fullMonthsFee + fractionDaysFee;
    const totalPayout = numAmount + totalLateFee;

    return res.json({
      success: true,
      data: {
        principal: Number(numAmount.toFixed(2)),
        monthlyRate: numRate,
        duration: {
          months: totalMonths,
          days,
          totalDays
        },
        lateFee: Number(totalLateFee.toFixed(2)),
        totalPayout: Number(totalPayout.toFixed(2))
      }
    });

  } catch (error) {
    console.error('Gecikme zammı hesaplama hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Gecikme zammı hesaplanırken sunucu tarafında bir hata oluştu.'
    });
  }
});

export default router;