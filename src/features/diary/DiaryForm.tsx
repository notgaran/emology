'use client';

import { useState } from 'react';
import { useDiaryStore } from '../../store/diaryStore';
import { useAuthStore } from '../../store/authStore';
import { Emotion } from './types';

const EMOTIONS: Emotion[] = [
  { emoji: '😊', label: '기쁨' },
  { emoji: '😢', label: '슬픔' },
  { emoji: '😡', label: '분노' },
  { emoji: '😱', label: '놀람' },
  { emoji: '😐', label: '무감정' },
  { emoji: '😍', label: '사랑' },
  { emoji: '😰', label: '불안' },
];

export default function DiaryForm() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const addEntry = useDiaryStore((s) => s.addEntry);
  const fetchUserEntries = useDiaryStore((s) => s.fetchUserEntries);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [emotion, setEmotion] = useState<Emotion>(EMOTIONS[0]);
  const [hashtags, setHashtags] = useState<string>('');
  const [memo, setMemo] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [success, setSuccess] = useState(false);

  if (!currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    await addEntry(currentUser.id, date, {
      emotion: emotion.emoji + ' ' + emotion.label,
      hashtags: hashtags.split(' ').filter(Boolean),
      memo,
      isPublic,
    });
    await fetchUserEntries(currentUser.id);
    setSuccess(true);
    setMemo('');
    setHashtags('');
    setEmotion(EMOTIONS[0]);
    setIsPublic(true);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 max-w-md mx-auto mt-6 space-y-4">
      <h2 className="text-lg font-bold mb-2">감정일기 작성</h2>
      <div>
        <label className="block mb-1 font-medium">날짜</label>
        <input
          type="date"
          className="border rounded px-3 py-2 w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">감정</label>
        <div className="flex gap-2 flex-wrap">
          {EMOTIONS.map((em) => (
            <button
              type="button"
              key={em.label}
              className={`px-3 py-1 rounded border ${emotion.label === em.label ? 'bg-pastel-blue text-white' : 'bg-gray-100'}`}
              onClick={() => setEmotion(em)}
            >
              <span className="text-xl mr-1">{em.emoji}</span>{em.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium">해시태그 (띄어쓰기로 구분)</label>
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="#행복 #감사"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">메모</label>
        <textarea
          className="border rounded px-3 py-2 w-full min-h-[80px]"
          placeholder="오늘의 감정을 자유롭게 적어보세요."
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={() => setIsPublic((v) => !v)}
          id="isPublic"
        />
        <label htmlFor="isPublic">공개</label>
      </div>
      <button
        type="submit"
        className="w-full bg-pastel-blue text-white py-2 rounded font-semibold mt-2"
      >
        저장하기
      </button>
      {success && <div className="text-green-600 text-sm mt-2">저장되었습니다!</div>}
    </form>
  );
} 