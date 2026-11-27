import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {redirect} from "next/navigation";
import styles from "../support.module.css";
import {customerDestination} from "@/lib/customer-destination";
export const dynamic = "force-dynamic";
export const metadata={title:"Book your creative experience | Crafteris Studio",robots:{index:false,follow:true}};
const activities=[
{key:"pyop",title:"Paint Your Own Pottery",description:"Choose a two-hour painting session. €10 deposit per painter; €22 minimum spend.",href:"/paint-your-own-pottery",env:"CRAFTERIS_PYOP_BOOKING_URL"},
{key:"workshop",title:"Public workshops",description:"Choose a project and an available workshop date.",href:"/workshops",env:"CRAFTERIS_WORKSHOP_BOOKING_URL"},
{key:"course",title:"Courses",description:"Explore guided learning and enrol in a scheduled course.",href:"/programmes",env:"CRAFTERIS_COURSE_BOOKING_URL"},
{key:"membership",title:"Become a member",description:"Choose the membership that fits your creative life.",href:"/membership",env:"CRAFTERIS_MEMBERSHIP_BOOKING_URL"},
{key:"studio",title:"Book studio time",description:"Independent making and PAYG studio access.",href:"/membership",env:"CRAFTERIS_STUDIO_BOOKING_URL"}
] as const;
export default async function BookPage({searchParams}:{searchParams:Promise<{activity?:string;plan?:string;session?:string;slug?:string}>}){
const params=await searchParams;
const selected=activities.find(a=>a.key===params.activity);
if(selected){const url=customerDestination(selected.env);if(url){for(const key of ["plan","session","slug"] as const){const value=params[key];if(typeof value==="string" && value.length<=160)url.searchParams.set(key,value);}redirect(url.toString());}}
return <><Header/><main className={styles.page}><section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>Book at Crafteris</p><h1>{selected?selected.title:"Choose your creative experience."}</h1><p>{selected?selected.description:"Select what you would like to book."}</p></div></section><div className={styles.content}>{selected?<section className={styles.card}><h2>Online booking is coming soon.</h2><p>You can send the studio an enquiry about this activity while online booking is being prepared. No reservation or payment is made by sending an enquiry.</p><div className={styles.actions}><Link href={selected.href} className={styles.secondary}>Back to activity</Link><Link href={`/contact?reason=${encodeURIComponent(selected.key==="membership"?"Membership":selected.key==="course"?"Programme":selected.key==="workshop"?"Workshop":"Booking help")}&subject=${encodeURIComponent(selected.title+(typeof params.plan==="string"?" – "+params.plan.slice(0,120):""))}`} className={styles.primary}>Enquire about this activity</Link></div></section>:activities.map(a=><section key={a.key} className={styles.card}><h2>{a.title}</h2><p>{a.description}</p><div className={styles.actions}><Link className={styles.primary} href={a.key==="pyop"?"/book?activity=pyop":a.key==="studio"?"/book?activity=studio":a.href}>{a.key==="pyop"?"Book your painting session":a.key==="studio"?"Book studio time":a.key==="membership"?"Choose membership":a.key==="course"?"Browse courses":"Browse workshops"} →</Link></div></section>)}<p><Link href="/booking-terms">Workshop Booking Terms</Link> · <Link href="/membership-terms">Membership Terms</Link></p></div></main><Footer/></>;
}
