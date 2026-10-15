"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { brand } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";
import MagneticButton from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HERO_IMAGE =
  "https://admin.storebox.ai/media/5e25aa9d-84ae-4a87-a986-cebbc6aa41d2/20622bce-880b-4399-975a-2bca03a4cd2a/hero.jpg";
const HERO_VIDEO =
  "https://admin.storebox.ai/media/5e25aa9d-84ae-4a87-a986-cebbc6aa41d2/e7f76b82-4e4a-466e-8ae2-010e5cb381d5/hero-ambient.mp4";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const videoLayerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion()) return;
    video.play().catch(() => {});
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      const headline = headlineRef.current;
      if (!root || !headline) return;

      const chars = headline.querySelectorAll(".hero-char");
      const words = headline.querySelectorAll(".hero-word");

      if (prefersReducedMotion()) {
        gsap.set([chars, contentRef.current], {
          clearProps: "all",
          opacity: 1,
          y: 0,
        });
        gsap.set(mediaRef.current, { scale: 1, borderRadius: 0 });
        gsap.set(bgRef.current, { scale: 1 });
        gsap.set(videoLayerRef.current, { opacity: 0.35 });
        return;
      }

      gsap.set(chars, { yPercent: 110, opacity: 0 });
      gsap.set(contentRef.current, { opacity: 0, y: 24 });
      gsap.set(bgRef.current, { scale: 1.15 });
      gsap.set(videoLayerRef.current, { opacity: 1, scale: 1.08 });
      gsap.set(scrollCueRef.current, { opacity: 0 });
      // Compositor-safe unveil: scale + radius (never animate width/height)
      gsap.set(mediaRef.current, {
        scale: 0.42,
        borderRadius: 24,
        transformOrigin: "50% 50%",
      });

      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .fromTo(
          videoLayerRef.current,
          { opacity: 0, scale: 1.15 },
          { opacity: 1, scale: 1.08, duration: 2.4, ease: "expo.out" },
          0
        )
        .to(bgRef.current, { scale: 1, duration: 2.2 }, 0)
        .to(
          chars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.018,
          },
          0.15
        )
        .to(
          contentRef.current,
          { opacity: 1, y: 0, duration: 1, ease: "expo.out" },
          0.55
        )
        .to(
          scrollCueRef.current,
          { opacity: 1, duration: 0.8, ease: "expo.out" },
          0.9
        );

      // Same pin + scrub unveil on all breakpoints (incl. mobile)
      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrubTl
        .fromTo(
          words,
          { scale: 1, opacity: 1 },
          { scale: 3, opacity: 0, ease: "none", immediateRender: false },
          0
        )
        .fromTo(
          contentRef.current,
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -40,
            ease: "none",
            immediateRender: false,
          },
          0
        )
        .fromTo(
          scrollCueRef.current,
          { opacity: 1 },
          { opacity: 0, ease: "none", immediateRender: false },
          0
        )
        .fromTo(
          mediaRef.current,
          { scale: 0.42, borderRadius: 24 },
          {
            scale: 1,
            borderRadius: 0,
            ease: "none",
            immediateRender: false,
          },
          0
        )
        .fromTo(
          bgRef.current,
          { scale: 1 },
          { scale: 1.08, ease: "none", immediateRender: false },
          0
        )
        .fromTo(
          videoLayerRef.current,
          { opacity: 1, scale: 1.08 },
          {
            opacity: 0,
            scale: 1.2,
            ease: "none",
            immediateRender: false,
          },
          0
        );
    },
    { scope: rootRef }
  );

  const lines = brand.tagline.split(" ");

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-[var(--surface-soft)]"
    >
      {/* Mobile: full-bleed hero image as page background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 md:hidden"
        aria-hidden
      >
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,10,0.45)_0%,rgba(7,20,10,0.28)_45%,rgba(7,20,10,0.55)_100%)]" />
      </div>

      {/* Soft-blurred ambient video — desktop only */}
      <div
        ref={videoLayerRef}
        className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden will-change-transform md:block"
        aria-hidden
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-125 object-cover blur-[36px] saturate-[1.05] brightness-[1.15]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_IMAGE}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[var(--surface)]/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(245,250,246,0.9)_100%)]" />
      </div>

      <div className="absolute inset-0 z-[1] flex items-center justify-center overflow-hidden">
        <div
          ref={mediaRef}
          className="absolute inset-0 origin-center overflow-hidden shadow-[0_24px_80px_rgba(13,31,18,0.18)] will-change-transform"
          style={{ transform: "scale(0.42)", borderRadius: 24 }}
        >
          <div
            ref={bgRef}
            className="absolute inset-0 scale-[1.15] will-change-transform"
          >
            <Image
              src={HERO_IMAGE}
              alt="Wooden boat on a mountain lake"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,31,18,0.35)_0%,rgba(13,31,18,0.12)_40%,rgba(13,31,18,0.5)_100%)]" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center px-6 text-center">
        <p className="mb-6 font-body text-[11px] tracking-[0.35em] text-[var(--brand-mist)] uppercase md:text-[var(--brand)]">
          {brand.name}
        </p>

        <h1
          ref={headlineRef}
          className="font-display text-[clamp(2.4rem,7vw,6.5rem)] leading-[0.95] font-medium tracking-[-0.03em] text-white md:text-[var(--ink)]"
        >
          {lines.map((word, wi) => (
            <span
              key={`${word}-${wi}`}
              className={`hero-word mr-[0.28em] inline-block whitespace-nowrap last:mr-0 will-change-transform ${
                word === "Charms" ? "text-white" : ""
              }`}
            >
              <span className="inline-block overflow-hidden align-bottom pb-[0.08em]">
                {word.split("").map((char, ci) => (
                  <span
                    key={`${wi}-${ci}`}
                    className="hero-char inline-block will-change-transform"
                  >
                    {char}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>

        <div
          ref={contentRef}
          className="mt-8 flex max-w-xl flex-col items-center gap-7 rounded-[22px] bg-[var(--surface)]/88 px-6 py-6 shadow-[0_12px_40px_rgba(13,31,18,0.08)] backdrop-blur-md md:px-8 md:py-7"
        >
          <p className="font-body text-base leading-relaxed text-[var(--ink)] md:text-lg">
            {brand.subhead}
          </p>
          <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-3.5">
            <MagneticButton href="#contact" className="sm:min-w-[12.5rem]">
              {brand.ctaPrimary}
            </MagneticButton>
            <MagneticButton
              href="#destinations"
              variant="ghost"
              showArrow
              className="sm:min-w-[12.5rem]"
            >
              {brand.ctaSecondary}
            </MagneticButton>
          </div>
        </div>
      </div>

      <div
        ref={scrollCueRef}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-body text-[10px] tracking-[0.3em] text-white/70 uppercase md:text-[var(--muted)]">
          Scroll
        </span>
        <span className="block h-10 w-px origin-top bg-white/50 md:bg-[var(--brand)]/40" />
      </div>
    </section>
  );
}
