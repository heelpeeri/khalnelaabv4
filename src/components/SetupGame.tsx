'use client';

import { quizCategoryList } from "@/data/quiz";

const GAMES = [
  { id: "word", name: "خمن الكلمة" },
  { id: "quiz", name: "الأسئلة" },
  { id: "scramble", name: "حروف بالخلاط" },
  { id: "wheel", name: "العجلة" },
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

  function toggleGame(id: string) {
    if (selectedGames.includes(id)) {
      setSelectedGames(selectedGames.filter((g: string) => g !== id));
    } else {
      setSelectedGames([...selectedGames, id]);
    }
  }

  function toggleCategory(cat: string) {
    if (quizCategories.includes(cat)) {
      if (quizCategories.length === 1) return;
      setQuizCategories(quizCategories.filter((c: string) => c !== cat));
    } else {
      setQuizCategories([...quizCategories, cat]);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white">

      {/* الفرق */}
      <div className="grid grid-cols-2 gap-4">
        <input value={side1} onChange={e => setSide1(e.target.value)} placeholder="الفريق 1" className="input"/>
        <input value={side2} onChange={e => setSide2(e.target.value)} placeholder="الفريق 2" className="input"/>
      </div>

      {/* الألعاب */}
      {GAMES.map(game => {
        const active = selectedGames.includes(game.id);

        return (
          <div key={game.id} className="p-4 rounded-2xl bg-white/5">

            <div onClick={() => toggleGame(game.id)} className="flex justify-between cursor-pointer">
              <p>{game.name}</p>
              <span>{active ? "✅" : "⬜"}</span>
            </div>

            {active && (
              <div className="flex gap-2 mt-3">
                {ROUNDS.map(r => (
                  <button
                    key={r}
                    onClick={() => setGameRounds({ ...gameRounds, [game.id]: r })}
                    className={`px-3 py-1 rounded ${gameRounds[game.id] === r ? "bg-white text-black" : "bg-white/10"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            {game.id === "quiz" && active && (
              <div className="flex flex-wrap gap-2 mt-3">
                {quizCategoryList.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => toggleCategory(cat.key)}
                    className={`px-3 py-1 rounded ${quizCategories.includes(cat.key) ? "bg-yellow-300 text-black" : "bg-white/10"}`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            )}

          </div>
        );
      })}

      <button onClick={onStart} className="btn-primary w-full">ابدأ</button>
    </div>
  );
}
