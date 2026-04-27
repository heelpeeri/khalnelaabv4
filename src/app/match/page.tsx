'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
type ModeType = "session" | "quick";

type Round = {
  game: GameType;
  category: QuizCategoryKey | null;
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// 🔥 اسم اللعبة
function getGameName(game: GameType) {
  switch (game) {
    case "word":
      return "💬 خمن الكلمة";
    case "quiz":
      return "❓ الأسئلة";
    case "scramble":
      return "🧩 حروف بالخلاط";
    case "wheel":
      return "🎡 لف وخمن";
    case "categories":
      return "🌍 فئات";
    case "draw":
      return "✏️ خمن المثل";
  }
}

function WinnerOverlay({
  show,
  winnerName,
  isDraw,
  mode,
  onRestart,
  onGoHome,
}: any) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="arcade-card p-8 text-center">
        <h1 className="text-4xl font-black">
          {isDraw ? "تعادل!" : "كفووو!"}
        </h1>

        <p className="mt-4">
          {isDraw ? "الفريقين قدّها" : `الفائز: ${winnerName}`}
        </p>

        <div className="mt-6 flex gap-3 justify-center">
          <button onClick={onRestart} className="btn-primary">
            تحدي جديد
          </button>
          <button onClick={onGoHome} className="btn-secondary">
            الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MatchPage() {
  const router = useRouter();

  const [mode, setMode] = useState<ModeType>("session");

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

  // 🔥 الجديد
  const [phase, setPhase] = useState<"setup" | "countdown" | "playing" | "transition">("setup");
  const [countdown, setCountdown] = useState(3);

  function buildQueue(): Round[] {
    const q: Round[] = [];
    const shuffledCategories = shuffle(quizCategories);

    selectedGames.forEach((game) => {
      const count = game === "quiz" ? 1 : gameRounds[game] || 1;

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
    const builtQueue = buildQueue();

    setQueue(builtQueue);
    setIndex(0);
    setSide1(side1 || "فريق 1");
    setSide2(side2 || "فريق 2");

    setPhase("countdown"); // 🔥 بدل started
    setCountdown(3);
  }

  // 🔥 countdown
  useEffect(() => {
    if (phase !== "countdown") return;

    if (countdown === 0) {
      setPhase("playing");
      setStarted(true);
      return;
    }

    const t = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 800);

    return () => clearTimeout(t);
  }, [phase, countdown]);

  function endRound(winner?: WinnerType) {
    const next1 = side1Score + (winner === "side1" ? 1 : 0);
    const next2 = side2Score + (winner === "side2" ? 1 : 0);

    setSide1Score(next1);
    setSide2Score(next2);

    if (index + 1 >= queue.length) {
      setShowWinner(true);
      return;
    }

    setPhase("transition");

    setTimeout(() => {
      setIndex((i) => i + 1);
      setPhase("playing");
    }, 1500);
  }

  function restart() {
    setStarted(false);
    setShowWinner(false);
    setIndex(0);
    setQueue([]);
    setPhase("setup");
  }

  function goHome() {
    router.push("/");
  }

  const current = queue[index];

  return (
    <main className="min-h-screen p-6 text-white">

      {/* 🔥 countdown */}
      {phase === "countdown" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[999]">
          <div className="text-center">
            <p className="mb-4">استعدوا</p>
            <p className="text-7xl font-black">
              {countdown === 0 ? "يلا!" : countdown}
            </p>
          </div>
        </div>
      )}

      {/* 🔥 transition */}
      {phase === "transition" && queue[index + 1] && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[999]">
          <div className="text-center">
            <p className="mb-3">الجولة الجاية</p>
            <p className="text-3xl font-black">
              {getGameName(queue[index + 1].game)}
            </p>
          </div>
        </div>
      )}

      <WinnerOverlay
        show={showWinner}
        winnerName={side1Score > side2Score ? side1 : side2}
        isDraw={side1Score === side2Score}
        mode={mode}
        onRestart={restart}
        onGoHome={goHome}
      />

      {!started ? (
        <SetupGame
          mode={mode}
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
        </div>
      )}
    </main>
  );
}
