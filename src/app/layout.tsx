import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const somar = localFont({
  src: [
    {
      path: "../../public/fonts/SomarSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/SomarSans-Bold.woff2",
      weight: "700 900",
      style: "normal",
    },
  ],
  variable: "--font-somar",
  display: "swap",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const description = "ألعاب جماعية للجلسات: فريقين، ثمان ألعاب، وبطل واحد.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "خل نلعب",
  description,
  applicationName: "خل نلعب",
  openGraph: {
    title: "خل نلعب",
    description,
    siteName: "خل نلعب",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "خل نلعب",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070012",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={somar.variable}>
      <body>{children}</body>
    </html>
  );
}
