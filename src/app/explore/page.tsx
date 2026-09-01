import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import styles from "./explore.module.css";

type ContentItem = {
  title?: string;
  text?: string;
  image_url?: string;
  button_label?: string;
  button_url?: string;
  meta?: string;
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

type UpcomingItem = {
  title: string;
  date: string;
  details: string;
  image: string;
  href: string;
};

const fallbackExploreOptions: ContentItem[] = [
  {
    title: "Paint Your Own Pottery",
    text:
      "Choose a piece, paint it your way, and leave the glazing and firing to us.",
    meta:
      "Easy first visits • Families • Friends",
    image_url:
      "/explore/pyop.png",
    button_url:
      "/paint-your-own-pottery",
    button_label:
      "See how PYOP works",
  },
  {
    title: "Workshops",
    text:
      "Join a guided creative session and make something unique in just one visit.",
    meta:
      "Beginners • Couples • Creative days out",
    image_url:
      "/explore/workshops.png",
    button_url:
      "/workshops",
    button_label:
      "Browse workshops",
  },
  {
    title:
      "Programmes / Courses",
    text:
      "Learn a craft across several sessions and build your skills step by step.",
    meta:
      "Learning • Progression • Longer projects",
    image_url:
      "/explore/programmes.png",
    button_url:
      "/programmes",
    button_label:
      "View programmes",
  },
  {
    title: "Membership",
    text:
      "Make Crafteris part of your routine with regular access for independent creative work.",
    meta:
      "Independent makers • Regular studio access",
    image_url:
      "/explore/membership.png",
    button_url:
      "/membership",
    button_label:
      "Compare memberships",
  },
  {
    title:
      "Private Experiences",
    text:
      "Plan a creative experience for your team, celebration, school or private group.",
    meta:
      "Teams • Celebrations • Schools • Groups",
    image_url:
      "/explore/private-groups.png",
    button_url:
      "/team-building",
    button_label:
      "Plan a group visit",
  },
];

const fallbackUpcoming: UpcomingItem[] = [
  {
    title:
      "Fused Glass Workshop",
    date: "Sat 29 Aug",
    details:
      "2 hours • From €28",
    image:
      "/what-is-on-next/glassblowing-card.png",
    href:
      "/workshops/fused-glass",
  },
  {
    title:
      "Pottery Taster Session",
    date: "Tue 1 Sep",
    details:
      "2.5 hours • From €35",
    image:
      "/what-is-on-next/pottery-card.png",
    href:
      "/workshops/pottery-taster",
  },
  {
    title:
      "Paint Your Own Pottery",
    date: "Thu 3 Sep",
    details:
      "90 minutes • From €18",
    image:
      "/what-is-on-next/pyop-card.png",
    href:
      "/paint-your-own-pottery",
  },
];

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
  section:
    | PageSection
    | undefined
) {
  if (!section) {
    return true;
  }

  return section.is_visible;
}

