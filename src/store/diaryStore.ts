import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DiaryState, DiaryEntry } from '../features/diary/types';

function generateId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export const useDiaryStore = create<DiaryState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (entry) => {
        const now = new Date().toISOString();
        const newEntry: DiaryEntry = {
          ...entry,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ entries: [...state.entries, newEntry] }));
      },
      updateEntry: (id, entry) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...entry, updatedAt: new Date().toISOString() } : e
          ),
        }));
      },
      deleteEntry: (id) => {
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) }));
      },
      getUserEntries: (userId) => {
        return get().entries.filter((e) => e.userId === userId);
      },
      getPublicEntries: () => {
        return get().entries.filter((e) => e.isPublic);
      },
    }),
    {
      name: 'diary-store',
      partialize: (state) => ({ entries: state.entries }),
    }
  )
); 