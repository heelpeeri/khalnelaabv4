'use client';

import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import {
  quizCategoryList,
  type QuizCategoryKey,
} from "@/data/quiz";

type SetupGameId =
  | "word"
  | "quiz"
  | "scramble"
  | "wheel"
  | "categories"
  | "draw"
  | "logo"
  | "country";

type SetupGameProps = {
  mode?: "session" | "quick";
  side1: string;
  side2: string;
  setSide1: (value: string) => void;
  setSide2: (value: string) => void;
  selectedGames: SetupGameId[];
  setSelectedGames: Dispatch<
    SetStateAction<SetupGameId[]>
  >;
  gameRounds: Record<string, number>;
  setGameRounds: Dispatch<
    SetStateAction<Record<string, number>>
  >;
  quizCategories: QuizCategoryKey[];
  setQuizCategories: Dispatch<
    SetStateAction<QuizCategoryKey[]>
  >;
  timerEnabled: boolean;
  setTimerEnabled: (value: boolean) => void;
  timerSeconds: number;
  setTimerSeconds: (value: number) => void;
  onStart: () => void;
};

const GAMES: {
  id: SetupGameId;
  name: string;
  image: string;
}[] = [
  {
    id: "word",
    name: "خمن الكلمة",
    image: "/images/posters/wordgame.png",
  },
  {
    id: "scramble",
    name: "منهو ذا؟",
    image: "/images/posters/Whogame.png",
  },
  {
    id: "wheel",
    name: "لف وخمن",
    image: "/images/posters/Wheelgame.png",
  },
  {
    id: "categories",
    name: "إنسان حيوان نبات جماد بلاد",
    image: "/images/posters/Categoriesgame.png",
  },
  {
    id: "draw",
    name: "خمن المثل",
    image: "/images/posters/Proverbgame.png",
  },
  {
    id: "logo",
    name: "خمن الشعار",
    image: "/images/posters/Logogame.png",
  },
  {
    id: "country",
    name: "خمن العلم",
    image: "/images/posters/Countries.png",
  },
  {
    id: "quiz",
    name: "أسئلة وأجوبة",
    image: "/images/posters/Quizgame.png",
  },
];

function getRoundOptions(
  gameId: string
) {
  switch (gameId) {
    case "wheel":
      return [1, 3, 5];

    case "categories":
      return [1, 2];

    case "quiz":
      return [];

    case "word":
    case "scramble":
    case "draw":
    case "logo":
    case "country":
    default:
      return [2, 4, 6];
  }
}

function getDefaultRounds(
  gameId: string
) {
  switch (gameId) {
    case "quiz":
      return 6;

    case "wheel":
    case "categories":
      return 1;

    case "word":
    case "scramble":
    case "draw":
    case "logo":
    case "country":
    default:
      return 2;
  }
}

function getSelectedLabel(count: number) {
  if (count === 0) return "ما اخترتوا شي";
  if (count === 1) return "لعبة وحدة";
  if (count === 2) return "لعبتين";

  return `${count} ألعاب`;
}

