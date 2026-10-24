import Link from "next/link";

const LINKS = [
  { href: "/terms", label: "الشروط والاسترجاع" },
  { href: "/privacy", label: "الخصوصية" },
  { href: "/contact", label: "تواصل معنا" },
  { href: "/unlock", label: "عندي كود" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-white/10 pt-4 text-center">
      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-bold text-white/55">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <p className="mt-2 text-xs font-bold text-white/35">
        © {new Date().getFullYear()} خل نلعب
      </p>
    </footer>
  );
}
