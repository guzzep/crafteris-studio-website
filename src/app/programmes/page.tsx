import Link from "next/link";

import {
  ArrowRight,
  Clock,
  Layers3,
  Sparkles,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { createClient } from "@/lib/supabase/server";

import styles from "./programmes.module.css";

type Programme = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  number_of_sessions: number | null;
  session_duration_minutes: number | null;
  level: string | null;
  base_price: number | null;
  is_featured: boolean;
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

const fallbackDifferenceItems: ContentItem[] = [
  {
    title: "Workshops",
    text:
      "Perfect for trying something new, enjoying a creative day or making one focused piece.",
    button_label: "Explore workshops",
    button_url: "/workshops",
  },
  {
    title: "Programmes",
    text:
      "Best when you want to build confidence, practise techniques and progress over several sessions.",
    button_label: "Explore programmes",
    button_url: "#programmes",
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

function formatDuration(
  minutes: number | null
) {
  if (!minutes) {
    return "Flexible";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours =
    Math.floor(minutes / 60);

  const remainingMinutes =
    minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    }`;
  }

  return `${hours}h ${remainingMinutes}m`;
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

export default async function ProgrammesPage() {
  const supabase =
    await createClient();

  const [
    programmeResult,
    contentResult,
  ] =
    await Promise.all([
      supabase
        .from("programmes")
        .select(
          `
            id,
            title,
            slug,
            category,
            short_description,
            description,
            image_url,
            number_of_sessions,
            session_duration_minutes,
            level,
            base_price,
            is_featured,
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
        .from(
          "page_sections"
        )
        .select("*")
        .eq(
          "page_key",
          "programmes"
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
      "Could not load programme page content:",
      contentResult.error.message
    );
  }

  const programmes =
    (programmeResult.data as Programme[]) ??
    [];

  const programmeError =
    programmeResult.error;

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

  const catalogue =
    getSection(
      sections,
      "catalogue"
    );

  const difference =
    getSection(
      sections,
      "difference"
    );

  const finalCta =
    getSection(
      sections,
      "final_cta"
    );

  const differenceItems =
    getItems(
      difference,
      fallbackDifferenceItems
    );

  const defaultSectionOrder = [
    "hero",
    "intro",
    "catalogue",
    "difference",
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
                    "PROGRAMMES & COURSES"}
                </p>

                <h1>
                  {hero?.title ||
                    "Go deeper into your craft."}
                </h1>

                <p
                  className={
                    styles.heroText
                  }
                >
                  {hero?.body ||
                    hero?.subtitle ||
                    "Build your skills over several sessions with guided pottery and glass programmes designed for curious makers."}
                </p>

                {(hero?.button_label ||
                  !hero) && (
                  <Link
                    href={
                      hero?.button_url ||
                      "#programmes"
                    }
                    className={
                      styles.heroButton
                    }
                  >
                    {hero?.button_label ||
                      "Explore programmes"}

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
                    "/workshops/workshops-hero.png"
                  }
                  alt={
                    hero?.title ||
                    "Programmes at Crafteris"
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
                    "LEARN OVER TIME"}
                </p>

                <h2>
                  {intro?.title ||
                    "More time to learn, practise and create."}
                </h2>
              </div>

              <div
                className={
                  styles.introText
                }
              >
                <p>
                  {intro?.body ||
                    intro?.subtitle ||
                    "Programmes are designed for people who want more than a single creative session. You will return to the studio over several dates, developing your technique and creating more ambitious work as you go."}
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

        {/* PROGRAMMES */}

        {isVisible(
          catalogue
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "catalogue"
                ),
            }}
            className={
              styles.programmesSection
            }
            id="programmes"
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
                  {catalogue?.eyebrow ||
                    "CURRENT PROGRAMMES"}
                </p>

                <h2>
                  {catalogue?.title ||
                    "Choose what you want to explore."}
                </h2>
              </div>

              <p>
                {catalogue?.body ||
                  catalogue?.subtitle ||
                  "Pottery, glass and creative learning paths with more time to develop your skills."}
              </p>
            </div>

            {programmeError ? (
              <div
                className={
                  styles.stateBox
                }
              >
                <h3>
                  We couldn&apos;t load
                  the programmes.
                </h3>

                <p>
                  Please try again
                  shortly.
                </p>
              </div>
            ) : programmes.length ===
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
                  New programmes are
                  coming soon.
                </h3>

                <p>
                  Check back soon or
                  contact the studio
                  to ask what&apos;s
                  coming next.
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
                  styles.programmeGrid
                }
              >
                {programmes.map(
                  (programme) => (
                    <article
                      className={
                        styles.programmeCard
                      }
                      key={
                        programme.id
                      }
                    >
                      <Link
                        href={`/programmes/${programme.slug}`}
                        className={
                          styles.imageWrapper
                        }
                      >
                        {programme.image_url ? (
                          <img
                            src={
                              programme.image_url
                            }
                            alt={
                              programme.title
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

                        {programme.is_featured && (
                          <span
                            className={
                              styles.featuredBadge
                            }
                          >
                            Featured
                          </span>
                        )}
                      </Link>

                      <div
                        className={
                          styles.programmeContent
                        }
                      >
                        <div>
                          <span
                            className={
                              styles.category
                            }
                          >
                            {
                              programme.category
                            }
                          </span>

                          <h3>
                            <Link
                              href={`/programmes/${programme.slug}`}
                            >
                              {
                                programme.title
                              }
                            </Link>
                          </h3>

                          <p>
                            {programme.short_description ||
                              programme.description ||
                              "A guided creative programme at Crafteris Studio."}
                          </p>
                        </div>

                        <div
                          className={
                            styles.programmeMeta
                          }
                        >
                          <span>
                            <Layers3
                              size={
                                15
                              }
                            />

                            {programme.number_of_sessions
                              ? `${programme.number_of_sessions} sessions`
                              : "Multiple sessions"}
                          </span>

                          <span>
                            <Clock
                              size={
                                15
                              }
                            />

                            {formatDuration(
                              programme.session_duration_minutes
                            )}{" "}
                            each
                          </span>
                        </div>

                        <div
                          className={
                            styles.cardFooter
                          }
                        >
                          <span
                            className={
                              styles.price
                            }
                          >
                            {formatPrice(
                              programme.base_price
                            )}
                          </span>

                          <Link
                            href={`/programmes/${programme.slug}`}
                            className={
                              styles.viewProgramme
                            }
                          >
                            Explore
                            programme

                            <ArrowRight
                              size={
                                15
                              }
                            />
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* DIFFERENCE */}

        {isVisible(
          difference
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "difference"
                ),
            }}
            className={
              styles.differenceSection
            }
          >
            <div
              className={
                styles.differenceHeading
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {difference?.eyebrow ||
                  "WORKSHOP OR PROGRAMME?"}
              </p>

              <h2>
                {difference?.title ||
                  "Choose the pace that suits you."}
              </h2>

              {(difference?.body ||
                difference?.subtitle) && (
                <p>
                  {difference.body ||
                    difference.subtitle}
                </p>
              )}
            </div>

            <div
              className={
                styles.differenceGrid
              }
            >
              {differenceItems.map(
                (
                  item,
                  index
                ) => (
                  <div
                    className={
                      styles.differenceCard
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
                        `Option ${
                          index + 1
                        }`}
                    </h3>

                    {item.text && (
                      <p>
                        {item.text}
                      </p>
                    )}

                    {(item.button_label ||
                      item.button_url) && (
                      <Link
                        href={
                          item.button_url ||
                          "#"
                        }
                      >
                        {item.button_label ||
                          "Explore"}{" "}
                        →
                      </Link>
                    )}
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* CTA */}

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
                  "READY TO MAKE?"}
              </p>

              <h2>
                {finalCta?.title ||
                  "See what's happening at the studio."}
              </h2>

              <p>
                {finalCta?.body ||
                  finalCta?.subtitle ||
                  "Browse upcoming workshop and programme dates."}
              </p>

              {(finalCta?.button_label ||
                !finalCta) && (
                <Link
                  href={
                    finalCta?.button_url ||
                    "/whats-on"
                  }
                  className={
                    styles.heroButton
                  }
                >
                  {finalCta?.button_label ||
                    "See what's on"}

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

      <span
        className={
          styles.diamond
        }
      >
        ◇
      </span>

      <span />
    </div>
  );
}