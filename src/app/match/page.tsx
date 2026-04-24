'use client';

import { useState } from "react";
import SetupGame from "@/components/SetupGame";

import WordGame from "@/components/match/WordGame";
import QuizGame from "@/components/match/QuizGame";

import type { QuizCategoryKey } from "@/data/quiz";

type GameType = "word" | "quiz";

type Round = {
  game: GameType;
  category: QuizCategoryKey | null;
};

export default function MatchPage() {

  const [side1, setSide1] = useState("");
  const [side2, setSide2] = useState("");

  const [selectedGames, setSelectedGames] = useState<GameType[]>([]);
  const [gameRounds, setGameRounds] = useState<Record<string, number>>({});
  const [quizCategories, setQuizCategories] = useState<QuizCategoryKey[]>([]);

  const [queue, setQueue] = useState<Round[]>([]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);

  // 🧠 بناء الجولات
  function buildQueue(): Round[] {
    const q: Round[] = [];

    selectedGames.forEach((game) => {
      const count = gameRounds[game] || 1;

      for (let i = 0; i < count; i++) {
        const cat =
          game === "quiz"
            ? quizCategories[i % quizCategories.length]
            : null;

        q.push({
          game,
          category: cat,
        });
      }
    });

    return q;
  }

  // ▶️ بدء
  function start() {
    if (selectedGames.length === 0) {
      alert("اختر لعبة");
      return;
    }

    if (selectedGames.includes("quiz") && quizCategories.length === 0) {
      alert("اختر فئة للأسئلة");
      return;
    }

    setQueue(buildQueue());
    setStarted(true);
    setIndex(0);
  }

  // ➡️ الجولة التالية
  function next() {
    if (index + 1 >= queue.length) {
      alert("انتهت اللعبة");
      setStarted(false);
      return;
    }

    setIndex((i) => i + 1);
  }

  const current = queue[index];

  return (
    <main className="p-6 text-white">

      {!started ? (
        <SetupGame
          side1={side1}
          side2={side2}
          setSide1={setSide1}
          setSide2={setSide2}
          selectedGames={selectedGames}
          setSelectedGames={setSelectedGames}
          gameRounds={gameRounds}
          setGameRounds={setGameRounds}
          quizCategories={quizCategories}
          setQuizCategories={setQuizCategories}
          onStart={start}
        />
      ) : (
        <div className="max-w-4xl mx-auto">

          {/* 🎮 خمن الكلمة */}
          {current?.game === "word" && (
            <WordGame
              onRoundEnd={next}
              roundKey={index}
              side1Name={side1}
              side2Name={side2}
            />
          )}

          {/* ❓ Quiz */}
          {current?.game === "quiz" && (
            <QuizGame
              onRoundEnd={next}
              roundKey={index}
              category={current.category}
              side1Name={side1}
              side2Name={side2}
            />
          )}

          {/* 📊 الجولة */}
          <p className="text-center mt-4 text-white/60">
            الجولة {index + 1} من {queue.length}
          </p>

        </div>
      )}
    </main>
  );
}
