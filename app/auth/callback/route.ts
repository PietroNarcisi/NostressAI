import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientWithCookies } from '@/lib/supabase/auth';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirect_to') || '/profile';

  if (code) {
    const supabase = createSupabaseClientWithCookies(cookies());
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id, display_name, avatar_url')
          .eq('user_id', user.id)
          .maybeSingle();

        const metadata = user.user_metadata ?? {};
        const providerDisplayName =
          metadata.full_name || metadata.name || metadata.preferred_username || null;
        const providerAvatar =
          metadata.avatar_url || metadata.picture || null;

        const insertPayload: Record<string, any> = {
          user_id: user.id
        };

        if (!profile) {
          if (providerDisplayName) insertPayload.display_name = providerDisplayName;
          if (providerAvatar) insertPayload.avatar_url = providerAvatar;
          await supabase
            .from('profiles')
            .insert(insertPayload);
        } else {
          const updatePayload: Record<string, any> = {};
          if (!profile.display_name && providerDisplayName) {
            updatePayload.display_name = providerDisplayName;
          }
          if (!profile.avatar_url && providerAvatar) {
            updatePayload.avatar_url = providerAvatar;
          }
          if (Object.keys(updatePayload).length > 0) {
            await supabase
              .from('profiles')
              .update(updatePayload)
              .eq('user_id', user.id);
          }
        }
      }
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);
}
