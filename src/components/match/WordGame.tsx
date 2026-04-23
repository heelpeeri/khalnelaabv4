'use client';

import { useEffect, useState } from "react";
import GameLayout from "@/components/match/GameLayout";
import { WORDS } from "@/data/words";
import type { WinnerType } from "@/types/game";

type CellState = "correct" | "present" | "absent";

export default function WordGame({
  onRoundEnd,
  roundKey,
  side1Name = "فريق 1",
  side2Name = "فريق 2",
  side1Score = 0,
  side2Score = 0,
  currentRound = 1,
  totalRounds = 3,
}: {
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  side1Name?: string;
  side2Name?: string;
  side1Score?: number;
  side2Score?: number;
  currentRound?: number;
  totalRounds?: number;
}) {
    const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [keyStatus, setKeyStatus] = useState<Record<string, CellState>>({});
  const [activeSide, setActiveSide] = useState<"side1" | "side2">("side1");
  const [feedback, setFeedback] = useState("ابدأ التخمين");

  useEffect(() => {
    resetRound();
  }, [roundKey]);

  function resetRound() {
    setAnswer(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses([]);
    setCurrent("");
    setStatus("playing");
    setKeyStatus({});
    setActiveSide("side1");
    setFeedback("ابدأ التخمين");
  }

  function normalize(text: string) {
    return text
      .trim()
      .replace(/\s+/g, "")
      .replace(/ة/g, "ه")
      .replace(/أ|إ|آ/g, "ا")
      .replace(/ى/g, "ي");
  }

  const roundLabel =
    currentRound === 1
      ? `الجولة الأولى من ${totalRounds}`
      : currentRound === 2
      ? `الجولة الثانية من ${totalRounds}`
      : currentRound === 3
      ? `الجولة الثالثة من ${totalRounds}`
      : currentRound === 4
      ? `الجولة الرابعة من ${totalRounds}`
      : currentRound === 5
      ? `الجولة الخامسة من ${totalRounds}`
      : `الجولة ${currentRound} من ${totalRounds}`;

  function getCurrentTurnName() {
    return activeSide === "side1" ? side1Name : side2Name;
  }

  function submitGuess() {
    if (status !== "playing") return;

    const rawGuess = current.trim().replace(/\s+/g, "");
    const guess = normalize(rawGuess);
    const ans = normalize(answer);

    if (rawGuess.length !== answer.length) {
      setFeedback(`لازم تدخل ${answer.length} حروف`);
      return;
    }

    const nextGuesses = [...guesses, rawGuess];
    const nextKeyStatus = { ...keyStatus };

    rawGuess.split("").forEach((letter, i) => {
      const normalizedLetter = normalize(letter);
      const normalizedAnswerLetter = normalize(answer[i]);

      if (normalizedLetter === normalizedAnswerLetter) {
        nextKeyStatus[normalizedLetter] = "correct";
      } else if (ans.includes(normalizedLetter)) {
        if (nextKeyStatus[normalizedLetter] !== "correct") {
          nextKeyStatus[normalizedLetter] = "present";
        }
      } else {
        nextKeyStatus[normalizedLetter] = "absent";
      }
    });

    setGuesses(nextGuesses);
    setKeyStatus(nextKeyStatus);
    setCurrent("");

    if (guess === ans) {
      const winner = activeSide;
      const winnerName = winner === "side1" ? side1Name : side2Name;
      setStatus("won");
      setFeedback(`🔥 ${winnerName} عرف الكلمة`);
      setTimeout(() => onRoundEnd(winner), 500);
      return;
    }

    if (nextGuesses.length >= MAX_TRIES) {
      setStatus("lost");
      setFeedback(`انتهت المحاولات — الكلمة: ${answer}`);
      setTimeout(() => onRoundEnd("none"), 700);
      return;
    }

    const nextSide = activeSide === "side1" ? "side2" : "side1";
    const nextTurnName = nextSide === "side1" ? side1Name : side2Name;
    setActiveSide(nextSide);
    setFeedback(`الدور على ${nextTurnName}`);
  }

  function getCellColor(letter: string, index: number) {
    const normalizedLetter = normalize(letter);
    const normalizedAnswerLetter = normalize(answer[index]);
    const normalizedAnswer = normalize(answer);

    if (normalizedLetter === normalizedAnswerLetter) {
      return "bg-green-500 border-green-400 text-white";
    }

    if (normalizedAnswer.includes(normalizedLetter)) {
      return "bg-yellow-400 border-yellow-300 text-black";
    }

    return "bg-[#2f3750] border-[#4b5676] text-white";
  }

  function getKeyColor(key: string) {
    const state = keyStatus[normalize(key)];
    if (state === "correct") return "bg-green-500 border-green-400 text-white";
    if (state === "present") return "bg-yellow-400 border-yellow-300 text-black";
    if (state === "absent") return "bg-[#2f3750] border-[#4b5676] text-white";
    return "bg-white/10 border-white/10 text-white hover:bg-white/15";
  }

  const remainingRows = MAX_TRIES - guesses.length;

  return (
    <GameLayout
      title={`خمن الكلمة — ${roundLabel}`}
      side1={side1Name}
      side2={side2Name}
      side1Score={side1Score}
      side2Score={side2Score}
      turn={`دور ${getCurrentTurnName()}`}
    >
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white sm:text-base">
          {feedback}
        </div>

        <div className="space-y-2">
          {guesses.map((guess, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {guess.split("").map((letter, colIndex) => (
                <div
                  key={colIndex}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl font-black md:h-14 md:w-14 md:text-2xl sm:h-12 sm:w-12 ${getCellColor(
                    letter,
                    colIndex
                  )}`}
                >
                  {letter}
                </div>
              ))}
            </div>
          ))}

          {Array.from({ length: remainingRows }).map((_, rowIndex) => (
            <div key={`empty-${rowIndex}`} className="flex justify-center gap-2">
              {Array.from({ length: answer.length }).map((__, colIndex) => {
                const previewLetter = rowIndex === 0 ? current[colIndex] ?? "" : "";

                return (
                  <div
                    key={colIndex}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl font-black text-white md:h-14 md:w-14 md:text-2xl sm:h-12 sm:w-12 ${
                      rowIndex === 0
                        ? "border-[#6d6be9] bg-[#20193f]"
                        : "border-white/10 bg-[#16142a]"
                    }`}
                  >
                    {previewLetter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-1 space-y-2">
          {keyboardRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`flex justify-center gap-2 ${
                rowIndex === 1 ? "mr-3 sm:mr-5" : rowIndex === 2 ? "mr-5 sm:mr-8" : ""
              }`}
            >
              {row.split("").map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setCurrent((prev) =>
                      status === "playing" && prev.length < answer.length ? prev + key : prev
                    )
                  }
                  disabled={status !== "playing"}
                  className={`h-10 min-w-[38px] rounded-lg border text-sm font-bold transition active:scale-95 disabled:opacity-50 sm:h-11 sm:min-w-[42px] sm:text-base ${getKeyColor(
                    key
                  )}`}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrent((prev) => prev.slice(0, -1))}
              disabled={status !== "playing" || current.length === 0}
              className="h-11 min-w-[110px] rounded-xl border border-white/10 bg-[#2a2f45] text-white font-bold transition hover:bg-[#343a56] disabled:opacity-50"
            >
              حذف
            </button>

            <button
              type="button"
              onClick={submitGuess}
              disabled={status !== "playing"}
              className="h-11 min-w-[110px] rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold transition hover:scale-[1.02] disabled:opacity-50"
            >
              إدخال
            </button>

            <button
              type="button"
              onClick={() => onRoundEnd()}
              className="h-11 min-w-[110px] rounded-xl border border-white/10 bg-[#4c2b7a] text-white font-bold transition hover:bg-[#5a3392]"
            >
              إنهاء الجولة
            </button>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
