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

export default function Home() {
  const [showQuickCards, setShowQuickCards] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 text-white sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-purple-600/15 blur-[130px]" />

        <div className="absolute -left-40 top-[35%] h-[420px] w-[420px] rounded-full bg-fuchsia-600/10 blur-[130px]" />

        <div className="absolute -right-40 top-[25%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* Logo */}
        <header className="flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="خل نلعب"
            width={300}
            height={200}
            priority
            className="h-auto w-[190px] drop-shadow-[0_0_28px_rgba(59,130,246,0.18)] sm:w-[215px]"
          />

          <div className="mt-5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/50 backdrop-blur-xl">
            نسخة تجريبية
          </div>
        </header>

        {/* Main modes */}
        <section className="mt-14 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

          {/* Session Mode */}
          <div className="group relative overflow-hidden rounded-[36px] border border-purple-400/20 bg-[#10061d]/80 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl">

            {/* subtle highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent" />

            <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[100px]" />

            <div className="grid min-h-[440px] items-center gap-8 p-7 md:grid-cols-[1fr_0.9fr] md:p-10">

              {/* Text */}
              <div className="order-2 text-right md:order-1">
                <p className="text-sm font-black tracking-wide text-yellow-300/75">
                  الوضع الرئيسي
                </p>

                <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                  تحدي الجلسة
                </h1>

                <p className="mt-5 max-w-xl text-base font-medium leading-8 text-white/60 sm:text-lg">
                  اختر الألعاب اللي تبيها، سجل أسماء الفرق مرة وحدة،
                  وخلو كل جولة تحدد مين بيطلع بطل الجلسة.
                </p>

                <div className="mt-7 flex flex-wrap justify-end gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/55">
                    أكثر من لعبة
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/55">
                    نقاط وجولات
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/55">
                    فائز بالنهاية
                  </span>
                </div>

                <div className="mt-9 flex justify-end">
                  <Link
                    href="/match?mode=session"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-yellow-200/40
                      bg-gradient-to-r
                      from-yellow-300
                      to-amber-400
                      px-9
                      py-4
                      text-base
                      font-black
                      text-[#211200]
                      shadow-[0_12px_40px_rgba(250,204,21,0.22)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-[0_16px_50px_rgba(250,204,21,0.32)]
                    "
                  >
                    ابدأ تحدي الجلسة
                  </Link>
                </div>
              </div>

              {/* Poster stack */}
              <div className="order-1 flex items-center justify-center md:order-2">
                <div className="relative h-[300px] w-[250px] sm:h-[330px] sm:w-[280px]">

                  <div className="absolute left-1/2 top-1/2 h-[240px] w-[180px] -translate-x-[110%] -translate-y-1/2 -rotate-6 overflow-hidden rounded-[22px] border border-white/10 opacity-55 shadow-2xl transition duration-500 group-hover:-translate-x-[115%] group-hover:-rotate-8">
                    <Image
                      src="/images/posters/Whogame.jpg"
                      alt="منهو ذا"
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute left-1/2 top-1/2 z-20 h-[280px] w-[205px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.45)] transition duration-500 group-hover:-translate-y-[52%]">
                    <Image
                      src="/images/posters/Wheelgame.jpg"
                      alt="لف وخمن"
                      fill
                      sizes="205px"
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute left-1/2 top-1/2 h-[240px] w-[180px] translate-x-[10%] -translate-y-1/2 rotate-6 overflow-hidden rounded-[22px] border border-white/10 opacity-55 shadow-2xl transition duration-500 group-hover:translate-x-[15%] group-hover:rotate-8">
                    <Image
                      src="/images/posters/wordgame.jpg"
                      alt="خمن الكلمة"
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                  </div>

                  <div className="pointer-events-none absolute bottom-1 left-1/2 h-14 w-52 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Mode */}
          <div
            className={`
              relative
              overflow-hidden
              rounded-[36px]
              border
              border-cyan-400/15
              bg-[#0b091a]/80
              shadow-[0_30px_100px_rgba(0,0,0,0.3)]
              backdrop-blur-2xl
              transition-all
              duration-500
              ${
                showQuickCards
                  ? "xl:row-span-2"
                  : ""
              }
            `}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />

            <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-[100px]" />

            <div className="relative p-7 sm:p-9">
              <p className="text-sm font-black text-cyan-300/65">
                الوضع السريع
              </p>

              <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                لعبة سريعة
              </h2>

              <p className="mt-4 text-base font-medium leading-8 text-white/55">
                لعبة وحدة، كم جولة، وتبدأون على طول.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowQuickCards(
                    (current) => !current
                  )
                }
                className="
                  mt-8
                  w-full
                  rounded-full
                  border
                  border-cyan-300/25
                  bg-gradient-to-r
                  from-cyan-400
                  to-blue-600
                  px-8
                  py-4
                  font-black
                  text-white
                  shadow-[0_12px_38px_rgba(14,165,233,0.22)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_16px_48px_rgba(14,165,233,0.32)]
                "
              >
                {showQuickCards
                  ? "إخفاء الألعاب"
                  : "اختر لعبة سريعة"}
              </button>

              {/* Game posters */}
              <div
                className={`
                  grid
                  overflow-hidden
                  transition-all
                  duration-500
                  ${
                    showQuickCards
                      ? "mt-7 max-h-[1200px] grid-cols-2 gap-3 opacity-100"
                      : "max-h-0 gap-0 opacity-0"
                  }
                `}
              >
                {quickGames.map((game) => (
                  <Link
                    key={game.title}
                    href={game.href}
                    className="group/game"
                  >
                    <div
                      className="
                        relative
                        aspect-[3/4]
                        overflow-hidden
                        rounded-[22px]
                        border
                        border-white/10
                        bg-white/[0.03]
                        shadow-[0_14px_35px_rgba(0,0,0,0.25)]
                        transition-all
                        duration-300
                        group-hover/game:-translate-y-1
                        group-hover/game:border-cyan-300/35
                        group-hover/game:shadow-[0_18px_45px_rgba(34,211,238,0.10)]
                      "
                    >
                      <Image
                        src={game.image}
                        alt={game.title}
                        fill
                        sizes="(max-width: 640px) 45vw, 200px"
                        className="object-cover transition-transform duration-500 group-hover/game:scale-[1.035]"
                      />

                      {/* polish overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/[0.025]" />

                      <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-inset ring-white/[0.04]" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Guide */}
          <Link
            href="/guide"
            className="
              group
              relative
              overflow-hidden
              rounded-[30px]
              border
              border-white/10
              bg-white/[0.035]
              p-6
              shadow-[0_20px_60px_rgba(0,0,0,0.22)]
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-purple-300/25
              xl:col-start-1
            "
          >
            <div className="pointer-events-none absolute -left-12 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[60px]" />

            <div className="relative flex items-center justify-between gap-5">
              <div className="text-right">
                <p className="text-sm font-black text-purple-300/60">
                  أول مرة تلعب؟
                </p>

                <h3 className="mt-1 text-2xl font-black">
                  طريقة اللعب
                </h3>

                <p className="mt-2 text-sm font-medium text-white/45">
                  شرح سريع لكل لعبة قبل ما تبدأون.
                </p>
              </div>

              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-purple-300/20
                  bg-purple-500/10
                  text-2xl
                  transition
                  group-hover:scale-105
                "
              >
                🎮
              </div>
            </div>
          </Link>
        </section>

        <footer className="pb-3 pt-10 text-center text-xs font-bold text-white/20">
          خل نلعب
        </footer>
      </div>
    </main>
  );
}
