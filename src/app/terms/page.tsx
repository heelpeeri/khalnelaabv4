import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PolicySection from "@/components/PolicySection";
import { SITE } from "@/data/site";
import { PRICING } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "الشروط وسياسة الاسترجاع | خل نلعب",
};

export default function TermsPage() {
  return (
    <PageShell title="الشروط والاسترجاع">
      <div className="space-y-3">
        <PolicySection title="السعر والدفع">
          <p>
            السعر الأساسي {PRICING.basePrice} ريال، ويدفع مرة واحدة فقط بدون
            اشتراك. قد نقدم سعرًا مخفضًا لفترة محدودة ويظهر وقتها في صفحة
            الشراء.
          </p>
          <p>
            الدفع يتم عبر بوابة ميسر المرخصة من البنك المركزي السعودي، وبيانات
            بطاقتك ما تمر علينا أبدًا.
          </p>
        </PolicySection>

        <PolicySection title="كود التفعيل">
          <p>
            بعد الدفع يظهر لك كود تفعيل تقدر تستخدمه لتفعيل اللعبة على أجهزتك.
            الكود شخصي لك وللعب مع أهلك وربعك، ولا يسمح بنشره للعامة أو بيعه.
          </p>
          <p>أكواد الهدايا والتجربة قد تكون لمدة محددة، ويحق لنا إيقافها.</p>
        </PolicySection>

        <PolicySection title="سياسة الاسترجاع">
          <p>
            لأن المنتج رقمي ويتفعل مباشرة، ما فيه استرجاع للمبلغ بعد التفعيل.
          </p>
          <p>
            إذا واجهت خللًا تقنيًا يمنعك من اللعب، تواصل معنا خلال 7 أيام من
            الشراء على{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="font-bold text-cyan-200 underline"
            >
              {SITE.contactEmail}
            </a>
            . نحاول نحل المشكلة، وإذا ما قدرنا نرجع لك المبلغ كامل.
          </p>
        </PolicySection>
      </div>
    </PageShell>
  );
}
