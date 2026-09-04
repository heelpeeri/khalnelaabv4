'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type GameCard = {
  href: string;
  image: string;
  title: string;
  x: number;
  y: number;
  scale: number;
  z: number;
  delay: number;
};

const GAME_CARDS: GameCard[] = [
  {
    href: "/match?game=scramble",
    image: "/images/posters/Whogame.png",
    title: "منهو ذا؟",
    x: -270,
    y: 12,
    scale: 0.9,
    z: 10,
    delay: -1.2,
  },
  {
    href: "/match?game=quiz",
    image: "/images/posters/Quizgame.png",
    title: "أسئلة وأجوبة",
    x: -162,
    y: 6,
    scale: 0.94,
    z: 20,
    delay: -3.6,
  },
  {
    href: "/match?game=word",
    image: "/images/posters/wordgame.png",
    title: "خمن الكلمة",
    x: -54,
    y: 1,
    scale: 0.98,
    z: 30,
    delay: -2.1,
  },
  {
    href: "/match?game=wheel",
    image: "/images/posters/Wheelgame.png",
    title: "لف وخمن",
    x: 54,
    y: 1,
    scale: 0.98,
    z: 30,
    delay: -4.4,
  },
  {
    href: "/match?game=draw",
    image: "/images/posters/Proverbgame.png",
    title: "خمن المثل",
    x: 162,
    y: 6,
    scale: 0.94,
    z: 20,
    delay: -0.7,
  },
  {
    href: "/match?game=categories",
    image: "/images/posters/Categoriesgame.png",
    title: "إنسان حيوان نبات جماد بلاد",
    x: 270,
    y: 12,
    scale: 0.9,
    z: 10,
    delay: -2.9,
  },
];

const CARD_TRANSITION =
  "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), filter 550ms ease, opacity 500ms ease";

