// server/src/services/severanceService.js

export function calculateSeveranceLogic({ startDate, endDate, grossSalary, additionalBenefits = 0, includeNotice = true }) {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      throw new Error('İşten ayrılış tarihi, başlama tarihinden sonra geçerli bir tarih olmalıdır.');
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
    const rawGiydirilmisBrut = grossSalary + additionalBenefits;
  
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
  
    return {
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
    };
  }