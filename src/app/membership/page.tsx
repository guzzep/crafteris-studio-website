import Link from "next/link";

import {
  ArrowRight,
  Check,
  Clock3,
  Sparkles,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { createClient } from "@/lib/supabase/server";

import styles from "./membership.module.css";

type MembershipPlan = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number | null;
  billing_label: string | null;
  included_hours: number | null;
  validity_months: number | null;
  hours_per_week: number | null;
  features: string[] | null;
  image_url: string | null;
  sort_order: number;
};

type ContentItem = {
  title?: string;
  text?: string;
  image_url?: string;
  button_label?: string;
  button_url?: string;
};

type SectionContent = {
  items?: ContentItem[];
};

type PageSection = {
  id: string;

  page_key: string;
  section_key: string;

  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  body: string | null;

  image_url: string | null;

  button_label: string | null;
  button_url: string | null;

  secondary_button_label: string | null;
  secondary_button_url: string | null;

  content: SectionContent | null;

  is_visible: boolean;
  sort_order: number;
};

const fallbackHowItems: ContentItem[] = [
  {
    title: "Choose a plan",
    text:
      "Pick the membership or hours option that matches how often you want to make.",
  },
  {
    title: "Book your studio time",
    text:
      "Use the separate booking system to reserve your studio sessions.",
  },
  {
    title: "Keep creating",
    text:
      "Return regularly, develop your skills and continue your projects over time.",
  },
];

function formatPrice(
  price: number | null
) {
  if (price === null) {
    return "Ask us";
  }

  return `€${Number(price).toFixed(2)}`;
}

function formatNumber(
  value: number | null
) {
  if (value === null) {
    return null;
  }

  if (Number.isInteger(value)) {
    return value.toString();
  }

  return Number(value).toFixed(1);
}

function getSection(
  sections: PageSection[],
  key: string
) {
  return sections.find(
    (section) =>
      section.section_key === key
  );
}

function isVisible(
  section: PageSection | undefined
) {
  if (!section) {
    return true;
  }

  return section.is_visible;
}

function getItems(
  section: PageSection | undefined,
  fallback: ContentItem[]
) {
  const items =
    section?.content?.items;

  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return fallback;
  }

  return items;
}

