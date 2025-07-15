import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LocalUser } from '../features/auth/types';

function generateId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      login: (username, password) => {
        const user = get().users.find(
          (u) => u.username === username && u.password === password
        );
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null }),
      signup: (nickname, username, password) => {
        if (get().users.some((u) => u.username === username)) return false;
        const newUser: LocalUser = {
          id: generateId(),
          nickname,
          username,
          password,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          users: [...state.users, newUser],
          currentUser: newUser,
        }));
        return true;
      },
      updateNickname: (nickname) => {
        const user = get().currentUser;
        if (!user) return;
        set((state) => ({
          currentUser: { ...user, nickname },
          users: state.users.map((u) =>
            u.id === user.id ? { ...u, nickname } : u
          ),
        }));
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ users: state.users, currentUser: state.currentUser }),
    }
  )
); 