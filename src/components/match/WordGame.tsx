'use client';

import { useEffect, useState } from "react";
import GameLayout from "@/components/match/GameLayout";
import { WORDS } from "@/data/words";
import type { WinnerType } from "@/types/game";

type CellState = "correct" | "present" | "absent";
type TeamSide = "side1" | "side2";

const WORD_LENGTH = 5;
const MAX_TRIES = 6;

const keyboardRows = [
  "جحخهعغفقثصض",
  "كمنتالبيسش",
  "ورزدذطظ",
];

function normalizeArabic(text: string) {
  return text
    .trim()
    .replace(/\s+/g, "")
    .replace(/ة/g, "ه")
    .replace(/أ|إ|آ/g, "ا")
    .replace(/ى/g, "ي");
}

function evaluateGuess(
  guess: string,
  answer: string
): CellState[] {
  const guessLetters = Array.from(
    normalizeArabic(guess)
  );

  const answerLetters = Array.from(
    normalizeArabic(answer)
  );

  const result: CellState[] = Array(
    guessLetters.length
  ).fill("absent");

  const remainingLetters: Record<
    string,
    number
  > = {};

  // أولاً: الحروف الصحيحة وفي مكانها
  guessLetters.forEach((letter, index) => {
    if (letter === answerLetters[index]) {
      result[index] = "correct";
    } else {
      const answerLetter =
        answerLetters[index];

      if (answerLetter) {
        remainingLetters[answerLetter] =
          (remainingLetters[answerLetter] ??
            0) + 1;
      }
    }
  });

  // ثانياً: الحروف الموجودة لكن في مكان خاطئ
  guessLetters.forEach((letter, index) => {
    if (result[index] === "correct") {
      return;
    }

    const remainingCount =
      remainingLetters[letter] ?? 0;

    if (remainingCount > 0) {
      result[index] = "present";

      remainingLetters[letter] =
        remainingCount - 1;
    }
  });

  return result;
}

function HelpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] border border-white/15 bg-[#120d2c]/95 p-6 text-right shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-black text-white">
            طريقة اللعب
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-bold text-white transition hover:bg-white/10"
          >
            ×
          </button>
        </div>

        <div className="mt-5 space-y-3 text-sm leading-7 text-white/85 md:text-base">
          <p>
            1. حاول تخمن الكلمة المكوّنة من 5 حروف.
          </p>

          <p>
            2. اللون الأخضر يعني أن الحرف صحيح وفي مكانه الصحيح.
          </p>

          <p>
            3. اللون الأصفر يعني أن الحرف موجود في الكلمة لكن في مكان مختلف.
          </p>

          <p>
            4. اللون الرمادي يعني أن الحرف غير موجود في الكلمة.
          </p>

          <p>
            5. بعد كل محاولة ينتقل الدور للفريق الثاني.
          </p>

          <p>
            6. لكل فريق مساعدة واحدة تحذف حرفًا خاطئًا من لوحة الحروف.
          </p>

          <p>
            7. الفريق الذي يخمن الكلمة بشكل صحيح يفوز بالجولة.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn-primary mt-6 min-w-[140px]"
        >
          فهمت
        </button>
      </div>
    </div>
  );
}

