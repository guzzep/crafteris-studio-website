import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { workshopCatalogue } from "@/lib/workshop-catalogue";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.CRAFTERIS_INDEXABLE !== "true") return [];
  const paths = new Set<string>(["","about","explore","pottery","paint-your-own-pottery","glass","mosaic","workshops","programmes","membership","home-maker","team-building","creative-birthday-parties","school-art-workshops","collaborative-corporate-artwork","shop","pottery-supplies","glass-art-supplies","mosaic-supplies","creative-hen-parties","gift-vouchers","gallery","visit","contact","faqs","whats-on","policies","privacy","terms","booking-terms","membership-terms","cancellation-refunds","cookies","accessibility","disclaimer","firing-terms","membership-guide"]);
  for (const item of workshopCatalogue) if (item.status === "published" && !item.pending && !item.seasonal) paths.add("workshops/" + encodeURIComponent(item.slug));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url && key) {
    try {
      const supabase = createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false}});
      for (const table of ["workshops", "programmes"] as const) {
        const {data, error} = await supabase.from(table).select("slug").eq("status", "published");
        if (error) { console.error("Sitemap query failed", table, error.message); continue; }
        for (const item of data ?? []) if (typeof item.slug === "string" && item.slug) paths.add(table + "/" + encodeURIComponent(item.slug));
      }
    } catch (error) { console.error("Sitemap catalogue unavailable", error); }
  }
  return Array.from(paths, path => ({url: "https://crafteris.studio/" + path}));
}
