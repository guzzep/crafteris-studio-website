import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import styles from "./paint-your-own-pottery.module.css";

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

const fallbackReasons: ContentItem[] = [
  {
    title: "Beginner friendly",
    text:
      "You don't need any pottery experience. Just choose a piece and start creating.",
  },
  {
    title: "Relaxed and flexible",
    text:
      "PYOP is perfect for an easy creative afternoon without committing to a full course.",
  },
  {
    title: "Something you keep",
    text:
      "At the end, you get a finished piece that's completely personal to you.",
  },
];

const fallbackSteps: ContentItem[] = [
  {
    title: "Choose your piece",
    text:
      "Browse the pottery shelves and pick the piece you want to make your own.",
  },
  {
    title: "Paint it your way",
    text:
      "Choose your colours, experiment with patterns and decorate your piece however you like.",
  },
  {
    title: "We glaze & fire",
    text:
      "Leave your finished piece with us and we'll glaze and fire it in the studio.",
  },
  {
    title: "Collect your piece",
    text:
      "Once it's ready, come back and collect your finished pottery piece.",
  },
];

const fallbackIdeas: ContentItem[] = [
  { title: "Mugs" },
  { title: "Bowls" },
  { title: "Plates" },
  { title: "Decorative pieces" },
  { title: "Small gifts" },
  { title: "Seasonal pieces" },
];

