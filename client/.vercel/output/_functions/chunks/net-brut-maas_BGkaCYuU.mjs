import { n as __exportAll, t as createComponent } from "./compiler_BZ5cquMV.mjs";
import { _ as defineScriptVars, i as renderComponent, m as maybeRenderHead, u as renderTemplate } from "./server_BzieqcK4.mjs";
import { t as $$Layout } from "./Layout_DKYPyp_h.mjs";
import { t as $$DisclaimerNote } from "./DisclaimerNote_B7EVx5Yg.mjs";
//#region src/pages/pratik-araclar/net-brut-maas.astro
var net_brut_maas_exports = /* @__PURE__ */ __exportAll({
	default: () => $$NetBrutMaas,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$NetBrutMaas = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "2026 Gelir Vergisi ve Maaş Hesaplama Robotu | Samet Can Tulum" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<section class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6"><!-- Başlık ve Açıklama --><div class="border-b border-slate-200 dark:border-slate-800 pb-5"><div class="flex items-center gap-2 mb-2"><span class="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">2026 GÜNCEL</span><span class="text-xs text-slate-500 dark:text-slate-400">193 Sayılı GVK & 5510 Sayılı SSK Kanunu Uyumlu</span></div><h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Maaş ve İşveren Maliyeti Hesaplama Motoru</h1><p class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">Asgari ücret vergi istisnası, Gelir Vergisi dilim kaymaları ve SGK tavan/taban sınırları otomatik hesaplanır.</p></div><!-- ANA HESAPLAMA VE ÖZET ALANI --><div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"><!-- SOL KOLON: Parametre Formu --><div class="lg:col-span-5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm space-y-5"><div class="border-b border-slate-200 dark:border-slate-700/80 pb-3 flex items-center justify-between"><h2 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2"><span class="text-emerald-500">⚙️</span> Hesaplama Parametreleri</h2><span class="text-[11px] text-slate-400">Yıl: 2026</span></div><form id="payroll-form" class="space-y-4"><!-- Hesaplama Yönü --><div><label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Hesaplama Yönü</label><div class="grid grid-cols-2 gap-2"><label class="cursor-pointer border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 rounded-lg p-2.5 flex items-center justify-center gap-2 text-xs font-medium dark:text-slate-200 hover:border-emerald-500/50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/10 transition-colors"><input type="radio" name="type" value="brutToNet" checked class="accent-emerald-500 cursor-pointer type-radio"><span>Brüt'ten Net'e</span></label><label class="cursor-pointer border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 rounded-lg p-2.5 flex items-center justify-center gap-2 text-xs font-medium dark:text-slate-200 hover:border-emerald-500/50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/10 transition-colors"><input type="radio" name="type" value="netToBrut" class="accent-emerald-500 cursor-pointer type-radio"><span>Net'ten Brüt'e</span></label></div></div><!-- Tutar Girişi --><div><label id="amount-label" for="amount" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Aylık Brüt Tutar (TL)</label><div class="relative"><input type="number" id="amount" name="amount" min="1" step="0.01" placeholder="33030.00" required class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"><span class="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">₺ / Ay</span></div></div><!-- SGK Teşvik/İndirim Seçimi --><div><label for="sgkIndirim" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">SGK İşveren Primi İndirimi</label><select id="sgkIndirim" name="sgkIndirim" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"><option value="5">5510 %5 Hazine İndirimi Uygulansın</option><option value="0">İndirim Uygulanmasın (%20.5 Standart)</option></select></div><button type="submit" id="submit-btn" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-all text-xs uppercase tracking-wider shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer"><span id="btn-text">Hesapla ve Cetveli Getir</span><div id="btn-spinner" class="hidden w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div></button></form><div id="error-box" class="hidden p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs text-center font-medium"></div></div><!-- SAĞ KOLON: Yıllık Özet ve Maliyet Kartları --><div class="lg:col-span-7 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 shadow-sm space-y-4"><div class="border-b border-slate-200 dark:border-slate-700/80 pb-3 flex items-center justify-between"><h2 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2"><span class="text-emerald-500">📊</span> Yıllık İstatistikler & İşveren Maliyeti</h2><span class="text-[10px] text-slate-400 uppercase font-mono">Özet Bilgi</span></div><div id="summary-placeholder" class="py-12 text-center text-xs text-slate-400">Hesaplama yapmak için soldaki formdan tutar girip "Hesapla" butonuna basınız.</div><div id="summary-cards" class="hidden grid grid-cols-1 sm:grid-cols-2 gap-3"><div class="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 p-3.5 rounded-lg"><span class="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Ortalama Aylık Net</span><p id="avg-net" class="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">0,00 ₺</p></div><div class="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 p-3.5 rounded-lg"><span class="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Yıllık Toplam Ele Geçen</span><p id="total-net" class="text-lg font-bold text-slate-900 dark:text-white mt-0.5">0,00 ₺</p></div><div class="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 p-3.5 rounded-lg"><span class="text-[11px] font-medium text-amber-600 dark:text-amber-400/90 block">Yıllık İşçi Kesintileri (SGK+GV+DV)</span><p id="total-worker-deductions" class="text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5">0,00 ₺</p></div><div class="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/60 p-3.5 rounded-lg"><span class="text-[11px] font-medium text-rose-600 dark:text-rose-400/90 block">Aylık Toplam İşveren Maliyeti</span><p id="monthly-employer-cost" class="text-base font-bold text-rose-600 dark:text-rose-400 mt-0.5">0,00 ₺</p></div><!-- İşveren Maliyet Detayı --><div class="sm:col-span-2 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-lg p-3 text-xs space-y-2 mt-1"><div class="font-bold text-slate-800 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-1 flex justify-between"><span>İşveren Maliyet Bileşenleri (Aylık)</span><span id="cost-sgk-rate-label" class="text-[10px] text-slate-500 font-normal">%5 İndirimli</span></div><div class="flex justify-between text-slate-600 dark:text-slate-400"><span>Brüt Ücret:</span><span id="cost-brut" class="font-mono text-slate-900 dark:text-white font-semibold">0,00 ₺</span></div><div class="flex justify-between text-slate-600 dark:text-slate-400"><span id="cost-sgk-title">SGK İşveren Primi (%15.5):</span><span id="cost-sgk-employer" class="font-mono text-slate-900 dark:text-white font-semibold">0,00 ₺</span></div><div class="flex justify-between text-slate-600 dark:text-slate-400"><span>İşveren İşsizlik Sigortası (%2):</span><span id="cost-issizlik-employer" class="font-mono text-slate-900 dark:text-white font-semibold">0,00 ₺</span></div></div></div></div></div><!-- DETAYLI 12 AYLIK BORDRO TABLOSU --><div id="table-wrapper" class="hidden bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden shadow-md"><div class="p-4 border-b border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2"><div><h3 class="font-bold text-sm text-slate-900 dark:text-white">2026 Yılı 12 Aylık Detaylı Bordro Cetveli</h3><p class="text-[11px] text-slate-500 dark:text-slate-400">Vergi istisnaları ve dilim kaymaları aylık bazda detaylandırılmıştır.</p></div><button id="print-btn" type="button" class="px-3 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"><span>🖨️</span> Yazdır / PDF</button></div><div class="overflow-x-auto"><table class="w-full text-left text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap"><thead class="bg-slate-100 dark:bg-slate-900/90 uppercase text-[10px] tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 font-mono"><tr><th class="py-3 px-3">Aylar</th><th class="py-3 px-3 text-right">Brüt Ücret</th><th class="py-3 px-3 text-right">SGK İşçi (%14)</th><th class="py-3 px-3 text-right">İşsizlik (%1)</th><th class="py-3 px-3 text-right">Gelir Vergisi Matrahı</th><th class="py-3 px-3 text-right">Kum. GV Matrahı</th><th class="py-3 px-3 text-right">Hesaplanan GV</th><th class="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400">Asgari Ücret GV İst.</th><th class="py-3 px-3 text-right">Ödenecek GV</th><th class="py-3 px-3 text-right">Damga Vergisi</th><th class="py-3 px-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">Net Ele Geçen</th></tr></thead><tbody id="monthly-table-body" class="divide-y divide-slate-200 dark:divide-slate-700/40 font-mono text-[11px]"><!-- JS ile Doldurulacak --></tbody><tfoot id="monthly-table-foot" class="bg-slate-100 dark:bg-slate-900/90 font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 font-mono text-[11px]"><!-- Yıllık Toplam Satırı --></tfoot></table></div></div><!-- Yasal Uyarı / Bilgilendirme Notu -->${renderComponent($$result2, "DisclaimerNote", $$DisclaimerNote, {})}</section>` })}<script>(function(){${defineScriptVars({ PUBLIC_API_URL: "http://localhost:5000/api" })}
  const formatTL = (val) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val || 0);
  };

  const initPayrollForm = () => {
    const form = document.getElementById('payroll-form');
    if (!form || form.dataset.initialized === 'true') return;
    form.dataset.initialized = 'true';

    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const errorBox = document.getElementById('error-box');
    const amountLabel = document.getElementById('amount-label');
    const printBtn = document.getElementById('print-btn');
    
    const summaryPlaceholder = document.getElementById('summary-placeholder');
    const summaryCards = document.getElementById('summary-cards');
    const tableWrapper = document.getElementById('table-wrapper');
    const tableBody = document.getElementById('monthly-table-body');
    const tableFoot = document.getElementById('monthly-table-foot');

    // Yazdır Butonu
    printBtn?.addEventListener('click', () => window.print());

    // Dinamik Label Değişimi
    const radios = form.querySelectorAll('.type-radio');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (amountLabel) {
          amountLabel.textContent = radio.value === 'netToBrut' ? 'Aylık Net Tutar (TL)' : 'Aylık Brüt Tutar (TL)';
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      errorBox.classList.add('hidden');
      btnText.textContent = 'Hesaplanıyor...';
      btnSpinner.classList.remove('hidden');
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const selectedType = formData.get('type') || 'brutToNet';
      const amountVal = Number(formData.get('amount'));
      const sgkIndirimVal = Number(formData.get('sgkIndirim') || 5);

      try {
        const response = await fetch(\`\${PUBLIC_API_URL}/tools/calculate-payroll\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: amountVal, 
            type: selectedType, 
            year: 2026,
            sgkIndirim: sgkIndirimVal 
          })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Hesaplama yapılırken bir sunucu hatası oluştu.');
        }

        const { data } = result;
        const details = data.monthlyDetails;
        const totals = data.annualTotals;

        // 1. Özet Kartları Güncelle
        const avgNetVal = totals.totalNet / 12;
        document.getElementById('avg-net').textContent = formatTL(avgNetVal);
        document.getElementById('total-net').textContent = formatTL(totals.totalNet);
        
        const workerDeductions = (totals.totalSgk || 0) + (totals.totalTax || 0);
        document.getElementById('total-worker-deductions').textContent = formatTL(workerDeductions);

        // İşveren Maliyet Hesapları
        const monthlyBrut = details[0].brut;
        const sgkTavan2026 = 297270.00;
        const sgkBasis = Math.min(monthlyBrut, sgkTavan2026);
        
        const employerSgkRate = sgkIndirimVal === 5 ? 0.155 : 0.205; 
        const monthlySgkEmployer = sgkBasis * employerSgkRate;
        const monthlyIssizlikEmployer = sgkBasis * 0.02;
        const totalEmployerMonthly = monthlyBrut + monthlySgkEmployer + monthlyIssizlikEmployer;

        // İşveren Maliyet Detay Metinleri
        const rateLabel = document.getElementById('cost-sgk-rate-label');
        const rateTitle = document.getElementById('cost-sgk-title');
        if (rateLabel) rateLabel.textContent = sgkIndirimVal === 5 ? '%5 İndirimli' : 'Standart Oran';
        if (rateTitle) rateTitle.textContent = \`SGK İşveren Primi (%\${(employerSgkRate * 100).toFixed(1)}):\`;

        document.getElementById('monthly-employer-cost').textContent = formatTL(totalEmployerMonthly);
        document.getElementById('cost-brut').textContent = formatTL(monthlyBrut);
        document.getElementById('cost-sgk-employer').textContent = formatTL(monthlySgkEmployer);
        document.getElementById('cost-issizlik-employer').textContent = formatTL(monthlyIssizlikEmployer);

        summaryPlaceholder.classList.add('hidden');
        summaryCards.classList.remove('hidden');

        // 2. Detaylı Tabloyu Doldur
        tableBody.innerHTML = details.map((m) => \`
          <tr class="hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors">
            <td class="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">\${m.month}</td>
            <td class="py-2.5 px-3 text-right">\${formatTL(m.brut)}</td>
            <td class="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400/80">\${formatTL(m.sgkIsci)}</td>
            <td class="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400/80">\${formatTL(m.issizlikIsci)}</td>
            <td class="py-2.5 px-3 text-right text-slate-500 dark:text-slate-400">\${formatTL(m.gvMatrah)}</td>
            <td class="py-2.5 px-3 text-right text-slate-500 dark:text-slate-400">\${formatTL(m.cumulativeGvMatrah)}</td>
            <td class="py-2.5 px-3 text-right">\${formatTL(m.calculatedGv)}</td>
            <td class="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">-\${formatTL(m.asgariGvIstisnasi)}</td>
            <td class="py-2.5 px-3 text-right text-rose-600 dark:text-rose-400">\${formatTL(m.finalGv)}</td>
            <td class="py-2.5 px-3 text-right text-rose-600 dark:text-rose-400">\${formatTL(m.finalDamga)}</td>
            <td class="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">\${formatTL(m.net)}</td>
          </tr>
        \`).join('');

        // Tablo Altı Yıllık Toplam Satırı
        tableFoot.innerHTML = \`
          <tr class="bg-slate-100 dark:bg-slate-900">
            <td class="py-3 px-3 uppercase">TOPLAM</td>
            <td class="py-3 px-3 text-right">\${formatTL(totals.totalBrut)}</td>
            <td class="py-3 px-3 text-right text-amber-600 dark:text-amber-400">\${formatTL(details.reduce((a, b) => a + b.sgkIsci, 0))}</td>
            <td class="py-3 px-3 text-right text-amber-600 dark:text-amber-400">\${formatTL(details.reduce((a, b) => a + b.issizlikIsci, 0))}</td>
            <td class="py-3 px-3 text-right">-</td>
            <td class="py-3 px-3 text-right">-</td>
            <td class="py-3 px-3 text-right">\${formatTL(details.reduce((a, b) => a + b.calculatedGv, 0))}</td>
            <td class="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400">-\${formatTL(details.reduce((a, b) => a + b.asgariGvIstisnasi, 0))}</td>
            <td class="py-3 px-3 text-right text-rose-600 dark:text-rose-400">\${formatTL(details.reduce((a, b) => a + b.finalGv, 0))}</td>
            <td class="py-3 px-3 text-right text-rose-600 dark:text-rose-400">\${formatTL(details.reduce((a, b) => a + b.finalDamga, 0))}</td>
            <td class="py-3 px-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/20">\${formatTL(totals.totalNet)}</td>
          </tr>
        \`;

        tableWrapper.classList.remove('hidden');

      } catch (err) {
        console.error('Bordro Hesaplama Hatası:', err);
        errorBox.textContent = err.message || 'Bağlantı hatası oluştu. Lütfen backend (Node.js) sunucunuzun çalıştığından emin olun.';
        errorBox.classList.remove('hidden');
      } finally {
        btnText.textContent = 'Hesapla ve Cetveli Getir';
        btnSpinner.classList.add('hidden');
        submitBtn.disabled = false;
      }
    });
  };

  document.addEventListener('astro:page-load', initPayrollForm);
  document.addEventListener('DOMContentLoaded', initPayrollForm);
  initPayrollForm();
})();<\/script>`;
}, "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/pages/pratik-araclar/net-brut-maas.astro", void 0);
var $$file = "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/pages/pratik-araclar/net-brut-maas.astro";
var $$url = "/pratik-araclar/net-brut-maas";
//#endregion
//#region \0virtual:astro:page:src/pages/pratik-araclar/net-brut-maas@_@astro
var page = () => net_brut_maas_exports;
//#endregion
export { page };
