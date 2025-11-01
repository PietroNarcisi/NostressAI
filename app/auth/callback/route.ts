import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientWithCookies } from '@/lib/supabase/auth';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirect_to') || '/';

  console.log('[Auth Callback] Processing callback with code:', code ? 'present' : 'missing');

  if (code) {
    try {
      const supabase = createSupabaseClientWithCookies(cookies());
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      console.log('[Auth Callback] Exchange result:', exchangeError ? `error: ${exchangeError.message}` : 'success');

      if (exchangeError) {
        console.error('[Auth Callback] Exchange error:', exchangeError);
        return NextResponse.redirect(`${requestUrl.origin}/?error=oauth_exchange_failed`);
      }

      const {
        data: { user }
      } = await supabase.auth.getUser();
      
      console.log('[Auth Callback] User after exchange:', user?.id, user?.email);

      if (user) {
        try {
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

          console.log('[Auth Callback] Provider data:', { providerDisplayName, providerAvatar });

          if (!profile) {
            // Create new profile with OAuth data
            const insertPayload: Record<string, any> = {
              user_id: user.id
            };
            if (providerDisplayName) insertPayload.display_name = providerDisplayName;
            if (providerAvatar) insertPayload.avatar_url = providerAvatar;
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(insertPayload);
            
            console.log('[Auth Callback] Profile created:', insertError ? `error: ${insertError.message}` : 'success');
            
            if (insertError) {
              console.error('[Auth Callback] Profile insert error:', insertError);
            }
          } else {
            // Update existing profile with OAuth data if fields are empty
            const updatePayload: Record<string, any> = {};
            if (!profile.display_name && providerDisplayName) {
              updatePayload.display_name = providerDisplayName;
            }
            if (!profile.avatar_url && providerAvatar) {
              updatePayload.avatar_url = providerAvatar;
            }
            
            if (Object.keys(updatePayload).length > 0) {
              const { error: updateError } = await supabase
                .from('profiles')
                .update(updatePayload)
                .eq('user_id', user.id);
              
              console.log('[Auth Callback] Profile updated:', updateError ? `error: ${updateError.message}` : 'success');
              
              if (updateError) {
                console.error('[Auth Callback] Profile update error:', updateError);
              }
            } else {
              console.log('[Auth Callback] No profile updates needed');
            }
          }
        } catch (error) {
          console.error('[Auth Callback] Profile handling error:', error);
        }
      }
    } catch (error) {
      console.error('[Auth Callback] Unexpected error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/?error=oauth_callback_failed`);
    }
  } else {
    console.log('[Auth Callback] No code parameter provided');
  }

  // Redirect with a timestamp to force a cache bust
  const redirectUrl = new URL(`${requestUrl.origin}${redirectTo}`);
  redirectUrl.searchParams.set('_auth', Date.now().toString());
  
  console.log('[Auth Callback] Redirecting to:', redirectUrl.toString());
  return NextResponse.redirect(redirectUrl.toString());
}
