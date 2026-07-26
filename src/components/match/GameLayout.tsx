'use client';

export default function GameLayout({
  title,
  side1,
  side2,
  side1Score,
  side2Score,
  turn,
  currentRound = 1,
  children,
}: {
  title: string;
  side1: string;
  side2: string;
  side1Score: number;
  side2Score: number;
  turn: string;
  currentRound?: number;
  children: React.ReactNode;
}) {
  const cleanTurn = turn.trim();
  const cleanSide1 = side1.trim();
  const cleanSide2 = side2.trim();

  const isSide1Turn = cleanTurn === cleanSide1;
  const isSide2Turn = cleanTurn === cleanSide2;

  return (
    <div className="mx-auto w-full max-w-5xl px-3 sm:px-4 lg:px-6">
      <div className="glass rounded-[24px] border border-white/10 bg-[#121028]/80 p-3 text-center shadow-[0_0_30px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-[28px] sm:p-4 lg:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] text-2xl font-black text-white shadow-[0_0_18px_rgba(139,92,246,0.35)]">
            {currentRound}
          </div>

          <div className="min-w-0 flex-1 text-center">
            <h2 className="truncate text-2xl font-black text-white sm:text-3xl">
              {title}
            </h2>
          </div>

          <div className="w-12 shrink-0" />
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* فريق 1 */}
          <div
            className={`rounded-2xl border px-4 py-3 transition-all duration-300 ${
              isSide1Turn
                ? 'scale-[1.02] border-pink-300/60 bg-pink-500/20 shadow-[0_0_25px_rgba(244,114,182,0.25)]'
                : 'border-pink-300/20 bg-pink-500/10 opacity-70'
            }`}
          >
            <p className="text-sm text-white/65">{side1}</p>

            <p className="mt-1 text-3xl font-black text-pink-200 sm:text-4xl">
              {side1Score}
            </p>

            {isSide1Turn && (
              <p className="mt-1 text-xs font-bold text-pink-200">
                يلعب الآن
              </p>
            )}
          </div>

          {/* الدور الحالي */}
          <div
            className={`rounded-2xl border px-4 py-4 transition-all duration-500 ${
              isSide1Turn
                ? 'border-pink-300/60 bg-pink-500/20 shadow-[0_0_30px_rgba(244,114,182,0.28)]'
                : isSide2Turn
                  ? 'border-cyan-300/60 bg-cyan-400/20 shadow-[0_0_30px_rgba(34,211,238,0.28)]'
                  : 'border-white/20 bg-white/10'
            }`}
          >
            <p className="text-sm font-bold text-white/65">
              الدور الحالي
            </p>

            <p
              className={`mt-2 text-3xl font-black sm:text-4xl ${
                isSide1Turn
                  ? 'text-pink-200'
                  : isSide2Turn
                    ? 'text-cyan-200'
                    : 'text-white'
              }`}
            >
              دور {turn}
            </p>

            <div className="mt-3 flex items-center justify-center gap-2">
              <span
                className={`h-3 w-3 animate-pulse rounded-full ${
                  isSide1Turn
                    ? 'bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.9)]'
                    : isSide2Turn
                      ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]'
                      : 'bg-white/50'
                }`}
              />

              <span className="text-xs font-bold text-white/65">
                يلعب الآن
              </span>
            </div>
          </div>

          {/* فريق 2 */}
          <div
            className={`rounded-2xl border px-4 py-3 transition-all duration-300 ${
              isSide2Turn
                ? 'scale-[1.02] border-cyan-300/60 bg-cyan-400/20 shadow-[0_0_25px_rgba(34,211,238,0.25)]'
                : 'border-cyan-300/20 bg-cyan-400/10 opacity-70'
            }`}
          >
            <p className="text-sm text-white/65">{side2}</p>

            <p className="mt-1 text-3xl font-black text-cyan-200 sm:text-4xl">
              {side2Score}
            </p>

            {isSide2Turn && (
              <p className="mt-1 text-xs font-bold text-cyan-200">
                يلعب الآن
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#0d1236]/70 p-3 sm:p-4 lg:p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
