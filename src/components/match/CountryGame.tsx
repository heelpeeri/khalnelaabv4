'use client';

import { useEffect, useState } from "react";

import GameLayout from "@/components/match/GameLayout";
import {
  COUNTRIES,
  type CountryItem,
} from "@/data/countries";
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

let countryDeck: CountryItem[] = [];

function shuffleArray<T>(items: T[]) {
  const array = [...items];

  for (
    let i = array.length - 1;
    i > 0;
    i -= 1
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [
      array[i],
      array[j],
    ] = [
      array[j],
      array[i],
    ];
  }

  return array;
}

function getNextCountries(
  count: number
) {
  if (
    countryDeck.length <
    count
  ) {
    countryDeck =
      shuffleArray(
        COUNTRIES
      );
  }

  return countryDeck.splice(
    0,
    count
  );
}

function createQrUrl(
  value: string
) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(
    value
  )}`;
}

export default function CountryGame({
  side1Name,
  side2Name,
  onRoundEnd,
  roundKey,
  currentRound = 1,
  timerEnabled = false,
  timerSeconds = 60,
}: Props) {
  const [
    countries,
    setCountries,
  ] =
    useState<
      [
        CountryItem,
        CountryItem,
      ] | null
    >(null);

  const [
    origin,
    setOrigin,
  ] =
    useState("");

  const [
    started,
    setStarted,
  ] =
    useState(false);

  const [
    revealed,
    setRevealed,
  ] =
    useState(false);

  const [
    timeLeft,
    setTimeLeft,
  ] =
    useState(
      timerSeconds
    );

  const side1 =
    side1Name ||
    "فريق 1";

  const side2 =
    side2Name ||
    "فريق 2";

  useEffect(() => {
    setOrigin(
      window.location.origin
    );

    const picked =
      getNextCountries(2);

    if (
      picked.length < 2
    ) {
      return;
    }

    setCountries([
      picked[0],
      picked[1],
    ]);

    setStarted(false);
    setRevealed(false);

    setTimeLeft(
      timerSeconds
    );
  }, [
    roundKey,
    timerSeconds,
  ]);

  useEffect(() => {
    if (
      !timerEnabled ||
      !started ||
      revealed ||
      timeLeft <= 0
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setTimeLeft(
            (current) =>
              Math.max(
                0,
                current - 1
              )
          );
        },
        1000
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    timerEnabled,
    started,
    revealed,
    timeLeft,
  ]);

  if (!countries) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center text-white">
        <p className="font-black">
          جاري تجهيز الدول...
        </p>
      </div>
    );
  }

  const [
    side1Country,
    side2Country,
  ] = countries;

  const side1FlagUrl =
    origin
      ? `${origin}/country/${side1Country.id}`
      : "";

  const side2FlagUrl =
    origin
      ? `${origin}/country/${side2Country.id}`
      : "";

  return (
    <GameLayout
      title="خمن الدولة"
      side1={side1}
      side2={side2}
      side1Score={0}
      side2Score={0}
      turn={
        started
          ? "اسألوا وخمنوا"
          : "امسحوا الأكواد"
      }
      currentRound={
        currentRound
      }
    >
      <div
        className="mx-auto w-full max-w-4xl"
        dir="rtl"
      >
        {!started ? (
          <>
            <div className="mb-4 text-center">
              <h2 className="text-xl font-black text-white sm:text-2xl">
                امسحوا الأكواد
              </h2>

              <p className="mt-2 text-sm font-bold text-white/45">
                كل فريق يمسح الكود حقه ويشوف علم الفريق الثاني بدون ما يوريهم
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-12">
              <div
                className="
                  rounded-[24px]
                  border
                  border-fuchsia-300/20
                  bg-fuchsia-500/[0.055]
                  p-4
                  text-center
                  shadow-[0_0_28px_rgba(217,70,239,.06)]
                "
              >
                <p className="text-sm font-black text-fuchsia-100">
                  {side1}
                </p>

                <p className="mt-1 text-xs font-bold text-white/40">
                  امسح الكود حقك
                </p>

                <div className="mx-auto mt-4 w-fit rounded-[20px] bg-white p-3">
                  {side2FlagUrl ? (
                    <img
                      src={createQrUrl(
                        side2FlagUrl
                      )}
                      alt={`QR ${side1}`}
                      width={190}
                      height={190}
                      className="h-[190px] w-[190px]"
                    />
                  ) : (
                    <div className="h-[190px] w-[190px]" />
                  )}
                </div>
              </div>

              <div
                className="
                  rounded-[24px]
                  border
                  border-cyan-300/20
                  bg-cyan-400/[0.055]
                  p-4
                  text-center
                  shadow-[0_0_28px_rgba(34,211,238,.06)]
                "
              >
                <p className="text-sm font-black text-cyan-100">
                  {side2}
                </p>

                <p className="mt-1 text-xs font-bold text-white/40">
                  امسح الكود حقك
                </p>

                <div className="mx-auto mt-4 w-fit rounded-[20px] bg-white p-3">
                  {side1FlagUrl ? (
                    <img
                      src={createQrUrl(
                        side1FlagUrl
                      )}
                      alt={`QR ${side2}`}
                      width={190}
                      height={190}
                      className="h-[190px] w-[190px]"
                    />
                  ) : (
                    <div className="h-[190px] w-[190px]" />
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
                setStarted(
                  true
                );

                setTimeLeft(
                  timerSeconds
                );
              }}
              className="arcade-button mt-5 w-full px-6 py-3 text-lg"
            >
              الكل شاف العلم؟ ابدأوا
            </button>
          </>
        ) : (
          <>
            <div
              className="
                rounded-[26px]
                border
                border-white/10
                bg-white/[0.035]
                px-5
                py-6
                text-center
              "
            >
              <p className="text-sm font-black text-cyan-300/70">
                خمن الدولة
              </p>

              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                اسألوا بعض أسئلة إجابتها نعم أو لا
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm font-bold leading-6 text-white/45">
                مثال: هل دولتي عربية؟ هل هي في آسيا؟ هل علمها فيه أحمر؟
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
                onClick={() =>
                  setRevealed(
                    true
                  )
                }
                className="arcade-button mt-5 w-full px-6 py-3 text-lg"
              >
                كشف الدول
              </button>
            ) : (
              <div className="mt-5">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10">
                  <div
                    className="
                      rounded-[24px]
                      border
                      border-fuchsia-300/20
                      bg-fuchsia-500/[0.055]
                      p-4
                      text-center
                    "
                  >
                    <p className="text-sm font-black text-fuchsia-100">
                      دولة {side1}
                    </p>

                    <div className="mt-3 overflow-hidden rounded-[18px] bg-white p-3">
                      <img
                        src={
                          side1Country.flag
                        }
                        alt={
                          side1Country.nameAr
                        }
                        className="mx-auto h-[150px] w-full object-contain"
                      />
                    </div>

                    <p className="mt-3 text-xl font-black text-white">
                      {
                        side1Country.nameAr
                      }
                    </p>
                  </div>

                  <div
                    className="
                      rounded-[24px]
                      border
                      border-cyan-300/20
                      bg-cyan-400/[0.055]
                      p-4
                      text-center
                    "
                  >
                    <p className="text-sm font-black text-cyan-100">
                      دولة {side2}
                    </p>

                    <div className="mt-3 overflow-hidden rounded-[18px] bg-white p-3">
                      <img
                        src={
                          side2Country.flag
                        }
                        alt={
                          side2Country.nameAr
                        }
                        className="mx-auto h-[150px] w-full object-contain"
                      />
                    </div>

                    <p className="mt-3 text-xl font-black text-white">
                      {
                        side2Country.nameAr
                      }
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onRoundEnd()
                  }
                  className="arcade-button mt-5 w-full px-6 py-3 text-lg"
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
