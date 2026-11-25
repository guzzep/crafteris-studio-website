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
              Membership Terms
            </p>

            <h1>
              Crafteris Studio Membership Terms
            </h1>

            <p>
              These Membership Terms apply to
              memberships purchased from and used at
              Crafteris Studio — Home to GlassXpressions.
            </p>
          </div>
        </section>

        <div className={styles.content}>
          <section className={styles.card}>
            <h2>1. About these Membership Terms</h2>

            <p>
              Crafteris Studio — Home to GlassXpressions
              is operated by Joseph Schembri.
            </p>

            <p>
              These Terms form part of the agreement
              between Crafteris Studio and the registered
              member.
            </p>

            <p>
              Nothing in these Terms removes or limits
              any consumer or other legal right that
              cannot lawfully be excluded.
            </p>
          </section>

          <section className={styles.card}><h2>2. Membership types and entitlements</h2><p>Maker Light (€44 monthly or €220 prepaid for six months) and Maker Light Daytime (€35 monthly or €175 prepaid) provide 52 hours per six months. Maker Plus (€75 monthly or €375 prepaid) provides 104 hours. Monthly Light and Daytime release 8 hours 40 minutes after each successful payment; Plus releases 17 hours 20 minutes. Prepaid plans release the full allocation upfront. Weekly equivalents are not weekly limits.</p><p>Flexible Maker 10 (€65) and 20 (€120) provide 10 and 20 hours respectively, each valid for three months. Benefits remain active throughout the term even if included hours are exhausted. Home Maker (€60/6 months or €100/12 months) includes 6 or 12 general studio hours respectively and excludes pottery wheel access. Unlimited Maker (€120 monthly or €1,200 annually) requires studio approval and is subject to availability and reasonable fair use.</p><p>All prices include applicable VAT. Memberships are cross-craft, subject to activity permissions, safety and competency.</p></section>
          <section className={styles.card}><h2>3. Validity, expiry and renewal</h2><p>Monthly Maker hours accumulate while active and expire on subscription termination. Prepaid Maker Light, Daytime and Plus included hours carry forward on renewal before expiry, on the final day or within 14 days after expiry. Early renewal starts after the existing term; renewal after expiry starts on the actual renewal date. After 14 days unused included hours expire. Booking access is not available during a lapse.</p><p>Flexible Maker hours expire after three months. Home Maker included hours are valid during the membership term. Dedicated purchased glazing hours do not expire, but require active eligible membership. Loyalty hours expire 12 calendar months after award and are retained during a lapse until their original expiry. Supplementary purchased studio hours follow their separate product validity.</p><p>Eligible hours with earliest expiry are consumed first. When expiry is equivalent, dedicated glazing hours take priority for glazing. Non-expiring hours are preserved when earlier-expiring eligible hours are available.</p></section>
          <section className={styles.card}><h2>4. Membership hours, bookings and studio time</h2><p>Hours are personal, have no cash value and may not normally be transferred. All bookings depend on sufficient eligible hours, active membership, resource availability and activity permissions. Opening hours: Monday–Friday 09:00–20:00; Saturday 09:00–17:00; Sunday closed. Daytime sessions must finish by 16:00 Monday–Friday.</p><p>Online booking opens 30 days ahead and closes one hour before the session. Booking starts and eligible extensions use 30-minute increments. There is no fixed daily or future booking limit. Cancellation or rescheduling at least 24 hours before the start preserves booked hours. Late cancellations, late rescheduling and no-shows forfeit original booked hours; any replacement booking needs eligible hours. Studio cancellations carry no member penalty. Bookings made less than 24 hours before the start require acknowledgement of these conditions.</p></section>
          <section className={styles.card}><h2>5. Payments, upgrades, cancellation and renewal</h2><p>Monthly Maker plans have an initial six-payment commitment, then roll monthly. Prepaid Maker plans require renewal. Failed payments suspend booking access without releasing new hours; balances are preserved until payment succeeds, subject to other restrictions.</p><p>Prepaid upgrades are prorated for the remaining term and preserve unused hours without restarting the term. Monthly upgrades take effect at the next payment. Downgrades take effect at renewal or the commitment boundary. Monthly cancellation during the initial commitment is effective at its end; afterwards, at the end of the paid billing period. Exceptional approved suspension stops future payments and bookings, preserves applicable balances and resumes the remaining commitment without charging for suspended months.</p><p>Statutory withdrawal and consumer rights remain unaffected. After any applicable statutory withdrawal period, memberships are normally non-refundable, subject to mandatory rights.</p></section>
          <section className={styles.card}><h2>6. Member pricing and loyalty rewards</h2><p>All active memberships receive 10% off eligible materials and retail products and two general studio hours per €100 of eligible VAT-inclusive spend actually paid after discounts. Spending carries forward between purchases; refunds reverse corresponding spend and rewards. Loyalty hours do not override activity restrictions. Member fees, hour packages, workshops, courses, pottery painting, firing and processing are excluded from the discount and rewards. Special member service rates receive no further discount.</p><p>Regular, Flexible and Unlimited Maker pottery processing costs €18/kg including studio clay, standard glaze, both firings and handling. Home Maker processing costs €16/kg with clay purchased separately. Both are calculated on dry pre-bisque weight without a minimum. Clay purchases do not grant glazing hours. Home Maker dedicated glazing hours cost €8 for one, €35 for five or €60 for ten; general hours can also be used for glazing.</p><p>PAYG is €10/hour without member benefits for customers who have no active membership. Studio access does not include workshops, courses or PYOP.</p><p><Link href="/membership">View membership plans and benefits</Link></p></section>
          <section className={styles.card}>
            <h2>
              7. Member accounts, guests and visitors
            </h2>

            <p>
              Member accounts are personal to the
              registered member.
            </p>

            <p>
              Members are responsible for keeping login
              details secure and must not allow another
              person to use their account.
            </p>

            <p>
              Guests may attend only where permitted by
              Crafteris Studio and may require a separate
              booking or charge.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              8. Children, young members and Kids Club
              activities
            </h2>

            <p>
              Memberships for participants under 16 must
              be purchased or authorised by a parent or
              guardian.
            </p>

            <p>
              Age limits, supervision, collection and
              safeguarding requirements may vary by
              activity.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              9. Studio access, reserved areas and
              supervision
            </h2>

            <p>
              Membership does not provide unrestricted
              or unsupervised access to Crafteris Studio.
            </p>

            <p>
              Access is subject to published opening
              hours, staffing arrangements and any area-
              or equipment-specific requirements.
            </p>
          </section>

          <section className={styles.card}>
            <h2>10. Tuition, equipment and safe use</h2>

            <p>
              Membership does not include continuous
              tuition, private instruction or one-to-one
              teaching unless specifically stated.
            </p>

            <p>
              Members may use Studio tools and equipment
              only where they are authorised to do so
              and must follow all safety and operating
              instructions.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              11. Materials and member-supplied materials
            </h2>

            <p>
              Materials are not included in membership
              unless expressly stated.
            </p>

            <p>
              Crafteris Studio may prohibit any material,
              substance or process it reasonably
              considers unsafe, hazardous or unsuitable
              for the Studio environment.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              12. Kiln firing and firing schedules
            </h2>

            <p>
              Crafteris Studio controls kiln loading,
              firing schedules and operation.
            </p>

            <p>
              Members acknowledge that glass, ceramics
              and other kiln-fired work can crack, warp,
              break, react unexpectedly or otherwise
              change during firing, cooling or finishing.
            </p>
          </section>

          <section className={styles.card}>
            <h2>13. Work, storage and collection</h2>

            <p>
              Members are responsible for clearly
              labelling work, materials, containers or
              personal items left at the Studio.
            </p>

            <p>
              Member work must normally be collected
              within 2 months of notification that it is
              ready.
            </p>
          </section>

          <section className={styles.card}>
            <h2>14. Cleaning, conduct and safety</h2>

            <p>
              Members are responsible for leaving their
              workspace and any shared tools or equipment
              reasonably clean and tidy after use.
            </p>

            <p>
              Members must behave respectfully toward
              Crafteris Studio staff, other members and
              visitors.
            </p>

            <p>
              Harassment, bullying, threatening
              behaviour, discrimination, abusive conduct
              or serious disruption will not be
              tolerated.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              15. Suspension or termination for breach
            </h2>

            <p>
              Crafteris Studio may suspend or terminate a
              membership where a member seriously or
              repeatedly breaches Studio rules, creates
              a health or safety risk, behaves abusively,
              damages property or seriously misuses
              equipment.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              16. Temporary closure, pauses and permanent
              closure
            </h2>

            <p>
              Crafteris Studio may occasionally close or
              restrict access for maintenance, holidays,
              illness, safety reasons, emergencies,
              equipment problems or other operational
              needs.
            </p>

            <p>
              Where a closure materially affects a
              member&apos;s ability to use their
              membership hours, Crafteris Studio may
              extend the validity period, offer credit or
              provide another appropriate remedy.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              17. Changes to membership rules and
              benefits
            </h2>

            <p>
              Crafteris Studio may update reasonable
              operational, booking and safety rules from
              time to time.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              18. Commercial work, ownership and similar
              designs
            </h2>

            <p>
              Members may create personal or commercial work, subject to plan eligibility, availability and fair use. Unlimited Maker is not intended for continuous commercial production monopolising shared resources.
            </p>

            <p>
              Members retain ownership of any original
              creative work and designs they produce at
              Crafteris Studio, subject to any
              intellectual-property rights belonging to
              other people.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              19. Photography and promotional use
            </h2>

            <p>
              Crafteris Studio may photograph artwork
              and works in progress created at the
              Studio and may use those images for
              promotional purposes where the image does
              not identify a person.
            </p>

            <p>
              Where a photograph or recording identifies
              a person, Crafteris Studio will ask for
              permission before using the image for
              promotional purposes.
            </p>
          </section>

          <section className={styles.card}>
            <h2>20. Complaints and contact</h2>

            <p>
              Email:{" "}
              <a href="mailto:info@crafteris.com">
                info@crafteris.com
              </a>
            </p>
            <p>Telephone: <a href="tel:+35677981366">+356 7798 1366</a></p>

            <p>
              Address: 314, Fleur de Lys Road,
              Birkirkara, BKR 9067, Malta
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
            <h2>21. Governing law</h2>

            <p>
              These Membership Terms are governed by the
              laws of Malta.
            </p>

            <p>
              Nothing in these Terms limits any mandatory
              consumer rights that apply under Maltese or
              European Union law.
            </p>

            <p className={styles.notice}>
              Effective date: 1 January 2027
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}