'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerActionClient } from '@/lib/supabase/auth';

export interface ProfileActionState {
  error?: string;
  success?: string;
  displayName?: string | null;
  avatarUrl?: string | null;
}

export async function updateProfile(_: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
  const displayName = String(formData.get('displayName') ?? '').trim();
  const selectedAvatar = String(formData.get('selectedAvatar') ?? 'unchanged');

  const supabase = createSupabaseServerActionClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in.' };
  }

  const { data: existingProfile, error: existingError } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existingError && existingError.code !== 'PGRST116') {
    return { error: existingError.message };
  }

  let nextAvatarUrl = existingProfile?.avatar_url ?? null;
  if (selectedAvatar === 'none') {
    nextAvatarUrl = null;
  } else if (selectedAvatar !== 'unchanged' && selectedAvatar) {
    nextAvatarUrl = selectedAvatar;
  }

  const updates: Record<string, any> = {
    user_id: user.id,
    display_name: displayName || null,
    avatar_url: nextAvatarUrl
  };

  const { error: updateError } = await supabase
    .from('profiles')
    .upsert(updates, { onConflict: 'user_id' });

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath('/profile');
  revalidatePath('/admin');
  revalidatePath('/');

  return {
    success: 'Profile updated successfully.',
    displayName: updates.display_name,
    avatarUrl: nextAvatarUrl
  };
}
