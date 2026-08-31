'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const games = [
  {
    image: "/images/posters/Wheelgame.jpg",
    title: "لف وخمن",
    how: [
      "لف العجلة وشف وش تطلع لك",
      "اختر حرف تتوقع إنه موجود بالكلمة",
      "إذا الحرف موجود تاخذ قيمة العجلة",
      "وإذا الحرف مكرر، تاخذ النقاط على كل مرة ظهر فيها",
      "إذا الحرف مو موجود، يروح الدور للفريق الثاني",
      "انتبه للإفلاس وتخطي الدور 👀",
    ],
    example:
      "طلعت لك 300 واخترت حرف موجود مرتين؟ تاخذ 600 نقطة.",
  },

  {
    image: "/images/posters/wordgame.jpg",
    title: "خمن الكلمة",
    how: [
      "كل مرة يكون الدور على فريق",
      "دخلوا كلمة من 5 حروف وحاولوا تعرفون الكلمة المطلوبة",
      "بعد كل محاولة بتطلع لكم ألوان تساعدكم",
      "الأخضر يعني الحرف صح ومكانه صح",
      "الأصفر يعني الحرف موجود بس مكانه غلط",
      "الرمادي يعني الحرف مو موجود بالكلمة",
      "بعد كل محاولة يروح الدور للفريق الثاني",
      "أول فريق يجيب الكلمة الصح يفوز بالجولة",
    ],
    example:
      "الحرف الأخضر خلاص عرفتم مكانه، والأصفر موجود بس جرّبوه بمكان ثاني.",
  },

  {
    image: "/images/posters/Quizgame.jpg",
    title: "أسئلة وأجوبة",
    how: [
      "كل سؤال يبدأ فيه فريق",
      "حاولوا تجاوبون قبل ما يخلص الوقت",
      "إذا راحت الفرصة، الفريق الثاني ياخذ فرصة ثانية",
      "تقدرون تستخدمون المساعدة وتطلعون الخيارات",
      "بعد ما تطلع الإجابة، صاحب الجلسة يحدد مين جاوب صح",
      "كل إجابة صح تحسب نقطة",
    ],
  },

  {
    image: "/images/posters/Proverbgame.jpg",
    title: "خمن المثل",
    how: [
      "بيطلع لكم لغز يمثل مثل معروف",
      "الفريق اللي عليه الدور يحاول يعرف المثل",
      "إذا راحت الفرصة، ينتقل الدور للفريق الثاني",
      "بعدها تطلع الإجابة",
      "وصاحب الجلسة يحدد مين جاوب صح",
    ],
  },

  {
    image: "/images/posters/Whogame.jpg",
    title: "منهو ذا؟",
    how: [
      "بيطلع لكم QR Code لشخصية",
      "واحد يمسح الكود ويشوف الشخصية بدون ما يوري الباقين",
      "يوصف الشخصية بدون ما يقول اسمها",
      "الفريق اللي عليه الدور يحاول يعرف منهو",
      "بعد ما تخلص المحاولة، تطلع الشخصية على الشاشة",
      "صاحب الجلسة يحدد إذا التخمين كان صح أو لا",
      "بعدها يجي دور الفريق الثاني بشخصية ثانية",
    ],
    example:
      "طلعت لك شخصية معروفة؟ وصف شغلها أو شكلها أو شيء مشهورة فيه، بس لا تقول اسمها.",
  },

  {
    image: "/images/posters/Categoriesgame.jpg",
    title: "إنسان حيوان نبات جماد بلاد",
    how: [
      "بيطلع حرف واحد للفريقين",
      "كل فريق يفكر بإنسان وحيوان ونبات وجماد وبلاد بنفس الحرف",
      "إذا خلص فريق، يضغط صاحب الجلسة إنه خلص",
      "اللعبة تسجل وقت كل فريق",
      "بعد ما يخلصون، راجعوا الإجابات",
      "إذا إجابات الفريقين صح، الأسرع هو اللي يفوز",
      "وصاحب الجلسة يحدد الفائز بالجولة",
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
    <main className="min-h-screen px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black text-cyan-300/60">
              تعرف على الألعاب
            </p>

            <h1 className="mt-1 text-3xl font-black sm:text-4xl">
              🎮 طريقة اللعب
            </h1>

            <p className="mt-2 text-sm font-bold text-white/40">
              اضغط على أي بطاقة وشوف شرح اللعبة
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
              py-3
              text-sm
              font-black
              text-white
              shadow-[0_0_22px_rgba(17,157,255,.18)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_0_30px_rgba(17,157,255,.28)]
            "
          >
            🏠 الرئيسية
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game, index) => {
            const flipped =
              flippedCard === index;

            return (
              <button
                key={game.title}
                type="button"
                onClick={() =>
                  toggleCard(index)
                }
                aria-label={
                  flipped
                    ? `الرجوع إلى بوستر ${game.title}`
                    : `عرض شرح ${game.title}`
                }
                className="
                  group
                  relative
                  h-[500px]
                  w-full
                  cursor-pointer
                  text-right
                  outline-none
                  [perspective:1400px]
                  focus-visible:ring-2
                  focus-visible:ring-cyan-300
                  focus-visible:ring-offset-4
                  focus-visible:ring-offset-[#080411]
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
                  {/* ====================== */}
                  {/* FRONT — Poster */}
                  {/* ====================== */}

                  <div
                    className="
                      absolute
                      inset-0
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-white/10
                      bg-[#10081d]
                      shadow-[0_20px_50px_rgba(0,0,0,.3)]
                      transition-all
                      duration-500
                      [backface-visibility:hidden]

                      group-hover:-translate-y-1
                      group-hover:border-purple-300/30
                      group-hover:shadow-[0_26px_60px_rgba(0,0,0,.38)]
                    "
                  >
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.025]
                      "
                    />

                    {/* subtle bottom gradient */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                    {/* Flip hint */}
                    <div
                      className="
                        absolute
                        inset-x-4
                        bottom-4
                        flex
                        items-center
                        justify-between
                        gap-3
                        rounded-2xl
                        border
                        border-white/10
                        bg-black/55
                        px-4
                        py-3
                        backdrop-blur-xl
                      "
                    >
                      <div>
                        <p className="font-black text-white">
                          {game.title}
                        </p>

                        <p className="mt-0.5 text-xs font-bold text-white/45">
                          اضغط وشوف طريقة اللعب
                        </p>
                      </div>

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-cyan-300/20
                          bg-cyan-400/10
                          text-lg
                          text-cyan-100
                          transition-transform
                          duration-500
                          group-hover:rotate-12
                        "
                      >
                        ↻
                      </div>
                    </div>
                  </div>

                  {/* ====================== */}
                  {/* BACK — Guide */}
                  {/* ====================== */}

                  <div
                    className="
                      absolute
                      inset-0
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-cyan-300/20
                      bg-gradient-to-b
                      from-[#161027]
                      via-[#10091e]
                      to-[#0b0715]
                      p-5
                      shadow-[0_20px_60px_rgba(0,0,0,.4)]
                      [backface-visibility:hidden]
                    "
                    style={{
                      transform:
                        "rotateY(180deg)",
                    }}
                  >
                    {/* Back glow */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-400/10 blur-[80px]" />

                    <div className="relative flex h-full flex-col">
                      {/* Back header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black text-cyan-300/60">
                            طريقة اللعب
                          </p>

                          <h2 className="mt-1 text-2xl font-black">
                            {game.title}
                          </h2>
                        </div>

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/10
                            bg-white/[0.05]
                            text-lg
                          "
                        >
                          ↻
                        </div>
                      </div>

                      {/* Steps */}
                      <div className="mt-4 flex-1 space-y-2">
                        {game.how.map(
                          (step, stepIndex) => (
                            <div
                              key={
                                stepIndex
                              }
                              className="
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-white/[0.06]
                                bg-white/[0.035]
                                px-3
                                py-2.5
                              "
                            >
                              <div
                                className="
                                  flex
                                  h-6
                                  w-6
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  border
                                  border-cyan-300/15
                                  bg-cyan-400/10
                                  text-[11px]
                                  font-black
                                  text-cyan-100
                                "
                              >
                                {stepIndex +
                                  1}
                              </div>

                              <p className="pt-0.5 text-sm font-bold leading-6 text-white/75">
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
                            mt-3
                            rounded-xl
                            border
                            border-yellow-300/15
                            bg-yellow-300/[0.06]
                            px-3
                            py-2.5
                          "
                        >
                          <p className="text-xs font-black text-yellow-200/75">
                            مثال
                          </p>

                          <p className="mt-1 text-xs font-bold leading-5 text-white/65">
                            {
                              game.example
                            }
                          </p>
                        </div>
                      )}

                      {/* Return */}
                      <div className="mt-3 text-center text-[11px] font-bold text-white/30">
                        اضغط مرة ثانية عشان ترجع للبوستر
                      </div>
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
