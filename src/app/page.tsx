'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const gameCards = [
  {
    href: "/match?game=scramble",
    image: "/images/posters/Whogame.jpg",
    title: "منهو ذا؟",
    x: -300,
    y: 14,
    scale: 0.9,
    z: 10,
    delay: -1.2,
  },
  {
    href: "/match?game=quiz",
    image: "/images/posters/Quizgame.jpg",
    title: "أسئلة وأجوبة",
    x: -180,
    y: 7,
    scale: 0.94,
    z: 20,
    delay: -3.6,
  },
  {
    href: "/match?game=word",
    image: "/images/posters/wordgame.jpg",
    title: "خمن الكلمة",
    x: -60,
    y: 1,
    scale: 0.98,
    z: 30,
    delay: -2.1,
  },
  {
    href: "/match?game=wheel",
    image: "/images/posters/Wheelgame.jpg",
    title: "لف وخمن",
    x: 60,
    y: 1,
    scale: 0.98,
    z: 30,
    delay: -4.4,
  },
  {
    href: "/match?game=draw",
    image: "/images/posters/Proverbgame.jpg",
    title: "خمن المثل",
    x: 180,
    y: 7,
    scale: 0.94,
    z: 20,
    delay: -0.7,
  },
  {
    href: "/match?game=categories",
    image: "/images/posters/Categoriesgame.jpg",
    title: "إنسان حيوان نبات جماد بلاد",
    x: 300,
    y: 14,
    scale: 0.9,
    z: 10,
    delay: -2.9,
  },
];

