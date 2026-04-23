'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { GlassCard } from '@/components/GlassCard';

type SearchParams = Promise<{
  game?: string;
}>;

function NicknameForm({ game }: { game: string }) {
  const router = useRouter();
  const [name, setName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('nickname');
    if (saved) setName(saved);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;

    localStorage.setItem('nickname', name);
    router.push(`/game/demo?name=${encodeURIComponent(name)}&game=${game}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <GlassCard className="w-full max-w-md p-8 text-center">
        <div className="mb-6 flex justify-center">
          <Logo size={110} />
        </div>

        <h1 className="mb-3 text-3xl font-black">اختر اسمك</h1>
        <p className="mb-6 text-white/80">أدخل اسمًا مستعارًا للعب</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: أبو فيصل"
            className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/60"
          />

          <button className="w-full rounded-2xl bg-white px-5 py-3 font-bold text-red-500 transition hover:scale-105">
            متابعة
          </button>
        </form>
      </GlassCard>
    </main>
  );
}

export default async function NicknamePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const game = params?.game || 'word';

  return <NicknameForm game={game} />;
}
