import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import styles from "./visit.module.css";

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
  note?: string;
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

type OpeningHoursSettings = {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  note?: string;
};

type SiteSettings = {
  site_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  opening_hours: OpeningHoursSettings | null;
};

const fallbackVisitInfo: ContentItem[] = [
  {
    title: "Come for a workshop",
    text:
      "Book a pottery or glass experience and spend a few creative hours with us.",
  },
  {
    title: "Visit the studio",
    text:
      "Stop by, see the space, browse handmade pieces and discover what happens at Crafteris.",
  },
  {
    title: "Return as a maker",
    text:
      "Courses and memberships give you more ways to make Crafteris part of your creative routine.",
  },
];

const fallbackHours: ContentItem[] = [
  {
    title: "Monday",
    text: "09:00 – 18:00",
  },
  {
    title: "Tuesday",
    text: "09:00 – 18:00",
  },
  {
    title: "Wednesday",
    text: "09:00 – 18:00",
  },
  {
    title: "Thursday",
    text: "09:00 – 18:00",
  },
  {
    title: "Friday",
    text: "09:00 – 18:00",
  },
  {
    title: "Saturday",
    text: "10:00 – 17:00",
  },
  {
    title: "Sunday",
    text: "Closed",
  },
];

const fallbackTravel: ContentItem[] = [
  {
    title: "By car",
    text:
      "Plan a little extra time for parking, especially during busy workshop periods.",
  },
  {
    title:
      "By public transport",
    text:
      "Crafteris can be reached using Malta's public transport network. Check your route before travelling.",
  },
  {
    title:
      "Taxi / ride service",
    text:
      "Taxi and ride-hailing services are an easy option when travelling from another part of Malta.",
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

export default async function VisitPage() {
  const supabase =
    await createClient();

  const [
    contentResult,
    settingsResult,
  ] = await Promise.all([
    supabase
      .from("page_sections")
      .select("*")
      .eq(
        "page_key",
        "visit"
      )
      .order(
        "sort_order",
        {
          ascending: true,
        }
      ),

    supabase
      .from("site_settings")
      .select(
        `
          site_name,
          email,
          phone,
          address,
          opening_hours
        `
      )
      .limit(1)
      .maybeSingle(),
  ]);

  const {
    data,
    error,
  } = contentResult;

  const {
    data: settingsData,
    error: settingsError,
  } = settingsResult;

  if (error) {
    console.error(
      "Could not load Visit page content:",
      error.message
    );
  }

  if (settingsError) {
    console.error(
      "Could not load site settings:",
      settingsError.message
    );
  }

  const settings =
    (settingsData as SiteSettings | null) ??
    null;

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

  const planVisit =
    getSection(
      sections,
      "plan_visit"
    );

  const openingHours =
    getSection(
      sections,
      "opening_hours"
    );

  const travel =
    getSection(
      sections,
      "travel"
    );

  const studio =
    getSection(
      sections,
      "studio"
    );

  const accessibility =
    getSection(
      sections,
      "accessibility"
    );

  const finalCta =
    getSection(
      sections,
      "final_cta"
    );

  const visitInfoItems =
    getItems(
      intro,
      fallbackVisitInfo
    );

  const cmsOpeningHourItems =
    getItems(
      openingHours,
      fallbackHours
    );

  const settingsHours =
    settings?.opening_hours;

  const configuredHours: ContentItem[] = [
    {
      title: "Monday",
      text: settingsHours?.monday ?? "",
    },
    {
      title: "Tuesday",
      text: settingsHours?.tuesday ?? "",
    },
    {
      title: "Wednesday",
      text: settingsHours?.wednesday ?? "",
    },
    {
      title: "Thursday",
      text: settingsHours?.thursday ?? "",
    },
    {
      title: "Friday",
      text: settingsHours?.friday ?? "",
    },
    {
      title: "Saturday",
      text: settingsHours?.saturday ?? "",
    },
    {
      title: "Sunday",
      text: settingsHours?.sunday ?? "",
    },
  ];

  const hasSettingsHours =
    configuredHours.some(
      (item) =>
        Boolean(
          item.text?.trim()
        )
    );

  const openingHourItems =
    hasSettingsHours
      ? configuredHours
      : cmsOpeningHourItems;

  const travelItems =
    getItems(
      travel,
      fallbackTravel
    );

  const cmsAddress =
    planVisit?.content?.items?.[0];

  const studioAddress =
    settings?.address?.trim() ||
    cmsAddress?.text ||
    "Malta";

  const openingHoursNote =
    settingsHours?.note?.trim() ||
    openingHours?.content?.note ||
    "Check opening hours before making a special journey.";

  const studioParagraphs =
    (
      studio?.body ||
      "Creative work can get messy. Wear comfortable clothing and something you won't mind getting a little clay, paint or studio dust on.\n\nIf your booking requires anything specific, you'll receive the details before your session."
    )
      .split("\n\n")
      .filter(Boolean);

  const defaultSectionOrder = [
    "hero",
    "intro",
    "plan_visit",
    "opening_hours",
    "travel",
    "studio",
    "accessibility",
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
                styles.heroContent
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {hero?.eyebrow ||
                  "Visit Crafteris"}
              </p>

              <h1>
                {hero?.title ||
                  "Come see where things get made."}
              </h1>

              <p
                className={
                  styles.heroDescription
                }
              >
                {hero?.body ||
                  hero?.subtitle ||
                  "Step into our Malta studio for pottery, glass, workshops, courses, independent making and a little creative inspiration."}
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
                      "#plan-your-visit"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {hero?.button_label ||
                      "Plan your visit"}
                  </Link>
                )}

                {(hero?.secondary_button_label ||
                  !hero) && (
                  <Link
                    href={
                      hero?.secondary_button_url ||
                      "/workshops"
                    }
                    className={
                      styles.secondaryButton
                    }
                  >
                    {hero?.secondary_button_label ||
                      "Browse workshops"}{" "}
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
                  "Crafteris creative studio in Malta"
                }
                className={
                  styles.heroImage
                }
              />
            </div>
          </section>
        )}

        {/* EXPERIENCE */}

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
                    "Inside Crafteris"}
                </p>

                <h2>
                  {intro?.title ||
                    "A working studio, not just somewhere to visit."}
                </h2>

                <p>
                  {intro?.body ||
                    intro?.subtitle ||
                    "Crafteris brings pottery and glass together under one roof. Depending on the day, you might find workshops taking place, members working independently or new pieces being finished in the studio."}
                </p>
              </div>

              <div
                className={
                  styles.visitInfoGrid
                }
              >
                {visitInfoItems.map(
                  (
                    item,
                    index
                  ) => (
                    <article
                      className={
                        styles.visitInfoCard
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
                          `Visit option ${
                            index + 1
                          }`}
                      </h3>

                      {item.text && (
                        <p>
                          {
                            item.text
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

        {/* PLAN YOUR VISIT */}

        {isVisible(
          planVisit
        ) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "plan_visit"
                ),
            }}
              className={
                styles.planSection
              }
              id="plan-your-visit"
            >
              <div
                className={
                  styles.planImageWrapper
                }
              >
                <img
                  src={
                    planVisit?.image_url ||
                    "/visit/studio-exterior.png"
                  }
                  alt={
                    planVisit?.title ||
                    "Entrance to Crafteris studio"
                  }
                  className={
                    styles.planImage
                  }
                />
              </div>

              <div
                className={
                  styles.planContent
                }
              >
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  {planVisit?.eyebrow ||
                    "Plan your visit"}
                </p>

                <h2>
                  {planVisit?.title ||
                    "Find us in Malta."}
                </h2>

                <p
                  className={
                    styles.planDescription
                  }
                >
                  {planVisit?.body ||
                    planVisit?.subtitle ||
                    "Visit the studio for workshops, programmes, membership sessions, shopping and creative experiences."}
                </p>

                <div
                  className={
                    styles.addressBox
                  }
                >
                  <p
                    className={
                      styles.addressLabel
                    }
                  >
                    Studio
                  </p>

                  <h3>
                    {cmsAddress?.title ||
                      settings?.site_name ||
                      "Crafteris Studio"}
                  </h3>

                  <p>
                    {studioAddress}
                  </p>

                  <p
                    className={
                      styles.addressNote
                    }
                  >
                    {cmsAddress?.meta ||
                      "Studio address managed from Admin Settings."}
                  </p>
                </div>

                <div
                  className={
                    styles.planButtons
                  }
                >
                  {(planVisit?.button_label ||
                    !planVisit) && (
                    <Link
                      href={
                        planVisit?.button_url ||
                        "/contact"
                      }
                      className={
                        styles.primaryButton
                      }
                    >
                      {planVisit?.button_label ||
                        "Contact the studio"}
                    </Link>
                  )}

                  {(planVisit?.secondary_button_label ||
                    !planVisit) && (
                    <Link
                      href={
                        planVisit?.secondary_button_url ||
                        "/whats-on"
                      }
                      className={
                        styles.secondaryButton
                      }
                    >
                      {planVisit?.secondary_button_label ||
                        "See upcoming sessions"}{" "}
                      →
                    </Link>
                  )}
                </div>
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "plan_visit"
                ) + 1
              }
            />
          </>
        )}

        {/* OPENING HOURS */}

        {isVisible(
          openingHours
        ) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "opening_hours"
                ),
            }}
              className={
                styles.hoursSection
              }
            >
              <div
                className={
                  styles.hoursContent
                }
              >
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  {openingHours?.eyebrow ||
                    "Opening hours"}
                </p>

                <h2>
                  {openingHours?.title ||
                    "When to visit."}
                </h2>

                <p
                  className={
                    styles.hoursDescription
                  }
                >
                  {openingHours?.body ||
                    openingHours?.subtitle ||
                    "Studio opening times may change around courses, private events and public holidays, so check before making a special journey."}
                </p>
              </div>

              <div
                className={
                  styles.hoursTable
                }
              >
                {openingHourItems.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      className={
                        styles.hoursRow
                      }
                      key={`${item.title}-${index}`}
                    >
                      <span>
                        {item.title ||
                          "Day"}
                      </span>

                      <strong>
                        {item.text ||
                          "Closed"}
                      </strong>
                    </div>
                  )
                )}

                <p
                  className={
                    styles.hoursNote
                  }
                >
                  {openingHoursNote}
                </p>
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "opening_hours"
                ) + 1
              }
            />
          </>
        )}

        {/* GETTING HERE */}

        {isVisible(
          travel
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "travel"
                ),
            }}
            className={
              styles.travelSection
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
                {travel?.eyebrow ||
                  "Getting here"}
              </p>

              <h2>
                {travel?.title ||
                  "However you're travelling."}
              </h2>

              <p>
                {travel?.body ||
                  travel?.subtitle ||
                  "Give yourself enough time to arrive comfortably before your booked session."}
              </p>
            </div>

            <div
              className={
                styles.travelGrid
              }
            >
              {travelItems.map(
                (
                  item,
                  index
                ) => (
                  <article
                    className={
                      styles.travelCard
                    }
                    key={`${item.title}-${index}`}
                  >
                    <h3>
                      {item.title ||
                        `Travel option ${
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

        {/* STUDIO */}

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
                    "Inside Crafteris pottery and glass studio"
                  }
                  className={
                    styles.studioImage
                  }
                />
              </div>

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
                    "Before you arrive"}
                </p>

                <h2>
                  {studio?.title ||
                    "Come ready to make a little mess."}
                </h2>

                {studioParagraphs.map(
                  (
                    paragraph,
                    index
                  ) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  )
                )}

                {(studio?.button_label ||
                  !studio) && (
                  <Link
                    href={
                      studio?.button_url ||
                      "/faqs"
                    }
                    className={
                      styles.textLink
                    }
                  >
                    {studio?.button_label ||
                      "Read our FAQs"}{" "}
                    →
                  </Link>
                )}
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

        {/* ACCESSIBILITY */}

        {isVisible(
          accessibility
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "accessibility"
                ),
            }}
            className={
              styles.accessibilitySection
            }
          >
            <div>
              <p
                className={
                  styles.eyebrow
                }
              >
                {accessibility?.eyebrow ||
                  "Accessibility"}
              </p>

              <h2>
                {accessibility?.title ||
                  "Need something before your visit?"}
              </h2>
            </div>

            <div
              className={
                styles.accessibilityText
              }
            >
              <p>
                {accessibility?.body ||
                  accessibility?.subtitle ||
                  "If you have accessibility requirements or need additional support during your visit, contact us before your booking and we'll do our best to help."}
              </p>

              {(accessibility?.button_label ||
                !accessibility) && (
                  <Link
                    href={
                      accessibility?.button_url ||
                      "/contact"
                    }
                    className={
                      styles.textLink
                    }
                  >
                    {accessibility?.button_label ||
                      "Contact Crafteris"}{" "}
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
                  "Ready to come in?"}
              </p>

              <h2>
                {finalCta?.title ||
                  "Choose something to make."}
              </h2>

              <p>
                {finalCta?.body ||
                  finalCta?.subtitle ||
                  "Browse upcoming pottery and glass experiences and find your next reason to visit the studio."}
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
                      "/programmes"
                    }
                    className={
                      styles.finalSecondary
                    }
                  >
                    {finalCta?.secondary_button_label ||
                      "Explore courses"}{" "}
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