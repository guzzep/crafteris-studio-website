import Link from "next/link";

import {
  ArrowRight,
  Gift,
  Heart,
  Sparkles,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { createClient } from "@/lib/supabase/server";

import styles from "./gift-vouchers.module.css";

type GiftVoucher = {
  id: string;
  name: string;
  amount: number | null;
  description: string | null;
  is_custom_amount: boolean;
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

const fallbackHowItems: ContentItem[] = [
  {
    title: "Choose a value",
    text:
      "Select one of the available voucher amounts or choose a flexible option.",
  },
  {
    title: "Give it to someone",
    text:
      "Give them a creative gift they can use when the right experience comes along.",
  },
  {
    title:
      "They choose what to make",
    text:
      "The recipient can explore eligible experiences and decide what they would most enjoy.",
  },
];

function formatAmount(
  voucher: GiftVoucher
) {
  if (
    voucher.is_custom_amount
  ) {
    return "Choose your amount";
  }

  if (
    voucher.amount === null
  ) {
    return "Gift voucher";
  }

  return `€${Number(
    voucher.amount
  ).toFixed(2)}`;
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

export default async function GiftVouchersPage() {
  const supabase =
    await createClient();

  const [
    voucherResult,
    contentResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "gift_voucher_options"
        )
        .select(
          `
            id,
            name,
            amount,
            description,
            is_custom_amount,
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
          "gift-vouchers"
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
      "Could not load Gift Vouchers page content:",
      contentResult.error.message
    );
  }

  const vouchers =
    (voucherResult.data as GiftVoucher[]) ??
    [];

  const voucherError =
    voucherResult.error;

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

  const vouchersSection =
    getSection(
      sections,
      "vouchers"
    );

  const howItWorks =
    getSection(
      sections,
      "how_it_works"
    );

  const finalCta =
    getSection(
      sections,
      "final_cta"
    );

  const introParagraphs =
    splitParagraphs(
      intro?.body ||
        "Give someone time to slow down, try something new and create something they can take pride in.\n\nGift vouchers can be used towards eligible Crafteris experiences and studio activities."
    );

  const howItems =
    getItems(
      howItWorks,
      fallbackHowItems
    );

  const defaultSectionOrder = [
    "hero",
    "intro",
    "vouchers",
    "how_it_works",
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

        {isVisible(
          hero
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
                styles.heroInner
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {hero?.eyebrow ||
                  "GIFT VOUCHERS"}
              </p>

              <h1>
                {hero?.title ||
                  "Give someone something they can make."}
              </h1>

              <p
                className={
                  styles.heroText
                }
              >
                {hero?.body ||
                  hero?.subtitle ||
                  "A Crafteris gift voucher gives someone the freedom to choose a creative experience that feels right for them."}
              </p>

              {(hero?.button_label ||
                !hero) && (
                  <Link
                    href={
                      hero?.button_url ||
                      "#vouchers"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {hero?.button_label ||
                      "Choose a voucher"}

                    <ArrowRight
                      size={17}
                    />
                  </Link>
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
                    "A CREATIVE GIFT"}
                </p>

                <h2>
                  {intro?.title ||
                    "More memorable than another thing."}
                </h2>
              </div>

              <div
                className={
                  styles.introContent
                }
              >
                {introParagraphs.map(
                  (
                    paragraph,
                    index
                  ) => (
                    <p
                      key={
                        index
                      }
                    >
                      {
                        paragraph
                      }
                    </p>
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

        {/* VOUCHERS */}

        {isVisible(
          vouchersSection
        ) && (
          <section
            style={{
              order:
                getSectionOrder(
                  "vouchers"
                ),
            }}
            className={
              styles.vouchersSection
            }
            id="vouchers"
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
                  {vouchersSection?.eyebrow ||
                    "CHOOSE YOUR GIFT"}
                </p>

                <h2>
                  {vouchersSection?.title ||
                    "Gift voucher options."}
                </h2>
              </div>

              <p>
                {vouchersSection?.body ||
                  vouchersSection?.subtitle ||
                  "Choose a fixed amount or let them decide with a flexible voucher."}
              </p>
            </div>

            {voucherError ? (
              <div
                className={
                  styles.stateBox
                }
              >
                <h3>
                  We couldn&apos;t
                  load the gift
                  vouchers.
                </h3>

                <p>
                  Please try again
                  shortly.
                </p>
              </div>
            ) : vouchers.length ===
              0 ? (
              <div
                className={
                  styles.stateBox
                }
              >
                <Gift
                  size={30}
                />

                <h3>
                  Gift vouchers
                  are coming soon.
                </h3>

                <p>
                  Contact the
                  studio if you
                  would like to
                  arrange a
                  creative gift.
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
                  styles.voucherGrid
                }
              >
                {vouchers.map(
                  (voucher) => (
                    <article
                      className={
                        styles.voucherCard
                      }
                      key={
                        voucher.id
                      }
                    >
                      <div
                        className={
                          styles.giftVisual
                        }
                      >
                        <Gift
                          size={42}
                        />

                        <span>
                          CRAFTERIS
                        </span>
                      </div>

                      <div
                        className={
                          styles.voucherContent
                        }
                      >
                        <span
                          className={
                            styles.voucherType
                          }
                        >
                          {voucher.is_custom_amount
                            ? "Flexible gift"
                            : "Gift voucher"}
                        </span>

                        <h3>
                          {
                            voucher.name
                          }
                        </h3>

                        <p>
                          {voucher.description ||
                            "A creative gift to use towards an experience at Crafteris Studio."}
                        </p>

                        <div
                          className={
                            styles.voucherFooter
                          }
                        >
                          <strong>
                            {formatAmount(
                              voucher
                            )}
                          </strong>

                          <Link
                            href={
                              vouchersSection?.button_url ||
                              "/contact"
                            }
                            className={
                              styles.voucherButton
                            }
                          >
                            {vouchersSection?.button_label ||
                              "Choose voucher"}

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

        {/* HOW */}

        {isVisible(
          howItWorks
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
                styles.howHeading
              }
            >
              <p
                className={
                  styles.eyebrow
                }
              >
                {howItWorks?.eyebrow ||
                  "HOW IT WORKS"}
              </p>

              <h2>
                {howItWorks?.title ||
                  "A simple gift with plenty of possibilities."}
              </h2>

              {(howItWorks?.body ||
                howItWorks?.subtitle) && (
                <p>
                  {howItWorks.body ||
                    howItWorks.subtitle}
                </p>
              )}
            </div>

            <div
              className={
                styles.howGrid
              }
            >
              {howItems.map(
                (
                  item,
                  index
                ) => {
                  const Icon =
                    index === 0
                      ? Gift
                      : index === 1
                        ? Heart
                        : Sparkles;

                  return (
                    <article
                      className={
                        styles.howCard
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
                        size={23}
                      />

                      <h3>
                        {item.title ||
                          `Step ${
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
                  "NEED HELP?"}
              </p>

              <h2>
                {finalCta?.title ||
                  "Not sure which voucher to choose?"}
              </h2>

              <p>
                {finalCta?.body ||
                  finalCta?.subtitle ||
                  "Get in touch and we'll help you find the right gift."}
              </p>

              {(finalCta?.button_label ||
                !finalCta) && (
                  <Link
                    href={
                      finalCta?.button_url ||
                      "/contact"
                    }
                    className={
                      styles.primaryButton
                    }
                  >
                    {finalCta?.button_label ||
                      "Contact the studio"}

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