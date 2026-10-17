import Image from 'next/image';
import { notFound } from 'next/navigation';

import { COUNTRIES } from '@/data/countries';

export default async function CountryFlagPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const {
    id,
  } = await params;

  const country =
    COUNTRIES.find(
      (item) =>
        item.id === id
    );

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
        bg-[#100b25]
        px-5
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
        <p className="text-sm font-black text-cyan-300/70">
          خل نلعب
        </p>

        <h1 className="mt-2 text-2xl font-black">
          خمن الدولة
        </h1>

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
            src={
              country.flag
            }
            alt="علم الدولة"
            width={512}
            height={512}
            priority
            className="
              aspect-square
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
          <p className="text-sm font-bold text-white/65">
            لا توري العلم للفريق اللي يحاول يخمن
          </p>
        </div>
      </div>
    </main>
  );
}
