import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Amplify Holidays — Customised Journeys",
  description:
    "A fusion of futuristic wonders and timeless charms. Bespoke travel packages for Dubai, Maldives, Thailand, Singapore, Bali & more.",
  openGraph: {
    title: "Amplify Holidays",
    description:
      "Customised trips, 95% visa success, 24×7 concierge. Plan your dream vacation.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--surface-soft)] text-[var(--ink)] antialiased">
        {children}
      </body>
    </html>
  );
}
