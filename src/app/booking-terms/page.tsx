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
              Booking Terms
            </p>

            <h1>
              Booking Terms &amp; Conditions
            </h1>

            <p>
              These Terms apply to workshops, courses
              and other bookable studio activities
              provided by Crafteris Studio.
            </p>
          </div>
        </section>

        <div className={styles.content}>
          <section className={styles.card}>
            <h2>1. About these Terms</h2>

            <p>
              Crafteris Studio — Home to GlassXpressions
              is operated by Joseph Schembri.
            </p>

            <p>
              When you book a workshop, course or other
              studio activity with us, the activity is
              provided by Crafteris Studio.
            </p>

            <p>
              Please read these Terms together with the
              activity description, price and payment
              information shown during booking, and our
              Cancellation &amp; Refund Policy.
            </p>
          </section>

          <section className={styles.card}>
            <h2>2. Making a booking</h2>

            <p>
              A booking is confirmed when you receive
              confirmation from Crafteris Studio and any
              payment or deposit required at the time
              of booking has been successfully completed
              or otherwise accepted by us.
            </p>

            <p>
              You are responsible for checking that the
              activity, date, time, participant details
              and contact information supplied when
              booking are correct.
            </p>

            <p>
              Places are subject to availability.
            </p>
          </section>

          <section className={styles.card}>
            <h2>3. Prices and payment</h2>

            <p>
              The price and amount due at booking will
              be shown before you confirm the booking.
            </p>

            <p>
              Depending on the activity, we may require
              full payment, a deposit, payment on the
              day or another payment arrangement clearly
              shown before you book.
            </p>

            <h3>Deposits</h3>

            <p>
              A deposit is treated as part of the
              booking payment.
            </p>

            <h3>Remaining balance</h3>

            <p>
              Where a deposit has been paid, the
              remaining balance is normally due on the
              day of the activity unless a different
              payment deadline is stated when booking.
            </p>

            <h3>Online payments</h3>

            <p>
              Online payments may be processed by Stripe
              or another payment provider.
            </p>
          </section>

          <section className={styles.card}>
            <h2>4. Customer cancellations</h2>

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

            <div className={styles.actions}>
              <Link
                href="/cancellation-refunds"
                className={styles.secondary}
              >
                Cancellation &amp; Refund Policy
              </Link>
            </div>
          </section>

          <section className={styles.card}>
            <h2>5. Rescheduling</h2>

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
                The new booking must normally be for the
                same activity.
              </li>
              <li>
                If the replacement booking has a higher
                price, you must pay the difference.
              </li>
              <li>
                Requests made less than 24 hours before
                the scheduled start time are normally
                not accepted.
              </li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>6. No-shows</h2>

            <p>
              If you do not attend your booking and have
              not cancelled or rescheduled within the
              permitted time, the booking will be
              treated as a no-show and any amount already
              paid will be non-refundable.
            </p>
          </section>

          <section className={styles.card}>
            <h2>7. Late arrival</h2>

            <p>
              If you arrive late, Crafteris Studio will
              try to accommodate you where reasonably
              practical.
            </p>

            <p>
              The activity will not normally be extended
              beyond its scheduled finishing time.
            </p>
          </section>

          <section className={styles.card}>
            <h2>8. Minimum attendance</h2>

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
            <h2>9. If Crafteris Studio cancels</h2>

            <p>
              If Crafteris Studio cancels an activity,
              you may choose either:
            </p>

            <ul>
              <li>
                A full refund of the amount paid for
                that booking
              </li>
              <li>
                Transfer to another available date
              </li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>10. Children and supervision</h2>

            <p>
              Bookings for participants under 16 must
              be made by a parent, guardian or other
              responsible adult.
            </p>

            <p>
              Some activities may require a parent,
              guardian or responsible adult to remain
              present or participate.
            </p>
          </section>

          <section className={styles.card}>
            <h2>11. Health, safety and conduct</h2>

            <p>
              Customers and participants must follow
              reasonable safety instructions given by
              Crafteris Studio staff and use tools,
              materials and equipment responsibly.
            </p>

            <p>
              Crafteris Studio may refuse or end
              participation where a person creates a
              serious health or safety risk, behaves in
              a threatening or abusive way, seriously
              disrupts an activity or deliberately or
              recklessly damages Studio property.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              12. Kiln firing, creative results and
              inherent risks
            </h2>

            <p>
              Glass, ceramics and other kiln-fired work
              can sometimes crack, warp, break or
              otherwise change unexpectedly during
              firing, cooling or finishing.
            </p>

            <p>
              Crafteris Studio will take reasonable care
              when handling and processing customer work.
            </p>

            <p>
              Handmade work naturally varies in colour,
              size, finish and appearance.
            </p>
          </section>

          <section className={styles.card}>
            <h2>13. Collection of finished work</h2>

            <p>
              Finished work will normally be kept for
              collection for up to 2 months after you
              have been notified that it is ready.
            </p>

            <p>
              If work remains uncollected after 2 months,
              Crafteris Studio may dispose of or recycle
              it after making reasonable efforts to
              contact you.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              14. Online bookings and withdrawal rights
            </h2>

            <p>
              Certain online consumer contracts normally
              have a statutory cooling-off period.
            </p>

            <p>
              However, under EU consumer law, the right
              of withdrawal does not apply to certain
              services related to leisure activities
              where the contract provides for a specific
              date or period of performance.
            </p>
          </section>

          <section className={styles.card}>
            <h2>15. Changes to an activity</h2>

            <p>
              We may make reasonable changes to an
              activity where necessary, for example to
              the instructor, materials, equipment,
              timetable or minor elements of the content.
            </p>
          </section>

          <section className={styles.card}>
            <h2>16. Liability</h2>

            <p>
              Nothing in these Terms excludes or limits
              liability that cannot legally be excluded
              or limited, including applicable statutory
              consumer rights.
            </p>
          </section>

          <section className={styles.card}>
            <h2>17. Personal information</h2>

            <p>
              We process personal information in
              accordance with the Crafteris Studio
              Privacy Policy.
            </p>

            <div className={styles.actions}>
              <Link
                href="/privacy"
                className={styles.secondary}
              >
                Privacy Policy
              </Link>
            </div>
          </section>

          <section className={styles.card}>
            <h2>18. Complaints and contact</h2>

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
            </div>
          </section>

          <section className={styles.card}>
            <h2>19. Changes to these Terms</h2>

            <p>
              We may update these Terms from time to
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