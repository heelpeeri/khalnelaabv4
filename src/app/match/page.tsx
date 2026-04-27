'use client';

import { useEffect, useMemo, useState } from "react";
import SetupGame from "@/components/SetupGame";

import WordGame from "@/components/match/WordGame";
import QuizGame from "@/components/match/QuizGame";
import ScrambleGame from "@/components/match/ScrambleGame";
import WheelGame from "@/components/match/WheelGame";
import CategoriesGame from "@/components/match/CategoriesGame";
import ProverbGame from "@/components/match/ProverbGame";

import type { QuizCategoryKey } from "@/data/quiz";
import type { WinnerType } from "@/types/game";

type GameType = "word" | "quiz" | "scramble" | "wheel" | "categories" | "draw";

type Round = {
  game: GameType;
  category: QuizCategoryKey | null;
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function WinnerOverlay({
  show,
  winnerName,
  isDraw,
  onRestart,
}: {
  show: boolean;
  winnerName: string;
  isDraw: boolean;
  onRestart: () => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="arcade-card w-full max-w-2xl p-8 text-center">
        <p className="text-sm font-black text-cyan-300/80">انتهت الجولة</p>

        <h1 className="arcade-title mt-6">
          {isDraw ? "تعادل!" : "كفووو!"}
        </h1>

        <p className="arcade-winner mt-6">
          {isDraw ? "الفريقين قدّها" : `الفائز: ${winnerName}`}
        </p>

        <button onClick={onRestart} className="arcade-button mt-8">
          العب من جديد
        </button>
      </div>
    </div>
  );
}

export default function MatchPage() {
  const [side1, setSide1] = useState("");
  const [side2, setSide2] = useState("");

  const [selectedGames, setSelectedGames] = useState<GameType[]>([]);
  const [gameRounds, setGameRounds] = useState<Record<string, number>>({});
  const [quizCategories, setQuizCategories] = useState<QuizCategoryKey[]>([]);

  const [queue, setQueue] = useState<Round[]>([]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);

  const [side1Score, setSide1Score] = useState(0);
  const [side2Score, setSide2Score] = useState(0);

  const [showWinner, setShowWinner] = useState(false);

  function buildQueue(): Round[] {
    const q: Round[] = [];
    const shuffledCategories = shuffle(quizCategories);

    selectedGames.forEach((game) => {
      const count = gameRounds[game] || 1;

      for (let i = 0; i < count; i++) {
        q.push({
          game,
          category:
            game === "quiz"
              ? shuffledCategories[i % shuffledCategories.length] ?? null
              : null,
        });
      }
    });

    return q;
  }

  function start() {
    if (selectedGames.length === 0) {
      alert("اختر لعبة");
      return;
    }

    if (selectedGames.includes("quiz") && quizCategories.length === 0) {
      alert("اختر فئة للأسئلة");
      return;
    }

    const builtQueue = buildQueue();

    setQueue(builtQueue);
    setStarted(true);
    setIndex(0);
    setSide1(side1.trim() || "فريق 1");
    setSide2(side2.trim() || "فريق 2");
    setSide1Score(0);
    setSide2Score(0);
    setShowWinner(false);
  }

  // ✅ إصلاح quick game
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const game = params.get("game") as GameType | null;
    const category = params.get("category") as QuizCategoryKey | null;

    const validGames: GameType[] = [
      "word",
      "quiz",
      "scramble",
      "wheel",
      "categories",
      "draw",
    ];

    if (!game || !validGames.includes(game)) return;

    if (game === "quiz" && !category) return;

    // 🔥 مهم
    setSelectedGames([game]);
    setGameRounds({ [game]: 1 });

    setQueue([
      {
        game,
        category: game === "quiz" ? category : null,
      },
    ]);

    setSide1("");
    setSide2("");

    setStarted(false); // 👈 أهم سطر
    setIndex(0);
    setSide1Score(0);
    setSide2Score(0);
    setShowWinner(false);
  }, []);

  function finishSession(finalSide1Score: number, finalSide2Score: number) {
    setSide1Score(finalSide1Score);
    setSide2Score(finalSide2Score);
    setStarted(false);
    setShowWinner(true);
  }

  function endRound(winner?: WinnerType) {
    const nextSide1Score = side1Score + (winner === "side1" ? 1 : 0);
    const nextSide2Score = side2Score + (winner === "side2" ? 1 : 0);

    setSide1Score(nextSide1Score);
    setSide2Score(nextSide2Score);

    if (index + 1 >= queue.length) {
      finishSession(nextSide1Score, nextSide2Score);
      return;
    }

    setIndex((i) => i + 1);
  }

  function restart() {
    setStarted(false);
    setShowWinner(false);
    setIndex(0);
    setQueue([]);
    setSide1Score(0);
    setSide2Score(0);
    setSelectedGames([]);
    setGameRounds({});
    setQuizCategories([]);
  }

  const current = queue[index];

  const finalWinnerName = useMemo(() => {
    if (side1Score > side2Score) return side1 || "فريق 1";
    if (side2Score > side1Score) return side2 || "فريق 2";
    return "تعادل";
  }, [side1Score, side2Score, side1, side2]);

  const isDraw = side1Score === side2Score;

  return (
    <main className="min-h-screen p-6 text-white">
      <WinnerOverlay
        show={showWinner}
        winnerName={finalWinnerName}
        isDraw={isDraw}
        onRestart={restart}
      />

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
        <div className="mx-auto max-w-5xl">
          {current?.game === "word" && (
            <WordGame onRoundEnd={endRound} roundKey={index} side1Name={side1} side2Name={side2} />
          )}

          {current?.game === "quiz" && (
            <QuizGame onRoundEnd={endRound} roundKey={index} category={current.category} side1Name={side1} side2Name={side2} />
          )}

          {current?.game === "scramble" && (
            <ScrambleGame onRoundEnd={endRound} roundKey={index} side1Name={side1} side2Name={side2} />
          )}

          {current?.game === "wheel" && (
            <WheelGame onRoundEnd={endRound} roundKey={index} side1Name={side1} side2Name={side2} />
          )}

          {current?.game === "categories" && (
            <CategoriesGame onRoundEnd={endRound} roundKey={index} side1Name={side1} side2Name={side2} />
          )}

          {current?.game === "draw" && (
            <ProverbGame onRoundEnd={endRound} roundKey={index} side1Name={side1} side2Name={side2} />
          )}

          <p className="mt-5 text-center text-sm text-white/50">
            الجولة {index + 1} من {queue.length}
          </p>
        </div>
      )}
    </main>
  );
}
