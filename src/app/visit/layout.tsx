import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = pageSeo("/visit", "Visit Our Creative Studio in Birkirkara, Malta", "Find Crafteris Studio in Birkirkara, Malta. Plan your visit, get directions and contact the studio.", "/visit/visit-hero.png");
export default function Layout({children}: {children: ReactNode}) { return children; }
