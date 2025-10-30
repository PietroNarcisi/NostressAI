# NoStress AI

Web platform offering research-backed training, articles, videos and practical resources to reduce mental load with intentional AI.

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- MDX for long-form content (articles, tips, studies)

## Getting started
```bash
npm install
npm run dev
```
App runs on http://localhost:3000

## Project structure
```
app/              # Routes (App Router)
  approach/       # Holistic method overview
  courses/        # Course index and detail pages
  blog/           # Blog index + posts
  resources/      # Practical resources
  about/          # Manifesto / about page
  videos/         # Video embeds
components/       # UI components (navbar, cards, etc.)
content/          # MDX sources (blog, tips, studies)
lib/              # Data loaders and helpers
```

## Adding an MDX article
Create `content/blog/my-article.mdx`:
```mdx
---
title: "Title of the article"
date: 2025-09-29
excerpt: "Short abstract."
category: "stress"
tags: ["ai", "mental-load"]
---

Your **MDX** content here.
```

## Customisation
- Adjust the color palette in `tailwind.config.js`
- Set global metadata and layout tweaks in `app/layout.tsx`

## Next steps (ideas)
- Localise MDX content to English (currently mixed)
- Hook the contact form to an email service (Resend, Brevo, …)
- Wire the newsletter to a real provider
- Add automated tests (Playwright or Jest) when the product stabilises
- Enrich each MDX article/resource with `pillars: []` metadata so the holistic map surfaces richer recommendations

## Licence
MIT