export default function WordGame({
  onRoundEnd,
  roundKey,
  side1Name = "فريق 1",
  side2Name = "فريق 2",
  side1Score = 0,
  side2Score = 0,
  currentRound = 1,
  timerEnabled = false,
  timerSeconds = 30,
}: {
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  side1Name?: string;
  side2Name?: string;
  side1Score?: number;
  side2Score?: number;
  currentRound?: number;
  timerEnabled?: boolean;
  timerSeconds?: number;
}) {
  const [answer, setAnswer] =
    useState("");

  const [guesses, setGuesses] =
    useState<string[]>([]);

  const [current, setCurrent] =
    useState("");

  const [status, setStatus] = useState<
    "playing" | "won" | "lost"
  >("playing");

  const [keyStatus, setKeyStatus] =
    useState<Record<string, CellState>>({});

  const [
    removedLetters,
    setRemovedLetters,
  ] = useState<string[]>([]);

  const [activeSide, setActiveSide] =
    useState<TeamSide>("side1");

  const [feedback, setFeedback] =
    useState("ابدأ التخمين");

  const [timeLeft, setTimeLeft] =
    useState(timerSeconds);

  const [
    side1HintUsed,
    setSide1HintUsed,
  ] = useState(false);

  const [
    side2HintUsed,
    setSide2HintUsed,
  ] = useState(false);

  const [showHelp, setShowHelp] =
    useState(false);

  useEffect(() => {
    resetRound();
  }, [
    roundKey,
    currentRound,
    timerSeconds,
  ]);

  useEffect(() => {
    if (
      !timerEnabled ||
      status !== "playing"
    ) {
      return;
    }

    if (timeLeft <= 0) {
      switchTurn();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(
        (previous) => previous - 1
      );
    }, 1000);

    return () =>
      clearTimeout(timer);
  }, [
    timerEnabled,
    timeLeft,
    status,
    activeSide,
  ]);

  function getFiveLetterWords() {
    return WORDS.filter(
      (word) =>
        normalizeArabic(word).length ===
        WORD_LENGTH
    );
  }

  function resetRound() {
    const startingSide: TeamSide =
      currentRound % 2 === 1
        ? "side1"
        : "side2";

    const fiveLetterWords =
      getFiveLetterWords();

    if (
      fiveLetterWords.length === 0
    ) {
      setAnswer("");

      setFeedback(
        "ما فيه كلمات من 5 حروف في ملف الكلمات"
      );

      return;
    }

    const randomWord =
      fiveLetterWords[
        Math.floor(
          Math.random() *
            fiveLetterWords.length
        )
      ];

    setAnswer(randomWord);

    setGuesses([]);
    setCurrent("");

    setStatus("playing");

    setKeyStatus({});
    setRemovedLetters([]);

    setActiveSide(startingSide);

    setTimeLeft(timerSeconds);

    setSide1HintUsed(false);
    setSide2HintUsed(false);

    setFeedback(
      `الدور على ${
        startingSide === "side1"
          ? side1Name
          : side2Name
      }`
    );
  }

  function getCurrentTurnName() {
    return activeSide === "side1"
      ? side1Name
      : side2Name;
  }

  function switchTurn() {
    const nextSide: TeamSide =
      activeSide === "side1"
        ? "side2"
        : "side1";

    setActiveSide(nextSide);

    setCurrent("");

    setTimeLeft(timerSeconds);

    setFeedback(
      `انتهى الوقت — الدور على ${
        nextSide === "side1"
          ? side1Name
          : side2Name
      }`
    );
  }

  function submitGuess() {
    if (
      status !== "playing" ||
      !answer
    ) {
      return;
    }

    const rawGuess = current
      .trim()
      .replace(/\s+/g, "");

    const guess =
      normalizeArabic(rawGuess);

    const normalizedAnswer =
      normalizeArabic(answer);

    if (
      guess.length !== WORD_LENGTH
    ) {
      setFeedback(
        `لازم تدخل ${WORD_LENGTH} حروف`
      );

      return;
    }

    const evaluation =
      evaluateGuess(
        rawGuess,
        answer
      );

    const nextGuesses = [
      ...guesses,
      rawGuess,
    ];

    const nextKeyStatus = {
      ...keyStatus,
    };

    Array.from(rawGuess).forEach(
      (letter, index) => {
        const normalizedLetter =
          normalizeArabic(letter);

        const newState =
          evaluation[index];

        const previousState =
          nextKeyStatus[
            normalizedLetter
          ];

        if (
          previousState === "correct"
        ) {
          return;
        }

        if (
          newState === "correct"
        ) {
          nextKeyStatus[
            normalizedLetter
          ] = "correct";

          return;
        }

        if (
          previousState === "present"
        ) {
          return;
        }

        if (
          newState === "present"
        ) {
          nextKeyStatus[
            normalizedLetter
          ] = "present";

          return;
        }

        if (!previousState) {
          nextKeyStatus[
            normalizedLetter
          ] = "absent";
        }
      }
    );

    setGuesses(nextGuesses);

    setKeyStatus(nextKeyStatus);

    setCurrent("");

    /*
      أحد الفريقين عرف الكلمة.
    */
    if (
      guess === normalizedAnswer
    ) {
      setStatus("won");

      setFeedback(
        `🔥 ${getCurrentTurnName()} عرف الكلمة`
      );

      setTimeout(() => {
        onRoundEnd(activeSide);
      }, 500);

      return;
    }

    /*
      انتهت كل المحاولات.

      مهم:
      ما ننهي الجولة تلقائيًا.
      نخلي الحل ظاهر للاعبين أولاً.
    */
    if (
      nextGuesses.length >=
      MAX_TRIES
    ) {
      setStatus("lost");

      setFeedback(
        "انتهت المحاولات"
      );

      return;
    }

    const nextSide: TeamSide =
      activeSide === "side1"
        ? "side2"
        : "side1";

    setActiveSide(nextSide);

    setTimeLeft(timerSeconds);

    setFeedback(
      `الدور على ${
        nextSide === "side1"
          ? side1Name
          : side2Name
      }`
    );
  }

  function useHint() {
    if (
      status !== "playing" ||
      !answer
    ) {
      return;
    }

    const hintAlreadyUsed =
      activeSide === "side1"
        ? side1HintUsed
        : side2HintUsed;

    if (hintAlreadyUsed) {
      setFeedback(
        `${getCurrentTurnName()} استخدم المساعدة من قبل`
      );

      return;
    }

    const normalizedAnswer =
      normalizeArabic(answer);

    const allKeyboardLetters =
      keyboardRows
        .join("")
        .split("")
        .map((letter) =>
          normalizeArabic(letter)
        );

    const availableWrongLetters =
      allKeyboardLetters.filter(
        (letter) => {
          const isInAnswer =
            normalizedAnswer.includes(
              letter
            );

          const isAlreadyRemoved =
            removedLetters.includes(
              letter
            );

          const isAlreadyUsed =
            Boolean(
              keyStatus[letter]
            );

          const isInCurrentGuess =
            current
              .split("")
              .map((item) =>
                normalizeArabic(item)
              )
              .includes(letter);

          return (
            !isInAnswer &&
            !isAlreadyRemoved &&
            !isAlreadyUsed &&
            !isInCurrentGuess
          );
        }
      );

    if (
      availableWrongLetters.length ===
      0
    ) {
      setFeedback(
        "ما فيه حرف متاح للحذف"
      );

      return;
    }

    const removedLetter =
      availableWrongLetters[
        Math.floor(
          Math.random() *
            availableWrongLetters.length
        )
      ];

    setRemovedLetters(
      (previous) => [
        ...previous,
        removedLetter,
      ]
    );

    if (
      activeSide === "side1"
    ) {
      setSide1HintUsed(true);
    } else {
      setSide2HintUsed(true);
    }

    setFeedback(
      `💡 تم حذف حرف خاطئ لـ ${getCurrentTurnName()}`
    );
  }

  function handleKeyboardClick(
    key: string
  ) {
    if (
      status !== "playing"
    ) {
      return;
    }

    const normalizedKey =
      normalizeArabic(key);

    const state =
      keyStatus[normalizedKey];

    const wasRemoved =
      removedLetters.includes(
        normalizedKey
      );

    if (
      state === "absent" ||
      wasRemoved
    ) {
      return;
    }

    if (
      current.length >=
      WORD_LENGTH
    ) {
      return;
    }

    setCurrent(
      (previous) =>
        previous + key
    );
  }

  function getCellColor(
    guess: string,
    index: number
  ) {
    const evaluation =
      evaluateGuess(
        guess,
        answer
      );

    const state =
      evaluation[index];

    if (
      state === "correct"
    ) {
      return "bg-green-500 border-green-400 text-white";
    }

    if (
      state === "present"
    ) {
      return "bg-yellow-400 border-yellow-300 text-black";
    }

    return "bg-[#2f3750] border-[#4b5676] text-white";
  }

  function getKeyColor(
    key: string
  ) {
    const normalizedKey =
      normalizeArabic(key);

    const state =
      keyStatus[normalizedKey];

    const wasRemoved =
      removedLetters.includes(
        normalizedKey
      );

    if (wasRemoved) {
      return "border-red-500/20 bg-red-950/40 text-white/20 line-through";
    }

    if (
      state === "correct"
    ) {
      return "bg-green-500 border-green-400 text-white";
    }

    if (
      state === "present"
    ) {
      return "bg-yellow-400 border-yellow-300 text-black";
    }

    if (
      state === "absent"
    ) {
      return "bg-[#2f3750] border-[#4b5676] text-white/25";
    }

    return "bg-white/10 border-white/10 text-white hover:bg-white/15";
  }

  function isKeyDisabled(
    key: string
  ) {
    const normalizedKey =
      normalizeArabic(key);

    return (
      status !== "playing" ||
      keyStatus[
        normalizedKey
      ] === "absent" ||
      removedLetters.includes(
        normalizedKey
      )
    );
  }

  const activeTeamHintUsed =
    activeSide === "side1"
      ? side1HintUsed
      : side2HintUsed;

  const remainingRows =
    MAX_TRIES -
    guesses.length;

  const timerColor =
    timeLeft <= 5
      ? "text-red-300 animate-pulse"
      : timeLeft <= 10
        ? "text-yellow-300"
        : "text-cyan-300";

  const routineFeedback =
    feedback ===
      "ابدأ التخمين" ||
    feedback.startsWith(
      "الدور على "
    );

  const showFeedback =
    !routineFeedback;

  if (!answer) {
    return (
      <div className="text-center text-white">
        <p>
          ما فيه كلمات من 5 حروف
        </p>

        <p className="mt-2 text-sm text-white/50">
          عدّل ملف words.ts وأضف
          كلمات مكوّنة من 5 حروف.
        </p>

        <button
          type="button"
          onClick={() =>
            onRoundEnd("none")
          }
          className="btn-primary mt-4"
        >
          إنهاء الجولة
        </button>
      </div>
    );
  }

  return (
    <>
      <GameLayout
        title="خمن الكلمة"
        side1={side1Name}
        side2={side2Name}
        side1Score={side1Score}
        side2Score={side2Score}
        turn={getCurrentTurnName()}
        currentRound={currentRound}
      >
        <div className="flex flex-col gap-2">

          {/* طريقة اللعب + المؤقت */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                setShowHelp(true)
              }
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
            >
              طريقة اللعب
            </button>

            {timerEnabled &&
              status ===
                "playing" && (
                <span
                  className={`rounded-full border border-white/10 bg-white/5 px-4 py-2 font-black ${timerColor}`}
                >
                  ⏱️ {timeLeft}
                </span>
              )}
          </div>

          {/* الرسائل المهمة فقط */}
          {showFeedback && (
            <div className="mt-1 text-center text-sm font-bold text-white/75">
              {feedback}
            </div>
          )}

          {/* مربعات التخمين */}
          <div className="flex justify-center py-2">
            <div className="space-y-1.5">
              {guesses.map(
                (
                  guess,
                  rowIndex
                ) => (
                  <div
                    key={
                      rowIndex
                    }
                    className="flex justify-center gap-1.5"
                  >
                    {Array.from(
                      guess
                    ).map(
                      (
                        letter,
                        colIndex
                      ) => (
                        <div
                          key={
                            colIndex
                          }
                          className={`flex h-10 w-10 items-center justify-center rounded-lg border text-lg font-black sm:h-11 sm:w-11 sm:text-xl md:h-12 md:w-12 ${getCellColor(
                            guess,
                            colIndex
                          )}`}
                        >
                          {letter}
                        </div>
                      )
                    )}
                  </div>
                )
              )}

              {Array.from({
                length:
                  remainingRows,
              }).map(
                (
                  _,
                  rowIndex
                ) => (
                  <div
                    key={`empty-${rowIndex}`}
                    className="flex justify-center gap-1.5"
                  >
                    {Array.from({
                      length:
                        WORD_LENGTH,
                    }).map(
                      (
                        __,
                        colIndex
                      ) => {
                        const previewLetter =
                          rowIndex ===
                          0
                            ? current[
                                colIndex
                              ] ?? ""
                            : "";

                        return (
                          <div
                            key={
                              colIndex
                            }
                            className={`flex h-10 w-10 items-center justify-center rounded-lg border text-lg font-black text-white sm:h-11 sm:w-11 sm:text-xl md:h-12 md:w-12 ${
                              rowIndex ===
                              0
                                ? "border-[#6d6be9] bg-[#20193f]"
                                : "border-white/10 bg-[#16142a]"
                            }`}
                          >
                            {
                              previewLetter
                            }
                          </div>
                        );
                      }
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* تظهر الإجابة إذا انتهت المحاولات */}
          {status === "lost" && (
            <div className="mx-auto mt-3 w-full max-w-md rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-5 text-center shadow-[0_0_24px_rgba(253,224,71,0.08)]">
              <p className="text-sm font-bold text-white/60">
                الكلمة الصحيحة
              </p>

              <p className="mt-2 text-3xl font-black text-yellow-100">
                {answer}
              </p>
            </div>
          )}

          {/* الكيبورد */}
          <div className="mt-2 space-y-1.5">
            {keyboardRows.map(
              (
                row,
                rowIndex
              ) => (
                <div
                  key={
                    rowIndex
                  }
                  className={`flex justify-center gap-1.5 ${
                    rowIndex === 1
                      ? "mr-2 sm:mr-4"
                      : rowIndex ===
                          2
                        ? "mr-4 sm:mr-6"
                        : ""
                  }`}
                >
                  {row
                    .split("")
                    .map(
                      (key) => (
                        <button
                          key={
                            key
                          }
                          type="button"
                          onClick={() =>
                            handleKeyboardClick(
                              key
                            )
                          }
                          disabled={isKeyDisabled(
                            key
                          )}
                          className={`h-9 min-w-[34px] rounded-lg border px-1 text-sm font-bold transition active:scale-95 disabled:cursor-not-allowed sm:h-10 sm:min-w-[38px] sm:text-base ${getKeyColor(
                            key
                          )}`}
                        >
                          {key}
                        </button>
                      )
                    )}
                </div>
              )
            )}
          </div>

          {/* الأزرار */}
          <div className="mt-2 flex flex-wrap justify-center gap-2">

            {status ===
              "playing" && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setCurrent(
                      (
                        previous
                      ) =>
                        previous.slice(
                          0,
                          -1
                        )
                    )
                  }
                  disabled={
                    current.length ===
                    0
                  }
                  className="h-10 min-w-[90px] rounded-xl border border-white/10 bg-[#2a2f45] px-4 text-sm font-bold text-white transition hover:bg-[#343a56] disabled:opacity-40"
                >
                  حذف
                </button>

                <button
                  type="button"
                  onClick={
                    submitGuess
                  }
                  disabled={
                    current.length !==
                    WORD_LENGTH
                  }
                  className="h-10 min-w-[90px] rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 px-4 text-sm font-bold text-white transition hover:scale-[1.02] disabled:opacity-40"
                >
                  إدخال
                </button>

                <button
                  type="button"
                  onClick={useHint}
                  disabled={
                    activeTeamHintUsed
                  }
                  className="h-10 min-w-[125px] rounded-xl border border-yellow-300/30 bg-yellow-400/10 px-4 text-sm font-bold text-yellow-100 transition hover:bg-yellow-400/20 disabled:opacity-40"
                >
                  {activeTeamHintUsed
                    ? "المساعدة استخدمت"
                    : "💡 حذف حرف"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onRoundEnd()
                  }
                  className="h-10 min-w-[105px] rounded-xl border border-white/10 bg-[#4c2b7a] px-4 text-sm font-bold text-white transition hover:bg-[#5a3392]"
                >
                  إنهاء الجولة
                </button>
              </>
            )}

            {/* بعد خسارة الجميع */}
            {status ===
              "lost" && (
              <button
                type="button"
                onClick={() =>
                  onRoundEnd(
                    "none"
                  )
                }
                className="btn-primary min-w-[150px]"
              >
                إنهاء الجولة
              </button>
            )}
          </div>
        </div>
      </GameLayout>

      <HelpModal
        open={showHelp}
        onClose={() =>
          setShowHelp(false)
        }
      />
    </>
  );
}
