import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = pageSeo("/whats-on", "Creative Workshops & Events in Malta", "Explore upcoming creative workshops, pottery painting and courses at Crafteris Studio in Malta.", "/cards/workshops.png");
export default function Layout({children}: {children: ReactNode}) { return children; }
