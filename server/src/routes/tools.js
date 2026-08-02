import express from 'express';
import { calculateBrutToNet, calculateNetToBrut } from '../services/payrollService.js';
import { calculateSeveranceLogic } from '../services/severanceService.js';
import { payrollSchema, severanceSchema, lateFeeSchema } from '../schemas/toolSchemas.js';

const router = express.Router();

// --------------------------------------------------------------------------
// 1. POST /calculate-payroll (Zod Entegreli Maaş Hesaplama)
// --------------------------------------------------------------------------
router.post('/calculate-payroll', (req, res) => {
  try {
    const validationResult = payrollSchema.safeParse({
      amount: req.body.amount !== undefined ? Number(req.body.amount) : undefined,
      type: req.body.type,
      year: req.body.year !== undefined ? Number(req.body.year) : undefined,
    });

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veri girişi.',
        errors: validationResult.error.errors.map(err => err.message)
      });
    }

    const { amount, type, year } = validationResult.data;

    const monthlyDetails = type === 'netToBrut'
      ? calculateNetToBrut(amount, year)
      : calculateBrutToNet(amount, year);

    const totalBrut = monthlyDetails.reduce((sum, item) => sum + item.brut, 0);
    const totalNet = monthlyDetails.reduce((sum, item) => sum + item.net, 0);
    const totalSgk = monthlyDetails.reduce((sum, item) => sum + (item.sgkIsci || 0) + (item.issizlikIsci || 0), 0);
    const totalTax = monthlyDetails.reduce((sum, item) => sum + (item.finalGv || 0) + (item.finalDamga || 0), 0);

    return res.json({
      success: true,
      data: {
        type,
        year,
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
// 2. POST /calculate-severance (Zod Entegreli Kıdem ve İhbar Tazminatı)
// --------------------------------------------------------------------------
router.post('/calculate-severance', (req, res) => {
  try {
    const validationResult = severanceSchema.safeParse({
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      grossSalary: req.body.grossSalary !== undefined ? Number(req.body.grossSalary) : undefined,
      additionalBenefits: req.body.additionalBenefits !== undefined ? Number(req.body.additionalBenefits) : 0,
      includeNotice: req.body.includeNotice !== undefined ? Boolean(req.body.includeNotice) : true,
    });

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veri girişi.',
        errors: validationResult.error.errors.map(err => err.message)
      });
    }

    const resultData = calculateSeveranceLogic(validationResult.data);

    return res.json({
      success: true,
      data: resultData
    });

  } catch (error) {
    console.error('Tazminat hesaplama hatası:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Tazminat hesaplanırken sunucu tarafında bir hata oluştu.'
    });
  }
});

// --------------------------------------------------------------------------
// 3. POST /calculate-late-fee (Zod Entegreli Gecikme Zammı)
// --------------------------------------------------------------------------
router.post('/calculate-late-fee', (req, res) => {
  try {
    const validationResult = lateFeeSchema.safeParse({
      amount: req.body.amount !== undefined ? Number(req.body.amount) : undefined,
      dueDate: req.body.dueDate,
      paymentDate: req.body.paymentDate,
      monthlyRate: req.body.monthlyRate !== undefined ? Number(req.body.monthlyRate) : 4.50
    });

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veri girişi.',
        errors: validationResult.error.errors.map(err => err.message)
      });
    }

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