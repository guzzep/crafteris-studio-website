import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
              How Crafteris Studio uses cookies.
            </h1>

            <p>
              This Cookie Policy explains how Crafteris
              Studio uses cookies and similar
              technologies on its website.
            </p>
          </div>
        </section>

        <div className={styles.content}>
          <section className={styles.card}>
            <h2>1. What are cookies?</h2>

            <p>
              Cookies are small text files or similar
              technologies stored on or accessed from
              your device when you visit a website.
            </p>

            <p>
              They can be used to keep a website secure,
              remember a session or preference, support
              login and checkout, and understand how
              visitors use a website.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              2. Cookie categories used by Crafteris
              Studio
            </h2>

            <h3>Necessary cookies</h3>

            <p>
              Necessary cookies are required for core
              website functions and cannot be switched
              off through the optional cookie-consent
              controls.
            </p>

            <p>
              They may be used for security, session
              management, member login, bookings,
              checkout, fraud prevention and other
              functionality necessary to provide the
              service.
            </p>

            <h3>Analytics cookies</h3>

            <p>
              Analytics cookies are optional.
            </p>

            <p>
              Crafteris Studio plans to use Google
              Analytics to understand how visitors use
              the website and booking experience.
            </p>

            <p>
              Analytics cookies are activated only
              after you have consented to analytics
              cookies.
            </p>

            <p>
              At launch, Crafteris Studio does not plan
              to use Meta/Facebook Pixel or other
              advertising or remarketing trackers.
            </p>
          </section>

          <section className={styles.card}>
            <h2>3. Google Analytics</h2>

            <p>
              If you consent, Google Analytics may
              collect information such as pages visited,
              time spent on pages, general browser and
              device information, approximate location,
              how you arrived at the website and
              interactions with website features.
            </p>

            <p>
              Google Analytics is not loaded until
              analytics consent has been given.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              4. Third-party cookies and similar
              technologies
            </h2>

            <p>
              Some cookies or similar technologies may
              be set by third-party service providers
              that support Crafteris Studio, such as
              payment, authentication, security or
              analytics providers.
            </p>

            <p>
              Examples may include Google for analytics
              and Stripe for secure payment processing
              and fraud prevention.
            </p>
          </section>

          <section className={styles.card}>
            <h2>5. Your cookie choices</h2>

            <p>
              When optional analytics cookies are
              available, you can choose to accept them,
              reject them or manage your preferences.
            </p>

            <p>
              Rejecting optional cookies will not
              prevent you from browsing the website,
              making a booking, using checkout or
              accessing a member account.
            </p>

            <p>
              Necessary cookies remain active because
              they are required for core website
              functions.
            </p>
          </section>

          <section className={styles.card}>
            <h2>6. How long we remember your choice</h2>

            <p>
              Crafteris Studio will normally remember
              your cookie preferences for up to 6
              months.
            </p>

            <p>
              After that period, you may be asked to
              make a new choice.
            </p>
          </section>

          <section className={styles.card}>
            <h2>7. Changing or withdrawing consent</h2>

            <p>
              You can change or withdraw your cookie
              preferences through the Cookie Preferences
              controls made available on the Crafteris
              Studio website.
            </p>

            <p>
              Withdrawing consent does not affect
              processing that took place before consent
              was withdrawn.
            </p>
          </section>

          <section className={styles.card}>
            <h2>8. Recording your preference</h2>

            <p>
              Crafteris Studio may store a record of
              your cookie preference, including whether
              optional analytics cookies were accepted
              or rejected, the date and time of your
              choice and the version of the consent
              information that applied.
            </p>
          </section>

          <section className={styles.card}>
            <h2>9. Browser Do Not Track signals</h2>

            <p>
              Crafteris Studio does not currently rely
              on browser &ldquo;Do Not Track&rdquo;
              signals to manage cookie preferences.
            </p>
          </section>

          <section className={styles.card}>
            <h2>10. Live cookie table</h2>

            <p>
              The live cookie configuration should be
              verified after implementation and updated
              whenever the website&apos;s cookie
              configuration changes materially.
            </p>

            <h3>Necessary technologies</h3>

            <p>
              Provider: Crafteris Studio / hosting /
              authentication provider
            </p>

            <p>
              Purpose: Essential security, session,
              booking, checkout or login functionality.
            </p>

            <h3>Google Analytics</h3>

            <p>
              Cookies such as <strong>_ga</strong> and
              related GA4 cookies may be used if Google
              Analytics is enabled.
            </p>

            <p>
              Category: Analytics
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              11. Updates to this Cookie Policy
            </h2>

            <p>
              Crafteris Studio may update this Cookie
              Policy when the website, cookie
              configuration, analytics setup or
              third-party services change.
            </p>
          </section>

          <section className={styles.card}>
            <h2>12. Contact</h2>

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