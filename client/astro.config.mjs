import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://sametcantulum.com.tr',
  output: 'server',
  adapter: vercel(),
  integrations: [
    sitemap({
      // SSR projelerinde sitemap'in doğru URL'lerle taranabilmesi için ek yapılandırma
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    })
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});