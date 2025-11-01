'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Loader2, LogOut, Settings, ShieldCheck, User, X } from 'lucide-react';

import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { logout } from '@/app/login/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/AvatarFallback';

interface AuthState {
  loading: boolean;
  email?: string;
  role?: string | null;
  avatarUrl?: string | null;
  displayName?: string | null;
}

interface ProfileMenuProps {
  className?: string;
}

type ProfileUpdatedDetail = {
  displayName?: string | null;
  avatarUrl?: string | null;
};

export function ProfileMenu({ className }: ProfileMenuProps) {
  const pathname = usePathname();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [auth, setAuth] = useState<AuthState>({ loading: true });
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [signOutPending, setSignOutPending] = useState(false);

  const loadFromSession = useCallback(async (session?: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']) => {
    const currentSession = session ?? (await supabase.auth.getSession()).data.session;
    const user = currentSession?.user ?? null;
    if (!user) {
      setAuth({ loading: false });
      return;
    }
    let { data: profile } = await supabase
      .from('profiles')
      .select('role, avatar_url, display_name')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile) {
      await supabase
        .from('profiles')
        .upsert({ user_id: user.id });
      const refreshed = await supabase
        .from('profiles')
        .select('role, avatar_url, display_name')
        .eq('user_id', user.id)
        .maybeSingle();
      profile = refreshed.data ?? null;
    }

    setAuth({
      loading: false,
      email: user.email ?? undefined,
      role: profile?.role ?? null,
      avatarUrl: profile?.avatar_url ?? null,
      displayName: profile?.display_name ?? null
    });
  }, [supabase]);

  useEffect(() => {
    let active = true;
    void loadFromSession();
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) void loadFromSession(session);
    });
    const handleProfileUpdated = (event: Event) => {
      const detail = (event as CustomEvent<ProfileUpdatedDetail>).detail;
      if (detail) {
        setAuth((previous) => {
          if (!previous.email) {
            return previous;
          }
          const nextDisplayName =
            detail.displayName !== undefined ? detail.displayName ?? null : previous.displayName ?? null;
          const nextAvatarUrl =
            detail.avatarUrl !== undefined ? detail.avatarUrl ?? null : previous.avatarUrl ?? null;
          return {
            ...previous,
            displayName: nextDisplayName,
            avatarUrl: nextAvatarUrl
          };
        });
      }
      void loadFromSession();
    };
    window.addEventListener('profile:updated', handleProfileUpdated);
    return () => {
      active = false;
      subscription.unsubscribe();
      window.removeEventListener('profile:updated', handleProfileUpdated);
    };
  }, [loadFromSession, supabase]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const initials = useMemo(() => {
    const source = auth.displayName || auth.email || '??';
    return source
      .split(' ')
      .map((part) => part[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  }, [auth.displayName, auth.email]);

  async function ensureProfile() {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return;
    const { data: existing } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (!existing) {
      await supabase.from('profiles').insert({ user_id: user.id });
    }
  }

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(undefined);
    setMessage(undefined);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setPending(false);
      return;
    }

    if (mode === 'signin') {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        setPending(false);
        return;
      }
      await ensureProfile();
      await loadFromSession();
      setPending(false);
      setOpen(false);
      setEmail('');
      setPassword('');
      window.location.href = '/profile';
    } else {
      const redirectTo = `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent('/profile')}`;
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo
        }
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
      setMessage('Check your inbox to confirm your email. You can sign in once it is verified.');
      setMode('signin');
      }
      setPending(false);
    }
  }

  async function handleGoogleAuth(mode: 'signin' | 'signup') {
    setPending(true);
    setError(undefined);
    setMessage(undefined);
    const redirectTo = `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent('/profile')}`;
    const options: Parameters<typeof supabase.auth.signInWithOAuth>[0]['options'] = { redirectTo };
    if (mode === 'signup') {
      options.queryParams = { prompt: 'consent' };
    }
    const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: 'google', options });
    if (oauthError) {
      setError(oauthError.message);
      setPending(false);
    }
  }

  const handleSignOut = useCallback(async () => {
    setSignOutPending(true);
    setError(undefined);
    setMessage(undefined);
    await supabase.auth.signOut();
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
    await loadFromSession();
    setSignOutPending(false);
    setOpen(false);
    window.location.href = '/';
  }, [loadFromSession, supabase]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={`flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800 ${className ?? ''}`}
        >
          <Avatar className="h-7 w-7 overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-700">
            {auth.avatarUrl ? (
              <AvatarImage src={auth.avatarUrl} alt={auth.displayName ?? auth.email ?? 'Profile'} className="h-full w-full object-cover" />
            ) : (
              <AvatarFallback className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 text-xs font-semibold">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="hidden sm:inline">{auth.email ? auth.displayName ?? auth.email : 'Profile'}</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-[1px]" />
        <Dialog.Content className="fixed right-4 top-20 z-[60] w-[360px] max-w-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 sm:right-6">
          <div className="flex items-start justify-between">
            <Dialog.Title className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {auth.email ? 'Account' : mode === 'signin' ? 'Welcome back' : 'Join NoStress AI'}
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1 text-neutral-500 transition hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {!auth.email ? (
            <div className="mt-6 space-y-5 text-sm text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(undefined);
                    setMessage(undefined);
                  }}
                  className={`rounded-full px-3 py-1 ${mode === 'signin' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(undefined);
                    setMessage(undefined);
                  }}
                  className={`rounded-full px-3 py-1 ${mode === 'signup' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                >
                  Create account
                </button>
              </div>

              <form className="space-y-3" onSubmit={handleEmailSubmit}>
                <div className="space-y-1">
                  <label htmlFor="profile-email" className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    Email
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="profile-password" className="block text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    Password
                  </label>
                  <input
                    id="profile-password"
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-500 disabled:opacity-60"
                  disabled={pending}
                >
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
                  {mode === 'signin' ? 'Sign in with email' : 'Create account with email'}
                </button>
              </form>

              <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
                <span className="flex-1 border-t border-neutral-200 dark:border-neutral-700" />
                <span>Or use Google</span>
                <span className="flex-1 border-t border-neutral-200 dark:border-neutral-700" />
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleGoogleAuth(mode)}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  disabled={pending}
                >
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
                  Continue with Google
                </button>
              </div>

              {error && <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p>}
              {message && <p className="rounded-md border border-success/40 bg-success/10 px-3 py-2 text-xs text-success">{message}</p>}
            </div>
          ) : (
            <div className="mt-6 space-y-6 text-sm text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 overflow-hidden rounded-full border border-neutral-200 dark:border-neutral-700">
                  {auth.avatarUrl ? (
                    <AvatarImage src={auth.avatarUrl} alt={auth.displayName ?? auth.email} className="h-full w-full object-cover" />
                  ) : (
                    <AvatarFallback className="flex h-full w-full items-center justify-center bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 text-base font-semibold">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">{auth.displayName ?? auth.email}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{auth.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Settings className="h-4 w-4" /> Profile settings
                </Link>
                {auth.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-full border border-primary-300 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 transition hover:bg-primary-100 dark:border-primary-700/40 dark:bg-primary-900/20 dark:text-primary-200 dark:hover:bg-primary-900/40"
                  >
                    <ShieldCheck className="h-4 w-4" /> Admin dashboard
                  </Link>
                )}
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 disabled:opacity-60"
                  disabled={signOutPending}
                >
                  {signOutPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />} Sign out
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
