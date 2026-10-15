"use client";

import { useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  external?: boolean;
  showArrow?: boolean;
};

export default function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
  external,
  showArrow = variant === "primary",
}: Props) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion()) return;
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.22, y: y * 0.22, duration: 0.45, ease: "power3.out" });
    gsap.to(textRef.current, {
      x: x * 0.1,
      y: y * 0.1,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const onLeave = () => {
    gsap.to(rootRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.45)",
    });
    gsap.to(textRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.45)",
    });
    if (arrowRef.current) {
      gsap.to(arrowRef.current, { x: 0, duration: 0.35, ease: "power3.out" });
    }
  };

  const onEnter = () => {
    if (prefersReducedMotion() || !arrowRef.current) return;
    gsap.to(arrowRef.current, { x: 4, duration: 0.35, ease: "power3.out" });
  };

  const styles =
    variant === "primary"
      ? "border border-transparent bg-[var(--brand)] text-white shadow-[0_10px_28px_rgba(36,130,50,0.28)] hover:bg-[var(--brand-soft)] hover:shadow-[0_14px_34px_rgba(36,130,50,0.34)]"
      : "border border-[var(--ink)]/18 bg-transparent text-[var(--ink)] hover:border-[var(--brand)] hover:bg-[var(--brand-wash)] hover:text-[var(--brand)]";

  return (
    <a
      ref={rootRef}
      href={href}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group inline-flex min-h-[52px] min-w-[11.5rem] items-center justify-center gap-2.5 rounded-[14px] px-7 py-3.5 font-body text-[12px] font-medium tracking-[0.16em] uppercase transition-[background-color,border-color,color,box-shadow] duration-300 will-change-transform ${styles} ${className}`}
    >
      <span ref={textRef} className="will-change-transform">
        {children}
      </span>
      {showArrow ? (
        <span
          ref={arrowRef}
          aria-hidden
          className="inline-block text-[13px] leading-none will-change-transform"
        >
          →
        </span>
      ) : null}
    </a>
  );
}
