import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import CopyButton from "@/components/CopyButton";
import PageShell from "@/components/PageShell";
import QrCode from "@/components/QrCode";
import { getLicenseSecrets, verifyLicenseCode } from "@/lib/license";
import { LICENSE_COOKIE } from "@/lib/licenseCookie";
import { getSiteOrigin } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "تم التفعيل | خل نلعب",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function SuccessPage() {
  const code = (await cookies()).get(LICENSE_COOKIE)?.value ?? "";
  const check = await verifyLicenseCode(code, getLicenseSecrets());

  if (!check.valid) {
    redirect("/buy");
  }

  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const origin = getSiteOrigin(`${protocol}://${host}`);
  const unlockUrl = `${origin}/unlock?code=${encodeURIComponent(code)}`;

  return (
    <PageShell title="تم التفعيل 🎉">
      <section className="arcade-card p-5 text-center sm:p-7">
        <p className="text-lg font-black text-white">
          شكرًا لك! اللعبة صارت مفعلة على هذا الجهاز.
        </p>

        <p className="mt-4 text-sm font-bold text-white/60">كود التفعيل</p>

        <p
          dir="ltr"
          className="mt-1 select-all break-words rounded-xl border border-cyan-300/30 bg-black/30 px-3 py-3 text-lg font-black tracking-wide text-cyan-100 sm:text-xl"
        >
          {code}
        </p>

        <p className="mt-2 text-sm font-bold text-yellow-100/80">
          احفظ الكود، تحتاجه لو بتلعب من جهاز ثاني.
        </p>

        <div className="mt-4">
          <CopyButton text={code} />
        </div>

        <div className="mt-5 flex flex-col items-center gap-2">
          <p className="text-sm font-bold text-white/60">
            أو امسح الكود من جهازك الثاني عشان يتفعل
          </p>

          <div className="rounded-2xl bg-white p-2">
            <QrCode
              value={unlockUrl}
              label="كود تفعيل جهاز ثاني"
              className="h-[180px] w-[180px]"
            />
          </div>
        </div>

        <Link href="/match" className="btn-primary mt-6 w-full py-3 text-lg">
          يلا نلعب 🎮
        </Link>
      </section>
    </PageShell>
  );
}
