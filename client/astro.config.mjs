import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.sametcantulum.com.tr',
  output: 'server',
  adapter: vercel(),
  integrations: [
    // Eski statik sitemap eklentisi kaldırıldı. 
    // Artık dinamik sitemap.xml endpoint'imiz devrede.
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});