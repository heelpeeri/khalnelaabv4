import type { ReactNode } from "react";

export default function PolicySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <h2 className="text-lg font-black text-white">{title}</h2>

      <div className="mt-2 space-y-2 text-sm font-medium leading-7 text-white/75 sm:text-base">
        {children}
      </div>
    </section>
  );
}
