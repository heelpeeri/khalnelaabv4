"use client";

import { useEffect, useState } from "react";

import QrCode from "@/components/QrCode";
import GameLayout from "@/components/match/GameLayout";
import { COUNTRIES, type CountryItem } from "@/data/countries";
import { createDeck } from "@/lib/deck";
import { readRoundState, writeRoundState } from "@/lib/roundState";
import type { WinnerType } from "@/types/game";

type Props = {
  side1Name: string;
  side2Name: string;
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  currentRound?: number;
  timerEnabled?: boolean;
  timerSeconds?: number;
};

const countryDeck = createDeck(COUNTRIES);

type CountryRoundState = {
  countries: [CountryItem, CountryItem];
  started: boolean;
  revealed: boolean;
};

const actionButtonClass = "btn-primary mt-5 w-full py-3 text-lg";

export default function CountryGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
  currentRound = 1,
  timerEnabled = false,
  timerSeconds = 60,
}: Props) {
  const [countries, setCountries] = useState<[CountryItem, CountryItem] | null>(
    null,
  );

  const [origin, setOrigin] = useState("");

  const [started, setStarted] = useState(false);

  const [revealed, setRevealed] = useState(false);

  const [timeLeft, setTimeLeft] = useState(timerSeconds);

  const side1 = side1Name || "فريق 1";

  const side2 = side2Name || "فريق 2";

  useEffect(() => {
    setOrigin(window.location.origin);

    setTimeLeft(timerSeconds);

    const saved = readRoundState<CountryRoundState>("country", roundKey);

    if (saved && saved.countries.length === 2) {
      setCountries(saved.countries);
      setStarted(saved.started);
      setRevealed(saved.revealed);
      return;
    }

    const picked = countryDeck.draw(2);

    if (picked.length < 2) {
      return;
    }

    setCountries([picked[0], picked[1]]);

    setStarted(false);
    setRevealed(false);
  }, [roundKey, timerSeconds]);

  useEffect(() => {
    if (!countries) {
      return;
    }

    writeRoundState<CountryRoundState>("country", roundKey, {
      countries,
      started,
      revealed,
    });
  }, [roundKey, countries, started, revealed]);

  useEffect(() => {
    if (!timerEnabled || !started || revealed || timeLeft <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [timerEnabled, started, revealed, timeLeft]);

  if (!countries) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center text-white">
        <p className="font-black">جاري تجهيز الأعلام...</p>
      </div>
    );
  }

  const [side1Country, side2Country] = countries;

  const side1FlagUrl = origin ? `${origin}/country/${side1Country.id}` : "";

  const side2FlagUrl = origin ? `${origin}/country/${side2Country.id}` : "";

  return (
    <GameLayout
      title="خمن العلم"
      side1={side1}
      side2={side2}
      side1Score={0}
      side2Score={0}
      sideStatus={
        revealed
          ? { side1: "🚩 انكشف", side2: "🚩 انكشف" }
          : started
            ? { side1: "يخمنون 🤔", side2: "يخمنون 🤔" }
            : { side1: "يمسحون 📱", side2: "يمسحون 📱" }
      }
      turn={started ? "خمنوا الأعلام" : "جاهزين؟ 👀"}
      neutralTurnStyle="duo"
      currentRound={currentRound}
      game="country"
    >
      <div className="mx-auto w-full max-w-5xl" dir="rtl">
        {!started ? (
          <>
            <div className="mb-4 text-center">
              <h2 className="text-xl font-black text-white sm:text-2xl">
                كل فريق يمسح كوده
              </h2>

              <p className="mt-2 text-sm font-bold text-white/50">
                بيطلع لكم العلم اللي لازم الفريق الثاني يخمنه
              </p>
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                sm:gap-8
                lg:gap-16
              "
            >
              <div
                className="
                  mx-auto
                  w-full
                  max-w-[310px]
                  rounded-[20px]
                  border
                  border-fuchsia-300/20
                  bg-fuchsia-500/[0.045]
                  p-3
                  text-center
                  shadow-[0_0_24px_rgba(217,70,239,.05)]
                "
              >
                <p className="text-base font-black text-fuchsia-100">{side1}</p>

                <div className="mx-auto mt-3 w-fit rounded-[16px] bg-white p-2">
                  {side2FlagUrl ? (
                    <QrCode
                      value={side2FlagUrl}
                      label={`كود ${side1}`}
                      className="h-[200px] w-[200px]"
                    />
                  ) : (
                    <div className="h-[200px] w-[200px]" />
                  )}
                </div>
              </div>

              <div
                className="
                  mx-auto
                  w-full
                  max-w-[310px]
                  rounded-[20px]
                  border
                  border-cyan-300/20
                  bg-cyan-400/[0.045]
                  p-3
                  text-center
                  shadow-[0_0_24px_rgba(34,211,238,.05)]
                "
              >
                <p className="text-base font-black text-cyan-100">{side2}</p>

                <div className="mx-auto mt-3 w-fit rounded-[16px] bg-white p-2">
                  {side1FlagUrl ? (
                    <QrCode
                      value={side1FlagUrl}
                      label={`كود ${side2}`}
                      className="h-[200px] w-[200px]"
                    />
                  ) : (
                    <div className="h-[200px] w-[200px]" />
                  )}
                </div>
              </div>
            </div>

            <div
              className="
                mx-auto
                mt-5
                w-fit
                rounded-full
                border
                border-yellow-300/20
                bg-yellow-300/[0.07]
                px-5
                py-2
                text-center
                text-sm
                font-black
                text-yellow-100/85
              "
            >
              اللي يسكن كود الفريق اللي ضده يا ويله 👀
            </div>

            <button
              type="button"
              onClick={() => {
                setStarted(true);

                setTimeLeft(timerSeconds);
              }}
              className={actionButtonClass}
            >
              الكل شاف العلم؟ ابدأوا
            </button>
          </>
        ) : (
          <>
            <div
              className="
                rounded-[24px]
                border
                border-white/10
                bg-white/[0.035]
                px-5
                py-6
                text-center
              "
            >
              <h2 className="text-2xl font-black text-white sm:text-3xl">
                وش علمكم؟ 🤔
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm font-bold leading-6 text-white/55">
                اسألوا الفريق الثاني أسئلة جوابها نعم أو لا لين تعرفون علمكم
              </p>

              {timerEnabled && (
                <div
                  className={`
                    mx-auto
                    mt-5
                    w-fit
                    rounded-full
                    border
                    px-5
                    py-2
                    text-lg
                    font-black

                    ${
                      timeLeft <= 10
                        ? "border-red-300/30 bg-red-400/10 text-red-200"
                        : "border-cyan-300/20 bg-cyan-400/[0.07] text-cyan-100"
                    }
                  `}
                >
                  ⏱️ {timeLeft} ثانية
                </div>
              )}
            </div>

            {!revealed ? (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className={actionButtonClass}
              >
                كشف الأعلام
              </button>
            ) : (
              <div className="mt-5">
                <div className="grid grid-cols-2 gap-3 sm:gap-12">
                  <div
                    className="
                      rounded-[22px]
                      border
                      border-fuchsia-300/20
                      bg-fuchsia-500/[0.055]
                      p-3
                      text-center
                      sm:p-4
                    "
                  >
                    <p className="text-sm font-black text-fuchsia-100">
                      علم {side1}
                    </p>

                    <div className="mt-3 overflow-hidden rounded-[16px] bg-white p-2 sm:p-3">
                      <img
                        src={side1Country.flag}
                        alt={side1Country.nameAr}
                        className="mx-auto h-[110px] w-full object-contain sm:h-[145px]"
                      />
                    </div>

                    <p className="mt-3 text-base font-black text-white sm:text-xl">
                      {side1Country.nameAr}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-[22px]
                      border
                      border-cyan-300/20
                      bg-cyan-400/[0.055]
                      p-3
                      text-center
                      sm:p-4
                    "
                  >
                    <p className="text-sm font-black text-cyan-100">
                      علم {side2}
                    </p>

                    <div className="mt-3 overflow-hidden rounded-[16px] bg-white p-2 sm:p-3">
                      <img
                        src={side2Country.flag}
                        alt={side2Country.nameAr}
                        className="mx-auto h-[110px] w-full object-contain sm:h-[145px]"
                      />
                    </div>

                    <p className="mt-3 text-base font-black text-white sm:text-xl">
                      {side2Country.nameAr}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRoundEnd()}
                  className={actionButtonClass}
                >
                  إنهاء الجولة
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </GameLayout>
  );
}
