import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {studioContact} from "@/lib/studio-contact";
import styles from "../support.module.css";
export const metadata={title:"Workshop Booking Terms & Conditions | Crafteris Studio"};
const sections=[
  [
    "1. Scope and booking information",
    "These terms apply to public creative workshops, Paint Your Own Pottery (PYOP) sessions and multi-session courses offered by Crafteris Studio. Private parties and corporate events may have separately agreed booking, payment and cancellation terms, which will be supplied before confirmation. Mandatory consumer rights take precedence in all cases.",
    "Each workshop listing specifies the activity, date, duration, location, price, deposit where applicable, inclusions and any age, experience or safety requirements. Customers do not need a studio membership or the Member App to attend a public workshop."
  ],
  [
    "2. Reservations and payment",
    "Bookings are subject to availability. Online public workshop bookings normally close 12 hours before the scheduled start. Staff may accommodate later bookings where practical. A reservation is confirmed once the required booking details and payment, if applicable, have been accepted and confirmation issued.",
    "All advertised consumer prices include applicable VAT. Any required deposit is credited towards the agreed total, not added to it. The workshop listing or booking confirmation specifies the amount payable and when any outstanding balance is due. Optional extras are charged only where selected or agreed.",
    "Customers should check the booking confirmation and contact us promptly if any details are incorrect. Confirmation and a reminder normally sent 24 hours before the workshop are delivered by email; customers should provide a valid email address."
  ],
  [
    "3. Cancellation and rescheduling by customers",
    "For ordinary public workshops, the standard notice period for cancellation or rescheduling is 48 hours before the scheduled start. Requests must be made through an available booking function or by contacting the studio.",
    "At least 48 hours before the start: eligible cancellations receive a credit voucher by default. Rescheduling is subject to availability.",
    "Less than 48 hours before the start: the booking deposit is normally forfeited.",
    "Non-attendance: the booking deposit is normally forfeited.",
    "Any additional conditions for fully prepaid bookings, multi-session courses or private events must be disclosed before booking. These terms do not create an additional cancellation charge or determine the treatment of amounts beyond the deposit where no specific policy has been agreed. Staff may approve exceptions. Statutory refund and withdrawal rights take precedence."
  ],
  [
    "4. Credit vouchers",
    "A cancellation credit voucher is valid for 12 months from its date of issue. It may be used for eligible future bookings, subject to availability and the applicable voucher terms. A voucher is the default remedy for an eligible customer cancellation, not a substitute for a refund where a refund is required by law."
  ],
  [
    "5. Changes or cancellations by Crafteris Studio",
    "Ordinary workshops do not require a minimum number of participants. Nevertheless, circumstances such as illness, equipment failure or safety concerns may require a change or cancellation. We will contact affected customers as soon as reasonably practicable.",
    "If Crafteris Studio cancels a workshop, customers may choose a refund of the amount paid for the cancelled service or a credit voucher. An alternative date may be offered but need not be accepted. Any material changes to a confirmed booking will be handled in accordance with applicable consumer rights."
  ],
  [
    "6. Group bookings and participant changes",
    "The person making a group booking should provide accurate participant details and communicate relevant booking conditions to the group. Each participant’s artwork, additional charges, processing and collection may be recorded separately.",
    "Participant transfers and partial cancellations may be requested, subject to the applicable notice period, availability and any activity-specific eligibility requirements. Payments and deposits attributable to affected participants will be handled under the applicable booking policy. Collecting one participant’s artwork does not close the records of other participants."
  ],
  [
    "7. Waiting lists",
    "Joining a waiting list is free and does not confirm a booking. Customers may specify the number of places they require. When sufficient places become available, the studio may offer them to the first eligible waiting-list entry by email.",
    "Offered places are normally held for two hours. Customers must complete the booking and any required payment within the stated offer period. Unclaimed places may be released and offered to another eligible customer. Waiting-list offers remain subject to the workshop’s booking arrangements and availability."
  ],
  [
    "8. Paint Your Own Pottery (PYOP)",
    "Scheduled PYOP sessions normally last two hours. Customers choose their pottery pieces at the studio. A €10 deposit per participant is payable when booking and is credited towards the final charge. The minimum spend is €22 per participant, not per group booking.",
    "Piece prices include the pottery blank, decorating colours, standard finishing, firing and studio use. Where a participant selects pieces below €22 in total, the difference is added as a minimum-spend adjustment. Where the selected pieces exceed €22, the actual total applies.",
    "For example, a participant choosing €18 of pottery pays €22 in total, of which €10 has already been paid as a deposit, leaving €12 due. Home Maker retail discounts and retail purchase loyalty rewards do not apply to PYOP service purchases.",
    "Finished PYOP pieces are normally ready for collection within one to two weeks. This is an estimate, not a guaranteed collection date."
  ],
  [
    "9. Multi-session courses",
    "Course descriptions specify the number and duration of sessions, included materials, supervised practice where applicable, and the payment arrangements. Customers should ensure they can attend the advertised dates before booking. Arrangements for missed sessions, replacement sessions and course-specific cancellations must be disclosed or agreed separately; no automatic replacement session is promised."
  ],
  [
    "10. Participation, safety and conduct",
    "Participants must follow staff guidance, use equipment safely, respect other people and their artwork, and comply with any activity-specific age or supervision requirements disclosed before booking. Children must meet the requirements of the particular workshop. Customers should advise staff of relevant access or safety needs before attendance.",
    "Participants must not operate kilns, furnaces or restricted equipment without authorization. Staff may intervene or restrict unsafe activity. Any further action and financial consequences will be proportionate and subject to applicable law.",
    "Closed-toe footwear is mandatory throughout the studio. Flip-flops, sandals and other open footwear are not permitted because glass is used on the premises."
  ],
  [
    "11. Artwork, firing and collection",
    "Glass and ceramics processing can produce variations in colour, shape and finish, and may involve cracking, warping or breakage. Crafteris Studio will exercise reasonable care and skill, but cannot guarantee a particular artistic or technical outcome. Nothing in these terms excludes liability that cannot lawfully be excluded.",
    "We will notify customers when their work is ready. Finished ceramics receive 30 days of free storage following readiness notification, with reminders normally after 14 and 30 days. Customers needing more time should contact the studio. Any further action concerning uncollected work is subject to separately published collection terms, reasonable notice and applicable law."
  ],
  [
    "12. Personal information and photographs",
    "Personal information is used to administer bookings, payments, participant records, reminders, artwork processing and collection in accordance with our Privacy Policy. Promotional use of identifiable participant photographs or artwork is managed separately where permission is required. Marketing consent is separate from essential booking communications."
  ],
  [
    "13. Consumer rights and complaints",
    "Nothing in these terms limits mandatory rights under Maltese or applicable European Union law. Any applicable statutory withdrawal rights, exceptions and required disclosures will be communicated before the contract is concluded. Customers may contact info@crafteris.com or +356 7798 1366 with questions or complaints."
  ],
  [
    "14. Electronic acceptance",
    "Customers can review and download these terms before completing a booking. An initially unchecked acceptance box is required on the first booking, when the applicable terms change, or when a workshop has different conditions. Returning customers who have already accepted the applicable version are shown a link to the terms and the relevant payment and cancellation conditions before confirmation. No handwritten signature is required.",
    "Crafteris Studio records the applicable terms version against every booking, together with the customer and the relevant acceptance record and timestamp. A copy of the applicable terms and booking confirmation is provided by email. Current terms are available through the studio website footer. Later updates do not replace terms accepted for an existing booking unless lawfully agreed."
  ]
];
export default function Page(){return <><Header/><main className={styles.page}><section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>{studioContact.name}</p><h1>Workshop Booking Terms &amp; Conditions</h1><p>Version 1.1 · Effective date: 1 January 2027</p><p>{studioContact.address}</p><p><a href={"mailto:"+studioContact.email}>{studioContact.email}</a> · <a href={studioContact.phoneHref}>{studioContact.phone}</a></p></div></section><div className={styles.content}>{sections.map(([heading,...paragraphs])=><section className={styles.card} key={heading}><h2>{heading}</h2>{paragraphs.map((p,i)=><p key={i} style={{marginTop:i?12:0}}>{p}</p>)}{heading.startsWith("11.")&&<p><Link href="/firing-terms">Read Firing &amp; Artwork Collection Terms →</Link></p>}{heading.startsWith("12.")&&<p><Link href="/privacy">Privacy Policy →</Link></p>}</section>)}<Link href="/policies">← All policies & studio terms</Link></div></main><Footer/></>;}
