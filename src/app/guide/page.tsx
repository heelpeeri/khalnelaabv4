"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HOW_TO_PLAY as games } from "@/data/howToPlay";

export default function GuidePage() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  function toggleCard(index: number) {
    setFlippedCard((current) => (current === index ? null : index));
  }

  return (
    <main className="min-h-[100dvh] px-4 py-3 text-white sm:px-6 lg:h-[100dvh] lg:overflow-hidden">
      <div className="mx-auto flex h-full max-w-7xl flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 pb-3">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">🎮 طريقة اللعب</h1>

            <p className="mt-1 text-sm font-bold text-white/50">
              اضغطوا على اللعبة وتنقلب لكم
            </p>
          </div>

          <Link href="/" className="nav-pill shrink-0">
            <span aria-hidden="true">🏠</span>
            الرئيسية
          </Link>
        </header>

        <div
          className="
            grid
            grid-cols-1
            place-items-center
            gap-4
            pb-4
            min-[480px]:grid-cols-2
            lg:min-h-0
            lg:flex-1
            lg:grid-cols-4
            lg:grid-rows-2
            lg:pb-0
          "
        >
          {games.map((game, index) => {
            const flipped = flippedCard === index;

            return (
              <button
                key={game.title}
                type="button"
                onClick={() => toggleCard(index)}
                aria-label={
                  flipped ? `الرجوع إلى ${game.title}` : `عرض شرح ${game.title}`
                }
                className="
                  group
                  relative
                  aspect-[4/5]
                  w-full
                  max-w-[340px]
                  cursor-pointer
                  rounded-[20px]
                  lg:h-full
                  lg:max-h-full
                  lg:w-auto
                  lg:max-w-full
                  text-right
                  outline-none
                  [perspective:1400px]
                  focus-visible:ring-2
                  focus-visible:ring-cyan-300
                "
              >
                <div
                  className="
                    relative
                    h-full
                    w-full
                    transition-transform
                    duration-700
                    [transform-style:preserve-3d]
                  "
                  style={{
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div
                    className="
                      absolute
                      inset-0
                      overflow-hidden
                      rounded-[20px]
                      bg-[#10081d]
                      shadow-[0_14px_35px_rgba(0,0,0,.28)]
                      transition-all
                      duration-500
                      [backface-visibility:hidden]
                      group-hover:-translate-y-1
                      group-hover:shadow-[0_20px_44px_rgba(0,0,0,.36)]
                    "
                  >
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      sizes="(min-width: 1024px) 240px, 25vw"
                      className="
                        object-contain
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.01]
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        bottom-3
                        left-3
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/10
                        bg-black/45
                        text-xs
                        text-white/60
                        opacity-65
                        transition-all
                        duration-300
                        group-hover:opacity-100
                      "
                    >
                      ↻
                    </div>
                  </div>

                  <div
                    className="
                      absolute
                      inset-0
                      overflow-hidden
                      rounded-[20px]
                      border
                      border-cyan-300/20
                      bg-gradient-to-b
                      from-[#161027]
                      via-[#10091e]
                      to-[#0b0715]
                      p-4
                      shadow-[0_16px_44px_rgba(0,0,0,.4)]
                      [backface-visibility:hidden]
                    "
                    style={{
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="relative flex h-full flex-col">
                      <div className="flex shrink-0 items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-black text-cyan-300/70">
                            طريقة اللعب
                          </p>

                          <h2 className="mt-0.5 text-lg font-black xl:text-xl">
                            {game.title}
                          </h2>
                        </div>

                        <div
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/10
                            bg-white/[0.05]
                            text-sm
                          "
                        >
                          ↻
                        </div>
                      </div>

                      <div className="mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto">
                        {game.how.map((step, stepIndex) => (
                          <div
                            key={stepIndex}
                            className="
                              flex
                              items-start
                              gap-2
                              rounded-lg
                              border
                              border-white/[0.05]
                              bg-white/[0.035]
                              px-2.5
                              py-1.5
                            "
                          >
                            <div
                              className="
                                flex
                                h-5
                                w-5
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-cyan-400/10
                                text-[9px]
                                font-black
                                text-cyan-100
                              "
                            >
                              {stepIndex + 1}
                            </div>

                            <p className="text-xs font-bold leading-5 text-white/80 lg:text-[11px] lg:leading-[17px] xl:text-xs xl:leading-[19px]">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>

                      {game.example && (
                        <div
                          className="
                            mt-2
                            shrink-0
                            rounded-lg
                            border
                            border-yellow-300/15
                            bg-yellow-300/[0.06]
                            px-2.5
                            py-2
                          "
                        >
                          <span className="text-xs font-bold leading-5 text-yellow-50/75 lg:text-[11px] lg:leading-4 xl:text-xs">
                            {game.example}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
