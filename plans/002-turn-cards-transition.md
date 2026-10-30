# 002 — Replace transition-all on turn/score cards

- **Status**: TODO
- **Commit**: 7071895
- **Severity**: HIGH
- **Category**: Performance / Easing & duration
- **Estimated scope**: 1 file, 8 class edits
- **Depends on**: 001

## Problem

The three header cards in every game (team 1, current turn, team 2) change on every turn. They use `transition-all duration-500`. `transition-all` animates every property (including padding/min-height on breakpoint changes) and the 500ms duration is above the 300ms UI budget. The background gradient (`background-image`) cannot transition, so it snaps instantly while border, shadow and opacity lag for half a second — the card visibly flickers in two steps.

```text
src/components/match/GameLayout.tsx:200  transition-all / :201 duration-500   (team 1 card)
src/components/match/GameLayout.tsx:251  transition-all / :252 duration-500   (team 1 score text)
src/components/match/GameLayout.tsx:280  transition-all / :281 duration-500   (current-turn card)
src/components/match/GameLayout.tsx:382  transition-all / :383 duration-500   (team 2 card)
src/components/match/GameLayout.tsx:433  transition-all / :434 duration-500   (team 2 score text)
src/components/match/GameLayout.tsx:233  transition-colors / :234 duration-500 (team 1 name)
src/components/match/GameLayout.tsx:344  transition-colors / :345 duration-500 (turn name)
src/components/match/GameLayout.tsx:415  transition-colors / :416 duration-500 (team 2 name)
```

## Target

- Cards (200, 280, 382): `transition-[opacity,border-color,box-shadow,background-color]` + `duration-200` + `ease-[var(--ease-out)]`.
- Score text (251, 433) and names (233, 344, 415): `transition-colors` + `duration-200` + `ease-[var(--ease-out)]`.

## Repo conventions to follow

- Classes are written one per line inside template literals in this file; keep that layout.
- Arbitrary property transitions already exist in the repo, e.g. `transition-[width]` in `src/components/match/SessionBattleBar.tsx`.

## Steps

1. Lines 200, 280, 382: replace `transition-all` with `transition-[opacity,border-color,box-shadow,background-color]`.
2. Lines 251, 433: replace `transition-all` with `transition-colors`.
3. All eight `duration-500` lines listed above: replace with `duration-200`, and add a new line `ease-[var(--ease-out)]` directly after each.

## Boundaries

- Only `src/components/match/GameLayout.tsx`. No markup or color changes.
- Do NOT touch `LogoGame.tsx`. If line numbers drifted, match by the class text and STOP if ambiguous.

## Verification

- **Mechanical**: format, lint, tsc, build pass; `grep -c "transition-all" src/components/match/GameLayout.tsx` → 0.
- **Feel check**: start a session with خمن الكلمة; when the turn passes, the highlighted card's border, glow and dimming settle together in ~0.2s with no two-step flicker. DevTools Animations at 10%: no padding/size interpolation.
- **Done when**: no `transition-all` and no `duration-500` remain in GameLayout.
