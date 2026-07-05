import { SCRAMBLE_QUESTIONS } from "@/data/scramble";

export default function PersonPage({ params }: { params: { id: string } }) {
  const person = SCRAMBLE_QUESTIONS.find((p) => p.id === params.id);

  if (!person) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        الشخص غير موجود
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-4 text-white">
      <div className="text-center">
        <img
          src={person.image}
          alt={person.answer}
          className="mx-auto max-h-[75vh] rounded-3xl object-contain"
        />

        <p className="mt-5 text-xl font-black">
          اوصف الشخصية بدون ما تقول الاسم
        </p>
      </div>
    </main>
  );
}
