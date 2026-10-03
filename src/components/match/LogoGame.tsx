'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import GameLayout from "@/components/match/GameLayout";
import {
  LOGOS,
  type LogoItem,
} from "@/data/logos";
import type { WinnerType } from "@/types/game";

const TOTAL_ROUNDS = 2;

type TeamSide =
  | "side1"
  | "side2";

let logoDeck: LogoItem[] = [];

function shuffleArray<T>(
  items: T[]
) {
  const array = [...items];

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {
    const j =
      Math.floor(
        Math.random() *
          (i + 1)
      );

    [array[i], array[j]] = [
      array[j],
      array[i],
    ];
  }

  return array;
}

function getNextLogos(
  count: number
) {
  const result: LogoItem[] = [];

  while (
    result.length < count &&
    LOGOS.length > 0
  ) {
    if (
      logoDeck.length === 0
    ) {
      logoDeck =
        shuffleArray(LOGOS);
    }

    const next =
      logoDeck.shift();

    if (next) {
      result.push(next);
    }
  }

  return result;
}

function GuessJudgeModal({
  show,
  onCorrect,
  onWrong,
}: {
  show: boolean;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="arcade-card w-full max-w-2xl p-8 text-center animate-fade-in-up">
        <p className="text-sm font-black tracking-[0.22em] text-cyan-300/80">
          نتيجة التخمين
        </p>

        <h1 className="arcade-title mt-5">
          هل التخمين صحيح؟ 🎯
        </h1>

        <p className="mt-3 text-lg font-bold text-white/70">
          حدد نتيجة المحاولة
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCorrect}
            className="arcade-button px-6 py-4 text-lg"
          >
            صحيح ✅
          </button>

          <button
            type="button"
            onClick={onWrong}
            className="btn-secondary px-6 py-4 text-lg"
          >
            غير صحيح
          </button>
        </div>
      </div>
    </div>
  );
}

function PixelatedLogo({
  logo,
  revealed,
}: {
  logo: LogoItem;
  revealed: boolean;
}) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    );

  useEffect(() => {
    const canvasElement =
      canvasRef.current;

    if (!canvasElement) {
      return;
    }

    const drawingContext =
      canvasElement.getContext(
        "2d"
      );

    if (!drawingContext) {
      return;
    }

    const image =
      new Image();

    let cancelled = false;

    function drawLogo() {
      if (
        cancelled ||
        !image.naturalWidth ||
        !image.naturalHeight
      ) {
        return;
      }

      const DISPLAY_SIZE = 512;

      canvasElement.width =
        DISPLAY_SIZE;

      canvasElement.height =
        DISPLAY_SIZE;

      drawingContext.clearRect(
        0,
        0,
        DISPLAY_SIZE,
        DISPLAY_SIZE
      );

      const scale =
        Math.min(
          DISPLAY_SIZE /
            image.naturalWidth,
          DISPLAY_SIZE /
            image.naturalHeight
        );

      const displayWidth =
        image.naturalWidth *
        scale;

      const displayHeight =
        image.naturalHeight *
        scale;

      const x =
        (DISPLAY_SIZE -
          displayWidth) /
        2;

      const y =
        (DISPLAY_SIZE -
          displayHeight) /
        2;

      if (revealed) {
        drawingContext.imageSmoothingEnabled =
          true;

        drawingContext.imageSmoothingQuality =
          "high";

        drawingContext.drawImage(
          image,
          x,
          y,
          displayWidth,
          displayHeight
        );

        return;
      }

      const pixelSize =
        logo.pixelSize ?? 28;

      const ratio =
        image.naturalWidth /
        image.naturalHeight;

      let smallWidth =
        pixelSize;

      let smallHeight =
        pixelSize;

      if (ratio >= 1) {
        smallHeight =
          Math.max(
            1,
            Math.round(
              pixelSize /
                ratio
            )
          );
      } else {
        smallWidth =
          Math.max(
            1,
            Math.round(
              pixelSize *
                ratio
            )
          );
      }

      const offscreen =
        document.createElement(
          "canvas"
        );

      offscreen.width =
        smallWidth;

      offscreen.height =
        smallHeight;

      const smallContext =
        offscreen.getContext(
          "2d"
        );

      if (!smallContext) {
        return;
      }

      smallContext.clearRect(
        0,
        0,
        smallWidth,
        smallHeight
      );

      smallContext.imageSmoothingEnabled =
        true;

      smallContext.drawImage(
        image,
        0,
        0,
        smallWidth,
        smallHeight
      );

      drawingContext.imageSmoothingEnabled =
        false;

      drawingContext.drawImage(
        offscreen,
        0,
        0,
        smallWidth,
        smallHeight,
        x,
        y,
        displayWidth,
        displayHeight
      );

      drawingContext.imageSmoothingEnabled =
        true;
    }

    image.onload =
      drawLogo;

    image.onerror = () => {
      console.error(
        "Logo failed to load:",
        logo.image
      );
    };

    image.src =
      logo.image;

    if (
      image.complete &&
      image.naturalWidth > 0
    ) {
      drawLogo();
    }

    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [
    logo.image,
    logo.pixelSize,
    revealed,
  ]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[400px]">
      <canvas
        ref={canvasRef}
        className={`
          h-full
          w-full
          transition-all
          duration-500
          ${
            revealed
              ? "scale-[1.02]"
              : "scale-100"
          }
        `}
        style={{
          imageRendering:
            revealed
              ? "auto"
              : "pixelated",
        }}
      />
    </div>
  );
}

