import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {studioContact} from "@/lib/studio-contact";
import styles from "../support.module.css";
export const metadata={title:"Membership Terms & Studio Regulations | Crafteris Studio"};
const sections=[
  [
    "1. Welcome to Crafteris Studio",
    "Crafteris Studio is a shared creative environment where individuals can develop their skills, explore different artistic disciplines and work independently on personal projects. Membership is not restricted to a particular craft. Members may explore pottery, fused glass, stained glass, mosaics and other supported crafts, subject to membership entitlements, equipment availability, experience and safety requirements. We aim to provide a welcoming, supportive and respectful environment for everyone."
  ],
  [
    "2. Membership packages",
    "All stated prices include applicable VAT.",
    "2.1 Pay As You Go: Studio access costs €10 per hour, without a membership commitment. Pay As You Go customers do not receive standard membership discounts, loyalty rewards or member processing rates.",
    "2.2 Flexible Maker memberships: Flexible Maker 10 — €65, 10 hours, 3 months. Flexible Maker 20 — €120, 20 hours, 3 months. Flexible Maker members pay a higher hourly rate in exchange for flexibility without a six-month commitment. Standard Maker membership benefits remain active throughout the three-month term, even after the original hour allocation is exhausted. Additional hours may be purchased.",
    "2.3 Maker memberships: Maker Light — €44 monthly or €220 prepaid for six months, 52 hours. Maker Light Daytime — €35 monthly or €175 prepaid for six months, 52 hours. Maker Plus — €75 monthly or €375 prepaid for six months, 104 hours. Maker Light Daytime bookings must take place Monday to Friday and finish by 16:00. Other Maker memberships may book eligible activities during normal operating hours.",
    "2.4 Unlimited Maker: €120 monthly or €1,200 for twelve months prepaid. Available by enquiry and studio approval. Unlimited access is subject to availability, operating hours, safety requirements and reasonable shared-studio use. It is intended for personal creative development, not continuous commercial-scale production.",
    "2.5 Home Maker: 6 months €60, 6 included studio hours; 12 months €100, 12 included studio hours. Home Maker is a cross-craft membership for people who mainly create at home. It includes a 10% eligible materials and retail discount, loyalty rewards, general studio hours and reduced pottery processing rates. Pottery-wheel access is not included. Additional studio and dedicated glazing hours may be purchased."
  ],
  [
    "3. Membership benefits",
    "Active members receive access to eligible facilities, online bookings, the Member App, a 10% discount on eligible materials and retail products, purchase loyalty rewards and applicable member firing and processing rates. Equipment and activity permissions depend on the package and studio requirements. Discounts do not normally apply to membership fees, hour packs, workshops, PYOP, firing or processing charges."
  ],
  [
    "4. Membership payments and commitments",
    "4.1 Prepaid memberships: For fully prepaid Maker memberships, the complete studio-hour allocation becomes available following successful payment. Membership remains valid for the applicable term.",
    "4.2 Monthly subscriptions: Standard monthly Maker subscriptions have an initial minimum commitment of six monthly payments and then continue monthly until cancelled. Hours are released progressively after each successful payment, not all six months upfront. Unused monthly hours accumulate while the subscription remains active. Failed payments do not release new hours. The payment schedule and minimum commitment will be displayed before enrollment. If a recurring payment fails, new member bookings are blocked and no new hours are granted. Existing unused hours are preserved. We will email a secure payment-update link and retry using our payment provider’s configured schedule. Successful payment restores eligible access and releases the corresponding hours once. The remaining commitment continues.",
    "4.3 Complimentary and discounted memberships: The studio may provide approved complimentary or discounted memberships for partnerships, promotions, goodwill or other special circumstances, subject to agreed duration and conditions. Complimentary membership will not automatically convert into a paid subscription without explicit agreement."
  ],
  [
    "5. Studio hours and glazing hours",
    "Studio hours may be used for eligible stained glass, fused glass, mosaic, handbuilding, glazing and pottery-wheel sessions where permitted. Glazing hours may only be used for eligible ceramics glazing. Studio hours may also be used for glazing.",
    "5.1 Additional studio hours: 1 hour €10; 10 hours €65; 20 hours €120. Purchased 10-hour and 20-hour packages are valid for three months.",
    "5.2 Home Maker glazing top-ups: 1 hour €8; 5 hours €35; 10 hours €60. Purchased Home Maker glazing hours do not expire, but require an active eligible membership to be used.",
    "5.3 Hour consumption: Eligible hours with the earliest expiry are used first. Where expiry dates are equivalent, glazing-only hours take priority for glazing bookings. Members can view studio and glazing balances separately in the Member App."
  ],
  [
    "6. Purchase loyalty rewards",
    "Eligible active members earn two studio hours for every €100 spent on qualifying materials and products. Qualifying spend is the actual VAT-inclusive amount paid after discounts, including eligible glass, mosaic, clay, ceramics and other designated retail goods. Membership fees, hour packs, workshops, PYOP, firing and processing do not qualify. Qualifying spending accumulates across purchases and any excess carries forward. Loyalty hours expire twelve months after award. Returns and refunds may result in corresponding loyalty adjustments. An active eligible membership is required to use loyalty hours."
  ],
  [
    "7. Membership renewals and hour expiry",
    "Qualifying prepaid Maker renewals carry unused included studio hours into the new term. Members have a fourteen-day renewal grace period after expiry. A qualifying renewal within that period preserves eligible unused membership hours. Booking access is suspended while membership is expired. After the grace period, unused included hours expire unless an authorized exception applies. Purchased and loyalty hours retain their individual validity and eligibility conditions. Flexible Maker hours expire at the end of their stated validity unless an applicable renewal or extension has been approved."
  ],
  [
    "8. Membership upgrades and downgrades",
    "Prepaid upgrades are charged proportionally to the price difference and remaining term, with proportional additional hours. Existing unused eligible hours are retained and the expiry date remains unchanged. Monthly upgrades take effect on the next payment date, with the new price and future entitlement; previous payments and allocations are not recalculated and the original minimum commitment does not restart. Downgrades take effect at the relevant renewal or commitment boundary, with permissions following the new package."
  ],
  [
    "9. Membership pause, suspension and cancellation",
    "9.1 Access pause: The studio may approve a temporary access pause. This does not automatically suspend payments or extend expiry. Additional arrangements must be agreed separately.",
    "9.2 Subscription suspension: In exceptional circumstances, such as prolonged illness, approved monthly subscription suspension stops future installments and booking access, preserves existing balances subject to independent expiry rules, and does not create catch-up charges for suspended months. On resumption the next unpaid installment and remaining commitment continue.",
    "9.3 Subscription cancellation: Members may request cancellation at any time. During the initial commitment cancellation normally takes effect at its end; afterwards it normally takes effect at the end of the applicable paid billing period. Unused subscription hours expire on termination. Purchased hours and loyalty rewards retain their separate terms. Statutory cancellation, withdrawal and refund rights are not limited by this agreement."
  ],
  [
    "10. Studio bookings",
    "Book through the Member App or arrange with staff. All sessions depend on resource availability and package permissions. Advance booking: up to 30 days. Online booking cutoff: 1 hour before start. Cancellation / rescheduling: 24 hours notice. Start intervals / extensions: 30 minutes. There is no standard daily booking or hour limit, subject to sufficient eligible hours and available resources. Extensions require availability and sufficient entitlement. Members must not occupy reserved facilities beyond their session without approval."
  ],
  [
    "11. Booking cancellations and attendance",
    "Cancel or reschedule with at least 24 hours’ notice without losing reserved hours. Late cancellation and non-attendance normally forfeit the original reserved hours. A late change is subject to availability and the original hours are forfeited if the member cancels and books a replacement session. Members booking inside the cancellation window must acknowledge the policy. Routine check-in and checkout are not required. Studio-initiated changes do not penalize members. Staff may approve reasonable exceptions."
  ],
  [
    "12. Studio facilities and equipment",
    "Facilities may include worktables, pottery wheels, glazing facilities, glassworking tools, grinders, slab roller, wall extruder and other specialist equipment. Members must receive suitable operating guidance before using unfamiliar equipment. Certain equipment requires supervision or permission. Kilns, furnaces and restricted machinery must not be operated without explicit authorization. Members must use their assigned numbered wheel unless staff authorize a change. Slab rollers and extruders are generally first come, first served, subject to safe use and staff approval."
  ],
  [
    "13. Studio conduct and housekeeping",
    "Members must treat others respectfully, use equipment responsibly, follow staff instructions, keep workspaces organized, clean their area and equipment within their booked session, return shared tools and respect other people’s work and belongings. Disruptive or unsafe behavior is not permitted. Clay dust must be controlled with appropriate wet cleaning. Dry sweeping, uncontrolled sanding and other activities creating hazardous dust are not permitted. Place glass fragments and sharp waste in designated containers. Do not interfere with another person’s artwork, tools or materials without permission."
  ],
  [
    "14. Materials and creative activities",
    "Materials may be purchased from the studio or brought in where suitable and approved when necessary. External clay, glazes, glass and other materials intended for kiln firing must be identified and approved before processing. The studio may refuse unknown, incompatible or hazardous materials. Material and firing charges may apply separately from studio-hour charges."
  ],
  [
    "15. Pottery processing",
    "Regular Maker members using studio clay pay €18/kg, including studio clay and the agreed processing workflow: standard studio glazes, bisque and glaze firing. Home Makers purchase clay separately and pay €16/kg for the agreed processing workflow. Previously purchased clay is not deducted from this charge. Processing is based on the authoritative dry weight before bisque firing, with no standard minimum for eligible members. Additional specialist services may be charged separately where agreed in advance. Members must follow preparation, drying, glazing and firing instructions."
  ],
  [
    "16. Firing and artwork risks",
    "Ceramics and glassworking may produce cracking, warping, breakage, colour or dimensional variations, glaze imperfections and unexpected material reactions. The studio will exercise reasonable care, but a particular artistic or technical result cannot be guaranteed. Damage involving unsuitable materials, preparation or inherent process risks will be assessed individually. Nothing excludes liability where it cannot lawfully be excluded, including obligations of reasonable care and skill."
  ],
  [
    "17. Storage and artwork collection",
    "Finished ceramics receive thirty days of free storage following ready-for-collection notification. Reminders are normally issued after fourteen and thirty days. Contact staff for extended storage arrangements. Personal artwork, materials and equipment may only be stored in designated areas with approval. Shared storage is not permanent personal storage unless agreed. Further action concerning uncollected work is subject to published collection terms, reasonable notice and legal requirements."
  ],
  [
    "18. Safety and personal responsibility",
    "Follow safety instructions and use appropriate protective equipment. Report accidents, injuries, damaged equipment, unsafe conditions, spills and faults immediately. The studio may restrict equipment access when unsafe practices are observed. Members must not operate equipment while impaired by alcohol, drugs or any condition preventing safe participation. Members remain responsible for their belongings and should avoid leaving valuables unattended.",
    "Closed-toe footwear is mandatory throughout the studio. Flip-flops, sandals and other open footwear are not permitted because glass is used on the premises."
  ],
  [
    "19. Respectful use and membership restrictions",
    "The studio may take reasonable and proportionate action for serious or repeated safety violations, harassment, deliberate damage, unauthorized equipment use, fraudulent use of benefits or persistent misuse of shared facilities. Actions may include warnings, access restrictions, suspension or termination. Financial adjustments and refunds will be handled in accordance with the agreement, circumstances and applicable law."
  ],
  [
    "20. Personal information and communications",
    "Personal information is processed to administer memberships, bookings, payments, customer services and operations. Members may receive essential communications about membership, payments, bookings, changes, artwork processing, collection and studio notices. Marketing is managed separately. Personal information is handled according to the studio Privacy Policy and applicable data-protection legislation. Promotional use of identifiable member photographs or artwork is managed separately where required."
  ],
  [
    "21. Changes to prices and studio regulations",
    "The studio may review prices, services, membership options and regulations. Members will receive appropriate notice of material changes. Changes affecting existing prepaid memberships or commitments will follow applicable contractual and consumer-protection requirements. Regulations may be updated where reasonably necessary for safety, legal compliance or effective operation."
  ],
  [
    "22. Consumer rights and complaints",
    "Nothing in this agreement restricts mandatory Maltese or applicable EU consumer rights. Members are encouraged to contact the studio with concerns about payments, services, membership or operations. Complaints will be considered fairly and within a reasonable period. Applicable statutory remedies remain available."
  ],
  [
    "23. Electronic acceptance of membership terms",
    "Before completing enrolment, members must be given access to these terms and the details of their selected membership package, including its price, duration and any payment commitment. The agreement may be viewed and downloaded as a PDF. Members accept the agreement by actively selecting the acceptance checkbox; no handwritten or drawn signature is required. Fresh acceptance is required when applicable terms change; the accepted version remains recorded.",
    "Electronic acceptance and agreement record: By selecting the acceptance checkbox, the member confirms that they have reviewed and agree to the applicable membership conditions, booking and cancellation policies, studio regulations and safety requirements.",
    "Crafteris Studio records the member identity, agreement version, selected membership package, price, payment arrangement and commitment, membership start date and duration, and the date and time of acceptance. A copy of the accepted version is retained with the membership record. Following enrolment, members receive confirmation by email, including their membership details and a PDF copy of the accepted agreement. Members may also download their accepted agreement from the Member App, even if a newer version is subsequently published. The current Membership Terms & Studio Regulations will be available through a permanent link in the studio website footer. Applicable statutory withdrawal and cancellation rights remain unaffected."
  ]
];
export default function Page(){return <><Header/><main className={styles.page}><section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>{studioContact.name}</p><h1>Membership Terms &amp; Studio Regulations</h1><p>Version 2.0 · Effective date: 1 January 2027</p><p>{studioContact.address}</p><p><a href={"mailto:"+studioContact.email}>{studioContact.email}</a> · <a href={studioContact.phoneHref}>{studioContact.phone}</a></p></div></section><div className={styles.content}>{sections.map(([heading,...paragraphs])=><section className={styles.card} key={heading}><h2>{heading}</h2>{paragraphs.map((p,i)=><p key={i} style={{marginTop:i?12:0}}>{p}</p>)}{heading.startsWith("17.")&&<p><Link href="/firing-terms">Read Firing &amp; Artwork Collection Terms →</Link></p>}{heading.startsWith("20.")&&<p><Link href="/privacy">Privacy Policy →</Link></p>}</section>)}<p><Link href="/membership-guide">Membership Guide →</Link></p><Link href="/policies">← All policies & studio terms</Link></div></main><Footer/></>;}
