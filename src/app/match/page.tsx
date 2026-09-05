'use client';

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import SetupGame from "@/components/SetupGame";
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

const VALID_GAMES: GameType[] = [
  "word",
  "quiz",
  "scramble",
  "wheel",
  "categories",
  "draw",
];

const GAME_NAMES: Record<GameType, string> = {
  word: "💬 خمن الكلمة",
  quiz: "❓ أسئلة وأجوبة",
  scramble: "🕵🏻‍♂️ منهو ذا؟",
  wheel: "🎡 لف وخمن",
  categories: "🌍 إنسان حيوان نبات جماد بلاد",
  draw: "✏️ خمن المثل",
};

const DEFAULT_ROUNDS: Record<GameType, number> = {
  word: 2,
  quiz: 1,
  scramble: 2,
  wheel: 1,
  categories: 1,
  draw: 2,
};

// كل لعبة في chunk مستقل بدل تحميل الألعاب الستة مع صفحة /match.
const GAME_LOADERS = {
  word: () => import("@/components/match/WordGame"),
  quiz: () => import("@/components/match/QuizGame"),
  scramble: () => import("@/components/match/ScrambleGame"),
  wheel: () => import("@/components/match/WheelGame"),
  categories: () => import("@/components/match/CategoriesGame"),
  draw: () => import("@/components/match/ProverbGame"),
};

function GameLoading() {
  return (
    <div className="arcade-card mx-auto w-full max-w-5xl p-8 text-center">
      <p className="text-sm font-black text-cyan-200/70">
        جاري تجهيز اللعبة...
      </p>
    </div>
  );
}

const WordGame = dynamic(GAME_LOADERS.word, {
  ssr: false,
  loading: GameLoading,
});

const QuizGame = dynamic(GAME_LOADERS.quiz, {
  ssr: false,
  loading: GameLoading,
});

const ScrambleGame = dynamic(GAME_LOADERS.scramble, {
  ssr: false,
  loading: GameLoading,
});

const WheelGame = dynamic(GAME_LOADERS.wheel, {
  ssr: false,
  loading: GameLoading,
});

const CategoriesGame = dynamic(GAME_LOADERS.categories, {
  ssr: false,
  loading: GameLoading,
});

const ProverbGame = dynamic(GAME_LOADERS.draw, {
  ssr: false,
  loading: GameLoading,
});

function isGameType(value: string | null): value is GameType {
  return (
    value !== null &&
    VALID_GAMES.includes(value as GameType)
  );
}

function getDefaultRounds(game: GameType) {
  return DEFAULT_ROUNDS[game];
}

function getGameName(game: GameType) {
  return GAME_NAMES[game];
}

function getRoundsLabel(count: number) {
  if (count === 1) return "جولة واحدة";
  if (count === 2) return "جولتين";

  return `${count} جولات`;
}

