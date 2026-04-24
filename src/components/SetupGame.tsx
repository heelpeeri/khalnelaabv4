'use client';

import { useRef } from "react";
import { quizCategoryList } from "@/data/quiz";

const GAMES = [
  { id: "word", name: "خمن الكلمة", icon: "💬" },
  { id: "quiz", name: "الأسئلة", icon: "❓" },
  { id: "scramble", name: "حروف بالخلاط", icon: "🧩" },
  { id: "wheel", name: "العجلة", icon: "🎡" },
];

const ROUNDS = [1, 2, 3, 5];

export default function SetupGame({
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

  // ✅ حل خطأ TypeScript هنا
  function playClick() {
    if (clickSound.current) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }
  }

  function toggleGame(id: string) {
    playClick();

    if (selectedGames.includes(id)) {
      setSelectedGames(selectedGames.filter((g: string) => g !== id));
    } else {
      setSelectedGames([...selectedGames, id]);
    }
  }

  function toggleCategory(cat: string) {
    playClick();

    if (quizCategories.includes(cat)) {
      if (quizCategories.length === 1) return;
      setQuizCategories(quizCategories.filter((c: string) => c !== cat));
    } else {
      setQuizCategories([...quizCategories, cat]);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-white intro">

      {/* 🔊 الصوت */}
      <audio ref={clickSound} src="/click.mp3" />

      {/* العنوان */}
      <div className="text-center">
        <h1 className="arcade-title">تحدي الجلسة</h1>
        <p className="arcade-subtitle mt-2">
          اختر الألعاب وحدد الجولات
        </p>
      </div>

      {/* الفرق */}
      <div className="grid grid-cols-2 gap-4">
        <input
          value={side1}
          onChange={e => setSide1(e.target.value)}
          placeholder="الفريق 1"
          className="input text-center text-lg font-bold"
        />
        <input
          value={side2}
          onChange={e => setSide2(e.target.value)}
          placeholder="الفريق 2"
          className="input text-center text-lg font-bold"
        />
      </div>

      {/* الألعاب */}
      <div className="grid gap-4 sm:grid-cols-2">

        {GAMES.map(game => {
          const active = selectedGames.includes(game.id);

          return (
            <div
              key={game.id}
              onClick={() => toggleGame(game.id)}
              className={`arcade-card p-5 cursor-pointer transition-all duration-300
              ${active ? "scale-[1.03]" : "hover:scale-[1.02]"}`}
            >

              <div className="flex justify-between items-center">
                <span className="text-3xl">{game.icon}</span>
                <span className="text-lg">{active ? "✓" : ""}</span>
              </div>

              <h3 className="mt-3 text-lg font-black">{game.name}</h3>

              {/* الجولات */}
              {active && (
                <div className="flex gap-2 mt-4">
                  {ROUNDS.map(r => (
                    <button
                      key={r}
                      onClick={(e) => {
                        e.stopPropagation();
                        playClick();
                        setGameRounds({ ...gameRounds, [game.id]: r });
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition
                      ${
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

              {/* فئات الأسئلة */}
              {game.id === "quiz" && active && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {quizCategoryList.map(cat => {
                    const selected = quizCategories.includes(cat.key);

                    return (
                      <button
                        key={cat.key}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(cat.key);
                        }}
                        className={`transition ${
                          selected
                            ? "arcade-button"
                            : "btn-secondary"
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

      {/* زر البداية */}
      <div className="text-center">
        <button
          onClick={() => {
            playClick();
            onStart();
          }}
          className="arcade-button text-lg px-8 py-4"
        >
          🚀 ابدأ اللعب
        </button>
      </div>

    </div>
  );
}
