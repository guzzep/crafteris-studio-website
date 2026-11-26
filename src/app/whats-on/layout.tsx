import type { Metadata } from "next";
import type { ReactNode } from "react";
export const metadata: Metadata = { alternates: { canonical: "/whats-on" }, title: "Creative Workshops & Events in Malta", description: "Discover upcoming creative workshops, pottery painting and courses at Crafteris Studio in Malta." };
export default function Layout({ children }: { children: ReactNode }) { return children; }