export default function LogoGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
  currentRound = 1,
  timerEnabled = false,
  timerSeconds = 30,
}: {
  side1Name: string;
  side2Name: string;
  onRoundEnd: (
    winner?: WinnerType
  ) => void;
  roundKey: number;
  currentRound?: number;
  timerEnabled?: boolean;
  timerSeconds?: number;
}) {
  const [
    index,
    setIndex,
  ] = useState(0);

  const [
    rounds,
    setRounds,
  ] =
    useState<LogoItem[]>([]);

  const [
    revealed,
    setRevealed,
  ] =
    useState(false);

  const [
    showJudge,
    setShowJudge,
  ] =
    useState(false);

  const [
    timeLeft,
    setTimeLeft,
  ] =
    useState(timerSeconds);

  const [
    side1Score,
    setSide1Score,
  ] =
    useState(0);

  const [
    side2Score,
    setSide2Score,
  ] =
    useState(0);

  useEffect(() => {
    const selected =
      getNextLogos(
        TOTAL_ROUNDS
      );

    setRounds(
      selected
    );

    setIndex(0);

    setRevealed(false);

    setShowJudge(false);

    setTimeLeft(
      timerSeconds
    );

    setSide1Score(0);

    setSide2Score(0);
  }, [
    roundKey,
    timerSeconds,
  ]);

  const current =
    rounds[index];

  const activeSide: TeamSide =
    useMemo(
      () =>
        index % 2 === 0
          ? "side1"
          : "side2",
      [index]
    );

  const activeTeamName =
    activeSide ===
    "side1"
      ? side1Name ||
        "فريق 1"
      : side2Name ||
        "فريق 2";

  useEffect(() => {
    if (
      !timerEnabled ||
      revealed ||
      !current ||
      showJudge
    ) {
      return;
    }

    if (
      timeLeft <= 0
    ) {
      setRevealed(true);

      return;
    }

    const timer =
      setTimeout(() => {
        setTimeLeft(
          (previous) =>
            previous - 1
        );
      }, 1000);

    return () =>
      clearTimeout(
        timer
      );
  }, [
    timerEnabled,
    revealed,
    timeLeft,
    current,
    showJudge,
  ]);

  function finishGame(
    final1: number,
    final2: number
  ) {
    if (
      final1 >
      final2
    ) {
      onRoundEnd(
        "side1"
      );

      return;
    }

    if (
      final2 >
      final1
    ) {
      onRoundEnd(
        "side2"
      );

      return;
    }

    onRoundEnd(
      "none"
    );
  }

  function goNext(
    next1: number,
    next2: number
  ) {
    if (
      index + 1 >=
      rounds.length
    ) {
      finishGame(
        next1,
        next2
      );

      return;
    }

    setIndex(
      (
        currentIndex
      ) =>
        currentIndex + 1
    );

    setRevealed(false);

    setShowJudge(false);

    setTimeLeft(
      timerSeconds
    );
  }

  function givePoint(
    winner:
      | "side1"
      | "side2"
      | "none"
  ) {
    const next1 =
      side1Score +
      (winner ===
      "side1"
        ? 1
        : 0);

    const next2 =
      side2Score +
      (winner ===
      "side2"
        ? 1
        : 0);

    setSide1Score(
      next1
    );

    setSide2Score(
      next2
    );

    setShowJudge(
      false
    );

    goNext(
      next1,
      next2
    );
  }

  function markCorrect() {
    givePoint(
      activeSide
    );
  }

  function markWrong() {
    givePoint(
      "none"
    );
  }

  if (!current) {
    return (
      <div className="text-center text-white">
        <p>
          ما فيه شعارات كافية
        </p>

        <button
          type="button"
          onClick={() =>
            onRoundEnd(
              "none"
            )
          }
          className="btn-primary mt-4"
        >
          إنهاء الجولة
        </button>
      </div>
    );
  }

  const timerClass =
    timeLeft <= 5
      ? "animate-pulse text-red-300"
      : timeLeft <= 10
        ? "text-yellow-300"
        : "text-cyan-300";

  const isLastLogo =
    index + 1 >=
    rounds.length;

  return (
    <>
      <GameLayout
        title="خمن الشعار"
        side1={
          side1Name ||
          "فريق 1"
        }
        side2={
          side2Name ||
          "فريق 2"
        }
        side1Score={
          side1Score
        }
        side2Score={
          side2Score
        }
        turn={
          activeTeamName
        }
        turnSide={
          activeSide
        }
        currentRound={
          currentRound
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/70">
              الشعار{" "}
              <span className="text-white">
                {index + 1}
              </span>
              {" / "}
              {rounds.length}
            </div>

            {!revealed &&
              timerEnabled && (
                <div
                  className={`rounded-full border border-white/10 bg-white/5 px-4 py-2 text-lg font-black ${timerClass}`}
                >
                  ⏱️{" "}
                  {timeLeft}
                </div>
              )}

            {!revealed && (
              <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-100">
                تقدر تعرف الشعار وهو مبكسل؟
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 sm:p-5">
            <div className="mx-auto max-w-[480px] rounded-[26px] bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:p-7">
              <PixelatedLogo
                logo={
                  current
                }
                revealed={
                  revealed
                }
              />
            </div>

            {revealed && (
              <div className="mt-4 animate-fade-in-up">
                <p className="text-2xl font-black text-white sm:text-3xl">
                  {current.answerAr}
                </p>

                {current.answer &&
                  current.answer !==
                    current.answerAr && (
                    <p className="mt-1 text-sm font-bold text-white/45 sm:text-base">
                      {
                        current.answer
                      }
                    </p>
                  )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {!revealed && (
              <button
                type="button"
                onClick={() =>
                  setRevealed(
                    true
                  )
                }
                className="btn-primary min-w-[180px]"
              >
                إظهار الشعار
              </button>
            )}

            {revealed && (
              <button
                type="button"
                onClick={() =>
                  setShowJudge(
                    true
                  )
                }
                className="btn-primary min-w-[170px]"
              >
                {isLastLogo
                  ? "إنهاء الجولة"
                  : "التالي"}
              </button>
            )}
          </div>
        </div>
      </GameLayout>

      <GuessJudgeModal
        show={
          showJudge
        }
        onCorrect={
          markCorrect
        }
        onWrong={
          markWrong
        }
      />
    </>
  );
}
