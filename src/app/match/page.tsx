'use client';

import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import SetupGame from "@/components/SetupGame";
import WordGame from "@/components/match/WordGame";
import ProverbGame from "@/components/match/ProverbGame";
import CategoriesGame from "@/components/match/CategoriesGame";
import ScrambleGame from "@/components/match/ScrambleGame";
import WheelGame from "@/components/match/WheelGame";
import QuizGame from "@/components/match/QuizGame";

import type { GameType, SessionMode, WinnerType } from "@/types/game";

const GAME_OPTIONS = [
  { id: "quiz", title: "الأسئلة", icon: "❓", hint: "اختر فئة وجاوب." },
  { id: "word", title: "خمن الكلمة", icon: "💬", hint: "خمن الكلمة." },
  { id: "scramble", title: "حروف بالخلاط", icon: "🧩", hint: "رتب الحروف." },
  { id: "wheel", title: "لف وخمن", icon: "🎡", hint: "لف العجلة." },
  { id: "categories", title: "إنسان حيوان نبات جماد بلاد", icon: "🌍", hint: "نفس الحرف." },
  { id: "draw", title: "خمن المثل", icon: "✏️", hint: "خمن المثل." },
];

function CountdownOverlay({ count }: { count: number | null }) {
  if (count === null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm">
      <div className="rounded-[36px] border border-white/20 bg-[#130019]/90 px-16 py-12 text-center shadow-2xl animate-fade-in-up">
        <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
          استعدوا
        </p>
        <p className="mt-4 text-8xl font-black text-white">
          {count === 0 ? "يلا!" : count}
        </p>
      </div>
    </div>
  );
}

function FinalWinnerOverlay({
  show,
  winnerName,
  isDraw,
  onClose,
}: {
  show: boolean;
  winnerName: string;
  isDraw: boolean;
  onClose: () => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="arcade-card w-full max-w-2xl p-8 text-center md:p-10 animate-fade-in-up">
        
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/80">
          النتيجة
        </p>

        <h2 className="arcade-title mt-5 animate-bounce">
          {isDraw ? "تعادل!" : "كفووو!"}
        </h2>

        <p className="arcade-winner mt-6">
          {isDraw ? "الفريقين" : `الفائز: ${winnerName}`}
        </p>

        <button
          onClick={onClose}
          className="arcade-button mt-8"
          type="button"
        >
          ابدأ من جديد
        </button>
      </div>
    </div>
  );
}

export default function MatchPage() {
  const [side1, setSide1] = useState("");
  const [side2, setSide2] = useState("");
  const [rounds, setRounds] = useState(3);

  const [started, setStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [side1Score, setSide1Score] = useState(0);
  const [side2Score, setSide2Score] = useState(0);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [roundReady, setRoundReady] = useState(true);
  const [roundSeed, setRoundSeed] = useState(1);

  const [showWinner, setShowWinner] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const game: GameType = "word"; // مؤقت

  const isDraw = side1Score === side2Score;
  const winnerName = isDraw
    ? "الفريقين"
    : side1Score > side2Score
    ? side1
    : side2;

  function startGame() {
    const finalSide1 = side1.trim() || "فريق 1";
    const finalSide2 = side2.trim() || "فريق 2";

    setSide1(finalSide1);
    setSide2(finalSide2);

    setStarted(true);
    setCurrentRound(1);
    setSide1Score(0);
    setSide2Score(0);
    setGameEnded(false);
    setRoundReady(true);
  }

  function beginRound() {
    setCountdown(3);
  }

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setTimeout(() => {
        setCountdown(null);
        setRoundReady(false);
        setRoundSeed((s) => s + 1);
      }, 400);
      return;
    }

    const t = setTimeout(() => setCountdown((c) => (c ? c - 1 : 0)), 900);
    return () => clearTimeout(t);
  }, [countdown]);

  function endRound(winner?: WinnerType) {
    if (winner === "side1") setSide1Score((s) => s + 1);
    if (winner === "side2") setSide2Score((s) => s + 1);

    if (currentRound >= rounds) {
      setGameEnded(true);
      return;
    }

    setCurrentRound((r) => r + 1);
    setRoundReady(true);
  }

  return (
    <main className="min-h-screen px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">

        {!started ? (
          <SetupGame
            sessionMode="quick"
            side1={side1}
            side2={side2}
            rounds={rounds}
            selectedGame="word"
            selectedSessionGames={[]}
            onSide1Change={setSide1}
            onSide2Change={setSide2}
            onRoundsChange={setRounds}
            onSelectedGameChange={() => {}}
            onToggleSessionGame={() => {}}
            onStart={startGame}
          />
        ) : !gameEnded ? (
          <>
            {roundReady ? (
              <div className="text-center animate-fade-in-up">
                <h2 className="text-4xl font-black">
                  الجولة {currentRound}
                </h2>

                <button
                  onClick={beginRound}
                  className="btn-primary mt-6"
                >
                  ابدأ الجولة
                </button>
              </div>
            ) : (
              <WordGame
                onRoundEnd={endRound}
                roundKey={roundSeed}
                side1Name={side1}
                side2Name={side2}
              />
            )}
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-black">انتهت اللعبة</h2>
          </div>
        )}
      </div>

      <CountdownOverlay count={countdown} />

      <FinalWinnerOverlay
        show={gameEnded}
        winnerName={winnerName}
        isDraw={isDraw}
        onClose={() => window.location.reload()}
      />
    </main>
  );
}
