import type { Metadata } from "next";
import type { ReactNode } from "react";
export const metadata: Metadata = { alternates: { canonical: "/about" }, title: "About Crafteris Studio Malta", description: "Discover Crafteris Studio, home to GlassXpressions, a creative space for pottery, glass and mosaic in Malta." };
export default function Layout({ children }: { children: ReactNode }) { return children; }
