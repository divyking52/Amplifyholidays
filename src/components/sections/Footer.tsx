"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { brand } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";
import MagneticButton from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".footer-reveal", {
        y: 60,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: footerRef }
  );

  return (
    <footer
      id="contact"
      ref={footerRef}
      className="sticky bottom-0 z-0 flex min-h-svh flex-col justify-end overflow-hidden bg-[var(--brand-wash)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(36,130,50,0.18),transparent_50%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20 md:px-10 md:py-24">
        <div className="footer-reveal max-w-3xl">
          <p className="font-body text-[11px] tracking-[0.32em] text-[var(--brand)] uppercase">
            Talk to Destination Expert
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,5rem)] leading-[1.05] tracking-[-0.03em] text-[var(--ink)]">
            For clarification and updates — our destination experts have answers
            for all your questions.
          </h2>
        </div>

        <div className="footer-reveal flex flex-wrap gap-4">
          <MagneticButton href={brand.whatsapp} external>
            Connect on WhatsApp
          </MagneticButton>
          <MagneticButton href={`mailto:${brand.email}`} variant="ghost">
            {brand.email}
          </MagneticButton>
        </div>

        <div className="footer-reveal grid gap-8 border-t border-[var(--line)] pt-10 md:grid-cols-3">
          <div>
            <p className="font-body text-[11px] tracking-[0.24em] text-[var(--muted)] uppercase">
              Call
            </p>
            <a
              href={`tel:${brand.phone.replace(/\s/g, "")}`}
              className="mt-2 block font-display text-xl text-[var(--ink)]"
            >
              {brand.phone}
            </a>
          </div>
          <div>
            <p className="font-body text-[11px] tracking-[0.24em] text-[var(--muted)] uppercase">
              Write
            </p>
            <a
              href={`mailto:${brand.email}`}
              className="mt-2 block font-display text-xl text-[var(--ink)]"
            >
              {brand.email}
            </a>
          </div>
          <div>
            <p className="font-body text-[11px] tracking-[0.24em] text-[var(--muted)] uppercase">
              Brand
            </p>
            <p className="mt-2 font-display text-xl text-[var(--ink)]">
              {brand.name}
            </p>
          </div>
        </div>

        <p className="footer-reveal font-body text-xs tracking-[0.12em] text-[var(--muted)] uppercase">
          © {new Date().getFullYear()} Amplify Holidays LLP | All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