export default function Home() {
  const [hoveredCard, setHoveredCard] =
    useState<number | null>(null);

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-4 pt-3 text-white sm:px-6 lg:px-8">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[630px] w-[1000px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

        <div className="absolute -left-64 top-[30%] h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[150px]" />

        <div className="absolute -right-64 top-[25%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-[1450px]">
        {/* ========================= */}
        {/* Logo */}
        {/* ========================= */}

        <header className="flex min-h-[112px] items-start justify-center">
          <Image
            src="/logo.png"
            alt="خل نلعب"
            width={280}
            height={200}
            priority
            className="h-auto w-[175px] object-contain drop-shadow-[0_0_30px_rgba(96,165,250,0.22)] sm:w-[190px]"
          />
        </header>

        {/* ========================= */}
        {/* Main Container */}
        {/* ========================= */}

        <section className="relative rounded-[36px] border border-purple-400/20 bg-[#0c0617]/75 px-5 pb-4 pt-5 shadow-[0_30px_100px_rgba(0,0,0,0.36)] backdrop-blur-2xl sm:px-8 lg:px-10">
          {/* Top highlight */}
          <div className="pointer-events-none absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/45 to-transparent" />

          {/* ========================= */}
          {/* Guide */}
          {/* ========================= */}

          <Link
            href="/guide"
            prefetch={false}
            className="
              absolute
              left-5
              top-5
              z-50
              flex
              items-center
              gap-2
              rounded-full
              border
              border-cyan-300/30
              bg-[#130b24]/90
              px-4
              py-2.5
              text-sm
              font-black
              text-white
              shadow-[0_0_20px_rgba(34,211,238,0.12)]
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-cyan-300/55
              hover:bg-[#19102c]
              hover:shadow-[0_0_26px_rgba(34,211,238,0.20)]
            "
          >
            <span>🎮</span>
            <span>طريقة اللعب</span>
          </Link>

          {/* ========================= */}
          {/* Session Mode */}
          {/* ========================= */}

          <div className="text-center">
            <h1 className="text-4xl font-black sm:text-5xl">
              🏆 تحدي الجلسة
            </h1>

            <div className="mx-auto mt-2 max-w-2xl rounded-2xl border border-yellow-300/[0.08] bg-gradient-to-r from-yellow-300/[0.035] via-yellow-200/[0.06] to-yellow-300/[0.035] px-5 py-2">
              <p className="text-sm font-bold leading-6 text-yellow-50/65 sm:text-[15px]">
                اختاروا أكثر من لعبة، سجلوا الفرق مرة وحدة،
                واجمعوا النقاط لين يطلع بطل الجلسة.
              </p>
            </div>

            <Link
              href="/match?mode=session"
              prefetch={false}
              className="
                mt-3
                inline-flex
                items-center
                justify-center
                rounded-full
                border
                border-yellow-200/45
                bg-gradient-to-r
                from-yellow-300
                to-amber-400
                px-10
                py-3
                font-black
                text-[#241600]
                shadow-[0_10px_32px_rgba(250,204,21,0.24)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_16px_42px_rgba(250,204,21,0.35)]
              "
            >
              ابدأ تحدي الجلسة
            </Link>
          </div>

          {/* ========================= */}
          {/* Divider */}
          {/* ========================= */}

          <div className="mx-auto mt-4 flex max-w-4xl items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-cyan-300/15" />

            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-black text-white/40">
              أو
            </div>

            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-cyan-300/15" />
          </div>

          {/* ========================= */}
          {/* Quick Games */}
          {/* ========================= */}

          <div className="relative mx-auto mt-3 max-w-[1120px] rounded-[28px] border border-cyan-300/[0.14] bg-gradient-to-b from-cyan-400/[0.045] via-white/[0.02] to-transparent px-3 pb-1 pt-3 shadow-[inset_0_1px_0_rgba(255,255,255,.025)] sm:px-5">
            {/* Cyan glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-[560px] -translate-x-1/2 rounded-full bg-cyan-400/[0.055] blur-[65px]" />

            {/* Quick Header */}
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/[0.09] px-5 py-1.5 shadow-[0_0_18px_rgba(34,211,238,.08)]">
                <span className="text-sm">
                  ⚡
                </span>

                <span className="text-sm font-black text-cyan-100">
                  لعبة سريعة
                </span>
              </div>

              <h2 className="mt-1.5 text-2xl font-black sm:text-[28px]">
                اختر لعبة وابدأ مباشرة
              </h2>

              <p className="mt-0.5 text-xs font-bold text-white/40">
                اضغط على أي بطاقة
              </p>
            </div>

            {/* ========================= */}
            {/* Desktop Cards */}
            {/* ========================= */}

            <div
              className="relative mx-auto hidden h-[268px] max-w-[920px] lg:block"
              onMouseLeave={() =>
                setHoveredCard(null)
              }
            >
              {/* Floor glow */}
              <div className="pointer-events-none absolute bottom-3 left-1/2 h-14 w-[670px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-[44px]" />

              <div className="absolute left-1/2 top-[49%]">
                {GAME_CARDS.map(
                  (card, index) => {
                    const active =
                      hoveredCard ===
                      index;

                    let spread = 0;

                    if (
                      hoveredCard !==
                      null
                    ) {
                      if (
                        index <
                        hoveredCard
                      ) {
                        spread = -28;
                      }

                      if (
                        index >
                        hoveredCard
                      ) {
                        spread = 28;
                      }
                    }

                    const finalX =
                      card.x +
                      spread;

                    const finalY =
                      active
                        ? card.y - 30
                        : card.y;

                    return (
                      <Link
                        key={card.title}
                        href={card.href}
                        prefetch={false}
                        aria-label={`ابدأ ${card.title}`}
                        onMouseEnter={() =>
                          setHoveredCard(
                            index
                          )
                        }
                        onFocus={() =>
                          setHoveredCard(
                            index
                          )
                        }
                        onBlur={() =>
                          setHoveredCard(
                            null
                          )
                        }
                        className="
                          absolute
                          left-1/2
                          top-1/2
                          cursor-pointer
                          outline-none
                          will-change-transform
                        "
                        style={{
                          width:
                            "190px",

                          height:
                            "238px",

                          zIndex:
                            active
                              ? 100
                              : card.z,

                          transform: `
                            translate(-50%, -50%)
                            translate3d(
                              ${finalX}px,
                              ${finalY}px,
                              0
                            )
                            scale(
                              ${
                                active
                                  ? card.scale +
                                    0.11
                                  : card.scale
                              }
                            )
                          `,

                          transition:
                            CARD_TRANSITION,

                          filter:
                            active
                              ? "drop-shadow(0 26px 26px rgba(0,0,0,.55)) drop-shadow(0 0 28px rgba(168,85,247,.34))"
                              : "drop-shadow(0 14px 16px rgba(0,0,0,.30))",

                          opacity:
                            hoveredCard !==
                              null &&
                            !active
                              ? 0.76
                              : 1,
                        }}
                      >
                        <div
                          className={`
                            game-idle-card
                            relative
                            h-full
                            w-full
                            overflow-hidden
                            rounded-[20px]
                            border
                            bg-[#11091f]

                            ${
                              active
                                ? "game-idle-paused border-fuchsia-200/80 shadow-[0_0_0_1px_rgba(255,255,255,.08),0_0_36px_rgba(168,85,247,.28)]"
                                : "border-yellow-200/35"
                            }
                          `}
                          style={{
                            animationDelay:
                              `${card.delay}s`,
                          }}
                        >
                          <Image
                            src={
                              card.image
                            }
                            alt={
                              card.title
                            }
                            fill
                            sizes="190px"
                            className={`
                              object-cover
                              transition-transform
                              duration-700
                              ease-out

                              ${
                                active
                                  ? "scale-[1.03]"
                                  : "scale-100"
                              }
                            `}
                          />

                          {/* Hover CTA */}
                          <div
                            className={`
                              pointer-events-none
                              absolute
                              inset-x-3
                              bottom-3
                              rounded-full
                              border
                              border-white/10
                              bg-black/60
                              px-3
                              py-2
                              text-center
                              text-xs
                              font-black
                              backdrop-blur-md
                              transition-all
                              duration-500

                              ${
                                active
                                  ? "translate-y-0 opacity-100"
                                  : "translate-y-3 opacity-0"
                              }
                            `}
                          >
                            العب الآن
                          </div>
                        </div>
                      </Link>
                    );
                  }
                )}
              </div>
            </div>

            {/* ========================= */}
            {/* Mobile / Tablet */}
            {/* ========================= */}

            <div className="relative z-10 mt-4 grid grid-cols-2 gap-3 pb-2 sm:grid-cols-3 lg:hidden">
              {GAME_CARDS.map(
                (card) => (
                  <Link
                    key={
                      card.title
                    }
                    href={
                      card.href
                    }
                    prefetch={
                      false
                    }
                    className="group"
                  >
                    <div
                      className="
                        game-mobile-card
                        relative
                        aspect-[4/5]
                        overflow-hidden
                        rounded-[20px]
                        border
                        border-white/10
                        shadow-[0_12px_30px_rgba(0,0,0,.30)]
                        transition-all
                        duration-300
                        group-active:scale-[0.97]
                      "
                      style={{
                        animationDelay:
                          `${card.delay}s`,
                      }}
                    >
                      <Image
                        src={
                          card.image
                        }
                        alt={
                          card.title
                        }
                        fill
                        sizes="(max-width: 640px) 45vw, 30vw"
                        className="object-cover"
                      />

                      <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-full border border-white/10 bg-black/55 px-3 py-2 text-center text-xs font-black backdrop-blur-md">
                        العب الآن
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ========================= */}
      {/* Animations */}
      {/* ========================= */}

      <style>{`
        @keyframes gameCardIdle {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          25% {
            transform: translate3d(0, -3px, 0);
          }

          50% {
            transform: translate3d(0, -1px, 0);
          }

          75% {
            transform: translate3d(0, 3px, 0);
          }
        }

        @keyframes gameMobileIdle {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-3px);
          }
        }

        .game-idle-card {
          animation:
            gameCardIdle
            6.5s
            ease-in-out
            infinite;

          will-change:
            transform;
        }

        .game-idle-paused {
          animation-play-state:
            paused;
        }

        .game-mobile-card {
          animation:
            gameMobileIdle
            6s
            ease-in-out
            infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .game-idle-card,
          .game-mobile-card {
            animation:
              none;
          }
        }
      `}</style>
    </main>
  );
}
