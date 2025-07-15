'use client';

import { useAuthStore } from '../../store/authStore';
import { useDiaryStore } from '../../store/diaryStore';
import { useEffect } from 'react';

export default function DiaryList() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const entries = useDiaryStore((s) => s.entries);
  const fetchUserEntries = useDiaryStore((s) => s.fetchUserEntries);
  useEffect(() => {
    if (currentUser) fetchUserEntries(currentUser.id);
  }, [currentUser, fetchUserEntries]);

  if (!currentUser) return null;

  if (entries.length === 0) {
    return <div className="text-gray-500 text-center mt-8">작성한 일기가 없습니다.</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-3">내 감정일기</h3>
      <ul className="space-y-3">
        {entries.map((entry) => (
          <li key={entry.id} className="bg-gray-50 rounded p-4 flex items-center gap-4">
            <div className="text-2xl">{entry.content.emotion}</div>
            <div className="flex-1">
              <div className="font-semibold">{entry.title}</div>
              <div className="text-sm text-gray-600 truncate">{entry.content.memo || '(메모 없음)'}</div>
              <div className="text-xs text-gray-400 mt-1">
                {entry.content.hashtags.map((tag: string) => (
                  <span key={tag} className="mr-1">#{tag}</span>
                ))}
                {entry.content.isPublic && <span className="ml-2 text-pastel-blue">공개</span>}
              </div>
            </div>
            {/* 상세보기/수정/삭제 등은 추후 구현 */}
          </li>
        ))}
      </ul>
    </div>
  );
} 