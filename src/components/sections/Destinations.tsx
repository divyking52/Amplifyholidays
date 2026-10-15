"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { destinations } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function formatPrice(price: string) {
  return price.replace(/^FROM\s+/i, "").trim();
}

export default function Destinations() {
  const rootRef = useRef<HTMLElement>(null);
  const activeIndex = useRef(-1);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const slides = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".spot-slide")
      );
      const tabs = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".spot-tab")
      );
      const panels = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".spot-copy")
      );
      const counter = root.querySelector<HTMLElement>(".spot-counter");
      const progress = root.querySelector<HTMLElement>(".spot-progress");
      const total = destinations.length;
      if (!total || !slides.length) return;

      const setActive = (i: number) => {
        if (i === activeIndex.current || !destinations[i]) return;
        activeIndex.current = i;

        const duration = prefersReducedMotion() ? 0 : 0.65;
        const pad = String(i + 1).padStart(2, "0");

        slides.forEach((slide, si) => {
          const on = si === i;
          gsap.to(slide, {
            opacity: on ? 1 : 0,
            scale: on ? 1 : 1.04,
            duration,
            ease: "power3.out",
            overwrite: "auto",
          });
        });

        panels.forEach((panel, pi) => {
          const on = pi === i;
          gsap.to(panel, {
            opacity: on ? 1 : 0,
            y: on ? 0 : 16,
            duration: duration * 0.85,
            ease: "power3.out",
            overwrite: "auto",
            pointerEvents: on ? "auto" : "none",
          });
        });

        tabs.forEach((tab, ti) => {
          const on = ti === i;
          tab.classList.toggle("is-active", on);
          tab.setAttribute("aria-selected", on ? "true" : "false");
          gsap.to(tab, {
            opacity: on ? 1 : 0.4,
            duration: duration * 0.7,
            ease: "power2.out",
            overwrite: "auto",
          });
        });

        if (counter) counter.textContent = pad;
        if (progress) {
          gsap.to(progress, {
            scaleX: (i + 1) / total,
            duration: duration * 0.9,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      };

      gsap.set(slides, { opacity: 0, scale: 1.04 });
      gsap.set(slides[0], { opacity: 1, scale: 1 });
      gsap.set(panels, { opacity: 0, y: 16, pointerEvents: "none" });
      gsap.set(panels[0], { opacity: 1, y: 0, pointerEvents: "auto" });
      gsap.set(tabs, { opacity: 0.4 });
      gsap.set(tabs[0], { opacity: 1 });
      tabs[0]?.classList.add("is-active");
      tabs[0]?.setAttribute("aria-selected", "true");
      if (counter) counter.textContent = "01";
      if (progress) gsap.set(progress, { scaleX: 1 / total, transformOrigin: "left center" });
      activeIndex.current = 0;

      tabs.forEach((tab, i) => {
        tab.addEventListener("mouseenter", () => setActive(i));
        tab.addEventListener("focus", () => setActive(i));
        tab.addEventListener("click", (e) => {
          e.preventDefault();
          setActive(i);
        });
      });

      if (prefersReducedMotion()) return;

      // Same pin + scrub carousel on mobile and desktop
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${total * 320}`,
        pin: true,
        scrub: 0.55,
        anticipatePin: 1,
        onUpdate: (self) => {
          const i = Math.min(total - 1, Math.floor(self.progress * total));
          setActive(i);
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      id="destinations"
      ref={rootRef}
      className="relative overflow-hidden bg-[var(--ink-deep)]"
      aria-roledescription="carousel"
      aria-label="Best Seasonal Travel Hotspot"
    >
      {/* Full-bleed stage — same pin carousel on mobile + desktop */}
      <div className="relative min-h-svh">
        <div className="absolute inset-0">
          {destinations.map((dest, i) => (
            <div
              key={dest.id}
              className="spot-slide absolute inset-0 will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                sizes="100vw"
                className="object-cover"
                unoptimized
                priority={i === 0}
              />
            </div>
          ))}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,10,0.45)_0%,rgba(7,20,10,0.12)_38%,rgba(7,20,10,0.72)_100%)]" />
        </div>

        <div className="relative z-10 flex min-h-svh flex-col justify-between px-6 pt-28 pb-8 md:px-10 md:pb-10 lg:px-16 lg:pt-32 lg:pb-12">
          <div>
            <p className="font-body text-[11px] tracking-[0.32em] text-[var(--brand-mist)] uppercase">
              Best Seasonal Travel Hotspot
            </p>
            <div className="mt-4 flex items-baseline gap-2 font-body text-[11px] tracking-[0.2em] text-white/55 uppercase">
              <span className="spot-counter text-white">01</span>
              <span aria-hidden>/</span>
              <span>{String(destinations.length).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="relative max-w-3xl pb-2">
            {destinations.map((dest, i) => (
              <div
                key={dest.id}
                id={`spot-panel-${dest.id}`}
                role="tabpanel"
                aria-labelledby={`spot-tab-${dest.id}`}
                className="spot-copy absolute inset-x-0 bottom-0"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  pointerEvents: i === 0 ? "auto" : "none",
                }}
              >
                <h2 className="font-display text-[clamp(2.75rem,10vw,7rem)] leading-[0.92] font-medium tracking-[-0.03em] text-white">
                  {dest.name}
                </h2>
                <div className="mt-5 flex flex-wrap items-center gap-5">
                  <p className="font-body text-sm tracking-[0.14em] text-[var(--brand-mist)] uppercase">
                    From {formatPrice(dest.price)}
                  </p>
                  <a
                    href={dest.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm tracking-[0.12em] text-white uppercase underline decoration-white/35 underline-offset-8 transition-colors hover:decoration-[var(--brand-mist)]"
                  >
                    View package
                  </a>
                </div>
              </div>
            ))}
            <div className="invisible" aria-hidden>
              <h2 className="font-display text-[clamp(2.75rem,10vw,7rem)] leading-[0.92] font-medium tracking-[-0.03em]">
                Singapore
              </h2>
              <div className="mt-5 h-6" />
            </div>
          </div>

          <div className="mt-10">
            <div className="h-px w-full bg-white/20">
              <div className="spot-progress h-px origin-left scale-x-[0.125] bg-[var(--brand-mist)] will-change-transform" />
            </div>
            <div
              role="tablist"
              aria-label="Destinations"
              className="mt-5 flex gap-4 overflow-x-auto pb-1 lg:flex-wrap lg:justify-between lg:gap-x-3 lg:overflow-visible"
            >
              {destinations.map((dest, i) => (
                <button
                  key={dest.id}
                  type="button"
                  role="tab"
                  className="spot-tab shrink-0 font-body text-[11px] tracking-[0.16em] text-white uppercase opacity-40 transition-opacity hover:opacity-80"
                  aria-selected={i === 0}
                  aria-controls={`spot-panel-${dest.id}`}
                  id={`spot-tab-${dest.id}`}
                >
                  {dest.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
