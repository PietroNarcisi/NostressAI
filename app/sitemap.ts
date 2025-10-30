import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { formations } from '@/lib/formations';

export default function sitemap(): MetadataRoute.Sitemap {
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
  const posts = getAllPosts().map((p) => `/blog/${p.slug}`);
  const forms = formations.map((f) => `/courses/${f.slug}`);
  const now = new Date().toISOString();
  return [...staticPages, ...posts, ...forms].map((u) => ({ url: base + u, lastModified: now }));
}
