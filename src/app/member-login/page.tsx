import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import styles from "../support.module.css";
export default function MemberLoginPage(){return <><Header/><main className={styles.page}><section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>Member account</p><h1>Member login is coming next.</h1><p>The customer account area will be connected when Crafteris authentication and booking data are linked to Supabase.</p></div></section><div className={styles.content}><section className={styles.card}><h2>For now</h2><p>If you need help with an existing membership or studio booking, contact the Crafteris team directly.</p><div className={styles.actions}><Link href="/contact" className={styles.primary}>Contact Crafteris</Link><Link href="/membership" className={styles.secondary}>View membership</Link></div></section></div></main><Footer/></>}
