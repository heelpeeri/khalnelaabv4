'use client';

import Link from "next/link";
import { quizCategoryList } from "@/data/quiz";
import type { QuizCategoryKey } from "@/data/quiz";

type GameType = "word" | "draw" | "categories" | "scramble" | "wheel" | "quiz";

const GAME_OPTIONS = [
  { id: "quiz", title: "الأسئلة", icon: "❓" },
  { id: "word", title: "خمن الكلمة", icon: "💬" },
  { id: "scramble", title: "حروف بالخلاط", icon: "🧩" },
  { id: "wheel", title: "لف وخمن", icon: "🎡" },
  { id: "categories", title: "إنسان حيوان نبات جماد بلاد", icon: "🌍" },
  { id: "draw", title: "خمن المثل", icon: "✏️" },
];

const ROUND_OPTIONS = [1, 2, 3, 5];

export default function SetupGame({
  side1,
  side2,
  selectedSessionGames,
  sessionGameRounds,
  selectedSessionQuizCategories,
  onSide1Change,
  onSide2Change,
  onToggleSessionGame,
  onSessionGameRoundsChange,
  onToggleSessionQuizCategory,
  onStart,
}: any) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 text-white">

      {/* الفرق */}
      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={side1}
          onChange={(e) => onSide1Change(e.target.value)}
          placeholder="الفريق 1"
          className="input"
        />
        <input
          value={side2}
          onChange={(e) => onSide2Change(e.target.value)}
          placeholder="الفريق 2"
          className="input"
        />
      </div>

      {/* الألعاب */}
      {GAME_OPTIONS.map((game: any) => {
        const active = selectedSessionGames.includes(game.id);
        const rounds = sessionGameRounds[game.id] || 1;

        return (
          <div
            key={game.id}
            className={`rounded-3xl p-5 border ${
              active ? "bg-cyan-400/10 border-cyan-300/40" : "bg-white/5"
            }`}
          >
            {/* عنوان */}
            <div
              onClick={() => onToggleSessionGame(game.id)}
              className="flex justify-between cursor-pointer"
            >
              <p className="text-lg font-black">
                {game.icon} {game.title}
              </p>
              <span>{active ? "✅" : "⬜"}</span>
            </div>

            {/* الجولات */}
            {active && (
              <div className="mt-4 flex gap-2">
                {ROUND_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => onSessionGameRoundsChange(game.id, r)}
                    className={`px-3 py-1 rounded-full ${
                      rounds === r ? "bg-white text-black" : "bg-white/10"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            {/* فئات الأسئلة */}
            {game.id === "quiz" && active && (
              <div className="mt-4 flex flex-wrap gap-2">
                {quizCategoryList.map((cat) => {
                  const selected =
                    selectedSessionQuizCategories.includes(cat.key);

                  return (
                    <button
                      key={cat.key}
                      onClick={() => onToggleSessionQuizCategory(cat.key)}
                      className={`px-3 py-2 rounded-xl text-sm ${
                        selected
                          ? "bg-yellow-300 text-black"
                          : "bg-white/10"
                      }`}
                    >
                      {cat.emoji} {cat.title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* زر */}
      <button onClick={onStart} className="btn-primary w-full">
        ابدأ اللعب
      </button>

      <Link href="/" className="text-center block text-white/60">
        رجوع
      </Link>
    </div>
  );
}
