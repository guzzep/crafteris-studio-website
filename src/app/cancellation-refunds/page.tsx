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
              Cancellation &amp; Refunds
            </p>

            <h1>
              Cancellation, Rescheduling &amp; Refund Policy
            </h1>

            <p>
              This Policy applies to workshops, courses
              and other dated studio activities booked
              with Crafteris Studio.
            </p>
          </div>
        </section>

        <div className={styles.content}>
          <section className={styles.card}>
            <h2>1. Customer cancellations</h2>

            <p>
              Cancellations made at least 3 days before
              the scheduled start time are eligible for
              a full refund of the amount paid for that
              booking.
            </p>

            <p>
              Cancellations made less than 3 days before
              the scheduled start time are normally
              non-refundable.
            </p>

            <p>
              Crafteris Studio may make an exception at
              its discretion where appropriate.
            </p>
          </section>

          <section className={styles.card}>
            <h2>2. Rescheduling</h2>

            <p>
              You may request to reschedule your booking
              up to 24 hours before the scheduled start
              time, subject to availability.
            </p>

            <ul>
              <li>
                One reschedule is permitted per booking.
              </li>
              <li>There is no rescheduling fee.</li>
              <li>
                The replacement booking must normally be
                for the same activity.
              </li>
              <li>
                If the replacement booking has a higher
                price, you must pay the difference.
              </li>
              <li>
                If the replacement booking has a lower
                price, the difference is not
                automatically refunded unless Crafteris
                Studio agrees otherwise.
              </li>
              <li>
                Requests made less than 24 hours before
                the scheduled start time are normally
                not accepted.
              </li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>3. No-shows</h2>

            <p>
              If you do not attend your booking and have
              not cancelled or rescheduled within the
              permitted time, the booking will be
              treated as a no-show and any amount
              already paid will be non-refundable.
            </p>
          </section>

          <section className={styles.card}>
            <h2>4. Deposits</h2>

            <p>
              Where a deposit is required, it is treated
              as part of the booking payment and follows
              the same cancellation rules as the
              booking.
            </p>

            <ul>
              <li>
                Cancel at least 3 days before the
                scheduled start time: the deposit is
                refundable.
              </li>
              <li>
                Cancel less than 3 days before the
                scheduled start time: the deposit is
                normally non-refundable.
              </li>
              <li>
                No-show: the deposit is non-refundable.
              </li>
              <li>
                If Crafteris Studio cancels the
                activity, you may choose a refund or
                transfer to another available date.
              </li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>5. Remaining balances</h2>

            <p>
              Where a deposit has been paid, the
              remaining balance is normally due on the
              day of the activity unless a different
              payment deadline was stated when booking.
            </p>
          </section>

          <section className={styles.card}>
            <h2>6. If Crafteris Studio cancels</h2>

            <p>
              If Crafteris Studio cancels an activity,
              you may choose either:
            </p>

            <ul>
              <li>
                A full refund of the amount paid for the
                affected booking
              </li>
              <li>
                Transfer to another available date
              </li>
            </ul>

            <p>
              We will try to give as much notice as
              reasonably possible.
            </p>
          </section>

          <section className={styles.card}>
            <h2>7. Minimum attendance</h2>

            <p>
              Some workshops, courses or activities may
              require a minimum number of participants.
            </p>

            <p>
              If the minimum number is not reached,
              Crafteris Studio may cancel or reschedule
              the activity.
            </p>
          </section>

          <section className={styles.card}>
            <h2>8. Late arrival</h2>

            <p>
              If you arrive late, Crafteris Studio will
              try to accommodate you where reasonably
              practical, but the activity will not
              normally be extended beyond its scheduled
              finishing time.
            </p>
          </section>

          <section className={styles.card}>
            <h2>9. Safety, conduct and damage</h2>

            <p>
              Where participation is refused or ended
              because a participant creates a serious
              health or safety risk, behaves in a
              threatening or abusive way, seriously
              disrupts the activity, or deliberately or
              recklessly misuses or damages Studio
              property, the booking will normally be
              non-refundable.
            </p>
          </section>

          <section className={styles.card}>
            <h2>10. Refund method and timing</h2>

            <p>
              Approved refunds will normally be returned
              to the original payment method where
              practical.
            </p>

            <p>
              Crafteris Studio will initiate an approved
              refund without undue delay.
            </p>

            <p>
              The time taken for the refunded amount to
              appear in your account may depend on
              Stripe, your bank, card issuer or another
              payment provider.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              11. Online bookings and statutory
              withdrawal rights
            </h2>

            <p>
              Certain online consumer contracts normally
              have a statutory cooling-off period.
            </p>

            <p>
              Under EU consumer law, the right of
              withdrawal does not apply to certain
              services related to leisure activities
              where the contract provides for a specific
              date or period of performance.
            </p>
          </section>

          <section className={styles.card}>
            <h2>12. Exceptional circumstances</h2>

            <p>
              Crafteris Studio may make an exception to
              the normal cancellation, rescheduling or
              refund rules where we consider it fair and
              appropriate to do so.
            </p>
          </section>

          <section className={styles.card}>
            <h2>13. Contact</h2>

            <p>
              Crafteris Studio — Home to GlassXpressions
              <br />
              Joseph Schembri
              <br />
              1, Triq L-Ewwel Ta&apos; Mejju
              <br />
              Birkirkara BKR 1901
              <br />
              Malta
            </p>

            <p>
              Email:{" "}
              <a href="mailto:info@crafterisstudio.com">
                info@crafterisstudio.com
              </a>
            </p>

            <div className={styles.actions}>
              <Link
                href="/contact"
                className={styles.primary}
              >
                Contact Crafteris
              </Link>

              <Link
                href="/booking-terms"
                className={styles.secondary}
              >
                Booking Terms
              </Link>
            </div>
          </section>

          <section className={styles.card}>
            <h2>14. Changes to this Policy</h2>

            <p>
              We may update this Policy from time to
              time.
            </p>

            <p className={styles.notice}>
              Effective date: 6 September 2026
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}