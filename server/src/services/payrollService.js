// backend/src/services/payrollService.js

const PARAMS_2026 = {
  year: 2026,
  asgariUcretBrut: 33030.00,
  sgkTavan: 297270.00,
  sgkIsciOran: 0.14,
  issizlikIsciOran: 0.01,
  damgaVergisiOran: 0.00759,
  taxBrackets: [
    { limit: 190000, rate: 0.15 },
    { limit: 400000, rate: 0.20 },
    { limit: 1500000, rate: 0.27 },
    { limit: 5300000, rate: 0.35 },
    { limit: Infinity, rate: 0.40 }
  ]
};

// Gelir Vergisi Dilim Hesaplama
function calculateIncomeTax(currentMatrah, cumulativeMatrah, params) {
  let tax = 0;
  let remainingMatrah = currentMatrah;
  let prevLimit = 0;

  for (const bracket of params.taxBrackets) {
    if (cumulativeMatrah + currentMatrah > prevLimit) {
      const taxableInThisBracket = Math.min(
        remainingMatrah,
        Math.max(0, bracket.limit - Math.max(cumulativeMatrah, prevLimit))
      );

      if (taxableInThisBracket > 0) {
        tax += taxableInThisBracket * bracket.rate;
        remainingMatrah -= taxableInThisBracket;
      }
    }
    prevLimit = bracket.limit;
    if (remainingMatrah <= 0) break;
  }

  return tax;
}

// Ortak Hesaplama Yardımcısı (Tek Ay İçin)
function calculateMonthDetails(brutSalary, cumulativeGvMatrah, cumulativeAsgariGvMatrah, monthName, params) {
  const asgariSgk = params.asgariUcretBrut * params.sgkIsciOran;
  const asgariIssizlik = params.asgariUcretBrut * params.issizlikIsciOran;
  const asgariGvMatrah = params.asgariUcretBrut - (asgariSgk + asgariIssizlik);
  const asgariDamgaIstisnasi = params.asgariUcretBrut * params.damgaVergisiOran;

  const sgkMatrah = Math.min(brutSalary, params.sgkTavan);
  const sgkIsci = sgkMatrah * params.sgkIsciOran;
  const issizlikIsci = sgkMatrah * params.issizlikIsciOran;
  const gvMatrah = brutSalary - (sgkIsci + issizlikIsci);

  const rawGv = calculateIncomeTax(gvMatrah, cumulativeGvMatrah, params);
  const asgariGv = calculateIncomeTax(asgariGvMatrah, cumulativeAsgariGvMatrah, params);
  const finalGv = Math.max(0, rawGv - asgariGv);

  const rawDamga = brutSalary * params.damgaVergisiOran;
  const finalDamga = Math.max(0, rawDamga - asgariDamgaIstisnasi);

  const totalDeductions = sgkIsci + issizlikIsci + finalGv + finalDamga;
  const netSalary = brutSalary - totalDeductions;

  return {
    month: monthName,
    brut: Number(brutSalary.toFixed(2)),
    sgkIsci: Number(sgkIsci.toFixed(2)),
    issizlikIsci: Number(issizlikIsci.toFixed(2)),
    gvMatrah: Number(gvMatrah.toFixed(2)),
    cumulativeGvMatrah: Number((cumulativeGvMatrah + gvMatrah).toFixed(2)),
    calculatedGv: Number(rawGv.toFixed(2)),
    asgariGvIstisnasi: Number(asgariGv.toFixed(2)),
    finalGv: Number(finalGv.toFixed(2)),
    finalDamga: Number(finalDamga.toFixed(2)),
    net: Number(netSalary.toFixed(2)),
    _rawNet: netSalary,
    _rawGvMatrah: gvMatrah,
    _rawAsgariGvMatrah: asgariGvMatrah
  };
}

// 1. Brüt'ten Net'e Hesaplama
export function calculateBrutToNet(brutSalary, year = 2026) {
  const params = PARAMS_2026;
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  let cumulativeGvMatrah = 0;
  let cumulativeAsgariGvMatrah = 0;
  const monthlyResults = [];

  for (let i = 0; i < 12; i++) {
    const detail = calculateMonthDetails(brutSalary, cumulativeGvMatrah, cumulativeAsgariGvMatrah, months[i], params);
    cumulativeGvMatrah += detail._rawGvMatrah;
    cumulativeAsgariGvMatrah += detail._rawAsgariGvMatrah;

    delete detail._rawNet;
    delete detail._rawGvMatrah;
    delete detail._rawAsgariGvMatrah;

    monthlyResults.push(detail);
  }

  return monthlyResults;
}

// 2. Net'ten Brüt'e Hesaplama (Yakınsama / Ikili Arama Metodu)
export function calculateNetToBrut(targetNetSalary, year = 2026) {
  const params = PARAMS_2026;
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  let cumulativeGvMatrah = 0;
  let cumulativeAsgariGvMatrah = 0;
  const monthlyResults = [];

  for (let i = 0; i < 12; i++) {
    let minBrut = targetNetSalary;
    let maxBrut = targetNetSalary * 3.5;
    let currentBrut = (minBrut + maxBrut) / 2;
    let detail;

    // Her ay için hedeflenen net ücrete ulaşana kadar ikili arama yapar
    for (let iter = 0; iter < 40; iter++) {
      detail = calculateMonthDetails(currentBrut, cumulativeGvMatrah, cumulativeAsgariGvMatrah, months[i], params);
      const diff = detail._rawNet - targetNetSalary;

      if (Math.abs(diff) < 0.0001) break;

      if (diff > 0) {
        maxBrut = currentBrut;
      } else {
        minBrut = currentBrut;
      }
      currentBrut = (minBrut + maxBrut) / 2;
    }

    cumulativeGvMatrah += detail._rawGvMatrah;
    cumulativeAsgariGvMatrah += detail._rawAsgariGvMatrah;

    delete detail._rawNet;
    delete detail._rawGvMatrah;
    delete detail._rawAsgariGvMatrah;

    monthlyResults.push(detail);
  }

  return monthlyResults;
}