# 004 — Faster, ease-out button press feedback

- **Status**: DONE
- **Commit**: 7071895
- **Severity**: MEDIUM
- **Category**: Physicality & origin / Easing & duration
- **Estimated scope**: 1 file, 1 rule

## Problem

All buttons (`.btn-primary`, `.btn-secondary`, `.btn-team-1`, `.btn-team-2`) share one transition, 200ms `ease` on six properties. Press feedback (`scale(0.97)` on `:active`, already present) should be 100–160ms ease-out; colors should use `ease`. These buttons are pressed constantly during a session.

```css
/* src/app/globals.css:131 — current */
transition:
  transform 0.2s ease,
  box-shadow 0.2s ease,
  background-color 0.2s ease,
  border-color 0.2s ease,
  filter 0.2s ease,
  opacity 0.2s ease;
```

## Target

```css
transition:
  transform 160ms var(--ease-out),
  box-shadow 200ms ease,
  background-color 200ms ease,
  border-color 200ms ease,
  filter 200ms ease,
  opacity 200ms ease;
```

## Steps

1. Replace the `transition` declaration in the `.btn-primary, .btn-secondary, .btn-team-1, .btn-team-2` block with the target.

## Boundaries

- Keep the existing `:active { transform: scale(0.97) }` and hover rules unchanged.

## Verification

- **Mechanical**: format, lint, build pass.
- **Feel check** (real phone): tap صح ✅ and team buttons; the press-in is immediate and crisp, release springs back quickly. Spamming taps never feels laggy.
- **Done when**: transform uses 160ms `var(--ease-out)`.
