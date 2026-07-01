import type { APIRoute } from 'astro';
import { SEEDED_PRODUCTS, SELLERS } from '../data/products';

const SITE = (import.meta.env.SITE ?? 'https://vintage-hall.vercel.app').replace(/\/$/, '');

const staticRoutes = ['', 'about', 'delivery', 'forum', 'news', 'rules', 'catalog', 'expertise', 'guarantee', 'contacts'];

export const GET: APIRoute = () => {
  const categories = Array.from(new Set(SEEDED_PRODUCTS.map(p => p.category)));
  const urls = [
    ...staticRoutes.map(r => `  <url><loc>${SITE}/${r}</loc></url>`),
    ...SEEDED_PRODUCTS.map(p => `  <url><loc>${SITE}/lot/${p.id}</loc></url>`),
    ...categories.map(c => `  <url><loc>${SITE}/category/${c}</loc></url>`),
    ...Object.keys(SELLERS).map(name => `  <url><loc>${SITE}/seller/${encodeURIComponent(name)}</loc></url>`),
  ].join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
