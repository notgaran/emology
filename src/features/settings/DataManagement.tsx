'use client';

import { useRef, useState } from 'react';

export default function DataManagement() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');

  // 내보내기: 전체 localStorage를 JSON으로 다운로드
  const handleExport = () => {
    const data = {
      auth: localStorage.getItem('auth-store'),
      diary: localStorage.getItem('diary-store'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emotion-diary-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    setMsg('데이터가 내보내졌습니다.');
  };

  // 불러오기: JSON 파일을 읽어 localStorage에 반영
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.auth) localStorage.setItem('auth-store', data.auth);
        if (data.diary) localStorage.setItem('diary-store', data.diary);
        setMsg('데이터가 복원되었습니다. 새로고침 해주세요.');
      } catch {
        setMsg('잘못된 파일입니다.');
      }
    };
    reader.readAsText(file);
  };

  // 초기화: localStorage에서 관련 데이터 삭제
  const handleReset = () => {
    if (window.confirm('정말 모든 데이터를 초기화할까요?')) {
      localStorage.removeItem('auth-store');
      localStorage.removeItem('diary-store');
      setMsg('데이터가 초기화되었습니다. 새로고침 해주세요.');
    }
  };

  return (
    <div className="bg-white rounded shadow p-6 max-w-md mx-auto mt-8 space-y-4">
      <h2 className="text-lg font-bold mb-2">데이터 관리</h2>
      <button className="w-full bg-pastel-blue text-white py-2 rounded" onClick={handleExport}>
        데이터 내보내기 (백업)
      </button>
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImport}
      />
      <button
        className="w-full bg-pastel-blue/80 text-white py-2 rounded"
        onClick={() => fileInputRef.current?.click()}
      >
        데이터 불러오기 (복원)
      </button>
      <button
        className="w-full bg-gray-200 text-gray-700 py-2 rounded"
        onClick={handleReset}
      >
        데이터 초기화
      </button>
      {msg && <div className="text-green-600 text-sm mt-2">{msg}</div>}
      <div className="text-xs text-gray-500 mt-2">내보내기/불러오기/초기화는 브라우저 로컬 데이터에만 적용됩니다.</div>
    </div>
  );
} 