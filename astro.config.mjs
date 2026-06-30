// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with the real production domain before deploying —
  // this powers canonical URLs, sitemap.xml and Open Graph tags.
  site: 'https://vintagehall.example',
  vite: {
    plugins: [tailwindcss()],
  },
});
