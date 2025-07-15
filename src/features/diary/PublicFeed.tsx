'use client';

import { useDiaryStore } from '../../store/diaryStore';
import { useAuthStore } from '../../store/authStore';

export default function PublicFeed() {
  const getPublicEntries = useDiaryStore((s) => s.getPublicEntries);
  const users = useAuthStore((s) => s.users);

  const entries = getPublicEntries()
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  if (entries.length === 0) {
    return <div className="text-gray-400 text-center mt-8">공개된 일기가 없습니다.</div>;
  }

  return (
    <div className="mt-12">
      <h3 className="text-lg font-bold mb-3">공개 피드</h3>
      <ul className="space-y-3">
        {entries.map((entry) => {
          const user = users.find((u) => u.id === entry.userId);
          return (
            <li key={entry.id} className="bg-white rounded p-4 flex items-center gap-4 shadow-sm">
              <div className="text-2xl">{entry.emotion.emoji}</div>
              <div className="flex-1">
                <div className="font-semibold">{entry.date}</div>
                <div className="text-sm text-gray-600 truncate">{entry.memo || '(메모 없음)'}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {entry.hashtags.map((tag) => (
                    <span key={tag} className="mr-1">#{tag}</span>
                  ))}
                </div>
                <div className="text-xs text-pastel-blue mt-1">by {user?.nickname || '알 수 없음'}</div>
              </div>
              {/* 상세보기/공감 등은 추후 구현 */}
            </li>
          );
        })}
      </ul>
    </div>
  );
} 