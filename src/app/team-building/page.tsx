import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import styles from "./team-building.module.css";

type ContentItem = {
  title?: string;
  text?: string;
  image_url?: string;

  button_label?: string;
  button_url?: string;

  meta?: string;
  duration?: string;
  group_size?: string;
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

const fallbackGroupTypes: ContentItem[] = [
  {
    title: "Corporate Teams",
    text:
      "Give your team a relaxed creative experience away from the usual office routine.",
  },
  {
    title: "Private Groups",
    text:
      "Plan a creative session for friends, birthdays, celebrations or special occasions.",
  },
  {
    title: "Schools & Students",
    text:
      "Hands-on creative activities designed around groups, learning and shared making.",
  },
];

const fallbackExperiences: ContentItem[] = [
  {
    title: "Pottery Experience",
    text:
      "Create with clay through pottery painting, hand building or a guided pottery activity.",
    image_url:
      "/workshops/pottery-taster.png",
    meta: "Pottery",
    duration: "From 90 minutes",
    group_size:
      "Flexible group sizes",
  },
  {
    title:
      "Fused Glass Experience",
    text:
      "Design colourful fused glass pieces in a guided session that works well for groups.",
    image_url:
      "/workshops/fused-glass.png",
    meta: "Glass",
    duration: "Around 2 hours",
    group_size:
      "Flexible group sizes",
  },
  {
    title:
      "Stained Glass Experience",
    text:
      "Discover stained glass techniques and work together on a creative hands-on activity.",
    image_url:
      "/workshops/stained-glass.png",
    meta: "Glass",
    duration:
      "From 2.5 hours",
    group_size:
      "Smaller groups recommended",
  },
];

const fallbackWhyItems: ContentItem[] = [
  {
    title:
      "No previous experience needed",
  },
  {
    title:
      "Guided by the Crafteris team",
  },
  {
    title:
      "Pottery and glass options available",
  },
  {
    title:
      "Suitable for different group types",
  },
  {
    title:
      "Everyone creates something of their own",
  },
];

const fallbackSteps: ContentItem[] = [
  {
    title:
      "Tell us about your group",
    text:
      "Let us know your group size, preferred date, occasion and what kind of experience you are looking for.",
  },
  {
    title:
      "Choose the experience",
    text:
      "We'll help you choose pottery or glass and shape the session around your group.",
  },
  {
    title:
      "Come and create",
    text:
      "Arrive at the studio, relax and enjoy a guided creative experience together.",
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

export default async function TeamBuildingPage() {
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
      "team-building"
    )
    .order(
      "sort_order",
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      "Could not load Team Building page content:",
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

  const groupTypes =
    getSection(
      sections,
      "group_types"
    );

  const experiences =
    getSection(
      sections,
      "experiences"
    );

  const why =
    getSection(
      sections,
      "why"
    );

  const process =
    getSection(
      sections,
      "process"
    );

  const custom =
    getSection(
      sections,
      "custom"
    );

  const finalCta =
    getSection(
      sections,
      "final_cta"
    );

  const groupTypeItems =
    getItems(
      groupTypes,
      fallbackGroupTypes
    );

  const experienceItems =
    getItems(
      experiences,
      fallbackExperiences
    );

  const whyItems =
    getItems(
      why,
      fallbackWhyItems
    );

  const stepItems =
    getItems(
      process,
      fallbackSteps
    );

  const defaultSectionOrder = [
    "hero",
    "group_types",
    "experiences",
    "why",
    "process",
    "custom",
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
                  "Corporate • Private Groups • Schools"}
              </p>

              <h1>
                {hero?.title ||
                  "Bring people together, creatively."}
              </h1>

              <p
                className={
                  styles.heroDescription
                }
              >
                {hero?.body ||
                  hero?.subtitle ||
                  "Step away from the usual group activity and make something together. Crafteris offers relaxed pottery and glass experiences for teams, celebrations, schools and private groups."}
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
                      "#experiences"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {hero?.button_label ||
                      "Explore group experiences"}
                  </Link>
                )}

                {(hero?.secondary_button_label ||
                  !hero) && (
                  <Link
                    href={
                      hero?.secondary_button_url ||
                      "/contact"
                    }
                    className={
                      styles.secondaryButton
                    }
                  >
                    {hero?.secondary_button_label ||
                      "Plan your group visit"}{" "}
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
                  "/team-building/team-building.jpg"
                }
                alt={
                  hero?.title ||
                  "Creative team building session at Crafteris"
                }
                className={
                  styles.heroImage
                }
              />
            </div>
          </section>
        )}

        {/* GROUP TYPES */}

        {isVisible(
          groupTypes
        ) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "group_types"
                ),
            }}
              className={
                styles.groupTypesSection
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
                  {groupTypes?.eyebrow ||
                    "Made for groups"}
                </p>

                <h2>
                  {groupTypes?.title ||
                    "A different way to spend time together."}
                </h2>

                <p>
                  {groupTypes?.body ||
                    groupTypes?.subtitle ||
                    "No presentations, no awkward activities. Just a welcoming studio, good conversation and something creative to make together."}
                </p>
              </div>

              <div
                className={
                  styles.groupTypesGrid
                }
              >
                {groupTypeItems.map(
                  (
                    group,
                    index
                  ) => (
                    <article
                      className={
                        styles.groupTypeCard
                      }
                      key={`${group.title}-${index}`}
                    >
                      <h3>
                        {group.title ||
                          `Group ${
                            index +
                            1
                          }`}
                      </h3>

                      {group.text && (
                        <p>
                          {
                            group.text
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
                  "group_types"
                ) + 1
              }
            />
          </>
        )}

        {/* EXPERIENCES */}

        {isVisible(
          experiences
        ) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "experiences"
                ),
            }}
              className={
                styles.experiencesSection
              }
              id="experiences"
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
                  {experiences?.eyebrow ||
                    "Choose an experience"}
                </p>

                <h2>
                  {experiences?.title ||
                    "Pottery or glass. You choose."}
                </h2>

                <p>
                  {experiences?.body ||
                    experiences?.subtitle ||
                    "We can help you choose the right activity depending on your group size, available time and the kind of experience you want."}
                </p>
              </div>

              <div
                className={
                  styles.experiencesGrid
                }
              >
                {experienceItems.map(
                  (
                    experience,
                    index
                  ) => (
                    <article
                      className={
                        styles.experienceCard
                      }
                      key={`${experience.title}-${index}`}
                    >
                      <div
                        className={
                          styles.experienceImageWrapper
                        }
                      >
                        <img
                          src={
                            experience.image_url ||
                            fallbackExperiences[
                              index
                            ]
                              ?.image_url ||
                            "/team-building/team-building.jpg"
                          }
                          alt={
                            experience.title ||
                            "Group experience"
                          }
                          className={
                            styles.experienceImage
                          }
                        />

                        <span
                          className={
                            styles.categoryBadge
                          }
                        >
                          {experience.meta ||
                            fallbackExperiences[
                              index
                            ]
                              ?.meta ||
                            "Creative"}
                        </span>
                      </div>

                      <div
                        className={
                          styles.experienceContent
                        }
                      >
                        <h3>
                          {experience.title ||
                            `Experience ${
                              index +
                              1
                            }`}
                        </h3>

                        <p
                          className={
                            styles.experienceDescription
                          }
                        >
                          {experience.text ||
                            ""}
                        </p>

                        <div
                          className={
                            styles.experienceDetails
                          }
                        >
                          <div>
                            <span>
                              Duration
                            </span>

                            <strong>
                              {experience.duration ||
                                fallbackExperiences[
                                  index
                                ]
                                  ?.duration ||
                                "Ask us"}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Group size
                            </span>

                            <strong>
                              {experience.group_size ||
                                fallbackExperiences[
                                  index
                                ]
                                  ?.group_size ||
                                "Flexible"}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "experiences"
                ) + 1
              }
            />
          </>
        )}

        {/* WHY */}

        {isVisible(why) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "why"
                ),
            }}
              className={
                styles.whySection
              }
            >
              <div
                className={
                  styles.whyImageWrapper
                }
              >
                <img
                  src={
                    why?.image_url ||
                    "/workshops/how-it-works.png"
                  }
                  alt={
                    why?.title ||
                    "Group creating together at Crafteris"
                  }
                  className={
                    styles.whyImage
                  }
                />
              </div>

              <div
                className={
                  styles.whyContent
                }
              >
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  {why?.eyebrow ||
                    "Why Crafteris?"}
                </p>

                <h2>
                  {why?.title ||
                    "Relaxed, social and genuinely hands-on."}
                </h2>

                <p>
                  {why?.body ||
                    why?.subtitle ||
                    "Creative activities give people something to focus on together, without forcing conversation or competition."}
                </p>

                <ul>
                  {whyItems.map(
                    (
                      item,
                      index
                    ) => (
                      <li
                        key={`${item.title}-${index}`}
                      >
                        {item.title ||
                          `Benefit ${
                            index +
                            1
                          }`}
                      </li>
                    )
                  )}
                </ul>

                {(why?.button_label ||
                  !why) && (
                  <Link
                    href={
                      why?.button_url ||
                      "/contact"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {why?.button_label ||
                      "Ask about your group"}
                  </Link>
                )}
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "why"
                ) + 1
              }
            />
          </>
        )}

        {/* PROCESS */}

        {isVisible(
          process
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "process"
                ),
            }}
            className={
              styles.processSection
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
                {process?.eyebrow ||
                  "Planning is simple"}
              </p>

              <h2>
                {process?.title ||
                  "From idea to studio day."}
              </h2>

              {(process?.body ||
                process?.subtitle) && (
                <p>
                  {process.body ||
                    process.subtitle}
                </p>
              )}
            </div>

            <div
              className={
                styles.stepsGrid
              }
            >
              {stepItems.map(
                (
                  step,
                  index
                ) => (
                  <article
                    className={
                      styles.stepCard
                    }
                    key={`${step.title}-${index}`}
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
                      {step.title ||
                        `Step ${
                          index + 1
                        }`}
                    </h3>

                    {step.text && (
                      <p>
                        {step.text}
                      </p>
                    )}
                  </article>
                )
              )}
            </div>
          </section>
        )}

        {/* CUSTOM EXPERIENCE */}

        {isVisible(
          custom
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "custom"
                ),
            }}
            className={
              styles.customSection
            }
          >
            <div
              className={
                styles.customContent
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {custom?.eyebrow ||
                  "Need something different?"}
              </p>

              <h2>
                {custom?.title ||
                  "We can shape the session around your group."}
              </h2>

              <p>
                {custom?.body ||
                  custom?.subtitle ||
                  "Group experiences do not always have to follow a standard public workshop format. Depending on availability, we can discuss timing, activity choice and the overall structure of your visit."}
              </p>

              {(custom?.button_label ||
                !custom) && (
                  <Link
                    href={
                      custom?.button_url ||
                      "/contact"
                    }
                    className={
                      styles.customLink
                    }
                  >
                    {custom?.button_label ||
                      "Tell us what you're planning"}{" "}
                    →
                  </Link>
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
                styles.finalCtaInner
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {finalCta?.eyebrow ||
                  "Plan your visit"}
              </p>

              <h2>
                {finalCta?.title ||
                  "Ready to make something together?"}
              </h2>

              <p>
                {finalCta?.body ||
                  finalCta?.subtitle ||
                  "Tell us about your group and we'll help you find the right creative experience."}
              </p>

              {(finalCta?.button_label ||
                !finalCta) && (
                  <Link
                    href={
                      finalCta?.button_url ||
                      "/contact"
                    }
                    className={
                      styles.finalButton
                    }
                  >
                    {finalCta?.button_label ||
                      "Contact Crafteris"}{" "}
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