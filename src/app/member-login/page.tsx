import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import styles from "../support.module.css";
import {redirect} from "next/navigation";
import {customerDestination} from "@/lib/customer-destination";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: true } };
export default function MemberLoginPage(){const url=customerDestination("CRAFTERIS_MEMBER_LOGIN_URL");if(url)redirect(url.toString());return <><Header/><main className={styles.page}><section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>Member account</p><h1>Member login is coming next.</h1><p>Online member accounts are being prepared for the studio opening.</p></div></section><div className={styles.content}><section className={styles.card}><h2>For now</h2><p>If you need help with an existing membership or studio booking, contact the Crafteris team directly.</p><div className={styles.actions}><Link href="/contact?reason=Membership" className={styles.primary}>Contact Crafteris</Link><Link href="/membership" className={styles.secondary}>View membership</Link></div></section></div></main><Footer/></>}
