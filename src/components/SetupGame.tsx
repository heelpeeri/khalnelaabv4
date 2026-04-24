'use client';

import { useRef } from "react";
import { quizCategoryList } from "@/data/quiz";

const GAMES = [
  { id: "word", name: "خمن الكلمة", icon: "💬", desc: "خمن الكلمة قبل الفريق الثاني" },
  { id: "quiz", name: "الأسئلة", icon: "❓", desc: "أسئلة سريعة من فئات مختلفة" },
  { id: "scramble", name: "حروف بالخلاط", icon: "🧩", desc: "رتب الحروف بسرعة" },
  { id: "wheel", name: "العجلة", icon: "🎡", desc: "لف العجلة وخمن" },
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

  function playClick() {
    clickSound.current?.currentTime = 0;
    clickSound.current?.play();
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
    <div className="max-w-4xl mx-auto space-y-6 text-white animate-fade-in">

      {/* 🔊 sound */}
      <audio ref={clickSound} src="/click.mp3" />

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
              className={`group cursor-pointer rounded-3xl p-5 border transition-all duration-300
              ${
                active
                  ? "bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border-cyan-300/40 scale-[1.03] shadow-[0_0_25px_rgba(0,255,255,0.2)]"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-[1.02]"
              }`}
            >

              <div className="flex items-center justify-between">
                <span className="text-3xl group-hover:scale-110 transition">
                  {game.icon}
                </span>

                <span className="text-xl">
                  {active ? "✓" : ""}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-black">{game.name}</h3>

              <p className="mt-1 text-sm text-white/60">
                {game.desc}
              </p>

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
                          ? "bg-white text-black scale-110"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}

              {/* الفئات */}
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
                        className={`px-3 py-2 rounded-xl text-sm transition
                        ${
                          selected
                            ? "bg-yellow-300 text-black scale-105 shadow"
                            : "bg-white/10 hover:bg-white/20"
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

      {/* زر */}
      <button
        onClick={() => {
          playClick();
          onStart();
        }}
        className="w-full py-4 rounded-2xl font-black text-lg
        bg-gradient-to-r from-orange-400 to-pink-500
        hover:scale-[1.03] active:scale-[0.97]
        transition-all duration-200 shadow-[0_0_20px_rgba(255,100,200,0.4)]"
      >
        🚀 ابدأ اللعب
      </button>

    </div>
  );
}
