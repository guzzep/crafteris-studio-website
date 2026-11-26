import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = pageSeo("/firing-terms", "Firing Terms", "Firing Terms for Crafteris Studio in Malta.");
export default function Layout({children}: {children: ReactNode}) { return children; }
