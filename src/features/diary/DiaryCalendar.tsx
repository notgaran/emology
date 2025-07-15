'use client';

import { useAuthStore } from '../../store/authStore';
import { useDiaryStore } from '../../store/diaryStore';
import { useState } from 'react';

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export default function DiaryCalendar() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const getUserEntries = useDiaryStore((s) => s.getUserEntries);
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selected, setSelected] = useState<string | null>(null);

  if (!currentUser) return null;

  const entries = getUserEntries(currentUser.id);
  const entryMap = Object.fromEntries(
    entries.map((e) => [e.date, e])
  );

  const days = getMonthDays(viewDate.year, viewDate.month);
  const firstDayOfWeek = new Date(viewDate.year, viewDate.month, 1).getDay();

  const prevMonth = () => {
    setViewDate((v) =>
      v.month === 0
        ? { year: v.year - 1, month: 11 }
        : { year: v.year, month: v.month - 1 }
    );
  };
  const nextMonth = () => {
    setViewDate((v) =>
      v.month === 11
        ? { year: v.year + 1, month: 0 }
        : { year: v.year, month: v.month + 1 }
    );
  };

  const selectedEntry = selected ? entryMap[selected] : null;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="px-2 py-1 text-pastel-blue">◀</button>
        <span className="font-bold text-lg">
          {viewDate.year}년 {viewDate.month + 1}월
        </span>
        <button onClick={nextMonth} className="px-2 py-1 text-pastel-blue">▶</button>
      </div>
      <div className="grid grid-cols-7 gap-1 bg-gray-100 rounded p-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="text-center font-semibold text-xs text-gray-500">{d}</div>
        ))}
        {Array(firstDayOfWeek).fill(0).map((_, i) => (
          <div key={"empty-" + i}></div>
        ))}
        {days.map((date) => {
          const dstr = date.toISOString().slice(0, 10);
          const entry = entryMap[dstr];
          return (
            <button
              key={dstr}
              className={`aspect-square w-8 sm:w-10 rounded flex flex-col items-center justify-center border ${entry ? 'bg-pastel-blue text-white' : 'bg-white'} ${selected === dstr ? 'ring-2 ring-pastel-blue' : ''}`}
              onClick={() => setSelected(dstr)}
            >
              <span className="text-xs">{date.getDate()}</span>
              <span className="text-lg">{entry?.emotion.emoji}</span>
            </button>
          );
        })}
      </div>
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded shadow-lg p-6 min-w-[260px] max-w-xs" onClick={e => e.stopPropagation()}>
            <div className="text-2xl mb-2">{selectedEntry.emotion.emoji} {selectedEntry.emotion.label}</div>
            <div className="text-sm text-gray-500 mb-1">{selectedEntry.date}</div>
            <div className="mb-2">{selectedEntry.memo || '(메모 없음)'}</div>
            <div className="text-xs text-gray-400 mb-2">
              {selectedEntry.hashtags.map((tag) => (
                <span key={tag} className="mr-1">#{tag}</span>
              ))}
            </div>
            <button className="mt-2 px-4 py-1 bg-pastel-blue text-white rounded" onClick={() => setSelected(null)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
} 