import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.CRAFTERIS_INDEXABLE !== "true") return [];
  return ["","about","explore","pottery","paint-your-own-pottery","glass","mosaic","workshops","programmes","membership","team-building","shop","gift-vouchers","gallery","visit","contact","faqs","whats-on","policies","privacy","terms","booking-terms","membership-terms","cancellation-refunds","cookies","accessibility","disclaimer","firing-terms","membership-guide"].map(path => ({ url: "https://crafteris.studio/" + path }));
}
