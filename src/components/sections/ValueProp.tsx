"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { valueParagraph } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ValueProp() {
  const rootRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const text = textRef.current;
      if (!root || !text) return;

      const words = text.querySelectorAll(".vp-word");

      if (prefersReducedMotion()) {
        gsap.set(words, { opacity: 1, color: "#0d1f12" });
        return;
      }

      gsap.set(words, { opacity: 0.18, color: "rgba(13,31,18,0.22)" });

      gsap.to(words, {
        opacity: 1,
        color: "#0d1f12",
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
    },
    { scope: rootRef }
  );

  const words = valueParagraph.split(" ");

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[var(--surface)] px-6 py-24 md:px-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(36,130,50,0.08),transparent_55%)]" />
      <div className="relative mx-auto max-w-5xl">
        <p className="mb-10 font-body text-[11px] tracking-[0.32em] text-[var(--brand)] uppercase">
          The Amplify Promise
        </p>
        <p
          ref={textRef}
          className="font-display text-[clamp(1.6rem,4.2vw,3.4rem)] leading-[1.25] tracking-[-0.02em]"
        >
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="vp-word mr-[0.28em] inline-block will-change-[opacity,color]"
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
