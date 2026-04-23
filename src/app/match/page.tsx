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


const GAME_OPTIONS: {
  id: GameType;
  title: string;
  icon: string;
  hint: string;
}[] = [
  { id: "quiz", title: "الأسئلة", icon: "❓", hint: "اختر فئة وجاوب." },
  { id: "word", title: "خمن الكلمة", icon: "💬", hint: "خمن الكلمة حرف حرف." },
  { id: "scramble", title: "حروف بالخلاط", icon: "🧩", hint: "رتب الحروف بأسرع وقت." },
  { id: "wheel", title: "لف وخمن", icon: "🎡", hint: "لف العجلة ثم خمن." },
  { id: "categories", title: "إنسان حيوان نبات جماد بلاد", icon: "🌍", hint: "كل الإجابات بنفس الحرف." },
  { id: "draw", title: "خمن المثل", icon: "✏️", hint: "خمن المثل من الإيموجي." },
];

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
    <div className="arcade-backdrop fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="arcade-card w-full max-w-2xl p-8 text-center md:p-10">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/80">
          FINAL RESULT
        </p>

        <h2 className="arcade-title mt-5">
          {isDraw ? "DRAW!" : "LEVEL UP!"}
        </h2>

        <p className="arcade-winner mt-6">
          {isDraw ? "تعادل" : winnerName}
        </p>

        <button
          onClick={onClose}
          className="arcade-button mt-8"
          type="button"
        >
          START
        </button>
      </div>
    </div>
  );
}

function CountdownOverlay({ count }: { count: number | null }) {
  if (count === null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm">
      <div className="rounded-[36px] border border-white/20 bg-[#130019]/90 px-16 py-12 text-center shadow-2xl">
        <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
          GET READY
        </p>
        <p className="mt-4 text-8xl font-black text-white">{count}</p>
      </div>
    </div>
  );
}

