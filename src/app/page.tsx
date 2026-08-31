'use client';

import Image from "next/image";
import Link from "next/link";

const games = [
  {
    href: "/match?game=scramble",
    image: "/images/posters/Whogame.jpg",
    title: "منهو ذا؟",
    delay: -1.2,
  },
  {
    href: "/match?game=quiz",
    image: "/images/posters/Quizgame.jpg",
    title: "أسئلة وأجوبة",
    delay: -3.4,
  },
  {
    href: "/match?game=word",
    image: "/images/posters/wordgame.jpg",
    title: "خمن الكلمة",
    delay: -2.1,
  },
  {
    href: "/match?game=wheel",
    image: "/images/posters/Wheelgame.jpg",
    title: "لف وخمن",
    delay: -4.2,
  },
  {
    href: "/match?game=draw",
    image: "/images/posters/Proverbgame.jpg",
    title: "خمن المثل",
    delay: -0.8,
  },
  {
    href: "/match?game=categories",
    image: "/images/posters/Categoriesgame.jpg",
    title: "إنسان حيوان نبات جماد بلاد",
    delay: -2.8,
  },
];

export default function Home() {
  return (
    <main className="relative h-[100dvh] overflow-hidden px-4 py-3 text-white sm:px-6">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-320px] h-[680px] w-[1050px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

        <div className="absolute -left-64 top-[30%] h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[150px]" />

        <div className="absolute -right-64 top-[25%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      <div
        className="
          mx-auto
          grid
          h-full
          max-w-[1450px]
          grid-rows-[auto_minmax(0,1fr)]
          gap-3
        "
      >
        {/* ================================= */}
        {/* Header */}
        {/* ================================= */}

        <header className="flex shrink-0 items-center justify-center">
          <div className="flex flex-col items-center">
            <Image
              src="/logo.png"
              alt="خل نلعب"
              width={260}
              height={180}
              priority
              className="
                h-auto
                w-[150px]
                object-contain
                drop-shadow-[0_0_28px_rgba(96,165,250,0.20)]
                sm:w-[170px]
              "
            />

            {/* Header actions */}
            <div className="-mt-1 flex items-center justify-center gap-2">
              <span
                className="
                  rounded-full
                  border
                  border-white/10
                  bg-black/20
                  px-3
                  py-1.5
                  text-[11px]
                  font-bold
                  text-white/45
                  backdrop-blur-xl
                "
              >
                نسخة تجريبية
              </span>

              <Link
                href="/guide"
                className="
                  group
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-cyan-300/25
                  bg-cyan-400/[0.07]
                  px-4
                  py-1.5
                  text-xs
                  font-black
                  text-cyan-100
                  shadow-[0_0_18px_rgba(34,211,238,0.10)]
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-cyan-300/50
                  hover:bg-cyan-400/[0.12]
                  hover:shadow-[0_0_24px_rgba(34,211,238,0.18)]
                "
              >
                <span className="text-sm">
                  🎮
                </span>

                <span>
                  طريقة اللعب
                </span>

                <span
                  className="
                    text-cyan-200/40
                    transition-transform
                    duration-300
                    group-hover:-translate-x-0.5
                  "
                >
                  ←
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* ================================= */}
        {/* Main Shell */}
        {/* ================================= */}

        <section
          className="
            relative
            flex
            min-h-0
            flex-col
            overflow-hidden
            rounded-[34px]
            border
            border-purple-400/20
            bg-[#0c0617]/78
            p-4
            shadow-[0_30px_100px_rgba(0,0,0,0.36)]
            backdrop-blur-2xl
            sm:p-5
            lg:p-6
          "
        >
          <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/45 to-transparent" />

          {/* ================================= */}
          {/* HERO — Session Mode */}
          {/* ================================= */}

          <div
            className="
              grid
              min-h-0
              flex-1
              items-center
              gap-4
              lg:grid-cols-[0.95fr_1.05fr]
              lg:gap-8
            "
          >
            {/* Hero cards */}
            <Link
              href="/match?mode=session"
              className="
                group
                relative
                order-2
                flex
                min-h-0
                items-center
                justify-center
                lg:order-1
              "
            >
              {/* deck glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-[7%]
                  left-1/2
                  h-16
                  w-[72%]
                  -translate-x-1/2
                  rounded-full
                  bg-purple-500/20
                  blur-[45px]
                  transition-all
                  duration-700
                  group-hover:bg-purple-500/30
                "
              />

              {/* deck */}
              <div
                className="
                  relative
                  flex
                  h-[clamp(190px,31vh,300px)]
                  w-full
                  max-w-[650px]
                  items-center
                  justify-center
                  px-5
                "
              >
                {games.map((game, index) => (
                  <div
                    key={game.title}
                    className={`
                      hero-card-position
                      relative
                      h-[clamp(175px,27vh,265px)]
                      w-[clamp(122px,18vh,184px)]
                      shrink-0

                      ${
                        index === 0
                          ? ""
                          : "-mr-[clamp(38px,5.6vh,62px)]"
                      }

                      ${
                        index === 2 ||
                        index === 3
                          ? "z-30"
                          : index === 1 ||
                              index === 4
                            ? "z-20"
                            : "z-10"
                      }
                    `}
                    style={{
                      transform:
                        index === 2 ||
                        index === 3
                          ? "translateY(-7px)"
                          : index === 1 ||
                              index === 4
                            ? "translateY(0px)"
                            : "translateY(7px)",
                    }}
                  >
                    <div
                      className="
                        hero-card-idle
                        relative
                        h-full
                        w-full
                        overflow-hidden
                        rounded-[20px]
                        border
                        border-yellow-200/30
                        bg-[#12091f]
                        shadow-[0_14px_30px_rgba(0,0,0,0.34)]
                        transition-all
                        duration-700
                        ease-out

                        group-hover:border-yellow-200/45
                        group-hover:shadow-[0_22px_42px_rgba(0,0,0,.42)]
                      "
                      style={{
                        animationDelay:
                          `${game.delay}s`,
                      }}
                    >
                      <Image
                        src={game.image}
                        alt={game.title}
                        fill
                        sizes="180px"
                        className="object-cover"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/[0.025]" />
                    </div>
                  </div>
                ))}

                {/* Hero deck CTA */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    bottom-[3%]
                    left-1/2
                    z-50
                    -translate-x-1/2
                    translate-y-3
                    rounded-full
                    border
                    border-white/10
                    bg-black/65
                    px-5
                    py-2
                    text-xs
                    font-black
                    text-white
                    opacity-0
                    shadow-xl
                    backdrop-blur-xl
                    transition-all
                    duration-500

                    group-hover:translate-y-0
                    group-hover:opacity-100
                  "
                >
                  ابدأ تحدي الجلسة
                </div>
              </div>
            </Link>

            {/* Hero copy */}
            <div className="order-1 text-center lg:order-2 lg:text-right">
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-yellow-300/15
                  bg-yellow-300/[0.05]
                  px-4
                  py-1.5
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-300 shadow-[0_0_8px_rgba(253,224,71,.8)]" />

                <span className="text-xs font-black text-yellow-100/75">
                  الوضع الرئيسي
                </span>
              </div>

              <h1
                className="
                  mt-3
                  text-[clamp(2.2rem,5vw,4.6rem)]
                  font-black
                  leading-[1.05]
                  tracking-tight
                "
              >
                تحدي الجلسة
                <span className="mr-3">
                  🏆
                </span>
              </h1>

              <p
                className="
                  mx-auto
                  mt-4
                  max-w-xl
                  text-sm
                  font-medium
                  leading-7
                  text-white/50
                  sm:text-base
                  lg:mx-0
                "
              >
                اختاروا أكثر من لعبة، سجلوا الفرق مرة وحدة،
                واجمعوا النقاط لين يطلع بطل الجلسة.
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-bold text-white/45">
                  أكثر من لعبة
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-bold text-white/45">
                  نقاط وجولات
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-bold text-white/45">
                  فائز بالنهاية
                </span>
              </div>

              <Link
                href="/match?mode=session"
                className="
                  mt-6
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
                  py-3.5
                  font-black
                  text-[#241600]
                  shadow-[0_12px_38px_rgba(250,204,21,0.25)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_18px_48px_rgba(250,204,21,0.36)]
                "
              >
                ابدأ تحدي الجلسة
              </Link>
            </div>
          </div>

          {/* ================================= */}
          {/* Quick Games Strip */}
          {/* ================================= */}

          <div
            className="
              mt-3
              shrink-0
              rounded-[24px]
              border
              border-cyan-300/10
              bg-gradient-to-r
              from-cyan-400/[0.035]
              via-white/[0.025]
              to-purple-400/[0.035]
              p-3
              sm:p-4
            "
          >
            <div
              className="
                flex
                min-w-0
                flex-col
                gap-3
                lg:grid
                lg:grid-cols-[205px_minmax(0,1fr)]
                lg:items-center
                lg:gap-4
              "
            >
              {/* Quick title */}
              <div className="flex shrink-0 items-center gap-3 text-right">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-cyan-300/20
                    bg-cyan-400/10
                    text-2xl
                    shadow-[0_0_20px_rgba(34,211,238,.10)]
                  "
                >
                  ⚡
                </div>

                <div>
                  <p className="text-lg font-black text-cyan-200">
                    لعبة سريعة
                  </p>

                  <p className="text-xs font-bold text-white/35">
                    اختر بطاقة وابدأ مباشرة
                  </p>
                </div>
              </div>

              {/* Quick cards */}
              <div
                className="
                  flex
                  min-w-0
                  gap-2
                  overflow-x-auto
                  pb-1
                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden

                  lg:grid
                  lg:grid-cols-6
                  lg:overflow-visible
                  lg:pb-0
                "
              >
                {games.map((game) => (
                  <Link
                    key={game.title}
                    href={game.href}
                    className="
                      group/card
                      w-[105px]
                      shrink-0
                      sm:w-[115px]
                      lg:w-auto
                    "
                  >
                    <div
                      className="
                        quick-card-idle
                        relative
                        h-[118px]
                        overflow-hidden
                        rounded-[15px]
                        border
                        border-white/10
                        bg-[#12091f]
                        shadow-[0_8px_20px_rgba(0,0,0,.24)]
                        transition-all
                        duration-500
                        ease-out

                        group-hover/card:-translate-y-2
                        group-hover/card:scale-[1.035]
                        group-hover/card:border-cyan-300/45
                        group-hover/card:shadow-[0_15px_28px_rgba(34,211,238,.12)]

                        sm:h-[128px]
                        lg:h-[138px]
                      "
                      style={{
                        animationDelay:
                          `${game.delay}s`,
                      }}
                    >
                      <Image
                        src={game.image}
                        alt={game.title}
                        fill
                        sizes="130px"
                        className="
                          object-cover
                          transition-transform
                          duration-700
                          ease-out
                          group-hover/card:scale-[1.035]
                        "
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-x-2
                          bottom-2
                          translate-y-2
                          rounded-full
                          border
                          border-white/10
                          bg-black/65
                          px-2
                          py-1
                          text-center
                          text-[10px]
                          font-black
                          opacity-0
                          backdrop-blur-lg
                          transition-all
                          duration-300

                          group-hover/card:translate-y-0
                          group-hover/card:opacity-100
                        "
                      >
                        العب الآن
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ================================= */}
      {/* Animations */}
      {/* ================================= */}

      <style>{`
        @keyframes heroCardIdle {
          0% {
            transform: translate3d(0, 0, 0);
          }

          35% {
            transform: translate3d(0, -3px, 0);
          }

          65% {
            transform: translate3d(0, 2px, 0);
          }

          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes quickCardIdle {
          0% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-2px);
          }

          100% {
            transform: translateY(0);
          }
        }

        .hero-card-idle {
          animation:
            heroCardIdle
            7s
            ease-in-out
            infinite;
        }

        .quick-card-idle {
          animation:
            quickCardIdle
            7.5s
            ease-in-out
            infinite;
        }

        @media (hover: hover) and (pointer: fine) {
          .hero-card-position {
            transition:
              transform
              650ms
              cubic-bezier(0.16, 1, 0.3, 1);
          }

          .group:hover .hero-card-position:nth-child(1) {
            transform: translate3d(-10px, 4px, 0) !important;
          }

          .group:hover .hero-card-position:nth-child(2) {
            transform: translate3d(-7px, -2px, 0) !important;
          }

          .group:hover .hero-card-position:nth-child(3) {
            transform: translate3d(-3px, -12px, 0) !important;
          }

          .group:hover .hero-card-position:nth-child(4) {
            transform: translate3d(3px, -12px, 0) !important;
          }

          .group:hover .hero-card-position:nth-child(5) {
            transform: translate3d(7px, -2px, 0) !important;
          }

          .group:hover .hero-card-position:nth-child(6) {
            transform: translate3d(10px, 4px, 0) !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-card-idle,
          .quick-card-idle {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
