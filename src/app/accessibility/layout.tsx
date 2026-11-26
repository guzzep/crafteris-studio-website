import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = pageSeo("/accessibility", "Accessibility", "Accessibility for Crafteris Studio in Malta.");
export default function Layout({children}: {children: ReactNode}) { return children; }
