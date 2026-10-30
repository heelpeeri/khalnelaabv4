"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";

import SetupGame from "@/components/SetupGame";
import { TeamPickModal } from "@/components/match/Overlays";
import SessionBattleBar from "@/components/match/SessionBattleBar";
import {
  CountdownOverlay,
  RoundResultOverlay,
  TransitionOverlay,
  WinnerOverlay,
} from "@/components/match/SessionOverlays";
import type { QuizCategoryKey } from "@/data/quiz/meta";
import {
  buildRoundQueue,
  getDefaultRounds,
  getTimerSeconds,
  isGameType,
  isQuizCategory,
  type GameType,
  type Round,
} from "@/lib/matchQueue";
import { clearRoundState } from "@/lib/roundState";
import {
  clearSavedMatch,
  readSavedMatch,
  saveMatch,
  type SavedMatch,
} from "@/lib/savedMatch";
import { createResultShareImage } from "@/lib/shareImage";
import type { WinnerType } from "@/types/game";
import type { ModeType, RoundStat } from "@/types/match";

type PhaseType = "setup" | "countdown" | "playing" | "transition" | "finished";

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
      <p className="text-sm font-black text-cyan-200/70">لحظة نجهز اللعبة...</p>
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

function preloadGames(games: GameType[]) {
  games.forEach((game) => {
    void GAME_LOADERS[game]().catch(() => {});
  });
}

