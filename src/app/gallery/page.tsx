import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import styles from "./gallery.module.css";

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

const fallbackGalleryItems: ContentItem[] = [
  {
    title: "Pottery Studio",
    text: "Pottery",
    image_url: "/materials/pottery.png",
  },
  {
    title: "Glass Making",
    text: "Glass",
    image_url: "/materials/glass.png",
  },
  {
    title: "Creative Workshop",
    text: "Workshops",
    image_url: "/workshops/workshops-hero.png",
  },
  {
    title: "Pottery Taster",
    text: "Pottery",
    image_url: "/workshops/pottery-taster.png",
  },
  {
    title: "Fused Glass",
    text: "Glass",
    image_url: "/workshops/fused-glass.png",
  },
  {
    title: "Inside Crafteris",
    text: "Studio",
    image_url: "/visit/studio-inside.png",
  },
  {
    title: "Paint Your Own Pottery",
    text: "PYOP",
    image_url: "/pick-a-piece/paint-pottery.png",
  },
  {
    title: "Studio Membership",
    text: "Membership",
    image_url: "/membership-page/pottery-membership.png",
  },
  {
    title: "Team Building",
    text: "Groups",
    image_url: "/team-building/team-building.jpg",
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

export default async function GalleryPage() {
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
      "gallery"
    )
    .order(
      "sort_order",
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      "Could not load Gallery page content:",
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

  const gallery =
    getSection(
      sections,
      "gallery"
    );

  const social =
    getSection(
      sections,
      "social"
    );

  const finalCta =
    getSection(
      sections,
      "final_cta"
    );

  const galleryItems =
    getItems(
      gallery,
      fallbackGalleryItems
    );

  const defaultSectionOrder = [
    "hero",
    "gallery",
    "social",
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
                styles.heroInner
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {hero?.eyebrow ||
                  "Gallery"}
              </p>

              <h1>
                {hero?.title ||
                  "A little look inside Crafteris."}
              </h1>

              <p>
                {hero?.body ||
                  hero?.subtitle ||
                  "Pottery, glass, workshops, studio life and the things people make along the way."}
              </p>
            </div>
          </section>
        )}

        {/* GALLERY */}

        {isVisible(
          gallery
        ) && (
          <>
            <section
            style={{
              order:
                getSectionOrder(
                  "gallery"
                ),
            }}
              className={
                styles.gallerySection
              }
            >
              <div
                className={
                  styles.galleryGrid
                }
              >
                {galleryItems.map(
                  (
                    item,
                    index
                  ) => (
                    <article
                      className={`${styles.galleryItem} ${
                        index === 0 ||
                        index === 5
                          ? styles.largeItem
                          : ""
                      }`}
                      key={`${item.title}-${index}`}
                    >
                      <img
                        src={
                          item.image_url ||
                          fallbackGalleryItems[
                            index
                          ]
                            ?.image_url ||
                          "/materials/pottery.png"
                        }
                        alt={
                          item.title ||
                          `Gallery image ${
                            index + 1
                          }`
                        }
                        className={
                          styles.galleryImage
                        }
                      />

                      <div
                        className={
                          styles.overlay
                        }
                      >
                        <p>
                          {item.text ||
                            "Crafteris"}
                        </p>

                        <h2>
                          {item.title ||
                            `Gallery item ${
                              index + 1
                            }`}
                        </h2>
                      </div>
                    </article>
                  )
                )}
              </div>
            </section>

            <SectionDivider
              order={
                getSectionOrder(
                  "gallery"
                ) + 1
              }
            />
          </>
        )}

        {/* SEE MORE */}

        {isVisible(
          social
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "social"
                ),
            }}
            className={
              styles.socialSection
            }
          >
            <div
              className={
                styles.socialInner
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {social?.eyebrow ||
                  "See more"}
              </p>

              <h2>
                {social?.title ||
                  "Follow what's being made."}
              </h2>

              <p>
                {social?.body ||
                  social?.subtitle ||
                  "New pieces, studio moments and upcoming workshops are always appearing at Crafteris."}
              </p>

              <div
                className={
                  styles.socialActions
                }
              >
                {(social?.button_label ||
                  !social) && (
                  <Link
                    href={
                      social?.button_url ||
                      "/whats-on"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {social?.button_label ||
                      "See what's on"}
                  </Link>
                )}

                {(social?.secondary_button_label ||
                  !social) && (
                  <Link
                    href={
                      social?.secondary_button_url ||
                      "/explore"
                    }
                    className={
                      styles.secondaryLink
                    }
                  >
                    {social?.secondary_button_label ||
                      "Explore Crafteris"}{" "}
                    →
                  </Link>
                )}
              </div>
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
                  "Your turn"}
              </p>

              <h2>
                {finalCta?.title ||
                  "Come make something of your own."}
              </h2>

              <p>
                {finalCta?.body ||
                  finalCta?.subtitle ||
                  "Browse pottery and glass experiences and find something you'd like to try."}
              </p>

              {(finalCta?.button_label ||
                !finalCta) && (
                  <Link
                    href={
                      finalCta?.button_url ||
                      "/explore"
                    }
                    className={
                      styles.finalButton
                    }
                  >
                    {finalCta?.button_label ||
                      "Explore Crafteris"}{" "}
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