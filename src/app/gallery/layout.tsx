import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = pageSeo("/gallery", "Creative Studio Gallery Malta", "Explore pottery, glass, mosaic and creative workshop inspiration at Crafteris Studio.", "/materials/glass.png");
export default function Layout({children}: {children: ReactNode}) { return children; }
