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

## Supabase integration
1. Create a Supabase project and note the project URL plus anon/service keys.  
2. Duplicate `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.  
3. Apply migrations:  
   ```bash
   npx supabase db push
   ```  
4. Seed reference data:  
   ```bash
   npm run seed:pillars
   npm run seed:formations
   npm run seed:articles
   npm run seed:resources
   ```  
5. The `avatars` storage bucket is created by the migrations; if you created the project earlier, ensure a public bucket named `avatars` exists in Supabase Storage.  
6. Enable the **Google** provider in Supabase Auth and set the callback URL to `<site-url>/auth/callback`.  
7. Server-side renders use the service client (`lib/supabaseClient.ts`), while server actions/components use the auth-aware helpers in `lib/supabase/auth.ts`.

## Admin access
- Create an email/password user in Supabase Auth and set their `profiles.role` to `admin` via the Supabase dashboard.  
- Visit `/login` to sign in. Successful auth redirects to `/admin`, a protected dashboard that surfaces quick counts for articles, formations, and resources.  
- Use the “Sign out” button in the admin header to clear the session. Non-admin accounts are automatically signed out with an error message.

## Licence
MIT
