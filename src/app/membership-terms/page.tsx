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

          <section className={styles.card}>
            <h2>
              2. Membership types and what they provide
            </h2>

            <h3>Flexible prepaid memberships</h3>

            <ul>
              <li>
                10-hour membership pack — normally valid
                for 3 months from its agreed start date.
              </li>
              <li>
                20-hour membership pack — normally valid
                for 3 months from its agreed start date.
              </li>
            </ul>

            <h3>Fixed-term memberships</h3>

            <ul>
              <li>
                Maker Light — a 6-month membership.
              </li>
              <li>
                Maker Plus — a 6-month membership.
              </li>
            </ul>

            <p>
              Membership hours cover member studio
              access only unless a particular plan
              expressly states otherwise.
            </p>
          </section>

          <section className={styles.card}>
            <h2>3. Start date, validity and expiry</h2>

            <p>
              Membership validity begins on the purchase
              date unless Crafteris Studio agrees a
              different start date.
            </p>

            <p>
              Flexible 10-hour and 20-hour memberships
              are normally valid for 3 months. Maker
              Light and Maker Plus are normally valid
              for 6 months.
            </p>

            <p>
              Unused hours normally expire when the
              applicable membership period ends.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              4. Membership hours, bookings and studio
              time
            </h2>

            <p>
              Membership hours are personal to the
              registered member, have no cash value and
              may not normally be sold, shared,
              transferred or exchanged for cash.
            </p>

            <p>
              Studio time is subject to opening hours,
              booking availability, Studio capacity,
              staffing arrangements and any equipment-
              or area-specific rules.
            </p>

            <h3>
              Cancelling or rescheduling studio time
            </h3>

            <p>
              A member may cancel or reschedule a
              studio-time booking up to 24 hours before
              the booked start time.
            </p>

            <p>
              Late cancellations and no-shows will
              normally result in the booked hours being
              deducted.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              5. Payments, refunds, withdrawal and
              renewal
            </h2>

            <p>
              Membership fees are payable according to
              the payment arrangement shown at purchase.
            </p>

            <p>
              Where applicable law gives a consumer a
              statutory withdrawal period for an online
              membership purchase, those rights remain
              unaffected by these Terms.
            </p>

            <p>
              After any applicable statutory withdrawal
              period has expired, memberships are
              normally non-refundable.
            </p>

            <p>
              Memberships do not automatically renew
              unless an auto-renewal option is expressly
              offered and accepted by the member.
            </p>
          </section>

          <section className={styles.card}>
            <h2>
              6. Member pricing and additional charges
            </h2>

            <p>
              All active membership types qualify for
              the member pricing or benefits shown for
              the relevant membership.
            </p>

            <p>
              Membership hours do not normally cover
              workshops, courses, private tuition or
              special events.
            </p>
          </section>

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
              Members may use Crafteris Studio to create
              work for personal or commercial purposes.
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
              <a href="mailto:info@crafterisstudio.com">
                info@crafterisstudio.com
              </a>
            </p>

            <p>
              Address: 1, Triq L-Ewwel Ta&apos; Mejju,
              Birkirkara BKR 1901, Malta
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
              Effective date: 6 September 2026
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}