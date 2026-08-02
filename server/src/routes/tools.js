import express from 'express';
import { calculateBrutToNet, calculateNetToBrut } from '../services/payrollService.js';
import { lateFeeSchema } from '../schemas/toolSchemas.js';

const router = express.Router();

// --------------------------------------------------------------------------
// 1. POST /calculate-payroll (Maaş: Brüt-Net / Net-Brüt)
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

    const monthlyDetails = type === 'netToBrut'
      ? calculateNetToBrut(numericAmount, Number(year))
      : calculateBrutToNet(numericAmount, Number(year));

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
// 2. POST /calculate-severance (Kıdem ve İhbar Tazminatı)
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

    const isEligibleForSeverance = totalYearsExact >= 1;

    const KIDEM_TAVANI_2026 = 46398.00; 
    const rawGiydirilmisBrut = numGrossSalary + numBenefits;

    let tavanApplied = false;
    let basisBrut = rawGiydirilmisBrut;
    if (basisBrut > KIDEM_TAVANI_2026) {
      basisBrut = KIDEM_TAVANI_2026;
      tavanApplied = true;
    }

    let severanceGross = 0;
    let severanceStampTax = 0;
    let severanceNet = 0;

    if (isEligibleForSeverance) {
      severanceGross = basisBrut * totalYearsExact;
      severanceStampTax = severanceGross * 0.00759;
      severanceNet = severanceGross - severanceStampTax;
    }

    let noticeWeeks = 0;
    if (totalDays < 180) noticeWeeks = 2;         
    else if (totalDays < 540) noticeWeeks = 4;    
    else if (totalDays < 1080) noticeWeeks = 6;   
    else noticeWeeks = 8;                         

    let noticeGross = 0;
    let noticeIncomeTax = 0;
    let noticeStampTax = 0;
    let noticeNet = 0;

    if (includeNotice) {
      const dailyGross = rawGiydirilmisBrut / 30;
      noticeGross = dailyGross * (noticeWeeks * 7);
      noticeIncomeTax = noticeGross * 0.15; 
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
// 3. POST /calculate-late-fee (Zod Entegreli Gecikme Zammı)
// --------------------------------------------------------------------------
router.post('/calculate-late-fee', (req, res) => {
  try {
    // 1. Zod Süzgeci ile Gelen Veriyi Doğrula
    const validationResult = lateFeeSchema.safeParse({
      amount: Number(req.body.amount),
      dueDate: req.body.dueDate,
      paymentDate: req.body.paymentDate,
      monthlyRate: req.body.monthlyRate ? Number(req.body.monthlyRate) : 4.50
    });

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veri girişi.',
        errors: validationResult.error.errors.map(err => err.message)
      });
    }

    // 2. Doğrulanmış Güvenli Verileri Al
    const { amount, dueDate, paymentDate, monthlyRate = 4.50 } = validationResult.data;

    const start = new Date(dueDate);
    const end = new Date(paymentDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({
        success: false,
        message: 'Ödeme tarihi, vade tarihinden sonra geçerli bir tarih olmalıdır.'
      });
    }

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

    const rateDecimal = monthlyRate / 100;
    const dailyRateDecimal = rateDecimal / 30;

    const fullMonthsFee = amount * (totalMonths * rateDecimal);
    const fractionDaysFee = amount * (days * dailyRateDecimal);

    const totalLateFee = fullMonthsFee + fractionDaysFee;
    const totalPayout = amount + totalLateFee;

    return res.json({
      success: true,
      data: {
        principal: Number(amount.toFixed(2)),
        monthlyRate,
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