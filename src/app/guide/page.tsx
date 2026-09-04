'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const games = [
  {
    image: "/images/posters/Wheelgame.png",
    title: "لف وخمن",
    how: [
      "لف العجلة وشف وش تطلع لك",
      "اختر حرف تتوقع إنه موجود بالكلمة",
      "إذا الحرف موجود تاخذ قيمة العجلة",
      "إذا الحرف مكرر، تاخذ النقاط على كل مرة ظهر فيها",
      "إذا الحرف مو موجود، يروح الدور للفريق الثاني",
      "انتبه للإفلاس وتخطي الدور",
    ],
    example:
      "طلعت لك 300 واخترت حرف موجود مرتين؟ تاخذ 600 نقطة.",
  },

  {
    image: "/images/posters/wordgame.png",
    title: "خمن الكلمة",
    how: [
      "كل مرة يكون الدور على فريق",
      "اكتبوا كلمة من 5 حروف",
      "الأخضر: الحرف صح ومكانه صح",
      "الأصفر: الحرف موجود بس بمكان ثاني",
      "الرمادي: الحرف مو موجود",
      "بعد كل محاولة يروح الدور للفريق الثاني",
      "أول فريق يجيب الكلمة يفوز",
    ],
  },

  {
    image: "/images/posters/Quizgame.png",
    title: "أسئلة وأجوبة",
    how: [
      "كل سؤال يبدأ فيه فريق",
      "جاوبوا قبل ما يخلص الوقت",
      "إذا راحت الفرصة، الفريق الثاني يحاول",
      "تقدرون تستخدمون المساعدة وتطلعون الخيارات",
      "بعد ظهور الإجابة، حددوا مين جاوب صح",
      "كل إجابة صح تحسب نقطة",
    ],
  },

  {
    image: "/images/posters/Proverbgame.png",
    title: "خمن المثل",
    how: [
      "بيطلع لكم لغز يمثل مثل معروف",
      "الفريق اللي عليه الدور يحاول يعرف المثل",
      "إذا ما جاوب، تروح الفرصة للفريق الثاني",
      "بعدها تطلع الإجابة",
      "حددوا مين جاوب صح",
    ],
  },

  {
    image: "/images/posters/Whogame.png",
    title: "منهو ذا؟",
    how: [
      "بيطلع QR Code لشخصية",
      "واحد يمسحه ويشوف الشخصية بدون ما يوري الباقين",
      "يوصف الشخصية بدون ما يقول اسمها",
      "الفريق يحاول يعرف منهو",
      "بعد المحاولة تطلع الشخصية على الشاشة",
      "حددوا إذا التخمين صح أو لا",
      "بعدها يجي دور الفريق الثاني",
    ],
  },

  {
    image: "/images/posters/Categoriesgame.png",
    title: "إنسان حيوان نبات جماد بلاد",
    how: [
      "بيطلع حرف واحد للفريقين",
      "كل فريق يفكر بإجابة لكل تصنيف بنفس الحرف",
      "إذا خلص فريق، يسجل صاحب الجلسة إنه خلص",
      "اللعبة تسجل وقت كل فريق",
      "بعدها راجعوا الإجابات",
      "إذا الفريقين صح، الأسرع يفوز",
      "صاحب الجلسة يحدد الفائز",
    ],
  },
];

export default function GuidePage() {
  const [flippedCard, setFlippedCard] =
    useState<number | null>(null);

  function toggleCard(index: number) {
    setFlippedCard((current) =>
      current === index ? null : index
    );
  }

  return (
    <main className="h-[100dvh] overflow-hidden px-4 py-3 text-white sm:px-6">
      <div className="mx-auto flex h-full max-w-6xl flex-col">

        {/* Header */}
        <header className="flex shrink-0 items-center justify-between gap-4 pb-3">
          <div>
            <h1 className="text-3xl font-black">
              🎮 طريقة اللعب
            </h1>

            <p className="mt-1 text-sm font-bold text-white/45">
              اضغط على أي بطاقة لقلبها وشوف الشرح
            </p>
          </div>

          <Link
            href="/"
            className="
              rounded-full
              border
              border-cyan-300/25
              bg-gradient-to-r
              from-[#119DFF]
              to-[#7A5CFF]
              px-5
              py-2.5
              text-sm
              font-black
              text-white
              shadow-[0_0_20px_rgba(17,157,255,.16)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_0_28px_rgba(17,157,255,.25)]
            "
          >
            🏠 الرئيسية
          </Link>
        </header>

        {/* Cards */}
        <div
          className="
            grid
            min-h-0
            flex-1
            grid-cols-3
            grid-rows-2
            gap-3
          "
        >
          {games.map((game, index) => {
            const flipped =
              flippedCard === index;

            return (
              <button
                key={game.title}
                type="button"
                onClick={() => toggleCard(index)}
                aria-label={
                  flipped
                    ? `الرجوع إلى ${game.title}`
                    : `عرض شرح ${game.title}`
                }
                className="
                  group
                  relative
                  min-h-0
                  w-full
                  cursor-pointer
                  text-right
                  outline-none
                  [perspective:1400px]
                  focus-visible:ring-2
                  focus-visible:ring-cyan-300
                "
              >
                {/* Flip wrapper */}
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
                    transform: flipped
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
                    transitionTimingFunction:
                      "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {/* FRONT */}
                  <div
                    className="
                      absolute
                      inset-0
                      overflow-hidden
                      rounded-[24px]
                      border
                      border-white/10
                      bg-[#10081d]
                      shadow-[0_16px_40px_rgba(0,0,0,.30)]
                      transition-all
                      duration-500
                      [backface-visibility:hidden]

                      group-hover:-translate-y-1
                      group-hover:border-purple-300/30
                      group-hover:shadow-[0_22px_50px_rgba(0,0,0,.38)]
                    "
                  >
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      sizes="33vw"
                      className="
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.02]
                      "
                    />

                    {/* فقط إشارة Flip بسيطة */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        bottom-3
                        left-3
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/10
                        bg-black/45
                        text-sm
                        text-white/60
                        opacity-60
                        backdrop-blur-lg
                        transition-all
                        duration-300
                        group-hover:opacity-100
                      "
                    >
                      ↻
                    </div>
                  </div>

                  {/* BACK */}
                  <div
                    className="
                      absolute
                      inset-0
                      overflow-hidden
                      rounded-[24px]
                      border
                      border-cyan-300/20
                      bg-gradient-to-b
                      from-[#161027]
                      via-[#10091e]
                      to-[#0b0715]
                      p-4
                      shadow-[0_18px_50px_rgba(0,0,0,.4)]
                      [backface-visibility:hidden]
                    "
                    style={{
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {/* Glow */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-[75px]" />

                    <div className="relative flex h-full flex-col">
                      {/* Header */}
                      <div className="flex shrink-0 items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black text-cyan-300/55">
                            طريقة اللعب
                          </p>

                          <h2 className="mt-0.5 text-xl font-black">
                            {game.title}
                          </h2>
                        </div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-sm">
                          ↻
                        </div>
                      </div>

                      {/* Steps */}
                      <div className="mt-3 flex-1 space-y-1.5">
                        {game.how.map(
                          (step, stepIndex) => (
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

                              <p className="text-[11px] font-bold leading-[18px] text-white/75">
                                {step}
                              </p>
                            </div>
                          )
                        )}
                      </div>

                      {/* Example */}
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
                          <span className="text-[10px] font-black text-yellow-200/70">
                            مثال:
                          </span>

                          <span className="mr-2 text-[10px] font-bold leading-4 text-white/60">
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
