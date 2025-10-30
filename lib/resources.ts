import fs from 'fs';
import path from 'path';
import { ResourceMeta, ResourceType, HolisticPillar } from '@/lib/types';

function parseFrontmatter(raw: string): Partial<ResourceMeta> {
  const match = raw.match(/^---[\r\n]+([\s\S]*?)---/);
  const meta: any = {};
  if (!match) return meta;
  match[1]
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [k, ...rest] = line.split(':');
      const key = k.trim();
      const value = rest.join(':').trim();
      if (key === 'title') meta.title = value.replace(/^"|"$/g, '');
      else if (key === 'type') meta.type = value as ResourceType;
      else if (key === 'tags') {
        meta.tags = value
          .replace(/^[\[]|[\]]$/g, '')
          .split(',')
          .map((t) => t.replace(/['"\[\]]/g, '').trim())
          .filter(Boolean);
      } else if (key === 'excerpt') meta.excerpt = value.replace(/^"|"$/g, '');
      else if (key === 'date') meta.date = value;
      else if (key === 'pillars') {
        meta.pillars = value
          .replace(/^[\[]|[\]]$/g, '')
          .split(',')
          .map((t) => t.replace(/['"\[\]]/g, '').trim())
          .filter(Boolean) as HolisticPillar[];
      }
    });
  return meta;
}

export function getAllResources(): ResourceMeta[] {
  const base = path.join(process.cwd(), 'content');
  const types: Array<{ dir: string; type: ResourceType }> = [
    { dir: 'tips', type: 'tip' },
    { dir: 'studies', type: 'study' }
  ];
  const items: ResourceMeta[] = [];
  types.forEach(({ dir, type }) => {
    const full = path.join(base, dir);
    if (!fs.existsSync(full)) return;
    fs.readdirSync(full)
      .filter((f) => f.endsWith('.mdx'))
      .forEach((file) => {
        const slug = file.replace(/\.mdx$/, '');
        const raw = fs.readFileSync(path.join(full, file), 'utf-8');
        const meta = parseFrontmatter(raw);
        items.push({
          slug: `${type}-${slug}`,
          title: meta.title || slug,
          type,
          tags: meta.tags || [],
          date: meta.date || new Date().toISOString(),
          excerpt: meta.excerpt,
          pillars: Array.isArray(meta.pillars) ? (meta.pillars as HolisticPillar[]) : undefined
        });
      });
  });
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}
