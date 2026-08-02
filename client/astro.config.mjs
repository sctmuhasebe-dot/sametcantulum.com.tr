import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://sametcantulum.com.tr',
  output: 'static', // Statik moda aldık
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});