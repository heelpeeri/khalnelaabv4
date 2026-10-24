"use client";

import { useState } from "react";
import { OverlayShell } from "@/components/match/Overlays";
import { getHowToPlay } from "@/data/howToPlay";
import type { GameType } from "@/lib/matchQueue";

export default function HowToPlayButton({ game }: { game: GameType }) {
  const [open, setOpen] = useState(false);
  const info = getHowToPlay(game);

  if (!info) {
    return <div className="w-9 shrink-0" />;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`طريقة لعب ${info.title}`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-lg font-black text-white/80 transition-colors hover:bg-white/[0.12]"
      >
        ؟
      </button>

      {open && (
        <OverlayShell>
          <p className="text-sm font-black text-cyan-300/80">طريقة اللعب</p>

          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            {info.title}
          </h2>

          <ol className="mt-5 space-y-2 text-right">
            {info.how.map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2.5"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-xs font-black text-cyan-100">
                  {index + 1}
                </span>

                <span className="text-sm font-bold leading-6 text-white/85 sm:text-base">
                  {step}
                </span>
              </li>
            ))}
          </ol>

          {info.example && (
            <p className="mt-3 rounded-xl border border-yellow-300/15 bg-yellow-300/[0.06] px-3 py-2.5 text-sm font-bold text-yellow-50/80">
              {info.example}
            </p>
          )}

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="btn-primary mt-6 min-w-[140px]"
          >
            فهمت
          </button>
        </OverlayShell>
      )}
    </>
  );
}
