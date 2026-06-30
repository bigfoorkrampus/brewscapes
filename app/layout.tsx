import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL("https://www.brewscapes.com"),

  title: {
    default: "Brewscapes | Discover the Healing Power of Tea",
    template: "%s | Brewscapes",
  },

  description:
    "Explore herbal teas, wellness traditions, brewing guides, recipes and natural healing. Brewscapes is your trusted companion on the journey to a more mindful, plant-powered life.",

  keywords: [
    "herbal tea",
    "tea wellness",
    "natural healing",
    "brewing guide",
    "herbal remedies",
    "tea recipes",
    "adaptogens",
    "chamomile",
    "ashwagandha tea",
    "green tea benefits",
    "loose leaf tea",
    "tea ceremony",
    "holistic health",
    "plant medicine",
    "anti-inflammatory tea",
    "sleep tea",
    "digestive tea",
    "immunity herbs",
    "mindful living",
    "functional beverages",
  ],

  authors: [{ name: "Brewscapes", url: "https://www.brewscapes.com" }],
  creator: "Brewscapes",
  publisher: "Brewscapes",

  category: "Health & Wellness",

  alternates: {
    canonical: "https://www.brewscapes.com",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph ──────────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.brewscapes.com",
    siteName: "Brewscapes",
    title: "Brewscapes | Discover the Healing Power of Tea",
    description:
      "Explore herbal teas, wellness traditions, brewing guides, recipes and natural healing. Your guide to a more mindful, plant-powered life.",
    images: [
      {
        url: "/og/default.jpg",
        width: 1200,
        height: 630,
        alt: "Brewscapes — Discover the Healing Power of Tea",
        type: "image/jpeg",
      },
    ],
  },

  // ── Twitter / X ─────────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@brewscapes",
    creator: "@brewscapes",
    title: "Brewscapes | Discover the Healing Power of Tea",
    description:
      "Explore herbal teas, wellness traditions, brewing guides, recipes and natural healing. Your guide to a more mindful, plant-powered life.",
    images: ["/og/default.jpg"],
  },

  // ── App / PWA ────────────────────────────────────────────────────────────────
  applicationName: "Brewscapes",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Brewscapes",
  },
  formatDetection: {
    telephone: false,
  },
};

// ─── Viewport ─────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f0e8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1612" },
  ],
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className={[
          // Base font & rendering
          "font-sans",
          "antialiased",
          "[text-rendering:optimizeLegibility]",
          "[-webkit-font-smoothing:antialiased]",
          "[-moz-osx-font-smoothing:grayscale]",

          // Layout
          "min-h-screen",
          "flex",
          "flex-col",

          // Colour tokens (override in globals.css)
          "bg-[--color-bg]",
          "text-[--color-fg]",

          // Scroll behaviour
          "scroll-smooth",

          // Prevent overflow on mobile
          "overflow-x-hidden",
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}