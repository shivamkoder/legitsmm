import Link from "next/link";
import { LEGAL, legalLinks, type LegalSection } from "@/lib/legal";

export function LegalPage({
  title,
  intro,
  sections,
  current,
}: {
  title: string;
  intro?: string;
  sections: LegalSection[];
  current: string;
}) {
  return (
    <div className="min-h-svh w-full bg-black text-white">
      <header className="border-b border-[#7FFF00]/15">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <Link href="/" className="text-[15px] font-semibold text-[#7FFF00]">
            {LEGAL.brand}
          </Link>
          <Link
            href="/auth/login"
            className="rounded-lg border border-[#7FFF00]/30 px-3 py-1.5 text-[13px] text-[#7FFF00] hover:bg-[#7FFF00]/10"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12">
        <h1 className="text-3xl font-bold text-[#7FFF00] md:text-4xl">{title}</h1>
        <p className="mt-2 text-[13px] text-white/50">Last updated: {LEGAL.updated}</p>
        {intro && <p className="mt-6 text-[14px] leading-relaxed text-white/80">{intro}</p>}

        <div className="mt-10 flex flex-col gap-8">
          {sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className="text-lg font-semibold text-white">
                {i + 1}. {s.heading}
              </h2>
              {s.body?.map((p, j) => (
                <p key={j} className="mt-3 text-[14px] leading-relaxed text-white/70">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-white/70 marker:text-[#7FFF00]">
                  {s.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-[#7FFF00]/15 bg-[#050a02] p-5 text-[13px] text-white/70">
          <p className="font-semibold text-white">Contact</p>
          <p className="mt-1">{LEGAL.legalName}</p>
          <p>{LEGAL.address}</p>
          <p>
            Email:{" "}
            <a href={`mailto:${LEGAL.email}`} className="text-[#7FFF00] hover:underline">
              {LEGAL.email}
            </a>
          </p>
        </div>
      </main>

      <footer className="border-t border-[#7FFF00]/15">
        <nav className="mx-auto flex max-w-4xl flex-wrap gap-x-6 gap-y-2 px-5 py-6 text-[13px]">
          {legalLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={l.href === current ? "text-[#7FFF00]" : "text-white/60 hover:text-[#7FFF00]"}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
