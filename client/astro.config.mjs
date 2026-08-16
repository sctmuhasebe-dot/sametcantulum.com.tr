import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.sametcantulum.com.tr',
  // SSR'dan Hibrit modele geçiyoruz: Statik sayfalar hızlanacak, 
  // dinamik olanlar sunucuda çalışmaya devam edecek.
  output: 'hybrid', 
  adapter: vercel(),
  // URL tutarlılığı için trailingSlash ayarını burada sabitliyoruz.
  trailingSlash: 'never',
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
});