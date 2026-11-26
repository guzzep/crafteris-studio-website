import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import styles from "../support.module.css";

export default function Page() {
  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>
              Terms &amp; Conditions
            </p>

            <h1>
              The terms that apply when making with
              Crafteris.
            </h1>

            <p>
              These Terms &amp; Conditions apply to
              workshops, courses, memberships,
              experiences and other services offered
              by Crafteris.
            </p>
          </div>
        </section>

        <div className={styles.content}>
          <section className={styles.card}>
            <h2>Bookings &amp; Payments</h2>

            <p>
              Workshop, course, membership and
              experience bookings are subject to
              availability.
            </p>

            <p>
              A booking is confirmed once the required details and payment, where applicable, have been accepted and confirmation has been issued.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Workshop Attendance</h2>

            <p>
              Please arrive on time for your session.
              Late arrival may reduce your available
              making time and may not be refundable or
              transferable.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              Cancellations &amp; Rescheduling
            </h2>

            <p>
              If you need to cancel or reschedule,
              please contact the studio as early as
              possible.
            </p>

            <p>
              The specific cancellation conditions for your service apply. See our <Link href="/booking-terms">Workshop Booking Terms</Link>, <Link href="/membership-terms">Membership Terms</Link> and <Link href="/cancellation-refunds">Cancellation &amp; Refunds policy</Link>. Mandatory consumer rights take precedence.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              Finished Pieces &amp; Collection
            </h2>

            <p>
              Glass and ceramic projects may require
              kiln firing, annealing or controlled
              cooling and therefore cannot always be
              taken home on the same day.
            </p>

            <p>
              Collection dates depend on firing and
              production schedules. Customers are
              responsible for collecting finished work
              within a reasonable period.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Safety In The Studio</h2>

            <p>
              Participants must follow all safety
              instructions given by Crafteris staff.
            </p>

            <p>
              Crafteris reserves the right to stop a
              participant from taking part where
              behaviour is unsafe, disruptive or puts
              another person at risk.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Hot Glass Experiences</h2>

            <p>
              Hot glass activities take place in a hot
              studio environment.
            </p>

            <p>
              Closed footwear is mandatory. Open
              sandals or flip-flops are not permitted.
              Long sleeves are recommended, preferably
              cotton, and loose synthetic clothing
              should be avoided.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              Children &amp; Young Participants
            </h2>

            <p>
              Children must be supervised where
              required by the studio.
            </p>

            <p>
              Age suitability may vary depending on the
              workshop, programme or activity.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Membership</h2>

            <p>
              Membership access is subject to studio
              rules, opening hours, availability,
              supervision requirements and the safe use
              of tools and equipment.
            </p>

            <p>
              Materials, firing and selected specialist
              equipment may be charged separately where
              applicable.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              Pricing &amp; Availability
            </h2>

            <p>
              Prices, workshop details, membership
              options and availability may change
              for future bookings. Confirmed bookings and existing memberships are governed by their accepted terms and applicable law.
            </p>

            <p>
              The booking page or direct studio
              communication will confirm the current
              offer.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Liability</h2>

            <p>
              Crafteris takes reasonable care to
              provide a safe and professional studio
              environment.
            </p>

            <p>
              Practical creative activities have inherent risks. Participants must follow staff instructions. Crafteris remains responsible for exercising reasonable care and skill. Nothing in these terms excludes liability or remedies that cannot lawfully be excluded.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Consumer rights and complaints</h2>
            <p>Where a statutory withdrawal right applies, it is separate from our standard cancellation policy. Specific-date leisure services may be exempt. Contact us for assistance or consult the <a href="https://services.mccaa.org.mt/home/complaint">Malta Competition and Consumer Affairs Authority</a>. Mandatory consumer rights remain unaffected.</p>
          </section>
          <section className={styles.card}>
            <h2>Questions?</h2>

            <p>
              If you need clarification about a
              booking, workshop, course or membership,
              please contact Crafteris before attending.
            </p>

            <div className={styles.actions}>
              <Link
                href="/contact"
                className={styles.primary}
              >
                Contact Crafteris
              </Link>

              <Link
                href="/faqs"
                className={styles.secondary}
              >
                Read FAQs
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}