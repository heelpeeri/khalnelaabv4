'use client';

import Link from "next/link";

const games = [
  {
    icon: "🎡",
    title: "لف وخمن",
    how: [
      "لف العجلة وبتطلع لك قيمة مثل 300",
      "اختر حرف من الكلمة",
      "إذا الحرف موجود تاخذ النقاط",
      "إذا طلع أكثر من مرة تاخذ النقاط على كل حرف",
      "إذا الحرف غلط ينتقل الدور للفريق الثاني",
    ],
    example:
      "مثال: طلعت لك 300 والكلمة (كمبيوتر)، اخترت م ثم ي = صار عندك 600",
  },

  {
    icon: "💬",
    title: "خمن الكلمة",
    how: [
      "ابدأ وخمن الكلمة",
      "بعد كل محاولة بتطلع لك ألوان تساعدك",
      "الأخضر يعني الحرف صح وبمكانه الصح",
      "الأصفر يعني الحرف موجود لكن بمكان ثاني",
      "الرمادي يعني الحرف مو موجود",
      "إذا خلصت المحاولات تروح الفرصة للفريق الثاني",
    ],
    example:
      "مثال: إذا الكلمة (تفاح) وخمنت (تمور) بتشوف وش صح ووش غلط",
  },

  {
    icon: "❓",
    title: "الأسئلة",
    how: [
      "الفريق الأول يبدأ وعنده 30 ثانية",
      "إذا ما جاوب تروح الفرصة للفريق الثاني",
      "الفريق الثاني عنده 10 ثواني",
      "بعدها تظهر الإجابة وصاحب الجلسة يحدد الفائز",
    ],
  },

  {
    icon: "✏️",
    title: "خمن المثل",
    how: [
      "بيطلع لك مثل بإيموجيز",
      "حاول تعرف وش المثل",
      "إذا ما جاوبت تروح الفرصة للفريق الثاني",
      "صاحب الجلسة يحدد الفائز",
    ],
  },

  {
    icon: "🧩",
    title: "حروف بالخلاط",
    how: [
      "بتطلع كلمة حروفها مخربطة",
      "رتب الحروف بأسرع وقت",
      "أول فريق يعرفها ياخذ النقطة",
    ],
  },

  {
    icon: "🌍",
    title: "إنسان حيوان نبات جماد بلاد",
    how: [
      "بيطلع حرف للجميع",
      "كل فريق يكتب بجهازه",
      "إذا خلصت قول لصاحب الجلسة",
      "إذا الفريقين كلهم صح يفوز الأسرع",
    ],
  },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-4xl font-black">🎮 طريقة اللعب</h1>

          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-[#119DFF] to-[#7A5CFF] px-6 py-3 font-black text-white"
          >
            🏠 الرئيسية
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {games.map((game) => (
            <div
              key={game.title}
              className="rounded-[32px] border border-purple-500/30 bg-black/20 p-8 backdrop-blur-xl"
            >
              <h2 className="text-3xl font-black">
                {game.icon} {game.title}
              </h2>

              <div className="mt-6 space-y-3">
                {game.how.map((step, index) => (
                  <div key={index} className="rounded-xl bg-white/5 p-3">
                    {index + 1}. {step}
                  </div>
                ))}
              </div>

              {game.example && (
                <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4">
                  <p className="font-black text-cyan-300">مثال:</p>
                  <p className="mt-2 text-white/90">{game.example}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
