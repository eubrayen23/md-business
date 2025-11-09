import { create } from 'zustand';
import { supabase } from '@services/api/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { AppUser } from '@types/models';

type AuthState = {
  session: Session | null;
  profile: AppUser | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: AppUser | null) => void;
  fetchProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  isLoading: true,
  setSession: session =>
    set(state => ({
      session,
      isLoading: session ? state.isLoading : false,
    })),
  setProfile: profile => set({ profile }),
  fetchProfile: async () => {
    set({ isLoading: true });
    const user = supabase.auth.getUser();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', (await user).data.user?.id)
      .single();

    if (error) {
      if (__DEV__) {
        console.warn('[AuthStore] fetchProfile', error.message);
      }
      set({ profile: null, isLoading: false });
      return;
    }

    set({ profile: data as AppUser, isLoading: false });
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, profile: null });
  },
}));

supabase.auth.onAuthStateChange((_event, session) => {
  const { setSession, fetchProfile } = useAuthStore.getState();
  setSession(session);

  if (session?.user) {
    fetchProfile();
  } else {
    useAuthStore.setState({ profile: null, isLoading: false });
  }
});
