'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const quickGames = [
  {
    href: "/match?game=word",
    title: "خمن الكلمة",
    image: "/images/posters/wordgame.jpg",
  },
  {
    href: "/match?game=wheel",
    title: "لف وخمن",
    image: "/images/posters/Wheelgame.jpg",
  },
  {
    href: "/match?game=quiz",
    title: "أسئلة وأجوبة",
    image: "/images/posters/Quizgame.jpg",
  },
  {
    href: "/match?game=scramble",
    title: "منهو ذا؟",
    image: "/images/posters/Whogame.jpg",
  },
  {
    href: "/match?game=draw",
    title: "خمن المثل",
    image: "/images/posters/Proverbgame.jpg",
  },
  {
    href: "/match?game=categories",
    title: "إنسان حيوان نبات جماد بلاد",
    image: "/images/posters/Categoriesgame.jpg",
  },
];

const sessionCards = [
  {
    image: "/images/posters/Whogame.jpg",
    title: "منهو ذا؟",
    x: -310,
    y: 50,
    rotate: -13,
    scale: 0.84,
    z: 10,
  },
  {
    image: "/images/posters/Quizgame.jpg",
    title: "أسئلة وأجوبة",
    x: -205,
    y: 24,
    rotate: -8,
    scale: 0.9,
    z: 20,
  },
  {
    image: "/images/posters/wordgame.jpg",
    title: "خمن الكلمة",
    x: -102,
    y: 5,
    rotate: -4,
    scale: 0.96,
    z: 30,
  },
  {
    image: "/images/posters/Wheelgame.jpg",
    title: "لف وخمن",
    x: 0,
    y: -8,
    rotate: 0,
    scale: 1.04,
    z: 40,
  },
  {
    image: "/images/posters/Proverbgame.jpg",
    title: "خمن المثل",
    x: 105,
    y: 6,
    rotate: 4,
    scale: 0.96,
    z: 30,
  },
  {
    image: "/images/posters/Categoriesgame.jpg",
    title: "إنسان حيوان نبات جماد بلاد",
    x: 215,
    y: 28,
    rotate: 9,
    scale: 0.89,
    z: 20,
  },
];

