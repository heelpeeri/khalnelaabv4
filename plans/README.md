# Animation plans

From an `improve-animations` audit. Execute in this order; 001 must land first because the others use `var(--ease-out)`.

| #   | Plan                                                        | Severity | Status |
| --- | ----------------------------------------------------------- | -------- | ------ |
| 001 | [Shared easing tokens](001-easing-tokens.md)                | LOW      | TODO   |
| 002 | [Turn/score cards transition](002-turn-cards-transition.md) | HIGH     | TODO   |
| 003 | [Judge buttons ease-out](003-fade-in-up-easing.md)          | MEDIUM   | TODO   |
| 004 | [Button press feedback](004-button-press-feedback.md)       | MEDIUM   | TODO   |
| 005 | [Categories timer bar](005-categories-timer-bar.md)         | MEDIUM   | TODO   |
| 006 | [Battle bar transform](006-battle-bar-transform.md)         | MEDIUM   | TODO   |

Dependencies: 002, 003, 006 depend on 001. 004 and 005 are independent.

Not planned (kept by choice): overlay pop starting scale, reduced-motion granularity, setup timer toggle knob, home CTA `transition-all`. `LogoGame.tsx` is out of scope by owner request.
