# 001 — Add shared motion easing tokens

- **Status**: DONE
- **Commit**: 7071895
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 2 files, ~6 lines

## Problem

There are no shared easing tokens. Curves are either Tailwind defaults or typed by hand, so plans 002–006 have nothing to reference.

```css
/* src/app/globals.css:5 — current (no motion tokens) */
:root {
  --bg-start: #070012;
  ...
  --text-main: #ffffff;
}
```

```tsx
// src/app/guide/page.tsx:89 — current, hand-typed curve
transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
```

## Target

```css
:root {
  /* existing color tokens unchanged */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}
```

## Repo conventions to follow

- Design tokens are CSS custom properties in the `:root` block of `src/app/globals.css` (see `--brand-cyan` at line 12).
- Tailwind can consume them with arbitrary values: `ease-[var(--ease-out)]`.

## Steps

1. In `src/app/globals.css`, inside `:root`, after `--text-main: #ffffff;`, add a blank line and the three `--ease-*` lines above, verbatim.
2. In `src/app/guide/page.tsx:89`, replace `"cubic-bezier(0.16, 1, 0.3, 1)"` with `"var(--ease-out)"`.

## Boundaries

- Do NOT change any other animation in this plan.
- Do NOT touch `src/components/match/LogoGame.tsx` (owner request).
- Do NOT add dependencies. If the code differs from the excerpts, STOP and report.

## Verification

- **Mechanical**: `npm run format:check && npm run lint && npx tsc --noEmit && npm run build` all pass.
- **Feel check**: open `/guide`, tap a game card to flip it; the flip should feel the same or slightly snappier at the start, never sluggish.
- **Done when**: `grep -n "ease-out" src/app/globals.css` shows the token and `guide/page.tsx` uses `var(--ease-out)`.
