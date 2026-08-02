import { n as __exportAll, t as createComponent } from "./compiler_BZ5cquMV.mjs";
import { T as createAstro, g as addAttribute, i as renderComponent, m as maybeRenderHead, u as renderTemplate } from "./server_BzieqcK4.mjs";
import { t as $$Layout } from "./Layout_DKYPyp_h.mjs";
import { n as fetchPostBySlug } from "./api_B7oby0qh.mjs";
//#region src/pages/yayinlar/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://sametcantulum.com.tr");
var $$Slug = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	const { slug } = Astro.params;
	let post = null;
	let error = null;
	try {
		if (slug) post = await fetchPostBySlug(slug);
		else error = "Geçersiz yazı bağlantısı (Slug bulunamadı).";
	} catch (err) {
		console.error("Yazı detayı çekilirken hata:", err);
		error = err.message || `Backend sunucusundan yazı çekilemedi. Aranan slug: "${slug}"`;
	}
	function getCategoryLabel(categoryKey) {
		switch (categoryKey?.toLowerCase()) {
			case "mevzuat": return {
				title: "⚖️ Mevzuat & Resmi Yazılar",
				style: "bg-amber-50 text-amber-700 border-amber-200"
			};
			case "makaleler":
			case "makale": return {
				title: "📝 Makale",
				style: "bg-blue-50 text-blue-700 border-blue-200"
			};
			case "blog": return {
				title: "💡 Blog & Sektörel Yorum",
				style: "bg-emerald-50 text-emerald-700 border-emerald-200"
			};
			default: return {
				title: categoryKey || "Genel",
				style: "bg-slate-100 text-slate-700 border-slate-200"
			};
		}
	}
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": post ? `${post.title} | Samet Can Tulum - SMMM` : "Yazı Bulunamadı" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main class="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8"><div class="max-w-4xl mx-auto space-y-8"><!-- Geri Dön Butonu --><div><a href="/yayinlar" class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"><span>←</span> Tüm İçeriklere Dön</a></div><!-- Hata Bildirim Alanı -->${error && renderTemplate`<div class="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 max-w-xl mx-auto text-center space-y-3 shadow-sm"><p class="font-bold text-lg">⚠️ Makale Yüklenemedi</p><p class="text-sm">${error}</p><div class="bg-slate-100 p-3 rounded-lg text-xs font-mono text-slate-700 inline-block text-left border border-slate-200"><p><strong>Aranan Slug:</strong> ${slug}</p></div></div>`}<!-- Makale Detayı -->${post && renderTemplate`<article class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8"><header class="space-y-4 border-b border-slate-100 pb-8"><div class="flex items-center gap-3 text-xs"><span${addAttribute(`px-3 py-1 font-bold rounded-lg border ${getCategoryLabel(post.category).style}`, "class")}>${getCategoryLabel(post.category).title}</span><time class="text-slate-400 font-medium">${post.created_at ? new Date(post.created_at).toLocaleDateString("tr-TR", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}) : ""}</time></div><h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">${post.title}</h1>${post.excerpt && renderTemplate`<p class="text-base sm:text-lg text-slate-600 font-normal leading-relaxed italic bg-emerald-50/50 p-5 rounded-xl border-l-4 border-emerald-600">${post.excerpt}</p>`}</header><!-- İçerik Metni (Açık Tema ve Okunabilir Propose Yapısı) --><div class="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 whitespace-pre-line text-base sm:text-lg">${post.content}</div></article>`}</div></main>` })}`;
}, "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/pages/yayinlar/[slug].astro", void 0);
var $$file = "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/pages/yayinlar/[slug].astro";
var $$url = "/yayinlar/[slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/yayinlar/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };
