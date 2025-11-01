import { config } from 'dotenv';
import { getSupabaseServiceClient } from '../lib/supabaseClient';
import { HOLISTIC_PILLARS } from '../lib/pillars';

config({ path: '.env.local' });

async function main() {
  const supabase = getSupabaseServiceClient();

  const entries = HOLISTIC_PILLARS.map((pillar) => ({
    slug: pillar.id,
    name: pillar.name,
    description: pillar.description,
    color: pillar.accentLight
  }));

  const { data, error } = await supabase
    .from('pillars')
    .upsert(entries, { onConflict: 'slug' })
    .select('id, slug, name');

  if (error) {
    console.error('Failed to seed pillars:', error.message);
    process.exit(1);
  }

  console.log('Seeded pillars:', data);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
