'use client';

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";

import SetupGame from "@/components/SetupGame";
import {
  OverlayHeading,
  OverlayShell,
  TeamPickModal,
} from "@/components/match/Overlays";
import {
  quizCategoryMeta,
  type QuizCategoryKey,
} from "@/data/quiz/meta";
import {
  buildRoundQueue,
  getDefaultRounds,
  isGameType,
  isQuizCategory,
  type GameType,
  type Round,
} from "@/lib/matchQueue";
import { clearRoundState } from "@/lib/roundState";
import type { WinnerType } from "@/types/game";

type ModeType = "session" | "quick";

type PhaseType =
  | "setup"
  | "countdown"
  | "playing"
  | "transition"
  | "finished";

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

const GAME_NAMES: Record<GameType, string> = {
  word: "💬 خمن الكلمة",
  quiz: "❓ أسئلة وأجوبة",
  scramble: "🕵🏻‍♂️ منهو ذا؟",
  wheel: "🎡 لف وخمن",
  categories: "🌍 إنسان حيوان نبات جماد بلاد",
  draw: "✏️ خمن المثل",
  logo: "🏷️ خمن الشعار",
  country: "🚩 خمن العلم",
};

const GAME_LOADERS = {
  word: () => import("@/components/match/WordGame"),
  quiz: () => import("@/components/match/QuizGame"),
  scramble: () => import("@/components/match/ScrambleGame"),
  wheel: () => import("@/components/match/WheelGame"),
  categories: () => import("@/components/match/CategoriesGame"),
  draw: () => import("@/components/match/ProverbGame"),
  logo: () => import("@/components/match/LogoGame"),
  country: () => import("@/components/match/CountryGame"),
};

function GameLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl rounded-[24px] border border-white/10 bg-[#121028]/80 p-8 text-center">
      <p className="text-sm font-black text-cyan-200/70">
        لحظة نجهز اللعبة...
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

const LogoGame = dynamic(GAME_LOADERS.logo, {
  ssr: false,
  loading: GameLoading,
});

const CountryGame = dynamic(GAME_LOADERS.country, {
  ssr: false,
  loading: GameLoading,
});

function getGameName(game: GameType) {
  return GAME_NAMES[game];
}

function getRoundsLabel(count: number) {
  if (count === 1) return "جولة وحدة";
  if (count === 2) return "جولتين";
  if (count >= 3 && count <= 10) return `${count} جولات`;

  return `${count} جولة`;
}

const SAVED_MATCH_KEY = "khal-nelab-match";

type SavedMatch = {
  search: string;
  mode: ModeType;
  side1: string;
  side2: string;
  selectedGames: GameType[];
  gameRounds: Record<string, number>;
  quizCategories: QuizCategoryKey[];
  timerEnabled: boolean;
  timerSeconds: number;
  queue: Round[];
  index: number;
  side1Score: number;
  side2Score: number;
  roundStats: RoundStat[];
};

function saveMatch(match: SavedMatch) {
  try {
    sessionStorage.setItem(
      SAVED_MATCH_KEY,
      JSON.stringify(match)
    );
  } catch {}
}

function clearSavedMatch() {
  clearRoundState();

  try {
    sessionStorage.removeItem(SAVED_MATCH_KEY);
  } catch {}
}

function readSavedMatch(
  search: string
): SavedMatch | null {
  try {
    const raw = sessionStorage.getItem(
      SAVED_MATCH_KEY
    );

    if (!raw) return null;

    const match = JSON.parse(raw) as SavedMatch;

    const valid =
      match.search === search &&
      Array.isArray(match.queue) &&
      match.queue.length > 0 &&
      match.queue.every(
        (round) =>
          isGameType(round.game) &&
          (round.category === null ||
            isQuizCategory(round.category))
      ) &&
      Number.isInteger(match.index) &&
      match.index >= 0 &&
      match.index < match.queue.length &&
      Array.isArray(match.roundStats);

    return valid ? match : null;
  } catch {
    return null;
  }
}

function preloadGames(games: GameType[]) {
  games.forEach((game) => {
    void GAME_LOADERS[game]().catch(
      () => {}
    );
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
  sharing,
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
  sharing: boolean;
  onRestart: () => void;
  onGoHome: () => void;
  onShare: () => void;
}) {
  if (!show) return null;

  const totalDraws = roundStats.filter(
    (stat) => stat.winner === "none"
  ).length;

  const gameStats =
    getGameStats(roundStats);

  const side1Leads =
    side1Score > side2Score;

  const side2Leads =
    side2Score > side1Score;

  return (
    <OverlayShell size="lg">
      <OverlayHeading
        kicker={
          mode === "quick"
            ? "خلصت اللعبة"
            : "خلصت الجلسة"
        }
        title={
          isDraw
            ? "تعادل! 🤝"
            : "كفووو! 🏆"
        }
      />

      <p className="mt-2 truncate text-xl font-black text-white sm:text-3xl">
        {isDraw
          ? "الفريقين قدّها"
          : `الفائز: ${winnerName}`}
      </p>

      <div className="mx-auto mt-5 grid max-w-2xl grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:mt-6 sm:gap-4">
        <div
          className={`min-w-0 rounded-[24px] border p-3 sm:p-5 ${
            side1Leads
              ? "border-fuchsia-300/80 bg-gradient-to-br from-fuchsia-500/40 to-purple-500/20"
              : "border-fuchsia-300/30 bg-fuchsia-500/10"
          }`}
        >
          <p className="truncate text-sm font-black text-fuchsia-100/90 sm:text-base">
            {side1Leads && "👑 "}
            {side1Name || "فريق 1"}
          </p>

          <p className="mt-2 text-5xl font-black leading-none text-fuchsia-50 sm:text-6xl">
            {side1Score}
          </p>
        </div>

        <div className="flex items-center justify-center text-2xl font-black text-white/25 sm:text-3xl">
          -
        </div>

        <div
          className={`min-w-0 rounded-[24px] border p-3 sm:p-5 ${
            side2Leads
              ? "border-cyan-300/80 bg-gradient-to-br from-cyan-400/40 to-blue-500/20"
              : "border-cyan-300/30 bg-cyan-400/10"
          }`}
        >
          <p className="truncate text-sm font-black text-cyan-100/90 sm:text-base">
            {side2Leads && "👑 "}
            {side2Name || "فريق 2"}
          </p>

          <p className="mt-2 text-5xl font-black leading-none text-cyan-50 sm:text-6xl">
            {side2Score}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm font-bold text-white/45">
        {getRoundsLabel(roundStats.length)}
        {totalDraws > 0 &&
          ` • تعادل ${totalDraws}`}
      </p>

      {mode === "session" &&
        gameStats.length > 1 && (
          <div className="mt-5 border-t border-white/10 pt-4 text-right">
            <p className="mb-3 text-base font-black text-white/80">
              نتايج الألعاب
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {gameStats.map((stat) => (
                <div
                  key={stat.game}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-white sm:text-base">
                      {getGameName(stat.game)}
                    </p>

                    <p className="text-xs font-bold text-white/40">
                      {getRoundsLabel(stat.total)}
                      {stat.draws > 0 &&
                        ` • تعادل ${stat.draws}`}
                    </p>
                  </div>

                  <div
                    className="flex shrink-0 items-center gap-1.5"
                    dir="rtl"
                  >
                    <span
                      className={`flex h-9 min-w-[38px] items-center justify-center rounded-xl border px-2 text-lg font-black ${
                        stat.side1Wins >
                        stat.side2Wins
                          ? "border-fuchsia-300/70 bg-fuchsia-500/30 text-fuchsia-50"
                          : "border-fuchsia-300/25 bg-fuchsia-500/10 text-fuchsia-100/70"
                      }`}
                    >
                      {stat.side1Wins}
                    </span>

                    <span className="text-white/25">
                      -
                    </span>

                    <span
                      className={`flex h-9 min-w-[38px] items-center justify-center rounded-xl border px-2 text-lg font-black ${
                        stat.side2Wins >
                        stat.side1Wins
                          ? "border-cyan-300/70 bg-cyan-400/30 text-cyan-50"
                          : "border-cyan-300/25 bg-cyan-400/10 text-cyan-100/70"
                      }`}
                    >
                      {stat.side2Wins}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      <div className="mt-6 grid gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="btn-primary"
        >
          {mode === "quick"
            ? "نعيدها؟"
            : "تحدي جديد"}
        </button>

        <button
          type="button"
          onClick={onShare}
          disabled={sharing}
          className="btn-secondary"
        >
          📤 شارك النتيجة
        </button>

        <button
          type="button"
          onClick={onGoHome}
          className="btn-secondary"
        >
          الرئيسية
        </button>
      </div>
    </OverlayShell>
  );
}

function CountdownOverlay({
  countdown,
}: {
  countdown: number;
}) {
  return (
    <OverlayShell size="sm" zIndex="z-[998]">
      <p className="text-xl font-black text-white/70">
        استعدوا
      </p>

      <p
        key={countdown}
        className="arcade-title animate-fade-in-up mt-4"
      >
        {countdown === 0
          ? "يلا!"
          : countdown}
      </p>
    </OverlayShell>
  );
}

function TransitionOverlay({
  nextRound,
}: {
  nextRound: Round;
}) {
  return (
    <OverlayShell zIndex="z-[998]">
      <p className="text-sm font-black text-cyan-300/80">
        اللي بعدها
      </p>

      <p className="mt-4 text-3xl font-black text-white sm:text-4xl">
        {getGameName(
          nextRound.game
        )}
      </p>

      {nextRound.category && (
        <p className="mt-3 text-base font-bold text-white/60">
          {quizCategoryMeta[nextRound.category].emoji}{" "}
          {quizCategoryMeta[nextRound.category].title}
        </p>
      )}
    </OverlayShell>
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
    <OverlayShell>
      <OverlayHeading
        kicker="خلصت الجولة"
        title={
          isDraw
            ? "تعادل! 🤝"
            : "كفووو! 🏆"
        }
      />

      <p className="arcade-winner mt-5 truncate">
        {isDraw
          ? "محد أخذ نقطة الجولة"
          : `الجولة لـ ${winnerName}`}
      </p>
    </OverlayShell>
  );
}

function SessionBattleBar({
  side1Name,
  side2Name,
  side1Control,
  nextGame,
}: {
  side1Name: string;
  side2Name: string;
  side1Control: number;
  nextGame?: GameType;
}) {
  const boundaryPosition =
    100 - side1Control;

  const markerPosition = Math.max(
    2,
    Math.min(
      98,
      boundaryPosition
    )
  );

  return (
    <div
      className="
        mb-3
        w-full
        rounded-2xl
        border border-white/[0.08]
        bg-[#10081c]/95
        px-4 py-2

        md:fixed
        md:left-1/2
        md:top-3
        md:z-[50]
        md:mb-0
        md:w-[calc(100%_-_10rem)]
        md:max-w-[976px]
        md:-translate-x-1/2
      "
    >
      <div
        className="mb-1.5 grid grid-cols-[1fr_auto_1fr] items-center gap-3"
        dir="ltr"
      >
        <p className="min-w-0 truncate text-left text-[11px] font-black text-cyan-100/70 sm:text-xs">
          {side2Name || "فريق 2"}
        </p>

        <div
          className="flex min-w-0 items-center justify-center gap-1.5"
          dir="rtl"
        >
          {nextGame ? (
            <>
              <span className="text-[10px] font-bold text-white/40">
                التالي:
              </span>

              <span className="max-w-[300px] truncate text-[11px] font-black text-white/75 sm:text-xs">
                {getGameName(
                  nextGame
                )}
              </span>
            </>
          ) : (
            <span className="text-[11px] font-black text-amber-100/80 sm:text-xs">
              🏆 آخر لعبة
            </span>
          )}
        </div>

        <p className="min-w-0 truncate text-right text-[11px] font-black text-fuchsia-100/70 sm:text-xs">
          {side1Name || "فريق 1"}
        </p>
      </div>

      <div className="relative">
        <div className="relative h-2.5 overflow-hidden rounded-full border border-white/[0.07] bg-gradient-to-r from-cyan-500 via-cyan-500 to-cyan-400">
          <div
            className="
              absolute inset-y-0 right-0
              bg-gradient-to-l
              from-fuchsia-600
              via-fuchsia-500
              to-purple-500
              transition-[width]
              duration-700
              ease-out
            "
            style={{
              width: `${side1Control}%`,
            }}
          />

          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/20" />
        </div>

        <div
          className="
            pointer-events-none
            absolute top-1/2 z-20
            flex h-5 w-5
            -translate-x-1/2 -translate-y-1/2
            items-center justify-center
            rounded-full
            border border-white/15
            bg-[#130b20]
            text-[9px]
            shadow-[0_0_7px_rgba(139,92,246,.18)]
            transition-[left]
            duration-700
            ease-out
          "
          style={{
            left: `${markerPosition}%`,
          }}
        >
          🏆
        </div>
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

  ctx.moveTo(x + r, y);

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

function getVisibleBounds(image: HTMLImageElement) {
  const full = {
    x: 0,
    y: 0,
    width: image.naturalWidth,
    height: image.naturalHeight,
  };

  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext("2d");

  if (!ctx) return full;

  ctx.drawImage(image, 0, 0);

  const { data } = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      if (data[(y * canvas.width + x) * 4 + 3] > 8) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) return full;

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
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

  const logo =
    await new Promise<HTMLImageElement | null>(
      (resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = "/logo.png";
      }
    );

  const fontFamily =
    getComputedStyle(document.body).fontFamily ||
    "Arial, sans-serif";

  try {
    await Promise.all([
      document.fonts.load(`700 40px ${fontFamily}`, "خل نلعب"),
      document.fonts.load(`500 28px ${fontFamily}`, "خل نلعب"),
    ]);
  } catch {}

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "Canvas غير مدعوم"
    );
  }

  const {
    width,
    height,
  } = canvas;

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

  ctx.fillStyle =
    background;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  const pinkGlow =
    ctx.createRadialGradient(
      930,
      470,
      20,
      930,
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

  ctx.fillStyle =
    pinkGlow;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

  const cyanGlow =
    ctx.createRadialGradient(
      150,
      500,
      20,
      150,
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

  ctx.fillStyle =
    cyanGlow;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

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

  ctx.textAlign =
    "center";

  ctx.direction =
    "rtl";

  if (logo) {
    const bounds = getVisibleBounds(logo);
    const logoHeight = 160;
    const logoWidth =
      (bounds.width / bounds.height) * logoHeight;

    ctx.drawImage(
      logo,
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      (width - logoWidth) / 2,
      70,
      logoWidth,
      logoHeight
    );
  } else {
    ctx.fillStyle =
      "#67e8f9";

    ctx.font =
      `900 44px ${fontFamily}`;

    ctx.fillText(
      "خل نلعب",
      width / 2,
      170
    );
  }

  ctx.fillStyle =
    "#ffffff";

  ctx.font =
    `900 72px ${fontFamily}`;

  ctx.fillText(
    isDraw
      ? "تعادل! 🤝"
      : "كفووو! 🏆",
    width / 2,
    300
  );

  ctx.font =
    `900 40px ${fontFamily}`;

  ctx.fillStyle =
    "#f5e9ff";

  ctx.fillText(
    isDraw
      ? "الفريقين قدّها"
      : `الفائز: ${finalWinnerName}`,
    width / 2,
    370
  );

  drawRoundedRect(
    ctx,
    585,
    445,
    390,
    270,
    38
  );

  const team1Gradient =
    ctx.createLinearGradient(
      585,
      445,
      975,
      715
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
    `900 32px ${fontFamily}`;

  ctx.fillText(
    side1 || "فريق 1",
    780,
    515
  );

  ctx.font =
    `900 110px ${fontFamily}`;

  ctx.fillText(
    String(side1Score),
    780,
    645
  );

  drawRoundedRect(
    ctx,
    105,
    445,
    390,
    270,
    38
  );

  const team2Gradient =
    ctx.createLinearGradient(
      105,
      445,
      495,
      715
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
    `900 32px ${fontFamily}`;

  ctx.fillText(
    side2 || "فريق 2",
    300,
    515
  );

  ctx.font =
    `900 110px ${fontFamily}`;

  ctx.fillText(
    String(side2Score),
    300,
    645
  );

  ctx.fillStyle =
    "rgba(255,255,255,0.35)";

  ctx.font =
    `900 48px ${fontFamily}`;

  ctx.fillText(
    "-",
    width / 2,
    595
  );

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
    `900 40px ${fontFamily}`;

  ctx.fillText(
    "نتيجة الجلسة",
    width / 2,
    810
  );

  ctx.fillStyle =
    "rgba(255,255,255,0.68)";

  ctx.font =
    `700 28px ${fontFamily}`;

  ctx.fillText(
    `${roundText}  •  ${drawText}`,
    width / 2,
    865
  );

  drawRoundedRect(
    ctx,
    145,
    950,
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
    `900 44px ${fontFamily}`;

  ctx.fillText(
    "تقدرون تتحدونا؟ 👀",
    width / 2,
    1030
  );

  ctx.fillStyle =
    "rgba(255,255,255,0.60)";

  ctx.font =
    `700 27px ${fontFamily}`;

  ctx.fillText(
    "العبوا خل نلعب وشوفوا مين يفوز",
    width / 2,
    1090
  );

  ctx.fillStyle =
    "rgba(255,255,255,0.38)";

  ctx.font =
    `600 23px ${fontFamily}`;

  ctx.fillText(
    window.location.host,
    width / 2,
    1235
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

  const transitionTimer = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const roundResultTimer = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const endingRoundRef = useRef<number | null>(
    null
  );

  const resolvedRoundRef = useRef<number | null>(
    null
  );

  const sharingRef = useRef(false);

  const [mode, setMode] =
    useState<ModeType>("session");

  const [phase, setPhase] =
    useState<PhaseType>("setup");

  const [countdown, setCountdown] =
    useState(3);

  const [side1, setSide1] = useState("");
  const [side2, setSide2] = useState("");

  const [selectedGames, setSelectedGames] =
    useState<GameType[]>([]);

  const [gameRounds, setGameRounds] =
    useState<Record<string, number>>({});

  const [quizCategories, setQuizCategories] =
    useState<QuizCategoryKey[]>([]);

  const [timerEnabled, setTimerEnabled] =
    useState(false);

  const [timerSeconds, setTimerSeconds] =
    useState(30);

  const [queue, setQueue] = useState<Round[]>(
    []
  );

  const [started, setStarted] =
    useState(false);

  const [index, setIndex] = useState(0);

  const [side1Score, setSide1Score] =
    useState(0);

  const [side2Score, setSide2Score] =
    useState(0);

  const [roundStats, setRoundStats] =
    useState<RoundStat[]>([]);

  const [showWinner, setShowWinner] =
    useState(false);

  const [
    showRoundWinnerPicker,
    setShowRoundWinnerPicker,
  ] = useState(false);

  const [showRoundResult, setShowRoundResult] =
    useState(false);

  const [
    roundResultWinner,
    setRoundResultWinner,
  ] = useState<WinnerType>("none");

  const [sharing, setSharing] =
    useState(false);

  const current = queue[index];

  const nextRound = queue[index + 1];

  const nextDifferentGame = current
    ? queue
        .slice(index + 1)
        .find(
          (round) =>
            round.game !== current.game
        )?.game
    : undefined;

  const battleStep =
    queue.length > 0
      ? 50 / queue.length
      : 0;

  const side1Control = Math.max(
    0,
    Math.min(
      100,
      50 +
        (side1Score - side2Score) *
          battleStep
    )
  );

  function snapshot(
    overrides: Partial<SavedMatch>
  ): SavedMatch {
    return {
      search: window.location.search,
      mode,
      side1,
      side2,
      selectedGames,
      gameRounds,
      quizCategories,
      timerEnabled,
      timerSeconds,
      queue,
      index,
      side1Score,
      side2Score,
      roundStats,
      ...overrides,
    };
  }

  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;

  function clearFlowTimers() {
    if (transitionTimer.current) {
      clearTimeout(transitionTimer.current);
      transitionTimer.current = null;
    }

    if (roundResultTimer.current) {
      clearTimeout(roundResultTimer.current);
      roundResultTimer.current = null;
    }
  }

  function resetRoundGuards() {
    endingRoundRef.current = null;
    resolvedRoundRef.current = null;
  }

  function resetRoundFlow() {
    clearFlowTimers();
    resetRoundGuards();
    clearSavedMatch();

    setStarted(false);
    setIndex(0);
    setQueue([]);

    setSide1Score(0);
    setSide2Score(0);

    setRoundStats([]);

    setShowWinner(false);
    setShowRoundWinnerPicker(false);
    setShowRoundResult(false);
    setRoundResultWinner("none");

    setCountdown(3);
    setPhase("setup");
  }

  function start() {
    if (phase !== "setup") {
      return;
    }

    if (selectedGames.length === 0) {
      return;
    }

    if (
      selectedGames.includes("quiz") &&
      quizCategories.length === 0
    ) {
      return;
    }

    const builtQueue = buildRoundQueue(
      selectedGames,
      gameRounds,
      quizCategories
    );

    if (builtQueue.length === 0) {
      return;
    }

    preloadGames(selectedGames);

    clearFlowTimers();
    resetRoundGuards();
    clearRoundState();

    setQueue(builtQueue);

    setStarted(false);
    setIndex(0);

    setSide1(side1.trim() || "فريق 1");
    setSide2(side2.trim() || "فريق 2");

    setSide1Score(0);
    setSide2Score(0);

    setRoundStats([]);

    setShowWinner(false);
    setShowRoundWinnerPicker(false);
    setShowRoundResult(false);
    setRoundResultWinner("none");

    setCountdown(3);
    setPhase("countdown");
  }

  function finishSession(
    finalSide1Score: number,
    finalSide2Score: number
  ) {
    clearFlowTimers();

    setSide1Score(finalSide1Score);
    setSide2Score(finalSide2Score);

    setShowRoundResult(false);
    setShowRoundWinnerPicker(false);

    setStarted(false);
    setPhase("finished");
    setShowWinner(true);
  }

  function goToNextRound(
    nextSide1Score: number,
    nextSide2Score: number
  ) {
    if (index + 1 >= queue.length) {
      finishSession(
        nextSide1Score,
        nextSide2Score
      );

      return;
    }

    const upcomingRound = queue[index + 1];

    if (upcomingRound) {
      preloadGames([upcomingRound.game]);
    }

    setPhase("transition");

    transitionTimer.current = setTimeout(() => {
      setIndex(
        (currentIndex) => currentIndex + 1
      );

      setPhase("playing");

      transitionTimer.current = null;
    }, 1500);
  }

  function applyRoundWinner(
    winner?: WinnerType
  ) {
    if (
      !current ||
      phase !== "playing" ||
      resolvedRoundRef.current === index
    ) {
      return;
    }

    resolvedRoundRef.current = index;
    endingRoundRef.current = index;

    clearRoundState();

    const finalWinner = winner ?? "none";

    const nextSide1Score =
      side1Score +
      (finalWinner === "side1" ? 1 : 0);

    const nextSide2Score =
      side2Score +
      (finalWinner === "side2" ? 1 : 0);

    const nextRoundStats: RoundStat[] = [
      ...roundStats,
      {
        game: current.game,
        round: index + 1,
        winner: finalWinner,
      },
    ];

    setRoundStats(nextRoundStats);

    setSide1Score(nextSide1Score);
    setSide2Score(nextSide2Score);

    setShowRoundWinnerPicker(false);

    if (index + 1 >= queue.length) {
      clearSavedMatch();

      finishSession(
        nextSide1Score,
        nextSide2Score
      );

      return;
    }

    saveMatch(
      snapshot({
        index: index + 1,
        side1Score: nextSide1Score,
        side2Score: nextSide2Score,
        roundStats: nextRoundStats,
      })
    );

    setRoundResultWinner(finalWinner);
    setShowRoundResult(true);

    roundResultTimer.current = setTimeout(() => {
      setShowRoundResult(false);

      roundResultTimer.current = null;

      goToNextRound(
        nextSide1Score,
        nextSide2Score
      );
    }, 2500);
  }

  function endRound(winner?: WinnerType) {
    if (
      !current ||
      phase !== "playing" ||
      endingRoundRef.current === index
    ) {
      return;
    }

    endingRoundRef.current = index;

    if (winner !== undefined) {
      applyRoundWinner(winner);
      return;
    }

    setShowRoundWinnerPicker(true);
  }

  function restart() {
    resetRoundFlow();

    if (mode === "session") {
      setSelectedGames([]);
      setGameRounds({});
      setQuizCategories([]);
    }
  }

  function goHome() {
    clearFlowTimers();
    clearSavedMatch();
    router.push("/");
  }

  function confirmLeave(
    event: MouseEvent<HTMLAnchorElement>
  ) {
    const inProgress =
      phase === "countdown" ||
      phase === "playing" ||
      phase === "transition";

    if (
      inProgress &&
      !window.confirm(
        "متأكدين؟ بتضيع نتيجة الجلسة"
      )
    ) {
      event.preventDefault();
      return;
    }

    clearFlowTimers();
    clearSavedMatch();
  }

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

      return () => clearTimeout(timer);
    }

    const startTimer = setTimeout(() => {
      saveMatch(snapshotRef.current({ index: 0 }));
      setStarted(true);
      setPhase("playing");
    }, 650);

    return () => clearTimeout(startTimer);
  }, [phase, countdown]);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const urlMode = params.get("mode");
    const gameParam = params.get("game");
    const categoryParam =
      params.get("category");

    const saved = readSavedMatch(
      window.location.search
    );

    if (saved) {
      setMode(saved.mode);
      setSide1(saved.side1);
      setSide2(saved.side2);
      setSelectedGames(saved.selectedGames);
      setGameRounds(saved.gameRounds);
      setQuizCategories(saved.quizCategories);
      setTimerEnabled(saved.timerEnabled);
      setTimerSeconds(saved.timerSeconds);
      setQueue(saved.queue);
      setIndex(saved.index);
      setSide1Score(saved.side1Score);
      setSide2Score(saved.side2Score);
      setRoundStats(saved.roundStats);
      setStarted(true);
      setPhase("playing");
      return;
    }

    if (
      urlMode === "session" ||
      !isGameType(gameParam)
    ) {
      setMode("session");
      return;
    }

    setMode("quick");

    setSelectedGames([gameParam]);

    setGameRounds({
      [gameParam]:
        getDefaultRounds(gameParam),
    });

    setQuizCategories(
      gameParam === "quiz" &&
        isQuizCategory(categoryParam)
        ? [categoryParam]
        : []
    );
  }, []);

  useEffect(() => {
    return () => clearFlowTimers();
  }, []);

  const finalWinnerName = useMemo(() => {
    if (side1Score > side2Score) {
      return side1 || "فريق 1";
    }

    if (side2Score > side1Score) {
      return side2 || "فريق 2";
    }

    return "تعادل";
  }, [side1Score, side2Score, side1, side2]);

  const isDraw = side1Score === side2Score;

  const roundWinnerName =
    roundResultWinner === "side1"
      ? side1 || "فريق 1"
      : roundResultWinner === "side2"
        ? side2 || "فريق 2"
        : "";

  const roundIsDraw =
    roundResultWinner === "none";

  async function handleShareResult() {
    if (sharingRef.current) {
      return;
    }

    sharingRef.current = true;
    setSharing(true);

    try {
      const imageFile =
        await createResultShareImage({
          isDraw,
          finalWinnerName,
          side1,
          side2,
          side1Score,
          side2Score,
          roundStats,
        });

      if (
        navigator.share &&
        navigator.canShare?.({
          files: [imageFile],
        })
      ) {
        await navigator.share({
          title: "نتيجتنا في خل نلعب 🎮",
          text: isDraw
            ? "تعادلنا في خل نلعب 🤝"
            : `${finalWinnerName} فاز في خل نلعب 🏆`,
          files: [imageFile],
        });

        return;
      }

      const imageUrl =
        URL.createObjectURL(imageFile);

      const link =
        document.createElement("a");

      link.href = imageUrl;
      link.download = "khal-nelab-result.png";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(
        () => URL.revokeObjectURL(imageUrl),
        1000
      );
    } catch (error) {
      console.log(
        "Share cancelled or failed",
        error
      );
    } finally {
      sharingRef.current = false;
      setSharing(false);
    }
  }

  const commonGameProps = {
    onRoundEnd: endRound,
    roundKey: index,
    side1Name: side1,
    side2Name: side2,
    currentRound: index + 1,
    timerEnabled,
    timerSeconds,
  };

  function renderCurrentGame() {
    if (!current) {
      return null;
    }

    switch (current.game) {
      case "word":
        return (
          <WordGame
            key={index}
            {...commonGameProps}
            side1Score={side1Score}
            side2Score={side2Score}
          />
        );

      case "quiz":
        return (
          <QuizGame
            key={index}
            {...commonGameProps}
            category={current.category}
          />
        );

      case "scramble":
        return (
          <ScrambleGame
            key={index}
            {...commonGameProps}
          />
        );

      case "wheel":
        return (
          <WheelGame
            key={index}
            {...commonGameProps}
          />
        );

      case "categories":
        return (
          <CategoriesGame
            key={index}
            {...commonGameProps}
          />
        );

      case "draw":
        return (
          <ProverbGame
            key={index}
            {...commonGameProps}
          />
        );

      case "logo":
        return (
          <LogoGame
            key={index}
            {...commonGameProps}
          />
        );

      case "country":
        return (
          <CountryGame
            key={index}
            {...commonGameProps}
          />
        );
    }
  }

  return (
    <main className="min-h-screen px-3 pb-6 pt-4 text-white sm:p-6">
      <Link
        href="/"
        prefetch
        onClick={confirmLeave}
        aria-label="الرئيسية"
        className="nav-pill fixed left-3 top-3 z-[60] px-0 sm:left-5 sm:top-5 sm:px-4"
      >
        <span aria-hidden="true">🏠</span>
        <span className="hidden lg:inline">
          الرئيسية
        </span>
      </Link>

      {phase === "countdown" && (
        <CountdownOverlay
          countdown={countdown}
        />
      )}

      {phase === "transition" &&
        nextRound && (
          <TransitionOverlay
            nextRound={nextRound}
          />
        )}

      <WinnerOverlay
        show={showWinner}
        winnerName={finalWinnerName}
        isDraw={isDraw}
        mode={mode}
        side1Name={side1}
        side2Name={side2}
        side1Score={side1Score}
        side2Score={side2Score}
        roundStats={roundStats}
        sharing={sharing}
        onRestart={restart}
        onGoHome={goHome}
        onShare={handleShareResult}
      />

      <TeamPickModal
        show={showRoundWinnerPicker}
        kicker="خلصت الجولة"
        title="مين أخذها؟ 🏆"
        side1Name={side1}
        side2Name={side2}
        noneLabel="ولا أحد 🤝"
        onPick={applyRoundWinner}
      />

      <RoundResultOverlay
        show={showRoundResult}
        winnerName={roundWinnerName}
        isDraw={roundIsDraw}
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
          timerEnabled={timerEnabled}
          setTimerEnabled={setTimerEnabled}
          timerSeconds={timerSeconds}
          setTimerSeconds={setTimerSeconds}
          onStart={start}
        />
      ) : (
        <div
          className={`mx-auto max-w-5xl pt-12 ${
            mode === "quick" ? "lg:pt-0" : ""
          }`}
        >
          {mode === "session" && current && (
            <SessionBattleBar
              side1Name={side1}
              side2Name={side2}
              side1Control={side1Control}
              nextGame={nextDifferentGame}
            />
          )}

          {renderCurrentGame()}

          <p className="mt-4 text-center text-sm font-bold text-white/50">
            الجولة {index + 1} من {queue.length}
          </p>
        </div>
      )}
    </main>
  );
}
