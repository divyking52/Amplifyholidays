"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { travelStyles } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function TravelStyles() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;

      gsap.from(".style-reveal", {
        opacity: 0,
        y: 32,
        duration: 0.9,
        stagger: 0.07,
        ease: "power4.out",
        scrollTrigger: {
          trigger: root,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      id="styles"
      ref={rootRef}
      className="relative overflow-hidden bg-[var(--surface-soft)] px-6 py-24 md:px-10 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(36,130,50,0.08),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="style-reveal flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="font-body text-[11px] tracking-[0.32em] text-[var(--brand)] uppercase">
              Choose your
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.4rem,5.5vw,4.25rem)] leading-[0.95] font-medium tracking-[-0.03em] text-[var(--ink)]">
              Travel Style
            </h2>
          </div>
          <p className="max-w-sm font-body text-sm leading-relaxed text-[var(--muted)] md:text-right md:text-base">
            Tell us how you travel — we shape the destination, pace, and details
            around it.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-12 md:grid-rows-2 md:gap-5 md:auto-rows-[280px]">
          {travelStyles.map((style, i) => {
            const wide = style.span === "wide";
            const col = wide
              ? "md:col-span-7"
              : "md:col-span-5";

            return (
              <a
                key={style.id}
                href={style.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`style-reveal group relative min-h-[280px] overflow-hidden rounded-[22px] ${col}`}
              >
                <Image
                  src={style.image}
                  alt={`${style.title} ${style.subtitle}`}
                  fill
                  sizes={wide ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 42vw"}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,10,0.15)_0%,rgba(7,20,10,0.25)_40%,rgba(7,20,10,0.78)_100%)] transition-colors duration-500 group-hover:bg-[linear-gradient(180deg,rgba(7,20,10,0.2)_0%,rgba(7,20,10,0.35)_40%,rgba(7,20,10,0.88)_100%)]" />

                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-body text-[11px] tracking-[0.22em] text-[var(--brand-mist)] uppercase">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-body text-[11px] tracking-[0.16em] text-white/0 uppercase transition-colors duration-300 group-hover:text-white/80">
                      Plan on WhatsApp →
                    </span>
                  </div>

                  <div>
                    <p className="font-body text-[11px] tracking-[0.28em] text-[var(--brand-mist)] uppercase">
                      {style.title}
                    </p>
                    <h3 className="mt-1 font-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.95] tracking-[-0.03em] text-white">
                      {style.subtitle}
                    </h3>
                    <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-white/70 opacity-90 md:text-[15px]">
                      {style.blurb}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
