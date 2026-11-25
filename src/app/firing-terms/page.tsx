import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { studioContact } from "@/lib/studio-contact";
import styles from "../support.module.css";
export const metadata={title:"Firing & Artwork Collection Terms | Crafteris Studio"};
const sections=[
  [
    "1. Scope and acceptance",
    "These terms apply to artwork submitted for firing, ceramics processing and collection at Crafteris Studio, including member, non-member and workshop work where applicable. The applicable services and charges are confirmed at intake. Mandatory consumer rights take precedence. Customers should receive the terms before accepting a service. Explicit digital acceptance is recorded on first use and again when applicable terms change or special conditions apply. The applicable version is linked to each intake; returning customers can review or download it before confirming."
  ],
  [
    "2. Materials and preparation",
    "Tell staff which clay body, glass, glaze or other material has been used, including its firing range where known. External materials require compatibility approval. Staff may refuse unknown or unsuitable materials to protect equipment and other artwork. Work must be suitably prepared and dry for the intended firing; staff may defer processing until it is ready."
  ],
  [
    "3. Member ceramics processing",
    "Regular Maker members using studio clay: €18/kg, including clay, standard studio glazes, bisque and glaze firing. Home Maker: €16/kg for processing, with clay purchased separately. Both rates include applicable VAT and have no minimum weight. The recorded dry pre-bisque weight determines the charge. Standard processing is charged once, not again at glaze firing. Confirm eligibility and any specialist or external-material charges before acceptance."
  ],
  [
    "4. Non-member ceramics",
    "Bisque firing: €8/kg. Glaze firing: €12/kg. Studio glaze use: an additional €5/kg. The minimum billable weight is 400 g per combined intake, not per piece. Prices include VAT. If all three services are selected, the rate is €25/kg before clay costs. Approved own glazes may be used without purchasing studio glaze use. Selected services are paid in advance."
  ],
  [
    "5. Glazing appointments",
    "Non-member studio glaze use includes supervised glazing-bench time: one hour for up to 2 kg, two hours for over 2 kg up to 4 kg, three hours for over 4 kg up to 6 kg, and one further hour for each additional 2 kg or part thereof. Time is booked in one-hour sessions. Staff will notify customers after bisque firing and arrange access to their prepaid glazing entitlement."
  ],
  [
    "6. Glass firing and specialist work",
    "Glass firing, kiln hire and any specialist services are priced according to the applicable service quotation or published tariff supplied before acceptance. These terms do not set a new glass tariff. Confirm material compatibility, dimensions, processing requirements and any additional charges with staff."
  ],
  [
    "7. Firing results and care",
    "Firing is a creative and technical process. Cracking, warping, breakage, colour changes, glaze defects, dimensional changes and reactions between materials may occur. We will exercise reasonable care and skill but cannot guarantee a specific artistic outcome. If something goes wrong, we will assess the circumstances and discuss appropriate remedies. Nothing excludes liability or remedies that cannot lawfully be excluded."
  ],
  [
    "8. Progress and collection",
    "We will notify customers when work is ready. PYOP pieces are normally ready within one to two weeks, but this is an estimate, not a guaranteed date. Other firing times depend on drying, kiln schedules and the work involved. Group workshop artwork may be collected individually; collecting one participant’s work does not close other participants’ records."
  ],
  [
    "9. Storage",
    "Finished ceramics receive 30 days of free storage following the ready-for-collection notification. Reminders are normally issued after 14 and 30 days. Contact us if you need additional time. No automatic disposal, forfeiture or storage fee applies automatically; any further action must follow approved published terms, reasonable notice and applicable law."
  ],
  [
    "10. Questions and complaints",
    "Contact info@crafteris.com or +356 7798 1366 with your intake reference if available. We will review concerns fairly. Statutory rights remain unaffected."
  ]
];
export default function Page(){return <><Header/><main className={styles.page}><section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>{studioContact.name}</p><h1>Firing & Artwork Collection Terms</h1><p>Version 1.1 · Effective date: 1 January 2027</p><p>{studioContact.address}</p><p><a href={"mailto:"+studioContact.email}>{studioContact.email}</a> · <a href={studioContact.phoneHref}>{studioContact.phone}</a></p></div></section><div className={styles.content}>{sections.map(([heading,...paragraphs])=><section className={styles.card} key={heading}><h2>{heading}</h2>{paragraphs.map((p,i)=><p key={i} style={{marginTop:i?12:0}}>{p}</p>)}</section>)}<Link href="/policies">← All policies & studio terms</Link></div></main><Footer/></>;}
