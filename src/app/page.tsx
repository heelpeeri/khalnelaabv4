'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  "transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease";

export default function Home() {
  const router = useRouter();

  const [hoveredCard, setHoveredCard] =
    useState<number | null>(null);

  const [isLeaving, setIsLeaving] =
    useState(false);

  useEffect(() => {
    // نجهز الصفحتين فقط.
    // ما نحتاج نسوي prefetch لكل query حق كل لعبة.
    router.prefetch("/match");
    router.prefetch("/guide");
  }, [router]);

  function prepareNavigation() {
    // Safari يتأخر أحيانًا وهو يفك طبقات animation/filter.
    // نوقفها من pointer down قبل تنفيذ الانتقال.
    setIsLeaving(true);
    setHoveredCard(null);
  }

  return (
    <main
      className={`
        relative
        min-h-screen
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
            className="
              h-auto
              w-[175px]
              object-contain
              sm:w-[190px]
            "
          />
        </header>

        {/* ========================= */}
        {/* Main container */}
        {/* ========================= */}

        <section
          className="
            relative
            rounded-[36px]
            border
            border-purple-400/20
            bg-[#0c0617]/95
            px-5
            pb-4
            pt-5
            shadow-[0_26px_70px_rgba(0,0,0,0.32)]
            sm:px-8
            lg:px-10
          "
        >
          <div className="pointer-events-none absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/45 to-transparent" />

          {/* ========================= */}
          {/* Guide button */}
          {/* ========================= */}

          <Link
            href="/guide"
            prefetch={false}
            onPointerDown={prepareNavigation}
            onClick={prepareNavigation}
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
              bg-[#130b24]
              px-4
              py-2.5
              text-sm
              font-black
              text-white
              shadow-[0_0_18px_rgba(34,211,238,0.10)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-cyan-300/55
              hover:bg-[#19102c]
              hover:shadow-[0_0_22px_rgba(34,211,238,0.16)]
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
              onPointerDown={prepareNavigation}
              onClick={prepareNavigation}
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
                shadow-[0_10px_28px_rgba(250,204,21,0.20)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_14px_34px_rgba(250,204,21,0.28)]
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

          <div
            className="
              relative
              mx-auto
              mt-3
              max-w-[1120px]
              rounded-[28px]
              border
              border-cyan-300/[0.14]
              px-3
              pb-1
              pt-3
              shadow-[inset_0_1px_0_rgba(255,255,255,.025)]
              sm:px-5
            "
            style={{
              backgroundImage: `
                radial-gradient(
                  ellipse 500px 150px at 50% 0%,
                  rgba(34,211,238,0.055),
                  transparent 75%
                ),
                linear-gradient(
                  to bottom,
                  rgba(34,211,238,0.035),
                  rgba(255,255,255,0.018),
                  transparent
                )
              `,
            }}
          >
            {/* Header */}
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/[0.09] px-5 py-1.5 shadow-[0_0_16px_rgba(34,211,238,.07)]">
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
              {/* Floor glow - بدون blur */}
              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-0
                  left-1/2
                  h-20
                  w-[700px]
                  -translate-x-1/2
                  rounded-[50%]
                "
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(168,85,247,0.16) 0%, rgba(168,85,247,0.05) 42%, transparent 72%)",
                }}
              />

              <div className="absolute left-1/2 top-[49%]">
                {GAME_CARDS.map(
                  (card, index) => {
                    const active =
                      hoveredCard === index;

                    const spread =
                      hoveredCard === null
                        ? 0
                        : index < hoveredCard
                          ? -28
                          : index > hoveredCard
                            ? 28
                            : 0;

                    const finalX =
                      card.x + spread;

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
                        onPointerDown={
                          prepareNavigation
                        }
                        onClick={
                          prepareNavigation
                        }
                        onMouseEnter={() => {
                          if (
                            !isLeaving
                          ) {
                            setHoveredCard(
                              index
                            );
                          }
                        }}
                        onFocus={() => {
                          if (
                            !isLeaving
                          ) {
                            setHoveredCard(
                              index
                            );
                          }
                        }}
                        onBlur={() =>
                          setHoveredCard(
                            null
                          )
                        }
                        className="
                          home-card-link
                          absolute
                          left-1/2
                          top-1/2
                          cursor-pointer
                          outline-none
                        "
                        style={{
                          width: "190px",
                          height: "238px",

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
                                  ? card.scale +
                                    0.11
                                  : card.scale
                              }
                            )
                          `,

                          transition:
                            CARD_TRANSITION,

                          opacity:
                            hoveredCard !==
                              null &&
                            !active
                              ? 0.78
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
                            transition-shadow
                            duration-300

                            ${
                              active
                                ? "game-idle-paused border-fuchsia-200/80 shadow-[0_22px_38px_rgba(0,0,0,.42),0_0_24px_rgba(168,85,247,.22)]"
                                : "border-yellow-200/35 shadow-[0_12px_20px_rgba(0,0,0,.28)]"
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
                              duration-500
                              ease-out

                              ${
                                active
                                  ? "scale-[1.025]"
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
                              bg-black/80
                              px-3
                              py-2
                              text-center
                              text-xs
                              font-black
                              transition-all
                              duration-300

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
                    key={card.title}
                    href={card.href}
                    prefetch={false}
                    onPointerDown={
                      prepareNavigation
                    }
                    onClick={
                      prepareNavigation
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
                        shadow-[0_10px_24px_rgba(0,0,0,.28)]
                        transition-transform
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

                      <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-full border border-white/10 bg-black/80 px-3 py-2 text-center text-xs font-black">
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

        /*
          مهم لـ Safari:
          نوقف كل الحركات فور الضغط قبل الانتقال.
        */
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
