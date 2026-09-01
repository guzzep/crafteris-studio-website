import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import styles from "../support.module.css";
export default function ManageBookingPage(){return <><Header/><main className={styles.page}><section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>Bookings</p><h1>Manage your booking.</h1><p>The live booking-management connection will be added with the Crafteris customer booking system.</p></div></section><div className={styles.content}><section className={styles.card}><h2>Need to change something now?</h2><p>Contact the studio with the booking name, session and date so the team can help.</p><div className={styles.actions}><Link href="/contact" className={styles.primary}>Contact the studio</Link><Link href="/whats-on" className={styles.secondary}>See what&apos;s on</Link></div></section></div></main><Footer/></>}