export default async function MembershipPage() {
  const supabase =
    await createClient();

  const [
    membershipResult,
    contentResult,
  ] =
    await Promise.all([
      supabase
        .from("membership_plans")
        .select(
          `
            id,
            name,
            slug,
            category,
            description,
            price,
            billing_label,
            included_hours,
            validity_months,
            hours_per_week,
            features,
            image_url,
            sort_order
          `
        )
        .eq(
          "status",
          "published"
        )
        .order(
          "sort_order",
          {
            ascending: true,
          }
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        ),

      supabase
        .from("page_sections")
        .select("*")
        .eq(
          "page_key",
          "membership"
        )
        .order(
          "sort_order",
          {
            ascending: true,
          }
        ),
    ]);

  if (contentResult.error) {
    console.error(
      "Could not load Membership page content:",
      contentResult.error.message
    );
  }

  const memberships =
    (membershipResult.data as MembershipPlan[]) ??
    [];

  const membershipError =
    membershipResult.error;

  const sections =
    (contentResult.data as PageSection[]) ??
    [];

  const hero =
    getSection(
      sections,
      "hero"
    );

  const intro =
    getSection(
      sections,
      "intro"
    );

  const plans =
    getSection(
      sections,
      "plans"
    );

  const howItWorks =
    getSection(
      sections,
      "how_it_works"
    );

  const finalCta =
    getSection(
      sections,
      "final_cta"
    );

  const howItems =
    getItems(
      howItWorks,
      fallbackHowItems
    );

  const defaultSectionOrder = [
    "hero",
    "intro",
    "plans",
    "how_it_works",
    "final_cta",
  ];

  const orderedSectionKeys = [
    ...sections.map(
      (section) =>
        section.section_key
    ),
    ...defaultSectionOrder.filter(
      (key) =>
        !sections.some(
          (section) =>
            section.section_key === key
        )
    ),
  ];

  function getSectionOrder(
    key: string
  ) {
    const index =
      orderedSectionKeys.indexOf(
        key
      );

    return index >= 0
      ? (index + 1) * 10
      : 10000;
  }

  return (
    <>
      <Header />

      <main
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        className={
          styles.page
        }
      >
        {/* HERO */}

        {isVisible(hero) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "hero"
                ),
            }}
            className={
              styles.hero
            }
          >
            <div
              className={
                styles.heroInner
              }
            >
              <div
                className={
                  styles.heroContent
                }
              >
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  {hero?.eyebrow ||
                    "STUDIO MEMBERSHIP"}
                </p>

                <h1>
                  {hero?.title ||
                    "Make the studio part of your routine."}
                </h1>

                <p
                  className={
                    styles.heroText
                  }
                >
                  {hero?.body ||
                    hero?.subtitle ||
                    "Membership gives you more time to make, practise and develop your work in a creative studio environment."}
                </p>

                {(hero?.button_label ||
                  !hero) && (
                  <Link
                    href={
                      hero?.button_url ||
                      "#plans"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {hero?.button_label ||
                      "Explore memberships"}

                    <ArrowRight
                      size={17}
                    />
                  </Link>
                )}
              </div>

              <div
                className={
                  styles.heroImageWrapper
                }
              >
                <img
                  src={
                    hero?.image_url ||
                    "/membership-page/pottery-membership.png"
                  }
                  alt={
                    hero?.title ||
                    "Studio membership at Crafteris"
                  }
                  className={
                    styles.heroImage
                  }
                />
              </div>
            </div>
          </section>
        )}

        {/* INTRO */}

        {isVisible(intro) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "intro"
                ),
            }}
              className={
                styles.introSection
              }
            >
              <div
                className={
                  styles.introHeading
                }
              >
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  {intro?.eyebrow ||
                    "MORE TIME TO CREATE"}
                </p>

                <h2>
                  {intro?.title ||
                    "Flexible options for different ways of making."}
                </h2>
              </div>

              <div
                className={
                  styles.introContent
                }
              >
                <p>
                  {intro?.body ||
                    intro?.subtitle ||
                    "Whether you want occasional studio access, regular weekly making time or a prepaid hours pack, choose the option that best fits how you like to work."}
                </p>
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "intro"
                ) + 1
              }
            />
          </>
        )}

        {/* PLANS */}

        {isVisible(plans) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "plans"
                ),
            }}
            className={
              styles.plansSection
            }
            id="plans"
          >
            <div
              className={
                styles.sectionHeading
              }
            >
              <div>
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  {plans?.eyebrow ||
                    "MEMBERSHIP OPTIONS"}
                </p>

                <h2>
                  {plans?.title ||
                    "Choose your studio access."}
                </h2>
              </div>

              <p>
                {plans?.body ||
                  plans?.subtitle ||
                  "Compare the available plans and choose the one that suits your creative routine."}
              </p>
            </div>

            {membershipError ? (
              <div
                className={
                  styles.stateBox
                }
              >
                <h3>
                  We couldn&apos;t load
                  the membership plans.
                </h3>

                <p>
                  Please try again
                  shortly.
                </p>
              </div>
            ) : memberships.length ===
              0 ? (
              <div
                className={
                  styles.stateBox
                }
              >
                <Sparkles
                  size={30}
                />

                <h3>
                  Membership options are
                  coming soon.
                </h3>

                <p>
                  Contact the studio if
                  you would like to know
                  more about regular
                  studio access.
                </p>

                <Link
                  href="/contact"
                >
                  Contact us
                </Link>
              </div>
            ) : (
              <div
                className={
                  styles.planGrid
                }
              >
                {memberships.map(
                  (membership) => {
                    const includedHours =
                      formatNumber(
                        membership.included_hours
                      );

                    const hoursPerWeek =
                      formatNumber(
                        membership.hours_per_week
                      );

                    return (
                      <article
                        className={
                          styles.planCard
                        }
                        key={
                          membership.id
                        }
                      >
                        <div
                          className={
                            styles.imageWrapper
                          }
                        >
                          {membership.image_url ? (
                            <img
                              src={
                                membership.image_url
                              }
                              alt={
                                membership.name
                              }
                            />
                          ) : (
                            <div
                              className={
                                styles.noImage
                              }
                            >
                              Crafteris
                            </div>
                          )}

                          <span
                            className={
                              styles.categoryBadge
                            }
                          >
                            {
                              membership.category
                            }
                          </span>
                        </div>

                        <div
                          className={
                            styles.planContent
                          }
                        >
                          <div>
                            <h3>
                              {
                                membership.name
                              }
                            </h3>

                            <p
                              className={
                                styles.description
                              }
                            >
                              {membership.description ||
                                "A flexible way to spend more time creating at Crafteris Studio."}
                            </p>
                          </div>

                          <div
                            className={
                              styles.priceRow
                            }
                          >
                            <strong>
                              {formatPrice(
                                membership.price
                              )}
                            </strong>

                            {membership.billing_label && (
                              <span>
                                {
                                  membership.billing_label
                                }
                              </span>
                            )}
                          </div>

                          {(includedHours ||
                            hoursPerWeek ||
                            membership.validity_months !==
                              null) && (
                            <div
                              className={
                                styles.details
                              }
                            >
                              {includedHours && (
                                <span>
                                  <Clock3
                                    size={14}
                                  />

                                  {
                                    includedHours
                                  }{" "}
                                  included hours
                                </span>
                              )}

                              {hoursPerWeek && (
                                <span>
                                  <Clock3
                                    size={14}
                                  />

                                  {
                                    hoursPerWeek
                                  }{" "}
                                  hrs/week
                                </span>
                              )}

                              {membership.validity_months !==
                                null && (
                                <span>
                                  {
                                    membership.validity_months
                                  }{" "}
                                  month validity
                                </span>
                              )}
                            </div>
                          )}

                          {membership.features &&
                            membership.features
                              .length >
                              0 && (
                              <ul
                                className={
                                  styles.featureList
                                }
                              >
                                {membership.features.map(
                                  (
                                    feature,
                                    index
                                  ) => (
                                    <li
                                      key={
                                        index
                                      }
                                    >
                                      <Check
                                        size={
                                          15
                                        }
                                      />

                                      {
                                        feature
                                      }
                                    </li>
                                  )
                                )}
                              </ul>
                            )}

                          <Link
                            href={
                              plans?.button_url ||
                              "/contact"
                            }
                            className={
                              styles.planButton
                            }
                          >
                            {plans?.button_label ||
                              "Ask about this plan"}

                            <ArrowRight
                              size={15}
                            />
                          </Link>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
          </section>
        )}

        {/* HOW IT WORKS */}

        {isVisible(
          howItWorks
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "how_it_works"
                ),
            }}
            className={
              styles.howSection
            }
          >
            <div
              className={
                styles.howHeading
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {howItWorks?.eyebrow ||
                  "HOW IT WORKS"}
              </p>

              <h2>
                {howItWorks?.title ||
                  "Simple studio access."}
              </h2>

              {(howItWorks?.body ||
                howItWorks?.subtitle) && (
                <p>
                  {howItWorks.body ||
                    howItWorks.subtitle}
                </p>
              )}
            </div>

            <div
              className={
                styles.howGrid
              }
            >
              {howItems.map(
                (
                  item,
                  index
                ) => (
                  <div
                    className={
                      styles.howCard
                    }
                    key={`${item.title}-${index}`}
                  >
                    <span>
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <h3>
                      {item.title ||
                        `Step ${
                          index + 1
                        }`}
                    </h3>

                    {item.text && (
                      <p>
                        {item.text}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* FINAL CTA */}

        {isVisible(
          finalCta
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "final_cta"
                ),
            }}
            className={
              styles.finalCta
            }
          >
            <div
              className={
                styles.finalInner
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {finalCta?.eyebrow ||
                  "STILL NOT SURE?"}
              </p>

              <h2>
                {finalCta?.title ||
                  "We'll help you choose."}
              </h2>

              <p>
                {finalCta?.body ||
                  finalCta?.subtitle ||
                  "Tell us how you want to use the studio and we can help you find the right option."}
              </p>

              {(finalCta?.button_label ||
                !finalCta) && (
                  <Link
                    href={
                      finalCta?.button_url ||
                      "/contact"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {finalCta?.button_label ||
                      "Contact the studio"}

                    <ArrowRight
                      size={17}
                    />
                  </Link>
                )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

function SectionDivider({
  order,
}: {
  order: number;
}) {
  return (
    <div
      style={{ order }}
      className={
        styles.divider
      }
    >
      <span />
      <span>◇</span>
      <span />
    </div>
  );
}