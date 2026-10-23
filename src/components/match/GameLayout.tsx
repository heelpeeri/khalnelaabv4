'use client';

import type { ReactNode } from 'react';

type TeamSide = 'side1' | 'side2';

type GameLayoutProps = {
  title: string;

  side1: string;
  side2: string;

  side1Score: number;
  side2Score: number;

  turn: string;

  turnSide?: TeamSide;

  currentRound?: number;

  neutralTurnStyle?: 'default' | 'duo';

  children: ReactNode;
};

function normalizeTeamName(value: string) {
  return value
    .trim()
    .replace(/^الدور\s+الحالي\s*/u, '')
    .replace(/^الدور\s+على\s+/u, '')
    .replace(/^دور\s+/u, '')
    .replace(/\s+/g, ' ');
}

export function GameTitle({
  title,
}: {
  title: string;
}) {
  const titleWords = title
    .trim()
    .split(/\s+/);

  return (
    <h2
      className="
        truncate
        py-1
        text-xl
        font-black
        leading-tight
        sm:text-3xl
      "
      dir="rtl"
    >
      {titleWords.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className={
            index % 2 === 0
              ? `
                  bg-gradient-to-b
                  from-[#FFD326]
                  via-[#FFB000]
                  to-[#FF8A00]
                  bg-clip-text
                  text-transparent
                  drop-shadow-[0_2px_6px_rgba(255,176,0,0.28)]
                `
              : `
                  bg-gradient-to-b
                  from-[#13C2FF]
                  via-[#008EFF]
                  to-[#006BFF]
                  bg-clip-text
                  text-transparent
                  drop-shadow-[0_2px_6px_rgba(0,142,255,0.28)]
                `
          }
        >
          {word}
          {index < titleWords.length - 1
            ? ' '
            : ''}
        </span>
      ))}
    </h2>
  );
}

