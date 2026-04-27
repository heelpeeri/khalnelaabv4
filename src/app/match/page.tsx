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
type PhaseType = "setup" | "countdown" | "playing" | "transition" | "finished";

type Round = {
  game: GameType;
  category: QuizCategoryKey | null;
};

const SELF_JUDGED_GAMES: GameType[] = ["word", "wheel", "quiz"];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

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
      return "🌍 إنسان حيوان نبات جماد بلاد";
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
}: {
  show: boolean;
  winnerName: string;
  isDraw: boolean;
  mode: ModeType;
  onRestart: () => void;
  onGoHome: () => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="arcade-card w-full max-w-2xl p-8 text-center animate-fade-in-up">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/80">
          {mode === "quick" ? "انتهت اللعبة" : "انتهت الجلسة"}
        </p>

        <h1 className="arcade-title mt-6">
          {isDraw ? "تعادل!" : "كفووو!"}
        </h1>

        <p className="arcade-winner mt-6">
          {isDraw ? "الفريقين قدّها" : `الفائز: ${winnerName}`}
        </p>

        {mode === "quick" ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={onRestart} className="arcade-button">
              جرّب نفس اللعبة
            </button>

            <button onClick={onGoHome} className="btn-secondary">
              القائمة الرئيسية
            </button>
          </div>
        ) : (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={onRestart} className="arcade-button">
              تحدي جديد
            </button>

            <button onClick={onGoHome} className="btn-secondary">
              القائمة الرئيسية
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CountdownOverlay({ countdown }: { countdown: number }) {
  return (
    <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
      <div className="arcade-card w-full max-w-xl p-8 text-center animate-fade-in-up">
        <p className="text-xl font-black text-white/70">استعدوا</p>

        <h1 className="arcade-title mt-6">
          {countdown === 0 ? "يلا!" : countdown}
        </h1>
      </div>
    </div>
  );
}

function TransitionOverlay({ nextRound }: { nextRound: Round }) {
  return (
    <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
      <div className="arcade-card w-full max-w-xl p-8 text-center animate-fade-in-up">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/80">
          الجولة الجاية
        </p>

        <h1 className="mt-6 text-4xl font-black text-white">
          {getGameName(nextRound.game)}
        </h1>

        <p className="mt-5 text-white/60">استعدوا للتحدي القادم</p>
      </div>
    </div>
  );
}

function RoundWinnerPicker({
  show,
  side1Name,
  side2Name,
  onPick,
}: {
  show: boolean;
  side1Name: string;
  side2Name: string;
  onPick: (winner: WinnerType) => void;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="arcade-card w-full max-w-2xl p-8 text-center animate-fade-in-up">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/80">
          نهاية الجولة
        </p>

        <h1 className="arcade-title mt-5">من فاز؟ 🏆</h1>

        <p className="mt-3 text-lg font-bold text-white/70">
          اختر الفائز في هذه الجولة
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => onPick("side1")}
            className="arcade-button px-6 py-4 text-lg"
          >
            {side1Name || "فريق 1"}
          </button>

          <button
            onClick={() => onPick("side2")}
            className="arcade-button px-6 py-4 text-lg"
          >
            {side2Name || "فريق 2"}
          </button>
        </div>

        <button
          onClick={() => onPick("none")}
          className="btn-secondary mt-4 w-full px-6 py-4 text-lg"
        >
          لا أحد
        </button>
      </div>
    </div>
  );
}

export default function MatchPage() {
  const router = useRouter();

  const [mode, setMode] = useState<ModeType>("session");
  const [phase, setPhase] = useState<PhaseType>("setup");
  const [countdown, setCountdown] = useState(3);

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
  const [showRoundWinnerPicker, setShowRoundWinnerPicker] = useState(false);

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
    setStarted(false);
    setIndex(0);
    setSide1(side1.trim() || "فريق 1");
    setSide2(side2.trim() || "فريق 2");
    setSide1Score(0);
    setSide2Score(0);
    setShowWinner(false);
    setShowRoundWinnerPicker(false);

    setCountdown(3);
    setPhase("countdown");
  }

  useEffect(() => {
    if (phase !== "countdown") return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((current) => current - 1);
      }, 800);

      return () => clearTimeout(timer);
    }

    const startTimer = setTimeout(() => {
      setStarted(true);
      setPhase("playing");
    }, 650);

    return () => clearTimeout(startTimer);
  }, [phase, countdown]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const urlMode = params.get("mode");
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

    if (urlMode === "session") {
      setMode("session");
      setStarted(false);
      setPhase("setup");
      setShowWinner(false);
      setShowRoundWinnerPicker(false);
      return;
    }

    if (!game || !validGames.includes(game)) {
      setMode("session");
      setStarted(false);
      setPhase("setup");
      return;
    }

    setMode("quick");
    setSelectedGames([game]);
    setGameRounds({ [game]: 1 });

    if (game === "quiz" && category) {
      setQuizCategories([category]);
    }

    setSide1("");
    setSide2("");
    setStarted(false);
    setPhase("setup");
    setIndex(0);
    setSide1Score(0);
    setSide2Score(0);
    setShowWinner(false);
    setShowRoundWinnerPicker(false);
  }, []);

  function finishSession(finalSide1Score: number, finalSide2Score: number) {
    setSide1Score(finalSide1Score);
    setSide2Score(finalSide2Score);
    setStarted(false);
    setPhase("finished");
    setShowWinner(true);
  }

  function applyRoundWinner(winner?: WinnerType) {
    const nextSide1Score = side1Score + (winner === "side1" ? 1 : 0);
    const nextSide2Score = side2Score + (winner === "side2" ? 1 : 0);

    setSide1Score(nextSide1Score);
    setSide2Score(nextSide2Score);
    setShowRoundWinnerPicker(false);

    if (index + 1 >= queue.length) {
      finishSession(nextSide1Score, nextSide2Score);
      return;
    }

    setPhase("transition");

    setTimeout(() => {
      setIndex((i) => i + 1);
      setPhase("playing");
    }, 1500);
  }

  function endRound(winner?: WinnerType) {
    if (!current) return;

    const gameJudgesItself = SELF_JUDGED_GAMES.includes(current.game);

    if (!gameJudgesItself) {
      setShowRoundWinnerPicker(true);
      return;
    }

    applyRoundWinner(winner);
  }

  function restart() {
    setStarted(false);
    setShowWinner(false);
    setShowRoundWinnerPicker(false);
    setIndex(0);
    setQueue([]);
    setSide1Score(0);
    setSide2Score(0);
    setPhase("setup");

    if (mode === "session") {
      setSelectedGames([]);
      setGameRounds({});
      setQuizCategories([]);
    }
  }

  function goHome() {
    router.push("/");
  }

  const current = queue[index];
  const nextRound = queue[index + 1];

  const finalWinnerName = useMemo(() => {
    if (side1Score > side2Score) return side1 || "فريق 1";
    if (side2Score > side1Score) return side2 || "فريق 2";
    return "تعادل";
  }, [side1Score, side2Score, side1, side2]);

  const isDraw = side1Score === side2Score;

  return (
    <main className="min-h-screen p-6 text-white">
      {phase === "countdown" && <CountdownOverlay countdown={countdown} />}

      {phase === "transition" && nextRound && (
        <TransitionOverlay nextRound={nextRound} />
      )}

      <WinnerOverlay
        show={showWinner}
        winnerName={finalWinnerName}
        isDraw={isDraw}
        mode={mode}
        onRestart={restart}
        onGoHome={goHome}
      />

      <RoundWinnerPicker
        show={showRoundWinnerPicker}
        side1Name={side1}
        side2Name={side2}
        onPick={applyRoundWinner}
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
            <WordGame
              onRoundEnd={endRound}
              roundKey={index}
              side1Name={side1}
              side2Name={side2}
              side1Score={side1Score}
              side2Score={side2Score}
              currentRound={index + 1}
            />
          )}

          {current?.game === "quiz" && (
            <QuizGame
              onRoundEnd={endRound}
              roundKey={index}
              category={current.category}
              side1Name={side1}
              side2Name={side2}
            />
          )}

          {current?.game === "scramble" && (
            <ScrambleGame
              onRoundEnd={endRound}
              roundKey={index}
              side1Name={side1}
              side2Name={side2}
              currentRound={index + 1}
            />
          )}

          {current?.game === "wheel" && (
            <WheelGame
              onRoundEnd={endRound}
              roundKey={index}
              side1Name={side1}
              side2Name={side2}
              currentRound={index + 1}
            />
          )}

          {current?.game === "categories" && (
            <CategoriesGame
              onRoundEnd={endRound}
              roundKey={index}
              side1Name={side1}
              side2Name={side2}
              currentRound={index + 1}
            />
          )}

          {current?.game === "draw" && (
            <ProverbGame
              onRoundEnd={endRound}
              roundKey={index}
              side1Name={side1}
              side2Name={side2}
              currentRound={index + 1}
            />
          )}

          <p className="mt-5 text-center text-sm font-bold text-white/50">
            الجولة {index + 1} من {queue.length}
          </p>
        </div>
      )}
    </main>
  );
}
