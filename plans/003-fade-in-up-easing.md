# 003 — Strong ease-out for the per-round judge buttons

- **Status**: DONE
- **Commit**: 7071895
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 file, 1 line
- **Depends on**: 001

## Problem

`InlineTeamPick` and `InlineJudge` (`src/components/match/Overlays.tsx:173`, `:225`) appear at the end of every round using `.animate-fade-in-up`, which uses the weak built-in `ease`. Entrances should use a strong ease-out so they arrive fast and settle.

```css
/* src/app/globals.css:295 — current */
.animate-fade-in-up {
  animation: fade-in-up 0.25s ease;
}
```

## Target

```css
.animate-fade-in-up {
  animation: fade-in-up 0.2s var(--ease-out);
}
```

## Steps

1. Edit `src/app/globals.css:296` to the target line.

## Boundaries

- Do not change the `@keyframes fade-in-up` values. `LogoGame.tsx:414` also uses this class; that is acceptable because the change is global CSS, but do NOT edit LogoGame.tsx itself.

## Verification

- **Mechanical**: format, lint, build pass.
- **Feel check**: finish a round of أسئلة وأجوبة; the صح/غلط or team buttons appear immediately and settle, with no slow start. At 10% playback the movement front-loads.
- **Done when**: the rule reads exactly as the target.
