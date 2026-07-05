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
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <h1 className="text-3xl font-bold">الشخص غير موجود</h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6">
      <img
        src={person.image}
        alt={person.answer}
        className="max-h-[90vh] rounded-3xl object-contain"
      />
    </main>
  );
}