export default function Home() {
  const [showQuickGames, setShowQuickGames] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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

        {/* Main card */}
        <section
          className="
            relative
            rounded-[36px]
            border
            border-purple-400/20
            bg-[#0c0617]/75
            px-5
            pb-5
            pt-7
            shadow-[0_35px_120px_rgba(0,0,0,0.38)]
            backdrop-blur-2xl
            sm:px-8
            lg:px-10
          "
        >
          <div className="pointer-events-none absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/45 to-transparent" />

          {/* Session header */}
          <div className="text-center">
            <p className="text-sm font-black text-yellow-300/65">
              الوضع الرئيسي
            </p>

            <h1 className="mt-1 text-4xl font-black sm:text-5xl">
              🏆 تحدي الجلسة
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-base font-medium leading-8 text-white/50">
              اختر ألعابكم، سجلوا الفرق مرة وحدة، وكل جولة تقربكم من بطل
              الجلسة.
            </p>
          </div>

          {/* Desktop card fan */}
          <div
            className="relative mx-auto mt-1 hidden h-[365px] max-w-[980px] lg:block"
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* floor glow */}
            <div className="pointer-events-none absolute bottom-4 left-1/2 h-20 w-[620px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-[50px]" />

            <div className="absolute left-1/2 top-[47%]">
              {sessionCards.map((card, index) => {
                const active = hoveredCard === index;

                /*
                  إذا اخترنا بطاقة:
                  اللي يسارها يتحرك شوي يسار،
                  واللي يمينها يتحرك شوي يمين.
                */
                let spread = 0;

                if (hoveredCard !== null) {
                  if (index < hoveredCard) {
                    spread = -20;
                  }

                  if (index > hoveredCard) {
                    spread = 20;
                  }
                }

                const finalX = card.x + spread;
                const finalY = active ? card.y - 38 : card.y;

                return (
                  <div
                    key={card.title}
                    onMouseEnter={() => setHoveredCard(index)}
                    className="
                      absolute
                      left-1/2
                      top-1/2
                      cursor-pointer
                      will-change-transform
                    "
                    style={{
                      width: "205px",
                      height: "292px",

                      zIndex: active ? 100 : card.z,

                      transform: `
                        translate(-50%, -50%)
                        translate3d(${finalX}px, ${finalY}px, 0)
                        rotate(${active ? 0 : card.rotate}deg)
                        scale(${active ? card.scale + 0.11 : card.scale})
                      `,

                      transition:
                        "transform 560ms cubic-bezier(0.22, 1, 0.36, 1), filter 450ms ease, opacity 450ms ease",

                      filter: active
                        ? "drop-shadow(0 28px 26px rgba(0,0,0,.52)) drop-shadow(0 0 24px rgba(168,85,247,.32))"
                        : "drop-shadow(0 17px 18px rgba(0,0,0,.32))",

                      opacity:
                        hoveredCard !== null && !active
                          ? 0.82
                          : 1,
                    }}
                  >
                    <div
                      className={`
                        relative
                        h-full
                        w-full
                        overflow-hidden
                        rounded-[23px]
                        border
                        bg-[#11091f]
                        transition-all
                        duration-500

                        ${
                          active
                            ? "border-fuchsia-200/70 shadow-[0_0_0_1px_rgba(255,255,255,.06),0_0_35px_rgba(168,85,247,.24)]"
                            : "border-yellow-200/35"
                        }
                      `}
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
                              ? "scale-[1.025]"
                              : "scale-100"
                          }
                        `}
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/[0.025]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile/tablet */}
          <div className="mt-7 grid grid-cols-3 gap-3 lg:hidden">
            {sessionCards.map((card) => (
              <div
                key={card.title}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Start button */}
          <div className="-mt-2 flex justify-center lg:-mt-1">
            <Link
              href="/match?mode=session"
              className="
                relative
                z-50
                rounded-full
                border
                border-yellow-200/45
                bg-gradient-to-r
                from-yellow-300
                to-amber-400
                px-12
                py-4
                font-black
                text-[#241600]
                shadow-[0_12px_38px_rgba(250,204,21,0.25)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_18px_48px_rgba(250,204,21,0.36)]
                active:translate-y-0
              "
            >
              ابدأ تحدي الجلسة
            </Link>
          </div>

          {/* Quick mode */}
          <div
            className="
              relative
              mt-6
              rounded-[27px]
              border
              border-cyan-400/15
              bg-gradient-to-r
              from-[#100a20]/85
              to-[#0b0a1d]/85
              px-6
              py-5
              shadow-[0_18px_55px_rgba(0,0,0,0.20)]
              backdrop-blur-xl
            "
          >
            <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
              {/* Icon */}
              <div
                className="
                  flex
                  h-16
                  w-16
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-cyan-300/20
                  bg-cyan-400/10
                  text-4xl
                  shadow-[0_0_24px_rgba(34,211,238,0.12)]
                "
              >
                ⚡
              </div>

              {/* Text */}
              <div className="flex-1 text-center sm:text-right">
                <p className="text-2xl font-black text-cyan-300">
                  لعبة سريعة
                </p>

                <p className="mt-1 text-sm font-medium text-white/45">
                  اختر لعبة وحدة وابدأ مباشرة.
                </p>
              </div>

              {/* Button */}
              <button
                type="button"
                onClick={() =>
                  setShowQuickGames(
                    (current) => !current
                  )
                }
                className="
                  min-w-[210px]
                  rounded-full
                  bg-gradient-to-r
                  from-cyan-400
                  to-blue-600
                  px-8
                  py-3.5
                  font-black
                  text-white
                  shadow-[0_10px_30px_rgba(14,165,233,0.24)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_15px_38px_rgba(14,165,233,0.34)]
                "
              >
                {showQuickGames
                  ? "إخفاء الألعاب"
                  : "اختر لعبة سريعة"}
              </button>
            </div>

            {/* Quick games */}
            <div
              className={`
                grid
                transition-all
                duration-500
                ease-out

                ${
                  showQuickGames
                    ? "mt-5 max-h-[500px] grid-cols-3 gap-3 border-t border-white/10 pt-5 opacity-100 sm:grid-cols-6"
                    : "max-h-0 overflow-hidden opacity-0"
                }
              `}
            >
              {quickGames.map((game) => (
                <Link
                  key={game.title}
                  href={game.href}
                  className="group"
                >
                  <div
                    className="
                      relative
                      aspect-[3/4]
                      overflow-hidden
                      rounded-[18px]
                      border
                      border-white/10
                      shadow-[0_10px_26px_rgba(0,0,0,.3)]
                      transition-all
                      duration-500
                      ease-out
                      group-hover:-translate-y-2
                      group-hover:border-cyan-300/50
                      group-hover:shadow-[0_18px_38px_rgba(34,211,238,.15)]
                    "
                  >
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      sizes="150px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
