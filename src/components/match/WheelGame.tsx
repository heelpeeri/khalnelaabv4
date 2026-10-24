"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import GameLayout from "@/components/match/GameLayout";

import {
  WHEEL_SEGMENTS as SEGMENTS,
  WHEEL_PUZZLES as PUZZLES,
  WHEEL_LETTER_ROWS as LETTER_ROWS,
} from "@/data/wheel";

import { createDeck } from "@/lib/deck";
import { getPointsWinner } from "@/lib/scoring";
import { readRoundState, writeRoundState } from "@/lib/roundState";
import type { TeamTurn as Turn, WinnerType } from "@/types/game";
import type { WheelValue as Value } from "@/data/wheel";

const puzzleDeck = createDeck(PUZZLES);

type WheelRoundState = {
  answer: string;
  category: string;
  revealed: string[];
  usedLetters: string[];
  turn: Turn;
  phase: "spin" | "guess";
  currentValue: Value | null;
  score1: number;
  score2: number;
};

type Phase = "spin" | "result" | "guess" | "celebrate";

function normalizeArabic(text: string) {
  return text
    .trim()
    .replace(/\s+/g, "")
    .replace(/أ|إ|آ/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

function formatValue(value: Value | null) {
  if (value === null) return "لف العجلة";
  if (value === "bankrupt") return "💸 إفلاس";
  if (value === "lose") return "❌ خسارة الدور";
  return `${value}`;
}

function splitAnswerWords(answer: string) {
  return answer.trim().split(/\s+/);
}

export default function WheelGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
  currentRound = 1,
  timerEnabled = false,
  timerSeconds = 30,
}: {
  side1Name: string;
  side2Name: string;
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  currentRound?: number;
  timerEnabled?: boolean;
  timerSeconds?: number;
}) {
  const [turn, setTurn] = useState<Turn>("side1");
  const [phase, setPhase] = useState<Phase>("spin");

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const [currentValue, setCurrentValue] = useState<Value | null>(null);
  const [winnerName, setWinnerName] = useState("");

  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [revealed, setRevealed] = useState<string[]>([]);
  const [usedLetters, setUsedLetters] = useState<string[]>([]);

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const [timeLeft, setTimeLeft] = useState(timerSeconds);

  const [wheelGlow, setWheelGlow] = useState(false);

  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(
    null,
  );

  const [solveOpen, setSolveOpen] = useState(false);
  const [solveGuess, setSolveGuess] = useState("");
  const [loaded, setLoaded] = useState(false);

  const tickTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flowTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastTickIndexRef = useRef<number | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const segmentAngle = 360 / SEGMENTS.length;

  const currentTeamName = turn === "side1" ? side1Name : side2Name;

  function later(action: () => void, delay: number) {
    const timer = setTimeout(() => {
      flowTimersRef.current = flowTimersRef.current.filter(
        (item) => item !== timer,
      );

      action();
    }, delay);

    flowTimersRef.current.push(timer);
  }

  function clearFlowTimers() {
    flowTimersRef.current.forEach(clearTimeout);
    flowTimersRef.current = [];
  }

  useEffect(() => {
    setLoaded(true);

    const cleanup = () => {
      if (tickTimerRef.current) {
        clearInterval(tickTimerRef.current);
      }

      clearFlowTimers();
    };

    setRotation(0);
    setSpinning(false);
    setWinnerName("");
    setTimeLeft(timerSeconds);
    setWheelGlow(false);
    setActiveSegmentIndex(null);

    const saved = readRoundState<WheelRoundState>("wheel", roundKey);

    if (saved && saved.answer) {
      const guessing =
        saved.phase === "guess" && typeof saved.currentValue === "number";

      setAnswer(saved.answer);
      setCategory(saved.category);
      setRevealed(saved.revealed);
      setUsedLetters(saved.usedLetters);
      setTurn(saved.turn);
      setPhase(guessing ? "guess" : "spin");
      setCurrentValue(guessing ? saved.currentValue : null);
      setScore1(saved.score1);
      setScore2(saved.score2);

      return cleanup;
    }

    const [q] = puzzleDeck.draw(1);

    if (!q) {
      return cleanup;
    }

    setAnswer(q.answer);
    setCategory(q.category);

    setRevealed(Array(q.answer.length).fill(""));
    setUsedLetters([]);

    setTurn("side1");
    setPhase("spin");

    setCurrentValue(null);

    setScore1(0);
    setScore2(0);

    return cleanup;
  }, [roundKey, timerSeconds]);

  useEffect(() => {
    if (
      !loaded ||
      !answer ||
      phase === "celebrate" ||
      phase === "result" ||
      spinning
    ) {
      return;
    }

    writeRoundState<WheelRoundState>("wheel", roundKey, {
      answer,
      category,
      revealed,
      usedLetters,
      turn,
      phase,
      currentValue,
      score1,
      score2,
    });
  }, [
    loaded,
    roundKey,
    answer,
    category,
    revealed,
    usedLetters,
    turn,
    phase,
    currentValue,
    score1,
    score2,
    spinning,
  ]);

  useEffect(() => {
    return () => {
      if (tickTimerRef.current) {
        clearInterval(tickTimerRef.current);
      }

      clearFlowTimers();

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (!timerEnabled || phase !== "guess") return;

    if (timeLeft <= 0) {
      setCurrentValue(null);
      nextTurn();
      setPhase("spin");
      setTimeLeft(timerSeconds);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timerEnabled, phase, timeLeft, timerSeconds]);

  const answerWords = useMemo(() => splitAnswerWords(answer), [answer]);

  const revealedWordGroups = useMemo(() => {
    let cursor = 0;

    return answerWords.map((word) => {
      const letters = revealed.slice(cursor, cursor + word.length);

      cursor += word.length + 1;

      return letters;
    });
  }, [answerWords, revealed]);

  function ensureAudio() {
    if (typeof window === "undefined") return;
    if (audioContextRef.current) return;

    const AudioCtx =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const gain = ctx.createGain();

    gain.gain.value = 0.022;
    gain.connect(ctx.destination);

    audioContextRef.current = ctx;
    masterGainRef.current = gain;
  }

  async function unlockAudio() {
    ensureAudio();

    if (!audioContextRef.current) return;

    if (audioContextRef.current.state === "suspended") {
      try {
        await audioContextRef.current.resume();
      } catch {}
    }
  }

  function playTickSound() {
    const ctx = audioContextRef.current;
    const masterGain = masterGainRef.current;

    if (!ctx || !masterGain) return;

    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "triangle";

    osc.frequency.setValueAtTime(950, now);

    osc.frequency.exponentialRampToValueAtTime(620, now + 0.024);

    filter.type = "highpass";
    filter.frequency.setValueAtTime(420, now);

    gain.gain.setValueAtTime(0.0001, now);

    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.003);

    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.026);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  function playFinalTickSound() {
    const ctx = audioContextRef.current;
    const masterGain = masterGainRef.current;

    if (!ctx || !masterGain) return;

    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";

    osc.frequency.setValueAtTime(560, now);

    osc.frequency.exponentialRampToValueAtTime(380, now + 0.08);

    gain.gain.setValueAtTime(0.0001, now);

    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.01);

    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  function nextTurn() {
    setTurn((prev) => (prev === "side1" ? "side2" : "side1"));
  }

  function finishRound(final1: number, final2: number) {
    if (phase === "celebrate") return;

    const winner = getPointsWinner(final1, final2);

    setWinnerName(
      winner === "side1" ? side1Name : winner === "side2" ? side2Name : "",
    );

    setPhase("celebrate");

    later(() => {
      onRoundEnd(winner);
    }, 1400);
  }

  function getPointerSegmentIndex(currentRotation: number) {
    const normalized = ((currentRotation % 360) + 360) % 360;

    const pointerAngle = (360 - normalized) % 360;

    return Math.floor(pointerAngle / segmentAngle) % SEGMENTS.length;
  }

  function startTicking() {
    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current);
    }

    tickTimerRef.current = setInterval(() => {
      setRotation((current) => {
        const idx = getPointerSegmentIndex(current);

        if (lastTickIndexRef.current !== idx) {
          lastTickIndexRef.current = idx;

          setActiveSegmentIndex(idx);
          setWheelGlow(true);

          playTickSound();

          later(() => setWheelGlow(false), 90);
        }

        return current;
      });
    }, 58);
  }

  function stopTicking(finalRotation: number) {
    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }

    const idx = getPointerSegmentIndex(finalRotation);

    setActiveSegmentIndex(idx);
    setWheelGlow(true);

    playFinalTickSound();

    later(() => setWheelGlow(false), 180);
  }

  async function spinWheel() {
    if (spinning || phase !== "spin") {
      return;
    }

    await unlockAudio();

    setSpinning(true);
    setTimeLeft(timerSeconds);

    const index = Math.floor(Math.random() * SEGMENTS.length);

    const value: Value = SEGMENTS[index].value as Value;

    setCurrentValue(value);

    const targetCenter = index * segmentAngle + segmentAngle / 2;

    const extraSpins = 8 * 360;

    const nextRotation =
      rotation + extraSpins + (360 - (rotation % 360)) + (360 - targetCenter);

    startTicking();

    setRotation(nextRotation);

    later(() => {
      stopTicking(nextRotation);

      setSpinning(false);
      setPhase("result");

      later(() => {
        if (value === "bankrupt") {
          if (turn === "side1") {
            setScore1(0);
          } else {
            setScore2(0);
          }

          setCurrentValue(null);
          nextTurn();
          setPhase("spin");

          return;
        }

        if (value === "lose") {
          setCurrentValue(null);
          nextTurn();
          setPhase("spin");

          return;
        }

        setTimeLeft(timerSeconds);
        setPhase("guess");
      }, 850);
    }, 3000);
  }

  function pickLetter(letter: string) {
    if (phase !== "guess") return;
    if (usedLetters.includes(letter)) return;

    if (typeof currentValue !== "number") {
      return;
    }

    setUsedLetters((prev) => [...prev, letter]);

    let count = 0;

    const next = [...revealed];

    answer.split("").forEach((char, i) => {
      if (char === " ") return;

      if (normalizeArabic(char) === normalizeArabic(letter)) {
        next[i] = char;
        count++;
      }
    });

    setRevealed(next);

    if (count > 0) {
      const gained = count * currentValue;

      if (turn === "side1") {
        setScore1((score) => score + gained);
      } else {
        setScore2((score) => score + gained);
      }

      const solved = answer
        .split("")
        .every((char, i) => char === " " || next[i] !== "");

      if (solved) {
        finishRound(
          score1 + (turn === "side1" ? gained : 0),
          score2 + (turn === "side2" ? gained : 0),
        );
      }

      return;
    }

    setCurrentValue(null);

    nextTurn();

    setPhase("spin");

    setTimeLeft(timerSeconds);
  }

  useEffect(() => {
    setSolveOpen(false);
    setSolveGuess("");
  }, [phase, turn]);

  function solveWord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (phase !== "guess") return;

    const guess = solveGuess.trim();

    if (!guess) return;

    if (normalizeArabic(guess) === normalizeArabic(answer)) {
      setRevealed(answer.split("").map((char) => (char === " " ? "" : char)));

      finishRound(score1, score2);
      return;
    }

    setCurrentValue(null);

    nextTurn();

    setPhase("spin");

    setTimeLeft(timerSeconds);
  }

  if (!answer) {
    if (!loaded) return null;

    return (
      <div className="text-center text-white">
        <p>ما فيه كلمات للعجلة</p>

        <button
          type="button"
          onClick={() => onRoundEnd("none")}
          className="btn-primary mt-4"
        >
          إنهاء الجولة
        </button>
      </div>
    );
  }

  const timerTextClass =
    timeLeft <= 5
      ? "animate-pulse text-red-300"
      : timeLeft <= 10
        ? "text-yellow-200"
        : "text-cyan-200";

  return (
    <>
      <GameLayout
        title="لف وخمن"
        side1={side1Name}
        side2={side2Name}
        side1Score={score1}
        side2Score={score2}
        turn={currentTeamName}
        turnSide={turn}

        currentRound={currentRound}
        game="wheel"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-100">
              <span className="text-white/70">التصنيف:</span>

              <span>{category}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base font-bold md:text-lg">
            {phase === "result"
              ? `طلعت لك: ${formatValue(currentValue)}`
              : phase === "guess"
                ? `اختاروا حرف — الحرف بـ ${formatValue(currentValue)}`
                : phase === "celebrate"
                  ? "🏆 انتهت الجولة!"
                  : "لف العجلة"}

            {phase === "guess" && timerEnabled && (
              <span className={`mr-3 font-black ${timerTextClass}`}>
                ⏱️ {timeLeft}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {revealedWordGroups.map((word, wordIndex) => (
              <div
                key={wordIndex}
                className="flex max-w-full items-center gap-4"
              >
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {word.map((letter, i) => (
                    <div
                      key={`${wordIndex}-${i}`}
                      className="flex h-10 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-xl font-black sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl"
                    >
                      {letter || ""}
                    </div>
                  ))}
                </div>

                {wordIndex < revealedWordGroups.length - 1 && (
                  <div className="hidden h-10 w-6 items-center justify-center md:flex">
                    <div className="h-1 w-6 rounded-full bg-cyan-300/50" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {revealedWordGroups.length > 1 && (
            <p className="text-sm text-white/55">
              الكلمة مكوّنة من {revealedWordGroups.length} كلمات
            </p>
          )}

          <div className="mt-2">
            {(phase === "spin" || phase === "result") && (
              <div className="flex flex-col items-center">
                <div className="relative h-[290px] w-[290px] max-w-full md:h-[340px] md:w-[340px]">
                  <div
                    className={`absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-2 transition ${
                      wheelGlow
                        ? "scale-110 drop-shadow-[0_0_20px_rgba(248,113,113,0.95)]"
                        : "drop-shadow-[0_0_14px_rgba(248,113,113,0.75)]"
                    }`}
                  >
                    <div className="h-0 w-0 border-l-[16px] border-r-[16px] border-t-[28px] border-l-transparent border-r-transparent border-t-red-500" />
                  </div>

                  <div
                    className="relative h-full w-full rounded-full border-[6px] border-white/25"
                    style={{
                      background: `conic-gradient(${SEGMENTS.map(
                        (segment, i) => {
                          const start = i * segmentAngle;

                          const end = (i + 1) * segmentAngle;

                          return `${segment.color} ${start}deg ${end}deg`;
                        },
                      ).join(", ")})`,

                      transform: `rotate(${rotation}deg)`,

                      transition:
                        "transform 3s cubic-bezier(0.08, 0.9, 0.2, 1)",

                      boxShadow:
                        "inset 0 0 25px rgba(0,0,0,0.35), 0 18px 40px rgba(0,0,0,0.45), 0 0 30px rgba(168,85,247,0.18)",

                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="absolute inset-[10px] rounded-full border border-white/10"
                      style={{
                        boxShadow: "inset 0 0 20px rgba(255,255,255,0.06)",
                      }}
                    />

                    {SEGMENTS.map((segment, i) => {
                      const angle = i * segmentAngle + segmentAngle / 2;

                      const isActive = activeSegmentIndex === i;

                      return (
                        <div
                          key={`${segment.label}-${i}`}
                          className="absolute left-1/2 top-1/2 origin-center"
                          style={{
                            transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-108px) rotate(${-angle}deg)`,
                          }}
                        >
                          <div
                            className={`w-24 text-center text-sm font-black leading-4 text-white transition md:text-base ${
                              isActive ? "scale-110" : ""
                            }`}
                            style={{
                              textShadow: isActive
                                ? "0 0 10px rgba(255,255,255,0.95), 0 2px 4px rgba(0,0,0,0.85)"
                                : "0 2px 4px rgba(0,0,0,0.85)",
                            }}
                          >
                            {segment.label}
                          </div>
                        </div>
                      );
                    })}

                    <div
                      className={`absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white/25 bg-[radial-gradient(circle_at_30%_30%,#b91c1c,#7a001f)] text-2xl shadow-[0_0_25px_rgba(239,68,68,0.35)] transition ${
                        wheelGlow ? "scale-105" : ""
                      }`}
                    >
                      🎡
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={spinWheel}
                  disabled={phase !== "spin" || spinning}
                  className="btn-primary mt-5 min-w-[170px] disabled:opacity-50"
                >
                  {spinning ? "العجلة تدور..." : "لف العجلة"}
                </button>
              </div>
            )}

            {phase === "guess" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  {LETTER_ROWS.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex flex-wrap justify-center gap-1.5 sm:gap-2"
                    >
                      {row.split("").map((letter) => {
                        const isUsed = usedLetters.includes(letter);

                        return (
                          <button
                            key={letter}
                            type="button"
                            onClick={() => pickLetter(letter)}
                            disabled={isUsed}
                            className={`h-11 min-w-[40px] rounded-xl border px-2 text-base font-bold transition sm:min-w-[44px] sm:px-3 ${
                              isUsed
                                ? "border-white/5 bg-white/5 text-white/25"
                                : "border-white/10 bg-white/10 text-white hover:bg-white/20 active:scale-95"
                            }`}
                          >
                            {letter}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {solveOpen ? (
                  <form
                    onSubmit={solveWord}
                    className="mx-auto flex w-full max-w-md flex-col gap-2 sm:flex-row"
                  >
                    <input
                      autoFocus
                      value={solveGuess}
                      onChange={(event) => setSolveGuess(event.target.value)}
                      placeholder="اكتبوا الجواب كامل"
                      aria-label="الجواب"
                      className="h-12 min-w-0 flex-1 rounded-2xl border border-white/15 bg-black/25 px-4 text-center text-lg font-black text-white outline-none placeholder:text-white/35 focus:border-cyan-300/60"
                    />

                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <button
                        type="submit"
                        disabled={!solveGuess.trim()}
                        className="btn-primary"
                      >
                        تأكيد
                      </button>

                      <button
                        type="button"
                        onClick={() => setSolveOpen(false)}
                        className="btn-secondary"
                      >
                        رجوع
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setSolveOpen(true)}
                      className="btn-primary min-w-[170px]"
                    >
                      عرفتوها؟ حلّوها
                    </button>
                  </div>
                )}
              </div>
            )}

            {phase === "celebrate" && (
              <div className="mt-4">
                <div className="rounded-3xl border border-yellow-300/40 bg-yellow-400/15 px-6 py-8 shadow-2xl">
                  <p className="text-5xl">{winnerName ? "🏆" : "🤝"}</p>

                  <p className="mt-4 text-3xl font-black">
                    {winnerName || "تعادل"}
                  </p>

                  <p className="mt-2 text-lg text-white/85">
                    {winnerName
                      ? `أخذ الجولة بـ ${Math.max(score1, score2)} نقطة`
                      : `النقاط متساوية: ${score1}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </GameLayout>
    </>
  );
}
