'use client';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function LoginForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isSignup) {
      if (!nickname || !username || !password) {
        setError('모든 항목을 입력하세요.');
        return;
      }
      const ok = signup(nickname, username, password);
      if (!ok) setError('이미 존재하는 아이디입니다.');
    } else {
      if (!username || !password) {
        setError('아이디와 비밀번호를 입력하세요.');
        return;
      }
      const ok = login(username, password);
      if (!ok) setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="max-w-xs mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">
        {isSignup ? '회원가입' : '로그인'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {isSignup && (
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        )}
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-pastel-blue text-white py-2 rounded font-semibold"
        >
          {isSignup ? '회원가입' : '로그인'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          className="text-pastel-blue underline text-sm"
          onClick={() => {
            setIsSignup((v) => !v);
            setError('');
          }}
        >
          {isSignup ? '로그인으로' : '회원가입으로'}
        </button>
      </div>
    </div>
  );
} 