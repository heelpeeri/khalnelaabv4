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

export default function GameLayout({
  title,

  side1,
  side2,

  side1Score,
  side2Score,

  turn,
  turnSide,

  currentRound = 1,

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

  const displayedTurn =
    isSide1Turn
      ? side1
      : isSide2Turn
        ? side2
        : cleanTurn;

  return (
    <div className="mx-auto w-full max-w-5xl px-3 sm:px-4 lg:px-6">
      <div
        className="
          glass
          rounded-[24px]
          border border-white/10
          bg-[#121028]/80
          p-3
          pt-3
          text-center
          shadow-[0_0_30px_rgba(0,0,0,0.35)]
          backdrop-blur-xl

          sm:rounded-[28px]
          sm:p-3

          lg:p-4
          lg:pt-8
        "
      >

        {/* =========================
            HEADER
        ========================== */}

        <div className="mb-2 flex items-center justify-between gap-3">

          {/* Round */}
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

          {/* Title */}
          <div className="min-w-0 flex-1 text-center">
            <h2 className="truncate text-2xl font-black leading-none text-white sm:text-3xl">
              {title}
            </h2>
          </div>

          {/* يحافظ على توسط العنوان */}
          <div className="w-9 shrink-0" />
        </div>

        {/* =========================
            TEAMS + CURRENT TURN
        ========================== */}

        <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-3">

          {/* =========================
              TEAM 1
          ========================== */}

          <div
            className={`
              flex
              min-h-[76px]
              flex-col
              items-center
              justify-center
              rounded-[16px]
              border
              px-3
              py-1.5
              transition-all
              duration-500

              ${
                isSide1Turn
                  ? `
                    scale-[1.01]
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
                text-xs
                font-bold
                leading-none
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
                text-[46px]
                font-black
                leading-[0.8]
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

          {/* =========================
              CURRENT TURN
          ========================== */}

          <div
            className={`
              flex
              min-h-[76px]
              flex-col
              items-center
              justify-center
              rounded-[16px]
              border
              px-3
              py-1.5
              transition-all
              duration-500

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
                    : `
                      border-white/20
                      bg-white/10
                    `
              }
            `}
          >
            <p className="text-[11px] font-bold leading-none text-white/55 sm:text-xs">
              الدور الحالي
            </p>

            <p
              className={`
                mt-1
                max-w-full
                truncate
                text-xl
                font-black
                leading-none
                transition-colors
                duration-500
                sm:text-2xl

                ${
                  isSide1Turn
                    ? 'text-fuchsia-50'
                    : isSide2Turn
                      ? 'text-cyan-50'
                      : 'text-white'
                }
              `}
            >
              {displayedTurn}
            </p>
          </div>

          {/* =========================
              TEAM 2
          ========================== */}

          <div
            className={`
              flex
              min-h-[76px]
              flex-col
              items-center
              justify-center
              rounded-[16px]
              border
              px-3
              py-1.5
              transition-all
              duration-500

              ${
                isSide2Turn
                  ? `
                    scale-[1.01]
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
                text-xs
                font-bold
                leading-none
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
                text-[46px]
                font-black
                leading-[0.8]
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

        {/* =========================
            GAME CONTENT
        ========================== */}

        <div
          className="
            rounded-[20px]
            border border-white/10
            bg-[#0d1236]/70
            p-3
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
