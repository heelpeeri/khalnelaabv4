"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import type { GameType } from "@/lib/matchQueue";

type GameCard = {
  id: GameType;
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
    id: "scramble",
    image: "/images/posters/Whogame.png",
    title: "منهو ذا؟",
    x: -336,
    y: 15,
    scale: 0.86,
    z: 10,
    delay: -1.2,
  },
  {
    id: "quiz",
    image: "/images/posters/Quizgame.png",
    title: "أسئلة وأجوبة",
    x: -240,
    y: 10,
    scale: 0.9,
    z: 20,
    delay: -3.6,
  },
  {
    id: "word",
    image: "/images/posters/wordgame.png",
    title: "خمن الكلمة",
    x: -144,
    y: 5,
    scale: 0.94,
    z: 30,
    delay: -2.1,
  },
  {
    id: "logo",
    image: "/images/posters/Logogame.png",
    title: "خمن الشعار",
    x: -48,
    y: 0,
    scale: 1,
    z: 40,
    delay: -5.1,
  },
  {
    id: "country",
    image: "/images/posters/Countries.png",
    title: "خمن العلم",
    x: 48,
    y: 0,
    scale: 1,
    z: 40,
    delay: -1.8,
  },
  {
    id: "wheel",
    image: "/images/posters/Wheelgame.png",
    title: "لف وخمن",
    x: 144,
    y: 5,
    scale: 0.94,
    z: 30,
    delay: -4.4,
  },
  {
    id: "draw",
    image: "/images/posters/Proverbgame.png",
    title: "خمن المثل",
    x: 240,
    y: 10,
    scale: 0.9,
    z: 20,
    delay: -0.7,
  },
  {
    id: "categories",
    image: "/images/posters/Categoriesgame.png",
    title: "إنسان حيوان نبات جماد بلاد",
    x: 336,
    y: 15,
    scale: 0.86,
    z: 10,
    delay: -2.9,
  },
];

const CARD_TRANSITION =
  "transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease";

