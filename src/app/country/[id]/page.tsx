import Image from "next/image";
import { notFound } from "next/navigation";

import { COUNTRIES } from "@/data/countries";

export default async function CountryFlagPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const country = COUNTRIES.find((item) => item.id === id);

  if (!country) {
    notFound();
  }

  return (
    <main
      className="
        flex
        min-h-[100dvh]
        items-center
        justify-center
        px-5
        py-8
        text-white
      "
      dir="rtl"
    >
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-6
          text-center
          shadow-2xl
        "
      >
        <p className="text-sm font-black text-cyan-300/70">خل نلعب</p>

        <h1 className="mt-2 text-2xl font-black">خمن العلم 🚩</h1>

        <p className="mt-2 text-sm font-bold text-white/55">
          هذا العلم اللي لازم الفريق الثاني يخمنه
        </p>

        <div
          className="
            mx-auto
            mt-6
            overflow-hidden
            rounded-2xl
            bg-white
            p-4
          "
        >
          <Image
            src={country.flag}
            alt="العلم"
            width={640}
            height={427}
            priority
            sizes="(max-width: 480px) 90vw, 400px"
            className="
              aspect-[4/3]
              w-full
              object-contain
            "
          />
        </div>

        <div
          className="
            mt-5
            rounded-2xl
            border
            border-yellow-300/15
            bg-yellow-300/[0.06]
            px-4
            py-3
          "
        >
          <p className="text-sm font-bold text-yellow-50/80">
            لا توريه الفريق الثاني 🤫
          </p>
        </div>
      </div>
    </main>
  );
}
