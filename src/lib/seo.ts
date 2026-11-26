import type { Metadata } from "next";
export function pageSeo(path: string, title: string, description: string, image = "/cards/workshops.png"): Metadata {
  const fullTitle = title + " | Crafteris";
  return { title, description, alternates: { canonical: path },
    openGraph: { type: "website", siteName: "Crafteris Studio", locale: "en_MT", url: path, title: fullTitle, description, images: [{url: image}] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] } };
}