export default function Home() {
  const router = useRouter();

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    router.prefetch("/match");
    router.prefetch("/guide");
  }, [router]);

  function prepareNavigation() {
    setIsLeaving(true);
    setHoveredCard(null);
  }

  return (
    <main
      className={`
        relative
        min-h-[100svh]
        overflow-x-hidden
        px-4
        pb-4
        pt-3
        text-white
        sm:px-6
        lg:px-8

        ${isLeaving ? "home-leaving" : ""}
      `}
      style={{
        backgroundImage: `
          radial-gradient(
            ellipse 700px 430px at 50% -100px,
            rgba(126, 34, 206, 0.20),
            transparent 72%
          ),
          radial-gradient(
            ellipse 450px 500px at -8% 45%,
            rgba(217, 70, 239, 0.07),
            transparent 70%
          ),
          radial-gradient(
            ellipse 450px 500px at 108% 42%,
            rgba(59, 130, 246, 0.07),
            transparent 70%
          )
        `,
      }}
    >
      <div className="mx-auto max-w-[1450px]">
        <header className="flex min-h-[112px] items-start justify-center">
          <Image
            src="/logo.png"
            alt="خل نلعب"
            width={280}
            height={200}
            priority
            className="
              h-auto
              w-[175px]
              object-contain
              sm:w-[190px]
            "
          />
        </header>

        <section className="text-center">
          <h1 className="text-4xl font-black leading-normal sm:text-5xl">
            🏆 تحدي الجلسة
          </h1>

          <p className="mx-auto mt-1 max-w-xl text-base font-bold leading-7 text-white/70 sm:text-lg">
            ثمان ألعاب، فريقين، واللي يجمع أكثر هو بطل الجلسة.
          </p>

          <Link
            href="/match?mode=session"
            prefetch={false}
            onClick={prepareNavigation}
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
              px-10
              py-3
              text-lg
              font-black
              text-[#241600]
              shadow-[0_10px_28px_rgba(250,204,21,0.20)]
              transition-[transform,box-shadow]
              duration-200
              ease-[var(--ease-out)]
              hover:-translate-y-0.5
              hover:shadow-[0_14px_34px_rgba(250,204,21,0.28)]
              active:scale-[0.97]
            "
          >
            ابدأ تحدي الجلسة
          </Link>

          <p className="mt-3 text-sm font-bold text-white/55">
            أول مرة؟{" "}
            <Link
              href="/guide"
              prefetch={false}
              onClick={prepareNavigation}
              className="text-cyan-200 underline underline-offset-4"
            >
              شوفوا طريقة اللعب
            </Link>
          </p>

          <p className="mt-7 text-sm font-black text-white/60">
            ألعاب الجلسة، اضغطوا على وحدة وابدأوا فيها
          </p>

          <div
            className="relative mx-auto mt-2 hidden h-[240px] max-w-[960px] lg:block"
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                left-1/2
                h-20
                w-[760px]
                -translate-x-1/2
                rounded-[50%]
              "
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(168,85,247,0.16) 0%, rgba(168,85,247,0.05) 42%, transparent 72%)",
              }}
            />

            <div className="absolute left-1/2 top-1/2">
              {GAME_CARDS.map((card, index) => {
                const active = hoveredCard === index;

                const spread =
                  hoveredCard === null
                    ? 0
                    : index < hoveredCard
                      ? -18
                      : index > hoveredCard
                        ? 18
                        : 0;

                const finalX = card.x + spread;

                const finalY = active ? card.y - 24 : card.y;

                return (
                  <Link
                    key={card.id}
                    href={`/match?mode=session&game=${card.id}`}
                    prefetch={false}
                    aria-label={`ابدأوا تحدي الجلسة بـ ${card.title}`}
                    onClick={prepareNavigation}
                    onMouseEnter={() => {
                      if (!isLeaving) {
                        setHoveredCard(index);
                      }
                    }}
                    onFocus={() => {
                      if (!isLeaving) {
                        setHoveredCard(index);
                      }
                    }}
                    onBlur={() => setHoveredCard(null)}
                    className="
                      home-card-link
                      group
                      absolute
                      left-1/2
                      top-1/2
                      cursor-pointer
                      rounded-[18px]
                      outline-none
                    "
                    style={{
                      width: "144px",
                      height: "180px",

                      zIndex: active ? 100 : card.z,

                      transform: `
                        translate(-50%, -50%)
                        translate3d(
                          ${finalX}px,
                          ${finalY}px,
                          0
                        )
                        scale(
                          ${active ? card.scale + 0.1 : card.scale}
                        )
                      `,

                      transition: CARD_TRANSITION,

                      opacity: hoveredCard !== null && !active ? 0.8 : 1,
                    }}
                  >
                    <div
                      className={`
                        game-idle-card
                        relative
                        h-full
                        w-full
                        overflow-hidden
                        rounded-[18px]
                        border
                        bg-[#11091f]
                        transition-shadow
                        duration-300
                        group-focus-visible:ring-2
                        group-focus-visible:ring-cyan-300

                        ${
                          active
                            ? "game-idle-paused border-fuchsia-200/80 shadow-[0_22px_38px_rgba(0,0,0,.42),0_0_24px_rgba(168,85,247,.22)]"
                            : "border-yellow-200/35 shadow-[0_12px_20px_rgba(0,0,0,.28)]"
                        }
                      `}
                      style={{
                        animationDelay: `${card.delay}s`,
                      }}
                    >
                      <Image
                        src={card.image}
                        alt=""
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mx-auto mt-3 grid max-w-md grid-cols-4 gap-2 sm:max-w-2xl sm:gap-3 lg:hidden">
            {GAME_CARDS.map((card) => (
              <Link
                key={card.id}
                href={`/match?mode=session&game=${card.id}`}
                prefetch={false}
                aria-label={`ابدأوا تحدي الجلسة بـ ${card.title}`}
                onClick={prepareNavigation}
                className="group rounded-[14px] outline-none"
              >
                <div
                  className="
                    game-mobile-card
                    relative
                    aspect-[4/5]
                    overflow-hidden
                    rounded-[14px]
                    border
                    border-white/10
                    shadow-[0_8px_18px_rgba(0,0,0,.28)]
                    transition-transform
                    duration-150
                    ease-[var(--ease-out)]
                    group-focus-visible:ring-2
                    group-focus-visible:ring-cyan-300
                    group-active:scale-[0.97]
                  "
                  style={{
                    animationDelay: `${card.delay}s`,
                  }}
                >
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 25vw, 160px"
                    className="object-cover"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-3xl rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-4 text-center sm:px-6">
          <h2 className="text-lg font-black text-white/85">
            ⚡ تبون لعبة وحدة على السريع؟
          </h2>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {GAME_CARDS.map((card) => (
              <Link
                key={card.id}
                href={`/match?game=${card.id}`}
                prefetch={false}
                onClick={prepareNavigation}
                className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-sm font-bold text-white/75 transition-colors duration-200 hover:border-cyan-300/40 hover:text-white"
              >
                {card.title}
              </Link>
            ))}
          </div>
        </section>

        <SiteFooter />
      </div>

      <style>{`
        @keyframes gameCardIdle {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes gameMobileIdle {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-2px);
          }
        }

        .game-idle-card {
          animation: gameCardIdle 7s ease-in-out infinite;
        }

        .game-idle-paused {
          animation-play-state: paused;
        }

        .game-mobile-card {
          animation: gameMobileIdle 7s ease-in-out infinite;
        }

        .home-leaving .game-idle-card,
        .home-leaving .game-mobile-card {
          animation: none !important;
        }

        .home-leaving .home-card-link {
          transition: none !important;
        }

        .home-leaving * {
          scroll-behavior: auto !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .game-idle-card,
          .game-mobile-card {
            animation: none;
          }

          .home-card-link {
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
