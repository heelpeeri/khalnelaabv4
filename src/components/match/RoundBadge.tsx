export default function RoundBadge({ currentRound = 1 }: { currentRound?: number }) {
  return (
    <div className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] text-2xl font-black text-white shadow-[0_0_18px_rgba(139,92,246,0.35)]">
      {currentRound}
    </div>
  );
}