export default function Home() {
  const [hoveredCard, setHoveredCard] =
    useState<number | null>(null);

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 pb-8 pt-5 text-white sm:px-6 lg:px-8">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-280px] h-[650px] w-[1000px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

        <div className="absolute -left-64 top-[30%] h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[150px]" />

        <div className="absolute -right-64 top-[25%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-[1450px]">
        {/* Header */}
        <header className="relative flex min-h-[165px] items-start justify-center pb-4">
          <Link
            href="/guide"
            className="
              absolute
              left-0
              top-6
              z-20
              flex
              items-center
              gap-2
              rounded-full
              border
              border-white/10
              bg-white/[0.035]
              px-5
              py-3
              text-sm
              font-black
              text-white/80
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-purple-300/25
              hover:bg-white/[0.06]
              hover:text-white
            "
          >
            🎮 طريقة اللعب
          </Link>

          <div className="relative z-10 flex flex-col items-center">
            <Image
              src="/logo.png"
              alt="خل نلعب"
              width={300}
              height={220}
              priority
              className="h-auto w-[210px] object-contain drop-shadow-[0_0_32px_rgba(96,165,250,0.22)] sm:w-[225px]"
            />

            <span className="-mt-1 rounded-full border border-white/10 bg-black/25 px-4 py-1.5 text-xs font-bold text-white/50 backdrop-blur-xl">
              نسخة تجريبية
            </span>
          </div>
        </header>

        {/* Main container */}
        <section
          className="
            relative
            rounded-[36px]
            border
            border-purple-400/20
            bg-[#0c0617]/75
            px-5
            pb-7
            pt-7
            shadow-[0_35px_120px_rgba(0,0,0,0.38)]
            backdrop-blur-2xl
            sm:px-8
            lg:px-10
          "
        >
          <div className="pointer-events-none absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/45 to-transparent" />

          {/* Session Mode */}
          <div className="text-center">
            <p className="text-sm font-black text-yellow-300/65">
              تبيها جلسة كاملة؟
            </p>

            <h1 className="mt-1 text-4xl font-black sm:text-5xl">
              🏆 تحدي الجلسة
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-base font-medium leading-8 text-white/50">
              اختاروا أكثر من لعبة، سجلوا الفرق مرة وحدة،
              واجمعوا النقاط لين يطلع بطل الجلسة.
            </p>

            <Link
              href="/match?mode=session"
              className="
                mt-5
                inline-flex
                items-center
                justify-center
                rounded-full
                border
                border-yellow-200/45
                bg-gradient-to-r
                from-yellow-300
                to-amber-400
                px-11
                py-3.5
                font-black
                text-[#241600]
                shadow-[0_12px_38px_rgba(250,204,21,0.24)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_18px_48px_rgba(250,204,21,0.35)]
              "
            >
              ابدأ تحدي الجلسة
            </Link>
          </div>

          {/* Separator */}
          <div className="mx-auto mt-7 flex max-w-3xl items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />

            <div className="text-center">
              <p className="text-lg font-black">
                أو اختر لعبة وابدأ مباشرة
              </p>

              <p className="mt-1 text-xs font-bold text-white/35">
                اضغط على أي بطاقة
              </p>
            </div>

            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>

          {/* Desktop cards */}
          <div
            className="relative mx-auto mt-2 hidden h-[370px] max-w-[1000px] lg:block"
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Glow under cards */}
            <div className="pointer-events-none absolute bottom-5 left-1/2 h-16 w-[720px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-[48px]" />

            <div className="absolute left-1/2 top-[49%]">
              {gameCards.map((card, index) => {
                const active =
                  hoveredCard === index;

                let spread = 0;

                if (hoveredCard !== null) {
                  if (index < hoveredCard) {
                    spread = -34;
                  }

                  if (index > hoveredCard) {
                    spread = 34;
                  }
                }

                const finalX =
                  card.x + spread;

                const finalY = active
                  ? card.y - 42
                  : card.y;

                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    aria-label={`ابدأ ${card.title}`}
                    onMouseEnter={() =>
                      setHoveredCard(index)
                    }
                    onFocus={() =>
                      setHoveredCard(index)
                    }
                    onBlur={() =>
                      setHoveredCard(null)
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
                      width: "205px",
                      height: "292px",

                      zIndex: active
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
                              ? card.scale + 0.11
                              : card.scale
                          }
                        )
                      `,

                      transition:
                        "transform 700ms cubic-bezier(0.16, 1, 0.3, 1), filter 550ms ease, opacity 500ms ease",

                      filter: active
                        ? "drop-shadow(0 28px 28px rgba(0,0,0,.55)) drop-shadow(0 0 30px rgba(168,85,247,.34))"
                        : "drop-shadow(0 15px 18px rgba(0,0,0,.30))",

                      opacity:
                        hoveredCard !== null &&
                        !active
                          ? 0.78
                          : 1,
                    }}
                  >
                    {/* 
                      الـposition والـhover على العنصر الخارجي.
                      الـidle animation على الداخلي عشان ما يتعارضون.
                    */}
                    <div
                      className={`
                        game-idle-card
                        relative
                        h-full
                        w-full
                        overflow-hidden
                        rounded-[23px]
                        border
                        bg-[#11091f]

                        ${
                          active
                            ? "game-idle-paused border-fuchsia-200/80 shadow-[0_0_0_1px_rgba(255,255,255,.08),0_0_40px_rgba(168,85,247,.28)]"
                            : "border-yellow-200/35"
                        }
                      `}
                      style={{
                        animationDelay:
                          `${card.delay}s`,
                      }}
                    >
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="205px"
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

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/[0.035]" />

                      {/* Click hint */}
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
              })}
            </div>
          </div>

          {/* Mobile */}
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
            {gameCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group"
              >
                <div
                  className="
                    relative
                    aspect-[3/4]
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-white/10
                    shadow-[0_12px_30px_rgba(0,0,0,.30)]
                    transition-all
                    duration-300
                    group-active:scale-[0.97]
                  "
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 45vw, 30vw"
                    className="object-cover"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-full border border-white/10 bg-black/55 px-3 py-2 text-center text-xs font-black backdrop-blur-md">
                    العب الآن
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes gameCardIdle {
          0% {
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

          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .game-idle-card {
          animation-name: gameCardIdle;
          animation-duration: 6.5s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;

          will-change: transform;
        }

        .game-idle-paused {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .game-idle-card {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
