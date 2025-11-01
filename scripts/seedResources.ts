import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { config } from 'dotenv';
import { getSupabaseServiceClient } from '../lib/supabaseClient';

config({ path: '.env.local' });

const CONTENT_ROOT = path.join(process.cwd(), 'content');
const DIRECTORIES: Array<{ dir: string; type: 'tip' | 'study' }> = [
  { dir: 'tips', type: 'tip' },
  { dir: 'studies', type: 'study' }
];

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

  const entries = DIRECTORIES.flatMap(({ dir, type }) => {
    const folder = path.join(CONTENT_ROOT, dir);
    if (!fs.existsSync(folder)) return [];

    return fs
      .readdirSync(folder)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => {
        const slugPart = file.replace(/\.mdx$/, '');
        const fullSlug = `${type}-${slugPart}`;
        const raw = fs.readFileSync(path.join(folder, file), 'utf-8');
        const { data, content } = matter(raw);

        const title = typeof data.title === 'string' ? data.title : slugPart;
        const excerpt = typeof data.excerpt === 'string' ? data.excerpt : null;
        const tags = Array.isArray(data.tags) ? data.tags.map((tag: unknown) => String(tag)).filter(Boolean) : [];
        const pillars = Array.isArray(data.pillars) ? data.pillars.map((pillar: unknown) => String(pillar)).filter(Boolean) : [];

        let publishedAt: string | null = null;
        if (data.date) {
          const date = new Date(String(data.date));
          if (!Number.isNaN(date.getTime())) {
            publishedAt = date.toISOString();
          }
        }

        const status = publishedAt ? 'published' : 'draft';

        return {
          slug: fullSlug,
          type,
          title,
          excerpt,
          body_mdx: content.trim(),
          tags,
          status,
          published_at: publishedAt,
          raw_pillars: pillars
        };
      });
  });

  const upsertPayload = entries.map(({ raw_pillars: _unused, ...rest }) => rest);

  const { data: upserted, error: upsertError } = await supabase
    .from('resources')
    .upsert(upsertPayload, { onConflict: 'slug' })
    .select('id, slug');

  if (upsertError) {
    console.error('Failed to upsert resources:', upsertError.message);
    process.exit(1);
  }

  const resourceIdMap = new Map(upserted?.map((row) => [row.slug, row.id]));
  const resourceIds = Array.from(resourceIdMap.values());

  if (resourceIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('resource_pillars')
      .delete()
      .in('resource_id', resourceIds);

    if (deleteError) {
      console.error('Failed to clear resource pillars:', deleteError.message);
      process.exit(1);
    }
  }

  const pairs = entries.flatMap((entry) => {
    const resourceId = resourceIdMap.get(entry.slug);
    if (!resourceId) return [];
    return (entry.raw_pillars ?? []).map((pillarSlug) => {
      const pillarId = pillarMap.get(pillarSlug);
      if (!pillarId) {
        console.warn(`Missing pillar '${pillarSlug}' for resource ${entry.slug}`);
        return null;
      }
      return {
        resource_id: resourceId,
        pillar_id: pillarId
      };
    }).filter(Boolean) as Array<{ resource_id: string; pillar_id: string }>;
  });

  if (pairs.length > 0) {
    const { error: insertError } = await supabase
      .from('resource_pillars')
      .insert(pairs);

    if (insertError) {
      console.error('Failed to insert resource pillars:', insertError.message);
      process.exit(1);
    }
  }

  console.log('Seeded resources:', Array.from(resourceIdMap.keys()));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
