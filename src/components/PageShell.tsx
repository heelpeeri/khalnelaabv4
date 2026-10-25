import Link from "next/link";
import type { ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";

export default function PageShell({
  title,
  children,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <main className="min-h-[100dvh] px-4 py-5 text-white sm:px-6">
      <div className={`mx-auto ${wide ? "max-w-3xl" : "max-w-2xl"}`}>
        <header className="mb-5 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-black sm:text-3xl">{title}</h1>

          <Link href="/" className="nav-pill shrink-0">
            <span aria-hidden="true">🏠</span>
            الرئيسية
          </Link>
        </header>

        {children}

        <SiteFooter />
      </div>
    </main>
  );
}
