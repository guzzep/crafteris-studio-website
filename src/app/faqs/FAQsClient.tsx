"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import type {
  FAQSection,
} from "./page";

import styles from "./faqs.module.css";

type ContentItem = {
  title?: string;
  text?: string;
};

type FAQGroup = {
  key: string;
  title: string;
  items: ContentItem[];
};

const fallbackGroups: FAQGroup[] = [
  {
    key: "general",
    title: "General",
    items: [
      {
        title:
          "Do I need any experience before visiting Crafteris?",
        text:
          "No. Many Crafteris workshops and creative sessions are designed for complete beginners. Some courses and membership activities may assume a little more confidence, but the individual page will explain that clearly.",
      },
      {
        title:
          "What can I make at Crafteris?",
        text:
          "Crafteris focuses on pottery and glass. Depending on the session, you can paint pottery, work with clay, explore fused glass, learn stained glass techniques, join a structured course or work more independently through membership.",
      },
      {
        title:
          "Can I just visit the studio without booking?",
        text:
          "Some parts of the studio may be accessible without a workshop booking, but availability can depend on the day and what is happening in the space. For a guaranteed creative session, booking in advance is recommended.",
      },
    ],
  },
  {
    key:
      "workshops_courses",
    title:
      "Workshops & Courses",
    items: [
      {
        title:
          "What is the difference between a workshop and a course?",
        text:
          "A workshop is usually a one-off creative experience. A course or programme takes place across several sessions and gives you more time to learn techniques, practise and develop your skills.",
      },
      {
        title:
          "What should I wear to a workshop?",
        text:
          "Wear comfortable clothes that you do not mind getting a little messy. Clay, paint and studio materials can occasionally mark clothing.",
      },
      {
        title:
          "Are tools and materials included?",
        text:
          "This depends on the activity. Guided workshops normally include the tools and equipment needed during the session. Some materials or specialist items may be charged separately where stated.",
      },
      {
        title:
          "Can children attend workshops?",
        text:
          "Some activities are suitable for children and families, while others may have age recommendations because of the tools or techniques involved. Check the individual workshop information before booking.",
      },
    ],
  },
  {
    key: "pyop",
    title:
      "Paint Your Own Pottery",
    items: [
      {
        title:
          "How does Paint Your Own Pottery work?",
        text:
          "You choose a pottery piece from the studio shelves, decorate it using the available colours and tools, then leave it with us. Crafteris takes care of the glazing and firing afterwards.",
      },
      {
        title:
          "Can I take my pottery home on the same day?",
        text:
          "Usually not. Painted pottery needs to be glazed and fired after your visit, so you will collect the finished piece once that process is complete.",
      },
      {
        title:
          "Is glazing and firing included?",
        text:
          "Standard glazing and firing are included in the Paint Your Own Pottery experience unless a specific piece or option says otherwise.",
      },
    ],
  },
  {
    key:
      "membership",
    title:
      "Membership",
    items: [
      {
        title:
          "Who is membership for?",
        text:
          "Membership is for people who want to return regularly and work more independently in the studio. It is especially useful once you already have enough confidence to continue personal projects.",
      },
      {
        title:
          "Are materials included in membership?",
        text:
          "No. Materials are charged separately depending on what you use. Relevant standard firings are included with the membership options currently shown on the website.",
      },
      {
        title:
          "Do I need to book studio time as a member?",
        text:
          "Yes. Studio access is still managed through bookings so that the space and equipment can be used safely and fairly.",
      },
      {
        title:
          "Can I cancel a membership session?",
        text:
          "Membership bookings should be cancelled at least 24 hours in advance where required. The exact membership terms will be shown before joining.",
      },
    ],
  },
  {
    key: "groups",
    title:
      "Groups & Team Building",
    items: [
      {
        title:
          "Can we organise a private group session?",
        text:
          "Yes. Crafteris can organise creative experiences for corporate teams, private groups, celebrations, schools and other groups.",
      },
      {
        title:
          "How many people can attend?",
        text:
          "Group capacity depends on the chosen activity and studio setup. Contact Crafteris with your expected group size and preferred date so the team can suggest the best option.",
      },
      {
        title:
          "Can the session be adapted for our group?",
        text:
          "Depending on availability and the activity, the timing, format and experience can sometimes be adjusted around the group.",
      },
    ],
  },
  {
    key:
      "bookings_visits",
    title:
      "Bookings & Visits",
    items: [
      {
        title:
          "How do I book a session?",
        text:
          "Use the What's On page to find an upcoming session and open the relevant experience. The booking system will later handle availability and reservations directly.",
      },
      {
        title:
          "What happens if I am late?",
        text:
          "Try to arrive a little before your booked start time. If you expect to be late, contact the studio as soon as possible because some sessions have fixed schedules.",
      },
      {
        title:
          "Where is Crafteris located?",
        text:
          "Crafteris is based in Malta. The final confirmed studio address and travel information will be shown on the Visit page before public launch.",
      },
      {
        title:
          "What if I have accessibility requirements?",
        text:
          "Contact Crafteris before your visit and explain what support you need. The team can then advise what is possible for the studio and your chosen activity.",
      },
    ],
  },
];

function getSection(
  sections: FAQSection[],
  key: string
) {
  return sections.find(
    (section) =>
      section.section_key === key
  );
}

function isVisible(
  section:
    | FAQSection
    | undefined
) {
  if (!section) {
    return true;
  }

  return section.is_visible;
}

function slugify(
  value: string
) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}

