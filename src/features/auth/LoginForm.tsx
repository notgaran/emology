'use client';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function LoginForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmedEmail = email.trim();
    const trimmedNickname = nickname.trim();
    console.log('회원가입 시도:', { trimmedEmail, trimmedNickname, password });
    if (isSignup) {
      if (!trimmedNickname || !trimmedEmail || !password) {
        setError('모든 항목을 입력하세요.');
        return;
      }
      if (trimmedNickname.length < 2) {
        setError('닉네임은 2자 이상이어야 합니다.');
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
        setError('올바른 이메일 형식을 입력하세요.');
        return;
      }
      if (password.length < 6) {
        setError('비밀번호는 6자 이상이어야 합니다.');
        return;
      }
      const result = await signup(trimmedNickname, trimmedEmail, password);
      if (result.error) setError(result.error);
    } else {
      if (!trimmedEmail || !password) {
        setError('이메일과 비밀번호를 입력하세요.');
        return;
      }
      const result = await login(trimmedEmail, password);
      if (result.error) setError(result.error);
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
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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