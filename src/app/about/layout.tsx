import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = pageSeo("/about", "About Crafteris Studio Malta", "Discover Crafteris Studio, home to GlassXpressions, a creative space for pottery, glass and mosaic in Malta.", "/materials/glass.png");
export default function Layout({children}: {children: ReactNode}) { return children; }
