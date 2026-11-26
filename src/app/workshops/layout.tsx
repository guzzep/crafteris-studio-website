import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = pageSeo("/workshops", "Creative Workshops in Malta", "Discover hands-on pottery, fused glass, stained glass and mosaic workshops at Crafteris Studio in Birkirkara.", "/workshops/workshops-hero.png");
export default function Layout({children}: {children: ReactNode}) { return children; }
