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
              Cookie Policy
            </p>

            <h1>
              How Crafteris uses cookies.
            </h1>

            <p>
              This Cookie Policy explains how Crafteris
              (&ldquo;Crafteris&rdquo;, &ldquo;we&rdquo;,
              &ldquo;our&rdquo;, or &ldquo;us&rdquo;)
              uses cookies and similar technologies on
              our website and booking systems.
            </p>
          </div>
        </section>

        <div className={styles.content}>
          <section className={styles.card}>
            <h2>Cookie preferences</h2>

            <p>
              When you first visit our website, you may
              see a cookie banner where you can accept
              optional cookies, reject non-essential
              cookies, or open Cookie Settings to choose
              which optional cookies we may use.
            </p>

            <p>
              Your choice may be stored in your browser
              so that we can remember your preferences
              on future visits.
            </p>
          </section>

          <section className={styles.card}>
            <h2>What are cookies?</h2>

            <p>
              Cookies are small text files stored on
              your device when you visit a website.
              They help the site work properly, remember
              preferences and, only where permitted,
              help us understand how the site is used.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              Essential cookies (always active)
            </h2>

            <p>
              These cookies are strictly necessary for
              the website and booking system to function.
              They cannot normally be switched off
              because parts of the site may not work
              correctly without them.
            </p>

            <p>
              Essential cookies and local storage may
              be used for:
            </p>

            <ul>
              <li>
                Keeping booking cart and session
                information while you browse
              </li>

              <li>
                Remembering admin or member login state
                where applicable
              </li>

              <li>
                Storing your cookie consent choice
              </li>

              <li>
                Security and fraud prevention related
                to payments and bookings
              </li>
            </ul>
          </section>

          <section className={styles.card}>
            <h2>
              Analytics cookies (optional)
            </h2>

            <p>
              Analytics cookies help us understand how
              visitors use our website, for example
              which pages are visited and how visitors
              move through the site.
            </p>

            <p>
              This information may be used in aggregate
              to improve content, navigation and the
              booking experience.
            </p>

            <p>
              Analytics tools such as Google Analytics
              should only be loaded after the required
              consent has been given. If you reject
              non-essential cookies or disable analytics
              through Cookie Settings, analytics
              cookies should not be placed.
            </p>

            <p>
              More information about Google&apos;s
              privacy practices is available at{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
              >
                Google Privacy Policy
              </a>
              .
            </p>
          </section>

          <section className={styles.card}>
            <h2>How to manage cookies</h2>

            <p>
              You can change your cookie preferences
              through Cookie Settings where this option
              is available on the website.
            </p>

            <p>
              You can also clear or block cookies using
              your browser settings. If you clear your
              preferences, you may see the cookie banner
              again on your next visit.
            </p>

            <p>
              Blocking all cookies may affect how some
              parts of the website or booking system
              work.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              Marketing emails are separate from cookies
            </h2>

            <p>
              Choosing whether to receive marketing
              emails about workshops, courses and offers
              is handled separately when you make a
              booking or subscribe to communications.
              It is not controlled through the cookie
              banner.
            </p>

            <div className={styles.actions}>
              <Link
                href="/privacy"
                className={styles.secondary}
              >
                Read Privacy Policy
              </Link>
            </div>
          </section>

          <section className={styles.card}>
            <h2>Contact</h2>

            <p>
              <strong>Crafteris</strong>
            </p>

            <p>
              Triq L-Ewwel Ta&apos; Mejju
              <br />
              Birkirkara, Malta
            </p>

            <p>
              For questions about cookies or privacy,
              please contact the studio.
            </p>

            <div className={styles.actions}>
              <Link
                href="/contact"
                className={styles.primary}
              >
                Contact Crafteris
              </Link>
            </div>

            <p>
              <em>Last updated: June 2026</em>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}