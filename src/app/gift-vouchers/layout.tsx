import { pageSeo } from "@/lib/seo";
import type { ReactNode } from "react";
export const metadata = pageSeo("/gift-vouchers", "Creative Experience Gift Vouchers in Malta", "Discover creative gift voucher options for experiences at Crafteris Studio in Malta.", "/cards/workshops.png");
export default function Layout({children}: {children: ReactNode}) { return children; }
