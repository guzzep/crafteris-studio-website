import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://crafteris.studio"),
  title: { default: "Crafteris Studio | Pottery, Glass & Creative Workshops Malta", template: "%s | Crafteris" },
  description: "Discover pottery painting, pottery classes, fused and stained glass, mosaic, creative workshops and studio memberships in Birkirkara, Malta.",
  robots: { index: process.env.CRAFTERIS_INDEXABLE === "true", follow: process.env.CRAFTERIS_INDEXABLE === "true" },
  openGraph: {
    type: "website", siteName: "Crafteris Studio", locale: "en_MT",
    title: "Crafteris Studio | Pottery, Glass & Creative Workshops Malta", description: "Discover pottery painting, pottery classes, fused and stained glass, mosaic, creative workshops and studio memberships in Birkirkara, Malta.",
    images: [{ url: "/cards/workshops.png", alt: "Creative workshops at Crafteris Studio" }],
  },
  twitter: { card: "summary_large_image", title: "Crafteris Studio | Pottery, Glass & Creative Workshops Malta", description: "Discover pottery painting, pottery classes, fused and stained glass, mosaic, creative workshops and studio memberships in Birkirkara, Malta.", images: ["/cards/workshops.png"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
