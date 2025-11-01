# Fix for Google OAuth Login Issue

## Problem
When logging in with Google, the profile wasn't being created/updated because of **Row Level Security (RLS) policies** blocking the INSERT operation.

## Solution

### Step 1: Apply the latest migration (or run equivalent SQL)
Run `npx supabase db push` so migration `0006_fix_profiles_insert_policy.sql` is applied.  
If you need to run it manually in the Supabase SQL editor, execute:

```sql
-- Drop existing problematic policies
drop policy if exists "Users insert own profile" on public.profiles;
drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;

-- Create proper insert policy
create policy "Users insert own profile" on public.profiles
  for insert
  with check (auth.uid() = user_id);

-- Recreate read policy
create policy "Users read own profile" on public.profiles
  for select
  using (auth.uid() = user_id);

-- Recreate update policy  
create policy "Users update own profile" on public.profiles
  for update
  using (auth.uid() = user_id);
```

### Step 2: What Changed
- Added **Middleware** (`middleware.ts`) to sync auth state between server and client on every request
- Reset **RLS policies** via migration `0006_fix_profiles_insert_policy.sql` so users can insert/read/update their own profiles
- Improved **auth callback** logging, error handling, and profile seeding
- Centralised **auth state** in `lib/auth-context.tsx`, giving components a single source of truth

### Step 3: Test the Fix
1. Clear your browser cookies/cache
2. Go to the app
3. Click "Continue with Google"
4. Complete Google auth
5. You should now see your profile with display name

## Why This Works

```
Google OAuth Flow:
1. User clicks "Continue with Google"
   ↓
2. Redirected to Google, user authenticates
   ↓
3. Google redirects back to /auth/callback?code=xxx
   ↓
4. Server exchanges code for session (SETS COOKIES) ✅
   ↓
5. Server creates profile row ✅ (NOW ALLOWED BY RLS POLICY)
   ↓
6. Middleware syncs cookies on EVERY request ✅
   ↓
7. Browser client sees session via middleware
   ↓
8. AuthProvider loads profile from database ✅
   ↓
9. ProfileMenu updates with user info ✅
```

The middleware is the KEY - it ensures that auth cookies are properly synced on every request.
