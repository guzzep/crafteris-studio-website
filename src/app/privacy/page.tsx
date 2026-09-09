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
              Privacy Policy
            </p>

            <h1>
              Crafteris Studio Privacy Policy
            </h1>

            <p>
              This Privacy Policy explains what personal
              information Crafteris Studio collects, why
              it is used, who it may be shared with and
              the rights you have in relation to your
              information.
            </p>
          </div>
        </section>

        <div className={styles.content}>
          <section className={styles.card}>
            <h2>1. Who we are</h2>

            <p>
              Crafteris Studio — Home to GlassXpressions
              is operated by Joseph Schembri.
            </p>

            <p>
              For the purposes of applicable
              data-protection law, including the General
              Data Protection Regulation (GDPR), Joseph
              Schembri is the data controller for the
              personal information described in this
              Privacy Policy.
            </p>
          </section>

          <section className={styles.card}>
            <h2>2. Information we collect</h2>

            <h3>When you make a booking</h3>

            <p>We may collect:</p>

            <ul>
              <li>Your name</li>
              <li>Email address</li>
              <li>Booking details</li>
              <li>
                Workshop, course or activity selected
              </li>
              <li>Date and time of the booking</li>
              <li>
                Number and names of participants where
                required
              </li>
              <li>
                Payment and transaction information
              </li>
              <li>Booking history</li>
              <li>
                Cancellation or rescheduling information
              </li>
              <li>
                Information you provide in connection
                with the booking
              </li>
              <li>
                Communications between you and
                Crafteris Studio
              </li>
            </ul>

            <p>
              You can generally make a normal workshop
              or course booking without creating a
              permanent customer account.
            </p>

            <h3>Member accounts</h3>

            <p>
              If you become a Crafteris Studio member,
              we may also collect and maintain:
            </p>

            <ul>
              <li>Your member account details</li>
              <li>
                Login and authentication information
              </li>
              <li>Membership type</li>
              <li>
                Membership start and end dates
              </li>
              <li>Membership payments</li>
              <li>
                Booked and used studio time
              </li>
              <li>
                Membership benefits or credits
              </li>
              <li>
                Equipment or facility bookings
              </li>
              <li>Membership history</li>
              <li>
                Information needed to manage your
                membership
              </li>
            </ul>

            <p>
              Passwords are not intended to be stored in
              readable form.
            </p>

            <h3>Payments</h3>

            <p>
              Online payments may be processed using
              Stripe.
            </p>

            <p>
              When you make a payment, Stripe may
              collect information necessary to process
              the transaction, including payment-card
              details, transaction information, device
              information and information used for fraud
              prevention.
            </p>

            <p>
              Crafteris Studio does not need to receive
              or store your complete payment-card number
              in order to process a normal Stripe
              payment.
            </p>

            <p>
              We may receive information from Stripe
              such as whether the payment succeeded or
              failed, the amount paid, transaction and
              payment references, refund information
              and information required to manage or
              investigate the transaction.
            </p>
          </section>

          <section className={styles.card}>
            <h2>3. Children and young people</h2>

            <p>
              Crafteris Studio offers activities that
              may be suitable for children and young
              people.
            </p>

            <p>
              Where a booking is made for a child, we
              may collect limited information about the
              child where it is reasonably necessary to
              administer the activity. This may include
              the child&apos;s name, age or other
              information relevant to the booking.
            </p>

            <p>
              Bookings for children should be made by,
              or with the involvement of, a parent,
              guardian or other responsible adult where
              appropriate.
            </p>

            <p>
              We ask customers not to provide
              unnecessary personal or sensitive
              information about children.
            </p>
          </section>

          <section className={styles.card}>
            <h2>4. Why we use your information</h2>

            <p>
              We may use your personal information to:
            </p>

            <ul>
              <li>Process and manage bookings</li>
              <li>
                Provide workshops, courses and studio
                activities
              </li>
              <li>
                Manage member accounts and memberships
              </li>
              <li>
                Manage studio-time and equipment
                bookings
              </li>
              <li>Take and administer payments</li>
              <li>Process refunds</li>
              <li>
                Contact you about your booking or
                membership
              </li>
              <li>
                Notify you about changes,
                cancellations or other important
                information
              </li>
              <li>Answer enquiries</li>
              <li>Provide customer support</li>
              <li>
                Maintain appropriate business and
                transaction records
              </li>
              <li>
                Protect the security of our website,
                systems and customers
              </li>
              <li>
                Prevent or investigate fraud or misuse
              </li>
              <li>
                Comply with legal, tax and accounting
                obligations
              </li>
              <li>
                Improve the operation of Crafteris
                Studio
              </li>
              <li>
                Send marketing communications where
                you have agreed to receive them or
                where otherwise permitted by law
              </li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>
              5. Our legal bases for using your
              information
            </h2>

            <h3>Contract</h3>

            <p>
              We use information where it is necessary
              to take steps at your request before
              entering into a contract or to perform
              our contract with you.
            </p>

            <h3>Legal obligation</h3>

            <p>
              We may keep or use certain information
              where required to comply with legal,
              taxation, accounting or regulatory
              obligations.
            </p>

            <h3>Legitimate interests</h3>

            <p>
              We may process information where this is
              reasonably necessary for legitimate
              business interests, provided those
              interests do not override your rights and
              freedoms.
            </p>

            <h3>Consent</h3>

            <p>
              We rely on consent where required,
              particularly for certain marketing
              communications and optional analytics or
              advertising technologies.
            </p>

            <p>
              Where we rely on consent, you may withdraw
              it at any time.
            </p>
          </section>

          <section className={styles.card}>
            <h2>6. Marketing</h2>

            <p>
              Receiving marketing is optional.
            </p>

            <p>
              Where required, we will provide a separate
              choice allowing you to agree to receive
              news, offers, upcoming workshop
              information or other marketing from
              Crafteris Studio.
            </p>

            <p>
              Agreeing to marketing is not a condition
              of making a booking or becoming a member.
            </p>

            <p>
              You may unsubscribe from marketing
              communications at any time.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              7. Cookies, analytics and advertising
            </h2>

            <p>
              Our website may use cookies and similar
              technologies.
            </p>

            <p>
              Some are necessary for security,
              bookings, checkout, account login,
              remembering essential preferences and
              operating the website.
            </p>

            <p>
              Where consent is legally required,
              optional technologies will only be
              activated after you have made the
              relevant choice.
            </p>

            <div className={styles.actions}>
              <Link
                href="/cookies"
                className={styles.secondary}
              >
                Read Cookie Policy
              </Link>
            </div>
          </section>

          <section className={styles.card}>
            <h2>8. Who we share information with</h2>

            <p>
              We do not sell your personal information.
            </p>

            <p>
              We may share information with trusted
              service providers where necessary to
              operate Crafteris Studio.
            </p>

            <p>These may include providers of:</p>

            <ul>
              <li>
                Website and application hosting
              </li>
              <li>
                Database and IT infrastructure
              </li>
              <li>
                Payment processing, including Stripe
              </li>
              <li>
                Email and customer communications
              </li>
              <li>
                Security and fraud prevention
              </li>
              <li>Analytics, where enabled</li>
              <li>
                Professional accounting or legal
                services
              </li>
              <li>
                Other technical services required to
                operate the website and studio
              </li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>9. International transfers</h2>

            <p>
              Some service providers may process
              personal information outside Malta or the
              European Economic Area.
            </p>

            <p>
              Where data-protection law requires
              additional safeguards for such transfers,
              we will rely on an appropriate lawful
              transfer mechanism.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              10. How long we keep your information
            </h2>

            <p>
              We keep personal information only for as
              long as reasonably necessary for the
              purposes for which it was collected and
              for any applicable legal requirements.
            </p>

            <p>
              When personal information is no longer
              required, it will be deleted, anonymised
              or otherwise disposed of appropriately.
            </p>
          </section>

          <section className={styles.card}>
            <h2>11. Security</h2>

            <p>
              We take reasonable technical and
              organisational measures designed to
              protect personal information against
              unauthorised access, accidental loss,
              misuse, alteration, disclosure and
              destruction.
            </p>

            <p>
              No internet-based service can guarantee
              absolute security.
            </p>
          </section>

          <section className={styles.card}>
            <h2>12. Your data-protection rights</h2>

            <p>
              Depending on the circumstances, GDPR
              gives you rights including the right to:
            </p>

            <ul>
              <li>
                Obtain information about how your
                personal information is used
              </li>
              <li>
                Request access to your personal
                information
              </li>
              <li>
                Ask us to correct inaccurate or
                incomplete information
              </li>
              <li>
                Ask us to delete personal information
                in certain circumstances
              </li>
              <li>
                Ask us to restrict processing in
                certain circumstances
              </li>
              <li>
                Receive certain information in a
                portable format
              </li>
              <li>Object to certain processing</li>
              <li>Object to direct marketing</li>
              <li>
                Withdraw consent where processing is
                based on consent
              </li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>13. Exercising your rights</h2>

            <p>
              To exercise your data-protection rights
              or ask a question about this Privacy
              Policy, contact:
            </p>

            <p>
              <strong>Joseph Schembri</strong>
              <br />
              Crafteris Studio — Home to GlassXpressions
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
          </section>

          <section className={styles.card}>
            <h2>14. Complaints</h2>

            <p>
              If you believe that your personal
              information has not been handled
              correctly, please contact us first so
              that we can investigate your concern.
            </p>

            <p>
              You also have the right to lodge a
              complaint with Malta&apos;s supervisory
              authority, the Office of the Information
              and Data Protection Commissioner (IDPC),
              Malta.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              15. Changes to this Privacy Policy
            </h2>

            <p>
              We may update this Privacy Policy when
              our services, technology or legal
              obligations change.
            </p>

            <p>
              The latest version will be published on
              the Crafteris Studio website together
              with its effective date.
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