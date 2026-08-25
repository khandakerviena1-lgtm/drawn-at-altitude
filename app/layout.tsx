import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter, Caveat } from "next/font/google";
import LenisProvider from "@/lib/scroll/LenisProvider";
import Navigation from "@/components/layout/Navigation";
import "./globals.css";

// Framer foundation typography: Bodoni Moda (editorial serif) + Inter.
const serif = Bodoni_Moda({
  weight: ["500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Handwriting placeholder — to be replaced with Anastasiia's scanned hand.
const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
});

export const metadata: Metadata = {
  title: "Drawn at Altitude — Ladakh, September 2027",
  description:
    "A nine-day travel sketching immersion in the Indus Valley, hosted by Anastasiia Morozova. Indus River Camp × Anastasiia. 8 guests, one riverside base.",
};

export const viewport: Viewport = {
  themeColor: "#f2ebdd",
};

// Static paper-fibre layer (dev placeholder for a real paper scan).
const GRAIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="240" height="240" filter="url(#n)"/></svg>`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" id="top">
      <body className={`${serif.variable} ${sans.variable} ${hand.variable}`}>
        <LenisProvider>
          <Navigation />
          {children}
          <div
            className="paperGrain"
            aria-hidden
            style={{
              backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`,
            }}
          />
        </LenisProvider>
      </body>
    </html>
  );
}
