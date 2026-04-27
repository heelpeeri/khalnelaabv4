'use client';

import { useRef } from "react";
import { quizCategoryList } from "@/data/quiz";

const GAMES = [
  { id: "word", name: "خمن الكلمة", icon: "💬" },
  { id: "quiz", name: "الأسئلة", icon: "❓" },
  { id: "scramble", name: "حروف بالخلاط", icon: "🧩" },
  { id: "wheel", name: "لف وخمن", icon: "🎡" },
  { id: "categories", name: "إنسان حيوان نبات جماد بلاد", icon: "🌍" },
  { id: "draw", name: "خمن المثل", icon: "✏️" },
];

const ROUNDS = [1, 3, 5];

export default function SetupGame({
  mode = "session",
  side1,
  side2,
  setSide1,
  setSide2,
  selectedGames,
  setSelectedGames,
  gameRounds,
  setGameRounds,
  quizCategories,
  setQuizCategories,
  onStart,
}: any) {
  const clickSound = useRef<HTMLAudioElement | null>(null);
  const isQuickMode = mode === "quick";

  function playClick() {
    if (clickSound.current) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
  }

  function toggleGame(id: string) {
    playClick();

    if (isQuickMode) return;

    if (selectedGames.includes(id)) {
      setSelectedGames(selectedGames.filter((g: string) => g !== id));
    } else {
      setSelectedGames([...selectedGames, id]);

      if (!gameRounds[id]) {
        setGameRounds({ ...gameRounds, [id]: 1 });
      }
    }
  }

  function toggleCategory(cat: string) {
    playClick();

    if (quizCategories.includes(cat)) {
      setQuizCategories(quizCategories.filter((c: string) => c !== cat));
    } else {
      setQuizCategories([...quizCategories, cat]);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 text-white intro">
      <audio ref={clickSound} src="/click.mp3" />

      <div className="text-center">
        <h1 className="arcade-title">
          {isQuickMode ? "لعبة سريعة" : "تحدي الجلسة"}
        </h1>

        <p className="arcade-subtitle mt-2">
          {isQuickMode
            ? "حدد أسماء الفرق وعدد الجولات"
            : "اختر الألعاب وحدد الجولات"}
        </p>

        <p className="mt-2 text-sm text-white/60">
          {selectedGames.length > 0
            ? isQuickMode
              ? "اللعبة جاهزة، عدّل الجولات وابدأ"
              : `تم اختيار ${selectedGames.length} لعبة`
            : "اختر لعبة للبدء"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          value={side1}
          onChange={(e) => setSide1(e.target.value)}
          placeholder="اختر اسم الفريق"
          className="input text-center text-lg font-bold"
        />

        <input
          value={side2}
          onChange={(e) => setSide2(e.target.value)}
          placeholder="اختر اسم الفريق"
          className="input text-center text-lg font-bold"
        />
      </div>

      <div
        className={
          isQuickMode
            ? "mx-auto grid w-full max-w-2xl grid-cols-1 place-items-center gap-4"
            : "grid gap-4 sm:grid-cols-2"
        }
      >
        {GAMES.map((game) => {
          const active = selectedGames.includes(game.id);

          if (isQuickMode && !active) return null;

          return (
            <div
              key={game.id}
              onClick={() => toggleGame(game.id)}
              className={`arcade-card p-5 transition-all duration-300 ${
                isQuickMode
                  ? "w-full cursor-default scale-[1.03]"
                  : "cursor-pointer " +
                    (active ? "scale-[1.03]" : "hover:scale-[1.02]")
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{game.icon}</span>
                <span className="text-lg">{active ? "✓" : ""}</span>
              </div>

              <h3 className="mt-3 text-lg font-black">{game.name}</h3>

              {active && (
                <div className="mt-4 flex justify-center gap-2">
                  {ROUNDS.map((r) => (
                    <button
                      key={r}
                      onClick={(e) => {
                        e.stopPropagation();
                        playClick();
                        setGameRounds({ ...gameRounds, [game.id]: r });
                      }}
                      className={`rounded-full px-3 py-1 text-sm transition ${
                        gameRounds[game.id] === r
                          ? "arcade-button"
                          : "btn-secondary"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}

              {game.id === "quiz" && active && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {quizCategoryList.map((cat) => {
                    const selected = quizCategories.includes(cat.key);

                    return (
                      <button
                        key={cat.key}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(cat.key);
                        }}
                        className={`transition ${
                          selected ? "arcade-button" : "btn-secondary"
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
      </div>

      <div className="text-center">
        <button
          onClick={() => {
            playClick();
            onStart();
          }}
          className="arcade-button px-8 py-4 text-lg"
        >
          🚀 ابدأ اللعب
        </button>
      </div>
    </div>
  );
}
