import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.sametcantulum.com.tr',
  // Astro'nun güncel sürümünde 'hybrid' kaldırıldığı için 'static' kullanıyoruz.
  // Bu ayar, sayfa bazlı SSR (prerender = false) kullanımını zaten destekler.
  output: 'static', 
  adapter: vercel(),
  trailingSlash: 'never',
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
});