import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { studioContact } from "@/lib/studio-contact";
import styles from "../support.module.css";
export const metadata={title:"Membership Guide | Crafteris Studio"};
const sections=[
  [
    "One studio. Many ways to create.",
    "Explore pottery, stained glass, fused glass, mosaic and more. Your membership is not tied to a single craft. Choose a package that matches how often you want to visit; access to particular equipment depends on your package, availability and safe-use guidance."
  ],
  [
    "Just visiting? Pay as you go",
    "€10 per studio hour. No membership commitment. Standard member discounts, loyalty and processing rates are not included."
  ],
  [
    "Flexible Maker — no six-month commitment",
    "10 hours: €65 (€6.50/hour). 20 hours: €120 (€6/hour). Both memberships last three months. Enjoy standard Maker benefits throughout your term, even if you use all your included hours. Ideal for occasional but regular creative visits."
  ],
  [
    "Maker — make the studio your regular creative home",
    "Maker Light: €44/month or €220 prepaid for six months; 52 hours over six months.",
    "Maker Light Daytime: €35/month or €175 prepaid for six months; 52 hours, Monday–Friday, sessions finishing by 16:00.",
    "Maker Plus: €75/month or €375 prepaid for six months; 104 hours over six months.",
    "Monthly subscriptions have a six-payment minimum commitment and continue monthly until cancelled; hours are released with successful payments. Prepaid memberships receive the full allocation upfront."
  ],
  [
    "Unlimited Maker — by enquiry",
    "€120/month or €1,200 prepaid for twelve months. Unlimited eligible studio access, subject to availability and reasonable shared use; not intended for continuous commercial production."
  ],
  [
    "Home Maker — create at home, stay connected",
    "€60 for six months with 6 studio hours, or €100 for twelve months with 12 studio hours. Enjoy material discounts, loyalty rewards and €16/kg pottery processing (clay purchased separately). Use your included studio hours for eligible activities including glazing, glass and mosaic. Pottery-wheel access is not included in the Home Maker entitlement."
  ],
  [
    "Membership benefits",
    "Active members receive 10% off eligible retail products and materials, plus two studio hours for every €100 of qualifying purchases after discounts, including VAT. Loyalty hours last 12 months. Membership fees, workshops, PYOP, firing, processing and hour packs do not qualify. Regular Maker processing is €18/kg using studio clay; Home Maker processing is €16/kg with clay purchased separately."
  ],
  [
    "Need more time?",
    "Standard studio hours: €10 for one hour, €65 for 10 hours or €120 for 20 hours; the 10- and 20-hour packs are valid for three months. Home Maker glazing-only top-ups: €8 for one hour, €35 for five hours or €60 for ten hours. Purchased glazing-only hours do not expire but require an active eligible membership. General studio hours can also be used for glazing."
  ],
  [
    "Book, create, return",
    "Book eligible studio facilities up to 30 days ahead. Give at least 24 hours’ notice to cancel or reschedule without losing reserved hours. Qualifying prepaid Maker renewals carry unused hours forward if renewed before expiry or within the 14-day grace period; booking access pauses during expiry. See the full membership terms for details."
  ],
  [
    "Come and create with us",
    "Monday–Friday 09:00–20:00 | Saturday 09:00–17:00 | Sunday closed. All listed prices include VAT. Contact info@crafteris.com to learn more. Memberships and activities are subject to availability and the published Membership Terms & Studio Regulations."
  ]
];
export default function Page(){return <><Header/><main className={styles.page}><section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>{studioContact.name}</p><h1>Membership Guide</h1><p>Version 1.1 · Effective date: 1 January 2027</p><p>{studioContact.address}</p><p><a href={"mailto:"+studioContact.email}>{studioContact.email}</a> · <a href={studioContact.phoneHref}>{studioContact.phone}</a></p></div></section><div className={styles.content}>{sections.map(([heading,...paragraphs])=><section className={styles.card} key={heading}><h2>{heading}</h2>{paragraphs.map((p,i)=><p key={i} style={{marginTop:i?12:0}}>{p}</p>)}</section>)}<p><Link href="/membership-terms">Read Membership Terms &amp; Studio Regulations →</Link></p><Link href="/policies">← All policies & studio terms</Link></div></main><Footer/></>;}
