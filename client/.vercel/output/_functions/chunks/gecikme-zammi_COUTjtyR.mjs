import { n as __exportAll, t as createComponent } from "./compiler_BZ5cquMV.mjs";
import { _ as defineScriptVars, i as renderComponent, m as maybeRenderHead, u as renderTemplate } from "./server_BzieqcK4.mjs";
import { t as $$Layout } from "./Layout_DKYPyp_h.mjs";
import { t as $$DisclaimerNote } from "./DisclaimerNote_B7EVx5Yg.mjs";
//#region src/pages/pratik-araclar/gecikme-zammi.astro
var gecikme_zammi_exports = /* @__PURE__ */ __exportAll({
	default: () => $$GecikmeZammi,
	file: () => $$file,
	url: () => $$url
});
var $$GecikmeZammi = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Gecikme Zammı ve Faizi Hesaplama (2026 Güncel)" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<section class="max-w-4xl mx-auto py-8 px-4 sm:px-6"><!-- Başlık --><header class="text-center space-y-2 mb-8"><h1 class="text-3xl font-bold text-slate-900 dark:text-white">Gecikme Zammı & Faizi Hesaplama</h1><p class="text-slate-600 dark:text-slate-400 text-sm md:text-base">Vergi, SGK ve kamu alacakları için güncel mevzuata uygun gecikme zammı ve faizi hesabı.</p></header><!-- Form ve Sonuç Kartı Grid --><div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><!-- Form --><div class="lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"><form id="calcForm" class="space-y-4"><div><label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Asıl Alacak Tutarı (TL)</label><input type="number" id="amount" step="0.01" placeholder="Örn: 50000" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"></div><div><label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Vade / Son Ödeme Tarihi</label><input type="date" id="dueDate" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"></div><div><label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Ödeme Yapılacak / Hesaplama Tarihi</label><input type="date" id="paymentDate" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"></div><div><label class="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Uygulanacak Aylık Oran (%)</label><input type="number" id="monthlyRate" step="0.01" value="4.50" required class="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"><span class="text-xs text-slate-400 mt-1 block">*Resmi gazete oranlarına göre güncelleyebilirsiniz.</span></div><button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-colors duration-200 mt-2">Hesapla</button></form></div><!-- Sonuç Ekranı --><div class="lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between"><div><h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Hesaplama Özeti</h2><div id="results" class="hidden space-y-4"><div class="grid grid-cols-2 gap-4"><div class="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl"><span class="text-xs text-slate-500 dark:text-slate-400 block">Gecikilen Süre</span><span id="resDuration" class="font-bold text-slate-800 dark:text-slate-200">0 Ay 0 Gün</span><span id="resTotalDays" class="text-xs text-slate-400 block">(Toplam 0 Gün)</span></div><div class="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl"><span class="text-xs text-slate-500 dark:text-slate-400 block">Uygulanan Oran</span><span id="resRate" class="font-bold text-slate-800 dark:text-slate-200">%0</span></div></div><div class="space-y-2 pt-2"><div class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700"><span class="text-slate-600 dark:text-slate-400">Asıl Alacak Tutarı</span><span id="resPrincipal" class="font-semibold text-slate-900 dark:text-white">0,00 TL</span></div><div class="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 text-amber-600 dark:text-amber-400"><span class="font-medium">Hesaplanan Gecikme Zammı</span><span id="resPenalty" class="font-bold">0,00 TL</span></div></div><div class="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/50 flex justify-between items-center mt-4"><span class="font-bold text-blue-900 dark:text-blue-200">Toplam Ödenecek Tutar</span><span id="resTotalPayout" class="text-xl font-extrabold text-blue-700 dark:text-blue-400">0,00 TL</span></div></div><!-- İlk Durum Uyarısı --><div id="placeholder" class="h-48 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M15 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 002-2H7a2 2 0 002 2v14a2 2 0 002 2z"></path></svg><span>Hesaplama yapmak için bilgileri girip butonuna tıklayın.</span></div></div></div></div><!-- Yasal Uyarı / Bilgilendirme Notu -->${renderComponent($$result2, "DisclaimerNote", $$DisclaimerNote, {})}</section>` })}<script>(function(){${defineScriptVars({ PUBLIC_API_URL: "http://localhost:5000/api" })}
  const form = document.getElementById('calcForm');
  const results = document.getElementById('results');
  const placeholder = document.getElementById('placeholder');

  const paymentDateInput = document.getElementById('paymentDate');
  if (paymentDateInput) {
    paymentDateInput.valueAsDate = new Date();
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const dueDate = document.getElementById('dueDate').value;
    const paymentDate = document.getElementById('paymentDate').value;
    const monthlyRate = parseFloat(document.getElementById('monthlyRate').value);

    try {
      const response = await fetch(\`\${PUBLIC_API_URL}/tools/calculate-late-fee\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, dueDate, paymentDate, monthlyRate })
      });

      const resData = await response.json();

      if (!resData.success) {
        alert(resData.message || 'Hesaplama yapılırken bir hata oluştu.');
        return;
      }

      const { data } = resData;
      const fmt = (num) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);

      document.getElementById('resPrincipal').textContent = \`\${fmt(data.principal)} TL\`;
      document.getElementById('resPenalty').textContent = \`\${fmt(data.lateFee)} TL\`;
      document.getElementById('resTotalPayout').textContent = \`\${fmt(data.totalPayout)} TL\`;
      document.getElementById('resDuration').textContent = \`\${data.duration.months} Ay \${data.duration.days} Gün\`;
      document.getElementById('resTotalDays').textContent = \`(Toplam \${data.duration.totalDays} Gün)\`;
      document.getElementById('resRate').textContent = \`%\${data.monthlyRate}\`;

      placeholder?.classList.add('hidden');
      results?.classList.remove('hidden');

    } catch (err) {
      console.error(err);
      alert('Sunucuyla iletişim kurulurken hata oluştu.');
    }
  });
})();<\/script>`;
}, "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/pages/pratik-araclar/gecikme-zammi.astro", void 0);
var $$file = "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/pages/pratik-araclar/gecikme-zammi.astro";
var $$url = "/pratik-araclar/gecikme-zammi";
//#endregion
//#region \0virtual:astro:page:src/pages/pratik-araclar/gecikme-zammi@_@astro
var page = () => gecikme_zammi_exports;
//#endregion
export { page };
