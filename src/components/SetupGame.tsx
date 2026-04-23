'use client';

import Link from "next/link";

type GameType = "word" | "draw" | "categories" | "scramble" | "wheel" | "quiz";
type SessionMode = "quick" | "session";

const GAME_OPTIONS: {
  id: GameType;
  title: string;
  icon: string;
}[] = [
  { id: "quiz", title: "الأسئلة", icon: "❓" },
  { id: "word", title: "خمن الكلمة", icon: "💬" },
  { id: "scramble", title: "حروف بالخلاط", icon: "🧩" },
  { id: "wheel", title: "لف وخمن", icon: "🎡" },
  { id: "categories", title: "إنسان حيوان نبات جماد بلاد", icon: "🌍" },
  { id: "draw", title: "خمن المثل", icon: "✏️" },
];

const ROUND_OPTIONS = [1, 3, 5];

export default function SetupGame({
  sessionMode,
  side1,
  side2,
  rounds,
  selectedGame,
  selectedSessionGames,
  onSide1Change,
  onSide2Change,
  onRoundsChange,
  onSelectedGameChange,
  onToggleSessionGame,
  onStart,
}: {
  sessionMode: SessionMode;
  side1: string;
  side2: string;
  rounds: number;
  selectedGame: GameType;
  selectedSessionGames: GameType[];
  onSide1Change: (value: string) => void;
  onSide2Change: (value: string) => void;
  onRoundsChange: (value: number) => void;
  onSelectedGameChange: (value: GameType) => void;
  onToggleSessionGame: (value: GameType) => void;
  onStart: () => void;
}) {
  const selectedGameMeta =
    GAME_OPTIONS.find((g) => g.id === selectedGame) ?? GAME_OPTIONS[1];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-[34px] border border-white/10 bg-black/20 p-5 shadow-[0_0_30px_rgba(0,0,0,0.22)] backdrop-blur-sm md:p-8">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
            {sessionMode === "session" ? "SESSION SETUP" : "QUICK SETUP"}
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-5xl">
            {sessionMode === "session"
              ? "تحدي الجلسة"
              : `${selectedGameMeta.icon} ${selectedGameMeta.title}`}
          </h1>

          <p className="mt-3 text-sm text-white/65 md:text-base">
            تقدر تغيّر أسماء الفرق قبل البداية.
          </p>
        </div>

        <div className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.03] p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="group block">
              <span className="mb-2 block text-right text-sm font-bold text-white/65">
                الفريق 1
              </span>

              <div className="relative">
                <input
                  value={side1}
                  onChange={(e) => onSide1Change(e.target.value)}
                  className="input h-16 rounded-[24px] border-white/10 bg-white/[0.04] pr-5 text-center text-xl font-black transition duration-200 focus:border-cyan-300/30 focus:bg-white/[0.06]"
                  placeholder="فريق 1"
                />

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-white/35 transition group-focus-within:text-cyan-200/70">
                  قابل للتعديل
                </span>
              </div>
            </label>

            <label className="group block">
              <span className="mb-2 block text-right text-sm font-bold text-white/65">
                الفريق 2
              </span>

              <div className="relative">
                <input
                  value={side2}
                  onChange={(e) => onSide2Change(e.target.value)}
                  className="input h-16 rounded-[24px] border-white/10 bg-white/[0.04] pr-5 text-center text-xl font-black transition duration-200 focus:border-pink-300/30 focus:bg-white/[0.06]"
                  placeholder="فريق 2"
                />

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-white/35 transition group-focus-within:text-pink-200/70">
                  قابل للتعديل
                </span>
              </div>
            </label>
          </div>

          {sessionMode === "quick" ? (
            <div className="mt-8 text-center">
              <p className="text-3xl font-black md:text-5xl">عدد الجولات</p>

              <div className="mx-auto mt-6 w-full max-w-[340px] rounded-full border border-white/10 bg-white/[0.05] p-1.5 shadow-[inset_0_0_10px_rgba(255,255,255,0.03)]">
                <div className="grid grid-cols-3 gap-1.5">
                  {ROUND_OPTIONS.map((value) => {
                    const active = rounds === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => onRoundsChange(value)}
                        className={`h-16 rounded-full text-3xl font-black transition duration-200 ${
                          active
                            ? "bg-white text-[#120022] shadow-[0_0_20px_rgba(255,255,255,0.22)]"
                            : "bg-transparent text-white/85 hover:bg-white/10"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="mt-4 text-sm text-white/55">
                اختر عدد الجولات ثم ابدأ مباشرة.
              </p>
            </div>
          ) : (
            <div className="mt-8">
              <label className="mb-3 block text-right text-sm font-bold text-white/75">
                اختر ألعاب الجلسة
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                {GAME_OPTIONS.map((game) => {
                  const isSelected = selectedSessionGames.includes(game.id);

                  return (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => onToggleSessionGame(game.id)}
                      className={`rounded-2xl border p-4 text-right transition ${
                        isSelected
                          ? "border-cyan-300/40 bg-cyan-400/15 shadow-[0_0_18px_rgba(34,211,238,0.08)]"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-lg font-black">
                          {game.icon} {game.title}
                        </span>
                        <span className="text-sm">{isSelected ? "✅" : "⬜"}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-right text-sm text-white/65">
                عدد الجولات: {selectedSessionGames.length}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={onStart}
              className="btn-primary w-full sm:w-auto sm:min-w-[260px] sm:px-10 sm:py-4 text-lg font-black active:scale-95"
            >
              ابدأ اللعب
            </button>

            <Link
              href="/"
              className="text-center text-sm font-bold text-white/60 transition hover:text-white"
            >
              رجوع
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
