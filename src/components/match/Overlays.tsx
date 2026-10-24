"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { WinnerType } from "@/types/game";

function useShowLock(show: boolean) {
  const lockedRef = useRef(false);

  useEffect(() => {
    if (show) {
      lockedRef.current = false;
    }
  }, [show]);

  return function runOnce(action: () => void) {
    if (lockedRef.current) {
      return;
    }

    lockedRef.current = true;
    action();
  };
}

export function OverlayShell({
  children,
  size = "md",
  zIndex = "z-[999]",
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  zIndex?: string;
}) {
  const width =
    size === "lg" ? "max-w-4xl" : size === "sm" ? "max-w-md" : "max-w-xl";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 ${zIndex} overflow-y-auto bg-black/75 px-4 py-6`}
    >
      <div className="flex min-h-full items-center justify-center">
        <div className={`arcade-card w-full ${width} p-5 text-center sm:p-8`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function OverlayHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <>
      {kicker && (
        <p className="text-sm font-black text-cyan-300/80">{kicker}</p>
      )}

      <h1 className="arcade-title mt-3">{title}</h1>

      {subtitle && (
        <p className="mt-3 text-base font-bold text-white/70 sm:text-lg">
          {subtitle}
        </p>
      )}
    </>
  );
}

export function TeamPickModal({
  show,
  kicker,
  title,
  subtitle,
  side1Name,
  side2Name,
  noneLabel = "ولا أحد",
  onPick,
}: {
  show: boolean;
  kicker: string;
  title: string;
  subtitle?: string;
  side1Name: string;
  side2Name: string;
  noneLabel?: string;
  onPick: (winner: WinnerType) => void;
}) {
  const runOnce = useShowLock(show);

  if (!show) return null;

  return (
    <OverlayShell>
      <OverlayHeading kicker={kicker} title={title} subtitle={subtitle} />

      <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => runOnce(() => onPick("side1"))}
          className="btn-team-1"
        >
          <span className="block truncate">{side1Name || "فريق 1"}</span>
        </button>

        <button
          type="button"
          onClick={() => runOnce(() => onPick("side2"))}
          className="btn-team-2"
        >
          <span className="block truncate">{side2Name || "فريق 2"}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => runOnce(() => onPick("none"))}
        className="btn-secondary mt-3 w-full"
      >
        {noneLabel}
      </button>
    </OverlayShell>
  );
}

function useKeyLock(resetKey: string | number) {
  const lockedRef = useRef(false);

  useEffect(() => {
    lockedRef.current = false;
  }, [resetKey]);

  return function runOnce(action: () => void) {
    if (lockedRef.current) {
      return;
    }

    lockedRef.current = true;
    action();
  };
}

export function InlineTeamPick({
  resetKey,
  title,
  side1Name,
  side2Name,
  noneLabel = "ولا أحد",
  onPick,
}: {
  resetKey: string | number;
  title: string;
  side1Name: string;
  side2Name: string;
  noneLabel?: string;
  onPick: (winner: WinnerType) => void;
}) {
  const runOnce = useKeyLock(resetKey);

  return (
    <div className="animate-fade-in-up mx-auto w-full max-w-xl">
      <p className="mb-2 text-center text-base font-black text-white/80">
        {title}
      </p>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => runOnce(() => onPick("side1"))}
          className="btn-team-1"
        >
          <span className="block truncate">{side1Name || "فريق 1"}</span>
        </button>

        <button
          type="button"
          onClick={() => runOnce(() => onPick("side2"))}
          className="btn-team-2"
        >
          <span className="block truncate">{side2Name || "فريق 2"}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => runOnce(() => onPick("none"))}
        className="btn-secondary mt-2 w-full"
      >
        {noneLabel}
      </button>
    </div>
  );
}

export function InlineJudge({
  resetKey,
  teamName,
  onCorrect,
  onWrong,
}: {
  resetKey: string | number;
  teamName: string;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  const runOnce = useKeyLock(resetKey);

  return (
    <div className="animate-fade-in-up mx-auto w-full max-w-xl">
      <p className="mb-2 text-center text-base font-black text-white/80">
        {teamName} عرفوها؟
      </p>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => runOnce(onCorrect)}
          className="btn-primary py-3 text-lg"
        >
          صح ✅
        </button>

        <button
          type="button"
          onClick={() => runOnce(onWrong)}
          className="btn-secondary py-3 text-lg"
        >
          غلط ❌
        </button>
      </div>
    </div>
  );
}
