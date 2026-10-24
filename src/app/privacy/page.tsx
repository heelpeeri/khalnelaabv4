import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PolicySection from "@/components/PolicySection";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | خل نلعب",
};

export default function PrivacyPage() {
  return (
    <PageShell title="سياسة الخصوصية">
      <div className="space-y-3">
        <PolicySection title="باختصار">
          <p>
            ما نسوي حسابات، وما نحتفظ بأسماء أو إيميلات أو أرقام جوالات أو أي
            بيانات شخصية لأي أحد، وما نبيع أو نشارك بيانات أحد.
          </p>
        </PolicySection>

        <PolicySection title="وش يتخزن على جهازك">
          <p>
            أسماء الفرق ونتيجة الجلسة تنحفظ مؤقتًا في متصفحك عشان ما تضيع لو
            حدّثت الصفحة، وتنمسح لما تقفل الصفحة. ما توصلنا أبدًا.
          </p>
          <p>
            بعد الشراء ينحفظ كود التفعيل في ملف تعريف ارتباط (كوكي) على جهازك
            عشان يتذكر إن اللعبة مفعلة. هذا الكود ما فيه أي معلومة عنك.
          </p>
        </PolicySection>

        <PolicySection title="الدفع">
          <p>
            الدفع يتم عن طريق بوابة ميسر. بيانات البطاقة تدخلها في نموذج ميسر
            مباشرة وتعالجها هي حسب معايير أمان الدفع، وما توصلنا ولا نخزنها.
            ميسر قد تحتفظ ببيانات العملية حسب سياستها والأنظمة المالية.
          </p>
        </PolicySection>

        <PolicySection title="الإيميل الاختياري">
          <p>
            إذا كتبت إيميلك وقت الشراء، نستخدمه مرة وحدة بس لإرسال كود التفعيل
            لك عن طريق مزود خدمة إرسال الإيميلات. ما نخزنه عندنا وما نرسل لك أي
            رسائل تسويقية.
          </p>
        </PolicySection>

        <PolicySection title="بدون تتبع">
          <p>
            ما نستخدم إعلانات ولا أدوات تتبع. مزود الاستضافة قد يحتفظ بسجلات
            تقنية مؤقتة (مثل عنوان IP) لأغراض الأمان حسب سياسته.
          </p>
        </PolicySection>

        <PolicySection title="حقوقك والتواصل">
          <p>
            لأي استفسار عن الخصوصية تواصل معنا على{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="font-bold text-cyan-200 underline"
            >
              {SITE.contactEmail}
            </a>
            .
          </p>
        </PolicySection>
      </div>
    </PageShell>
  );
}