export default function SetupGame({
  mode = "session",
  side1,
  side2,
  setSide1,
  setSide2,
  selectedGames,
  setSelectedGames,
  gameRounds,
  setGameRounds,
  quizCategories,
  setQuizCategories,
  timerEnabled,
  setTimerEnabled,
  timerSeconds,
  setTimerSeconds,
  onStart,
}: SetupGameProps) {
  const isQuickMode = mode === "quick";

  const needsQuizCategory =
    selectedGames.includes("quiz") &&
    quizCategories.length === 0;

  const canStart =
    selectedGames.length > 0 &&
    !needsQuizCategory;

  const startHint =
    selectedGames.length === 0
      ? "اختاروا لعبة وحدة على الأقل"
      : needsQuizCategory
        ? "اختاروا فئة للأسئلة"
        : "";

  function toggleGame(id: SetupGameId) {
    if (isQuickMode) {
      return;
    }

    if (selectedGames.includes(id)) {
      setSelectedGames((previous) =>
        previous.filter((game) => game !== id)
      );

      return;
    }

    setSelectedGames((previous) =>
      previous.includes(id)
        ? previous
        : [...previous, id]
    );

    setGameRounds((previous) =>
      previous[id]
        ? previous
        : {
            ...previous,
            [id]: getDefaultRounds(id),
          }
    );
  }

  function toggleCategory(
    category: QuizCategoryKey
  ) {
    setQuizCategories((previous) =>
      previous.includes(category)
        ? previous.filter(
            (current) => current !== category
          )
        : [...previous, category]
    );
  }

  function selectRounds(
    gameId: SetupGameId,
    round: number
  ) {
    setGameRounds((previous) => ({
      ...previous,
      [gameId]: round,
    }));
  }

  const visibleGames = isQuickMode
    ? GAMES.filter((game) =>
        selectedGames.includes(game.id)
      )
    : GAMES;

  return (
    <div className="intro mx-auto w-full max-w-[1500px] pb-4 text-white sm:px-2 lg:pb-2">
      <div className="text-center">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-black ${
            isQuickMode
              ? "border-cyan-300/20 bg-cyan-400/[0.07] text-cyan-100"
              : "border-yellow-300/20 bg-yellow-300/[0.06] text-yellow-100"
          }`}
        >
          <span aria-hidden="true">
            {isQuickMode ? "⚡" : "🏆"}
          </span>

          <span>
            {isQuickMode
              ? "لعبة سريعة"
              : "تحدي الجلسة"}
          </span>
        </div>

        <h1 className="mt-2 text-2xl font-black sm:text-3xl">
          {isQuickMode
            ? "جهزوا الفرق"
            : "اختاروا ألعابكم"}
        </h1>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_290px]">
        <label className="flex items-center gap-3 rounded-[18px] border border-fuchsia-400/25 bg-fuchsia-500/[0.06] p-2.5">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fuchsia-300/20 bg-fuchsia-400/10 text-lg"
          >
            👥
          </span>

          <span className="min-w-0 flex-1">
            <span className="mb-1 block text-right text-[11px] font-black text-fuchsia-200/70">
              الفريق الأول
            </span>

            <input
              value={side1}
              maxLength={20}
              onChange={(event) =>
                setSide1(event.target.value)
              }
              placeholder="فريق 1"
              className="h-10 w-full rounded-xl border border-fuchsia-300/20 bg-black/20 px-3 text-center text-base font-black text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-300/60"
            />
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-[18px] border border-cyan-400/25 bg-cyan-400/[0.06] p-2.5">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-lg"
          >
            👥
          </span>

          <span className="min-w-0 flex-1">
            <span className="mb-1 block text-right text-[11px] font-black text-cyan-200/70">
              الفريق الثاني
            </span>

            <input
              value={side2}
              maxLength={20}
              onChange={(event) =>
                setSide2(event.target.value)
              }
              placeholder="فريق 2"
              className="h-10 w-full rounded-xl border border-cyan-300/20 bg-black/20 px-3 text-center text-base font-black text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/60"
            />
          </span>
        </label>

        <div className="rounded-[18px] border border-white/10 bg-white/[0.025] p-2.5 sm:col-span-2 lg:col-span-1">
          <div className="flex h-full min-h-[44px] items-center justify-between gap-3">
            <div className="text-right">
              <p className="text-sm font-black">
                ⏱️ المؤقت
              </p>

              <p className="mt-0.5 text-[11px] font-bold text-white/40">
                {timerEnabled
                  ? `${timerSeconds} ثانية لكل دور`
                  : "اختياري"}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={timerEnabled}
              aria-label="تشغيل المؤقت"
              onClick={() =>
                setTimerEnabled(!timerEnabled)
              }
              className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-300 ${
                timerEnabled
                  ? "border-cyan-300/50 bg-cyan-400/30"
                  : "border-white/15 bg-white/[0.06]"
              }`}
            >
              <span
                className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                  timerEnabled
                    ? "left-[3px]"
                    : "left-[25px]"
                }`}
              />
            </button>
          </div>

          {timerEnabled && (
            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={timerSeconds}
              aria-label="مدة المؤقت بالثواني"
              onChange={(event) =>
                setTimerSeconds(
                  Number(event.target.value)
                )
              }
              className="mt-2 h-1 w-full accent-cyan-400"
            />
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-right">
            <h2 className="text-lg font-black sm:text-xl">
              {isQuickMode
                ? "اللعبة"
                : "الألعاب"}
            </h2>

            <p className="mt-0.5 text-xs font-bold text-white/40">
              {isQuickMode
                ? "اضبطوها وابدأوا"
                : "اضغطوا على اللعبة وتطلع إعداداتها تحتها"}
            </p>
          </div>

          {!isQuickMode && (
            <div className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-black text-white/60">
              {selectedGames.length} من {GAMES.length}
            </div>
          )}
        </div>

        <div
          className={`mt-3 grid items-start gap-2.5 ${
            isQuickMode
              ? "mx-auto max-w-[260px] grid-cols-1"
              : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-8"
          }`}
        >
          {visibleGames.map((game) => {
            const active =
              selectedGames.includes(game.id);

            const roundOptions =
              getRoundOptions(game.id);

            return (
              <div
                key={game.id}
                className={`overflow-hidden rounded-[18px] border bg-[#10091e]/90 transition-[border-color,box-shadow] duration-300 ${
                  active
                    ? "border-cyan-300/70 shadow-[0_0_22px_rgba(34,211,238,.14)]"
                    : "border-white/10 shadow-[0_10px_24px_rgba(0,0,0,.22)]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleGame(game.id)}
                  disabled={isQuickMode}
                  aria-pressed={
                    isQuickMode ? undefined : active
                  }
                  aria-label={game.name}
                  className={`group relative block aspect-[4/5] w-full overflow-hidden ${
                    isQuickMode
                      ? "cursor-default"
                      : active
                        ? ""
                        : "opacity-75 transition-opacity hover:opacity-100"
                  }`}
                >
                  <Image
                    src={game.image}
                    alt=""
                    fill
                    sizes={
                      isQuickMode
                        ? "260px"
                        : "(max-width: 640px) 45vw, (max-width: 1024px) 24vw, 13vw"
                    }
                    className={`object-cover transition-transform duration-500 ease-out ${
                      active
                        ? ""
                        : "group-hover:scale-[1.03]"
                    }`}
                  />

                  {!isQuickMode && (
                    <span
                      aria-hidden="true"
                      className={`absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-black transition-colors duration-300 ${
                        active
                          ? "border-cyan-100/70 bg-cyan-400 text-[#03171c]"
                          : "border-white/25 bg-black/60 text-white/80"
                      }`}
                    >
                      {active ? "✓" : "+"}
                    </span>
                  )}
                </button>

                {active && (
                  <div className="border-t border-cyan-300/15 bg-gradient-to-b from-cyan-400/[0.065] to-transparent px-2 pb-2.5 pt-2">
                    {game.id !== "quiz" ? (
                      <>
                        <p className="mb-1.5 text-center text-[11px] font-black text-white/60">
                          عدد الجولات
                        </p>

                        <div className="flex items-center justify-center gap-1.5">
                          {roundOptions.map((round) => {
                            const selected =
                              gameRounds[game.id] ===
                              round;

                            return (
                              <button
                                key={round}
                                type="button"
                                aria-pressed={selected}
                                aria-label={`عدد الجولات ${round}`}
                                onClick={() =>
                                  selectRounds(
                                    game.id,
                                    round
                                  )
                                }
                                className={`flex h-10 min-w-[40px] flex-1 items-center justify-center rounded-xl border text-sm font-black transition-colors duration-200 ${
                                  selected
                                    ? "border-cyan-200/70 bg-cyan-400/25 text-cyan-50"
                                    : "border-white/10 bg-white/[0.04] text-white/55 hover:border-white/25 hover:text-white/85"
                                }`}
                              >
                                {round}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mb-1.5 text-center text-[11px] font-black text-white/60">
                          الفئات
                        </p>

                        <div className="grid grid-cols-2 gap-1.5">
                          {quizCategoryList.map(
                            (category) => {
                              const selected =
                                quizCategories.includes(
                                  category.key
                                );

                              return (
                                <button
                                  key={category.key}
                                  type="button"
                                  aria-pressed={selected}
                                  onClick={() =>
                                    toggleCategory(
                                      category.key
                                    )
                                  }
                                  className={`flex min-h-[44px] min-w-0 flex-col items-center justify-center rounded-xl border px-1 py-1 text-[11px] font-black leading-tight transition-colors duration-200 ${
                                    selected
                                      ? "border-cyan-300/60 bg-cyan-400/20 text-cyan-50"
                                      : "border-white/10 bg-white/[0.035] text-white/55 hover:border-white/25 hover:text-white/85"
                                  }`}
                                >
                                  <span
                                    aria-hidden="true"
                                    className="text-sm leading-none"
                                  >
                                    {selected
                                      ? "✓"
                                      : category.emoji}
                                  </span>

                                  <span className="mt-0.5 max-w-full truncate">
                                    {category.title}
                                  </span>
                                </button>
                              );
                            }
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center justify-center gap-2">
        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className="btn-primary min-w-[240px] px-10 py-3 text-lg"
        >
          ابدأوا 🚀
        </button>

        <p
          aria-live="polite"
          className="min-h-[16px] text-xs font-bold text-white/45"
        >
          {startHint ||
            (!isQuickMode
              ? getSelectedLabel(
                  selectedGames.length
                )
              : "")}
        </p>
      </div>
    </div>
  );
}
