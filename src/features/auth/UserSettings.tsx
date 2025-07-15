'use client';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function UserSettings() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const updateNickname = useAuthStore((s) => s.updateNickname);
  const logout = useAuthStore((s) => s.logout);
  const [nickname, setNickname] = useState(currentUser?.nickname || '');
  const [msg, setMsg] = useState('');

  if (!currentUser) return null;

  const handleNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    updateNickname(nickname.trim());
    setMsg('닉네임이 변경되었습니다.');
  };

  return (
    <div className="bg-white rounded shadow p-6 max-w-md mx-auto mt-8 space-y-4">
      <h2 className="text-lg font-bold mb-2">사용자 설정</h2>
      <form onSubmit={handleNickname} className="flex gap-2 items-center">
        <input
          className="border rounded px-3 py-2 flex-1"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
        />
        <button type="submit" className="bg-pastel-blue text-white px-4 py-2 rounded">닉네임 변경</button>
      </form>
      <div className="text-xs text-gray-500">비밀번호 변경/복구는 지원하지 않습니다. (임시 계정)</div>
      <button
        className="w-full bg-gray-200 text-gray-700 py-2 rounded mt-2"
        onClick={logout}
      >
        로그아웃
      </button>
      {msg && <div className="text-green-600 text-sm mt-2">{msg}</div>}
    </div>
  );
} 