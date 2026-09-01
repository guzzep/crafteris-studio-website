"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

import styles from "./workshops.module.css";

type FilterType =
  | "All"
  | "Pottery"
  | "Glass";

type Workshop = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description:
    | string
    | null;
  description:
    | string
    | null;
  image_url:
    | string
    | null;
  duration_minutes:
    | number
    | null;
  level:
    | string
    | null;
  base_price:
    | number
    | null;
  status:
    | "draft"
    | "published"
    | "archived";
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

  eyebrow:
    | string
    | null;

  title:
    | string
    | null;

  subtitle:
    | string
    | null;

  body:
    | string
    | null;

  image_url:
    | string
    | null;

  button_label:
    | string
    | null;

  button_url:
    | string
    | null;

  secondary_button_label:
    | string
    | null;

  secondary_button_url:
    | string
    | null;

  content:
    | SectionContent
    | null;

  is_visible: boolean;

  sort_order: number;
};

const fallbackBenefits: ContentItem[] =
  [
    {
      title:
        "No experience needed",
      text:
        "Many of our workshops are designed for complete beginners.",
    },
    {
      title:
        "Everything is prepared",
      text:
        "We provide the tools, equipment and guidance you need during your session.",
    },
    {
      title:
        "Make something real",
      text:
        "Leave with a piece you created yourself, or collect it after firing and finishing.",
    },
  ];

const fallbackSteps: ContentItem[] =
  [
    {
      title:
        "Choose your workshop",
      text:
        "Pick the activity, date and time that works best for you.",
    },
    {
      title:
        "Come to the studio",
      text:
        "We'll have everything ready and guide you through the session.",
    },
    {
      title:
        "Make something yours",
      text:
        "Create your piece, enjoy the process and leave with something worth keeping.",
    },
  ];

