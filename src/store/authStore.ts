import { create } from 'zustand';
import { AuthState, SupabaseUser } from '../features/auth/types';
import { supabase } from '../utils/supabaseClient';

function mapSupabaseUser(user: any): SupabaseUser {
  return {
    id: user.id,
    email: user.email,
    nickname: user.user_metadata?.nickname || null,
  };
}

export const useAuthStore = create<AuthState>((set) => {
  // 세션 동기화: 앱 최초 로드 시 및 인증 상태 변경 시 currentUser 자동 갱신
  supabase.auth.getUser().then(({ data }) => {
    if (data?.user) {
      set({ currentUser: mapSupabaseUser(data.user) });
    }
  });
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      set({ currentUser: mapSupabaseUser(session.user) });
    } else {
      set({ currentUser: null });
    }
  });

  return {
    currentUser: null,
    login: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        return { error: error?.message || '로그인 실패' };
      }
      set({ currentUser: mapSupabaseUser(data.user) });
      return {};
    },
    logout: async () => {
      await supabase.auth.signOut();
      set({ currentUser: null });
    },
    signup: async (nickname, email, password) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nickname } },
      });
      if (error || !data.user) {
        return { error: error?.message || '회원가입 실패' };
      }
      set({ currentUser: mapSupabaseUser(data.user) });
      return {};
    },
    updateNickname: async (nickname) => {
      const { data, error } = await supabase.auth.updateUser({ data: { nickname } });
      if (error || !data.user) {
        return { error: error?.message || '닉네임 변경 실패' };
      }
      set({ currentUser: mapSupabaseUser(data.user) });
      return {};
    },
  };
}); 