function getItems(
  section:
    | PageSection
    | undefined,
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

export default async function ExplorePage() {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("page_sections")
    .select("*")
    .eq(
      "page_key",
      "explore"
    )
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Could not load Explore content:",
      error.message
    );
  }

  const sections =
    (data as PageSection[]) ??
    [];

  const hero =
    getSection(
      sections,
      "hero"
    );

  const options =
    getSection(
      sections,
      "options"
    );

  const whatsOn =
    getSection(
      sections,
      "whats_on"
    );

  const finalCta =
    getSection(
      sections,
      "final_cta"
    );

  const exploreOptions =
    getItems(
      options,
      fallbackExploreOptions
    );

  const upcoming =
    fallbackUpcoming;

  const defaultSectionOrder = [
    "hero",
    "options",
    "whats_on",
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
              <p
                className={
                  styles.eyebrow
                }
              >
                {hero?.eyebrow ||
                  "Explore Crafteris"}
              </p>

              <h1>
                {hero?.title ||
                  "Find your way to make."}
              </h1>

              <p
                className={
                  styles.heroDescription
                }
              >
                {hero?.body ||
                  hero?.subtitle ||
                  "Whether you want an easy creative afternoon, a guided workshop, structured learning or regular studio access, there's a way to make at Crafteris."}
              </p>
            </div>
          </section>
        )}

        {/* EXPERIENCE OPTIONS */}

        {isVisible(
          options
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "options"
                ),
            }}
            className={
              styles.optionsSection
            }
          >
            <div
              className={
                styles.sectionHeading
              }
            >
              {options?.eyebrow && (
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  {
                    options.eyebrow
                  }
                </p>
              )}

              <h2>
                {options?.title ||
                  "What would you like to do?"}
              </h2>

              <p>
                {options?.body ||
                  options?.subtitle ||
                  "Start with what sounds right for you. No previous experience is needed for many of our activities."}
              </p>
            </div>

            <div
              className={
                styles.optionsGrid
              }
            >
              {exploreOptions.map(
                (
                  option,
                  index
                ) => (
                  <article
                    className={
                      styles.optionCard
                    }
                    key={`${option.title}-${index}`}
                  >
                    <div
                      className={
                        styles.optionImageWrapper
                      }
                    >
                      <img
                        src={
                          option.image_url ||
                          fallbackExploreOptions[
                            index
                          ]
                            ?.image_url ||
                          "/membership-card.png"
                        }
                        alt={
                          option.title ||
                          "Creative experience"
                        }
                        className={
                          styles.optionImage
                        }
                      />
                    </div>

                    <div
                      className={
                        styles.optionContent
                      }
                    >
                      {option.meta && (
                        <p
                          className={
                            styles.bestFor
                          }
                        >
                          {
                            option.meta
                          }
                        </p>
                      )}

                      <h3>
                        {option.title ||
                          "Creative experience"}
                      </h3>

                      {option.text && (
                        <p
                          className={
                            styles.optionDescription
                          }
                        >
                          {
                            option.text
                          }
                        </p>
                      )}

                      <Link
                        href={
                          option.button_url ||
                          "#"
                        }
                        className={
                          styles.optionLink
                        }
                      >
                        {option.button_label ||
                          "Explore"}

                        <span>
                          →
                        </span>
                      </Link>
                    </div>
                  </article>
                )
              )}
            </div>
          </section>
        )}

        {isVisible(
          options
        ) &&
          isVisible(
            whatsOn
          ) && (
            <SectionDivider
              order={
                getSectionOrder(
                  "options"
                ) + 1
              }
            />
          )}

        {/* WHAT'S ON */}

        {isVisible(
          whatsOn
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "whats_on"
                ),
            }}
            className={
              styles.whatsOn
            }
          >
            <div
              className={
                styles.sectionHeading
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {whatsOn?.eyebrow ||
                  "Coming up"}
              </p>

              <h2>
                {whatsOn?.title ||
                  "What's on next"}
              </h2>

              <p>
                {whatsOn?.body ||
                  whatsOn?.subtitle ||
                  "Prefer to choose by date? Take a look at a few upcoming sessions."}
              </p>
            </div>

            <div
              className={
                styles.upcomingGrid
              }
            >
              {upcoming.map(
                (event) => (
                  <article
                    className={
                      styles.upcomingCard
                    }
                    key={
                      event.title
                    }
                  >
                    <img
                      src={
                        event.image
                      }
                      alt={
                        event.title
                      }
                      className={
                        styles.upcomingImage
                      }
                    />

                    <div
                      className={
                        styles.upcomingContent
                      }
                    >
                      <p
                        className={
                          styles.upcomingDate
                        }
                      >
                        {
                          event.date
                        }
                      </p>

                      <h3>
                        {
                          event.title
                        }
                      </h3>

                      <p>
                        {
                          event.details
                        }
                      </p>

                      <Link
                        href={
                          event.href
                        }
                      >
                        View details
                        →
                      </Link>
                    </div>
                  </article>
                )
              )}
            </div>

            <div
              className={
                styles.allEvents
              }
            >
              <Link
                href={
                  whatsOn?.button_url ||
                  "/whats-on"
                }
              >
                {whatsOn?.button_label ||
                  "View everything that's on"}{" "}
                →
              </Link>
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
            <div>
              <p
                className={
                  styles.eyebrow
                }
              >
                {finalCta?.eyebrow ||
                  "Still deciding?"}
              </p>

              <h2>
                {finalCta?.title ||
                  "Come and discover Crafteris."}
              </h2>

              <p>
                {finalCta?.body ||
                  finalCta?.subtitle ||
                  "Explore pottery, glass and creative experiences designed for complete beginners and experienced makers alike."}
              </p>

              <div
                className={
                  styles.finalActions
                }
              >
                {(finalCta?.button_label ||
                  !finalCta) && (
                  <Link
                    href={
                      finalCta?.button_url ||
                      "/workshops"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {finalCta?.button_label ||
                      "Browse workshops"}
                  </Link>
                )}

                {(finalCta?.secondary_button_label ||
                  !finalCta) && (
                  <Link
                    href={
                      finalCta?.secondary_button_url ||
                      "/visit"
                    }
                    className={
                      styles.secondaryButton
                    }
                  >
                    {finalCta?.secondary_button_label ||
                      "Visit the studio"}{" "}
                    →
                  </Link>
                )}
              </div>
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
        styles.sectionDivider
      }
    >
      <span />

      <span
        className={
          styles.dividerDiamond
        }
      >
        ◇
      </span>

      <span />
    </div>
  );
} 