import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { config } from 'dotenv';
import { getSupabaseServiceClient } from '../lib/supabaseClient';

config({ path: '.env.local' });

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

async function main() {
  const supabase = getSupabaseServiceClient();

  const { data: pillarRows, error: pillarError } = await supabase
    .from('pillars')
    .select('id, slug');

  if (pillarError) {
    console.error('Failed to load pillars:', pillarError.message);
    process.exit(1);
  }

  const pillarMap = new Map(pillarRows?.map((row) => [row.slug, row.id]));

  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'));

  const rows = files.map((file) => {
    const slug = file.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
    const { data, content } = matter(raw);

    const title = typeof data.title === 'string' ? data.title : slug;
    const excerpt = typeof data.excerpt === 'string' ? data.excerpt : null;
    const category = typeof data.category === 'string' ? data.category : null;
    const interactiveSlug = typeof data.interactive === 'string' ? data.interactive : null;

    let publishedAt: string | null = null;
    if (data.date) {
      const date = new Date(data.date as string);
      if (!Number.isNaN(date.getTime())) {
        publishedAt = date.toISOString();
      }
    }

    const tags = Array.isArray(data.tags)
      ? data.tags.map((tag: unknown) => String(tag)).filter(Boolean)
      : [];

    const pillars = Array.isArray(data.pillars)
      ? data.pillars.map((pillar: unknown) => String(pillar)).filter(Boolean)
      : [];

    const heroImage = typeof data.heroImage === 'string' ? data.heroImage : null;

    const status = publishedAt ? 'published' : 'draft';

    return {
      slug,
      title,
      excerpt,
      category,
      body_mdx: content.trim(),
      tags,
      interactive_slug: interactiveSlug,
      hero_image: heroImage,
      status,
      published_at: publishedAt,
      raw_pillars: pillars
    };
  });

  const upsertPayload = rows.map(({ raw_pillars: _unused, ...rest }) => rest);

  const { data: upserted, error: upsertError } = await supabase
    .from('articles')
    .upsert(upsertPayload, { onConflict: 'slug' })
    .select('id, slug');

  if (upsertError) {
    console.error('Failed to upsert articles:', upsertError.message);
    process.exit(1);
  }

  const articleIdMap = new Map(upserted?.map((row) => [row.slug, row.id]));
  const articleIds = Array.from(articleIdMap.values());

  if (articleIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('article_pillars')
      .delete()
      .in('article_id', articleIds);

    if (deleteError) {
      console.error('Failed to clear article pillars:', deleteError.message);
      process.exit(1);
    }
  }

  const pairs = rows.flatMap((row) => {
    const articleId = articleIdMap.get(row.slug);
    if (!articleId) return [];
    return (row.raw_pillars ?? []).map((pillarSlug) => {
      const pillarId = pillarMap.get(pillarSlug);
      if (!pillarId) {
        console.warn(`Missing pillar \'${pillarSlug}\' for article ${row.slug}`);
        return null;
      }
      return {
        article_id: articleId,
        pillar_id: pillarId
      };
    }).filter(Boolean) as Array<{ article_id: string; pillar_id: string }>;
  });

  if (pairs.length > 0) {
    const { error: insertError } = await supabase
      .from('article_pillars')
      .insert(pairs);

    if (insertError) {
      console.error('Failed to insert article pillars:', insertError.message);
      process.exit(1);
    }
  }

  console.log('Seeded articles:', Array.from(articleIdMap.keys()));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