export default function FAQsClient({
  sections,
}: {
  sections: FAQSection[];
}) {
  const [
    openFaq,
    setOpenFaq,
  ] = useState<
    string | null
  >(null);

  function toggleFaq(
    id: string
  ) {
    setOpenFaq(
      (current) =>
        current === id
          ? null
          : id
    );
  }

  const hero =
    getSection(
      sections,
      "hero"
    );

  const help =
    getSection(
      sections,
      "help"
    );

  const groups =
    [...fallbackGroups]
      .sort((a, b) => {
        const aSection =
          getSection(
            sections,
            a.key
          );

        const bSection =
          getSection(
            sections,
            b.key
          );

        const aOrder =
          aSection?.sort_order ??
          fallbackGroups.findIndex(
            (group) =>
              group.key === a.key
          ) * 10 + 20;

        const bOrder =
          bSection?.sort_order ??
          fallbackGroups.findIndex(
            (group) =>
              group.key === b.key
          ) * 10 + 20;

        return aOrder - bOrder;
      })
      .map(
        (
          fallbackGroup
        ) => {
          const section =
            getSection(
              sections,
              fallbackGroup.key
            );

          if (
            !isVisible(
              section
            )
          ) {
            return null;
          }

          const items =
            Array.isArray(
              section?.content
                ?.items
            ) &&
            section!.content!
              .items!.length >
              0
              ? section!
                  .content!
                  .items!
              : fallbackGroup.items;

          return {
            key:
              fallbackGroup.key,
            title:
              section?.title ||
              fallbackGroup.title,
            items,
          };
        }
      )
      .filter(
        (
          group
        ): group is FAQGroup =>
          group !== null
      );

  const heroOrder =
    hero?.sort_order ?? 10;

  const helpOrder =
    help?.sort_order ?? 1000;

  const groupOrders =
    groups.map((group) =>
      getSection(
        sections,
        group.key
      )?.sort_order ?? 500
    );

  const groupsOrder =
    groupOrders.length > 0
      ? Math.min(...groupOrders)
      : 500;

  return (
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
                heroOrder,
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
                "FAQs"}
            </p>

            <h1>
              {hero?.title ||
                "Questions before you make?"}
            </h1>

            <p>
              {hero?.body ||
                hero?.subtitle ||
                "Find answers about workshops, pottery painting, memberships, group visits and visiting the Crafteris studio."}
            </p>
          </div>
        </section>
      )}

      {/* QUICK LINKS */}

      {groups.length >
        0 && (
        <section
          style={{ order: groupsOrder }}
          className={
            styles.quickLinksSection
          }
        >
          <div
            className={
              styles.quickLinks
            }
          >
            {groups.map(
              (group) => (
                <a
                  key={
                    group.key
                  }
                  href={`#${slugify(
                    group.title
                  )}`}
                >
                  {
                    group.title
                  }
                </a>
              )
            )}
          </div>
        </section>
      )}

      {/* FAQ GROUPS */}

      {groups.length >
        0 && (
        <section
          style={{ order: groupsOrder + 1 }}
          className={
            styles.faqSection
          }
        >
          {groups.map(
            (
              group,
              groupIndex
            ) => {
              const groupId =
                slugify(
                  group.title
                );

              return (
                <div
                  className={
                    styles.faqGroup
                  }
                  id={
                    groupId
                  }
                  key={
                    group.key
                  }
                >
                  <div
                    className={
                      styles.groupHeading
                    }
                  >
                    <span>
                      {String(
                        groupIndex +
                          1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <h2>
                      {
                        group.title
                      }
                    </h2>
                  </div>

                  <div
                    className={
                      styles.accordion
                    }
                  >
                    {group.items.map(
                      (
                        item,
                        itemIndex
                      ) => {
                        const id = `${group.key}-${itemIndex}`;

                        const isOpen =
                          openFaq ===
                          id;

                        return (
                          <div
                            className={`${styles.faqItem} ${
                              isOpen
                                ? styles.openItem
                                : ""
                            }`}
                            key={`${item.title}-${itemIndex}`}
                          >
                            <button
                              type="button"
                              className={
                                styles.faqQuestion
                              }
                              onClick={() =>
                                toggleFaq(
                                  id
                                )
                              }
                              aria-expanded={
                                isOpen
                              }
                            >
                              <span>
                                {item.title ||
                                  `Question ${
                                    itemIndex +
                                    1
                                  }`}
                              </span>

                              <span
                                className={
                                  styles.faqIcon
                                }
                              >
                                {isOpen
                                  ? "−"
                                  : "+"}
                              </span>
                            </button>

                            <div
                              className={`${styles.faqAnswer} ${
                                isOpen
                                  ? styles.answerOpen
                                  : ""
                              }`}
                            >
                              <div>
                                <p>
                                  {item.text ||
                                    ""}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
          )}
        </section>
      )}

      {/* HELP */}

      {isVisible(
        help
      ) && (
        <section
          style={{ order: helpOrder }}
          className={
            styles.helpSection
          }
        >
          <div
            className={
              styles.helpInner
            }
          >
            <p
              className={
                styles.eyebrow
              }
            >
              {help?.eyebrow ||
                "Still need help?"}
            </p>

            <h2>
              {help?.title ||
                "Ask us directly."}
            </h2>

            <p>
              {help?.body ||
                help?.subtitle ||
                "If your question is not covered here, send Crafteris a message and tell us what you need."}
            </p>

            <div
              className={
                styles.helpActions
              }
            >
              {(help?.button_label ||
                !help) && (
                <Link
                  href={
                    help?.button_url ||
                    "/contact"
                  }
                  className={
                    styles.primaryButton
                  }
                >
                  {help?.button_label ||
                    "Contact Crafteris"}
                </Link>
              )}

              {(help?.secondary_button_label ||
                !help) && (
                <Link
                  href={
                    help?.secondary_button_url ||
                    "/visit"
                  }
                  className={
                    styles.secondaryLink
                  }
                >
                  {help?.secondary_button_label ||
                    "Visit information"}{" "}
                  →
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}