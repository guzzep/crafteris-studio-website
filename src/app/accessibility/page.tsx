import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import styles from "../support.module.css";

export default function Page() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>Accessibility</p><h1>A welcoming studio for more people.</h1><p>If you have accessibility requirements, contact Crafteris before your visit so the team can discuss the space, activity and support you may need.</p></div></section>
        <div className={styles.content}>
          <section className={styles.card}><h2>Planning your visit</h2><p>Accessibility can vary by activity, equipment and the studio setup in use that day. Please tell us about any mobility, sensory, communication or other access needs when you contact us.</p></section>
          <section className={styles.card}><h2>Before booking</h2><p>For the most accurate advice, include the activity you are interested in and your preferred date. The team can then explain what is practical before you book.</p></section>
          <section className={styles.card}><h2>Need clarification?</h2><p>Contact Crafteris if you need information about a booking, visit or account before the final policy wording is published.</p><div className={styles.actions}><Link href="/contact" className={styles.primary}>Contact Crafteris</Link><Link href="/faqs" className={styles.secondary}>Read FAQs</Link></div></section>
        </div>
      </main>
      <Footer />
    </>
  );
}
