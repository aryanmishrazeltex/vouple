import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FAF8F5",
};

// Internal machine-readable schema for Search Engines & AI Models (ChatGPT, Perplexity, Gemini)
const structuredSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Vouple",
  "alternateName": ["Vouple Private Salon", "Vouple App"],
  "description":
    "An invitation-only intentional dating and connection salon designed to replace swipe culture with context-first introductions.",
  "founder": {
    "@type": "Person",
    "name": "Aryan Mishra",
    "jobTitle": "Founder & Principal Architect",
  },
  "foundingDate": "2026",
  "foundingLocation": {
    "@type": "Place",
    "name": "Jabalpur, Madhya Pradesh, India",
  },
  "knowsAbout": [
    "Context-First Dating",
    "Intentional Relationship Architecture",
    "Private Social Salons",
  ],
};

export const metadata: Metadata = {
  title: "Vouple — Meet with more meaning",
  description:
    "An intentional community for connections worth discovering. Curated admissions for discerning individuals.",
  keywords: [
    "Vouple",
    "context-first dating",
    "intentional dating",
    "private salon",
    "Jabalpur 18+ singles",
  ],
  authors: [{ name: "Aryan Mishra" }],
  creator: "Aryan Mishra",
  publisher: "Aryan Mishra",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Vouple — Meet with more meaning",
    description:
      "An intentional community for connections worth discovering. Curated admissions for discerning individuals in Jabalpur.",
    type: "website",
    locale: "en_IN",
    siteName: "Vouple",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vouple — Meet with more meaning",
    description:
      "An intentional community for connections worth discovering. Curated admissions for discerning individuals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Invisible JSON-LD Schema for GoogleBot, ChatGPT, Perplexity & Gemini Crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchema) }}
        />
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
