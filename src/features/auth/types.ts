export type LocalUser = {
  id: string; // uuid
  nickname: string;
  username: string; // 로그인용 아이디
  password: string; // 해시 아님, 단순 저장
  createdAt: string;
};

export type AuthState = {
  currentUser: LocalUser | null;
  users: LocalUser[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  signup: (nickname: string, username: string, password: string) => boolean;
  updateNickname: (nickname: string) => void;
}; 