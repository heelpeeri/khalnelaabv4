'use client';

import type { ReactNode } from 'react';

type TeamSide = 'side1' | 'side2' | 'both';

type GameLayoutProps = {
  title: string;
  side1: string;
  side2: string;

  side1Score: ReactNode;
  side2Score: ReactNode;

  turn: string;
  turnSide?: TeamSide;

  currentRound?: number;
  children: ReactNode;
};

function normalizeTeamName(value: string) {
  return value
    .trim()
    .replace(/^الدور\s+الحالي\s*/u, '')
    .replace(/^الدور\s+على\s+/u, '')
    .replace(/^دور\s+/u, '')
    .replace(/\s+/g, ' ');
}

export default function GameLayout({
  title,
  side1,
  side2,
  side1Score,
  side2Score,
  turn,
  turnSide,
  currentRound = 1,
  children,
}: GameLayoutProps) {
  const cleanTurn = normalizeTeamName(turn);
  const cleanSide1 = normalizeTeamName(side1);
  const cleanSide2 = normalizeTeamName(side2);

  /*
    إذا اللعبة أرسلت turnSide نستخدمه مباشرة.

    وإذا ما أرسلته، نحاول نحدد الفريق
    من اسم الفريق نفسه.
  */
  const detectedSide: TeamSide | null =
    turnSide ??
    (cleanTurn === cleanSide1 || cleanTurn === 'فريق 1'
      ? 'side1'
      : cleanTurn === cleanSide2 || cleanTurn === 'فريق 2'
        ? 'side2'
        : null);

  const isBothTurn = detectedSide === 'both';

  const isSide1Turn =
    detectedSide === 'side1' || isBothTurn;

  const isSide2Turn =
    detectedSide === 'side2' || isBothTurn;

  /*
    النص الظاهر في الوسط
  */
  const displayedTurn =
    isBothTurn
      ? turn
      : detectedSide === 'side1'
        ? side1
        : detectedSide === 'side2'
          ? side2
          : cleanTurn;

  return (
    <div className="mx-auto w-full max-w-5xl px-3 sm:px-4 lg:px-6">
      <div className="glass rounded-[24px] border border-white/10 bg-[#121028]/80 p-3 text-center shadow-[0_0_30px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-[28px] sm:p-4 lg:p-6">

        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">

          {/* Round */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] text-2xl font-black text-white shadow-[0_0_18px_rgba(139,92,246,0.35)]">
            {currentRound}
          </div>

          {/* Title */}
          <div className="min-w-0 flex-1 text-center">
            <h2 className="truncate text-2xl font-black text-white sm:text-3xl">
              {title}
            </h2>
          </div>

          {/* Keeps title centered */}
          <div className="w-12 shrink-0" />
        </div>

        {/* Teams + Current Turn */}
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">

          {/* Team 1 */}
          <div
            className={`flex min-h-[128px] flex-col items-center justify-center rounded-2xl border px-4 py-4 transition-all duration-500 ${
              isSide1Turn
                ? 'scale-[1.02] border-fuchsia-300/70 bg-gradient-to-br from-fuchsia-500/30 via-pink-500/20 to-purple-500/15 shadow-[0_0_32px_rgba(217,70,239,0.32)]'
                : 'border-fuchsia-300/15 bg-fuchsia-500/[0.06] opacity-50'
            }`}
          >
            <p
              className={`text-sm font-bold transition-colors duration-500 ${
                isSide1Turn
                  ? 'text-fuchsia-100'
                  : 'text-white/45'
              }`}
            >
              {side1}
            </p>

            <div
              className={`mt-2 flex min-h-[52px] items-center justify-center text-4xl font-black leading-none transition-all duration-500 sm:text-5xl ${
                isSide1Turn
                  ? 'text-fuchsia-100'
                  : 'text-fuchsia-200/50'
              }`}
            >
              {side1Score}
            </div>
          </div>

          {/* Current Turn */}
          <div
            className={`flex min-h-[128px] flex-col items-center justify-center rounded-2xl border px-4 py-4 transition-all duration-500 ${
              isBothTurn
                ? 'border-purple-300/80 bg-gradient-to-r from-fuchsia-500/30 via-purple-500/25 to-cyan-400/30 shadow-[0_0_40px_rgba(168,85,247,0.35)]'
                : isSide1Turn
                  ? 'border-fuchsia-300/80 bg-gradient-to-br from-fuchsia-500/35 via-pink-500/25 to-purple-500/20 shadow-[0_0_40px_rgba(217,70,239,0.38)]'
                  : isSide2Turn
                    ? 'border-cyan-300/80 bg-gradient-to-br from-cyan-400/35 via-sky-500/25 to-blue-500/20 shadow-[0_0_40px_rgba(34,211,238,0.38)]'
                    : 'border-white/20 bg-white/10'
            }`}
          >
            <p className="text-sm font-bold text-white/65">
              {isBothTurn ? 'اللعب الآن' : 'الدور الحالي'}
            </p>

            <p
              className={`mt-2 text-3xl font-black leading-tight transition-colors duration-500 sm:text-4xl ${
                isBothTurn
                  ? 'text-white'
                  : isSide1Turn
                    ? 'text-fuchsia-50'
                    : isSide2Turn
                      ? 'text-cyan-50'
                      : 'text-white'
              }`}
            >
              {displayedTurn}
            </p>
          </div>

          {/* Team 2 */}
          <div
            className={`flex min-h-[128px] flex-col items-center justify-center rounded-2xl border px-4 py-4 transition-all duration-500 ${
              isSide2Turn
                ? 'scale-[1.02] border-cyan-300/70 bg-gradient-to-br from-cyan-400/30 via-sky-500/20 to-blue-500/15 shadow-[0_0_32px_rgba(34,211,238,0.32)]'
                : 'border-cyan-300/15 bg-cyan-400/[0.06] opacity-50'
            }`}
          >
            <p
              className={`text-sm font-bold transition-colors duration-500 ${
                isSide2Turn
                  ? 'text-cyan-100'
                  : 'text-white/45'
              }`}
            >
              {side2}
            </p>

            <div
              className={`mt-2 flex min-h-[52px] items-center justify-center text-4xl font-black leading-none transition-all duration-500 sm:text-5xl ${
                isSide2Turn
                  ? 'text-cyan-100'
                  : 'text-cyan-200/50'
              }`}
            >
              {side2Score}
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="rounded-[22px] border border-white/10 bg-[#0d1236]/70 p-3 sm:p-4 lg:p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
