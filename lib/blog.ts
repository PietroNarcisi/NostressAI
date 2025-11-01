'use server';

import type { BlogMeta, HolisticPillar } from '@/lib/types';
import { getSupabaseServiceClient } from '@/lib/supabaseClient';

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  tags: string[] | null;
  published_at: string | null;
  status: string | null;
}

export async function getAllPosts(): Promise<BlogMeta[]> {
  const supabase = getSupabaseServiceClient();

  const [articlesResult, pivotResult, pillarResult] = await Promise.all([
    supabase
      .from('articles')
      .select('id, slug, title, excerpt, category, tags, published_at, status')
      .order('published_at', { ascending: false }),
    supabase.from('article_pillars').select('article_id, pillar_id'),
    supabase.from('pillars').select('id, slug')
  ]);

  if (articlesResult.error) {
    throw new Error(`Failed to load articles: ${articlesResult.error.message}`);
  }
  if (pivotResult.error) {
    throw new Error(`Failed to load article pillars: ${pivotResult.error.message}`);
  }
  if (pillarResult.error) {
    throw new Error(`Failed to load pillars: ${pillarResult.error.message}`);
  }

  const articles = (articlesResult.data ?? []).filter((article) => article.status === 'published');
  const pivotRows = pivotResult.data ?? [];
  const pillarRows = pillarResult.data ?? [];

  const pillarMap = new Map<string, string>();
  pillarRows.forEach((row) => {
    pillarMap.set(row.id, row.slug);
  });

  const articlePillars = new Map<string, HolisticPillar[]>();
  pivotRows.forEach((pivot) => {
    const pillarSlug = pillarMap.get(pivot.pillar_id);
    if (!pillarSlug) return;
    const list = articlePillars.get(pivot.article_id) ?? [];
    list.push(pillarSlug as HolisticPillar);
    articlePillars.set(pivot.article_id, list);
  });

  return articles.map((row) => mapArticleRow(row, articlePillars.get(row.id)));
}

function mapArticleRow(row: ArticleRow, pillars?: HolisticPillar[]): BlogMeta {
  const publishedAt = row.published_at ? new Date(row.published_at).toISOString() : new Date().toISOString();
  return {
    slug: row.slug,
    title: row.title,
    date: publishedAt,
    excerpt: row.excerpt ?? undefined,
    category: row.category ?? undefined,
    tags: row.tags ?? [],
    pillars
  };
}
