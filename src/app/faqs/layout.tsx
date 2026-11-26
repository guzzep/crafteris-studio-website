import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = pageSeo("/faqs", "Frequently Asked Questions", "Find answers about studio visits, creative workshops, bookings and collecting your finished projects.", "/cards/workshops.png");
export default function Layout({children}: {children: ReactNode}) { return children; }
