export type Emotion = {
  emoji: string;
  label: string;
};

export type DiaryEntry = {
  id: string; // uuid
  userId: string;
  date: string; // yyyy-mm-dd
  emotion: Emotion;
  hashtags: string[];
  memo: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DiaryState = {
  entries: DiaryEntry[];
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, entry: Partial<Omit<DiaryEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => void;
  deleteEntry: (id: string) => void;
  getUserEntries: (userId: string) => DiaryEntry[];
  getPublicEntries: () => DiaryEntry[];
}; 