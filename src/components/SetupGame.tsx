'use client';

import Image from "next/image";
import { useRef } from "react";
import { quizCategoryList } from "@/data/quiz";

const GAMES = [
  {
    id: "word",
    name: "خمن الكلمة",
    image: "/images/posters/wordgame.png",
  },
  {
    id: "quiz",
    name: "أسئلة وأجوبة",
    image: "/images/posters/Quizgame.png",
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
];

function getRoundOptions(gameId: string) {
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
    default:
      return [2, 4, 6];
  }
}

function getDefaultRounds(gameId: string) {
  switch (gameId) {
    case "quiz":
      return 6;

    case "wheel":
    case "categories":
      return 1;

    case "word":
    case "scramble":
    case "draw":
    default:
      return 2;
  }
}

function getGameDescription(gameId: string) {
  switch (gameId) {
    case "word":
      return "حاولوا تجيبون الكلمة قبل الفريق الثاني";

    case "wheel":
      return "لف العجلة، اختر حرف واجمع النقاط";

    case "quiz":
      return "6 أسئلة — 3 لكل فريق";

    case "draw":
      return "شوف اللغز وحاول تعرف المثل";

    case "scramble":
      return "وصف الشخصية وخلي فريقك يخمن منهو";

    case "categories":
      return "الفريقين يلعبون بنفس الوقت";

    default:
      return "";
  }
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
}: any) {
  const clickSound =
    useRef<HTMLAudioElement | null>(null);

  const isQuickMode =
    mode === "quick";

  function playClick() {
    if (!clickSound.current) return;

    clickSound.current.currentTime = 0;
    clickSound.current.play();
  }

  function toggleGame(id: string) {
    playClick();

    if (isQuickMode) return;

    if (
      selectedGames.includes(id)
    ) {
      setSelectedGames(
        selectedGames.filter(
          (game: string) =>
            game !== id
        )
      );

      return;
    }

    setSelectedGames([
      ...selectedGames,
      id,
    ]);

    if (!gameRounds[id]) {
      setGameRounds({
        ...gameRounds,
        [id]:
          getDefaultRounds(id),
      });
    }
  }

  function toggleCategory(
    category: string
  ) {
    playClick();

    if (
      quizCategories.includes(
        category
      )
    ) {
      setQuizCategories(
        quizCategories.filter(
          (current: string) =>
            current !== category
        )
      );

      return;
    }

    setQuizCategories([
      ...quizCategories,
      category,
    ]);
  }

  const visibleGames =
    isQuickMode
      ? GAMES.filter((game) =>
          selectedGames.includes(
            game.id
          )
        )
      : GAMES;

  return (
    <div className="intro mx-auto w-full max-w-6xl pb-8 text-white">
      <audio
        ref={clickSound}
        src="/click.mp3"
      />

      {/* ========================= */}
      {/* Header */}
      {/* ========================= */}

      <div className="text-center">
        <div
          className={`
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            px-4
            py-1.5
            text-xs
            font-black

            ${
              isQuickMode
                ? "border-cyan-300/20 bg-cyan-400/[0.07] text-cyan-100"
                : "border-yellow-300/20 bg-yellow-300/[0.06] text-yellow-100"
            }
          `}
        >
          <span>
            {isQuickMode
              ? "⚡"
              : "🏆"}
          </span>

          <span>
            {isQuickMode
              ? "لعبة سريعة"
              : "تحدي الجلسة"}
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          جهزوا التحدي
        </h1>

        <p className="mt-2 text-sm font-bold text-white/40">
          {isQuickMode
            ? "سمّوا الفرق واضبطوا إعدادات اللعبة"
            : "سمّوا الفرق واختاروا الألعاب اللي ودكم فيها"}
        </p>
      </div>

      {/* ========================= */}
      {/* Teams */}
      {/* ========================= */}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {/* Team 1 */}
        <div
          className="
            rounded-[22px]
            border
            border-fuchsia-400/20
            bg-fuchsia-500/[0.055]
            p-3
            shadow-[0_0_25px_rgba(217,70,239,.05)]
          "
        >
          <p className="mb-2 text-right text-xs font-black text-fuchsia-200/60">
            الفريق الأول
          </p>

          <input
            value={side1}
            onChange={(event) =>
              setSide1(
                event.target.value
              )
            }
            placeholder="اسم الفريق"
            className="
              w-full
              rounded-2xl
              border
              border-fuchsia-300/15
              bg-black/20
              px-4
              py-3
              text-center
              text-lg
              font-black
              text-white
              outline-none
              transition
              placeholder:text-white/25
              focus:border-fuchsia-300/45
              focus:shadow-[0_0_20px_rgba(217,70,239,.12)]
            "
          />
        </div>

        {/* Team 2 */}
        <div
          className="
            rounded-[22px]
            border
            border-cyan-400/20
            bg-cyan-400/[0.055]
            p-3
            shadow-[0_0_25px_rgba(34,211,238,.05)]
          "
        >
          <p className="mb-2 text-right text-xs font-black text-cyan-200/60">
            الفريق الثاني
          </p>

          <input
            value={side2}
            onChange={(event) =>
              setSide2(
                event.target.value
              )
            }
            placeholder="اسم الفريق"
            className="
              w-full
              rounded-2xl
              border
              border-cyan-300/15
              bg-black/20
              px-4
              py-3
              text-center
              text-lg
              font-black
              text-white
              outline-none
              transition
              placeholder:text-white/25
              focus:border-cyan-300/45
              focus:shadow-[0_0_20px_rgba(34,211,238,.12)]
            "
          />
        </div>
      </div>

      {/* ========================= */}
      {/* Timer */}
      {/* ========================= */}

      <div
        className="
          mt-4
          rounded-[22px]
          border
          border-white/10
          bg-white/[0.025]
          px-4
          py-3
          backdrop-blur-xl
        "
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-right">
            <p className="font-black">
              ⏱️ المؤقت
            </p>

            <p className="mt-0.5 text-xs font-bold text-white/35">
              اختياري
            </p>
          </div>

          <div className="flex items-center gap-3">
            {timerEnabled && (
              <div className="rounded-full border border-cyan-300/15 bg-cyan-400/[0.06] px-4 py-2 text-sm font-black text-cyan-100">
                {timerSeconds} ثانية
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                playClick();

                setTimerEnabled(
                  !timerEnabled
                );
              }}
              className={`
                relative
                h-8
                w-14
                rounded-full
                border
                transition-all
                duration-300

                ${
                  timerEnabled
                    ? "border-cyan-300/40 bg-cyan-400/25 shadow-[0_0_18px_rgba(34,211,238,.15)]"
                    : "border-white/10 bg-white/[0.06]"
                }
              `}
            >
              <span
                className={`
                  absolute
                  top-1
                  h-6
                  w-6
                  rounded-full
                  bg-white
                  shadow-md
                  transition-all
                  duration-300

                  ${
                    timerEnabled
                      ? "left-1"
                      : "left-7"
                  }
                `}
              />
            </button>
          </div>
        </div>

        {timerEnabled && (
          <div className="mt-3">
            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={timerSeconds}
              onChange={(event) =>
                setTimerSeconds(
                  Number(
                    event.target
                      .value
                  )
                )
              }
              className="w-full accent-cyan-400"
            />

            <div className="mt-1 flex justify-between text-[10px] font-bold text-white/25">
              <span>
                10 ث
              </span>

              <span>
                120 ث
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ========================= */}
      {/* Games */}
      {/* ========================= */}

      <div className="mt-6">
        <div className="flex items-end justify-between gap-3">
          <div className="text-right">
            <h2 className="text-xl font-black">
              {isQuickMode
                ? "اللعبة"
                : "اختر الألعاب"}
            </h2>

            <p className="mt-1 text-xs font-bold text-white/35">
              {isQuickMode
                ? "اضبط الجولات وابدأ"
                : "تقدر تختار أكثر من لعبة"}
            </p>
          </div>

          {!isQuickMode && (
            <div className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-black text-white/45">
              {
                selectedGames.length
              }{" "}
              مختارة
            </div>
          )}
        </div>

        <div
          className={`
            mt-4
            grid
            gap-3

            ${
              isQuickMode
                ? "mx-auto max-w-[260px] grid-cols-1"
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
            }
          `}
        >
          {visibleGames.map(
            (game) => {
              const active =
                selectedGames.includes(
                  game.id
                );

              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() =>
                    toggleGame(
                      game.id
                    )
                  }
                  className={`
                    group
                    relative
                    aspect-[3/4]
                    overflow-hidden
                    rounded-[20px]
                    border
                    text-right
                    shadow-[0_12px_28px_rgba(0,0,0,.28)]
                    transition-all
                    duration-500
                    ease-out

                    ${
                      isQuickMode
                        ? "cursor-default border-cyan-300/35 shadow-[0_0_28px_rgba(34,211,238,.10)]"
                        : active
                          ? "-translate-y-1 border-cyan-300/55 shadow-[0_0_30px_rgba(34,211,238,.14)]"
                          : "border-white/10 opacity-70 hover:-translate-y-1 hover:border-white/25 hover:opacity-100"
                    }
                  `}
                >
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    sizes={
                      isQuickMode
                        ? "260px"
                        : "(max-width: 640px) 45vw, 16vw"
                    }
                    className={`
                      object-cover
                      transition-transform
                      duration-700

                      ${
                        active
                          ? "scale-[1.025]"
                          : "group-hover:scale-[1.02]"
                      }
                    `}
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/55
                      via-transparent
                      to-transparent
                    "
                  />

                  {!isQuickMode && (
                    <div
                      className={`
                        absolute
                        left-3
                        top-3
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        border
                        text-sm
                        font-black
                        backdrop-blur-xl
                        transition

                        ${
                          active
                            ? "border-cyan-200/40 bg-cyan-400/80 text-[#04151a]"
                            : "border-white/10 bg-black/40 text-white/40"
                        }
                      `}
                    >
                      {active
                        ? "✓"
                        : "+"}
                    </div>
                  )}

                  <div className="absolute inset-x-3 bottom-3">
                    <p className="text-sm font-black text-white">
                      {game.name}
                    </p>

                    <p className="mt-0.5 text-[10px] font-bold leading-4 text-white/50">
                      {getGameDescription(
                        game.id
                      )}
                    </p>
                  </div>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* ========================= */}
      {/* Selected Game Settings */}
      {/* ========================= */}

      {selectedGames.length >
        0 && (
        <div className="mt-5 space-y-3">
          {GAMES.filter((game) =>
            selectedGames.includes(
              game.id
            )
          ).map((game) => {
            const roundOptions =
              getRoundOptions(
                game.id
              );

            return (
              <div
                key={game.id}
                className="
                  rounded-[22px]
                  border
                  border-white/10
                  bg-white/[0.025]
                  p-4
                "
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-right">
                    <p className="font-black">
                      {game.name}
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-white/35">
                      {game.id ===
                      "quiz"
                        ? "اختر فئة الأسئلة"
                        : "عدد الجولات"}
                    </p>
                  </div>

                  {game.id !==
                    "quiz" && (
                    <div className="flex flex-wrap gap-2">
                      {roundOptions.map(
                        (round) => {
                          const selected =
                            gameRounds[
                              game.id
                            ] ===
                            round;

                          return (
                            <button
                              key={
                                round
                              }
                              type="button"
                              onClick={() => {
                                playClick();

                                setGameRounds(
                                  {
                                    ...gameRounds,

                                    [game.id]:
                                      round,
                                  }
                                );
                              }}
                              className={`
                                min-w-[48px]
                                rounded-full
                                border
                                px-4
                                py-2
                                text-sm
                                font-black
                                transition-all

                                ${
                                  selected
                                    ? "border-cyan-300/40 bg-cyan-400/20 text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,.10)]"
                                    : "border-white/10 bg-white/[0.035] text-white/45 hover:bg-white/[0.07]"
                                }
                              `}
                            >
                              {round}
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>

                {/* Quiz categories */}
                {game.id ===
                  "quiz" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {quizCategoryList.map(
                      (category) => {
                        const selected =
                          quizCategories.includes(
                            category.key
                          );

                        return (
                          <button
                            key={
                              category.key
                            }
                            type="button"
                            onClick={() =>
                              toggleCategory(
                                category.key
                              )
                            }
                            className={`
                              rounded-full
                              border
                              px-4
                              py-2
                              text-sm
                              font-black
                              transition-all

                              ${
                                selected
                                  ? "border-cyan-300/40 bg-cyan-400/20 text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,.10)]"
                                  : "border-white/10 bg-white/[0.035] text-white/50 hover:bg-white/[0.07]"
                              }
                            `}
                          >
                            {
                              category.emoji
                            }{" "}
                            {
                              category.title
                            }
                          </button>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================= */}
      {/* Start */}
      {/* ========================= */}

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            playClick();
            onStart();
          }}
          className="
            inline-flex
            min-w-[230px]
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-cyan-200/30
            bg-gradient-to-r
            from-cyan-400
            to-blue-600
            px-10
            py-4
            text-lg
            font-black
            text-white
            shadow-[0_14px_38px_rgba(14,165,233,.24)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_20px_48px_rgba(14,165,233,.35)]
          "
        >
          <span>
            🚀
          </span>

          <span>
            ابدأ اللعب
          </span>
        </button>
      </div>
    </div>
  );
}