export default function GameLayout({
  title,

  side1,
  side2,

  side1Score,
  side2Score,

  turn,
  turnSide,

  currentRound = 1,

  neutralTurnStyle = 'default',

  children,
}: GameLayoutProps) {
  const cleanTurn = normalizeTeamName(turn);

  const cleanSide1 = normalizeTeamName(side1);
  const cleanSide2 = normalizeTeamName(side2);

  const detectedSide: TeamSide | null =
    turnSide ??
    (cleanTurn === cleanSide1 ||
    cleanTurn === 'فريق 1'
      ? 'side1'
      : cleanTurn === cleanSide2 ||
          cleanTurn === 'فريق 2'
        ? 'side2'
        : null);

  const isSide1Turn =
    detectedSide === 'side1';

  const isSide2Turn =
    detectedSide === 'side2';

  const isNeutralTurn =
    !isSide1Turn &&
    !isSide2Turn;

  const useDuoNeutral =
    isNeutralTurn &&
    neutralTurnStyle === 'duo';

  const displayedTurn =
    isSide1Turn
      ? side1
      : isSide2Turn
        ? side2
        : cleanTurn;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div
        className="
          glass
          rounded-[24px]
          border border-white/10
          bg-[#121028]/80
          p-3
          text-center
          shadow-[0_0_30px_rgba(0,0,0,0.35)]
          sm:rounded-[28px]
          sm:p-3
          lg:p-4
        "
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-b
              from-[#8b5cf6]
              to-[#6d28d9]
              text-lg
              font-black
              text-white
              shadow-[0_0_14px_rgba(139,92,246,0.28)]
            "
          >
            {currentRound}
          </div>

          <div className="min-w-0 flex-1 text-center">
            <GameTitle title={title} />
          </div>

          <div className="w-9 shrink-0" />
        </div>

        <div className="mb-2 grid grid-cols-3 gap-1.5 sm:gap-2">
          <div
            className={`
              flex
              min-h-[64px]
              min-w-0
              flex-col
              items-center
              justify-center
              rounded-[16px]
              border
              px-2
              py-1.5
              transition-all
              duration-500
              sm:min-h-[76px]
              sm:px-3

              ${
                isSide1Turn
                  ? `
                    border-fuchsia-300/70
                    bg-gradient-to-br
                    from-fuchsia-500/30
                    via-pink-500/20
                    to-purple-500/15
                    shadow-[0_0_24px_rgba(217,70,239,0.25)]
                  `
                  : `
                    border-fuchsia-300/15
                    bg-fuchsia-500/[0.06]
                    opacity-50
                  `
              }
            `}
          >
            <p
              className={`
                max-w-full
                truncate
                text-xs
                font-bold
                leading-tight
                transition-colors
                duration-500

                ${
                  isSide1Turn
                    ? 'text-fuchsia-100'
                    : 'text-white/45'
                }
              `}
            >
              {side1}
            </p>

            <p
              className={`
                mt-1
                flex
                items-center
                justify-center
                text-[34px]
                font-black
                leading-[0.9]
                transition-all
                duration-500
                sm:text-[52px]

                ${
                  isSide1Turn
                    ? 'text-fuchsia-100'
                    : 'text-fuchsia-200/50'
                }
              `}
            >
              {side1Score}
            </p>
          </div>

          <div
            className={`
              flex
              min-h-[64px]
              min-w-0
              flex-col
              items-center
              justify-center
              rounded-[16px]
              border
              px-2
              py-1.5
              transition-all
              duration-500
              sm:min-h-[76px]
              sm:px-3

              ${
                isSide1Turn
                  ? `
                    border-fuchsia-300/80
                    bg-gradient-to-br
                    from-fuchsia-500/35
                    via-pink-500/25
                    to-purple-500/20
                    shadow-[0_0_26px_rgba(217,70,239,0.28)]
                  `
                  : isSide2Turn
                    ? `
                      border-cyan-300/80
                      bg-gradient-to-br
                      from-cyan-400/35
                      via-sky-500/25
                      to-blue-500/20
                      shadow-[0_0_26px_rgba(34,211,238,0.28)]
                    `
                    : useDuoNeutral
                      ? `
                        border-violet-300/45
                        bg-gradient-to-r
                        from-fuchsia-500/24
                        via-violet-500/24
                        to-cyan-400/24
                        shadow-[0_0_28px_rgba(139,92,246,0.18)]
                      `
                      : `
                        border-white/20
                        bg-white/10
                      `
              }
            `}
          >
            <p
              className={`
                text-[11px]
                font-bold
                leading-none
                sm:text-xs

                ${
                  useDuoNeutral
                    ? 'text-white/65'
                    : 'text-white/55'
                }
              `}
            >
              الدور الحالي
            </p>

            <p
              className={`
                mt-1
                max-w-full
                truncate
                text-base
                font-black
                leading-tight
                transition-colors
                duration-500
                sm:text-2xl

                ${
                  isSide1Turn
                    ? 'text-fuchsia-50'
                    : isSide2Turn
                      ? 'text-cyan-50'
                      : useDuoNeutral
                        ? `
                          bg-gradient-to-r
                          from-fuchsia-200
                          via-white
                          to-cyan-200
                          bg-clip-text
                          text-transparent
                        `
                        : 'text-white'
                }
              `}
            >
              {displayedTurn}
            </p>
          </div>

          <div
            className={`
              flex
              min-h-[64px]
              min-w-0
              flex-col
              items-center
              justify-center
              rounded-[16px]
              border
              px-2
              py-1.5
              transition-all
              duration-500
              sm:min-h-[76px]
              sm:px-3

              ${
                isSide2Turn
                  ? `
                    border-cyan-300/70
                    bg-gradient-to-br
                    from-cyan-400/30
                    via-sky-500/20
                    to-blue-500/15
                    shadow-[0_0_24px_rgba(34,211,238,0.25)]
                  `
                  : `
                    border-cyan-300/15
                    bg-cyan-400/[0.06]
                    opacity-50
                  `
              }
            `}
          >
            <p
              className={`
                max-w-full
                truncate
                text-xs
                font-bold
                leading-tight
                transition-colors
                duration-500

                ${
                  isSide2Turn
                    ? 'text-cyan-100'
                    : 'text-white/45'
                }
              `}
            >
              {side2}
            </p>

            <p
              className={`
                mt-1
                flex
                items-center
                justify-center
                text-[34px]
                font-black
                leading-[0.9]
                transition-all
                duration-500
                sm:text-[52px]

                ${
                  isSide2Turn
                    ? 'text-cyan-100'
                    : 'text-cyan-200/50'
                }
              `}
            >
              {side2Score}
            </p>
          </div>
        </div>

        <div
          className="
            rounded-[20px]
            border border-white/10
            bg-[#0d1236]/70
            p-2
            sm:p-3
            lg:p-4
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}
