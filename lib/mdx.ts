'use server';

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { getHighlighter } from 'shiki';

import type { HolisticPillar } from '@/lib/types';

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export interface CompiledPost {
  meta: Record<string, any>;
  code: string;
  headings: { depth: number; text: string; slug: string }[];
  excerpt: string;
}

function normalisePillars(value: unknown): HolisticPillar[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const filtered = value.filter((item): item is HolisticPillar => typeof item === 'string');
  return filtered.length > 0 ? filtered : undefined;
}

function buildExcerpt(content: string, frontmatterExcerpt?: unknown): string {
  if (typeof frontmatterExcerpt === 'string' && frontmatterExcerpt.trim()) {
    return frontmatterExcerpt.trim();
  }
  const plain = content
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
    .replace(/[*_>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.slice(0, 220) + (plain.length > 220 ? '…' : '');
}

export async function getPostMdx(slug: string): Promise<CompiledPost | null> {
  const filePath = path.join(BLOG_CONTENT_DIR, `${slug}.mdx`);
  let source: string;
  try {
    source = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }

  const { data, content } = matter(source);
  const trimmed = content.trim();

  if (!trimmed) {
    return null;
  }

  const headingRegex = /^##\s+(.+)$|^###\s+(.+)$/gm;
  const headings: { depth: number; text: string; slug: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(trimmed)) !== null) {
    const text = (match[1] || match[2] || '').trim();
    const depth = match[1] ? 2 : 3;
    const headingSlug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ depth, text, slug: headingSlug });
  }

  const highlighter = await getHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: ['javascript', 'typescript', 'tsx', 'bash', 'json', 'markdown']
  });

  const transformed = trimmed.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match: string, lang?: string, codeBlock?: string) => {
    const language = (lang || 'text').toLowerCase();
    const block = codeBlock ?? '';
    try {
      const htmlLight = highlighter.codeToHtml(block.trim(), { lang: language, theme: 'github-light' });
      const htmlDark = highlighter.codeToHtml(block.trim(), { lang: language, theme: 'github-dark' });
      return `\n<div class="code-block not-prose"><div class="hidden dark:block">${htmlDark}</div><div class="dark:hidden">${htmlLight}</div></div>\n`;
    } catch {
      return _match;
    }
  });

  const compiled = String(
    await compile(transformed, {
      outputFormat: 'function-body',
      development: false,
      jsxRuntime: 'automatic',
      remarkPlugins: [remarkGfm]
    })
  );

  const meta: Record<string, any> = {
    title: typeof data.title === 'string' ? data.title : slug,
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : undefined,
    category: typeof data.category === 'string' ? data.category : undefined,
    tags: Array.isArray(data.tags) ? data.tags.filter((tag: unknown): tag is string => typeof tag === 'string') : undefined,
    date: data.date ? new Date(data.date).toISOString() : undefined,
    interactive: typeof data.interactive === 'string' ? data.interactive : undefined,
    heroImage: typeof data.cover === 'string' ? data.cover : undefined,
    pillars: normalisePillars(data.pillars)
  };

  const excerpt = buildExcerpt(trimmed, data.excerpt);

  return { meta, code: compiled, headings, excerpt };
}
