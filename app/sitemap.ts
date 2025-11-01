import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { listFormations } from '@/lib/server/formations';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.nostress.ai';
  const staticPages = [
    '',
    '/approach',
    '/blog',
    '/courses',
    '/videos',
    '/resources',
    '/about',
    '/contact',
    '/interactive/burnout-epidemic',
    '/interactive/resilient-child',
    '/interactive/research-brief'
  ];

  const [posts, formations] = await Promise.all([getAllPosts(), listFormations()]);
  const postUrls = posts.map((p) => `/blog/${p.slug}`);
  const formationUrls = formations.map((f) => `/courses/${f.slug}`);
  const now = new Date().toISOString();

  return [...staticPages, ...postUrls, ...formationUrls].map((u) => ({ url: base + u, lastModified: now }));
}
