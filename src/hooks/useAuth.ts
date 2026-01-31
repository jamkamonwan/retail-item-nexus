import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { UserType } from '@/types/npd';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserType | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchUserRole = async (userId: string): Promise<UserType | null> => {
      try {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle();
        return (data?.role as UserType) ?? null;
      } catch {
        return null;
      }
    };

    // Listener for ONGOING auth changes (does NOT control initial loading)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;

        const user = session?.user ?? null;
        
        // Update user/session immediately
        setAuthState(prev => ({
          ...prev,
          user,
          session,
          role: user ? prev.role : null,
        }));

        // Fetch role in background (fire and forget for ongoing changes)
        if (user) {
          fetchUserRole(user.id).then(role => {
            if (isMounted) {
              setAuthState(prev => ({ ...prev, role }));
            }
          });
        }
      }
    );

    // INITIAL load (controls loading state)
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        const user = session?.user ?? null;
        let role: UserType | null = null;

        // Fetch role BEFORE setting loading false
        if (user) {
          role = await fetchUserRole(user.id);
        }

        if (isMounted) {
          setAuthState({
            user,
            session,
            role,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setAuthState({
            user: null,
            session: null,
            role: null,
            loading: false,
          });
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserType) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
  };
}
