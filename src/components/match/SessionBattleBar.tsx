import { getGameName } from "@/lib/matchLabels";
import type { GameType } from "@/lib/matchQueue";

export default function SessionBattleBar({
  side1Name,
  side2Name,
  side1Control,
  nextGame,
}: {
  side1Name: string;
  side2Name: string;
  side1Control: number;
  nextGame?: GameType;
}) {
  const boundaryPosition = 100 - side1Control;

  const markerPosition = Math.max(2, Math.min(98, boundaryPosition));

  return (
    <div
      className="
        mb-3
        w-full
        rounded-2xl
        border border-white/[0.08]
        bg-[#10081c]/95
        px-4 py-2

        md:fixed
        md:left-1/2
        md:top-3
        md:z-[50]
        md:mb-0
        md:w-[calc(100%_-_10rem)]
        md:max-w-[976px]
        md:-translate-x-1/2
      "
    >
      <div
        className="mb-1.5 grid grid-cols-[1fr_auto_1fr] items-center gap-3"
        dir="ltr"
      >
        <p
          dir="auto"
          className="min-w-0 truncate text-left text-[11px] font-black text-cyan-100/70 sm:text-xs"
        >
          {side2Name || "فريق 2"}
        </p>

        <div
          className="flex min-w-0 items-center justify-center gap-1.5"
          dir="rtl"
        >
          {nextGame ? (
            <>
              <span className="text-[10px] font-bold text-white/40">
                التالي:
              </span>

              <span className="max-w-[300px] truncate text-[11px] font-black text-white/75 sm:text-xs">
                {getGameName(nextGame)}
              </span>
            </>
          ) : (
            <span className="text-[11px] font-black text-amber-100/80 sm:text-xs">
              🏆 آخر لعبة
            </span>
          )}
        </div>

        <p
          dir="auto"
          className="min-w-0 truncate text-right text-[11px] font-black text-fuchsia-100/70 sm:text-xs"
        >
          {side1Name || "فريق 1"}
        </p>
      </div>

      <div className="relative">
        <div className="relative h-2.5 overflow-hidden rounded-full border border-white/[0.07] bg-gradient-to-r from-cyan-500 via-cyan-500 to-cyan-400">
          <div
            className="
              absolute inset-0
              origin-right
              bg-gradient-to-l
              from-fuchsia-600
              via-fuchsia-500
              to-purple-500
              transition-transform
              duration-700
              ease-[var(--ease-out)]
            "
            style={{
              transform: `scaleX(${side1Control / 100})`,
            }}
          />

          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/20" />
        </div>

        <div
          className="
            pointer-events-none
            absolute inset-0 z-20
            transition-transform
            duration-700
            ease-[var(--ease-out)]
          "
          style={{
            transform: `translateX(${markerPosition}%)`,
          }}
        >
          <div
            className="
              absolute left-0 top-1/2
              flex h-5 w-5
              -translate-x-1/2 -translate-y-1/2
              items-center justify-center
              rounded-full
              border border-white/15
              bg-[#130b20]
              text-[9px]
              shadow-[0_0_7px_rgba(139,92,246,.18)]
            "
          >
            🏆
          </div>
        </div>
      </div>
    </div>
  );
}
