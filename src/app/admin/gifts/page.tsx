import type { Metadata } from "next";
import GiftCodeForm from "@/components/GiftCodeForm";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "أكواد الهدايا",
  robots: { index: false, follow: false },
};

export default function GiftCodesPage() {
  return (
    <PageShell title="أكواد الهدايا 🎁">
      <GiftCodeForm />
    </PageShell>
  );
}
