import type { Metadata } from "next";
import HomeClient from "./HomeClient";
export const metadata: Metadata = { alternates: { canonical: "/" } };
const business = {
  "@context": "https://schema.org", "@type": "LocalBusiness",
  "@id": "https://crafteris.studio/#studio", name: "Crafteris Studio – Home to GlassXpressions",
  url: "https://crafteris.studio", telephone: "+356 7798 1366", email: "info@crafteris.com",
  address: { "@type": "PostalAddress", streetAddress: "314, Fleur-de-Lis Road", addressLocality: "Birkirkara", postalCode: "BKR 9067", addressCountry: "MT" },
  areaServed: { "@type": "Country", name: "Malta" },
  description: "Creative studio in Birkirkara for pottery painting, pottery classes, glass and mosaic workshops, studio memberships, ceramic firing and creative team building."
};
export default function HomePage() { return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(business).replace(/</g, "\\u003c")}} /><HomeClient /></>; }