function formatDuration(
  minutes: number | null
) {
  if (!minutes) {
    return "Ask us";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours =
    Math.floor(minutes / 60);

  const remainingMinutes =
    minutes % 60;

  if (
    remainingMinutes === 0
  ) {
    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    }`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function formatPrice(
  price: number | null
) {
  if (price === null) {
    return "Ask us";
  }

  return `From €${Number(
    price
  ).toFixed(2)}`;
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

export default function WorkshopsPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<FilterType>(
      "All"
    );

  const [
    workshops,
    setWorkshops,
  ] = useState<
    Workshop[]
  >([]);

  const [
    sections,
    setSections,
  ] = useState<
    PageSection[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const loadPage =
    useCallback(async () => {
      setLoading(true);
      setError("");

      const [
        workshopResult,
        contentResult,
      ] =
        await Promise.all([
          supabase
            .from(
              "workshops"
            )
            .select(
              `
                id,
                title,
                slug,
                category,
                short_description,
                description,
                image_url,
                duration_minutes,
                level,
                base_price,
                status,
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
                ascending:
                  false,
              }
            ),

          supabase
            .from(
              "page_sections"
            )
            .select("*")
            .eq(
              "page_key",
              "workshops"
            )
            .order(
              "sort_order",
              {
                ascending: true,
              }
            ),
        ]);

      if (
        workshopResult.error
      ) {
        console.error(
          "Failed to load workshops:",
          workshopResult.error
        );

        setError(
          "We couldn't load the workshops right now."
        );
      } else {
        setWorkshops(
          (workshopResult.data as Workshop[]) ??
            []
        );
      }

      if (
        contentResult.error
      ) {
        console.error(
          "Failed to load workshop page content:",
          contentResult.error
        );
      } else {
        setSections(
          (contentResult.data as PageSection[]) ??
            []
        );
      }

      setLoading(false);
    }, [supabase]);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  function getSection(
    key: string
  ) {
    return sections.find(
      (section) =>
        section.section_key ===
        key
    );
  }

  function isVisible(
    key: string
  ) {
    const section =
      getSection(key);

    if (!section) {
      return true;
    }

    return section.is_visible;
  }

  const hero =
    getSection("hero");

  const intro =
    getSection("intro");

  const catalogue =
    getSection(
      "catalogue"
    );

  const howItWorks =
    getSection(
      "how_it_works"
    );

  const groupCta =
    getSection(
      "group_cta"
    );

  const benefits =
    getItems(
      intro,
      fallbackBenefits
    );

  const steps =
    getItems(
      howItWorks,
      fallbackSteps
    );

  const filteredWorkshops =
    activeFilter === "All"
      ? workshops
      : workshops.filter(
          (workshop) =>
            workshop.category ===
            activeFilter
        );

  const defaultSectionOrder = [
    "hero",
    "intro",
    "catalogue",
    "how_it_works",
    "group_cta",
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

        {isVisible(
          "hero"
        ) && (
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
                styles.heroContent
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {hero?.eyebrow ||
                  "Workshops at Crafteris"}
              </p>

              <h1>
                {hero?.title ||
                  "Come in curious. Leave with something you made."}
              </h1>

              <p
                className={
                  styles.heroDescription
                }
              >
                {hero?.body ||
                  hero?.subtitle ||
                  "Discover pottery and glass through relaxed, hands-on workshops designed for beginners, friends, couples and anyone who wants to try something creative."}
              </p>

              <div
                className={
                  styles.heroActions
                }
              >
                {(hero?.button_label ||
                  !hero) && (
                  <Link
                    href={
                      hero?.button_url ||
                      "#workshops"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {hero?.button_label ||
                      "Browse workshops"}
                  </Link>
                )}

                {(hero?.secondary_button_label ||
                  !hero) && (
                  <Link
                    href={
                      hero?.secondary_button_url ||
                      "/whats-on"
                    }
                    className={
                      styles.secondaryButton
                    }
                  >
                    {hero?.secondary_button_label ||
                      "See what's on"}{" "}
                    →
                  </Link>
                )}
              </div>
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
                  "Creative workshop at Crafteris"
                }
                className={
                  styles.heroImage
                }
              />
            </div>
          </section>
        )}

        {/* INTRO */}

        {isVisible(
          "intro"
        ) && (
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
                    "Designed to be easy"}
                </p>

                <h2>
                  {intro?.title ||
                    "Your first workshop should feel exciting, not intimidating."}
                </h2>

                {(intro?.body ||
                  intro?.subtitle) && (
                  <p>
                    {intro.body ||
                      intro.subtitle}
                  </p>
                )}
              </div>

              <div
                className={
                  styles.benefitsGrid
                }
              >
                {benefits.map(
                  (
                    benefit,
                    index
                  ) => (
                    <article
                      className={
                        styles.benefitCard
                      }
                      key={`${benefit.title}-${index}`}
                    >
                      <span
                        className={
                          styles.benefitNumber
                        }
                      >
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <h3>
                        {benefit.title ||
                          `Benefit ${
                            index +
                            1
                          }`}
                      </h3>

                      {benefit.text && (
                        <p>
                          {
                            benefit.text
                          }
                        </p>
                      )}
                    </article>
                  )
                )}
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

        {/* WORKSHOPS */}

        {isVisible(
          "catalogue"
        ) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "catalogue"
                ),
            }}
              className={
                styles.workshopsSection
              }
              id="workshops"
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
                  {catalogue?.eyebrow ||
                    "Choose your workshop"}
                </p>

                <h2>
                  {catalogue?.title ||
                    "What would you like to make?"}
                </h2>

                <p>
                  {catalogue?.body ||
                    catalogue?.subtitle ||
                    "Explore pottery and glass workshops and find the experience that suits you best."}
                </p>
              </div>

              <div
                className={
                  styles.filterBar
                }
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      "All"
                    )
                  }
                  className={`${
                    styles.filterButton
                  } ${
                    activeFilter ===
                    "All"
                      ? styles.activeFilter
                      : ""
                  }`}
                >
                  All workshops
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      "Pottery"
                    )
                  }
                  className={`${
                    styles.filterButton
                  } ${
                    activeFilter ===
                    "Pottery"
                      ? styles.activeFilter
                      : ""
                  }`}
                >
                  Pottery
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      "Glass"
                    )
                  }
                  className={`${
                    styles.filterButton
                  } ${
                    activeFilter ===
                    "Glass"
                      ? styles.activeFilter
                      : ""
                  }`}
                >
                  Glass
                </button>
              </div>

              {loading ? (
                <div
                  className={
                    styles.loadingState
                  }
                >
                  <div
                    className={
                      styles.loadingSpinner
                    }
                  />

                  <p>
                    Loading
                    workshops...
                  </p>
                </div>
              ) : error ? (
                <div
                  className={
                    styles.errorState
                  }
                >
                  <h3>
                    We couldn&apos;t
                    load the
                    workshops.
                  </h3>

                  <p>
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      void loadPage()
                    }
                  >
                    Try again
                  </button>
                </div>
              ) : filteredWorkshops.length ===
                0 ? (
                <div
                  className={
                    styles.emptyState
                  }
                >
                  <h3>
                    No workshops
                    available yet.
                  </h3>

                  <p>
                    New workshop
                    dates and
                    experiences will
                    be added here
                    soon.
                  </p>

                  {activeFilter !==
                    "All" && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveFilter(
                          "All"
                        )
                      }
                    >
                      View all
                      workshops
                    </button>
                  )}
                </div>
              ) : (
                <div
                  className={
                    styles.workshopsGrid
                  }
                >
                  {filteredWorkshops.map(
                    (
                      workshop
                    ) => (
                      <article
                        className={
                          styles.workshopCard
                        }
                        key={
                          workshop.id
                        }
                      >
                        <div
                          className={
                            styles.workshopImageWrapper
                          }
                        >
                          {workshop.image_url ? (
                            <img
                              src={
                                workshop.image_url
                              }
                              alt={
                                workshop.title
                              }
                              className={
                                styles.workshopImage
                              }
                            />
                          ) : (
                            <div
                              className={
                                styles.noImage
                              }
                            >
                              <span>
                                Crafteris
                              </span>
                            </div>
                          )}

                          <span
                            className={
                              styles.categoryBadge
                            }
                          >
                            {
                              workshop.category
                            }
                          </span>
                        </div>

                        <div
                          className={
                            styles.workshopContent
                          }
                        >
                          <h3>
                            {
                              workshop.title
                            }
                          </h3>

                          <p
                            className={
                              styles.workshopDescription
                            }
                          >
                            {workshop.short_description ||
                              workshop.description ||
                              "Discover a creative workshop at Crafteris Studio."}
                          </p>

                          <div
                            className={
                              styles.workshopDetails
                            }
                          >
                            <div>
                              <span>
                                Duration
                              </span>

                              <strong>
                                {formatDuration(
                                  workshop.duration_minutes
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Level
                              </span>

                              <strong>
                                {workshop.level ||
                                  "All levels"}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Price
                              </span>

                              <strong>
                                {formatPrice(
                                  workshop.base_price
                                )}
                              </strong>
                            </div>
                          </div>

                          <Link
                            href={`/workshops/${workshop.slug}`}
                            className={
                              styles.workshopLink
                            }
                          >
                            View
                            workshop

                            <span>
                              →
                            </span>
                          </Link>
                        </div>
                      </article>
                    )
                  )}
                </div>
              )}
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "catalogue"
                ) + 1
              }
            />
          </>
        )}

        {/* HOW IT WORKS */}

        {isVisible(
          "how_it_works"
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
                styles.howImageWrapper
              }
            >
              <img
                src={
                  howItWorks?.image_url ||
                  "/workshops/how-it-works.png"
                }
                alt={
                  howItWorks?.title ||
                  "Person creating during a workshop"
                }
                className={
                  styles.howImage
                }
              />
            </div>

            <div
              className={
                styles.howContent
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {howItWorks?.eyebrow ||
                  "How it works"}
              </p>

              <h2>
                {howItWorks?.title ||
                  "Book, arrive, create."}
              </h2>

              {(howItWorks?.body ||
                howItWorks?.subtitle) && (
                <p>
                  {howItWorks.body ||
                    howItWorks.subtitle}
                </p>
              )}

              {steps.map(
                (
                  step,
                  index
                ) => (
                  <div
                    className={
                      styles.howStep
                    }
                    key={`${step.title}-${index}`}
                  >
                    <span>
                      {index + 1}
                    </span>

                    <div>
                      <h3>
                        {step.title ||
                          `Step ${
                            index +
                            1
                          }`}
                      </h3>

                      {step.text && (
                        <p>
                          {
                            step.text
                          }
                        </p>
                      )}
                    </div>
                  </div>
                )
              )}

              {(howItWorks?.button_label ||
                !howItWorks) && (
                <Link
                  href={
                    howItWorks?.button_url ||
                    "/whats-on"
                  }
                  className={
                    styles.primaryButton
                  }
                >
                  {howItWorks?.button_label ||
                    "Find a session"}
                </Link>
              )}
            </div>
          </section>
        )}

        {/* GROUP CTA */}

        {isVisible(
          "group_cta"
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "group_cta"
                ),
            }}
            className={
              styles.groupCta
            }
          >
            <div
              className={
                styles.groupCtaInner
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {groupCta?.eyebrow ||
                  "Coming with others?"}
              </p>

              <h2>
                {groupCta?.title ||
                  "Make it a private creative experience."}
              </h2>

              <p>
                {groupCta?.body ||
                  groupCta?.subtitle ||
                  "Planning a team day, school visit, birthday or private group session? We can help you organise an experience around your group."}
              </p>

              {(groupCta?.button_label ||
                !groupCta) && (
                <Link
                  href={
                    groupCta?.button_url ||
                    "/team-building"
                  }
                  className={
                    styles.groupLink
                  }
                >
                  {groupCta?.button_label ||
                    "Explore private experiences"}{" "}
                  →
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