"use client";

/**
 * Main page body sits above the sticky footer so scrolling
 * lifts content like a curtain to uncover the contact footer.
 */
export default function CurtainShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 bg-[var(--surface-soft)] shadow-[0_-24px_60px_rgba(13,31,18,0.08)]">
      {children}
    </div>
  );
}
