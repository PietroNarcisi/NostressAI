import fs from 'fs';
import path from 'path';
import { BlogMeta, HolisticPillar } from '@/lib/types';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export function getAllPosts(): BlogMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
      const match = raw.match(/^---[\r\n]+([\s\S]*?)---/);
      let meta: Partial<BlogMeta> = {};
      if (match) {
        match[1]
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean)
          .forEach((line) => {
            const [k, ...rest] = line.split(':');
            const key = k.trim();
            const value = rest.join(':').trim();
            if (key === 'title') meta.title = value.replace(/^"|"$/g, '');
            else if (key === 'date') meta.date = value;
            else if (key === 'excerpt') meta.excerpt = value.replace(/^"|"$/g, '');
            else if (key === 'category') meta.category = value;
            else if (key === 'tags') {
              meta.tags = value
                .replace(/^[\[\]]/g, '')
                .replace(/\]$/, '')
                .split(',')
                .map((t) => t.replace(/['"\[\]]/g, '').trim())
                .filter(Boolean);
            } else if (key === 'pillars') {
              meta.pillars = value
                .replace(/^[\[\]]/g, '')
                .replace(/\]$/, '')
                .split(',')
                .map((t) => t.replace(/['"\[\]]/g, '').trim())
                .filter(Boolean) as HolisticPillar[];
            }
          });
      }
      return {
        slug,
        title: meta.title || slug,
        date: meta.date || new Date().toISOString(),
        excerpt: meta.excerpt,
        category: meta.category,
        tags: meta.tags || [],
        pillars: Array.isArray(meta.pillars) ? (meta.pillars as string[]).filter(Boolean) : undefined
      } as BlogMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
