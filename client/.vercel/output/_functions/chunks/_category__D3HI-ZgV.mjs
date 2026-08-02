import { n as __exportAll, t as createComponent } from "./compiler_BZ5cquMV.mjs";
import { T as createAstro, g as addAttribute, i as renderComponent, m as maybeRenderHead, u as renderTemplate } from "./server_BzieqcK4.mjs";
import { t as $$Layout } from "./Layout_DKYPyp_h.mjs";
import { i as getPosts } from "./api_B7oby0qh.mjs";
//#region src/pages/yayinlar/kategori/[category].astro
var _category__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Category,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://sametcantulum.com.tr");
var $$Category = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Category;
	const { category } = Astro.params;
	let posts = [];
	let error = null;
	try {
		const allPosts = await getPosts();
		const currentCategorySlug = category?.toLowerCase() || "";
		posts = allPosts.filter((post) => {
			const postCat = post.category?.toLowerCase() || "";
			if (currentCategorySlug === "mevzuat") return postCat === "mevzuat";
			return postCat === currentCategorySlug;
		});
	} catch (err) {
		console.error("Kategori yazıları çekilirken hata:", err);
		error = err.message || "Yazılar yüklenirken bir sorun oluştu.";
	}
	function getCategoryDetails(key) {
		switch (key.toLowerCase()) {
			case "mevzuat": return {
				title: "⚖️ Mevzuat & Resmi Yazılar",
				desc: "Güncel vergi, SGK ve ticaret mevzuatı duyuruları."
			};
			case "makaleler": return {
				title: "📝 Makaleler",
				desc: "Sektörel incelemeler ve teknik makaleler."
			};
			case "blog": return {
				title: "💡 Blog & Yorumlar",
				desc: "Mali gündem ve finansal değerlendirmeler."
			};
			default: return {
				title: key ? key.replace(/-/g, " ").toUpperCase() : "Kategori",
				desc: "İlgili kategorideki tüm içerikler."
			};
		}
	}
	const currentCat = getCategoryDetails(category || "");
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${currentCat.title} | Samet Can Tulum - SMMM` }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main class="bg-slate-50 min-h-screen py-12 lg:py-16"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10"><!-- Başlık ve Geri Dönüş Alanı --><div class="bg-white rounded-2xl border border-slate-200 p-8 lg:p-12 shadow-sm space-y-4"><a href="/yayinlar" class="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1">← Tüm Yayınlara Dön</a><h1 class="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">${currentCat.title}</h1><p class="text-slate-600 text-base max-w-3xl">${currentCat.desc}</p></div><!-- Hata Uyarısı -->${error && renderTemplate`<div class="bg-red-50 text-red-700 p-6 rounded-2xl text-center max-w-xl mx-auto border border-red-200 shadow-sm"><p class="font-bold mb-1">⚠️ Bağlantı Uyarısı</p><p class="text-sm">${error}</p></div>`}<!-- Yazı Bulunamadıysa -->${posts.length === 0 && !error && renderTemplate`<div class="text-center text-slate-500 py-16 bg-white rounded-2xl border border-slate-200 max-w-xl mx-auto space-y-2 shadow-sm"><p class="text-lg font-bold text-slate-900">Bu kategoride henüz yayınlanmış yazı bulunmuyor.</p></div>`}<!-- İçerik Kartları -->${posts.length > 0 && renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${posts.map((post) => renderTemplate`<article class="bg-white hover:border-emerald-500 border border-slate-200 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md group"><div class="space-y-4"><div class="flex items-center justify-between text-xs"><span class="px-3 py-1 font-bold rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-100">${currentCat.title.replace(/[\u{1F000}-\u{1F9FF}]/gu, "").trim()}</span><time class="text-slate-400 font-medium">${post.created_at ? new Date(post.created_at).toLocaleDateString("tr-TR", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}) : ""}</time></div><h2 class="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug"><a${addAttribute(`/yayinlar/${post.slug}`, "href")}>${post.title}</a></h2><p class="text-slate-600 text-sm line-clamp-3 leading-relaxed">${post.excerpt || (post.content ? post.content.substring(0, 120) + "..." : "")}</p></div><div class="pt-6 mt-4 border-t border-slate-100 flex justify-between items-center"><a${addAttribute(`/yayinlar/${post.slug}`, "href")} class="inline-flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group-hover:translate-x-1 duration-200 gap-1"><span>Devamını Oku</span><span>→</span></a></div></article>`)}</div>`}</div></main>` })}`;
}, "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/pages/yayinlar/kategori/[category].astro", void 0);
var $$file = "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/pages/yayinlar/kategori/[category].astro";
var $$url = "/yayinlar/kategori/[category]";
//#endregion
//#region \0virtual:astro:page:src/pages/yayinlar/kategori/[category]@_@astro
var page = () => _category__exports;
//#endregion
export { page };
