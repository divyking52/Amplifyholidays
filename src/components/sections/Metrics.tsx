"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { marqueeWords, metrics } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function formatValue(value: number, decimals: number) {
  return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
}

export default function Metrics() {
  const rootRef = useRef<HTMLElement>(null);
  const marqueeARef = useRef<HTMLDivElement>(null);
  const marqueeBRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const counters = gsap.utils.toArray<HTMLElement>(".metric-value");
      const reduced = prefersReducedMotion();

      counters.forEach((el) => {
        const end = Number(el.dataset.value);
        const decimals = Number(el.dataset.decimals || 0);
        const suffix = el.dataset.suffix || "";

        if (reduced) {
          el.textContent = `${formatValue(end, decimals)}${suffix}`;
          return;
        }

        const obj = { val: 0 };
        gsap.to(obj, {
          val: end,
          duration: 1.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            el.textContent = `${formatValue(obj.val, decimals)}${suffix}`;
          },
        });
      });

      if (reduced) return;

      const a = marqueeARef.current;
      const b = marqueeBRef.current;
      if (!a || !b) return;

      gsap.set(a, { xPercent: 0 });
      gsap.set(b, { xPercent: -50 });

      const loopA = gsap.to(a, {
        xPercent: -50,
        duration: 28,
        ease: "none",
        repeat: -1,
      });
      const loopB = gsap.to(b, {
        xPercent: 0,
        duration: 32,
        ease: "none",
        repeat: -1,
      });

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          const abs = Math.min(Math.abs(v) / 1200, 2.5);
          const dir = v < 0 ? -1 : 1;
          const skew = gsap.utils.clamp(-12, 12, dir * abs * 6);
          const timeScale = 1 + abs * 1.8;

          loopA.timeScale(timeScale);
          loopB.timeScale(timeScale);
          gsap.to([a, b], {
            skewX: skew,
            duration: 0.35,
            ease: "power3.out",
            overwrite: "auto",
          });
        },
        onLeave: () => {
          gsap.to([a, b], { skewX: 0, duration: 0.6, ease: "power4.out" });
          loopA.timeScale(1);
          loopB.timeScale(1);
        },
        onLeaveBack: () => {
          gsap.to([a, b], { skewX: 0, duration: 0.6, ease: "power4.out" });
          loopA.timeScale(1);
          loopB.timeScale(1);
        },
      });
    },
    { scope: rootRef }
  );

  const strip = [...marqueeWords, ...marqueeWords];

  return (
    <section
      id="proof"
      ref={rootRef}
      className="relative overflow-hidden bg-[var(--surface)] py-24 md:py-32"
    >
      <div className="mb-16 overflow-hidden">
        <div
          ref={marqueeARef}
          className="flex w-max will-change-transform"
          aria-hidden
        >
          {strip.map((word, i) => (
            <span
              key={`a-${word}-${i}`}
              className="mx-6 font-display text-[clamp(2.5rem,8vw,7rem)] tracking-[-0.03em] text-transparent [-webkit-text-stroke:1px_rgba(36,130,50,0.45)] whitespace-nowrap md:mx-10"
            >
              {word}
            </span>
          ))}
        </div>
        <div
          ref={marqueeBRef}
          className="mt-2 flex w-max will-change-transform"
          aria-hidden
        >
          {strip.map((word, i) => (
            <span
              key={`b-${word}-${i}`}
              className="mx-6 font-display text-[clamp(2.5rem,8vw,7rem)] tracking-[-0.03em] text-[var(--ink)]/[0.06] whitespace-nowrap md:mx-10"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-12 px-6 md:grid-cols-4 md:px-10">
        {metrics.map((m) => (
          <div key={m.label} className="border-t border-[var(--line)] pt-6">
            <p
              className="metric-value font-display text-5xl tracking-[-0.03em] text-[var(--ink)] tabular-nums md:text-6xl"
              data-value={m.value}
              data-decimals={m.decimals}
              data-suffix={m.suffix}
            >
              0{m.suffix}
            </p>
            <p className="mt-3 font-body text-[11px] tracking-[0.24em] text-[var(--muted)] uppercase">
              {m.label}
            </p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-16 max-w-2xl px-6 text-center font-body text-base leading-relaxed text-[var(--muted)] md:text-lg">
        We are a passionate bunch of holiday planners — destination experts with
        answers for every question, even the ones you are hesitant to ask.
      </p>
    </section>
  );
}
