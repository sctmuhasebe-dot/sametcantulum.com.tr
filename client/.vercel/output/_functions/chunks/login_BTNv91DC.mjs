import { n as __exportAll, t as createComponent } from "./compiler_BZ5cquMV.mjs";
import { h as renderHead, u as renderTemplate } from "./server_BzieqcK4.mjs";
import { t as renderScript } from "./global_3I2OSXCC.mjs";
//#region src/pages/admin/login.astro
var login_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Login,
	file: () => $$file,
	url: () => $$url
});
var $$Login = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Yönetici Girişi | Samet Can Tulum</title>${renderHead($$result)}</head><body class="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans"><div class="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8"><div class="text-center mb-8"><h1 class="text-2xl font-bold tracking-tight text-white">Yönetici Paneli</h1><p class="text-sm text-slate-400 mt-2">Devam etmek için e-posta ve şifrenizle giriş yapın.</p></div><form id="loginForm" class="space-y-5"><div id="errorMessage" class="hidden p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"></div><div><label for="email" class="block text-sm font-medium text-slate-300 mb-2">E-Posta Adresi</label><input type="email" id="email" required placeholder="Kullanıcı Adı" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"></div><div><label for="password" class="block text-sm font-medium text-slate-300 mb-2">Şifre</label><input type="password" id="password" required placeholder="••••••••" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"></div><button type="submit" id="submitBtn" class="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 flex items-center justify-center cursor-pointer">Giriş Yap</button></form></div>${renderScript($$result, "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/pages/admin/login.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/pages/admin/login.astro", void 0);
var $$file = "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/pages/admin/login.astro";
var $$url = "/admin/login";
//#endregion
//#region \0virtual:astro:page:src/pages/admin/login@_@astro
var page = () => login_exports;
//#endregion
export { page };
