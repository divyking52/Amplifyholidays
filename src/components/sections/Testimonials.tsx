"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  testimonials,
  testimonialsHeading,
  testimonialsSubhead,
} from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const VISIBLE = 3;

export default function Testimonials() {
  const rootRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const animating = useRef(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;

      gsap.from(".love-reveal", {
        opacity: 0,
        y: 28,
        duration: 0.9,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: rootRef }
  );

  const goTo = useCallback(
    (nextIndex: number, direction: 1 | -1 = 1) => {
      if (animating.current || nextIndex === active) return;
      const stack = stackRef.current;
      const total = testimonials.length;
      const i = ((nextIndex % total) + total) % total;

      if (!stack || prefersReducedMotion()) {
        setActive(i);
        return;
      }

      animating.current = true;
      const front = stack.querySelector<HTMLElement>(".stack-card.is-front");

      const finish = () => {
        setActive(i);
        animating.current = false;
      };

      if (!front) {
        finish();
        return;
      }

      gsap.to(front, {
        x: direction * 48,
        y: direction > 0 ? -24 : 18,
        rotation: direction * 7,
        opacity: 0,
        duration: 0.38,
        ease: "power3.in",
        onComplete: finish,
      });
    },
    [active]
  );

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack || prefersReducedMotion()) return;
    const front = stack.querySelector<HTMLElement>(".stack-card.is-front");
    if (!front) return;
    gsap.fromTo(
      front,
      { opacity: 0.7, y: 16, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" }
    );
  }, [active]);

  const next = () => goTo(active + 1, 1);
  const prev = () => goTo(active - 1, -1);

  const order = Array.from({ length: Math.min(VISIBLE, testimonials.length) }, (_, depth) => {
    const i = (active + depth) % testimonials.length;
    return { depth, i, item: testimonials[i] };
  });

  return (
    <section
      id="love"
      ref={rootRef}
      className="relative overflow-hidden bg-[var(--brand-wash)] px-6 py-24 md:px-10 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(36,130,50,0.1),transparent_55%)]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="love-reveal mx-auto max-w-2xl text-center">
          <p className="font-body text-[11px] tracking-[0.32em] text-[var(--brand)] uppercase">
            Traveller stories
          </p>
          <h2 className="mt-4 font-display text-3xl tracking-[-0.03em] text-[var(--ink)] md:text-5xl">
            {testimonialsHeading}
          </h2>
          <p className="mt-3 font-body text-base text-[var(--muted)] md:text-lg">
            {testimonialsSubhead}
          </p>
        </div>

        <div className="love-reveal relative mx-auto mt-14 max-w-xl">
          <div
            ref={stackRef}
            className="relative h-[440px] md:h-[460px]"
            aria-live="polite"
          >
            {order
              .slice()
              .reverse()
              .map(({ depth, i, item }) => {
                const isFront = depth === 0;
                const scale = 1 - depth * 0.06;
                const y = depth * 28;
                const x = depth * (depth % 2 === 0 ? 10 : -10);
                const rot = depth * (depth % 2 === 0 ? 1.5 : -1.5);
                const opacity = 1 - depth * 0.08;

                return (
                  <article
                    key={`${item.name}-${item.trip}-${i}`}
                    className={`stack-card absolute inset-x-0 top-0 flex h-[380px] flex-col rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-[0_22px_60px_rgba(13,31,18,0.1)] md:h-[400px] md:p-10 ${
                      isFront ? "is-front cursor-pointer" : "pointer-events-none"
                    }`}
                    style={{
                      zIndex: VISIBLE - depth,
                      transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rot}deg)`,
                      opacity,
                      transformOrigin: "50% 0%",
                    }}
                    onClick={isFront ? next : undefined}
                    role={isFront ? "button" : undefined}
                    tabIndex={isFront ? 0 : -1}
                    onKeyDown={
                      isFront
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              next();
                            }
                          }
                        : undefined
                    }
                    aria-label={
                      isFront
                        ? `Testimonial from ${item.name}. Activate for next story.`
                        : undefined
                    }
                  >
                    <p className="font-body text-[11px] tracking-[0.22em] text-[var(--brand)] uppercase">
                      {item.trip}
                    </p>
                    <p className="mt-5 flex-1 overflow-hidden font-display text-[clamp(1.2rem,2.3vw,1.65rem)] leading-snug tracking-[-0.02em] text-[var(--ink)]">
                      “{item.quote}”
                    </p>
                    <div className="mt-6 flex items-end justify-between gap-4 border-t border-[var(--line)] pt-5">
                      <div>
                        <p className="font-body text-sm font-semibold text-[var(--ink)]">
                          {item.name}
                        </p>
                        {item.location ? (
                          <p className="mt-1 font-body text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
                            {item.location}
                          </p>
                        ) : null}
                      </div>
                      <span className="font-body text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase">
                        {String(i + 1).padStart(2, "0")} /{" "}
                        {String(testimonials.length).padStart(2, "0")}
                      </span>
                    </div>
                  </article>
                );
              })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
              aria-label="Previous story"
            >
              <span aria-hidden className="text-lg leading-none">
                ←
              </span>
            </button>
            <div className="flex items-center gap-1.5 px-2" role="tablist" aria-label="Stories">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => goTo(i, i > active ? 1 : -1)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active
                      ? "w-6 bg-[var(--brand)]"
                      : "w-1.5 bg-[var(--ink)]/20 hover:bg-[var(--ink)]/40"
                  }`}
                  aria-label={`Go to story ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
              aria-label="Next story"
            >
              <span aria-hidden className="text-lg leading-none">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
