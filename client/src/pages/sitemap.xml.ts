import type { APIRoute } from 'astro';
import { supabase } from '../lib/supabase';

export const GET: APIRoute = async () => {
  const siteUrl = 'https://www.sametcantulum.com.tr';
  
  // 1. Tablonuzdan slug ve updated_at değerlerini çekiyoruz
  const { data: posts, error } = await supabase
    .from('posts')
    .select('slug, updated_at');

  if (error) {
    console.error('Sitemap verileri çekilemedi:', error.message);
  }

  const postList = posts || [];

  // 2. Statik sayfalarınız
  const staticPages = [
    '',
    'hakkimda',
    'hizmetler',
    'hizmetler/mali-musavirlik',
    'iletisim',
    'yayinlar'
  ];

  // 3. XML oluşturma
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