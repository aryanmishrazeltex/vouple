import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fef9f2",
};

export const metadata: Metadata = {
  title: "Vouple — Animated Landing Page with Micro-Interactions",
  description:
    "Vouple is building an intentional dating experience shaped by shared pursuits and stated intentions—giving you tangible context before deciding whether to connect. Planned first market: Jabalpur, India.",
  keywords: [
    "Vouple",
    "dating app Jabalpur",
    "intentional dating",
    "context-first dating",
    "Jabalpur 18+ singles",
  ],
  openGraph: {
    title: "Vouple — Dating should give you more to go on",
    description:
      "Vouple is building an intentional dating experience shaped by shared pursuits and stated intentions. Starting in Jabalpur, India.",
    type: "website",
    locale: "en_IN",
    siteName: "Vouple",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500;1,600&family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Instrument+Serif:ital@0;1&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@600;700;800&family=Work+Sans:wght@400;500;600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-background font-body-md text-on-surface antialiased selection:bg-secondary/20 selection:text-secondary">
        {children}
      </body>
    </html>
  );
}
