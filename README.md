# Amplify Holidays — Kinetic Experience

Scroll-driven rebuild of [amplifyholidays.com](https://amplifyholidays.com): Lenis inertia scrolling + GSAP ScrollTrigger choreography.

## Stack

- Next.js 16 (App Router) + Tailwind CSS v4
- GSAP + `@gsap/react` + ScrollTrigger
- Lenis (`lenis`) synced to the GSAP ticker

## Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm start
```

## File tree

```
src/
  app/
    layout.tsx          # Syne + Outfit fonts, metadata
    page.tsx            # Section composition
    globals.css         # Brand tokens, Lenis, reduced-motion
  components/
    providers/
      SmoothScroll.tsx  # Lenis ↔ GSAP ticker sync
    ui/
      CustomCursor.tsx  # Magnetic Drag/Scroll cursor
      MagneticButton.tsx
    sections/
      Nav.tsx
      Hero.tsx           # Pin + scrub unveil, split-text
      ValueProp.tsx      # Word-by-word illumination
      Destinations.tsx  # Horizontal hijack + parallax
      Metrics.tsx        # Velocity marquee + odometers
      Footer.tsx         # Sticky curtain CTA
      CurtainShell.tsx
  lib/
    content.ts          # Brand copy, destinations, metrics
    motion.ts           # Easing + prefers-reduced-motion
```

## Choreography map

| Section | Behavior |
| --- | --- |
| Hero | Character reveal on load; pin `150vh`; typography scales out; media expands via `scale` + `border-radius` |
| Value | Pinned editorial paragraph; scroll scrubs word opacity/color |
| Destinations | Desktop: pinned horizontal track + image parallax + `01/06` progress; mobile: stacked vertical cards |
| Metrics | Dual marquees skew/speed from `getVelocity()`; counters at `top 80%` |
| Footer | Sticky full-viewport curtain reveal + magnetic CTAs |

## Accessibility

- `prefers-reduced-motion: reduce` disables pins/scrubs and reveals content immediately
- `gsap.matchMedia()` turns off horizontal hijack below `768px`
