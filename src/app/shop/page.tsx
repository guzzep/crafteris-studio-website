import Link from "next/link";

import {
  ArrowRight,
  Package,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { createClient } from "@/lib/supabase/server";

import styles from "./shop.module.css";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  stock: number;
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

const fallbackAboutItems: ContentItem[] = [
  {
    title: "Small-batch work",
    text:
      "Pieces are made in limited quantities rather than mass-produced.",
  },
  {
    title: "Made with character",
    text:
      "Small variations are part of what makes handmade work special.",
  },
  {
    title: "Studio originals",
    text:
      "Discover pieces designed and made within the Crafteris creative studio.",
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

function getStockLabel(
  stock: number
) {
  if (stock <= 0) {
    return {
      label: "Out of stock",
      className:
        styles.outOfStock,
    };
  }

  if (stock <= 3) {
    return {
      label: `Only ${stock} left`,
      className:
        styles.lowStock,
    };
  }

  return {
    label: "In stock",
    className:
      styles.inStock,
  };
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

export default async function ShopPage() {
  const supabase =
    await createClient();

  const [
    productResult,
    contentResult,
  ] =
    await Promise.all([
      supabase
        .from("products")
        .select(
          `
            id,
            name,
            slug,
            category,
            description,
            price,
            image_url,
            stock,
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
          "shop"
        )
        .order(
          "sort_order",
          {
            ascending: true,
          }
        ),
    ]);

  if (
    contentResult.error
  ) {
    console.error(
      "Could not load Shop page content:",
      contentResult.error.message
    );
  }

  const products =
    (productResult.data as Product[]) ??
    [];

  const productError =
    productResult.error;

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

  const productsSection =
    getSection(
      sections,
      "products"
    );

  const about =
    getSection(
      sections,
      "about"
    );

  const finalCta =
    getSection(
      sections,
      "final_cta"
    );

  const aboutItems =
    getItems(
      about,
      fallbackAboutItems
    );

  const defaultSectionOrder = [
    "hero",
    "intro",
    "products",
    "about",
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
                    "STUDIO SHOP"}
                </p>

                <h1>
                  {hero?.title ||
                    "Handmade pieces worth keeping."}
                </h1>

                <p
                  className={
                    styles.heroText
                  }
                >
                  {hero?.body ||
                    hero?.subtitle ||
                    "Discover pottery, glass and creative objects made at the studio."}
                </p>

                {(hero?.button_label ||
                  !hero) && (
                  <Link
                    href={
                      hero?.button_url ||
                      "#products"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {hero?.button_label ||
                      "Explore the shop"}

                    <ArrowRight
                      size={17}
                    />
                  </Link>
                )}
              </div>

              {hero?.image_url && (
                <div
                  className={
                    styles.heroImageWrapper
                  }
                >
                  <img
                    src={
                      hero.image_url
                    }
                    alt={
                      hero.title ||
                      "Crafteris studio shop"
                    }
                    className={
                      styles.heroImage
                    }
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* INTRO */}

        {isVisible(
          intro
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
                    "MADE AT THE STUDIO"}
                </p>

                <h2>
                  {intro?.title ||
                    "Small-batch pieces with their own character."}
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
                    "Our shop brings together handmade pottery, glass pieces, decorative objects and occasional one-off studio creations."}
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

        {/* PRODUCTS */}

        {isVisible(
          productsSection
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "products"
                ),
            }}
            className={
              styles.productsSection
            }
            id="products"
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
                  {productsSection?.eyebrow ||
                    "SHOP THE STUDIO"}
                </p>

                <h2>
                  {productsSection?.title ||
                    "Available pieces."}
                </h2>
              </div>

              <p>
                {productsSection?.body ||
                  productsSection?.subtitle ||
                  "Browse the handmade pieces currently available from the studio."}
              </p>
            </div>

            {productError ? (
              <div
                className={
                  styles.stateBox
                }
              >
                <h3>
                  We couldn&apos;t
                  load the shop.
                </h3>

                <p>
                  Please try again
                  shortly.
                </p>
              </div>
            ) : products.length ===
              0 ? (
              <div
                className={
                  styles.stateBox
                }
              >
                <ShoppingBag
                  size={31}
                />

                <h3>
                  New pieces are
                  coming soon.
                </h3>

                <p>
                  Check back soon or
                  contact the studio
                  to ask what is
                  currently
                  available.
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
                  styles.productGrid
                }
              >
                {products.map(
                  (product) => {
                    const stock =
                      getStockLabel(
                        product.stock
                      );

                    return (
                      <article
                        key={
                          product.id
                        }
                        className={
                          styles.productCard
                        }
                      >
                        <div
                          className={
                            styles.imageWrapper
                          }
                        >
                          {product.image_url ? (
                            <img
                              src={
                                product.image_url
                              }
                              alt={
                                product.name
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

                          {product.is_featured && (
                            <span
                              className={
                                styles.featuredBadge
                              }
                            >
                              Featured
                            </span>
                          )}

                          <span
                            className={`${styles.stockBadge} ${stock.className}`}
                          >
                            {
                              stock.label
                            }
                          </span>
                        </div>

                        <div
                          className={
                            styles.productContent
                          }
                        >
                          <div>
                            <span
                              className={
                                styles.category
                              }
                            >
                              {
                                product.category
                              }
                            </span>

                            <h3>
                              {
                                product.name
                              }
                            </h3>

                            <p>
                              {product.description ||
                                "A handmade studio piece from Crafteris."}
                            </p>
                          </div>

                          <div
                            className={
                              styles.cardFooter
                            }
                          >
                            <strong>
                              {formatPrice(
                                product.price
                              )}
                            </strong>

                            {product.stock >
                            0 ? (
                              <Link
                                href={
                                  productsSection?.button_url ||
                                  "/contact"
                                }
                                className={
                                  styles.productButton
                                }
                              >
                                {productsSection?.button_label ||
                                  "Ask about this piece"}

                                <ArrowRight
                                  size={
                                    15
                                  }
                                />
                              </Link>
                            ) : (
                              <span
                                className={
                                  styles.disabledButton
                                }
                              >
                                Currently
                                unavailable
                              </span>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
          </section>
        )}

        {/* ABOUT */}

        {isVisible(
          about
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "about"
                ),
            }}
            className={
              styles.aboutSection
            }
          >
            <div
              className={
                styles.aboutHeading
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {about?.eyebrow ||
                  "FROM THE STUDIO"}
              </p>

              <h2>
                {about?.title ||
                  "Created by hand."}
              </h2>

              {(about?.body ||
                about?.subtitle) && (
                <p>
                  {about.body ||
                    about.subtitle}
                </p>
              )}
            </div>

            <div
              className={
                styles.aboutGrid
              }
            >
              {aboutItems.map(
                (
                  item,
                  index
                ) => {
                  const Icon =
                    index === 0
                      ? Sparkles
                      : index === 1
                        ? Package
                        : ShoppingBag;

                  return (
                    <article
                      className={
                        styles.aboutCard
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

                      <Icon
                        size={24}
                      />

                      <h3>
                        {item.title ||
                          `Item ${
                            index +
                            1
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
                  );
                }
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
                  "LOOKING FOR A GIFT?"}
              </p>

              <h2>
                {finalCta?.title ||
                  "Give someone the chance to make."}
              </h2>

              <p>
                {finalCta?.body ||
                  finalCta?.subtitle ||
                  "Gift vouchers are also available for creative experiences at the studio."}
              </p>

              {(finalCta?.button_label ||
                !finalCta) && (
                  <Link
                    href={
                      finalCta?.button_url ||
                      "/gift-vouchers"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {finalCta?.button_label ||
                      "Explore gift vouchers"}

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