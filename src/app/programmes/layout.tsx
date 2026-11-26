import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = pageSeo("/programmes", "Pottery & Glass Courses in Malta", "Build creative skills over several sessions with pottery, wheel throwing, fused glass and stained glass courses at Crafteris Studio.", "/programmes/programmes-hero.png");
export default function Layout({children}: {children: ReactNode}) { return children; }
