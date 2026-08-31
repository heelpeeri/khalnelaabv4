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
    x: -270,
    y: 38,
    rotate: -12,
    scale: 0.88,
  },
  {
    image: "/images/posters/Quizgame.jpg",
    title: "أسئلة وأجوبة",
    x: -175,
    y: 15,
    rotate: -8,
    scale: 0.92,
  },
  {
    image: "/images/posters/wordgame.jpg",
    title: "خمن الكلمة",
    x: -82,
    y: -3,
    rotate: -4,
    scale: 0.97,
  },
  {
    image: "/images/posters/Wheelgame.jpg",
    title: "لف وخمن",
    x: 0,
    y: -18,
    rotate: 0,
    scale: 1.05,
  },
  {
    image: "/images/posters/Proverbgame.jpg",
    title: "خمن المثل",
    x: 92,
    y: -2,
    rotate: 5,
    scale: 0.97,
  },
  {
    image: "/images/posters/Categoriesgame.jpg",
    title: "إنسان حيوان نبات جماد بلاد",
    x: 188,
    y: 22,
    rotate: 9,
    scale: 0.91,
  },
];

export default function Home() {
  const [showQuickGames, setShowQuickGames] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-5 text-white sm:px-6 lg:px-8">

      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-260px] h-[620px] w-[950px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

        <div className="absolute -left-64 top-[35%] h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[150px]" />

        <div className="absolute -right-64 top-[25%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[150px]" />

        <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_center,rgba(112,48,190,0.12),transparent_65%)]" />
      </div>

      <div className="mx-auto max-w-[1450px]">

        {/* Header */}
        <header className="relative flex h-[135px] items-start justify-center">

          {/* Guide */}
          <Link
            href="/guide"
            className="
              absolute
              left-0
              top-5
              flex
              items-center
              gap-3
              rounded-full
              border
              border-white/10
              bg-white/[0.035]
              px-5
              py-3
              text-sm
              font-black
              text-white/85
              backdrop-blur-xl
              transition-all
              hover:border-purple-300/25
              hover:bg-white/[0.06]
            "
          >
            <span>🎮</span>
            <span>طريقة اللعب</span>
          </Link>

          {/* Logo */}
          <div className="flex flex-col items-center">
            <Image
              src="/logo.png"
              alt="خل نلعب"
              width={240}
              height={160}
              priority
              className="h-auto w-[180px] drop-shadow-[0_0_30px_rgba(96,165,250,0.20)] sm:w-[200px]"
            />

            <span className="-mt-2 rounded-full border border-white/10 bg-black/20 px-4 py-1.5 text-xs font-bold text-white/55">
              نسخة تجريبية
            </span>
          </div>
        </header>

        {/* Main shell */}
        <section
          className="
            relative
            min-h-[720px]
            rounded-[36px]
            border
            border-purple-400/20
            bg-[#0c0617]/75
            px-6
            pb-6
            pt-7
            shadow-[0_35px_120px_rgba(0,0,0,0.38)]
            backdrop-blur-2xl
            sm:px-8
            lg:px-10
          "
        >
          {/* top subtle line */}
          <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/40 to-transparent" />

          {/* Hero */}
          <div className="text-center">
            <p className="text-sm font-black text-yellow-300/65">
              الوضع الرئيسي
            </p>

            <h1 className="mt-2 text-4xl font-black sm:text-5xl">
              🏆 تحدي الجلسة
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-base font-medium leading-8 text-white/55">
              اختر ألعابكم، سجلوا الفرق مرة وحدة، وكل جولة تقربكم من بطل الجلسة.
            </p>
          </div>

          {/* Session cards fan */}
          <div className="relative mx-auto mt-3 hidden h-[390px] max-w-[950px] lg:block">

            {/* floor glow */}
            <div className="pointer-events-none absolute bottom-4 left-1/2 h-20 w-[620px] -translate-x-1/2 rounded-full bg-purple-500/15 blur-[45px]" />

            <div className="absolute left-1/2 top-[48%]">

              {sessionCards.map((card, index) => {
                const active = hoveredCard === index;

                return (
                  <div
                    key={card.title}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="
                      absolute
                      left-1/2
                      top-1/2
                      cursor-pointer
                      transition-all
                      duration-300
                      ease-out
                    "
                    style={{
                      width: active ? 222 : 205,
                      height: active ? 316 : 292,

                      zIndex: active ? 50 : index + 1,

                      transform: `
                        translate(
                          calc(-50% + ${card.x}px),
                          calc(-50% + ${active ? card.y - 36 : card.y}px)
                        )
                        rotate(${active ? card.rotate * 0.35 : card.rotate}deg)
                        scale(${active ? card.scale * 1.08 : card.scale})
                      `,

                      filter: active
                        ? "drop-shadow(0 24px 30px rgba(0,0,0,.48)) drop-shadow(0 0 26px rgba(168,85,247,.26))"
                        : "drop-shadow(0 18px 20px rgba(0,0,0,.32))",
                    }}
                  >
                    <div
                      className={`
                        relative
                        h-full
                        w-full
                        overflow-hidden
                        rounded-[24px]
                        border
                        transition-all
                        duration-300
                        ${
                          active
                            ? "border-purple-200/70 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_0_30px_rgba(168,85,247,0.22)]"
                            : "border-yellow-200/35"
                        }
                      `}
                    >
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="230px"
                        className="object-cover"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/[0.03]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile/tablet posters */}
          <div className="mt-7 grid grid-cols-3 gap-3 lg:hidden">
            {sessionCards.slice(0, 6).map((card) => (
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

          {/* Start session */}
          <div className="-mt-1 flex justify-center lg:-mt-3">
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
                shadow-[0_12px_38px_rgba(250,204,21,0.24)]
                transition-all
                hover:-translate-y-1
                hover:shadow-[0_18px_48px_rgba(250,204,21,0.34)]
              "
            >
              ابدأ تحدي الجلسة
            </Link>
          </div>

          {/* Bottom quick section */}
          <div
            className="
              relative
              mt-6
              rounded-[28px]
              border
              border-purple-400/15
              bg-[#110a20]/80
              px-6
              py-5
              shadow-[0_20px_60px_rgba(0,0,0,0.22)]
              backdrop-blur-xl
            "
          >
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.4fr]">

              {/* Quick mode */}
              <div className="flex items-center gap-5 border-white/10 lg:border-l lg:pl-8">

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

                <div className="flex-1 text-right">
                  <p className="text-2xl font-black text-cyan-300">
                    لعبة سريعة
                  </p>

                  <p className="mt-1 text-sm font-medium text-white/45">
                    لعبة وحدة فقط، حدد الجولات وابدأ.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setShowQuickGames((current) => !current)
                    }
                    className="
                      mt-3
                      rounded-full
                      bg-gradient-to-r
                      from-cyan-400
                      to-blue-600
                      px-8
                      py-3
                      font-black
                      text-white
                      shadow-[0_10px_28px_rgba(14,165,233,0.22)]
                      transition
                      hover:-translate-y-0.5
                    "
                  >
                    {showQuickGames
                      ? "إخفاء الألعاب"
                      : "اختر لعبة سريعة"}
                  </button>
                </div>
              </div>

              {/* Little feature items */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-3xl">⏱️</div>
                  <p className="mt-2 font-black">
                    جولات سريعة
                  </p>
                  <p className="mt-1 text-xs text-white/35">
                    بدون انتظار
                  </p>
                </div>

                <div className="border-x border-white/10 text-center">
                  <div className="text-3xl">⭐</div>
                  <p className="mt-2 font-black">
                    تحديات متنوعة
                  </p>
                  <p className="mt-1 text-xs text-white/35">
                    كل لعبة مختلفة
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-3xl">👥</div>
                  <p className="mt-2 font-black">
                    لعب جماعي
                  </p>
                  <p className="mt-1 text-xs text-white/35">
                    مع أهلك وأصحابك
                  </p>
                </div>
              </div>
            </div>

            {/* Quick game popup */}
            {showQuickGames && (
              <div
                className="
                  absolute
                  bottom-[calc(100%+14px)]
                  left-0
                  right-0
                  z-[100]
                  rounded-[28px]
                  border
                  border-cyan-300/20
                  bg-[#0c0617]/95
                  p-5
                  shadow-[0_25px_80px_rgba(0,0,0,.55)]
                  backdrop-blur-2xl
                  animate-fade-in-up
                "
              >
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setShowQuickGames(false)
                    }
                    className="text-sm font-black text-white/45 transition hover:text-white"
                  >
                    ✕ إغلاق
                  </button>

                  <div className="text-right">
                    <p className="text-lg font-black">
                      اختر لعبة
                    </p>

                    <p className="text-xs font-bold text-white/35">
                      تبدأ مباشرة بالوضع السريع
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
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
                          shadow-[0_12px_30px_rgba(0,0,0,.3)]
                          transition-all
                          duration-300
                          group-hover:-translate-y-2
                          group-hover:border-cyan-300/50
                          group-hover:shadow-[0_18px_38px_rgba(34,211,238,.12)]
                        "
                      >
                        <Image
                          src={game.image}
                          alt={game.title}
                          fill
                          sizes="160px"
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
