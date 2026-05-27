'use client';

import Link from "next/link";

const games = [
  {
    icon: "🎡",
    title: "لف وخمن",
    how: [
      "لف العجلة",
      "تظهر لك قيمة مثل 300",
      "اختر حرف",
      "إذا كان الحرف موجود تحصل على النقاط",
      "إذا ظهر الحرف أكثر من مرة تحصل على القيمة لكل حرف",
      "إذا كان الحرف غير موجود ينتقل الدور للفريق الثاني",
    ],
    example:
      "مثال: القيمة 300 والكلمة (كمبيوتر)، اخترت حرف م = +300 ثم حرف ي = +300، المجموع = 600",
  },
  {
    icon: "💬",
    title: "خمن الكلمة",
    how: [
      "الفريق الأول يبدأ التخمين",
      "بعد كل محاولة تظهر ألوان الحروف",
      "الأخضر = حرف صحيح ومكان صحيح",
      "الأصفر = موجود لكن بمكان مختلف",
      "الرمادي = غير موجود",
      "إذا انتهت المحاولات تنتقل الفرصة",
    ],
    example: "مثال: كلمة (تفاح) وخمنت (تمور)، ستظهر الحروف الصحيحة والخاطئة.",
  },
  {
    icon: "❓",
    title: "الأسئلة",
    how: [
      "الفريق الأول يبدأ",
      "لديه 30 ثانية",
      "إذا لم يجاوب يحصل الفريق الثاني على فرصة",
      "الفريق الثاني لديه 10 ثوانٍ",
      "بعدها تظهر الإجابة",
      "الحكم يحدد من أخذ النقطة",
    ],
  },
  {
    icon: "✏️",
    title: "خمن المثل",
    how: [
      "يظهر مثل باستخدام إيموجيز",
      "الفريق يحاول التخمين",
      "إذا انتهى الوقت يحصل الفريق الثاني على فرصة",
      "الفريق الصحيح يحصل على نقطة",
    ],
  },
  {
    icon: "🧩",
    title: "حروف بالخلاط",
    how: [
      "تظهر كلمة بحروف غير مرتبة",
      "حاول ترتيب الحروف",
      "الفريق الأسرع يحصل على النقطة",
    ],
  },
  {
    icon: "🌍",
    title: "إنسان حيوان نبات جماد بلاد",
    how: [
      "يظهر حرف معين",
      "كل فريق يسجل الإجابات على جهازه",
      "بعد الانتهاء يبلغ الفريق صاحب الجلسة",
      "إذا كانت إجابات الفريقين صحيحة",
      "الفائز هو الأسرع",
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
