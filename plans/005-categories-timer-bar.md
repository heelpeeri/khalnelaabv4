# 005 — Smooth categories timer bar with transform

- **Status**: DONE
- **Commit**: 7071895
- **Severity**: MEDIUM
- **Category**: Performance / Easing
- **Estimated scope**: 1 file, ~5 lines

## Problem

The countdown bar in إنسان حيوان نبات جماد بلاد animates `width` (layout) for 1000ms with the default ease curve. Because it is retargeted every second, each second accelerates and decelerates, so the bar visibly pulses instead of draining steadily.

```tsx
// src/components/match/CategoriesGame.tsx:158 — current
const progressWidth =
  timerEnabled && timerSeconds > 0
    ? `${Math.max(0, Math.min(100, (timeLeft / timerSeconds) * 100))}%`
    : "100%";

// src/components/match/CategoriesGame.tsx:240 — current
<div
  className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 transition-[width] duration-1000"
  style={{ width: progressWidth }}
/>;
```

## Target

Constant motion uses `linear`; animate `transform` only. The bar is anchored at the right (RTL start).

```tsx
const progressScale =
  timerEnabled && timerSeconds > 0
    ? Math.max(0, Math.min(1, timeLeft / timerSeconds))
    : 1;

<div
  className="h-full w-full origin-right bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 transition-transform duration-1000 ease-linear"
  style={{ transform: `scaleX(${progressScale})` }}
/>;
```

## Steps

1. Replace the `progressWidth` constant with `progressScale` as above (remove `progressWidth`).
2. Replace the bar `div`'s className and style as above.
3. Confirm `progressWidth` is not referenced anywhere else (`grep -n progressWidth`).

## Boundaries

- Only `CategoriesGame.tsx`. Do not change timer logic.

## Verification

- **Mechanical**: format, lint, tsc, tests, build pass.
- **Feel check**: start the categories game with the timer on; the bar drains at a steady speed, shrinking toward the left, with no pulse each second.
- **Done when**: no `transition-[width]` in CategoriesGame.
