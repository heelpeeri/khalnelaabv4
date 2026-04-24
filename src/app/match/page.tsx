'use client';

import { useState } from "react";
import SetupGame from "@/components/SetupGame";

import WordGame from "@/components/match/WordGame";
import QuizGame from "@/components/match/QuizGame";

export default function MatchPage() {

  const [side1, setSide1] = useState("");
  const [side2, setSide2] = useState("");

  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [gameRounds, setGameRounds] = useState<any>({});
  const [quizCategories, setQuizCategories] = useState<string[]>([]);

  const [queue, setQueue] = useState<any[]>([]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);

  function buildQueue() {
    let q: any[] = [];

    selectedGames.forEach(game => {
      const count = gameRounds[game] || 1;

      for (let i = 0; i < count; i++) {
        const cat =
          game === "quiz"
            ? quizCategories[i % quizCategories.length]
            : null;

        q.push({ game, category: cat });
      }
    });

    return q;
  }

  function start() {
    if (selectedGames.length === 0) return alert("اختر لعبة");

    if (selectedGames.includes("quiz") && quizCategories.length === 0) {
      return alert("اختر فئة");
    }

    setQueue(buildQueue());
    setStarted(true);
    setIndex(0);
  }

  function next() {
    if (index + 1 >= queue.length) {
      alert("انتهت اللعبة");
      setStarted(false);
      return;
    }
    setIndex(index + 1);
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

          {current?.game === "word" && (
            <WordGame onRoundEnd={next} roundKey={index} />
          )}

          {current?.game === "quiz" && (
            <QuizGame onRoundEnd={next} roundKey={index} category={current.category} />
          )}

          <p className="text-center mt-4">
            الجولة {index + 1} من {queue.length}
          </p>

        </div>
      )}
    </main>
  );
}
