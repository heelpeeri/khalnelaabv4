import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PolicySection from "@/components/PolicySection";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "تواصل معنا | خل نلعب",
};

export default function ContactPage() {
  return (
    <PageShell title="تواصل معنا">
      <div className="space-y-3">
        <PolicySection title="الإيميل">
          <p>
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="text-lg font-black text-cyan-200 underline"
              dir="ltr"
            >
              {SITE.contactEmail}
            </a>
          </p>
          <p>نرد عادة خلال يومين عمل.</p>
        </PolicySection>

        <PolicySection title="لو عندك مشكلة في الشراء">
          <p>
            أرسل لنا رقم العملية اللي وصلك من ميسر، ونرجع لك كود التفعيل. وتقدر
            تسترجعه بنفسك من صفحة «عندي كود».
          </p>
        </PolicySection>
      </div>
    </PageShell>
  );
}
