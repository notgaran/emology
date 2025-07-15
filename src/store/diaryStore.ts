import { create } from 'zustand';
import { supabase } from '../utils/supabaseClient';

export type DiaryContent = {
  emotion: string;
  hashtags: string[];
  memo: string;
  isPublic: boolean;
};

export type DiaryEntry = {
  id: string;
  user_id: string;
  title: string; // 날짜(YYYY-MM-DD) 등으로 사용
  content: DiaryContent;
  created_at: string;
  updated_at: string;
};

interface DiaryStore {
  entries: DiaryEntry[];
  fetchUserEntries: (userId: string) => Promise<void>;
  addEntry: (userId: string, title: string, content: DiaryContent) => Promise<void>;
  updateEntry: (id: string, content: DiaryContent) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  fetchPublicEntries: () => Promise<void>;
  publicEntries: DiaryEntry[];
}

export const useDiaryStore = create<DiaryStore>((set) => ({
  entries: [],
  publicEntries: [],
  fetchUserEntries: async (userId) => {
    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', userId)
      .order('title', { ascending: false });
    if (data) {
      set({
        entries: data.map((d) => ({
          ...d,
          content: typeof d.content === 'string' ? JSON.parse(d.content) : d.content,
        })),
      });
    }
  },
  addEntry: async (userId, title, content) => {
    const { data, error } = await supabase
      .from('diaries')
      .insert({
        user_id: userId,
        title,
        content: JSON.stringify(content),
      });
    // 새로고침
    if (!error) await useDiaryStore.getState().fetchUserEntries(userId);
  },
  updateEntry: async (id, content) => {
    const { data, error } = await supabase
      .from('diaries')
      .update({
        content: JSON.stringify(content),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    // 새로고침
    if (!error) {
      const userId = data?.[0]?.user_id;
      if (userId) await useDiaryStore.getState().fetchUserEntries(userId);
    }
  },
  deleteEntry: async (id) => {
    // userId를 찾기 위해 먼저 조회
    const { data } = await supabase.from('diaries').select('user_id').eq('id', id).single();
    const userId = data?.user_id;
    await supabase.from('diaries').delete().eq('id', id);
    if (userId) await useDiaryStore.getState().fetchUserEntries(userId);
  },
  fetchPublicEntries: async () => {
    const { data } = await supabase
      .from('diaries')
      .select('*')
      .order('title', { ascending: false });
    if (data) {
      set({
        publicEntries: data
          .filter((d) => {
            const content = typeof d.content === 'string' ? JSON.parse(d.content) : d.content;
            return content.isPublic;
          })
          .map((d) => ({
            ...d,
            content: typeof d.content === 'string' ? JSON.parse(d.content) : d.content,
          })),
      });
    }
  },
})); 