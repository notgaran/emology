'use client';

import { useDiaryStore } from '../../store/diaryStore';
import { useAuthStore } from '../../store/authStore';
import { useEffect } from 'react';

export default function PublicFeed() {
  const publicEntries = useDiaryStore((s) => s.publicEntries);
  const fetchPublicEntries = useDiaryStore((s) => s.fetchPublicEntries);
  useEffect(() => {
    fetchPublicEntries();
  }, [fetchPublicEntries]);
  if (publicEntries.length === 0) {
    return <div className="text-gray-400 text-center mt-8">공개된 일기가 없습니다.</div>;
  }
  return (
    <div className="mt-12">
      <h3 className="text-lg font-bold mb-3">공개 피드</h3>
      <ul className="space-y-3">
        {publicEntries.map((entry) => (
          <li key={entry.id} className="bg-white rounded p-4 flex items-center gap-4 shadow-sm">
            <div className="text-2xl">{entry.content.emotion}</div>
            <div className="flex-1">
              <div className="font-semibold">{entry.title}</div>
              <div className="text-sm text-gray-600 truncate">{entry.content.memo || '(메모 없음)'}</div>
              <div className="text-xs text-gray-400 mt-1">
                {entry.content.hashtags.map((tag: string) => (
                  <span key={tag} className="mr-1">#{tag}</span>
                ))}
              </div>
              <div className="text-xs text-pastel-blue mt-1">by {entry.user_id}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 