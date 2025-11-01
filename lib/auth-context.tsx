'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';

import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

interface UserProfile {
  displayName: string | null;
  avatarUrl: string | null;
  role: string | null;
}

interface AuthContextValue {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  refresh: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
  initialSession?: Session | null;
  initialProfile?: UserProfile | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function ensureProfile(supabase: ReturnType<typeof createSupabaseBrowserClient>, user: User) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.from('profiles').insert({ user_id: user.id });
  }
}

export function AuthProvider({ children, initialSession = null, initialProfile = null }: AuthProviderProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(initialSession);
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [loading, setLoading] = useState<boolean>(!initialSession);

  useEffect(() => {
    if (!initialSession?.access_token || !initialSession.refresh_token) {
      return;
    }
    void supabase.auth.setSession({
      access_token: initialSession.access_token,
      refresh_token: initialSession.refresh_token
    });
  }, [initialSession?.access_token, initialSession?.refresh_token, supabase]);

  const loadProfile = useCallback(async (nextSession?: Session | null) => {
    setLoading(true);
    try {
      let currentSession = nextSession ?? (await supabase.auth.getSession()).data.session;
      let nextUser = currentSession?.user ?? null;

      if (!nextUser) {
        const {
          data: { user: fetchedUser }
        } = await supabase.auth.getUser();
        if (fetchedUser) {
          nextUser = fetchedUser;
          currentSession = (await supabase.auth.getSession()).data.session;
        }
      }

      setSession(currentSession ?? null);
      setUser(nextUser ?? null);

      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      await ensureProfile(supabase, nextUser);

      // Retry logic for profile fetch
      let profileRow = null;
      let error = null;
      
      for (let i = 0; i < 3; i++) {
        const result = await supabase
          .from('profiles')
          .select('display_name, avatar_url, role')
          .eq('user_id', nextUser.id)
          .maybeSingle();
        
        profileRow = result.data;
        error = result.error;
        
        if (!error && profileRow) break;
        if (i < 2) await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
      }

      if (error) {
        console.error('Failed to load profile after retries', error);
        setProfile(null);
      } else {
        setProfile({
          displayName: profileRow?.display_name ?? null,
          avatarUrl: profileRow?.avatar_url ?? null,
          role: profileRow?.role ?? null
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const refresh = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    // Initial load
    let isMounted = true;
    let listenerCleanup: (() => void) | null = null;
    
    const initialize = async () => {
      if (!initialSession) {
        await loadProfile();
      } else if (!initialProfile) {
        await loadProfile(initialSession);
      } else {
        setLoading(false);
      }

      if (!isMounted) return;
      
      // After initial load, set up auth state listener
      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (isMounted) {
          console.log('Auth state changed:', _event, nextSession?.user?.email);
          void loadProfile(nextSession);
        }
      });
      
      listenerCleanup = () => subscription.unsubscribe();
    };

    initialize().catch(console.error);

    return () => {
      isMounted = false;
      listenerCleanup?.();
    };
  }, [initialProfile, initialSession, loadProfile, supabase]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`public:profiles:user:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          void loadProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadProfile, supabase, user]);

  const value = useMemo<AuthContextValue>(() => ({
    loading,
    session,
    user,
    profile,
    refresh
  }), [loading, profile, refresh, session, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