function shuffle<T>(items: T[]) {
  const result = [...items];

  for (
    let i = result.length - 1;
    i > 0;
    i -= 1
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [result[i], result[j]] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

function buildRoundQueue(
  selectedGames: GameType[],
  gameRounds: Record<string, number>,
  quizCategories: QuizCategoryKey[]
): Round[] {
  const queue: Round[] = [];

  const shuffledCategories = shuffle(
    quizCategories
  );

  selectedGames.forEach((game) => {
    const count =
      game === "quiz"
        ? 1
        : gameRounds[game] ||
          getDefaultRounds(game);

    for (
      let i = 0;
      i < count;
      i += 1
    ) {
      queue.push({
        game,
        category:
          game === "quiz"
            ? shuffledCategories[0] ?? null
            : null,
      });
    }
  });

  return queue;
}

function preloadGames(games: GameType[]) {
  games.forEach((game) => {
    void GAME_LOADERS[game]();
  });
}

function getGameStats(roundStats: RoundStat[]) {
  return roundStats.reduce<GameStat[]>(
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

  const gameStats = getGameStats(roundStats);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75 px-4 py-4 backdrop-blur-md">
      <div className="arcade-card w-full max-w-5xl p-5 text-center animate-fade-in-up sm:p-7">
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

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-[1fr_auto_1fr] items-stretch gap-4">
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

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm font-black sm:text-base">
          <span className="rounded-full border border-fuchsia-300/30 bg-fuchsia-500/15 px-4 py-2 text-fuchsia-100 shadow-[0_0_18px_rgba(217,70,239,0.18)]">
            {side1Name || "فريق 1"}:{" "}
            {side1Score}
          </span>

          {totalDraws > 0 && (
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/70">
              تعادل: {totalDraws}
            </span>
          )}

          <span className="rounded-full border border-cyan-300/30 bg-cyan-400/15 px-4 py-2 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.18)]">
            {side2Name || "فريق 2"}:{" "}
            {side2Score}
          </span>
        </div>

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
                {getRoundsLabel(
                  roundStats.length
                )}
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
                      <div className="shrink-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-12 min-w-[50px] items-center justify-center rounded-2xl border px-3 text-2xl font-black ${
                              side1Won
                                ? "border-fuchsia-300/70 bg-fuchsia-500/30 text-fuchsia-50 shadow-[0_0_22px_rgba(217,70,239,0.30)]"
                                : "border-fuchsia-300/25 bg-fuchsia-500/10 text-fuchsia-100/75"
                            }`}
                          >
                            {stat.side1Wins}
                          </span>

                          <span className="text-xl font-black text-white/25">
                            -
                          </span>

                          <span
                            className={`flex h-12 min-w-[50px] items-center justify-center rounded-2xl border px-3 text-2xl font-black ${
                              side2Won
                                ? "border-cyan-300/70 bg-cyan-400/30 text-cyan-50 shadow-[0_0_22px_rgba(34,211,238,0.30)]"
                                : "border-cyan-300/25 bg-cyan-400/10 text-cyan-100/75"
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

                      <div className="min-w-0 text-right">
                        <p className="truncate text-lg font-black text-white">
                          {getGameName(
                            stat.game
                          )}
                        </p>

                        <p className="mt-1 text-sm font-bold text-white/40">
                          {getRoundsLabel(
                            stat.total
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
            className="rounded-2xl border border-emerald-300/40 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 px-6 py-3 font-black text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.20)] transition hover:scale-[1.02] hover:border-emerald-300/60 active:scale-[0.98]"
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
          {getGameName(
            nextRound.game
          )}
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
  onPick: (
    winner: WinnerType
  ) => void;
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

type ShareRoundStat = {
  winner: WinnerType;
};

type ShareResultData = {
  isDraw: boolean;
  finalWinnerName: string;
  side1: string;
  side2: string;
  side1Score: number;
  side2Score: number;
  roundStats: ShareRoundStat[];
};

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(
    radius,
    width / 2,
    height / 2
  );

  ctx.beginPath();

  ctx.moveTo(
    x + r,
    y
  );

  ctx.lineTo(
    x + width - r,
    y
  );

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + r
  );

  ctx.lineTo(
    x + width,
    y + height - r
  );

  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - r,
    y + height
  );

  ctx.lineTo(
    x + r,
    y + height
  );

  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - r
  );

  ctx.lineTo(
    x,
    y + r
  );

  ctx.quadraticCurveTo(
    x,
    y,
    x + r,
    y
  );

  ctx.closePath();
}

async function createResultShareImage({
  isDraw,
  finalWinnerName,
  side1,
  side2,
  side1Score,
  side2Score,
  roundStats,
}: ShareResultData) {
  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 1080;
  canvas.height = 1350;

  const ctx =
    canvas.getContext(
      "2d"
    );

  if (!ctx) {
    throw new Error(
      "Canvas غير مدعوم"
    );
  }

  const {
    width,
    height,
  } = canvas;

  // Background
  const background =
    ctx.createLinearGradient(
      0,
      0,
      width,
      height
    );

  background.addColorStop(
    0,
    "#06020e"
  );

  background.addColorStop(
    0.5,
    "#170628"
  );

  background.addColorStop(
    1,
    "#050914"
  );

  ctx.fillStyle = background;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  // Glows
  const pinkGlow =
    ctx.createRadialGradient(
      150,
      470,
      20,
      150,
      470,
      430
    );

  pinkGlow.addColorStop(
    0,
    "rgba(217,70,239,0.30)"
  );

  pinkGlow.addColorStop(
    1,
    "rgba(217,70,239,0)"
  );

  ctx.fillStyle = pinkGlow;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  const cyanGlow =
    ctx.createRadialGradient(
      930,
      500,
      20,
      930,
      500,
      430
    );

  cyanGlow.addColorStop(
    0,
    "rgba(34,211,238,0.25)"
  );

  cyanGlow.addColorStop(
    1,
    "rgba(34,211,238,0)"
  );

  ctx.fillStyle = cyanGlow;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  // Main card
  drawRoundedRect(
    ctx,
    65,
    60,
    950,
    1230,
    48
  );

  const cardGradient =
    ctx.createLinearGradient(
      65,
      60,
      1015,
      1290
    );

  cardGradient.addColorStop(
    0,
    "rgba(33,8,57,0.96)"
  );

  cardGradient.addColorStop(
    1,
    "rgba(9,6,27,0.98)"
  );

  ctx.fillStyle =
    cardGradient;

  ctx.fill();

  ctx.lineWidth = 5;

  ctx.strokeStyle =
    "rgba(34,211,238,0.65)";

  ctx.stroke();

  ctx.textAlign = "center";
  ctx.direction = "rtl";

  // Brand
  ctx.fillStyle =
    "#67e8f9";

  ctx.font =
    "900 35px Arial";

  ctx.fillText(
    "خل نلعب 🎮",
    width / 2,
    135
  );

  // Main result
  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    "900 72px Arial";

  ctx.fillText(
    isDraw
      ? "تعادل! 🤝"
      : "كفووو! 🏆",
    width / 2,
    245
  );

  ctx.font =
    "900 40px Arial";

  ctx.fillStyle =
    "#f5e9ff";

  ctx.fillText(
    isDraw
      ? "الفريقين قدّها"
      : `الفائز: ${finalWinnerName}`,
    width / 2,
    315
  );

  // Team 1
  drawRoundedRect(
    ctx,
    105,
    390,
    390,
    270,
    38
  );

  const team1Gradient =
    ctx.createLinearGradient(
      105,
      390,
      495,
      660
    );

  team1Gradient.addColorStop(
    0,
    "rgba(217,70,239,0.55)"
  );

  team1Gradient.addColorStop(
    1,
    "rgba(126,34,206,0.25)"
  );

  ctx.fillStyle =
    team1Gradient;

  ctx.fill();

  ctx.strokeStyle =
    "rgba(240,171,252,0.75)";

  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle =
    "#fae8ff";

  ctx.font =
    "900 32px Arial";

  ctx.fillText(
    side1 || "فريق 1",
    300,
    460
  );

  ctx.font =
    "900 110px Arial";

  ctx.fillText(
    String(side1Score),
    300,
    590
  );

  // Team 2
  drawRoundedRect(
    ctx,
    585,
    390,
    390,
    270,
    38
  );

  const team2Gradient =
    ctx.createLinearGradient(
      585,
      390,
      975,
      660
    );

  team2Gradient.addColorStop(
    0,
    "rgba(34,211,238,0.52)"
  );

  team2Gradient.addColorStop(
    1,
    "rgba(37,99,235,0.25)"
  );

  ctx.fillStyle =
    team2Gradient;

  ctx.fill();

  ctx.strokeStyle =
    "rgba(103,232,249,0.75)";

  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle =
    "#cffafe";

  ctx.font =
    "900 32px Arial";

  ctx.fillText(
    side2 || "فريق 2",
    780,
    460
  );

  ctx.font =
    "900 110px Arial";

  ctx.fillText(
    String(side2Score),
    780,
    590
  );

  // Separator
  ctx.fillStyle =
    "rgba(255,255,255,0.35)";

  ctx.font =
    "900 48px Arial";

  ctx.fillText(
    "-",
    width / 2,
    540
  );

  // Session details
  const draws =
    roundStats.filter(
      (stat) =>
        stat.winner ===
        "none"
    ).length;

  const roundText =
    getRoundsLabel(
      roundStats.length
    );

  const drawText =
    draws === 0
      ? "بدون تعادل"
      : draws === 1
        ? "تعادل واحد"
        : `${draws} تعادل`;

  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    "900 40px Arial";

  ctx.fillText(
    "نتيجة الجلسة",
    width / 2,
    755
  );

  ctx.fillStyle =
    "rgba(255,255,255,0.68)";

  ctx.font =
    "700 28px Arial";

  ctx.fillText(
    `${roundText}  •  ${drawText}`,
    width / 2,
    810
  );

  // CTA card
  drawRoundedRect(
    ctx,
    145,
    895,
    790,
    205,
    38
  );

  ctx.fillStyle =
    "rgba(255,255,255,0.055)";

  ctx.fill();

  ctx.strokeStyle =
    "rgba(255,255,255,0.12)";

  ctx.lineWidth = 2;

  ctx.stroke();

  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    "900 44px Arial";

  ctx.fillText(
    "تقدرون تتحدونا؟ 👀",
    width / 2,
    975
  );

  ctx.fillStyle =
    "rgba(255,255,255,0.60)";

  ctx.font =
    "700 27px Arial";

  ctx.fillText(
    "العبوا خل نلعب وشوفوا مين يفوز",
    width / 2,
    1035
  );

  // Footer
  ctx.fillStyle =
    "#67e8f9";

  ctx.font =
    "900 38px Arial";

  ctx.fillText(
    "خل نلعب",
    width / 2,
    1180
  );

  ctx.fillStyle =
    "rgba(255,255,255,0.38)";

  ctx.font =
    "600 23px Arial";

  ctx.fillText(
    window.location.host,
    width / 2,
    1230
  );

  const blob =
    await new Promise<
      Blob | null
    >((resolve) => {
      canvas.toBlob(
        resolve,
        "image/png",
        1
      );
    });

  if (!blob) {
    throw new Error(
      "فشل إنشاء صورة النتيجة"
    );
  }

  return new File(
    [blob],
    "khal-nelab-result.png",
    {
      type: "image/png",
    }
  );
}

export default function MatchPage() {
  const router = useRouter();

  const transitionTimer =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const roundResultTimer =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const [
    mode,
    setMode,
  ] = useState<ModeType>(
    "session"
  );

  const [
    phase,
    setPhase,
  ] = useState<PhaseType>(
    "setup"
  );

  const [
    countdown,
    setCountdown,
  ] = useState(3);

  const [
    side1,
    setSide1,
  ] = useState("");

  const [
    side2,
    setSide2,
  ] = useState("");

  const [
    selectedGames,
    setSelectedGames,
  ] = useState<GameType[]>(
    []
  );

  const [
    gameRounds,
    setGameRounds,
  ] = useState<
    Record<string, number>
  >({});

  const [
    quizCategories,
    setQuizCategories,
  ] = useState<
    QuizCategoryKey[]
  >([]);

  const [
    timerEnabled,
    setTimerEnabled,
  ] = useState(false);

  const [
    timerSeconds,
    setTimerSeconds,
  ] = useState(30);

  const [
    queue,
    setQueue,
  ] = useState<Round[]>(
    []
  );

  const [
    started,
    setStarted,
  ] = useState(false);

  const [
    index,
    setIndex,
  ] = useState(0);

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
  ] = useState<
    RoundStat[]
  >([]);

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
  ] =
    useState<WinnerType>(
      "none"
    );

  const current =
    queue[index];

  const nextRound =
    queue[index + 1];

  function clearFlowTimers() {
    if (
      transitionTimer.current
    ) {
      clearTimeout(
        transitionTimer.current
      );

      transitionTimer.current =
        null;
    }

    if (
      roundResultTimer.current
    ) {
      clearTimeout(
        roundResultTimer.current
      );

      roundResultTimer.current =
        null;
    }
  }

  function resetRoundFlow() {
    clearFlowTimers();

    setStarted(false);
    setIndex(0);
    setQueue([]);

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

    setCountdown(3);

    setPhase(
      "setup"
    );
  }

  function start() {
    if (
      selectedGames.length ===
      0
    ) {
      alert(
        "اختر لعبة"
      );

      return;
    }

    if (
      selectedGames.includes(
        "quiz"
      ) &&
      quizCategories.length ===
        0
    ) {
      alert(
        "اختر فئة للأسئلة"
      );

      return;
    }

    const builtQueue =
      buildRoundQueue(
        selectedGames,
        gameRounds,
        quizCategories
      );

    /*
      تحميل الألعاب يبدأ هنا بدل أول ما يدخل المستخدم صفحة /match.
      العد التنازلي يعطيها وقت تتحمل قبل بدء الجولة.
    */
    preloadGames(
      selectedGames
    );

    clearFlowTimers();

    setQueue(
      builtQueue
    );

    setStarted(
      false
    );

    setIndex(0);

    setSide1(
      side1.trim() ||
        "فريق 1"
    );

    setSide2(
      side2.trim() ||
        "فريق 2"
    );

    setSide1Score(
      0
    );

    setSide2Score(
      0
    );

    setRoundStats(
      []
    );

    setShowWinner(
      false
    );

    setShowRoundWinnerPicker(
      false
    );

    setShowRoundResult(
      false
    );

    setRoundResultWinner(
      "none"
    );

    setCountdown(
      3
    );

    setPhase(
      "countdown"
    );
  }

  function finishSession(
    finalSide1Score: number,
    finalSide2Score: number
  ) {
    clearFlowTimers();

    setSide1Score(
      finalSide1Score
    );

    setSide2Score(
      finalSide2Score
    );

    setShowRoundResult(
      false
    );

    setShowRoundWinnerPicker(
      false
    );

    setStarted(
      false
    );

    setPhase(
      "finished"
    );

    setShowWinner(
      true
    );
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

    const upcomingRound =
      queue[index + 1];

    if (
      upcomingRound
    ) {
      preloadGames([
        upcomingRound.game,
      ]);
    }

    setPhase(
      "transition"
    );

    transitionTimer.current =
      setTimeout(
        () => {
          setIndex(
            (
              currentIndex
            ) =>
              currentIndex +
              1
          );

          setPhase(
            "playing"
          );

          transitionTimer.current =
            null;
        },
        1500
      );
  }

  function applyRoundWinner(
    winner?: WinnerType
  ) {
    if (!current) {
      return;
    }

    const finalWinner =
      winner ?? "none";

    const nextSide1Score =
      side1Score +
      (finalWinner ===
      "side1"
        ? 1
        : 0);

    const nextSide2Score =
      side2Score +
      (finalWinner ===
      "side2"
        ? 1
        : 0);

    setRoundStats(
      (
        previous
      ) => [
        ...previous,
        {
          game:
            current.game,

          round:
            index + 1,

          winner:
            finalWinner,
        },
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

    setShowRoundResult(
      true
    );

    roundResultTimer.current =
      setTimeout(
        () => {
          setShowRoundResult(
            false
          );

          roundResultTimer.current =
            null;

          goToNextRound(
            nextSide1Score,
            nextSide2Score
          );
        },
        2500
      );
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
    resetRoundFlow();

    if (
      mode === "session"
    ) {
      setSelectedGames(
        []
      );

      setGameRounds(
        {}
      );

      setQuizCategories(
        []
      );
    }
  }

  function goHome() {
    clearFlowTimers();

    router.push("/");
  }

  useEffect(() => {
    if (
      phase !==
      "countdown"
    ) {
      return;
    }

    if (
      countdown > 0
    ) {
      const timer =
        setTimeout(
          () => {
            setCountdown(
              (
                currentCountdown
              ) =>
                currentCountdown -
                1
            );
          },
          800
        );

      return () =>
        clearTimeout(
          timer
        );
    }

    const startTimer =
      setTimeout(
        () => {
          setStarted(
            true
          );

          setPhase(
            "playing"
          );
        },
        650
      );

    return () =>
      clearTimeout(
        startTimer
      );
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
      params.get(
        "mode"
      );

    const gameParam =
      params.get(
        "game"
      );

    const category =
      params.get(
        "category"
      ) as
        | QuizCategoryKey
        | null;

    if (
      urlMode ===
        "session" ||
      !isGameType(
        gameParam
      )
    ) {
      setMode(
        "session"
      );

      return;
    }

    setMode(
      "quick"
    );

    setSelectedGames([
      gameParam,
    ]);

    setGameRounds({
      [gameParam]:
        getDefaultRounds(
          gameParam
        ),
    });

    setQuizCategories(
      gameParam ===
        "quiz" &&
        category
        ? [category]
        : []
    );

    /*
      ما فيه preload هنا.
      نخلي شاشة الإعداد تظهر أولًا.
    */
  }, []);

  useEffect(() => {
    return () =>
      clearFlowTimers();
  }, []);

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

  async function handleShareResult() {
    try {
      const imageFile =
        await createResultShareImage(
          {
            isDraw,

            finalWinnerName,

            side1,
            side2,

            side1Score,
            side2Score,

            roundStats,
          }
        );

      if (
        navigator.share &&
        navigator.canShare?.(
          {
            files: [
              imageFile,
            ],
          }
        )
      ) {
        await navigator.share(
          {
            title:
              "نتيجتنا في خل نلعب 🎮",

            text: isDraw
              ? "تعادلنا في خل نلعب 🤝"
              : `${finalWinnerName} فاز في خل نلعب 🏆`,

            files: [
              imageFile,
            ],
          }
        );

        return;
      }

      const imageUrl =
        URL.createObjectURL(
          imageFile
        );

      const link =
        document.createElement(
          "a"
        );

      link.href =
        imageUrl;

      link.download =
        "khal-nelab-result.png";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      URL.revokeObjectURL(
        imageUrl
      );
    } catch (
      error
    ) {
      console.log(
        "Share cancelled or failed",
        error
      );
    }
  }

  const commonGameProps = {
    onRoundEnd:
      endRound,

    roundKey:
      index,

    side1Name:
      side1,

    side2Name:
      side2,

    currentRound:
      index + 1,

    timerEnabled,

    timerSeconds,
  };

  function renderCurrentGame() {
    if (!current) {
      return null;
    }

    switch (
      current.game
    ) {
      case "word":
        return (
          <WordGame
            {...commonGameProps}
            side1Score={
              side1Score
            }
            side2Score={
              side2Score
            }
          />
        );

      case "quiz":
        return (
          <QuizGame
            {...commonGameProps}
            category={
              current.category
            }
          />
        );

      case "scramble":
        return (
          <ScrambleGame
            {...commonGameProps}
          />
        );

      case "wheel":
        return (
          <WheelGame
            {...commonGameProps}
          />
        );

      case "categories":
        return (
          <CategoriesGame
            {...commonGameProps}
          />
        );

      case "draw":
        return (
          <ProverbGame
            {...commonGameProps}
          />
        );
    }
  }

  return (
    <main className="min-h-screen p-6 text-white">
      <Link
        href="/"
        prefetch
        className="fixed left-5 top-5 z-[999] flex items-center gap-2 rounded-full border border-cyan-400/30 bg-gradient-to-r from-[#119DFF] to-[#3C5BFF] px-5 py-3 font-black text-white shadow-[0_0_20px_rgba(17,157,255,.45)] transition-all hover:scale-105"
      >
        🏠 الرئيسية
      </Link>

      {phase ===
        "countdown" && (
        <CountdownOverlay
          countdown={
            countdown
          }
        />
      )}

      {phase ===
        "transition" &&
        nextRound && (
          <TransitionOverlay
            nextRound={
              nextRound
            }
          />
        )}

      <WinnerOverlay
        show={
          showWinner
        }
        winnerName={
          finalWinnerName
        }
        isDraw={
          isDraw
        }
        mode={
          mode
        }
        side1Name={
          side1
        }
        side2Name={
          side2
        }
        side1Score={
          side1Score
        }
        side2Score={
          side2Score
        }
        roundStats={
          roundStats
        }
        onRestart={
          restart
        }
        onGoHome={
          goHome
        }
        onShare={
          handleShareResult
        }
      />

      <RoundWinnerPicker
        show={
          showRoundWinnerPicker
        }
        side1Name={
          side1
        }
        side2Name={
          side2
        }
        onPick={
          applyRoundWinner
        }
      />

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
          mode={
            mode
          }

          side1={
            side1
          }

          side2={
            side2
          }

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

          onStart={
            start
          }
        />
      ) : (
        <div className="mx-auto max-w-5xl">
          {renderCurrentGame()}

          <p className="mt-5 text-center text-sm font-bold text-white/50">
            الجولة{" "}
            {index + 1}{" "}
            من{" "}
            {queue.length}
          </p>
        </div>
      )}
    </main>
  );
}