export default function MatchPage() {
  const [sessionMode, setSessionMode] = useState<SessionMode>("quick");

  const [side1, setSide1] = useState("فريق 1");
  const [side2, setSide2] = useState("فريق 2");
  const [rounds, setRounds] = useState(3);

  const [selectedGame, setSelectedGame] = useState<GameType>("word");
  const [selectedSessionGames, setSelectedSessionGames] = useState<GameType[]>([
    "quiz",
    "word",
    "scramble",
  ]);

  const [started, setStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [side1Score, setSide1Score] = useState(0);
  const [side2Score, setSide2Score] = useState(0);

  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [roundReady, setRoundReady] = useState(true);
  const [roundSeed, setRoundSeed] = useState(1);

  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizQuestionTotal, setQuizQuestionTotal] = useState(0);

  const [showFinalWinnerOverlay, setShowFinalWinnerOverlay] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");
    const game = params.get("game");

    if (modeParam === "session") {
      setSessionMode("session");
      return;
    }

    setSessionMode("quick");

    if (
      game === "word" ||
      game === "draw" ||
      game === "categories" ||
      game === "scramble" ||
      game === "wheel" ||
      game === "quiz"
    ) {
      setSelectedGame(game);
    }
  }, []);

  useEffect(() => {
    if (gameEnded) {
      setShowFinalWinnerOverlay(true);
    }
  }, [gameEnded]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      const timeout = setTimeout(() => {
        setCountdown(null);
        setRoundReady(false);
        setRoundSeed((s) => s + 1);
      }, 150);

      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCountdown((prev) => (prev === null ? null : prev - 1));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [countdown]);

  const activeGame =
    sessionMode === "session"
      ? selectedSessionGames[currentRound - 1] ?? selectedSessionGames[0] ?? "word"
      : selectedGame;

  const gameMeta = useMemo(() => {
    return (
      GAME_OPTIONS.find((game) => game.id === activeGame) ?? GAME_OPTIONS[1]
    );
  }, [activeGame]);

  const isDraw = side1Score === side2Score;
  const finalWinnerName = isDraw
    ? "الفريقان"
    : side1Score > side2Score
    ? side1
    : side2;

  function toggleSessionGame(gameId: GameType) {
    setSelectedSessionGames((prev) => {
      if (prev.includes(gameId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== gameId);
      }
      return [...prev, gameId];
    });
  }

  function startGame() {
    if (!side1.trim() || !side2.trim()) return;
    if (sessionMode === "session" && selectedSessionGames.length === 0) return;

    const nextRounds =
      sessionMode === "session" ? selectedSessionGames.length : rounds;

    setStarted(true);
    setCurrentRound(1);
    setSide1Score(0);
    setSide2Score(0);
    setGameEnded(false);
    setShowFinalWinnerOverlay(false);
    setRoundReady(true);
    setRoundSeed(1);
    setQuizQuestionIndex(0);
    setQuizQuestionTotal(0);
    setRounds(nextRounds);
    setCountdown(null);
  }

  function beginRound() {
    if (countdown !== null) return;
    setCountdown(3);
  }

  function endRound(winner?: WinnerType) {
    if (winner) {
      chooseWinner(winner);
      return;
    }
    setShowWinnerModal(true);
  }

  function chooseWinner(winner: WinnerType) {
    if (winner === "side1") setSide1Score((s) => s + 1);
    if (winner === "side2") setSide2Score((s) => s + 1);

    setShowWinnerModal(false);
    setQuizQuestionIndex(0);
    setQuizQuestionTotal(0);

    if (currentRound >= rounds) {
      setGameEnded(true);
      return;
    }

    setCurrentRound((r) => r + 1);
    setRoundReady(true);
  }

  function resetGame() {
    setStarted(false);
    setCurrentRound(1);
    setSide1Score(0);
    setSide2Score(0);
    setShowWinnerModal(false);
    setGameEnded(false);
    setShowFinalWinnerOverlay(false);
    setRoundReady(true);
    setRoundSeed(1);
    setQuizQuestionIndex(0);
    setQuizQuestionTotal(0);
    setCountdown(null);
    setRounds(sessionMode === "session" ? selectedSessionGames.length || 1 : 3);
  }

  const currentGameBoard =
    activeGame === "word" ? (
      <WordGame
  onRoundEnd={endRound}
  roundKey={roundSeed}
  side1Name={side1}
  side2Name={side2}
  side1Score={side1Score}
  side2Score={side2Score}
  currentRound={currentRound}
  totalRounds={rounds}
/>
    ) : activeGame === "draw" ? (
      <ProverbGame
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
        roundKey={roundSeed}
      />
    ) : activeGame === "scramble" ? (
      <ScrambleGame
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
        roundKey={roundSeed}
      />
    ) : activeGame === "wheel" ? (
      <WheelGame
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
        roundKey={roundSeed}
      />
    ) : activeGame === "quiz" ? (
      <QuizGame
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
        roundKey={roundSeed}
        onProgressChange={(current: number, total: number) => {
          setQuizQuestionIndex(current);
          setQuizQuestionTotal(total);
        }}
      />
    ) : (
      <CategoriesGame
        side1Name={side1}
        side2Name={side2}
        onRoundEnd={endRound}
        roundKey={roundSeed}
      />
    );

  return (
    <main className="min-h-screen px-4 py-8 text-white">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
              {sessionMode === "session" ? "SESSION MODE" : "QUICK MODE"}
            </p>
            <h1 className="mt-1 text-3xl font-black">
              {sessionMode === "session" ? "تحدي الجلسة" : "تحدي سريع"}
            </h1>
          </div>
          <Logo size={90} />
        </div>

        {!started ? (
          <SetupGame
            sessionMode={sessionMode}
            side1={side1}
            side2={side2}
            rounds={rounds}
            selectedGame={selectedGame}
            selectedSessionGames={selectedSessionGames}
            onSide1Change={setSide1}
            onSide2Change={setSide2}
            onRoundsChange={setRounds}
            onSelectedGameChange={setSelectedGame}
            onToggleSessionGame={toggleSessionGame}
            onStart={startGame}
          />
        ) : !gameEnded ? (
          <div className="mx-auto max-w-6xl">
            {roundReady ? (
              <div className="rounded-[32px] border border-white/10 bg-black/20 p-8 text-center">
                <h2 className="text-5xl font-black">الجولة {currentRound}</h2>
                <p className="mt-4 text-2xl font-bold">
                  {gameMeta.icon} {gameMeta.title}
                </p>

                <button
                  type="button"
                  onClick={beginRound}
                  className="btn-primary mt-8 min-w-[220px]"
                >
                  ابدأ الجولة
                </button>
              </div>
            ) : (
              currentGameBoard
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-black/20 p-8 text-center">
            <p className="text-sm font-black tracking-[0.18em] text-yellow-200/85">
              GAME OVER
            </p>

            <h2 className="mt-2 text-4xl font-black">🏆 انتهى التحدي</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-pink-300/20 bg-pink-500/10 p-5">
                <p className="text-lg font-bold">{side1}</p>
                <p className="mt-2 text-4xl font-black text-yellow-200">
                  {side1Score}
                </p>
              </div>

              <div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5">
                <p className="text-lg font-bold">{side2}</p>
                <p className="mt-2 text-4xl font-black text-yellow-200">
                  {side2Score}
                </p>
              </div>
            </div>

            <button onClick={resetGame} className="btn-primary mt-8 min-w-[220px]">
              إعادة اللعب
            </button>
          </div>
        )}
      </div>

      {showWinnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] border border-white/20 bg-[#7a001f] p-6 text-center shadow-2xl">
            <h3 className="mt-2 text-3xl font-black">🏆 مين فاز؟</h3>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => chooseWinner("side1")}
                className="btn-primary w-full"
              >
                {side1}
              </button>

              <button
                onClick={() => chooseWinner("side2")}
                className="btn-primary w-full"
              >
                {side2}
              </button>

              <button
                onClick={() => chooseWinner("none")}
                className="btn-secondary w-full"
              >
                لا أحد
              </button>
            </div>
          </div>
        </div>
      )}

      <CountdownOverlay count={countdown} />

      <FinalWinnerOverlay
        show={showFinalWinnerOverlay}
        winnerName={finalWinnerName}
        isDraw={isDraw}
        onClose={() => setShowFinalWinnerOverlay(false)}
      />
    </main>
  );
}
