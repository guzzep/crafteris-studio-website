import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import styles from "../support.module.css";

export default function Page() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <section className={styles.hero}><div className={styles.heroInner}><p className={styles.eyebrow}>Policies</p><h1>Clear information before you book.</h1><p>This page brings together the key Crafteris policies that affect bookings, memberships, vouchers and studio visits.</p></div></section>
        <div className={styles.content}>
          <section className={styles.card}><h2>Bookings and cancellations</h2><p>The final booking and cancellation policy will be published here before launch and reflected in the booking flow.</p></section>
          <section className={styles.card}><h2>Membership terms</h2><p>Membership access, booking limits, cancellation rules and material charges will be shown clearly before joining.</p></section>
          <section className={styles.card}><h2>Gift vouchers</h2><p>Voucher validity, eligible uses, balances and refund rules will be confirmed before vouchers go on sale.</p></section>
          <section className={styles.card}><h2>Studio conduct</h2><p>Visitors and members are expected to follow staff instructions and use tools, materials and equipment safely.</p></section>
          <section className={styles.card}><h2>Need clarification?</h2><p>Contact Crafteris if you need information about a booking, visit or account before the final policy wording is published.</p><div className={styles.actions}><Link href="/contact" className={styles.primary}>Contact Crafteris</Link><Link href="/faqs" className={styles.secondary}>Read FAQs</Link></div></section>
        </div>
      </main>
      <Footer />
    </>
  );
}
