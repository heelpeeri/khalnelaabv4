'use client';

import { useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

function WordGame() {
  const rows = Array.from({ length: 6 });

  return (
    <GlassCard className="p-6">
      <h2 className="text-2xl font-black">وشي الكلمة؟</h2>
      <p className="mt-2 text-white/80">نسخة MVP: واجهة أولية للكلمة الجماعية.</p>

      <div className="mt-6 grid gap-2">
        {rows.map((_, i) => (
          <div key={i} className="flex justify-center gap-2">
            {Array.from({ length: 5 }).map((_, j) => (
              <div
                key={j}
                className="h-12 w-12 rounded-2xl border border-white/25 bg-white/10"
              />
            ))}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function DrawGame() {
  const puzzles = [
    { emoji: "🐒👩🦌", answer: "القرد في عين امه غزال" },
    { emoji: "🪢🤥⏳", answer: "حبل الكذب قصير" },
    { emoji: "👊😭🏃🗣️", answer: "ضربني وبكى سبقني واشتكى" },
    { emoji: "🐦✋🔟🌳", answer: "طير باليد ولا عشره بالشجره" },
    { emoji: "🚪💨🔒😌", answer: "الباب اللي يجي منه ريح سده واستريح" },
    { emoji: "🦵📏🛏️", answer: "مد رجلك على قد لحافك" },
    { emoji: "👤🍯👅❌", answer: "اذا كان صاحبك عسل لا تلحسه كله" },
    { emoji: "🌴📏🐐🧠", answer: "الطول طول نخله والعقل عقل صخله" },
    { emoji: "👁️😒🪵", answer: "عين الحسود فيها عود" },
    { emoji: "🍇🙅‍♂️😖", answer: "اللي ما يطول العنب حامض عنه يقول" },
    { emoji: "🦅🤷‍♂️🔥🍗", answer: "اللي ما يعرف الصقر يشويه" },
    { emoji: "❤️👁️❌", answer: "الحب اعمى" },
    { emoji: "😴👑", answer: "النوم سلطان" },
    { emoji: "✋❌👏", answer: "يد وحده ما تصفق" },
    { emoji: "👅🐎", answer: "لسانك حصانك" },
    { emoji: "❓👨‍🔧✔️👨‍⚕️❌", answer: "اسال مجرب ولا تسال طبيب" },
    { emoji: "🔥➡️💨😡", answer: "لا تشب النار وتزعل من دخانها" },
  ];

  const ROUND_TIME = 12;

  const [index, setIndex] = useState(
    Math.floor(Math.random() * puzzles.length)
  );
  const current = useMemo(() => puzzles[index], [index]);

  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed) return;

    if (timeLeft <= 0) {
      setRevealed(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, revealed]);

  function nextPuzzle() {
    let nextIndex = Math.floor(Math.random() * puzzles.length);

    if (puzzles.length > 1) {
      while (nextIndex === index) {
        nextIndex = Math.floor(Math.random() * puzzles.length);
      }
    }

    setIndex(nextIndex);
    setTimeLeft(ROUND_TIME);
    setRevealed(false);
  }

  return (
    <GlassCard className="p-6 text-center">
      <h2 className="text-2xl font-black">خمن المثل من الإيموجي</h2>
      <p className="mt-2 text-white/80">
        شوف الإيموجي، انتظر انتهاء الوقت، وبعدها تظهر الإجابة
      </p>

      <div className="mt-5 flex items-center justify-center gap-3">
        <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-red-500">
          الوقت: {timeLeft}
        </div>
      </div>

      <div className="mt-8 text-6xl">
        {current.emoji}
      </div>

      {!revealed && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-white/80">
          انتظر لين يخلص الوقت ⏳
        </div>
      )}

      {revealed && (
        <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-5">
          <p className="text-sm text-white/70">الإجابة الصحيحة</p>
          <p className="mt-2 text-2xl font-black">{current.answer}</p>
        </div>
      )}

      <div className="mt-6">
        <button
          type="button"
          onClick={nextPuzzle}
          className="rounded-full bg-white px-6 py-3 font-bold text-red-500 transition hover:scale-105"
        >
          التالي
        </button>
      </div>
    </GlassCard>
  );
}

function CategoriesGame() {
  const fields = ["إنسان", "حيوان", "نبات", "جماد", "بلاد"];

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black">إنسان حيوان نبات جماد بلاد</h2>
        <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-red-500">
          الحرف: م
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => (
          <label key={field} className="rounded-3xl border border-white/20 bg-white/10 p-4">
            <div className="mb-3 text-sm font-black text-white/90">{field}</div>
            <input
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/60"
              placeholder={`اكتب ${field}`}
            />
          </label>
        ))}
      </div>
    </GlassCard>
  );
}

export default function GamePage() {
  const [game, setGame] = useState("word");
  const [name, setName] = useState("لاعب");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setGame(params.get("game") || "word");
    setName(params.get("name") || "لاعب");
  }, []);

  const board =
    game === "word" ? (
      <WordGame />
    ) : game === "draw" ? (
      <DrawGame />
    ) : game === "categories" ? (
      <CategoriesGame />
    ) : null;

  if (!board) return notFound();

  return (
    <main className="min-h-screen px-4 py-8 text-white">
      <div className="mx-auto mb-6 flex max-w-6xl items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white/70">اللاعب الحالي</p>
          <p className="text-xl font-black">{name}</p>
        </div>
        <Logo size={80} />
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
        {board}

        <GlassCard className="p-6">
          <h3 className="text-xl font-black">السكور بورد</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="flex items-center justify-between">
                <span>1. {name}</span>
                <span className="font-black">-</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
            <p className="text-sm text-white/70">الحالة</p>
            <p className="mt-2 text-lg font-black">
              {game === "draw" ? "خمن المثل من الإيموجي" : "قريبًا"}
            </p>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