const fallbackInfo: ContentItem[] = [
  {
    title: "Experience",
    text:
      "No pottery or painting experience is required.",
  },
  {
    title: "Glazing & firing",
    text:
      "Standard glazing and firing are included in the experience.",
  },
  {
    title: "Collection",
    text:
      "Finished pieces are collected after glazing and firing is complete.",
  },
  {
    title: "Piece pricing",
    text:
      "Pricing can vary depending on the pottery piece you choose.",
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

function splitParagraphs(
  value: string
) {
  return value
    .split("\n\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function PaintYourOwnPotteryPage() {
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
      "paint-your-own-pottery"
    )
    .order(
      "sort_order",
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      "Could not load PYOP page content:",
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

  const intro =
    getSection(
      sections,
      "intro"
    );

  const howItWorks =
    getSection(
      sections,
      "how_it_works"
    );

  const choose =
    getSection(
      sections,
      "choose"
    );

  const paint =
    getSection(
      sections,
      "paint"
    );

  const finish =
    getSection(
      sections,
      "finish"
    );

  const goodToKnow =
    getSection(
      sections,
      "good_to_know"
    );

  const groupCta =
    getSection(
      sections,
      "group_cta"
    );

  const finalCta =
    getSection(
      sections,
      "final_cta"
    );

  const reasonItems =
    getItems(
      intro,
      fallbackReasons
    );

  const stepItems =
    getItems(
      howItWorks,
      fallbackSteps
    );

  const ideaItems =
    getItems(
      choose,
      fallbackIdeas
    );

  const infoItems =
    getItems(
      goodToKnow,
      fallbackInfo
    );

  const paintParagraphs =
    splitParagraphs(
      paint?.body ||
        "You'll have access to colours and decorating tools in the studio. Keep it simple or spend your time creating something detailed.\n\nThere's no right or wrong design. The whole point is that your piece ends up looking like yours."
    );

  const finishParagraphs =
    splitParagraphs(
      finish?.body ||
        "When you're done painting, leave your piece with the studio. We'll take care of the glazing and firing process so the final result is ready to use and enjoy.\n\nYou'll be told when your pottery is ready for collection."
    );

  const defaultSectionOrder = [
    "hero",
    "intro",
    "how_it_works",
    "choose",
    "paint",
    "finish",
    "good_to_know",
    "group_cta",
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
                  "Paint Your Own Pottery"}
              </p>

              <h1>
                {hero?.title ||
                  "Pick a piece. Make it yours."}
              </h1>

              <p
                className={
                  styles.heroDescription
                }
              >
                {hero?.body ||
                  hero?.subtitle ||
                  "Choose from our pottery shelves, decorate your piece however you like, and leave the glazing and firing to us."}
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
                      "/whats-on"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {hero?.button_label ||
                      "Find a PYOP session"}
                  </Link>
                )}

                {(hero?.secondary_button_label ||
                  !hero) && (
                  <Link
                    href={
                      hero?.secondary_button_url ||
                      "#how-it-works"
                    }
                    className={
                      styles.secondaryButton
                    }
                  >
                    {hero?.secondary_button_label ||
                      "How it works"}{" "}
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
                  "/pick-a-piece/paint-pottery.png"
                }
                alt={
                  hero?.title ||
                  "Painting pottery at Crafteris"
                }
                className={
                  styles.heroImage
                }
              />
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
                    "Easy, creative and completely yours"}
                </p>

                <h2>
                  {intro?.title ||
                    "A simple way to spend a few creative hours."}
                </h2>

                <p>
                  {intro?.body ||
                    intro?.subtitle ||
                    "Paint Your Own Pottery is one of the easiest ways to experience Crafteris. There's no wheel throwing, no clay preparation and no previous experience needed."}
                </p>
              </div>

              <div
                className={
                  styles.reasonsGrid
                }
              >
                {reasonItems.map(
                  (
                    reason,
                    index
                  ) => (
                    <article
                      className={
                        styles.reasonCard
                      }
                      key={`${reason.title}-${index}`}
                    >
                      <h3>
                        {reason.title ||
                          `Reason ${
                            index + 1
                          }`}
                      </h3>

                      {reason.text && (
                        <p>
                          {
                            reason.text
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

        {/* HOW IT WORKS */}

        {isVisible(
          howItWorks
        ) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "how_it_works"
                ),
            }}
              className={
                styles.stepsSection
              }
              id="how-it-works"
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
                  {howItWorks?.eyebrow ||
                    "How it works"}
                </p>

                <h2>
                  {howItWorks?.title ||
                    "From shelf to finished piece."}
                </h2>

                <p>
                  {howItWorks?.body ||
                    howItWorks?.subtitle ||
                    "The process is simple. You focus on decorating, and we take care of the technical part afterwards."}
                </p>
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
                      <span
                        className={
                          styles.stepNumber
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
                        {step.title ||
                          `Step ${
                            index + 1
                          }`}
                      </h3>

                      {step.text && (
                        <p>
                          {
                            step.text
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
                  "how_it_works"
                ) + 1
              }
            />
          </>
        )}

        {/* CHOOSE */}

        {isVisible(
          choose
        ) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "choose"
                ),
            }}
              className={
                styles.chooseSection
              }
            >
              <div
                className={
                  styles.chooseImageWrapper
                }
              >
                <img
                  src={
                    choose?.image_url ||
                    "/pick-a-piece/choose-pottery.png"
                  }
                  alt={
                    choose?.title ||
                    "Pottery pieces ready to choose"
                  }
                  className={
                    styles.chooseImage
                  }
                />
              </div>

              <div
                className={
                  styles.chooseContent
                }
              >
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  {choose?.eyebrow ||
                    "Start with the shelves"}
                </p>

                <h2>
                  {choose?.title ||
                    "Choose the piece that feels right."}
                </h2>

                <p>
                  {choose?.body ||
                    choose?.subtitle ||
                    "Browse the available pottery in the studio and choose something you'll actually enjoy using, displaying or giving away."}
                </p>

                <div
                  className={
                    styles.ideasGrid
                  }
                >
                  {ideaItems.map(
                    (
                      idea,
                      index
                    ) => (
                      <div
                        className={
                          styles.ideaItem
                        }
                        key={`${idea.title}-${index}`}
                      >
                        <span>
                          ✓
                        </span>

                        <p>
                          {idea.title ||
                            `Idea ${
                              index +
                              1
                            }`}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "choose"
                ) + 1
              }
            />
          </>
        )}

        {/* PAINT */}

        {isVisible(
          paint
        ) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "paint"
                ),
            }}
              className={
                styles.paintSection
              }
            >
              <div
                className={
                  styles.paintContent
                }
              >
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  {paint?.eyebrow ||
                    "Then make it yours"}
                </p>

                <h2>
                  {paint?.title ||
                    "Colour, patterns, words, whatever you want."}
                </h2>

                {paintParagraphs.map(
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

              <div
                className={
                  styles.paintImageWrapper
                }
              >
                <img
                  src={
                    paint?.image_url ||
                    "/workshops/pottery-painting.png"
                  }
                  alt={
                    paint?.title ||
                    "Decorating a pottery piece"
                  }
                  className={
                    styles.paintImage
                  }
                />
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "paint"
                ) + 1
              }
            />
          </>
        )}

        {/* GLAZE AND FIRE */}

        {isVisible(
          finish
        ) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "finish"
                ),
            }}
              className={
                styles.finishSection
              }
            >
              <div
                className={
                  styles.finishImageWrapper
                }
              >
                <img
                  src={
                    finish?.image_url ||
                    "/pick-a-piece/glaze-and-fire.png"
                  }
                  alt={
                    finish?.title ||
                    "Pottery ready for glazing and firing"
                  }
                  className={
                    styles.finishImage
                  }
                />
              </div>

              <div
                className={
                  styles.finishContent
                }
              >
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  {finish?.eyebrow ||
                    "We take it from here"}
                </p>

                <h2>
                  {finish?.title ||
                    "We glaze, fire and finish your piece."}
                </h2>

                {finishParagraphs.map(
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
                  "finish"
                ) + 1
              }
            />
          </>
        )}

        {/* GOOD TO KNOW */}

        {isVisible(
          goodToKnow
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "good_to_know"
                ),
            }}
            className={
              styles.infoSection
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
                {goodToKnow?.eyebrow ||
                  "Good to know"}
              </p>

              <h2>
                {goodToKnow?.title ||
                  "Before you come."}
              </h2>

              {(goodToKnow?.body ||
                goodToKnow?.subtitle) && (
                <p>
                  {goodToKnow.body ||
                    goodToKnow.subtitle}
                </p>
              )}
            </div>

            <div
              className={
                styles.infoGrid
              }
            >
              {infoItems.map(
                (
                  item,
                  index
                ) => (
                  <article
                    key={`${item.title}-${index}`}
                  >
                    <h3>
                      {item.title ||
                        `Info ${
                          index + 1
                        }`}
                    </h3>

                    {item.text && (
                      <p>
                        {item.text}
                      </p>
                    )}
                  </article>
                )
              )}
            </div>
          </section>
        )}

        {/* GROUP CTA */}

        {isVisible(
          groupCta
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "group_cta"
                ),
            }}
            className={
              styles.groupSection
            }
          >
            <div
              className={
                styles.groupInner
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {groupCta?.eyebrow ||
                  "Coming with friends?"}
              </p>

              <h2>
                {groupCta?.title ||
                  "PYOP works really well for groups too."}
              </h2>

              <p>
                {groupCta?.body ||
                  groupCta?.subtitle ||
                  "Birthdays, friends, family days and private groups can all enjoy a relaxed pottery painting session together."}
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
                      "Explore group experiences"}{" "}
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
                styles.finalInner
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {finalCta?.eyebrow ||
                  "Ready to paint?"}
              </p>

              <h2>
                {finalCta?.title ||
                  "Choose a session and make something yours."}
              </h2>

              <p>
                {finalCta?.body ||
                  finalCta?.subtitle ||
                  "Check upcoming Crafteris sessions and find a date that works for you."}
              </p>

              {(finalCta?.button_label ||
                !finalCta) && (
                  <Link
                    href={
                      finalCta?.button_url ||
                      "/whats-on"
                    }
                    className={
                      styles.finalButton
                    }
                  >
                    {finalCta?.button_label ||
                      "See upcoming sessions"}{" "}
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