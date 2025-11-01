import { config } from 'dotenv';
import { getSupabaseServiceClient } from '../lib/supabaseClient';
import { formations } from '../lib/formations';

config({ path: '.env.local' });

async function main() {
  const supabase = getSupabaseServiceClient();

  const { data: pillars, error: pillarError } = await supabase
    .from('pillars')
    .select('id, slug');

  if (pillarError) {
    console.error('Failed to load pillars:', pillarError.message);
    process.exit(1);
  }

  const pillarMap = new Map(pillars?.map((p) => [p.slug, p.id]));

  const rows = formations.map((formation) => {
    const availability = formation.status;
    const isPublished = availability === 'available';
    const descriptionMd = `## Overview\n${formation.short}\n\n## Outline\n${(formation.outline || [])
      .map((item) => `- ${item}`)
      .join('\n')}`;

    return {
      slug: formation.slug,
      title: formation.title,
      summary: formation.short,
      description_mdx: descriptionMd,
      level: formation.level,
      availability,
      modules: formation.outline || [],
      status: isPublished ? 'published' : 'draft',
      published_at: isPublished ? new Date().toISOString() : null
    };
  });

  const { data: upserted, error: upsertError } = await supabase
    .from('formations')
    .upsert(rows, { onConflict: 'slug' })
    .select('id, slug');

  if (upsertError) {
    console.error('Failed to upsert formations:', upsertError.message);
    process.exit(1);
  }

  const formationMap = new Map(upserted?.map((row) => [row.slug, row.id]));
  const formationIds = Array.from(formationMap.values());

  if (formationIds.length) {
    const { error: deleteError } = await supabase
      .from('formation_pillars')
      .delete()
      .in('formation_id', formationIds);

    if (deleteError) {
      console.error('Failed to clear formation pillars:', deleteError.message);
      process.exit(1);
    }
  }

  const pairs = formations.flatMap((formation) => {
    const formationId = formationMap.get(formation.slug);
    if (!formationId) return [];
    return (formation.pillars || []).map((pillarSlug) => {
      const pillarId = pillarMap.get(pillarSlug);
      if (!pillarId) {
        console.warn(`Missing pillar: ${pillarSlug}`);
        return null;
      }
      return {
        formation_id: formationId,
        pillar_id: pillarId
      };
    }).filter(Boolean) as Array<{ formation_id: string; pillar_id: string }>;
  });

  if (pairs.length) {
    const { error: insertError } = await supabase
      .from('formation_pillars')
      .insert(pairs);

    if (insertError) {
      console.error('Failed to insert formation pillars:', insertError.message);
      process.exit(1);
    }
  }

  console.log('Seeded formations:', Array.from(formationMap.keys()));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
