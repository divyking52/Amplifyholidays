export const EASE = {
  snappy: "cubic-bezier(0.16, 1, 0.3, 1)",
  power4: "power4.out",
  expo: "expo.out",
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
