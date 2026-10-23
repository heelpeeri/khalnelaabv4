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

export const metadata: Metadata = {
  title: "خل نلعب",
  description: "ألعاب جماعية للجلسات: فريقين، ثمان ألعاب، وبطل واحد.",
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
