'use server';

import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { getHighlighter } from 'shiki';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';

export interface CompiledPost {
  meta: Record<string, any>;
  code: string;
  headings: { depth: number; text: string; slug: string }[];
  excerpt: string;
}

export async function getPostMdx(slug: string): Promise<CompiledPost | null> {
  const supabase = getSupabaseServiceClient();

  const { data: article, error } = await supabase
    .from('articles')
    .select('id, title, excerpt, category, tags, hero_image, interactive_slug, published_at, body_mdx, status')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load article: ${error.message}`);
  }

  if (!article || article.status !== 'published') {
    return null;
  }

  const [{ data: pivotRows, error: pivotError }, { data: pillarRows, error: pillarError }] = await Promise.all([
    supabase
      .from('article_pillars')
      .select('pillar_id')
      .eq('article_id', article.id),
    supabase.from('pillars').select('id, slug')
  ]);

  if (pivotError) {
    throw new Error(`Failed to load article pillars: ${pivotError.message}`);
  }
  if (pillarError) {
    throw new Error(`Failed to load pillars: ${pillarError.message}`);
  }

  const pillarSet = new Set((pivotRows ?? []).map((pivot) => pivot.pillar_id));
  const pillarSlugs = pillarRows?.filter((row) => pillarSet.has(row.id)).map((row) => row.slug) ?? [];

  const content = (article.body_mdx ?? '').trim();

  // Extract headings (h2/h3)
  const headingRegex = /^##\s+(.+)$|^###\s+(.+)$/gm;
  const headings: { depth: number; text: string; slug: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = (match[1] || match[2] || '').trim();
    const depth = match[1] ? 2 : 3;
    const headingSlug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ depth, text, slug: headingSlug });
  }

  // Syntax highlighting for fenced code blocks before MDX compile
  const highlighter = await getHighlighter({
    themes: ['github-light', 'github-dark'],
    langs: ['javascript', 'typescript', 'tsx', 'bash', 'json', 'markdown']
  });

  const transformed = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match: string, lang?: string, codeBlock?: string) => {
    const language = (lang || 'text').toLowerCase();
    const block = codeBlock ?? '';
    try {
      const htmlLight = highlighter.codeToHtml(block.trim(), { lang: language, theme: 'github-light' });
      const htmlDark = highlighter.codeToHtml(block.trim(), { lang: language, theme: 'github-dark' });
      return `\n<div class="code-block not-prose"><div class="hidden dark:block">${htmlDark}</div><div class="dark:hidden">${htmlLight}</div></div>\n`;
    } catch {
      return _match; // fallback untouched
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

  const plain = content
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\([^)]*\)/g, '$1')
    .replace(/[*_>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const excerpt = plain.slice(0, 180) + (plain.length > 180 ? '…' : '');

  const meta: Record<string, any> = {
    title: article.title,
    excerpt: article.excerpt ?? undefined,
    category: article.category ?? undefined,
    tags: article.tags ?? [],
    date: article.published_at ? new Date(article.published_at).toISOString() : undefined,
    interactive: article.interactive_slug ?? undefined,
    heroImage: article.hero_image ?? undefined,
    pillars: pillarSlugs
  };

  return { meta, code: compiled, headings, excerpt };
}
