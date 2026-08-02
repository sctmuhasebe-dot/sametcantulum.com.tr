import { n as __exportAll, t as createComponent } from "./compiler_BZ5cquMV.mjs";
import { g as addAttribute, i as renderComponent, m as maybeRenderHead, u as renderTemplate } from "./server_BzieqcK4.mjs";
import { t as $$Layout } from "./Layout_DKYPyp_h.mjs";
import { r as fetchPosts } from "./api_B7oby0qh.mjs";
//#region src/pages/yayinlar/index.astro
var yayinlar_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	let posts = [];
	let error = null;
	try {
		posts = await fetchPosts();
	} catch (err) {
		console.error("API İsteği Başarısız:", err);
		error = err.message || "Veri servisiyle bağlantı kurulamadı.";
	}
	function getCategoryLabel(categoryKey) {
		switch (categoryKey?.toLowerCase()) {
			case "mevzuat": return {
				title: "⚖️ Mevzuat",
				style: "bg-amber-50 text-amber-700 border-amber-200"
			};
			case "makaleler":
			case "makale": return {
				title: "📝 Makale",
				style: "bg-blue-50 text-blue-700 border-blue-200"
			};
			case "blog": return {
				title: "💡 Blog",
				style: "bg-emerald-50 text-emerald-700 border-emerald-200"
			};
			default: return {
				title: categoryKey || "Genel",
				style: "bg-slate-100 text-slate-700 border-slate-200"
			};
		}
	}
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Yayınlar & Güncel Mevzuat | Samet Can Tulum - SMMM" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main class="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8"><div class="max-w-6xl mx-auto space-y-10"><!-- Başlık Alanı --><div class="bg-white rounded-2xl border border-slate-200 p-8 lg:p-12 shadow-sm text-center max-w-3xl mx-auto space-y-4"><span class="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full uppercase tracking-wider">Bilgi Merkezi</span><h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Mevzuat, Makaleler ve Güncel Yorumlar</h1><p class="text-slate-600 text-base sm:text-lg">Vergi mevzuatı, SGK uygulamaları ve finansal yönetime dair en son güncellemeler.</p></div><!-- Hata Uyarısı -->${error && renderTemplate`<div class="bg-red-50 text-red-700 p-6 rounded-2xl text-center max-w-xl mx-auto border border-red-200 shadow-sm"><p class="font-bold mb-1">⚠️ Bağlantı Uyarısı</p><p class="text-sm">${error}</p></div>`}<!-- Henüz İçerik Yoksa -->${Array.isArray(posts) && posts.length === 0 && !error && renderTemplate`<div class="text-center text-slate-500 py-16 bg-white rounded-2xl border border-slate-200 max-w-xl mx-auto space-y-2 shadow-sm"><p class="text-lg font-bold text-slate-900">Henüz yayınlanmış bir yazı bulunmuyor.</p><p class="text-sm text-slate-400">Admin panelinden yeni bir içerik eklediğinizde burada görünecektir.</p></div>`}<!-- İçerik Listesi -->${Array.isArray(posts) && posts.length > 0 && renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${posts.map((post) => {
		const catInfo = getCategoryLabel(post.category);
		return renderTemplate`<article class="bg-white hover:border-emerald-500 border border-slate-200 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md group"><div class="space-y-4"><div class="flex items-center justify-between text-xs"><span${addAttribute(`px-2.5 py-1 font-bold rounded-lg border ${catInfo.style}`, "class")}>${catInfo.title}</span><time class="text-slate-400 font-medium">${post.created_at ? new Date(post.created_at).toLocaleDateString("tr-TR", {
			day: "numeric",
			month: "long",
			year: "numeric"
		}) : ""}</time></div><h2 class="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug"><a${addAttribute(`/yayinlar/${post.slug}`, "href")}>${post.title}</a></h2><p class="text-slate-600 text-sm line-clamp-3 leading-relaxed">${post.excerpt || (post.content ? post.content.substring(0, 120) + "..." : "")}</p></div><div class="pt-6 mt-4 border-t border-slate-100 flex justify-between items-center"><a${addAttribute(`/yayinlar/${post.slug}`, "href")} class="inline-flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group-hover:translate-x-1 duration-200">Devamını Oku<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a></div></article>`;
	})}</div>`}</div></main>` })}`;
}, "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/pages/yayinlar/index.astro", void 0);
var $$file = "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/pages/yayinlar/index.astro";
var $$url = "/yayinlar";
//#endregion
//#region \0virtual:astro:page:src/pages/yayinlar/index@_@astro
var page = () => yayinlar_exports;
//#endregion
export { page };
