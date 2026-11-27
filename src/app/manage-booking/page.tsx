import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import styles from "../support.module.css";
import {redirect} from "next/navigation";
import {customerDestination} from "@/lib/customer-destination";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: true } };
export default function ManageBookingPage(){const url=customerDestination("CRAFTERIS_MANAGE_BOOKING_URL");if(url)redirect(url.toString());return <><Header/><main className={styles.page}><section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>Bookings</p><h1>Manage your booking.</h1><p>Online booking management is being prepared. The studio team can help with existing reservations in the meantime.</p></div></section><div className={styles.content}><section className={styles.card}><h2>Need to change something now?</h2><p>Contact the studio with the booking name, session and date so the team can help.</p><div className={styles.actions}><Link href="/contact?reason=Booking%20help" className={styles.primary}>Contact the studio</Link><Link href="/whats-on" className={styles.secondary}>See what&apos;s on</Link></div></section></div></main><Footer/></>}
