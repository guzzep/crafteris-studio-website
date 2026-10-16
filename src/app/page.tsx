"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

import styles from "./page.module.css";

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

const fallbackWays: ContentItem[] = [
  { title: "Paint Your Own Pottery", image_url: "/cards/paint-your-own-pottery.png", button_label: "Paint Your Own Pottery", button_url: "/paint-your-own-pottery" },
  { title: "Glass Workshops", image_url: "/workshops/fused-glass.png", button_label: "Glass Workshops", button_url: "/workshops" },
  { title: "Courses", image_url: "/cards/programmes-courses.png", button_label: "Courses", button_url: "/programmes" },
  { title: "Groups & Team Building", image_url: "/team-building/team-building.jpg", button_label: "Groups & Team Building", button_url: "/team-building" },
];

const fallbackPyopItems: ContentItem[] = [
  {
    title: "Choose",
    text:
      "Choose a mug, bowl, plate or decorative piece from our ready-to-paint pottery shelves.",
    image_url:
      "/pick-a-piece/choose-pottery.png",
  },
  {
    title: "Paint",
    text:
      "Make it yours with colours, designs, and personal touches—your creativity, no limits.",
    image_url:
      "/pick-a-piece/paint-pottery.png",
  },
  {
    title: "We glaze & fire",
    text:
      "We glaze, fire, and finish your piece with care—ready for you to enjoy for years to come.",
    image_url:
      "/pick-a-piece/glaze-and-fire.png",
  },
];

const fallbackMaterialItems: ContentItem[] =
  [
    {
      title: "Pottery",
      text:
        "Explore pottery through painting, workshops, courses and regular studio access.",
      image_url:
        "/materials/pottery.png",
      button_label:
        "Explore pottery",
      button_url:
        "/workshops",
    },
    {
      title: "Glass",
      text:
        "Create with fused and stained glass through guided workshops, programmes and independent making.",
      image_url:
        "/materials/glass.png",
      button_label:
        "Explore glass",
      button_url:
        "/workshops",
    },
  ];

const fallbackMembershipItems: ContentItem[] =
  [
    {
      title:
        "Pottery Membership",
      text:
        "Book studio time, use pottery equipment and build your skills at your own pace.",
      image_url:
        "/membership-page/pottery-membership.png",
      button_label:
        "View pottery plans",
      button_url:
        "/membership",
    },
    {
      title:
        "Glass Membership",
      text:
        "Get regular access to glass-working areas, equipment and studio facilities for independent making.",
      image_url:
        "/membership-page/glass-membership.png",
      button_label:
        "View glass plans",
      button_url:
        "/membership",
    },
  ];

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

const defaultHomeSectionOrder = [
  "hero",
  "ways_to_make",
  "whats_on",
  "pyop",
  "materials",
  "team_building",
  "membership",
];

