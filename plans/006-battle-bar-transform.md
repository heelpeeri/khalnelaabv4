# 006 — Session battle bar: animate transform, not width/left

- **Status**: TODO
- **Commit**: 7071895
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file, ~15 lines
- **Depends on**: 001

## Problem

The session tug-of-war bar animates `width` on the fill and `left` on the 🏆 marker (both layout properties, 700ms). It updates once per round; on low-end phones this re-lays out the bar each frame.

```tsx
// src/components/match/SessionBattleBar.tsx:~80 — fill, current
<div className="absolute inset-y-0 right-0 bg-gradient-to-l from-fuchsia-600 via-fuchsia-500 to-purple-500 transition-[width] duration-700 ease-out"
  style={{ width: `${side1Control}%` }} />

// SessionBattleBar.tsx:~100 — marker, current
<div className="pointer-events-none absolute top-1/2 z-20 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 ... transition-[left] duration-700 ease-out"
  style={{ left: `${markerPosition}%` }}>🏆</div>
```

## Target

Keep 700ms (explanatory meter, updates once per round) but use transform and the shared curve.

```tsx
// fill
<div className="absolute inset-0 origin-right bg-gradient-to-l from-fuchsia-600 via-fuchsia-500 to-purple-500 transition-transform duration-700 ease-[var(--ease-out)]"
  style={{ transform: `scaleX(${side1Control / 100})` }} />

// marker: a full-width track moved by translateX (% of its own = bar width)
<div className="pointer-events-none absolute inset-0 z-20 transition-transform duration-700 ease-[var(--ease-out)]"
  style={{ transform: `translateX(${markerPosition}%)` }}>
  <div className="absolute left-0 top-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#130b20] text-[9px] shadow-[0_0_7px_rgba(139,92,246,.18)]">
    🏆
  </div>
</div>
```

## Steps

1. Fill div: replace `inset-y-0 right-0` with `inset-0 origin-right`, `transition-[width]` with `transition-transform`, `ease-out` with `ease-[var(--ease-out)]`; replace `style={{ width: ... }}` with the transform style above.
2. Marker: wrap as shown. The outer div gets the transition and translateX; the inner keeps all visual classes, `left-0` and the centering translates. Remove `transition-[left]` and the `left` style.
3. The bar's parent already has `relative`; the marker track must be inside the same `relative` wrapper as before.

## Boundaries

- Only `SessionBattleBar.tsx`. Do not change `side1Control`/`markerPosition` math. The bar wrapper is `dir="ltr"` context-free; verify visually that team 1 (fuchsia) still grows from the right.

## Verification

- **Mechanical**: format, lint, tsc, build pass.
- **Feel check**: play a session; after each round the fuchsia fill and 🏆 marker move together smoothly to the same position as before the change (compare screenshots at 0-0, 3-0, 0-3).
- **Overflow check**: at 320px the page must not scroll horizontally (the translated track extends past the bar; `body` has `overflow-x: hidden`, confirm it still holds).
- **Done when**: no `transition-[width]` / `transition-[left]` in SessionBattleBar and positions match the old behaviour.
