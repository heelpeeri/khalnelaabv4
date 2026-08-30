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

type RoundStat = {
  game: GameType;
  round: number;
  winner: WinnerType;
};

type GameStat = {
  game: GameType;
  side1Wins: number;
  side2Wins: number;
  draws: number;
  total: number;
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

function getRoundsLabel(count: number) {
  if (count === 1) {
    return "جولة واحدة";
  }

  if (count === 2) {
    return "جولتين";
  }

  return `${count} جولات`;
}

function WinnerOverlay({
  show,
  winnerName,
  isDraw,
  mode,
  side1Name,
  side2Name,
  side1Score,
  side2Score,
  roundStats,
  onRestart,
  onGoHome,
  onShare,
}: {
  show: boolean;
  winnerName: string;
  isDraw: boolean;
  mode: ModeType;
  side1Name: string;
  side2Name: string;
  side1Score: number;
  side2Score: number;
  roundStats: RoundStat[];
  onRestart: () => void;
  onGoHome: () => void;
  onShare: () => void;
}) {
  if (!show) return null;

  const totalDraws = roundStats.filter(
    (stat) => stat.winner === "none"
  ).length;

  /*
    نجمع نتائج الجولات حسب اللعبة.
  */
  const gameStats = roundStats.reduce<GameStat[]>(
    (result, stat) => {
      const existing = result.find(
        (item) => item.game === stat.game
      );

      if (existing) {
        existing.total += 1;

        if (stat.winner === "side1") {
          existing.side1Wins += 1;
        }

        if (stat.winner === "side2") {
          existing.side2Wins += 1;
        }

        if (stat.winner === "none") {
          existing.draws += 1;
        }

        return result;
      }

      result.push({
        game: stat.game,
        side1Wins:
          stat.winner === "side1" ? 1 : 0,
        side2Wins:
          stat.winner === "side2" ? 1 : 0,
        draws:
          stat.winner === "none" ? 1 : 0,
        total: 1,
      });

      return result;
    },
    []
  );

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 px-4 py-4 backdrop-blur-md">
      <div className="arcade-card w-full max-w-5xl p-5 text-center animate-fade-in-up sm:p-7">

        {/* نهاية الجلسة */}
        <p className="text-xs font-black tracking-[0.22em] text-cyan-300/80 sm:text-sm">
          {mode === "quick"
            ? "انتهت اللعبة"
            : "انتهت الجلسة"}
        </p>

        <h1 className="arcade-title mt-3">
          {isDraw
            ? "تعادل! 🤝"
            : "كفووو! 🏆"}
        </h1>

        <p className="mt-2 text-2xl font-black text-white sm:text-3xl">
          {isDraw
            ? "الفريقين قدّها"
            : `الفائز: ${winnerName}`}
        </p>

        {/* النتيجة النهائية */}
        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-[1fr_auto_1fr] items-stretch gap-4">

          {/* فريق 1 */}
          <div
            className={`rounded-[26px] border p-4 transition-all sm:p-5 ${
              side1Score >= side2Score
                ? "scale-[1.02] border-fuchsia-300/80 bg-gradient-to-br from-fuchsia-500/40 via-pink-500/25 to-purple-500/20 shadow-[0_0_42px_rgba(217,70,239,0.42)]"
                : "border-fuchsia-300/35 bg-fuchsia-500/15 shadow-[0_0_24px_rgba(217,70,239,0.22)]"
            }`}
          >
            <p className="truncate text-sm font-black text-fuchsia-100/90 sm:text-base">
              {side1Name || "فريق 1"}
            </p>

            <p className="mt-2 text-5xl font-black leading-none text-fuchsia-50 drop-shadow-[0_0_14px_rgba(244,114,182,0.35)] sm:text-6xl">
              {side1Score}
            </p>
          </div>

          <div className="flex items-center justify-center text-3xl font-black text-white/25">
            -
          </div>

          {/* فريق 2 */}
          <div
            className={`rounded-[26px] border p-4 transition-all sm:p-5 ${
              side2Score >= side1Score
                ? "scale-[1.02] border-cyan-300/80 bg-gradient-to-br from-cyan-400/40 via-sky-500/25 to-blue-500/20 shadow-[0_0_42px_rgba(34,211,238,0.42)]"
                : "border-cyan-300/35 bg-cyan-400/15 shadow-[0_0_24px_rgba(34,211,238,0.22)]"
            }`}
          >
            <p className="truncate text-sm font-black text-cyan-100/90 sm:text-base">
              {side2Name || "فريق 2"}
            </p>

            <p className="mt-2 text-5xl font-black leading-none text-cyan-50 drop-shadow-[0_0_14px_rgba(34,211,238,0.35)] sm:text-6xl">
              {side2Score}
            </p>
          </div>
        </div>

        {/* ملخص سريع */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm font-black sm:text-base">
          <span className="rounded-full border border-fuchsia-300/30 bg-fuchsia-500/15 px-4 py-2 text-fuchsia-100 shadow-[0_0_18px_rgba(217,70,239,0.18)]">
            {side1Name || "فريق 1"}: {side1Score}
          </span>

          {totalDraws > 0 && (
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/70">
              تعادل: {totalDraws}
            </span>
          )}

          <span className="rounded-full border border-cyan-300/30 bg-cyan-400/15 px-4 py-2 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.18)]">
            {side2Name || "فريق 2"}: {side2Score}
          </span>
        </div>

        {/* إحصائيات الجلسة */}
        {gameStats.length > 0 && (
          <div className="mt-6 border-t border-white/10 pt-5">

            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-right">
                <p className="text-xl font-black text-white">
                  إحصائيات الجلسة
                </p>

                <p className="text-sm font-bold text-white/40">
                  نتائج الألعاب
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white/65">
                {getRoundsLabel(roundStats.length)}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {gameStats.map((stat) => {
                const side1Won =
                  stat.side1Wins >
                  stat.side2Wins;

                const side2Won =
                  stat.side2Wins >
                  stat.side1Wins;

                return (
                  <div
                    key={stat.game}
                    className="rounded-[24px] border border-white/10 bg-white/[0.045] px-4 py-4 shadow-[0_0_18px_rgba(0,0,0,0.15)]"
                  >
                    <div className="flex items-center justify-between gap-3">

                      {/* النتيجة */}
                      <div className="shrink-0">
                        <div className="flex items-center gap-2">

                          {/* فريق 1 */}
                          <span
                            className={`flex h-12 min-w-[50px] items-center justify-center rounded-2xl border px-3 text-2xl font-black ${
                              side1Won
                                ? "border-fuchsia-300/70 bg-fuchsia-500/30 text-fuchsia-50 shadow-[0_0_22px_rgba(217,70,239,0.30)]"
                                : "border-fuchsia-300/25 bg-fuchsia-500/12 text-fuchsia-100/75"
                            }`}
                          >
                            {stat.side1Wins}
                          </span>

                          <span className="text-xl font-black text-white/25">
                            -
                          </span>

                          {/* فريق 2 */}
                          <span
                            className={`flex h-12 min-w-[50px] items-center justify-center rounded-2xl border px-3 text-2xl font-black ${
                              side2Won
                                ? "border-cyan-300/70 bg-cyan-400/30 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.30)]"
                                : "border-cyan-300/25 bg-cyan-400/12 text-cyan-100/75"
                            }`}
                          >
                            {stat.side2Wins}
                          </span>
                        </div>

                        {stat.draws > 0 && (
                          <p className="mt-2 text-center text-xs font-bold text-white/45">
                            {stat.draws === 1
                              ? "تعادل واحد"
                              : `${stat.draws} تعادل`}
                          </p>
                        )}
                      </div>

                      {/* اسم اللعبة */}
                      <div className="min-w-0 text-right">
                        <p className="truncate text-lg font-black text-white">
                          {getGameName(stat.game)}
                        </p>

                        <p className="mt-1 text-sm font-bold text-white/40">
                          {getRoundsLabel(stat.total)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* الأزرار */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
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
            onClick={onShare}
            className="rounded-2xl border border-emerald-300/40 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 px-6 py-3 font-black text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.20)] transition hover:scale-[1.02] hover:border-emerald-300/60 hover:bg-emerald-400/25 active:scale-[0.98]"
          >
            📤 مشاركة النتيجة
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
          {countdown === 0
            ? "يلا!"
            : countdown}
        </h1>
      </div>
    </div>
  );
}

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
            onClick={() =>
              onPick("side1")
            }
            className="arcade-button px-6 py-4 text-lg"
          >
            {side1Name || "فريق 1"}
          </button>

          <button
            type="button"
            onClick={() =>
              onPick("side2")
            }
            className="arcade-button px-6 py-4 text-lg"
          >
            {side2Name || "فريق 2"}
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            onPick("none")
          }
          className="btn-secondary mt-4 w-full px-6 py-4 text-lg"
        >
          لا أحد
        </button>
      </div>
    </div>
  );
}

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
          {isDraw
            ? "تعادل! 🤝"
            : "كفووو! 🏆"}
        </h1>

        <p className="arcade-winner mt-6">
          {isDraw
            ? "محد أخذ نقطة الجولة"
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
    roundStats,
    setRoundStats,
  ] = useState<RoundStat[]>([]);

  const [
    showWinner,
    setShowWinner,
  ] = useState(false);

  const [
    showRoundWinnerPicker,
    setShowRoundWinnerPicker,
  ] = useState(false);

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

    setRoundStats([]);

    setShowWinner(false);

    setShowRoundWinnerPicker(
      false
    );

    setShowRoundResult(false);

    setRoundResultWinner(
      "none"
    );

    setCountdown(3);

    setPhase("countdown");
  }

  useEffect(() => {
    if (
      phase !== "countdown"
    ) {
      return;
    }

    if (countdown > 0) {
      const timer =
        setTimeout(() => {
          setCountdown(
            (
              currentCountdown
            ) =>
              currentCountdown -
              1
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

    if (
      urlMode === "session"
    ) {
      setMode("session");

      setStarted(false);

      setPhase("setup");

      setShowWinner(false);

      setShowRoundWinnerPicker(
        false
      );

      setShowRoundResult(
        false
      );

      setRoundStats([]);

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

    setSelectedGames([
      game,
    ]);

    setGameRounds({
      [game]:
        getDefaultRounds(
          game
        ),
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

    setRoundStats([]);

    setShowWinner(false);

    setShowRoundWinnerPicker(
      false
    );

    setShowRoundResult(
      false
    );

    setRoundResultWinner(
      "none"
    );
  }, []);

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

    setShowRoundWinnerPicker(
      false
    );

    setStarted(false);

    setPhase("finished");

    setShowWinner(true);
  }

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
        (
          currentIndex
        ) =>
          currentIndex + 1
      );

      setPhase("playing");
    }, 1500);
  }

  function applyRoundWinner(
    winner?: WinnerType
  ) {
    if (!current) {
      return;
    }

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

    const newStat: RoundStat = {
      game: current.game,
      round: index + 1,
      winner: finalWinner,
    };

    setRoundStats(
      (previous) => [
        ...previous,
        newStat,
      ]
    );

    setSide1Score(
      nextSide1Score
    );

    setSide2Score(
      nextSide2Score
    );

    setShowRoundWinnerPicker(
      false
    );

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

    setRoundResultWinner(
      finalWinner
    );

    setShowRoundResult(true);

    setTimeout(() => {
      setShowRoundResult(
        false
      );

      goToNextRound(
        nextSide1Score,
        nextSide2Score
      );
    }, 2500);
  }

  function endRound(
    winner?: WinnerType
  ) {
    if (!current) {
      return;
    }

    if (
      winner !==
      undefined
    ) {
      applyRoundWinner(
        winner
      );

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

    setShowRoundResult(
      false
    );

    setRoundResultWinner(
      "none"
    );

    setRoundStats([]);

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
          side1 ||
          "فريق 1"
        );
      }

      if (
        side2Score >
        side1Score
      ) {
        return (
          side2 ||
          "فريق 2"
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
    side1Score ===
    side2Score;

  const roundWinnerName =
    roundResultWinner ===
    "side1"
      ? side1 ||
        "فريق 1"
      : roundResultWinner ===
          "side2"
        ? side2 ||
          "فريق 2"
        : "";

  const roundIsDraw =
    roundResultWinner ===
    "none";

  /*
    مشاركة النتيجة.
  */
  async function handleShareResult() {
    const team1 =
      side1 || "فريق 1";

    const team2 =
      side2 || "فريق 2";

    const shareText = isDraw
      ? `انتهت جلستنا في خل نلعب 🎮

${team1} ${side1Score} - ${side2Score} ${team2}

تعادل 🤝

مين يفوز لو لعبنا مرة ثانية؟`
      : `انتهت جلستنا في خل نلعب 🎮

🏆 الفائز: ${finalWinnerName}

${team1} ${side1Score} - ${side2Score} ${team2}

تقدرون تتحدونا؟`;

    const siteUrl =
      window.location.origin;

    try {
      if (navigator.share) {
        await navigator.share({
          title:
            "نتيجة خل نلعب 🎮",
          text: shareText,
          url: siteUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(
        `${shareText}\n\n${siteUrl}`
      );

      alert(
        "تم نسخ النتيجة للمشاركة"
      );
    } catch (error) {
      /*
        إذا المستخدم قفل نافذة المشاركة
        ما نسوي شيء.
      */
    }
  }

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
      {phase ===
        "countdown" && (
        <CountdownOverlay
          countdown={countdown}
        />
      )}

      {/* Transition */}
      {phase ===
        "transition" &&
        nextRound && (
          <TransitionOverlay
            nextRound={
              nextRound
            }
          />
        )}

      {/* Final Winner */}
      <WinnerOverlay
        show={showWinner}
        winnerName={
          finalWinnerName
        }
        isDraw={isDraw}
        mode={mode}
        side1Name={side1}
        side2Name={side2}
        side1Score={
          side1Score
        }
        side2Score={
          side2Score
        }
        roundStats={
          roundStats
        }
        onRestart={restart}
        onGoHome={goHome}
        onShare={
          handleShareResult
        }
      />

      {/* Manual Judge */}
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

      {/* Round Result */}
      <RoundResultOverlay
        show={
          showRoundResult
        }
        winnerName={
          roundWinnerName
        }
        isDraw={
          roundIsDraw
        }
      />

      {!started ? (
        <SetupGame
          mode={mode}
          side1={side1}
          side2={side2}
          setSide1={
            setSide1
          }
          setSide2={
            setSide2
          }
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
