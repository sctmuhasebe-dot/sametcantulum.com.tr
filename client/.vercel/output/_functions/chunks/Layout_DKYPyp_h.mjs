import { t as createComponent } from "./compiler_BZ5cquMV.mjs";
import { T as createAstro, g as addAttribute, h as renderHead, i as renderComponent, m as maybeRenderHead, s as renderSlot, u as renderTemplate } from "./server_BzieqcK4.mjs";
import { t as renderScript } from "./global_3I2OSXCC.mjs";
//#region src/components/common/Navbar.astro
var $$Navbar = createComponent(($$result, $$props, $$slots) => {
	const menuGroups = [
		{
			label: "Hizmetlerimiz",
			href: "/hizmetler",
			items: [
				{
					href: "/hizmetler/mali-musavirlik",
					icon: "📊",
					title: "Mali Müşavirlik ve Muhasebe"
				},
				{
					href: "/hizmetler/vergi-danismanligi",
					icon: "⚖️",
					title: "Vergi Müşavirliği ve Mevzuat"
				},
				{
					href: "/hizmetler/sirket-kurulusu",
					icon: "🏢",
					title: "Ticaret Sicil & Şirket Kuruluşu"
				},
				{
					href: "/hizmetler/kdv-iadesi",
					icon: "💶",
					title: "KDV İadesi Danışmanlığı"
				}
			]
		},
		{
			label: "Sektörel Çözümler",
			href: "/sektorel-cozumler",
			items: [
				{
					href: "/sektorel-cozumler/e-ticaret-ve-pazaryerleri",
					icon: "🛒",
					title: "E-Ticaret & Pazaryerleri"
				},
				{
					href: "/sektorel-cozumler/yazilim-ve-teknoloji",
					icon: "💻",
					title: "Yazılım & Teknoloji Şirketleri"
				},
				{
					href: "/sektorel-cozumler/insaat-ve-gayrimenkul",
					icon: "🏗️",
					title: "İnşaat & Gayrimenkul"
				},
				{
					href: "/sektorel-cozumler/turizm-ve-otelcilik",
					icon: "🏨",
					title: "Turizm & Konaklama"
				}
			]
		},
		{
			label: "Pratik Araçlar",
			href: "/pratik-araclar",
			items: [
				{
					href: "/pratik-araclar/resmi-gazete",
					icon: "📰",
					title: "Resmi Gazete"
				},
				{
					href: "/pratik-araclar/net-brut-maas",
					icon: "🧮",
					title: "Net - Brüt Maaş"
				},
				{
					href: "/pratik-araclar/kidem-ihbar-tazminati",
					icon: "📜",
					title: "Kıdem ve İhbar Tazminatı"
				},
				{
					href: "/pratik-araclar/gecikme-zammi",
					icon: "⏱️",
					title: "Vergi Gecikme Zammı"
				}
			]
		},
		{
			label: "Yayinlar",
			href: "/yayinlar",
			items: [
				{
					href: "/yayinlar/kategori/mevzuat",
					icon: "⚖️",
					title: "Mevzuat & Resmi Yazılar"
				},
				{
					href: "/yayinlar/kategori/makaleler",
					icon: "📝",
					title: "Makaleler"
				},
				{
					href: "/yayinlar/kategori/blog",
					icon: "💡",
					title: "Blog & Sektörel Yorumlar"
				}
			]
		}
	];
	return renderTemplate`${maybeRenderHead($$result)}<header class="bg-ink-900 border-b border-ink-800 text-white sticky top-0 z-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-16"><!-- Logo / Marka --><a href="/" class="flex items-center gap-3.5 group shrink-0"><!-- Görsel Logo Kutusu (Açık arka plan + Parlak efekt) --><div class="h-10 w-10 rounded-xl bg-white/90 border border-white/20 p-1 flex items-center justify-center shadow-md shadow-brand-500/10 group-hover:bg-white group-hover:scale-105 transition-all shrink-0 overflow-hidden"><img src="/images/logo.png" alt="SMMM Samet Can Tulum Logo" class="h-full w-full object-contain filter brightness-90 contrast-125 group-hover:brightness-100 transition-all"></div><div class="flex flex-col"><span class="font-bold text-base tracking-tight leading-none text-white group-hover:text-brand-400 transition-colors">Samet Can Tulum</span><span class="text-[10px] text-ink-400 font-medium tracking-wider uppercase mt-1">Serbest Muhasebeci Mali Müşavir</span></div></a><!-- Masaüstü Navigasyon Menüsü --><nav class="hidden lg:flex items-center gap-6 text-sm font-medium"><a href="/" class="text-ink-300 hover:text-white transition-colors">Ana Sayfa</a><a href="/hakkimda" class="text-ink-300 hover:text-white transition-colors">Hakkımda</a>${menuGroups.map((group) => renderTemplate`<div class="relative group py-5"><a${addAttribute(group.href, "href")} class="flex items-center gap-1.5 text-ink-300 hover:text-white transition-colors"><span>${group.label}</span><span class="text-[10px] opacity-70 group-hover:rotate-180 transition-transform duration-200">▼</span></a><!-- Dropdown Menü Kutusu --><div class="absolute left-0 top-full pt-1 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50"><div class="bg-white rounded-2xl shadow-2xl border border-ink-100 p-2 text-ink-800 space-y-1">${group.items.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-brand-50 text-ink-700 hover:text-brand-700 transition-colors"><span class="text-sm shrink-0">${item.icon}</span><span>${item.title}</span></a>`)}</div></div></div>`)}<a href="/iletisim" class="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold transition-colors shadow-sm text-xs shrink-0">İletişim</a></nav><!-- Mobil: Hamburger Buton (lg altı) --><button id="mobile-menu-button" type="button" class="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-ink-200 hover:bg-ink-800 transition-colors" aria-expanded="false" aria-controls="mobile-menu" aria-label="Menüyü aç/kapat"><svg id="icon-open" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg><svg id="icon-close" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div></div><!-- Mobil Menü Paneli --><div id="mobile-menu" class="lg:hidden hidden border-t border-ink-800 bg-ink-900 max-h-[calc(100vh-4rem)] overflow-y-auto"><div class="px-4 py-4 space-y-1"><a href="/" class="block px-3 py-3 rounded-xl text-sm font-semibold text-ink-200 hover:bg-ink-800 hover:text-white transition-colors">Ana Sayfa</a><a href="/hakkimda" class="block px-3 py-3 rounded-xl text-sm font-semibold text-ink-200 hover:bg-ink-800 hover:text-white transition-colors">Hakkımda</a>${menuGroups.map((group, i) => renderTemplate`<div class="border-t border-ink-800/60 pt-1 mt-1 first:border-0 first:mt-0 first:pt-0"><button type="button" class="mobile-accordion-trigger w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-ink-200 hover:bg-ink-800 hover:text-white transition-colors" aria-expanded="false"${addAttribute(`mobile-submenu-${i}`, "aria-controls")}><span>${group.label}</span><svg class="w-4 h-4 transition-transform duration-200 origin-center accordion-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button><div${addAttribute(`mobile-submenu-${i}`, "id")} class="mobile-submenu hidden pl-3 pb-1 space-y-0.5">${group.items.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-ink-300 hover:bg-ink-800 hover:text-white transition-colors"><span class="text-sm shrink-0">${item.icon}</span><span>${item.title}</span></a>`)}</div></div>`)}<a href="/iletisim" class="block mt-4 px-4 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold text-center transition-colors shadow-sm text-sm">İletişim</a></div></div></header>${renderScript($$result, "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/components/common/Navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/components/common/Navbar.astro", void 0);
//#endregion
//#region src/components/common/CookieBanner.astro
var $$CookieBanner = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div id="cookie-banner" class="fixed bottom-0 left-0 right-0 w-full bg-slate-900/95 backdrop-blur-md text-white p-4 md:px-8 border-t border-slate-800/80 shadow-2xl z-50 hidden transition-all duration-300"><div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"><!-- Sol/Açıklama Tarafı --><div class="flex items-center gap-3 text-center md:text-left"><span class="text-xl shrink-0 hidden sm:inline">🍪</span><p class="text-slate-300 text-xs md:text-sm leading-relaxed">Sitemizde deneyiminizi iyileştirmek, performans analizi yapmak ve ziyaretçi istatistiklerini takip edebilmek amacıyla teknik çerezler kullanılmaktadır. Detaylı bilgi için<a href="/cerez-politikasi" class="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors font-medium">Çerez Politikası</a> ve<a href="/kvkk-aydinlatma-metni" class="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors font-medium">KVKK Aydınlatma Metni</a>’ni inceleyebilirsiniz.</p></div><!-- Sağ/Butonlar Tarafı --><div class="flex items-center gap-3 shrink-0"><button id="decline-cookies" class="text-slate-400 hover:text-white px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer">Reddet</button><button id="accept-cookies" class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-colors duration-200 shadow-md shadow-blue-600/20 cursor-pointer whitespace-nowrap">Kabul Et</button></div></div></div>${renderScript($$result, "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/components/common/CookieBanner.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/components/common/CookieBanner.astro", void 0);
//#endregion
//#region src/layouts/Layout.astro
createAstro("https://sametcantulum.com.tr");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title = "Samet Can Tulum | Serbest Muhasebeci Mali Müşavir", description = "Mali müşavirlik, vergi danışmanlığı, defter tutma ve finansal süreçleriniz için profesyonel çözümler.", image = "/og-image.jpg", canonicalURL = Astro.url.href } = Astro.props;
	return renderTemplate`<html lang="tr" class="scroll-smooth"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.png"><meta name="generator"${addAttribute(Astro.generator, "content")}><!-- Google Search Console Doğrulama Etiketi --><meta name="google-site-verification" content="iIJXAI_oQx52LveBdBOO7rOlgKkD36K-O0Usx1CLrSk"><!-- SEO Meta Etiketleri --><title>${title}</title><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonicalURL, "href")}><!-- Open Graph / Sosyal Medya Paylaşım Etiketleri --><meta property="og:type" content="website"><meta property="og:url"${addAttribute(canonicalURL, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(new URL(image, Astro.site), "content")}><meta property="og:locale" content="tr_TR"><!-- Twitter Card --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(new URL(image, Astro.site), "content")}><!-- Google Fonts (Inter) --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"><!-- Google Analytics (GA4) & Çerez İzin Yönetimi --><script>
      // Google Analytics Yükleme Fonksiyonu
      function loadGoogleAnalytics(trackingId) {
        if (window.gaLoaded) return;
        window.gaLoaded = true;

        const script = document.createElement('script');
        script.async = true;
        script.src = \`https://www.googletagmanager.com/gtag/js?id=\${trackingId}\`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        window.gtag = gtag;
        
        gtag('js', new Date());
        gtag('config', trackingId);
      }

      // Google Analytics Ölçüm Kimliği
      const GA_TRACKING_ID = 'G-6HD4056JVK'; 

      // 1. Sayfa yüklendiğinde çerez tercihi önceden kabul edilmişse çalıştır
      const consent = localStorage.getItem('cookie_consent');
      if (consent === 'accepted') {
        loadGoogleAnalytics(GA_TRACKING_ID);
      }

      // 2. Kullanıcı çerez bandında "Kabul Et" butonuna bastığı anı anlık yakala
      window.addEventListener('storage', (e) => {
        if (e.key === 'cookie_consent' && e.newValue === 'accepted') {
          loadGoogleAnalytics(GA_TRACKING_ID);
        }
      });
    <\/script>${renderHead($$result)}</head><body class="bg-ink-50 text-ink-900 font-sans min-h-screen flex flex-col"><!-- Navigasyon Barı -->${renderComponent($$result, "Navbar", $$Navbar, {})}<!-- Ana İçerik Alanı --><main class="flex-grow">${renderSlot($$result, $$slots["default"])}</main><!-- Alt Bilgi / Footer --><footer class="bg-ink-900 text-ink-300 mt-20"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14"><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"><!-- Marka & Logo Alanı --><div class="lg:col-span-2 space-y-3"><a href="/" class="flex items-center gap-3.5 group shrink-0 inline-flex"><!-- Navbar ile Birebir Uyumlu Logo Kutusu --><div class="h-10 w-10 rounded-xl bg-white/90 border border-white/20 p-1 flex items-center justify-center shadow-md shadow-brand-500/10 group-hover:bg-white group-hover:scale-105 transition-all shrink-0 overflow-hidden"><img src="/images/logo.png" alt="SMMM Samet Can Tulum Logo" class="h-full w-full object-contain filter brightness-90 contrast-125 group-hover:brightness-100 transition-all"></div><!-- İsim ve Unvan --><div class="flex flex-col"><span class="font-bold text-base tracking-tight leading-none text-white group-hover:text-emerald-400 transition-colors">Samet Can Tulum</span><span class="text-[10px] text-ink-400 font-medium tracking-wider uppercase mt-1">Serbest Muhasebeci Mali Müşavir</span></div></a><p class="text-sm text-ink-400 max-w-sm leading-relaxed pt-1">Mali müşavirlik, vergi danışmanlığı ve dijital finansal süreçlerde güncel mevzuata uygun, güvenilir danışmanlık hizmeti.</p></div><!-- Hızlı Linkler --><div><h3 class="text-white font-semibold text-sm mb-4">Kurumsal</h3><ul class="space-y-2.5 text-sm"><li><a href="/hakkimda" class="hover:text-brand-400 transition-colors">Hakkımda</a></li><li><a href="/hizmetler" class="hover:text-brand-400 transition-colors">Hizmetlerimiz</a></li><li><a href="/sektorel-cozumler" class="hover:text-brand-400 transition-colors">Sektörel Çözümler</a></li><li><a href="/yayinlar" class="hover:text-brand-400 transition-colors">Yayınlar</a></li><li><a href="/kvkk-aydinlatma-metni" class="hover:text-brand-400 transition-colors">KVKK Aydınlatma Metni</a></li></ul></div><!-- İletişim --><div><h3 class="text-white font-semibold text-sm mb-4">İletişim</h3><ul class="space-y-2.5 text-sm"><li><a href="/iletisim" class="hover:text-brand-400 transition-colors">Bize Ulaşın</a></li><li><a href="tel:+905427846260" class="hover:text-brand-400 transition-colors">+90 (542) 784 62 60</a></li><li><a href="mailto:info@sametcantulum.com.tr" class="hover:text-brand-400 transition-colors">info@sametcantulum.com.tr</a></li><li class="text-ink-500">Antalya, Türkiye</li></ul></div></div><div class="mt-12 pt-6 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-500"><p>© ${(/* @__PURE__ */ new Date()).getFullYear()} Samet Can Tulum — Tüm hakları saklıdır.</p><p>Mali Müşavirlik ve Danışmanlık Hizmetleri</p></div></div></footer><!-- Çerez Bildirim Bandı -->${renderComponent($$result, "CookieBanner", $$CookieBanner, {})}</body></html>`;
}, "C:/Users/samet/OneDrive/Masaüstü/sametcantulum.com.tr/client/src/layouts/Layout.astro", void 0);
//#endregion
export { $$Layout as t };
