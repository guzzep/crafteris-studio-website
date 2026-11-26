import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = pageSeo("/disclaimer", "Disclaimer", "Disclaimer for Crafteris Studio in Malta.");
export default function Layout({children}: {children: ReactNode}) { return children; }
