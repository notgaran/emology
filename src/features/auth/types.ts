export type LocalUser = {
  id: string; // uuid
  nickname: string;
  username: string; // 로그인용 아이디
  password: string; // 해시 아님, 단순 저장
  createdAt: string;
};

export type SupabaseUser = {
  id: string;
  email: string | null;
  nickname?: string | null;
};

export type AuthState = {
  currentUser: SupabaseUser | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  signup: (nickname: string, email: string, password: string) => Promise<{ error?: string }>;
  updateNickname: (nickname: string) => Promise<{ error?: string }>;
}; 