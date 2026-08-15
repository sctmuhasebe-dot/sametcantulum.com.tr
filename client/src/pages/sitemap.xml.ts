import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';

export const GET: APIRoute = async () => {
  const siteUrl = 'https://www.sametcantulum.com.tr';
  
  // 1. Supabase veritabanından blog yazılarını çekiyoruz
  const { data: posts, error } = await supabase
    .from('posts')
    .select('slug, updated_at');

  if (error) {
    console.error('Sitemap verileri çekilemedi:', error.message);
  }

  const postList = posts || [];

  // 2. src/pages dizinindeki tüm .astro dosyalarını otomatik tarıyoruz
  const pageFiles = import.meta.glob('./**/*.astro');
  
  const staticPages = Object.keys(pageFiles)
    .map((filePath) => {
      let route = filePath
        .replace('./', '')
        .replace('.astro', '');
      
      if (route === 'index') return '';
      return route;
    })
    .filter((route) => {
      // Admin paneli, dinamik rotalar, 404 ve API uç noktalarını sitemap dışı bırakıyoruz
      if (
        route.startsWith('admin') || 
        route.includes('[') || 
        route === '404' ||
        route.includes('api/')
      ) {
        return false;
      }
      return true;
    });

  // 3. XML içeriğini dinamik olarak oluşturuyoruz
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${siteUrl}/${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  
  ${postList.map(post => `
  <url>
    <loc>${siteUrl}/yayinlar/${post.slug}</loc>
    <lastmod>${post.updated_at ? new Date(post.updated_at).toISOString() : new Date().toISOString()}</lastmod>
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