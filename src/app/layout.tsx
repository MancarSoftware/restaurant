import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const display = Barlow_Condensed({
  variable: "--font-poster",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const sans = IBM_Plex_Sans({
  variable: "--font-human",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Casa Bruma — Cocina ecuatoriana de autor",
    template: "%s · Casa Bruma",
  },
  description:
    "Cocina ecuatoriana contemporánea en Guayaquil: territorio, fuego y memoria en una experiencia íntima.",
  applicationName: "Casa Bruma",
  keywords: [
    "restaurante de autor",
    "fine dining Guayaquil",
    "cocina ecuatoriana",
    "Casa Bruma",
  ],
  authors: [{ name: "Casa Bruma" }],
  openGraph: {
    title: "Casa Bruma — Ecuador, contado a fuego lento",
    description: "Una casa de cocina ecuatoriana contemporánea en Guayaquil.",
    locale: "es_EC",
    type: "website",
    images: [
      {
        url: "/images/hero-kitchen-v2.webp",
        width: 1536,
        height: 1024,
        alt: "Corvina con cacao y maduro de Casa Bruma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Bruma",
    description: "Ecuador, contado a fuego lento.",
    images: ["/images/hero-kitchen-v2.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080808",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
