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
      <div className="rounded-[32px] border border-white/10 bg-black/20 p-6 md:p-8">
        <div className="text-center">
          <h1 className="text-3xl font-black">
            {sessionMode === "session" ? "تحدي الجلسة" : `${selectedGameMeta.icon} ${selectedGameMeta.title}`}
          </h1>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            value={side1}
            onChange={(e) => onSide1Change(e.target.value)}
            className="input text-center"
            placeholder="اسم الفريق 1"
          />

          <input
            value={side2}
            onChange={(e) => onSide2Change(e.target.value)}
            className="input text-center"
            placeholder="اسم الفريق 2"
          />
        </div>

        {sessionMode === "quick" ? (
          <>
            <div className="mt-6">
              <label className="mb-2 block text-right text-sm font-bold text-white/75">
                اللعبة
              </label>
              <select
                value={selectedGame}
                onChange={(e) => onSelectedGameChange(e.target.value as GameType)}
                className="input"
              >
                {GAME_OPTIONS.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.icon} {game.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-right text-sm font-bold text-white/75">
                عدد الجولات
              </label>
              <select
                value={rounds}
                onChange={(e) => onRoundsChange(Number(e.target.value))}
                className="input"
              >
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
              </select>
            </div>
          </>
        ) : (
          <div className="mt-6">
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
                        ? "border-cyan-300/40 bg-cyan-400/15"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-lg font-black">
                        {game.icon} {game.title}
                      </span>
                      <span>{isSelected ? "✅" : "⬜"}</span>
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
          <button onClick={onStart} className="btn-primary w-full sm:w-auto sm:min-w-[220px]">
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
  );
}