export default function MatchPage() {
  const router = useRouter();

  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const roundResultTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const endingRoundRef = useRef<number | null>(null);

  const resolvedRoundRef = useRef<number | null>(null);

  const sharingRef = useRef(false);

  const [mode, setMode] = useState<ModeType>("session");

  const [phase, setPhase] = useState<PhaseType>("setup");

  const [countdown, setCountdown] = useState(3);

  const [side1, setSide1] = useState("");
  const [side2, setSide2] = useState("");

  const [selectedGames, setSelectedGames] = useState<GameType[]>([]);

  const [gameRounds, setGameRounds] = useState<Record<string, number>>({});

  const [quizCategories, setQuizCategories] = useState<QuizCategoryKey[]>([]);

  const [timerEnabled, setTimerEnabled] = useState(false);

  const [timerSeconds, setTimerSeconds] = useState(30);

  const [queue, setQueue] = useState<Round[]>([]);

  const [started, setStarted] = useState(false);

  const [index, setIndex] = useState(0);

  const [side1Score, setSide1Score] = useState(0);

  const [side2Score, setSide2Score] = useState(0);

  const [roundStats, setRoundStats] = useState<RoundStat[]>([]);

  const [showWinner, setShowWinner] = useState(false);

  const [showRoundWinnerPicker, setShowRoundWinnerPicker] = useState(false);

  const [showRoundResult, setShowRoundResult] = useState(false);

  const [roundResultWinner, setRoundResultWinner] =
    useState<WinnerType>("none");

  const [sharing, setSharing] = useState(false);

  const current = queue[index];

  const nextRound = queue[index + 1];

  const nextDifferentGame = current
    ? queue.slice(index + 1).find((round) => round.game !== current.game)?.game
    : undefined;

  const battleStep = queue.length > 0 ? 50 / queue.length : 0;

  const side1Control = Math.max(
    0,
    Math.min(100, 50 + (side1Score - side2Score) * battleStep),
  );

  function snapshot(overrides: Partial<SavedMatch>): SavedMatch {
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

    beginMatch();
  }

  function beginMatch() {
    if (selectedGames.length === 0) {
      return;
    }

    if (selectedGames.includes("quiz") && quizCategories.length === 0) {
      return;
    }

    const builtQueue = buildRoundQueue(
      selectedGames,
      gameRounds,
      quizCategories,
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

  function finishSession(finalSide1Score: number, finalSide2Score: number) {
    clearFlowTimers();

    setSide1Score(finalSide1Score);
    setSide2Score(finalSide2Score);

    setShowRoundResult(false);
    setShowRoundWinnerPicker(false);

    setStarted(false);
    setPhase("finished");
    setShowWinner(true);
  }

  function goToNextRound(nextSide1Score: number, nextSide2Score: number) {
    if (index + 1 >= queue.length) {
      finishSession(nextSide1Score, nextSide2Score);

      return;
    }

    const upcomingRound = queue[index + 1];

    if (upcomingRound) {
      preloadGames([upcomingRound.game]);
    }

    setPhase("transition");

    transitionTimer.current = setTimeout(() => {
      setIndex((currentIndex) => currentIndex + 1);

      setPhase("playing");

      transitionTimer.current = null;
    }, 1500);
  }

  function applyRoundWinner(winner?: WinnerType) {
    if (!current || phase !== "playing" || resolvedRoundRef.current === index) {
      return;
    }

    resolvedRoundRef.current = index;
    endingRoundRef.current = index;

    clearRoundState();

    const finalWinner = winner ?? "none";

    const nextSide1Score = side1Score + (finalWinner === "side1" ? 1 : 0);

    const nextSide2Score = side2Score + (finalWinner === "side2" ? 1 : 0);

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

      finishSession(nextSide1Score, nextSide2Score);

      return;
    }

    saveMatch(
      snapshot({
        index: index + 1,
        side1Score: nextSide1Score,
        side2Score: nextSide2Score,
        roundStats: nextRoundStats,
      }),
    );

    setRoundResultWinner(finalWinner);
    setShowRoundResult(true);

    roundResultTimer.current = setTimeout(() => {
      setShowRoundResult(false);

      roundResultTimer.current = null;

      goToNextRound(nextSide1Score, nextSide2Score);
    }, 2500);
  }

  function endRound(winner?: WinnerType) {
    if (!current || phase !== "playing" || endingRoundRef.current === index) {
      return;
    }

    endingRoundRef.current = index;

    if (winner !== undefined) {
      applyRoundWinner(winner);
      return;
    }

    setShowRoundWinnerPicker(true);
  }

  function replay() {
    if (phase !== "finished") {
      return;
    }

    clearSavedMatch();
    beginMatch();
  }

  function changeGames() {
    resetRoundFlow();
  }

  function goHome() {
    clearFlowTimers();
    clearSavedMatch();
    router.push("/");
  }

  function confirmLeave(event: MouseEvent<HTMLAnchorElement>) {
    const inProgress =
      phase === "countdown" || phase === "playing" || phase === "transition";

    if (inProgress && !window.confirm("متأكدين؟ بتضيع نتيجة الجلسة")) {
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
        setCountdown((currentCountdown) => currentCountdown - 1);
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
    const params = new URLSearchParams(window.location.search);

    const urlMode = params.get("mode");
    const gameParam = params.get("game");
    const categoryParam = params.get("category");

    const saved = readSavedMatch(window.location.search);

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

    if (urlMode === "session" || !isGameType(gameParam)) {
      setMode("session");
      return;
    }

    setMode("quick");

    setSelectedGames([gameParam]);

    setGameRounds({
      [gameParam]: getDefaultRounds(gameParam),
    });

    setQuizCategories(
      gameParam === "quiz" && isQuizCategory(categoryParam)
        ? [categoryParam]
        : [],
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

  const roundIsDraw = roundResultWinner === "none";

  async function handleShareResult() {
    if (sharingRef.current) {
      return;
    }

    sharingRef.current = true;
    setSharing(true);

    try {
      const imageFile = await createResultShareImage({
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

      const imageUrl = URL.createObjectURL(imageFile);

      const link = document.createElement("a");

      link.href = imageUrl;
      link.download = "khal-nelab-result.png";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
    } catch (error) {
      console.log("Share cancelled or failed", error);
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
    timerSeconds: current
      ? getTimerSeconds(current.game, timerSeconds)
      : timerSeconds,
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
        return <ScrambleGame key={index} {...commonGameProps} />;

      case "wheel":
        return <WheelGame key={index} {...commonGameProps} />;

      case "categories":
        return <CategoriesGame key={index} {...commonGameProps} />;

      case "draw":
        return <ProverbGame key={index} {...commonGameProps} />;

      case "logo":
        return <LogoGame key={index} {...commonGameProps} />;

      case "country":
        return <CountryGame key={index} {...commonGameProps} />;
    }
  }

  return (
    <main className="min-h-[100dvh] px-3 pb-6 pt-4 text-white sm:p-6">
      <Link
        href="/"
        prefetch
        onClick={confirmLeave}
        aria-label="الرئيسية"
        className="nav-pill fixed left-3 top-3 z-[60] px-0 sm:left-5 sm:top-5 sm:px-4"
      >
        <span aria-hidden="true">🏠</span>
        <span className="hidden lg:inline">الرئيسية</span>
      </Link>

      {phase === "countdown" && <CountdownOverlay countdown={countdown} />}

      {phase === "transition" && nextRound && (
        <TransitionOverlay nextRound={nextRound} />
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
        onReplay={replay}
        onChangeGames={changeGames}
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
