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
              How Crafteris handles your personal information.
            </h1>

            <p>
              This Privacy Policy outlines how Crafteris
              (&ldquo;Crafteris&rdquo;, &ldquo;we&rdquo;,
              &ldquo;our&rdquo;, or &ldquo;us&rdquo;)
              collects, uses, stores and protects your
              personal information when you use our
              website, booking systems or interact with
              our services.
            </p>
          </div>
        </section>

        <div className={styles.content}>
          <section className={styles.card}>
            <h2>Your Personal Information</h2>

            <p>
              When you contact us, make a booking,
              purchase a workshop, course, membership
              or product, you may be required to provide
              personal information such as your name,
              address, email address, telephone number,
              booking details and payment information.
            </p>

            <p>
              We take the protection of your information
              seriously and use reasonable security
              measures to safeguard your data.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Payments &amp; Security</h2>

            <p>
              Our website and booking systems use secure
              encrypted connections (SSL).
            </p>

            <p>
              Online payments may be processed through
              trusted third-party payment providers such
              as PayPal, Stripe, Revolut or other secure
              payment gateways. We do not store or retain
              your full card payment details on our
              servers.
            </p>

            <p>
              Payment providers operate within secure
              PCI-compliant environments.
            </p>
          </section>

          <section className={styles.card}>
            <h2>How We Use Your Information</h2>

            <ul>
              <li>Process bookings and payments</li>
              <li>
                Contact you regarding workshops,
                memberships or orders
              </li>
              <li>Provide customer support</li>
              <li>
                Send booking confirmations and updates
              </li>
              <li>
                Improve our services and website
                experience
              </li>
              <li>
                Send newsletters, promotions or studio
                updates where consent has been given
              </li>
            </ul>

            <p>
              You may unsubscribe from marketing
              communications at any time by contacting
              Crafteris.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Data Sharing</h2>

            <p>
              Your information is kept confidential and
              will never be sold to third parties.
              Information may only be shared with trusted
              service providers where necessary to
              process payments, deliver products, manage
              bookings, operate website services or
              comply with legal obligations.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              Right To Access, Correct Or Delete Data
            </h2>

            <p>
              You have the right to request access to
              your personal data, correct inaccurate
              information, request deletion of your data,
              or object to certain types of processing.
            </p>

            <p>
              Requests may be made by contacting
              Crafteris through our contact page.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Cookies</h2>

            <p>
              Our website may use cookies and similar
              technologies to improve your browsing
              experience. Cookies help us understand
              website usage, improve performance,
              remember preferences, operate booking and
              shopping functions and analyse visitor
              traffic.
            </p>

            <p>
              Some cookies are essential for the
              operation of the website.
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
            <h2>Google Analytics</h2>

            <p>
              We may use Google Analytics or similar
              services to monitor and improve website
              performance. These services may collect
              anonymous usage information such as pages
              visited, time spent on the website,
              browser information and general geographic
              region.
            </p>

            <p>
              More information about Google&apos;s privacy
              practices is available through Google&apos;s
              Privacy Policy.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Disabling Cookies</h2>

            <p>
              You can adjust your browser settings to
              disable cookies if you prefer.
            </p>

            <p>
              Please note that disabling essential
              cookies may affect parts of the website,
              including bookings and purchases.
            </p>
          </section>

          <section className={styles.card}>
            <h2>IP Addresses</h2>

            <p>
              Our servers may automatically record your
              IP address for security purposes, website
              administration, traffic analysis and fraud
              prevention.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Data Security</h2>

            <p>
              We take reasonable precautions to protect
              your information once received by our
              systems. However, no internet transmission
              is completely secure and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              Crime Prevention &amp; Fraud Protection
            </h2>

            <p>
              To help prevent fraud and protect our
              customers, we may verify transactions and
              contact customers regarding suspicious
              activity.
            </p>

            <p>
              Where legally required, information may be
              shared with law enforcement authorities or
              regulatory bodies.
            </p>
          </section>

          <section className={styles.card}>
            <h2>External Links</h2>

            <p>
              Our website may contain links to external
              websites. We are not responsible for the
              privacy practices or content of third-party
              websites.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Policy Updates</h2>

            <p>
              We may update this Privacy Policy
              periodically. Changes will be posted on
              this page.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Contact Information</h2>

            <p>
              <strong>Crafteris</strong>
            </p>

            <p>
              For privacy-related questions, requests
              or concerns, please contact us through our
              contact page.
            </p>

            <div className={styles.actions}>
              <Link
                href="/contact"
                className={styles.primary}
              >
                Contact Crafteris
              </Link>

              <Link
                href="/cookies"
                className={styles.secondary}
              >
                Cookie Policy
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}