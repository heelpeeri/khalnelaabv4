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
    useRef<HTMLAudioElement | null>(
      null
    );

  const isQuickMode =
    mode === "quick";

  function playClick() {
    if (!clickSound.current) {
      return;
    }

    clickSound.current.currentTime =
      0;

    clickSound.current
      .play()
      .catch(() => {});
  }

  function toggleGame(
    id: string
  ) {
    playClick();

    if (isQuickMode) {
      return;
    }

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

  function selectRounds(
    gameId: string,
    round: number
  ) {
    playClick();

    setGameRounds({
      ...gameRounds,
      [gameId]: round,
    });
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
    <div
      className="
        intro
        mx-auto
        w-full
        max-w-[1500px]
        px-1
        pb-4
        text-white
        sm:px-2
        lg:pb-2
      "
    >
      <audio
        ref={clickSound}
        src="/click.mp3"
      />

      <div className="text-center">
        <div
          className={`
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            px-4
            py-1
            text-[11px]
            font-black
            sm:text-xs

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

        <h1 className="mt-2 text-2xl font-black sm:text-3xl lg:text-[32px]">
          اختر الألعاب واضبط الإعدادات
        </h1>

        <p className="mt-1 text-xs font-bold text-white/40 sm:text-sm">
          {isQuickMode
            ? "سمّوا الفرق واضبطوا اللعبة ثم ابدأوا"
            : "اختاروا ألعابكم وكل إعداداتها بتطلع تحتها مباشرة"}
        </p>
      </div>

      <div
        className="
          mt-4
          grid
          gap-2
          lg:grid-cols-[1fr_1fr_290px]
        "
      >
        <div
          className="
            rounded-[18px]
            border
            border-fuchsia-400/20
            bg-fuchsia-500/[0.05]
            p-2.5
            shadow-[0_0_22px_rgba(217,70,239,.045)]
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-fuchsia-300/15
                bg-fuchsia-400/10
                text-lg
              "
            >
              👥
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-1 text-right text-[10px] font-black text-fuchsia-200/55">
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
                  h-10
                  w-full
                  rounded-xl
                  border
                  border-fuchsia-300/15
                  bg-black/20
                  px-3
                  text-center
                  text-base
                  font-black
                  text-white
                  outline-none
                  transition
                  placeholder:text-white/25
                  focus:border-fuchsia-300/45
                  focus:shadow-[0_0_16px_rgba(217,70,239,.10)]
                "
              />
            </div>
          </div>
        </div>

        <div
          className="
            rounded-[18px]
            border
            border-cyan-400/20
            bg-cyan-400/[0.05]
            p-2.5
            shadow-[0_0_22px_rgba(34,211,238,.045)]
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-cyan-300/15
                bg-cyan-400/10
                text-lg
              "
            >
              👥
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-1 text-right text-[10px] font-black text-cyan-200/55">
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
                  h-10
                  w-full
                  rounded-xl
                  border
                  border-cyan-300/15
                  bg-black/20
                  px-3
                  text-center
                  text-base
                  font-black
                  text-white
                  outline-none
                  transition
                  placeholder:text-white/25
                  focus:border-cyan-300/45
                  focus:shadow-[0_0_16px_rgba(34,211,238,.10)]
                "
              />
            </div>
          </div>
        </div>

        <div
          className="
            rounded-[18px]
            border
            border-white/10
            bg-white/[0.025]
            p-2.5
          "
        >
          <div className="flex h-full items-center justify-between gap-3">
            <div className="text-right">
              <p className="text-sm font-black">
                ⏱️ المؤقت
              </p>

              <p className="mt-0.5 text-[10px] font-bold text-white/30">
                اختياري
              </p>
            </div>

            <div className="flex items-center gap-2">
              {timerEnabled && (
                <div
                  className="
                    rounded-full
                    border
                    border-cyan-300/15
                    bg-cyan-400/[0.07]
                    px-3
                    py-1.5
                    text-xs
                    font-black
                    text-cyan-100
                  "
                >
                  {timerSeconds} ث
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
                  h-7
                  w-12
                  rounded-full
                  border
                  transition-all
                  duration-300

                  ${
                    timerEnabled
                      ? "border-cyan-300/40 bg-cyan-400/25 shadow-[0_0_16px_rgba(34,211,238,.14)]"
                      : "border-white/10 bg-white/[0.06]"
                  }
                `}
              >
                <span
                  className={`
                    absolute
                    top-[3px]
                    h-5
                    w-5
                    rounded-full
                    bg-white
                    shadow-md
                    transition-all
                    duration-300

                    ${
                      timerEnabled
                        ? "left-[3px]"
                        : "left-[25px]"
                    }
                  `}
                />
              </button>
            </div>
          </div>

          {timerEnabled && (
            <div className="mt-2">
              <input
                type="range"
                min={10}
                max={120}
                step={5}
                value={timerSeconds}
                onChange={(event) =>
                  setTimerSeconds(
                    Number(
                      event.target.value
                    )
                  )
                }
                className="h-1 w-full accent-cyan-400"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-right">
            <h2 className="text-lg font-black sm:text-xl">
              {isQuickMode
                ? "اللعبة"
                : "اختر الألعاب"}
            </h2>

            <p className="mt-0.5 text-[11px] font-bold text-white/35">
              {isQuickMode
                ? "اضبط إعداداتها وابدأ"
                : "اضغط على اللعبة وتطلع إعداداتها تحتها"}
            </p>
          </div>

          {!isQuickMode && (
            <div
              className="
                rounded-full
                border
                border-white/10
                bg-white/[0.035]
                px-3
                py-1.5
                text-xs
                font-black
                text-white/50
              "
            >
              {selectedGames.length} من 8
            </div>
          )}
        </div>

        <div
          className={`
            mt-3
            grid
            items-start
            gap-2.5

            ${
              isQuickMode
                ? "mx-auto max-w-[260px] grid-cols-1"
                : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-8"
            }
          `}
        >
          {visibleGames.map(
            (game) => {
              const active =
                selectedGames.includes(
                  game.id
                );

              const roundOptions =
                getRoundOptions(
                  game.id
                );

              return (
                <div
                  key={game.id}
                  className={`
                    overflow-hidden
                    rounded-[18px]
                    border
                    bg-[#10091e]/90
                    transition-all
                    duration-400

                    ${
                      active
                        ? `
                          border-cyan-300/60
                          shadow-[0_0_26px_rgba(34,211,238,.12)]
                        `
                        : `
                          border-white/10
                          shadow-[0_10px_24px_rgba(0,0,0,.22)]
                        `
                    }
                  `}
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleGame(
                        game.id
                      )
                    }
                    aria-label={
                      isQuickMode
                        ? game.name
                        : active
                          ? `إلغاء اختيار ${game.name}`
                          : `اختيار ${game.name}`
                    }
                    className={`
                      group
                      relative
                      block
                      aspect-[4/5]
                      w-full
                      overflow-hidden
                      outline-none
                      transition-all
                      duration-500

                      ${
                        isQuickMode
                          ? "cursor-default"
                          : active
                            ? ""
                            : "opacity-72 hover:opacity-100"
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
                          : "(max-width: 640px) 45vw, 13vw"
                      }
                      className={`
                        object-cover
                        transition-transform
                        duration-700
                        ease-out

                        ${
                          active
                            ? "scale-[1.015]"
                            : "group-hover:scale-[1.025]"
                        }
                      `}
                    />

                    {!isQuickMode && (
                      <div
                        className={`
                          absolute
                          left-2
                          top-2
                          z-10
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-full
                          border
                          text-xs
                          font-black
                          backdrop-blur-xl
                          transition-all
                          duration-300

                          ${
                            active
                              ? `
                                border-cyan-100/60
                                bg-cyan-400
                                text-[#03171c]
                                shadow-[0_0_16px_rgba(34,211,238,.32)]
                              `
                              : `
                                border-white/20
                                bg-black/50
                                text-white/70
                              `
                          }
                        `}
                      >
                        {active
                          ? "✓"
                          : "+"}
                      </div>
                    )}
                  </button>

                  {active && (
                    <div
                      className="
                        border-t
                        border-cyan-300/15
                        bg-gradient-to-b
                        from-cyan-400/[0.065]
                        to-transparent
                        px-2
                        pb-2.5
                        pt-2
                      "
                    >
                      {game.id !==
                      "quiz" ? (
                        <>
                          <p
                            className="
                              mb-1.5
                              text-center
                              text-[10px]
                              font-black
                              text-white/50
                            "
                          >
                            عدد الجولات
                          </p>

                          <div
                            className="
                              flex
                              items-center
                              justify-center
                              gap-1
                            "
                          >
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
                                    onClick={() =>
                                      selectRounds(
                                        game.id,
                                        round
                                      )
                                    }
                                    className={`
                                      flex
                                      h-8
                                      min-w-8
                                      items-center
                                      justify-center
                                      rounded-full
                                      border
                                      px-2
                                      text-xs
                                      font-black
                                      transition-all

                                      ${
                                        selected
                                          ? `
                                            border-cyan-200/60
                                            bg-cyan-400/22
                                            text-cyan-50
                                            shadow-[0_0_14px_rgba(34,211,238,.15)]
                                          `
                                          : `
                                            border-white/10
                                            bg-white/[0.04]
                                            text-white/45
                                            hover:bg-white/[0.08]
                                          `
                                      }
                                    `}
                                  >
                                    {round}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <p
                            className="
                              mb-1.5
                              text-center
                              text-[10px]
                              font-black
                              text-white/50
                            "
                          >
                            اختر الفئات
                          </p>

                          <div className="grid grid-cols-1 gap-1">
                            {quizCategoryList.map(
                              (
                                category
                              ) => {
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
                                      truncate
                                      rounded-lg
                                      border
                                      px-1.5
                                      py-1
                                      text-[9px]
                                      font-black
                                      transition-all

                                      ${
                                        selected
                                          ? `
                                            border-cyan-300/40
                                            bg-cyan-400/20
                                            text-cyan-50
                                          `
                                          : `
                                            border-white/[0.08]
                                            bg-white/[0.035]
                                            text-white/45
                                            hover:bg-white/[0.07]
                                          `
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
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>

      <div
        className="
          mt-4
          flex
          flex-col
          items-center
          justify-center
          gap-2
        "
      >
        <button
          type="button"
          onClick={() => {
            playClick();
            onStart();
          }}
          className="
            inline-flex
            min-w-[240px]
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-cyan-200/30
            bg-gradient-to-r
            from-cyan-400
            via-sky-500
            to-blue-600
            px-10
            py-3
            text-base
            font-black
            text-white
            shadow-[0_12px_32px_rgba(14,165,233,.22)]
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:shadow-[0_16px_40px_rgba(14,165,233,.32)]
            sm:text-lg
          "
        >
          <span>
            ابدأ اللعب
          </span>

          <span>
            🚀
          </span>
        </button>

        {!isQuickMode && (
          <p className="text-[10px] font-bold text-white/30">
            🎮 {selectedGames.length} ألعاب مختارة
          </p>
        )}
      </div>
    </div>
  );
}