export default function Home() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [sections, setSections] =
    useState<PageSection[]>([]);

  useEffect(() => {
    async function loadContent() {
      const {
        data,
        error,
      } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_key", "home")
        .order("sort_order", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Could not load homepage content:",
          error.message
        );

        return;
      }

      setSections(
        (data as PageSection[]) ??
          []
      );
    }

    void loadContent();
  }, [supabase]);

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

  const ways =
    getSection(
      "ways_to_make"
    );



  const pyop =
    getSection("pyop");

  const materials =
    getSection("materials");

  const teamBuilding =
    getSection(
      "team_building"
    );

  const membership =
    getSection("membership");

  const waysItems = fallbackWays;

  const pyopItems = fallbackPyopItems;

  const materialItems =
    getItems(
      materials,
      fallbackMaterialItems
    );

  const membershipItems =
    getItems(
      membership,
      fallbackMembershipItems
    );

  const orderedSectionKeys = [
    ...sections.map(
      (section) =>
        section.section_key
    ),
    ...defaultHomeSectionOrder.filter(
      (key) =>
        !sections.some(
          (section) =>
            section.section_key ===
            key
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
      ? index * 2
      : 999;
  }

  return (
    <div className={styles.page}>
      <Header />

      <main
        className={styles.main}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HERO */}

        {isVisible("hero") && (
          <>
            <section
              className={
                styles.hero
              }
              style={{
                order:
                  getSectionOrder(
                    "hero"
                  ),
              }}
            >
              <div
                className={
                  styles.heroText
                }
              >
                {hero?.eyebrow && (
                  <p>
                    {
                      hero.eyebrow
                    }
                  </p>
                )}

                <h1
                  className={
                    styles.heroTitle
                  }
                >
                  {hero?.title ||
                    "Make something worth keeping."}
                </h1>

                <p>
                  Pottery painting, glass workshops and creative experiences in Birkirkara, Malta.
                </p>

                {hero?.body && (
                  <p>
                    {hero.body}
                  </p>
                )}

                <p className={styles.glassxpressionsIntro}>
                  GlassXpressions has a new home at Crafteris—the same glass studio you know, with more ways to create.
                </p>

                <div className={styles.heroButtons}>
                  <Link href="/workshops" className={styles.ExploreButton}>Browse workshops</Link>
                  <Link href="/paint-your-own-pottery" className={styles.VisitButton}>Paint your own pottery</Link>
                </div>
              </div>

              <div
                className={
                  styles.heroImage
                }
              >
                <img
                  src={
                    hero?.image_url ||
                    "/membership-card.png"
                  }
                  alt={
                    hero?.title ||
                    "Creative making at Crafteris"
                  }
                  className={
                    styles.heroImageElement
                  }
                />
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "hero"
                ) + 1
              }
            />
          </>
        )}

        {/* CHOOSE YOUR WAY */}

        {isVisible(
          "ways_to_make"
        ) && (
          <>
            <section
              className={
                styles.cardSelection
              }
              style={{
                order:
                  getSectionOrder(
                    "ways_to_make"
                  ),
              }}
            >
              <h2
                className={
                  styles.cardTitle
                }
              >
                {ways?.title ||
                  "Choose your way to make."}
              </h2>

              {ways?.subtitle && (
                <p>
                  {
                    ways.subtitle
                  }
                </p>
              )}

              <div
                className={
                  styles.cardContainer
                }
              >
                {waysItems.map(
                  (item, index) => (
                    <div
                      className={
                        styles.card
                      }
                      key={`${item.title}-${index}`}
                    >
                      <img
                        src={
                          item.image_url ||
                          fallbackWays[
                            index
                          ]
                            ?.image_url ||
                          "/membership-card.png"
                        }
                        alt={
                          item.title ||
                          "Creative experience"
                        }
                        className={
                          styles.cardImage
                        }
                      />

                      <Link
                        href={
                          item.button_url ||
                          "#"
                        }
                        className={
                          styles.cardLink
                        }
                      >
                        {item.button_label ||
                          item.title ||
                          "Explore"}

                        <span
                          className={
                            styles.cardLinkSpan
                          }
                        >
                          →
                        </span>
                      </Link>
                    </div>
                  )
                )}
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "ways_to_make"
                ) + 1
              }
            />
          </>
        )}

        {/* PICK A PIECE */}

        {isVisible("pyop") && (
          <>
            <section
              className={
                styles.pickAPiece
              }
              style={{
                order:
                  getSectionOrder(
                    "pyop"
                  ),
              }}
            >
              <h2
                className={
                  styles.pickAPieceTitle
                }
              >
                {pyop?.title ||
                  "Pick a piece. Make it yours."}
              </h2>

              <p className={styles.pickAPieceDescription}>Choose your piece, paint it your way, and leave the glazing and firing to us.</p>
              <Link href="/paint-your-own-pottery" className={styles.pyopDetails}>How pottery painting works →</Link>

              <div
                className={
                  styles.pickAPieceContainer
                }
              >
                <svg
                  className={
                    styles.pickAPieceLines
                  }
                  viewBox="0 0 1200 950"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <marker
                      id="goldArrow"
                      markerWidth="10"
                      markerHeight="10"
                      refX="8"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path
                        d="M0,0 L0,6 L9,3 z"
                        fill="#B7924A"
                      />
                    </marker>
                  </defs>

                  <path
                    d="M380 180 H560 V340 H690"
                    className={
                      styles.connectorLine
                    }
                    markerEnd="url(#goldArrow)"
                  />

                  <path
                    d="M760 500 H910 V670 H1080"
                    className={
                      styles.connectorLine
                    }
                    markerEnd="url(#goldArrow)"
                  />
                </svg>

                <PyopCard
                  item={
                    pyopItems[0]
                  }
                  fallback={
                    fallbackPyopItems[0]
                  }
                  number="1"
                  wrapperClass={
                    styles.pickAPieceCard1
                  }
                  numberClass={
                    styles.one
                  }
                  titleClass={
                    styles.choose
                  }
                />

                <PyopCard
                  item={
                    pyopItems[1]
                  }
                  fallback={
                    fallbackPyopItems[1]
                  }
                  number="2"
                  wrapperClass={
                    styles.pickAPieceCard2
                  }
                  numberClass={
                    styles.two
                  }
                  titleClass={
                    styles.customize
                  }
                />

                <PyopCard
                  item={
                    pyopItems[2]
                  }
                  fallback={
                    fallbackPyopItems[2]
                  }
                  number="3"
                  wrapperClass={
                    styles.pickAPieceCard3
                  }
                  numberClass={
                    styles.three
                  }
                  titleClass={
                    styles.takeHome
                  }
                />
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "pyop"
                ) + 1
              }
            />
          </>
        )}

        {/* POTTERY + GLASS */}

        {isVisible(
          "materials"
        ) && (
          <>
            <section
              className={
                styles.materialsSection
              }
              style={{
                order:
                  getSectionOrder(
                    "materials"
                  ),
              }}
            >
              <h2
                className={
                  styles.materialsTitle
                }
              >
                {materials?.title ||
                  "One studio. Pottery and glass."}
              </h2>

              <p
                className={
                  styles.materialsDescription
                }
              >
                {materials?.body ||
                  materials?.subtitle ||
                  "Two creative worlds, one welcoming studio."}
              </p>

              <div
                className={
                  styles.materialsGrid
                }
              >
                {materialItems.map(
                  (item, index) => (
                    <div
                      className={
                        styles.materialCard
                      }
                      key={`${item.title}-${index}`}
                    >
                      <img
                        src={
                          item.image_url ||
                          fallbackMaterialItems[
                            index
                          ]
                            ?.image_url ||
                          "/membership-card.png"
                        }
                        alt={
                          item.title ||
                          "Creative material"
                        }
                        className={
                          styles.materialImage
                        }
                      />

                      <div
                        className={
                          styles.materialContent
                        }
                      >
                        <h3>
                          {item.title ||
                            "Creative making"}
                        </h3>

                        {item.text && (
                          <p>
                            {
                              item.text
                            }
                          </p>
                        )}

                        {(item.button_label ||
                          item.button_url) && (
                          <Link
                            href={
                              item.button_url ||
                              "#"
                            }
                            className={
                              styles.materialLink
                            }
                          >
                            {item.button_label ||
                              "Explore"}{" "}
                            →
                          </Link>
                        )}
                      </div>
                    </div>
                  )
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

        {/* TEAM BUILDING */}

        {isVisible(
          "team_building"
        ) && (
          <>
            <section
              className={
                styles.teamBuildingSection
              }
              style={{
                order:
                  getSectionOrder(
                    "team_building"
                  ),
              }}
            >
              <div
                className={
                  styles.teamBuildingContent
                }
              >
                <div
                  className={
                    styles.teamBuildingText
                  }
                >
                  <p
                    className={
                      styles.teamBuildingEyebrow
                    }
                  >
                    {teamBuilding?.eyebrow ||
                      "Corporate • Private Groups • Schools"}
                  </p>

                  <h2
                    className={
                      styles.teamBuildingTitle
                    }
                  >
                    {teamBuilding?.title ||
                      "Bring your team together, creatively."}
                  </h2>

                  <p
                    className={
                      styles.teamBuildingDescription
                    }
                  >
                    {teamBuilding?.body ||
                      teamBuilding?.subtitle ||
                      "Create, connect and enjoy something different together. Our group sessions are relaxed, hands-on and designed to bring people closer through shared creativity."}
                  </p>

                  <Link
                    href={
                      teamBuilding?.button_url ||
                      "/team-building"
                    }
                    className={
                      styles.teamBuildingLink
                    }
                  >
                    {teamBuilding?.button_label ||
                      "Plan a group visit"}{" "}
                    →
                  </Link>
                </div>

                <div
                  className={
                    styles.teamBuildingImageWrapper
                  }
                >
                  <img
                    src={
                      teamBuilding?.image_url ||
                      "/team-building/team-building.jpg"
                    }
                    alt={
                      teamBuilding?.title ||
                      "Group enjoying a creative team building session at Crafteris"
                    }
                    className={
                      styles.teamBuildingImage
                    }
                  />
                </div>
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "team_building"
                ) + 1
              }
            />
          </>
        )}

        {/* MEMBERSHIP */}

        {isVisible(
          "membership"
        ) && (
          <section
            className={
              styles.membershipSection
            }
            style={{
              order:
                getSectionOrder(
                  "membership"
                ),
            }}
          >
            <div
              className={
                styles.membershipHeader
              }
            >
              <h2>
                {membership?.title ||
                  "Your creative studio, whenever inspiration strikes."}
              </h2>

              <p>
                {membership?.body ||
                  membership?.subtitle ||
                  "Membership gives you regular or prepaid access to Crafteris for independent making, with separate options for pottery and glass."}
              </p>
            </div>

            <div
              className={
                styles.membershipGrid
              }
            >
              {membershipItems.map(
                (item, index) => (
                  <div
                    className={
                      styles.membershipCard
                    }
                    key={`${item.title}-${index}`}
                  >
                    <img
                      src={
                        item.image_url ||
                        fallbackMembershipItems[
                          index
                        ]
                          ?.image_url ||
                        "/membership-card.png"
                      }
                      alt={
                        item.title ||
                        "Crafteris membership"
                      }
                      className={
                        styles.membershipImage
                      }
                    />

                    <div
                      className={
                        styles.membershipContent
                      }
                    >
                      <h3>
                        {item.title ||
                          "Membership"}
                      </h3>

                      {item.text && (
                        <p>
                          {
                            item.text
                          }
                        </p>
                      )}

                      {(item.button_label ||
                        item.button_url) && (
                        <Link
                          href={
                            item.button_url ||
                            "/membership"
                          }
                          className={
                            styles.membershipLink
                          }
                        >
                          {item.button_label ||
                            "View plans"}{" "}
                          →
                        </Link>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function SectionDivider({
  order,
}: {
  order: number;
}) {
  return (
    <div
      className={
        styles.sectionDivider
      }
      style={{ order }}
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

type PyopCardProps = {
  item:
    | ContentItem
    | undefined;

  fallback: ContentItem;

  number: string;

  wrapperClass: string;
  numberClass: string;
  titleClass: string;
};

function PyopCard({
  item,
  fallback,
  number,
  wrapperClass,
  numberClass,
  titleClass,
}: PyopCardProps) {
  const content =
    item ?? fallback;

  return (
    <div
      className={
        wrapperClass
      }
    >
      <img
        src={
          content.image_url ||
          fallback.image_url
        }
        alt={
          content.title ||
          "Paint Your Own Pottery"
        }
        className={
          styles.pickAPieceImage
        }
      />

      <h3
        className={
          numberClass
        }
      >
        {number}
      </h3>

      <h3
        className={
          titleClass
        }
      >
        {content.title ||
          fallback.title}
      </h3>

      <p>
        {content.text ||
          fallback.text}
      </p>
    </div>
  );
}