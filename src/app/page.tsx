'use client';

import LoginForm from '../features/auth/LoginForm';
import { useAuthStore } from '../store/authStore';
import DiaryForm from '../features/diary/DiaryForm';
import DiaryList from '../features/diary/DiaryList';
import PublicFeed from '../features/diary/PublicFeed';
import DiaryCalendar from '../features/diary/DiaryCalendar';
import UserSettings from '../features/auth/UserSettings';
import DataManagement from '../features/settings/DataManagement';

export default function Home() {
  const currentUser = useAuthStore((s) => s.currentUser);

  if (!currentUser) {
    return <LoginForm />;
  }

  return (
    <main className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">안녕하세요, {currentUser.nickname}님!</h1>
      <p>감정일기 앱에 오신 것을 환영합니다.</p>
      <DiaryForm />
      <UserSettings />
      <DataManagement />
      <DiaryCalendar />
      <DiaryList />
      <PublicFeed />
      {/* 이후 일기/피드/설정 등 메인 UI로 확장 */}
    </main>
  );
}
