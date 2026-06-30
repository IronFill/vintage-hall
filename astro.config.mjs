// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://vintage-hall.vercel.app',
  integrations: [
    sitemap(),
    partytown({ config: { forward: ['dataLayer.push'] } }),
    mdx(),
  ],
  image: {
    // Встроенная оптимизация изображений Astro (использует sharp)
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
