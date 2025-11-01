'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ProfileActionState, updateProfile } from './actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/AvatarFallback';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { PRESET_AVATARS } from '@/lib/profile-presets';

interface ProfileFormProps {
  displayName: string | null;
  avatarUrl: string | null;
  email: string;
  role: string | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="mt-4 w-full sm:w-auto">
      {pending ? (
        <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Saving…</span>
      ) : (
        'Save changes'
      )}
    </Button>
  );
}

const formInitialState: ProfileActionState = {};

export function ProfileForm({ displayName, avatarUrl, email, role }: ProfileFormProps) {
  const [state, formAction] = useFormState<ProfileActionState, FormData>(updateProfile, formInitialState);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('unchanged');
  const [persistedAvatar, setPersistedAvatar] = useState<string | null>(avatarUrl);
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const [currentDisplayName, setCurrentDisplayName] = useState<string | null>(displayName);

  useEffect(() => {
    setPersistedAvatar(avatarUrl);
    setPreview(avatarUrl);
    setSelectedAvatar('unchanged');
    setCurrentDisplayName(displayName);
  }, [avatarUrl, displayName]);

  useEffect(() => {
    if (state.success) {
      const nextDisplayName = state.displayName ?? currentDisplayName ?? null;
      const nextAvatarUrl = state.avatarUrl ?? persistedAvatar ?? null;
      setPreview(nextAvatarUrl);
      setPersistedAvatar(nextAvatarUrl);
      setCurrentDisplayName(nextDisplayName);
      setSelectedAvatar('unchanged');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('profile:updated', {
            detail: {
              displayName: nextDisplayName,
              avatarUrl: nextAvatarUrl
            }
          })
        );
      }
    }
  }, [currentDisplayName, persistedAvatar, state.avatarUrl, state.displayName, state.success]);

  const initials = useMemo(() => {
    const source = currentDisplayName || email;
    return source
      .split(' ')
      .map((part) => part[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  }, [currentDisplayName, email]);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="selectedAvatar" value={selectedAvatar} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-24 w-24">
          <Avatar className="h-full w-full border border-neutral-200 dark:border-neutral-700">
            {preview ? (
              <AvatarImage src={preview} alt="Avatar preview" className="h-full w-full object-cover" />
            ) : (
              <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200 text-lg font-semibold">
                {initials || '?'}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
          <p className="text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500">Choose an avatar</p>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
            {PRESET_AVATARS.map((url) => {
              const active =
                selectedAvatar === url ||
                (selectedAvatar === 'unchanged' && persistedAvatar === url);
              return (
                <button
                  key={url}
                  type="button"
                  onClick={() => {
                    setSelectedAvatar(url);
                    setPreview(url);
                  }}
                  className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border transition ${
                    active
                      ? 'border-primary-500 ring-2 ring-primary-200 dark:border-primary-400 dark:ring-primary-700/40'
                      : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700 dark:hover:border-primary-500'
                  }`}
                  aria-pressed={active}
                >
                  <img src={url} alt="Preset avatar" className="h-full w-full object-cover" />
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setSelectedAvatar('none');
                setPreview(null);
              }}
              className={`flex h-12 w-12 items-center justify-center rounded-full border text-xs transition ${
                selectedAvatar === 'none' || (selectedAvatar === 'unchanged' && !persistedAvatar)
                  ? 'border-primary-500 ring-2 ring-primary-200 dark:border-primary-400 dark:ring-primary-700/40'
                  : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700 dark:hover:border-primary-500'
              }`}
            >
              None
            </button>
          </div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">Select one of the curated avatars or choose none.</p>
        </div>
      </div>

      <div className="grid gap-6 sm:max-w-md">
        <div className="space-y-2">
          <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-100">
            Display name
          </label>
          <input
            id="displayName"
            name="displayName"
            defaultValue={displayName ?? ''}
            placeholder="Your name"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
        <div className="space-y-1 text-sm text-neutral-500 dark:text-neutral-400">
          <p>Email: <span className="font-medium text-neutral-800 dark:text-neutral-200">{email}</span></p>
          <p>Role: <span className="font-medium text-neutral-800 dark:text-neutral-200">{role ?? 'viewer'}</span></p>
        </div>
      </div>

      {state.error && <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}
      {state.success && <p className="rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">{state.success}</p>}

      <SubmitButton />
    </form>
  );
}
