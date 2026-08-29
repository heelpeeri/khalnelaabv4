'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import SetupGame from "@/components/SetupGame";
import WordGame from "@/components/match/WordGame";
import QuizGame from "@/components/match/QuizGame";
import ScrambleGame from "@/components/match/ScrambleGame";
import WheelGame from "@/components/match/WheelGame";
import CategoriesGame from "@/components/match/CategoriesGame";
import ProverbGame from "@/components/match/ProverbGame";

import type { QuizCategoryKey } from "@/data/quiz";
import type { WinnerType } from "@/types/game";

type GameType =
  | "word"
  | "quiz"
  | "scramble"
  | "wheel"
  | "categories"
  | "draw";

type ModeType = "session" | "quick";

type PhaseType =
  | "setup"
  | "countdown"
  | "playing"
  | "transition"
  | "finished";

type Round = {
  game: GameType;
  category: QuizCategoryKey | null;
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getDefaultRounds(game: GameType) {
  if (game === "wheel") return 1;
  if (game === "categories") return 1;
  if (game === "quiz") return 1;

  return 2;
}

function getGameName(game: GameType) {
  switch (game) {
    case "word":
      return "💬 خمن الكلمة";

    case "quiz":
      return "❓ الأسئلة";

    case "scramble":
      return "🕵🏻‍♂️ منهو ذا";

    case "wheel":
      return "🎡 لف وخمن";

    case "categories":
      return "🌍 إنسان حيوان نبات جماد بلاد";

    case "draw":
      return "✏️ خمن المثل";
  }
}

/*
  نتيجة اللعبة / الجلسة كاملة
*/
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
          {mode === "quick"
            ? "انتهت اللعبة"
            : "انتهت الجلسة"}
        </p>

        <h1 className="arcade-title mt-6">
          {isDraw ? "تعادل!" : "كفووو!"}
        </h1>

        <p className="arcade-winner mt-6">
          {isDraw
            ? "الفريقين قدّها"
            : `الفائز: ${winnerName}`}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="arcade-button"
          >
            {mode === "quick"
              ? "جرّب نفس اللعبة"
              : "تحدي جديد"}
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="btn-secondary"
          >
            القائمة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}

/*
  العد التنازلي قبل بداية اللعب
*/
function CountdownOverlay({
  countdown,
}: {
  countdown: number;
}) {
  return (
    <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
      <div className="arcade-card w-full max-w-xl p-8 text-center animate-fade-in-up">
        <p className="text-xl font-black text-white/70">
          استعدوا
        </p>

        <h1 className="arcade-title mt-6">
          {countdown === 0 ? "يلا!" : countdown}
        </h1>
      </div>
    </div>
  );
}

/*
  الانتقال للجولة التالية
*/
function TransitionOverlay({
  nextRound,
}: {
  nextRound: Round;
}) {
  return (
    <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
      <div className="arcade-card w-full max-w-xl p-8 text-center animate-fade-in-up">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/80">
          الجولة الجاية
        </p>

        <h1 className="mt-6 text-4xl font-black text-white">
          {getGameName(nextRound.game)}
        </h1>

        <p className="mt-5 text-white/60">
          استعدوا للتحدي القادم
        </p>
      </div>
    </div>
  );
}

/*
  شاشة التحكيم للألعاب
  اللي ما تعرف الفائز بنفسها
*/
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

        <h1 className="arcade-title mt-5">
          من فاز؟ 🏆
        </h1>

        <p className="mt-3 text-lg font-bold text-white/70">
          اختر الفائز في هذه الجولة
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onPick("side1")}
            className="arcade-button px-6 py-4 text-lg"
          >
            {side1Name || "فريق 1"}
          </button>

          <button
            type="button"
            onClick={() => onPick("side2")}
            className="arcade-button px-6 py-4 text-lg"
          >
            {side2Name || "فريق 2"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => onPick("none")}
          className="btn-secondary mt-4 w-full px-6 py-4 text-lg"
        >
          لا أحد
        </button>
      </div>
    </div>
  );
}

