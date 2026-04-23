import { GlassCard } from "@/components/GlassCard";
import { Logo } from "@/components/Logo";

export default function EndPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <GlassCard className="w-full max-w-2xl p-8 text-center">
        <Logo size={120} />
        <h1 className="mt-4 text-3xl font-black">انتهت اللعبة</h1>
        <p className="mt-3 text-white/80">هذه صفحة النهاية المبدئية. الترتيب النهائي ومشاركة الصورة تضاف هنا.</p>

        <div className="mt-8 rounded-3xl border border-white/20 bg-white/10 p-5 text-right">
          <div className="flex items-center justify-between rounded-2xl bg-black/10 p-4">
            <span className="font-bold">1. اللاعب</span>
            <span className="text-xl font-black">0</span>
          </div>
        </div>
      </GlassCard>
    </main>
  );
}