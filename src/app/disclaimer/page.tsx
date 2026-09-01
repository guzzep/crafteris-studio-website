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
              Disclaimer
            </p>

            <h1>
              Handmade work is naturally unique.
            </h1>

            <p>
              This disclaimer explains the natural
              variations that can occur in handmade
              glass, ceramics, workshops and kiln-fired
              work at Crafteris.
            </p>
          </div>
        </section>

        <div className={styles.content}>
          <section className={styles.card}>
            <h2>Handmade Glass</h2>

            <p>
              Crafteris offers authentic handmade glass
              and creative experiences.
            </p>

            <p>
              Each handmade glass piece is unique and
              will never be completely identical to
              another piece or to a photograph shown
              on the website.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Natural Variations</h2>

            <p>
              Glass moves, changes and reacts during
              heating, forming, cooling and kiln firing.
            </p>

            <p>
              Handmade glass may contain small bubbles,
              colour variations, tooling marks, slight
              asymmetry, pontil marks or other natural
              characteristics of the handmade process.
              These are not normally considered defects.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Workshop Results</h2>

            <p>
              Workshop outcomes vary depending on the
              participant&apos;s design, skill level,
              selected materials and firing results.
            </p>

            <p>
              While guidance is provided, final results
              cannot be guaranteed to match examples
              exactly.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              Kiln Firing &amp; Cooling
            </h2>

            <p>
              Glass and ceramic processes involve heat
              and controlled cooling.
            </p>

            <p>
              Occasionally, pieces may change, crack,
              move or behave unexpectedly during firing
              or annealing.
            </p>

            <p>
              Crafteris will take reasonable care but
              cannot guarantee every firing outcome.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              Images &amp; Product Descriptions
            </h2>

            <p>
              We do our best to provide accurate images,
              descriptions and workshop information.
            </p>

            <p>
              Colours may vary depending on lighting,
              screen settings, photography and material
              batches.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Website Information</h2>

            <p>
              Information on this website is provided
              in good faith and may change without
              notice.
            </p>

            <p>
              Prices, dates, availability and workshop
              details should be confirmed through the
              booking system or directly with the studio.
            </p>
          </section>

          <section className={styles.card}>
            <h2>External Links</h2>

            <p>
              This website may contain links to
              third-party websites or services.
            </p>

            <p>
              Crafteris is not responsible for the
              content, privacy practices or operation
              of external websites.
            </p>
          </section>

          <section className={styles.card}>
            <h2>Need clarification?</h2>

            <p>
              If you have questions about a product,
              workshop result, firing process or studio
              service, please contact us.
            </p>

            <div className={styles.actions}>
              <Link
                href="/contact"
                className={styles.primary}
              >
                Contact Crafteris
              </Link>

              <Link
                href="/terms"
                className={styles.secondary}
              >
                Terms &amp; Conditions
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}