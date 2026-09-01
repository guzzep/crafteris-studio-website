import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import styles from "./about.module.css";

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

const fallbackValues: ContentItem[] = [
  {
    title: "Make it approachable",
    text:
      "Creativity should feel welcoming, whether it's your first workshop or your hundredth studio session.",
  },
  {
    title: "Make it meaningful",
    text:
      "We believe the best creative experiences leave you with more than a finished object.",
  },
  {
    title: "Make it together",
    text:
      "Crafteris is built around shared studio space, conversation and the simple joy of making alongside other people.",
  },
];

const fallbackStudioAreas: ContentItem[] = [
  {
    title: "Pottery",
    text:
      "From painting and hand building to courses and independent studio access.",
    button_label: "Discover more",
    button_url: "/workshops",
  },
  {
    title: "Glass",
    text:
      "Explore fused and stained glass through workshops, programmes and regular making.",
    button_label: "Discover more",
    button_url: "/workshops",
  },
  {
    title: "Community",
    text:
      "A place for beginners, regular makers, groups and creative people to spend time together.",
    button_label: "Discover more",
    button_url: "/membership",
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

function splitParagraphs(
  value: string
) {
  return value
    .split("\n\n")
    .map((item) =>
      item.trim()
    )
    .filter(Boolean);
}

export default async function AboutPage() {
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
      "about"
    )
    .order(
      "sort_order",
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      "Could not load About page content:",
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

  const story =
    getSection(
      sections,
      "story"
    );

  const materials =
    getSection(
      sections,
      "materials"
    );

  const values =
    getSection(
      sections,
      "values"
    );

  const studio =
    getSection(
      sections,
      "studio"
    );

  const people =
    getSection(
      sections,
      "people"
    );

  const finalCta =
    getSection(
      sections,
      "final_cta"
    );

  const valueItems =
    getItems(
      values,
      fallbackValues
    );

  const studioItems =
    getItems(
      studio,
      fallbackStudioAreas
    );

  const storyParagraphs =
    splitParagraphs(
      story?.body ||
        "Crafteris is a creative studio built around a simple idea: making things with your hands should feel accessible, rewarding and enjoyable.\n\nSome people come for a single workshop. Some want to learn a new craft across several weeks. Others want a studio they can return to regularly and work more independently.\n\nCrafteris brings those different ways of making together in one place."
    );

  const materialParagraphs =
    splitParagraphs(
      materials?.body ||
        "Crafteris gives people the chance to explore different materials without needing separate studios, equipment or experience.\n\nYou can paint pottery one week, discover fused glass the next, join a longer course or eventually become a regular studio member."
    );

  const peopleParagraphs =
    splitParagraphs(
      people?.body ||
        "You do not need to consider yourself an artist or maker before coming through the door.\n\nCrafteris is designed for complete beginners, experienced creatives, friends looking for something different, families, teams, students and people who simply want to spend more time making things."
    );

  const defaultSectionOrder = [
    "hero",
    "story",
    "materials",
    "values",
    "studio",
    "people",
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
        }} className={styles.page}>
        {/* HERO */}

        {isVisible(hero) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "hero"
                ),
            }} className={styles.hero}>
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
                  "About Crafteris"}
              </p>

              <h1>
                {hero?.title ||
                  "A studio built for people who want to make."}
              </h1>

              <p
                className={
                  styles.heroDescription
                }
              >
                {hero?.body ||
                  hero?.subtitle ||
                  "Crafteris brings pottery, glass and creative experiences together in one welcoming studio in Malta."}
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
                      "/explore"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {hero?.button_label ||
                      "Explore Crafteris"}
                  </Link>
                )}

                {(hero?.secondary_button_label ||
                  !hero) && (
                  <Link
                    href={
                      hero?.secondary_button_url ||
                      "/visit"
                    }
                    className={
                      styles.secondaryButton
                    }
                  >
                    {hero?.secondary_button_label ||
                      "Visit the studio"}{" "}
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
                  "/visit/visit-hero.png"
                }
                alt={
                  hero?.title ||
                  "Inside the Crafteris creative studio"
                }
                className={
                  styles.heroImage
                }
              />
            </div>
          </section>
        )}

        {/* STORY */}

        {isVisible(
          story
        ) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "story"
                ),
            }}
              className={
                styles.storySection
              }
            >
              <div
                className={
                  styles.storyHeading
                }
              >
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  {story?.eyebrow ||
                    "Our idea"}
                </p>

                <h2>
                  {story?.title ||
                    "Make something worth keeping."}
                </h2>
              </div>

              <div
                className={
                  styles.storyText
                }
              >
                {storyParagraphs.map(
                  (
                    paragraph,
                    index
                  ) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  )
                )}
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "story"
                ) + 1
              }
            />
          </>
        )}

        {/* POTTERY + GLASS */}

        {isVisible(
          materials
        ) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "materials"
                ),
            }}
              className={
                styles.materialSection
              }
            >
              <div
                className={
                  styles.materialImageWrapper
                }
              >
                <img
                  src={
                    materials?.image_url ||
                    "/materials/pottery.png"
                  }
                  alt={
                    materials?.title ||
                    "Pottery at Crafteris"
                  }
                  className={
                    styles.materialImage
                  }
                />
              </div>

              <div
                className={
                  styles.materialContent
                }
              >
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  {materials?.eyebrow ||
                    "Two creative worlds"}
                </p>

                <h2>
                  {materials?.title ||
                    "Pottery and glass, under one roof."}
                </h2>

                {materialParagraphs.map(
                  (
                    paragraph,
                    index
                  ) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  )
                )}

                {(materials?.button_label ||
                  !materials) && (
                  <Link
                    href={
                      materials?.button_url ||
                      "/explore"
                    }
                    className={
                      styles.textLink
                    }
                  >
                    {materials?.button_label ||
                      "Explore ways to make"}{" "}
                    →
                  </Link>
                )}
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "materials"
                ) + 1
              }
            />
          </>
        )}

        {/* VALUES */}

        {isVisible(
          values
        ) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "values"
                ),
            }}
              className={
                styles.valuesSection
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
                  {values?.eyebrow ||
                    "What matters to us"}
                </p>

                <h2>
                  {values?.title ||
                    "Creative without being intimidating."}
                </h2>

                <p>
                  {values?.body ||
                    values?.subtitle ||
                    "The studio is designed to feel professional, inspiring and approachable at the same time."}
                </p>
              </div>

              <div
                className={
                  styles.valuesGrid
                }
              >
                {valueItems.map(
                  (
                    value,
                    index
                  ) => (
                    <article
                      className={
                        styles.valueCard
                      }
                      key={`${value.title}-${index}`}
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
                        {value.title ||
                          `Value ${
                            index + 1
                          }`}
                      </h3>

                      {value.text && (
                        <p>
                          {
                            value.text
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
                  "values"
                ) + 1
              }
            />
          </>
        )}

        {/* STUDIO EXPERIENCE */}

        {isVisible(
          studio
        ) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "studio"
                ),
            }}
              className={
                styles.studioSection
              }
            >
              <div
                className={
                  styles.studioContent
                }
              >
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  {studio?.eyebrow ||
                    "The studio"}
                </p>

                <h2>
                  {studio?.title ||
                    "A place to learn, experiment and return to."}
                </h2>

                <p>
                  {studio?.body ||
                    studio?.subtitle ||
                    "Crafteris is more than a room where workshops happen. It's a working creative studio designed around different levels of experience."}
                </p>

                <div
                  className={
                    styles.studioAreas
                  }
                >
                  {studioItems.map(
                    (
                      area,
                      index
                    ) => (
                      <div
                        className={
                          styles.studioArea
                        }
                        key={`${area.title}-${index}`}
                      >
                        <h3>
                          {area.title ||
                            `Area ${
                              index +
                              1
                            }`}
                        </h3>

                        {area.text && (
                          <p>
                            {area.text}
                          </p>
                        )}

                        {(area.button_label ||
                          area.button_url) && (
                          <Link
                            href={
                              area.button_url ||
                              "#"
                            }
                          >
                            {area.button_label ||
                              "Discover more"}{" "}
                            →
                          </Link>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div
                className={
                  styles.studioImageWrapper
                }
              >
                <img
                  src={
                    studio?.image_url ||
                    "/visit/studio-inside.png"
                  }
                  alt={
                    studio?.title ||
                    "Pottery and glass workspace inside Crafteris"
                  }
                  className={
                    styles.studioImage
                  }
                />
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "studio"
                ) + 1
              }
            />
          </>
        )}

        {/* WHO IT IS FOR */}

        {isVisible(
          people
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "people"
                ),
            }}
            className={
              styles.peopleSection
            }
          >
            <div
              className={
                styles.peopleHeading
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {people?.eyebrow ||
                  "Who is Crafteris for?"}
              </p>

              <h2>
                {people?.title ||
                  "Anyone curious enough to try."}
              </h2>
            </div>

            <div
              className={
                styles.peopleContent
              }
            >
              {peopleParagraphs.map(
                (
                  paragraph,
                  index
                ) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                )
              )}

              {(people?.button_label ||
                !people) && (
                  <Link
                    href={
                      people?.button_url ||
                      "/whats-on"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {people?.button_label ||
                      "Find something to try"}
                  </Link>
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
                  "Come make something"}
              </p>

              <h2>
                {finalCta?.title ||
                  "The easiest way to understand Crafteris is to experience it."}
              </h2>

              <p>
                {finalCta?.body ||
                  finalCta?.subtitle ||
                  "Browse upcoming workshops and programmes or plan a visit to the studio."}
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
                      "/whats-on"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {finalCta?.button_label ||
                      "See what's on"}
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
                      styles.finalSecondary
                    }
                  >
                    {finalCta?.secondary_button_label ||
                      "Visit Crafteris"}{" "}
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