import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import UnlockForm from "@/components/UnlockForm";
import { safeNextPath } from "@/lib/licenseCookie";

export const metadata: Metadata = {
  title: "فعّل خل نلعب",
  robots: { index: false },
};

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; next?: string; error?: string }>;
}) {
  const { code, next, error } = await searchParams;

  return (
    <PageShell title="عندي كود">
      <UnlockForm
        initialCode={code ?? ""}
        next={safeNextPath(next)}
        paymentError={error === "payment"}
      />
    </PageShell>
  );
}
