"use client";

import { brand } from "@/lib/content";

export default function Nav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          className="rounded-full bg-[var(--surface)]/80 px-4 py-2 font-display text-sm tracking-[0.08em] text-[var(--ink)] uppercase shadow-sm backdrop-blur-md md:text-base"
        >
          {brand.name}
        </a>
        <nav className="hidden items-center gap-1 rounded-full bg-[var(--surface)]/80 px-2 py-2 shadow-sm backdrop-blur-md md:flex">
          {[
            { href: "#styles", label: "Styles" },
            { href: "#destinations", label: "Destinations" },
            { href: "#love", label: "Love" },
            { href: "#contact", label: "Contact" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 font-body text-[11px] tracking-[0.16em] text-[var(--ink)]/70 uppercase transition-colors duration-300 hover:bg-[var(--brand-wash)] hover:text-[var(--brand)]"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href={brand.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[var(--brand)] px-4 py-2 font-display text-[11px] tracking-[0.16em] text-white uppercase transition-colors duration-300 hover:bg-[var(--brand-soft)]"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}
