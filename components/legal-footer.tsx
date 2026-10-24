import Link from "next/link";
import { LEGAL, legalLinks } from "@/lib/legal";

// Static year (taken from the "updated" date in lib/legal.ts) so the page can
// be prerendered. Next.js Cache Components blocks `new Date()` during prerender.
const YEAR = LEGAL.updated.slice(-4);

export function LegalFooter() {
  return (
    <footer className="w-full border-t border-[#7FFF00]/15 bg-black px-5 py-8 text-[13px] text-white/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <p>© {YEAR} {LEGAL.brand}. All rights reserved.</p>
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
