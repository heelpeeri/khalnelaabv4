'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import { quizCategoryList } from "@/data/quiz";
import type { QuizCategoryKey } from "@/data/quiz";

type GameType = "word" | "draw" | "categories" | "scramble" | "wheel" | "quiz";
type SessionMode = "quick" | "session";

const GAME_OPTIONS: { id: GameType; title: string; icon: string }[] = [
  { id: "quiz", title: "الأسئلة", icon: "❓" },
  { id: "word", title: "خمن الكلمة", icon: "💬" },
  { id: "scramble", title: "حروف بالخلاط", icon: "🧩" },
  { id: "wheel", title: "لف وخمن", icon: "🎡" },
  { id: "categories", title: "إنسان حيوان نبات جماد بلاد", icon: "🌍" },
  { id: "draw", title: "خمن المثل", icon: "✏️" },
];

const ROUND_OPTIONS = [1, 2, 3, 5];

export default function SetupGame({
  sessionMode,
  side1,
  side2,
  rounds,
  selectedGame,
  selectedSessionGames,
  sessionGameRounds,
  selectedSessionQuizCategories,
  onSide1Change,
  onSide2Change,
  onRoundsChange,
  onSelectedGameChange,
  onToggleSessionGame,
  onSessionGameRoundsChange,
  onToggleSessionQuizCategory,
  onStart,
}: {
  sessionMode: SessionMode;
  side1: string;
  side2: string;
  rounds: number;
  selectedGame: GameType;
  selectedSessionGames: GameType[];
  sessionGameRounds: Record<GameType, number>;
  selectedSessionQuizCategories: QuizCategoryKey[];
  onSide1Change: (value: string) => void;
  onSide2Change: (value: string) => void;
  onRoundsChange: (value: number) => void;
  onSelectedGameChange: (value: GameType) => void;
  onToggleSessionGame: (value: GameType) => void;
  onSessionGameRoundsChange: (game: GameType, rounds: number) => void;
  onToggleSessionQuizCategory: (category: QuizCategoryKey) => void;
  onStart: () => void;
}) {
  const [step, setStep] = useState(1);

  const selectedGameMeta =
    GAME_OPTIONS.find((g) => g.id === selectedGame) ?? GAME_OPTIONS[1];

  const totalSessionRounds = selectedSessionGames.reduce(
    (total, game) => total + (sessionGameRounds[game] ?? 1),
    0
  );

  const hasQuiz = selectedSessionGames.includes("quiz");

  const canGoNext = useMemo(() => {
    if (sessionMode === "quick") return true;
    if (step === 2) return selectedSessionGames.length > 0;
    if (step === 4 && hasQuiz) return selectedSessionQuizCategories.length > 0;
    return true;
  }, [sessionMode, step, selectedSessionGames.length, hasQuiz, selectedSessionQuizCategories.length]);

  function nextStep() {
    if (!canGoNext) return;
    setStep((s) => Math.min(5, s + 1));
  }

  function prevStep() {
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-[34px] border border-white/10 bg-black/20 p-5 shadow-[0_0_30px_rgba(0,0,0,0.22)] backdrop-blur-sm md:p-8">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.18em] text-cyan-300/80">
            {sessionMode === "session" ? `STEP ${step} / 5` : "QUICK SETUP"}
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-5xl">
            {sessionMode === "session"
              ? "تحدي الجلسة"
              : `${selectedGameMeta.title} ${selectedGameMeta.icon}`}
          </h1>

          <p className="mt-3 text-sm text-white/65 md:text-base">
            {sessionMode === "session"
              ? "جهّز الجلسة خطوة بخطوة."
              : "تقدر تكتب أسماء الفرق قبل البداية."}
          </p>
        </div>

        <div className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.03] p-4 md:p-6">
          {sessionMode === "quick" ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <TeamInput label="الفريق 1" value={side1} onChange={onSide1Change} />
                <TeamInput label="الفريق 2" value={side2} onChange={onSide2Change} />
              </div>

              <div className="mt-8 text-center">
                <p className="text-3xl font-black md:text-4xl">عدد الجولات</p>

                <div className="mx-auto mt-5 w-full max-w-[280px] rounded-full border border-white/10 bg-white/[0.05] p-1.5">
                  <div className="grid grid-cols-3 gap-1.5">
                    {[1, 3, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => onRoundsChange(value)}
                        className={`h-12 rounded-full text-2xl font-black transition ${
                          rounds === value
                            ? "bg-white text-[#120022]"
                            : "bg-transparent text-white/85 hover:bg-white/10"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {step === 1 && (
                <div>
                  <h2 className="mb-5 text-center text-3xl font-black">
                    أسماء الفرق
                  </h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    <TeamInput label="الفريق 1" value={side1} onChange={onSide1Change} />
                    <TeamInput label="الفريق 2" value={side2} onChange={onSide2Change} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="mb-5 text-center text-3xl font-black">
                    اختر الألعاب
                  </h2>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {GAME_OPTIONS.map((game) => {
                      const selected = selectedSessionGames.includes(game.id);

                      return (
                        <button
                          key={game.id}
                          type="button"
                          onClick={() => onToggleSessionGame(game.id)}
                          className={`rounded-3xl border p-5 text-right transition ${
                            selected
                              ? "border-cyan-300/40 bg-cyan-400/15"
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xl font-black">
                              {game.icon} {game.title}
                            </span>
                            <span>{selected ? "✅" : "⬜"}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {!canGoNext && (
                    <p className="mt-4 text-center text-sm text-red-300">
                      اختر لعبة واحدة على الأقل.
                    </p>
                  )}
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="mb-5 text-center text-3xl font-black">
                    عدد الجولات لكل لعبة
                  </h2>

                  <div className="space-y-3">
                    {selectedSessionGames.map((gameId) => {
                      const game = GAME_OPTIONS.find((g) => g.id === gameId);
                      const currentRounds = sessionGameRounds[gameId] ?? 1;

                      if (!game) return null;

                      return (
                        <div
                          key={game.id}
                          className="rounded-3xl border border-white/10 bg-white/5 p-5"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-xl font-black">
                              {game.icon} {game.title}
                            </p>

                            <div className="flex gap-2">
                              {ROUND_OPTIONS.map((value) => (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() =>
                                    onSessionGameRoundsChange(game.id, value)
                                  }
                                  className={`h-10 w-12 rounded-xl text-sm font-black transition ${
                                    currentRounds === value
                                      ? "bg-white text-[#120022]"
                                      : "bg-white/10 text-white hover:bg-white/15"
                                  }`}
                                >
                                  {value}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="mb-2 text-center text-3xl font-black">
                    فئات الأسئلة
                  </h2>

                  {!hasQuiz ? (
                    <p className="text-center text-white/60">
                      ما اخترت لعبة الأسئلة. تقدر تكمل.
                    </p>
                  ) : (
                    <>
                      <p className="mb-5 text-center text-sm text-white/60">
                        تقدر تختار أكثر من فئة.
                      </p>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {quizCategoryList.map((category) => {
                          const selected = selectedSessionQuizCategories.includes(
                            category.key
                          );

                          return (
                            <button
                              key={category.key}
                              type="button"
                              onClick={() =>
                                onToggleSessionQuizCategory(category.key)
                              }
                              className={`rounded-3xl border p-5 text-right transition ${
                                selected
                                  ? "border-yellow-300/40 bg-yellow-300/15 text-yellow-100"
                                  : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-lg font-black">
                                  {category.emoji} {category.title}
                                </span>
                                <span>{selected ? "✅" : "⬜"}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {!canGoNext && (
                        <p className="mt-4 text-center text-sm text-red-300">
                          اختر فئة واحدة على الأقل.
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {step === 5 && (
                <div>
                  <h2 className="mb-5 text-center text-3xl font-black">
                    المراجعة
                  </h2>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-right">
                    <p className="text-lg font-black">
                      {side1.trim() || "فريق 1"} ضد {side2.trim() || "فريق 2"}
                    </p>

                    <p className="mt-3 text-white/65">
                      إجمالي الجولات: {totalSessionRounds}
                    </p>

                    <div className="mt-4 space-y-2">
                      {selectedSessionGames.map((gameId) => {
                        const game = GAME_OPTIONS.find((g) => g.id === gameId);
                        if (!game) return null;

                        return (
                          <div
                            key={game.id}
                            className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
                          >
                            <span>
                              {game.icon} {game.title}
                            </span>
                            <span>{sessionGameRounds[game.id] ?? 1} جولات</span>
                          </div>
                        );
                      })}
                    </div>

                    {hasQuiz && (
                      <div className="mt-4 rounded-2xl bg-yellow-300/10 p-4">
                        <p className="font-bold text-yellow-100">
                          فئات الأسئلة:
                        </p>
                        <p className="mt-2 text-sm text-white/75">
                          {selectedSessionQuizCategories
                            .map((key) => {
                              const cat = quizCategoryList.find(
                                (item) => item.key === key
                              );
                              return cat ? `${cat.emoji} ${cat.title}` : key;
                            })
                            .join("، ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {sessionMode === "session" ? (
              <div className="flex w-full gap-3 sm:w-auto">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary min-w-[120px]"
                  >
                    السابق
                  </button>
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canGoNext}
                    className="btn-primary min-w-[160px] disabled:opacity-50"
                  >
                    التالي
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onStart}
                    className="btn-primary min-w-[220px]"
                  >
                    ابدأ اللعب
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onStart}
                className="btn-primary w-full text-lg font-black active:scale-95 sm:w-auto sm:min-w-[260px]"
              >
                ابدأ اللعب
              </button>
            )}

            <Link
              href="/"
              className="text-center text-sm font-bold text-white/60 transition hover:text-white"
            >
              رجوع
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="group block">
      <span className="mb-2 block text-right text-sm font-bold text-white/65">
        {label}
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input h-14 rounded-[20px] border-white/10 bg-white/[0.04] px-5 text-center text-lg font-black transition duration-200 focus:border-cyan-300/30 focus:bg-white/[0.06]"
        placeholder="اختر اسم الفريق"
      />
    </label>
  );
}
