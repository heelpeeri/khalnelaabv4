'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

import GameLayout from '@/components/match/GameLayout';
import {
  COUNTRIES,
  type CountryItem,
} from '@/data/countries';
import type { WinnerType } from '@/types/game';

type Props = {
  side1Name: string;
  side2Name: string;
  onRoundEnd: (winner?: WinnerType) => void;
  roundKey: number;
  currentRound?: number;
  timerEnabled?: boolean;
  timerSeconds?: number;
};

const usedIds = new Set<string>();

function shuffleArray<T>(items: T[]) {
  const array = [...items];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [
      array[j],
      array[i],
    ];
  }

  return array;
}

function pickCountries(): [CountryItem, CountryItem] {
  if (COUNTRIES.length - usedIds.size < 2) {
    usedIds.clear();
  }

  const available = COUNTRIES.filter(
    (item) => !usedIds.has(item.id)
  );

  const shuffled = shuffleArray(available);

  const first = shuffled[0];
  const second = shuffled[1];

  usedIds.add(first.id);
  usedIds.add(second.id);

  return [
    first,
    second,
  ];
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
    useState<[CountryItem, CountryItem] | null>(
      null
    );

  const [
    origin,
    setOrigin,
  ] =
    useState('');

  const [
    started,
    setStarted,
  ] =
    useState(false);

  const [
    timeLeft,
    setTimeLeft,
  ] =
    useState(timerSeconds);

  const [
    showAnswers,
    setShowAnswers,
  ] =
    useState(false);

  useEffect(() => {
    setOrigin(
      window.location.origin
    );

    setCountries(
      pickCountries()
    );

    setStarted(false);
    setShowAnswers(false);

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
      showAnswers ||
      timeLeft <= 0
    ) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        setTimeLeft(
          (current) =>
            current - 1
        );
      }, 1000);

    return () =>
      window.clearTimeout(
        timeout
      );
  }, [
    timerEnabled,
    started,
    showAnswers,
    timeLeft,
  ]);

  if (!countries) {
    return (
      <div className="p-8 text-center text-white">
        جاري تجهيز الأعلام...
      </div>
    );
  }

  const side1 =
    side1Name ||
    'فريق 1';

  const side2 =
    side2Name ||
    'فريق 2';

  const names = [
    side1,
    side2,
  ];

  const timerClass =
    timeLeft <= 10
      ? 'animate-pulse text-red-300'
      : 'text-cyan-300';

  return (
    <GameLayout
      title="خمن الدولة"
      side1={side1}
      side2={side2}
      side1Score={0}
      side2Score={0}
      turn="الفريقين"
      currentRound={currentRound}
    >
      <div
        className="mx-auto max-w-3xl space-y-4"
        dir="rtl"
      >
        <div className="rounded-2xl border border-cyan-300/15 bg-cyan-400/[0.06] px-4 py-3">
          <p className="text-center text-sm font-bold text-white/70">
            كل فريق يمسح كود الفريق الثاني ويشوف علمه، ثم يجاوب على أسئلته بنعم أو لا.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {countries.map(
            (
              country,
              index
            ) => (
              <div
                key={
                  country.id
                }
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-3
                  text-center
                "
              >
                <h3 className="mb-3 text-base font-black text-white">
                  كود{' '}
                  {
                    names[
                      index
                    ]
                  }
                </h3>

                <div className="mx-auto w-fit max-w-full rounded-xl bg-white p-3">
                  {origin ? (
                    <QRCode
                      value={`${origin}/country/${country.id}`}
                      size={
                        150
                      }
                      style={{
                        width:
                          '100%',
                        height:
                          'auto',
                        maxWidth:
                          150,
                      }}
                    />
                  ) : (
                    <div className="h-[150px] w-[150px]" />
                  )}
                </div>

                <p className="mt-2 text-xs font-bold text-white/50">
                  يمسحه الفريق الآخر
                </p>

                {showAnswers && (
                  <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2">
                    <p className="text-xs font-bold text-white/45">
                      الدولة
                    </p>

                    <p className="mt-1 text-lg font-black text-cyan-300">
                      {
                        country.nameAr
                      }
                    </p>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {timerEnabled &&
          started &&
          !showAnswers && (
            <div className="text-center">
              <p
                className={`text-2xl font-black ${timerClass}`}
              >
                ⏱️{' '}
                {timeLeft}{' '}
                ثانية
              </p>
            </div>
          )}

        {!started ? (
          <button
            type="button"
            onClick={() =>
              setStarted(
                true
              )
            }
            className="arcade-button w-full px-5 py-3 text-lg"
          >
            ابدأ التخمين
          </button>
        ) : !showAnswers ? (
          <button
            type="button"
            onClick={() =>
              setShowAnswers(
                true
              )
            }
            className="arcade-button w-full px-5 py-3 text-lg"
          >
            كشف الدول وتحديد الفائز
          </button>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() =>
                onRoundEnd(
                  'side1'
                )
              }
              className="arcade-button px-3 py-3"
            >
              فاز {side1}
            </button>

            <button
              type="button"
              onClick={() =>
                onRoundEnd(
                  'side2'
                )
              }
              className="arcade-button px-3 py-3"
            >
              فاز {side2}
            </button>

            <button
              type="button"
              onClick={() =>
                onRoundEnd(
                  'none'
                )
              }
              className="btn-secondary px-3 py-3"
            >
              تعادل / لا أحد
            </button>
          </div>
        )}
      </div>
    </GameLayout>
  );
}