/*
  نتيجة الجولة قبل الانتقال للجولة التالية
*/
function RoundResultOverlay({
  show,
  winnerName,
  isDraw,
}: {
  show: boolean;
  winnerName: string;
  isDraw: boolean;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="arcade-card w-full max-w-2xl p-8 text-center animate-fade-in-up">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/80">
          انتهت الجولة
        </p>

        <h1 className="arcade-title mt-5">
          {isDraw ? "تعادل! 🤝" : "كفووو! 🏆"}
        </h1>

        <p className="arcade-winner mt-6">
          {isDraw
            ? "ما أحد أخذ نقطة الجولة"
            : `فاز بالجولة: ${winnerName}`}
        </p>
      </div>
    </div>
  );
}

export default function MatchPage() {
  const router = useRouter();

  const [mode, setMode] =
    useState<ModeType>("session");

  const [phase, setPhase] =
    useState<PhaseType>("setup");

  const [countdown, setCountdown] =
    useState(3);

  const [side1, setSide1] =
    useState("");

  const [side2, setSide2] =
    useState("");

  const [
    selectedGames,
    setSelectedGames,
  ] = useState<GameType[]>([]);

  const [
    gameRounds,
    setGameRounds,
  ] = useState<Record<string, number>>({});

  const [
    quizCategories,
    setQuizCategories,
  ] = useState<QuizCategoryKey[]>([]);

  const [
    timerEnabled,
    setTimerEnabled,
  ] = useState(false);

  const [
    timerSeconds,
    setTimerSeconds,
  ] = useState(30);

  const [queue, setQueue] =
    useState<Round[]>([]);

  const [started, setStarted] =
    useState(false);

  const [index, setIndex] =
    useState(0);

  const [
    side1Score,
    setSide1Score,
  ] = useState(0);

  const [
    side2Score,
    setSide2Score,
  ] = useState(0);

  const [
    showWinner,
    setShowWinner,
  ] = useState(false);

  const [
    showRoundWinnerPicker,
    setShowRoundWinnerPicker,
  ] = useState(false);

  /*
    نتيجة الجولة الحالية
  */
  const [
    showRoundResult,
    setShowRoundResult,
  ] = useState(false);

  const [
    roundResultWinner,
    setRoundResultWinner,
  ] = useState<WinnerType>("none");

  const current = queue[index];
  const nextRound = queue[index + 1];

  function buildQueue(): Round[] {
    const q: Round[] = [];

    const shuffledCategories =
      shuffle(quizCategories);

    selectedGames.forEach((game) => {
      const count =
        game === "quiz"
          ? 1
          : gameRounds[game] ||
            getDefaultRounds(game);

      for (let i = 0; i < count; i++) {
        q.push({
          game,

          category:
            game === "quiz"
              ? shuffledCategories[0] ?? null
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

    if (
      selectedGames.includes("quiz") &&
      quizCategories.length === 0
    ) {
      alert("اختر فئة للأسئلة");
      return;
    }

    const builtQueue =
      buildQueue();

    setQueue(builtQueue);

    setStarted(false);

    setIndex(0);

    setSide1(
      side1.trim() || "فريق 1"
    );

    setSide2(
      side2.trim() || "فريق 2"
    );

    setSide1Score(0);
    setSide2Score(0);

    setShowWinner(false);
    setShowRoundWinnerPicker(false);

    setShowRoundResult(false);
    setRoundResultWinner("none");

    setCountdown(3);

    setPhase("countdown");
  }

  /*
    Countdown
  */
  useEffect(() => {
    if (phase !== "countdown") {
      return;
    }

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(
          (currentCountdown) =>
            currentCountdown - 1
        );
      }, 800);

      return () =>
        clearTimeout(timer);
    }

    const startTimer =
      setTimeout(() => {
        setStarted(true);
        setPhase("playing");
      }, 650);

    return () =>
      clearTimeout(startTimer);
  }, [
    phase,
    countdown,
  ]);

  /*
    Quick mode / URL
  */
  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const urlMode =
      params.get("mode");

    const game =
      params.get(
        "game"
      ) as GameType | null;

    const category =
      params.get(
        "category"
      ) as QuizCategoryKey | null;

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
      setShowRoundResult(false);

      return;
    }

    if (
      !game ||
      !validGames.includes(game)
    ) {
      setMode("session");

      setStarted(false);

      setPhase("setup");

      return;
    }

    setMode("quick");

    setSelectedGames([game]);

    setGameRounds({
      [game]:
        getDefaultRounds(game),
    });

    if (
      game === "quiz" &&
      category
    ) {
      setQuizCategories([
        category,
      ]);
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

    setShowRoundResult(false);
    setRoundResultWinner("none");
  }, []);

  /*
    نهاية اللعبة / الجلسة
  */
  function finishSession(
    finalSide1Score: number,
    finalSide2Score: number
  ) {
    setSide1Score(
      finalSide1Score
    );

    setSide2Score(
      finalSide2Score
    );

    setShowRoundResult(false);
    setShowRoundWinnerPicker(false);

    setStarted(false);

    setPhase("finished");

    setShowWinner(true);
  }

  /*
    الانتقال للجولة التالية
  */
  function goToNextRound(
    nextSide1Score: number,
    nextSide2Score: number
  ) {
    if (
      index + 1 >=
      queue.length
    ) {
      finishSession(
        nextSide1Score,
        nextSide2Score
      );

      return;
    }

    setPhase("transition");

    setTimeout(() => {
      setIndex(
        (currentIndex) =>
          currentIndex + 1
      );

      setPhase("playing");
    }, 1500);
  }

  /*
    اعتماد فائز الجولة
  */
  function applyRoundWinner(
    winner?: WinnerType
  ) {
    const finalWinner: WinnerType =
      winner ?? "none";

    const nextSide1Score =
      side1Score +
      (finalWinner === "side1"
        ? 1
        : 0);

    const nextSide2Score =
      side2Score +
      (finalWinner === "side2"
        ? 1
        : 0);

    setSide1Score(
      nextSide1Score
    );

    setSide2Score(
      nextSide2Score
    );

    setShowRoundWinnerPicker(
      false
    );

    /*
      إذا هذه آخر جولة،
      ما نحتاج نتيجة جولة منفصلة.
      نعرض نتيجة اللعبة النهائية مباشرة.
    */
    if (
      index + 1 >=
      queue.length
    ) {
      finishSession(
        nextSide1Score,
        nextSide2Score
      );

      return;
    }

    /*
      فيه جولة بعدها:
      نعرض مين فاز بالجولة الحالية.
    */
    setRoundResultWinner(
      finalWinner
    );

    setShowRoundResult(true);

    setTimeout(() => {
      setShowRoundResult(false);

      goToNextRound(
        nextSide1Score,
        nextSide2Score
      );
    }, 2500);
  }

  /*
    نهاية الجولة.

    القاعدة الجديدة:

    إذا اللعبة أرسلت فائز:
    نعتمد النتيجة مباشرة.

    إذا ما أرسلت فائز:
    نظهر شاشة "من فاز؟".
  */
  function endRound(
    winner?: WinnerType
  ) {
    if (!current) return;

    if (winner !== undefined) {
      applyRoundWinner(winner);
      return;
    }

    setShowRoundWinnerPicker(
      true
    );
  }

  function restart() {
    setStarted(false);

    setShowWinner(false);

    setShowRoundWinnerPicker(
      false
    );

    setShowRoundResult(false);

    setRoundResultWinner(
      "none"
    );

    setIndex(0);

    setQueue([]);

    setSide1Score(0);
    setSide2Score(0);

    setPhase("setup");

    if (
      mode === "session"
    ) {
      setSelectedGames([]);

      setGameRounds({});

      setQuizCategories([]);
    }
  }

  function goHome() {
    router.push("/");
  }

  const finalWinnerName =
    useMemo(() => {
      if (
        side1Score >
        side2Score
      ) {
        return (
          side1 || "فريق 1"
        );
      }

      if (
        side2Score >
        side1Score
      ) {
        return (
          side2 || "فريق 2"
        );
      }

      return "تعادل";
    }, [
      side1Score,
      side2Score,
      side1,
      side2,
    ]);

  const isDraw =
    side1Score === side2Score;

  /*
    اسم فائز الجولة الحالية
  */
  const roundWinnerName =
    roundResultWinner === "side1"
      ? side1 || "فريق 1"
      : roundResultWinner === "side2"
        ? side2 || "فريق 2"
        : "";

  const roundIsDraw =
    roundResultWinner === "none";

  return (
    <main className="min-h-screen p-6 text-white">
      <Link
        href="/"
        className="
          fixed
          top-5
          left-5
          z-[999]
          flex
          items-center
          gap-2
          rounded-full
          border
          border-cyan-400/30
          bg-gradient-to-r
          from-[#119DFF]
          to-[#3C5BFF]
          px-5
          py-3
          font-black
          text-white
          shadow-[0_0_20px_rgba(17,157,255,.45)]
          transition-all
          hover:scale-105
        "
      >
        🏠 الرئيسية
      </Link>

      {/* Countdown */}
      {phase === "countdown" && (
        <CountdownOverlay
          countdown={countdown}
        />
      )}

      {/* Transition */}
      {phase === "transition" &&
        nextRound && (
          <TransitionOverlay
            nextRound={nextRound}
          />
        )}

      {/* Final winner */}
      <WinnerOverlay
        show={showWinner}
        winnerName={
          finalWinnerName
        }
        isDraw={isDraw}
        mode={mode}
        onRestart={restart}
        onGoHome={goHome}
      />

      {/* Manual round judge */}
      <RoundWinnerPicker
        show={
          showRoundWinnerPicker
        }
        side1Name={side1}
        side2Name={side2}
        onPick={
          applyRoundWinner
        }
      />

      {/* Round result */}
      <RoundResultOverlay
        show={showRoundResult}
        winnerName={
          roundWinnerName
        }
        isDraw={roundIsDraw}
      />

      {!started ? (
        <SetupGame
          mode={mode}
          side1={side1}
          side2={side2}
          setSide1={setSide1}
          setSide2={setSide2}
          selectedGames={
            selectedGames
          }
          setSelectedGames={
            setSelectedGames
          }
          gameRounds={
            gameRounds
          }
          setGameRounds={
            setGameRounds
          }
          quizCategories={
            quizCategories
          }
          setQuizCategories={
            setQuizCategories
          }
          timerEnabled={
            timerEnabled
          }
          setTimerEnabled={
            setTimerEnabled
          }
          timerSeconds={
            timerSeconds
          }
          setTimerSeconds={
            setTimerSeconds
          }
          onStart={start}
        />
      ) : (
        <div className="mx-auto max-w-5xl">

          {/* Word */}
          {current?.game ===
            "word" && (
            <WordGame
              onRoundEnd={
                endRound
              }
              roundKey={index}
              side1Name={side1}
              side2Name={side2}
              side1Score={
                side1Score
              }
              side2Score={
                side2Score
              }
              currentRound={
                index + 1
              }
              timerEnabled={
                timerEnabled
              }
              timerSeconds={
                timerSeconds
              }
            />
          )}

          {/* Quiz */}
          {current?.game ===
            "quiz" && (
            <QuizGame
              onRoundEnd={
                endRound
              }
              roundKey={index}
              category={
                current.category
              }
              side1Name={side1}
              side2Name={side2}
              currentRound={
                index + 1
              }
              timerEnabled={
                timerEnabled
              }
              timerSeconds={
                timerSeconds
              }
            />
          )}

          {/* Scramble */}
          {current?.game ===
            "scramble" && (
            <ScrambleGame
              onRoundEnd={
                endRound
              }
              roundKey={index}
              side1Name={side1}
              side2Name={side2}
              currentRound={
                index + 1
              }
              timerEnabled={
                timerEnabled
              }
              timerSeconds={
                timerSeconds
              }
            />
          )}

          {/* Wheel */}
          {current?.game ===
            "wheel" && (
            <WheelGame
              onRoundEnd={
                endRound
              }
              roundKey={index}
              side1Name={side1}
              side2Name={side2}
              currentRound={
                index + 1
              }
              timerEnabled={
                timerEnabled
              }
              timerSeconds={
                timerSeconds
              }
            />
          )}

          {/* Categories */}
          {current?.game ===
            "categories" && (
            <CategoriesGame
              onRoundEnd={
                endRound
              }
              roundKey={index}
              side1Name={side1}
              side2Name={side2}
              currentRound={
                index + 1
              }
              timerEnabled={
                timerEnabled
              }
              timerSeconds={
                timerSeconds
              }
            />
          )}

          {/* Proverb */}
          {current?.game ===
            "draw" && (
            <ProverbGame
              onRoundEnd={
                endRound
              }
              roundKey={index}
              side1Name={side1}
              side2Name={side2}
              currentRound={
                index + 1
              }
              timerEnabled={
                timerEnabled
              }
              timerSeconds={
                timerSeconds
              }
            />
          )}

          <p className="mt-5 text-center text-sm font-bold text-white/50">
            الجولة {index + 1} من{" "}
            {queue.length}
          </p>
        </div>
      )}
    </main>
  );
}
