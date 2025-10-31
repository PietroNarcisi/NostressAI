import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { getHighlighter } from 'shiki';

export interface CompiledPost {
  meta: Record<string, any>;
  code: string;
  headings: { depth: number; text: string; slug: string }[];
  excerpt: string;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export async function getPostMdx(slug: string): Promise<CompiledPost | null> {
  const filePath = path.join(BLOG_DIR, slug + '.mdx');
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { content, data } = matter(raw);

  // Extract headings (h2/h3)
  const headingRegex = /^##\s+(.+)$|^###\s+(.+)$/gm;
  const headings: { depth: number; text: string; slug: string }[] = [];
  let m;
  while ((m = headingRegex.exec(content)) !== null) {
    const text = (m[1] || m[2] || '').trim();
    const depth = m[1] ? 2 : 3;
    const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ depth, text, slug });
  }

  // Syntax highlighting for fenced code blocks before MDX compile
  const highlighter = await getHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: ['javascript', 'typescript', 'tsx', 'bash', 'json', 'markdown']
  });

  const transformed = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match: string, lang: string, codeBlock: string) => {
    const language = (lang || 'text').toLowerCase();
    try {
      const htmlLight = highlighter.codeToHtml(codeBlock.trim(), { lang: language, theme: 'github-light' });
      const htmlDark = highlighter.codeToHtml(codeBlock.trim(), { lang: language, theme: 'github-dark' });
      return `\n<div class=\"code-block not-prose\"><div class=\"hidden dark:block\">${htmlDark}</div><div class=\"dark:hidden\">${htmlLight}</div></div>\n`;
    } catch {
      return match; // fallback untouched
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

  // Plain text excerpt (first 180 chars from content without fences & markdown symbols)
  const plain = content
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
    .replace(/[*_>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const excerpt = plain.slice(0, 180) + (plain.length > 180 ? '…' : '');

  return { meta: data, code: compiled, headings, excerpt };
}
