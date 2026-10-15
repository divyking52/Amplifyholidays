"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const onTrackRef = useRef(false);
  const [onTrack, setOnTrack] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.classList.add("has-custom-cursor");

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(ring, { width: 14, height: 14 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.28, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.28, ease: "power3.out" });

    let visible = false;

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!visible) {
        visible = true;
        gsap.to(cursor, { opacity: 1, duration: 0.35, ease: "power4.out" });
      }
    };

    const morphIn = () => {
      onTrackRef.current = true;
      setOnTrack(true);
      setLabel("Drag / Scroll");
      gsap.to(ring, {
        width: 88,
        height: 88,
        borderColor: "rgba(36,130,50,0.35)",
        backgroundColor: "rgba(255,255,255,0.92)",
        duration: 0.45,
        ease: "power4.out",
      });
    };

    const morphOut = () => {
      onTrackRef.current = false;
      setOnTrack(false);
      setLabel("");
      gsap.to(ring, {
        width: 14,
        height: 14,
        borderColor: "rgba(36,130,50,0.9)",
        backgroundColor: "rgba(36,130,50,1)",
        duration: 0.4,
        ease: "power4.out",
      });
    };

    const onEnterInteractive = () => {
      if (onTrackRef.current) return;
      gsap.to(ring, {
        width: 28,
        height: 28,
        backgroundColor: "rgba(36,130,50,0.2)",
        duration: 0.35,
        ease: "power4.out",
      });
    };

    const onLeaveInteractive = () => {
      if (onTrackRef.current) return;
      gsap.to(ring, {
        width: 14,
        height: 14,
        backgroundColor: "rgba(36,130,50,1)",
        duration: 0.35,
        ease: "power4.out",
      });
    };

    const tracks = document.querySelectorAll("[data-cursor-track]");
    tracks.forEach((el) => {
      el.addEventListener("mouseenter", morphIn);
      el.addEventListener("mouseleave", morphOut);
    });

    const interactives = document.querySelectorAll("a, button");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnterInteractive);
      el.addEventListener("mouseleave", onLeaveInteractive);
    });

    window.addEventListener("mousemove", onMove);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      tracks.forEach((el) => {
        el.removeEventListener("mouseenter", morphIn);
        el.removeEventListener("mouseleave", morphOut);
      });
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[200]"
      aria-hidden
    >
      <div
        ref={ringRef}
        className="flex items-center justify-center rounded-full border border-[var(--brand)] bg-[var(--brand)] will-change-[width,height]"
        style={{ width: 14, height: 14 }}
      >
        <span
          className={`font-display text-[10px] tracking-[0.16em] text-[var(--ink)] uppercase transition-opacity duration-300 ${
            onTrack ? "opacity-100" : "opacity-0"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
