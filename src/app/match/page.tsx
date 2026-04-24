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

import { quizCategoryMeta } from "@/data/quiz";
import type { QuizCategoryKey } from "@/data/quiz";
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

export default function MatchPage() {
  const [sessionMode, setSessionMode] = useState<SessionMode>("quick");

  const [side1, setSide1] = useState("");
  const [side2, setSide2] = useState("");
  const [rounds, setRounds] = useState(3);

  const [selectedGame, setSelectedGame] = useState<GameType>("word");
  const [selectedQuizCategory, setSelectedQuizCategory] =
    useState<QuizCategoryKey | null>(null);

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
  const [roundSeed, setRoundSeed] = useState(1);

  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizQuestionTotal, setQuizQuestionTotal] = useState(0);

  const [showFinalWinnerOverlay, setShowFinalWinnerOverlay] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");
    const game = params.get("game");
    const category = params.get("category");

    if (modeParam === "session") {
      setSessionMode("session");
    } else {
      setSessionMode("quick");
    }

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

    if (category && category in quizCategoryMeta) {
      setSelectedQuizCategory(category as QuizCategoryKey);
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
        setRoundSeed((s) => s + 1);
        setIsTransitioning(false);
      }, 350);

      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCountdown((prev) => (prev === null ? null : prev - 1));
    }, 850);

    return () => clearTimeout(timeout);
  }, [countdown]);

  const activeGame =
    sessionMode === "session"
      ? selectedSessionGames[currentRound - 1] ?? selectedSessionGames[0] ?? "word"
      : selectedGame;

  const gameMeta = useMemo(() => {
    if (activeGame === "quiz" && selectedQuizCategory) {
      const categoryMeta = quizCategoryMeta[selectedQuizCategory];

      return {
        id: "quiz" as GameType,
        title: categoryMeta.title,
        icon: categoryMeta.emoji,
        hint: categoryMeta.desc,
      };
    }

    return GAME_OPTIONS.find((game) => game.id === activeGame) ?? GAME_OPTIONS[1];
  }, [activeGame, selectedQuizCategory]);

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

  function startRoundTransition() {
    setIsTransitioning(true);
    setCountdown(3);
  }

  function startGame() {
    if (sessionMode === "session" && selectedSessionGames.length === 0) return;

    const finalSide1 = side1.trim() || "فريق 1";
    const finalSide2 = side2.trim() || "فريق 2";

    const nextRounds =
      sessionMode === "session" ? selectedSessionGames.length : rounds;

    setSide1(finalSide1);
    setSide2(finalSide2);

    setStarted(true);
    setCurrentRound(1);
    setSide1Score(0);
    setSide2Score(0);
    setGameEnded(false);
    setShowFinalWinnerOverlay(false);
    setRoundSeed(0);
    setQuizQuestionIndex(0);
    setQuizQuestionTotal(0);
    setRounds(nextRounds);

    startRoundTransition();
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
    startRoundTransition();
  }

  function resetGame() {
    setStarted(false);
    setCurrentRound(1);
    setSide1Score(0);
    setSide2Score(0);
    setShowWinnerModal(false);
    setGameEnded(false);
    setShowFinalWinnerOverlay(false);
    setRoundSeed(1);
    setQuizQuestionIndex(0);
    setQuizQuestionTotal(0);
    setCountdown(null);
    setIsTransitioning(false);
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
        category={selectedQuizCategory}
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
          <div className="animate-fade-in-up">
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
          </div>
        ) : !gameEnded ? (
          <div className="mx-auto max-w-6xl">
            <div
              key={`${activeGame}-${currentRound}-${roundSeed}`}
              className={`transition-all duration-500 ${
                isTransitioning || countdown !== null
                  ? "scale-[0.985] opacity-0 blur-[6px]"
                  : "scale-100 opacity-100 blur-0 animate-fade-in-up"
              }`}
            >
              {currentGameBoard}
            </div>

            {countdown !== null && <CountdownOverlay count={countdown} />}

            {countdown === null && !isTransitioning && (
              <div className="mt-5 text-center animate-fade-in-up">
                <p className="text-sm font-bold text-white/45">
                  الجولة {currentRound} • {gameMeta.icon} {gameMeta.title}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in-up mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-black/20 p-8 text-center">
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

            <button
              onClick={resetGame}
              className="btn-primary mt-8 min-w-[220px] transition duration-200 hover:scale-[1.03]"
            >
              إعادة اللعب
            </button>
          </div>
        )}
      </div>

      {showWinnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="animate-fade-in-up w-full max-w-md rounded-[32px] border border-white/20 bg-[#7a001f] p-6 text-center shadow-2xl">
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

      <FinalWinnerOverlay
        show={showFinalWinnerOverlay}
        winnerName={finalWinnerName}
        isDraw={isDraw}
        onClose={() => setShowFinalWinnerOverlay(false)}
      />
    </main>
  );
}
