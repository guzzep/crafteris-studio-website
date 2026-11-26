import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  // Allow crawlers to see noindex metadata on previews.
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(process.env.CRAFTERIS_INDEXABLE === "true" ? { sitemap: "https://crafteris.studio/sitemap.xml" } : {}),
  };
}
