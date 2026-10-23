import { WHO_GAME } from "@/data/scramble";

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const person = WHO_GAME.find((p) => p.id === id);

  if (!person) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center px-5 text-center text-white">
        <h1 className="text-2xl font-black">
          ما لقينا الشخصية 🤔
        </h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-4 py-6 text-center text-white">
      <p className="text-sm font-black text-cyan-300/70">
        منهو ذا؟
      </p>

      <img
        src={person.image}
        alt="الشخصية"
        className="max-h-[75dvh] w-auto max-w-full rounded-3xl object-contain"
      />

      <p className="rounded-full border border-yellow-300/20 bg-yellow-300/[0.07] px-4 py-2 text-sm font-bold text-yellow-50/80">
        اوصفها بدون ما تقول الاسم 🤫
      </p>
    </main>
  );
}
