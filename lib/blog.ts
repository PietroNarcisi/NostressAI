'use server';

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

import type { BlogMeta, HolisticPillar } from '@/lib/types';

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

function normaliseDate(value: unknown): string {
  if (!value) return new Date().toISOString();
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function createExcerpt(rawContent: string, frontmatterExcerpt?: unknown): string | undefined {
  if (typeof frontmatterExcerpt === 'string' && frontmatterExcerpt.trim()) {
    return frontmatterExcerpt.trim();
  }
  const plain = rawContent
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
    .replace(/[*_>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) return undefined;
  return plain.slice(0, 180) + (plain.length > 180 ? '…' : '');
}

export async function getAllPosts(): Promise<BlogMeta[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(BLOG_CONTENT_DIR);
  } catch (error) {
    console.error('[blog] Unable to read blog directory:', error);
    return [];
  }

  const mdxFiles = entries.filter((file) => file.endsWith('.mdx'));

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.replace(/\.mdx$/, '');
      const absolutePath = path.join(BLOG_CONTENT_DIR, file);
      const source = await fs.readFile(absolutePath, 'utf8');
      const { data, content } = matter(source);

      const pillars = Array.isArray(data.pillars)
        ? (data.pillars.filter((item): item is HolisticPillar => typeof item === 'string') as HolisticPillar[])
        : undefined;

      const tags = Array.isArray(data.tags)
        ? data.tags.filter((tag: unknown): tag is string => typeof tag === 'string')
        : undefined;

      const post: BlogMeta = {
        slug,
        title: typeof data.title === 'string' ? data.title : slug,
        date: normaliseDate(data.date),
        excerpt: createExcerpt(content, data.excerpt),
        category: typeof data.category === 'string' ? data.category : undefined,
        tags,
        pillars
      };

      return post;
    })
  );

  return posts.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
}
