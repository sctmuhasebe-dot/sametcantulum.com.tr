import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';
// Eğer pratik araçları da dinamik eklemek isterseniz buraya import edebilirsiniz:
// import { pratikAraclarListesi } from '../data/pratikAraclar';

// KRİTİK: Bu route'u SSR (dinamik) yapıyoruz. output:'static' ortamında
// prerender belirtilmezse bu dosya BUILD ANINDA bir kez oluşturulup
// dondurulur; yeni yazılar sitemap'e hiç girmez, silinen yazılar ise
// GSC'de "Bulunamadı (404)" olarak birikir. prerender=false ile her
// istekte Supabase'deki güncel veri baz alınır (yayinlar/index.astro
// ve [slug].astro ile aynı davranış).
export const prerender = false;

export const GET: APIRoute = async () => {
  const siteUrl = 'https://www.sametcantulum.com.tr';
  const currentDate = new Date().toISOString().split('T')[0];

  // 1. SUPABASE'DEN DİNAMİK YAZILARI ÇEKİYORUZ
  const { data: posts, error } = await supabase
    .from('posts')
    .select('slug, updated_at');

  if (error) {
    console.error('Sitemap blog verileri çekilemedi:', error.message);
  }
  // slug'ı boş/null olan kayıtları eliyoruz — aksi halde
  // ".../yayinlar/undefined" veya ".../yayinlar/" gibi çöp URL'ler
  // sitemap'e (ve dolayısıyla Google indeksine) girebiliyordu.
  const postList = (posts || []).filter(
    (p): p is { slug: string; updated_at: string | null } =>
      typeof p.slug === 'string' && p.slug.trim().length > 0
  );

  // YASAL VE NOINDEX OLAN SAYFALARIN LİSTESİ (Sitemap'e girmeyecek)
  const excludedPages = [
    'kvkk-aydinlatma-metni',
    'acik-riza-metni',
    'taahhutname',
    'cerez-politikasi'
  ];

  // 2. SRC/PAGES DİZİNİNDEKİ TÜM .ASTRO SAYFALARINI OTOMATİK TARIYORUZ
  const pageFiles = import.meta.glob('./**/*.astro');
  
  const staticPages = Object.keys(pageFiles)
    .map((filePath) => {
      let route = filePath
        .replace('./', '')
        .replace('.astro', '');
      
      if (route === 'index') return '';
      route = route.replace(/\/index$/, '');
      return route;
    })
    .filter((route) => {
      // Admin paneli, dinamik rotalar ([slug]), 404, API uç noktaları 
      // VE noindex olan yasal sayfaları hariç tutuyoruz
      if (
        route.startsWith('admin') || 
        route.includes('[') || 
        route === '404' ||
        route.includes('api/') ||
        excludedPages.includes(route) // <-- BURASI EKLENDİ
      ) {
        return false;
      }
      return true;
    });

  // 3. (İsteğe Bağlı) MERKEZİ VERİLERDEN (Örn: pratikAraclar) DİNAMİK ROTALAR ÜRETME
  // Tüm statik sayfaları ve varsa ek rotaları birleştiriyoruz
  const allStaticPages = [...new Set([...staticPages])];

  // 4. XML İÇERİĞİNİ DİNAMİK OLARAK BİRLEŞTİRİYORUZ
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allStaticPages.map(page => `
  <url>
    <loc>${siteUrl}${page ? `/${page}` : ''}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.7'}</priority>
  </url>`).join('')}
  
  ${postList.map(post => `
  <url>
    <loc>${siteUrl}/yayinlar/${post.slug}</loc>
    <lastmod>${post.updated_at ? new Date(post.updated_at).toISOString().split('T')[0] : currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400' 
    }
  });
};