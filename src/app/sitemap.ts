import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.truerateliberia.com';

// Top-level routes that exist in src/app. Add new ones here when sections ship.
const routes = [
  '',
  '/markets',
  '/economy',
  '/small-business',
  '/technology',
  '/sports',
  '/entertainment',
  '/videos',
  '/watchlist',
  '/news',
  '/about',
  '/help',
  '/feedback',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'hourly' : 'daily',
    priority: path === '' ? 1 : 0.7,
  }));
}
