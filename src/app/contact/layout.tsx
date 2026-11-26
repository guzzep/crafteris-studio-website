import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = pageSeo("/contact", "Contact Crafteris Studio Malta", "Contact our Birkirkara studio about pottery painting, workshops, memberships and private group experiences.", "/cards/workshops.png");
export default function Layout({children}: {children: ReactNode}) { return children; }
