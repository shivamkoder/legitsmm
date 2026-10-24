import Link from "next/link";
import { LEGAL, legalLinks } from "@/lib/legal";

export function LegalFooter() {
  return (
    <footer className="w-full border-t border-[#7FFF00]/15 bg-black px-5 py-8 text-[13px] text-white/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <p>© {new Date().getFullYear()} {LEGAL.brand}. All rights reserved.</p>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {legalLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-[#7FFF00]">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
