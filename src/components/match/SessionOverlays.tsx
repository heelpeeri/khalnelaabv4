import { OverlayHeading, OverlayShell } from "@/components/match/Overlays";
import { quizCategoryMeta } from "@/data/quiz/meta";
import { getGameName, getRoundsLabel } from "@/lib/matchLabels";
import type { Round } from "@/lib/matchQueue";
import type { GameStat, ModeType, RoundStat } from "@/types/match";

function getGameStats(roundStats: RoundStat[]) {
  return roundStats.reduce<GameStat[]>((result, stat) => {
    const existing = result.find((item) => item.game === stat.game);

    if (existing) {
      existing.total += 1;

      if (stat.winner === "side1") {
        existing.side1Wins += 1;
      }

      if (stat.winner === "side2") {
        existing.side2Wins += 1;
      }

      if (stat.winner === "none") {
        existing.draws += 1;
      }

      return result;
    }

    result.push({
      game: stat.game,
      side1Wins: stat.winner === "side1" ? 1 : 0,
      side2Wins: stat.winner === "side2" ? 1 : 0,
      draws: stat.winner === "none" ? 1 : 0,
      total: 1,
    });

    return result;
  }, []);
}

export function WinnerOverlay({
  show,
  winnerName,
  isDraw,
  mode,
  side1Name,
  side2Name,
  side1Score,
  side2Score,
  roundStats,
  sharing,
  onRestart,
  onGoHome,
  onShare,
}: {
  show: boolean;
  winnerName: string;
  isDraw: boolean;
  mode: ModeType;
  side1Name: string;
  side2Name: string;
  side1Score: number;
  side2Score: number;
  roundStats: RoundStat[];
  sharing: boolean;
  onRestart: () => void;
  onGoHome: () => void;
  onShare: () => void;
}) {
  if (!show) return null;

  const totalDraws = roundStats.filter((stat) => stat.winner === "none").length;

  const gameStats = getGameStats(roundStats);

  const side1Leads = side1Score > side2Score;

  const side2Leads = side2Score > side1Score;

  return (
    <OverlayShell size="lg">
      <OverlayHeading
        kicker={mode === "quick" ? "خلصت اللعبة" : "خلصت الجلسة"}
        title={isDraw ? "تعادل! 🤝" : "كفووو! 🏆"}
      />

      <p className="mt-2 truncate text-xl font-black text-white sm:text-3xl">
        {isDraw ? "الفريقين قدّها" : `الفائز: ${winnerName}`}
      </p>

      <div className="mx-auto mt-5 grid max-w-2xl grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:mt-6 sm:gap-4">
        <div
          className={`min-w-0 rounded-[24px] border p-3 sm:p-5 ${
            side1Leads
              ? "border-fuchsia-300/80 bg-gradient-to-br from-fuchsia-500/40 to-purple-500/20"
              : "border-fuchsia-300/30 bg-fuchsia-500/10"
          }`}
        >
          <p className="truncate text-sm font-black text-fuchsia-100/90 sm:text-base">
            {side1Leads && "👑 "}
            {side1Name || "فريق 1"}
          </p>

          <p className="mt-2 text-5xl font-black leading-none text-fuchsia-50 sm:text-6xl">
            {side1Score}
          </p>
        </div>

        <div className="flex items-center justify-center text-2xl font-black text-white/25 sm:text-3xl">
          -
        </div>

        <div
          className={`min-w-0 rounded-[24px] border p-3 sm:p-5 ${
            side2Leads
              ? "border-cyan-300/80 bg-gradient-to-br from-cyan-400/40 to-blue-500/20"
              : "border-cyan-300/30 bg-cyan-400/10"
          }`}
        >
          <p className="truncate text-sm font-black text-cyan-100/90 sm:text-base">
            {side2Leads && "👑 "}
            {side2Name || "فريق 2"}
          </p>

          <p className="mt-2 text-5xl font-black leading-none text-cyan-50 sm:text-6xl">
            {side2Score}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm font-bold text-white/45">
        {getRoundsLabel(roundStats.length)}
        {totalDraws > 0 && ` • تعادل ${totalDraws}`}
      </p>

      {mode === "session" && gameStats.length > 1 && (
        <div className="mt-5 border-t border-white/10 pt-4 text-right">
          <p className="mb-3 text-base font-black text-white/80">
            نتايج الألعاب
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {gameStats.map((stat) => (
              <div
                key={stat.game}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white sm:text-base">
                    {getGameName(stat.game)}
                  </p>

                  <p className="text-xs font-bold text-white/40">
                    {getRoundsLabel(stat.total)}
                    {stat.draws > 0 && ` • تعادل ${stat.draws}`}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5" dir="rtl">
                  <span
                    className={`flex h-9 min-w-[38px] items-center justify-center rounded-xl border px-2 text-lg font-black ${
                      stat.side1Wins > stat.side2Wins
                        ? "border-fuchsia-300/70 bg-fuchsia-500/30 text-fuchsia-50"
                        : "border-fuchsia-300/25 bg-fuchsia-500/10 text-fuchsia-100/70"
                    }`}
                  >
                    {stat.side1Wins}
                  </span>

                  <span className="text-white/25">-</span>

                  <span
                    className={`flex h-9 min-w-[38px] items-center justify-center rounded-xl border px-2 text-lg font-black ${
                      stat.side2Wins > stat.side1Wins
                        ? "border-cyan-300/70 bg-cyan-400/30 text-cyan-50"
                        : "border-cyan-300/25 bg-cyan-400/10 text-cyan-100/70"
                    }`}
                  >
                    {stat.side2Wins}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
        <button type="button" onClick={onRestart} className="btn-primary">
          {mode === "quick" ? "نعيدها؟" : "تحدي جديد"}
        </button>

        <button
          type="button"
          onClick={onShare}
          disabled={sharing}
          className="btn-secondary"
        >
          📤 شارك النتيجة
        </button>

        <button type="button" onClick={onGoHome} className="btn-secondary">
          الرئيسية
        </button>
      </div>
    </OverlayShell>
  );
}

export function CountdownOverlay({ countdown }: { countdown: number }) {
  return (
    <OverlayShell size="sm" zIndex="z-[998]">
      <p className="text-xl font-black text-white/70">استعدوا</p>

      <p key={countdown} className="arcade-title animate-fade-in-up mt-4">
        {countdown === 0 ? "يلا!" : countdown}
      </p>
    </OverlayShell>
  );
}

export function TransitionOverlay({ nextRound }: { nextRound: Round }) {
  return (
    <OverlayShell zIndex="z-[998]">
      <p className="text-sm font-black text-cyan-300/80">اللي بعدها</p>

      <p className="mt-4 text-3xl font-black text-white sm:text-4xl">
        {getGameName(nextRound.game)}
      </p>

      {nextRound.category && (
        <p className="mt-3 text-base font-bold text-white/60">
          {quizCategoryMeta[nextRound.category].emoji}{" "}
          {quizCategoryMeta[nextRound.category].title}
        </p>
      )}
    </OverlayShell>
  );
}

export function RoundResultOverlay({
  show,
  winnerName,
  isDraw,
}: {
  show: boolean;
  winnerName: string;
  isDraw: boolean;
}) {
  if (!show) return null;

  return (
    <OverlayShell>
      <OverlayHeading
        kicker="خلصت الجولة"
        title={isDraw ? "تعادل! 🤝" : "كفووو! 🏆"}
      />

      <p className="arcade-winner mt-5 truncate">
        {isDraw ? "محد أخذ نقطة الجولة" : `الجولة لـ ${winnerName}`}
      </p>
    </OverlayShell>
  );
}
