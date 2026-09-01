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

import styles from "./whats-on.module.css";

type PageSection = {
  id: string;
  page_key: string;
  section_key: string;
  is_visible: boolean;
  sort_order: number;
};

type CategoryFilter =
  | "All"
  | "Pottery"
  | "Glass";

type TypeFilter =
  | "All"
  | "Workshop"
  | "Course"
  | "Drop-in";

type EventItem = {
  id: string;
  title: string;
  category: string;
  type: "Workshop" | "Course";
  startsAt: string;
  endsAt: string | null;
  durationMinutes: number | null;
  price: number | null;
  availability: string;
  image: string | null;
  href: string;
};

type WorkshopRelation = {
  id: string;
  title: string;
  slug: string;
  category: string;
  image_url: string | null;
  duration_minutes: number | null;
  base_price: number | null;
  status: string;
};

type WorkshopSessionRow = {
  id: string;
  starts_at: string;
  ends_at: string | null;
  capacity: number;
  booked_places: number;
  price: number | null;
  workshops:
    | WorkshopRelation
    | WorkshopRelation[]
    | null;
};

type ProgrammeRelation = {
  id: string;
  title: string;
  slug: string;
  category: string;
  image_url: string | null;
  session_duration_minutes: number | null;
  base_price: number | null;
  status: string;
};

type ProgrammeSessionRow = {
  id: string;
  starts_at: string;
  ends_at: string | null;
  session_number: number | null;
  programmes:
    | ProgrammeRelation
    | ProgrammeRelation[]
    | null;
};

function getRelation<T>(
  value: T | T[] | null
): T | null {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

function getAvailability(
  capacity: number,
  bookedPlaces: number
) {
  const remaining =
    capacity - bookedPlaces;

  if (remaining <= 0) {
    return "Fully booked";
  }

  if (remaining <= 2) {
    return "Last places";
  }

  if (
    capacity > 0 &&
    remaining <= Math.ceil(capacity / 2)
  ) {
    return "Filling up";
  }

  return "Available";
}

function getDuration(
  startsAt: string,
  endsAt: string | null,
  fallbackMinutes: number | null
) {
  if (startsAt && endsAt) {
    const difference =
      new Date(endsAt).getTime() -
      new Date(startsAt).getTime();

    const minutes = Math.round(
      difference / 60000
    );

    if (minutes > 0) {
      return formatDuration(minutes);
    }
  }

  return formatDuration(
    fallbackMinutes
  );
}

function formatDuration(
  minutes: number | null
) {
  if (!minutes) {
    return "Ask us";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  const remainingMinutes =
    minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    }`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function formatPrice(price: number | null) {
  if (price === null) {
    return "Ask us";
  }

  return `€${Number(price).toFixed(2)}`;
}

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone:
        "Europe/Malta",
      day: "numeric",
      month: "short",
    }
  ).format(new Date(date));
}

function formatEventDay(date: string) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone:
        "Europe/Malta",
      weekday: "long",
    }
  ).format(new Date(date));
}

function formatEventTime(date: string) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone:
        "Europe/Malta",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  ).format(new Date(date));
}

export default function WhatsOnPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [sections, setSections] =
    useState<PageSection[]>([]);

  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("All");

  const [typeFilter, setTypeFilter] =
    useState<TypeFilter>("All");

  const [events, setEvents] = useState<
    EventItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadPageSections() {
      const { data, error } =
        await supabase
          .from("page_sections")
          .select(
            "id, page_key, section_key, is_visible, sort_order"
          )
          .eq(
            "page_key",
            "whats-on"
          )
          .order("sort_order", {
            ascending: true,
          });

      if (!active) {
        return;
      }

      if (error) {
        console.error(
          "Could not load What's On page sections:",
          error.message
        );
        return;
      }

      setSections(
        (data as PageSection[]) ?? []
      );
    }

    void loadPageSections();

    return () => {
      active = false;
    };
  }, [supabase]);

  const loadEvents =
    useCallback(async () => {
      setLoading(true);
      setError("");

      const now =
        new Date().toISOString();

      const [
        workshopResult,
        programmeResult,
      ] = await Promise.all([
        supabase
          .from("workshop_sessions")
          .select(
            `
              id,
              starts_at,
              ends_at,
              capacity,
              booked_places,
              price,
              workshops!inner (
                id,
                title,
                slug,
                category,
                image_url,
                duration_minutes,
                base_price,
                status
              )
            `
          )
          .eq("is_cancelled", false)
          .eq(
            "workshops.status",
            "published"
          )
          .gte("starts_at", now)
          .order("starts_at", {
            ascending: true,
          }),

        supabase
          .from("programme_sessions")
          .select(
            `
              id,
              starts_at,
              ends_at,
              session_number,
              programmes!inner (
                id,
                title,
                slug,
                category,
                image_url,
                session_duration_minutes,
                base_price,
                status
              )
            `
          )
          .eq(
            "programmes.status",
            "published"
          )
          .gte("starts_at", now)
          .order("starts_at", {
            ascending: true,
          }),
      ]);

      if (workshopResult.error) {
        console.error(
          workshopResult.error
        );

        setError(
          "We couldn't load upcoming workshop sessions."
        );

        setLoading(false);
        return;
      }

      if (programmeResult.error) {
        console.error(
          programmeResult.error
        );

        setError(
          "We couldn't load upcoming programme sessions."
        );

        setLoading(false);
        return;
      }

      const workshopEvents: EventItem[] =
        (
          workshopResult.data as WorkshopSessionRow[]
        ).flatMap((session) => {
          const workshop =
            getRelation(
              session.workshops
            );

          if (!workshop) {
            return [];
          }

          return [
            {
              id: `workshop-${session.id}`,

              title: workshop.title,

              category:
                workshop.category,

              type: "Workshop",

              startsAt:
                session.starts_at,

              endsAt:
                session.ends_at,

              durationMinutes:
                workshop.duration_minutes,

              price:
                session.price ??
                workshop.base_price,

              availability:
                getAvailability(
                  session.capacity,
                  session.booked_places
                ),

              image:
                workshop.image_url,

              href: `/workshops/${workshop.slug}`,
            },
          ];
        });

      const programmeEvents: EventItem[] =
        (
          programmeResult.data as ProgrammeSessionRow[]
        ).flatMap((session) => {
          const programme =
            getRelation(
              session.programmes
            );

          if (!programme) {
            return [];
          }

          return [
            {
              id: `programme-${session.id}`,

              title:
                programme.title,

              category:
                programme.category,

              type: "Course",

              startsAt:
                session.starts_at,

              endsAt:
                session.ends_at,

              durationMinutes:
                programme.session_duration_minutes,

              price:
                programme.base_price,

              availability:
                "Available",

              image:
                programme.image_url,

              href: `/programmes/${programme.slug}`,
            },
          ];
        });

      const combined = [
        ...workshopEvents,
        ...programmeEvents,
      ].sort(
        (a, b) =>
          new Date(
            a.startsAt
          ).getTime() -
          new Date(
            b.startsAt
          ).getTime()
      );

      setEvents(combined);

      setLoading(false);
    }, [supabase]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const filteredEvents =
    events.filter((event) => {
      const matchesCategory =
        categoryFilter === "All" ||
        event.category ===
          categoryFilter;

      const matchesType =
        typeFilter === "All" ||
        event.type === typeFilter;

      return (
        matchesCategory &&
        matchesType
      );
    });

  const defaultSectionOrder = [
    "hero",
    "filters",
    "events",
    "pyop",
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

  function getSectionOrder(key: string) {
    const index =
      orderedSectionKeys.indexOf(key);

    return index >= 0
      ? (index + 1) * 10
      : 10000;
  }

  function isSectionVisible(key: string) {
    const section =
      sections.find(
        (item) =>
          item.section_key === key
      );

    return section
      ? section.is_visible
      : true;
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
        <section
          style={{
            order:
              getSectionOrder(
                "hero"
              ),
          }}
          hidden={
            !isSectionVisible(
              "hero"
            )
          } className={styles.hero}>
          <div
            className={styles.heroInner}
          >
            <p className={styles.eyebrow}>
              What&apos;s On
            </p>

            <h1>
              Find your next reason to make.
            </h1>

            <p>
              Browse upcoming pottery and
              glass workshops, courses and
              creative sessions at Crafteris.
            </p>
          </div>
        </section>

        {/* FILTERS */}
        <section
          style={{
            order:
              getSectionOrder(
                "filters"
              ),
          }}
          hidden={
            !isSectionVisible(
              "filters"
            )
          }
          className={
            styles.filtersSection
          }
        >
          <div
            className={styles.filterGroup}
          >
            <span
              className={styles.filterLabel}
            >
              Material
            </span>

            <div
              className={
                styles.filterButtons
              }
            >
              {(
                [
                  "All",
                  "Pottery",
                  "Glass",
                ] as CategoryFilter[]
              ).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setCategoryFilter(
                      filter
                    )
                  }
                  className={`${
                    styles.filterButton
                  } ${
                    categoryFilter ===
                    filter
                      ? styles.activeFilter
                      : ""
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div
            className={styles.filterGroup}
          >
            <span
              className={styles.filterLabel}
            >
              Experience
            </span>

            <div
              className={
                styles.filterButtons
              }
            >
              {(
                [
                  "All",
                  "Workshop",
                  "Course",
                  "Drop-in",
                ] as TypeFilter[]
              ).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setTypeFilter(filter)
                  }
                  className={`${
                    styles.filterButton
                  } ${
                    typeFilter === filter
                      ? styles.activeFilter
                      : ""
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div
          className={styles.resultsLine}
        >
          {!loading && !error && (
            <span>
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1
                ? "session"
                : "sessions"}{" "}
              found
            </span>
          )}
        </div>

        {/* EVENTS */}
        <section
          style={{
            order:
              getSectionOrder(
                "events"
              ),
          }}
          hidden={
            !isSectionVisible(
              "events"
            )
          }
          className={styles.eventsSection}
        >
          {loading ? (
            <div
              className={styles.loadingState}
            >
              <div
                className={
                  styles.loadingSpinner
                }
              />

              <p>
                Loading upcoming sessions...
              </p>
            </div>
          ) : error ? (
            <div
              className={styles.errorState}
            >
              <h2>
                Something went wrong.
              </h2>

              <p>{error}</p>

              <button
                type="button"
                onClick={() =>
                  void loadEvents()
                }
              >
                Try again
              </button>
            </div>
          ) : filteredEvents.length >
            0 ? (
            <div
              className={styles.eventsGrid}
            >
              {filteredEvents.map(
                (event) => (
                  <article
                    className={
                      styles.eventCard
                    }
                    key={event.id}
                  >
                    <div
                      className={
                        styles.eventImageWrapper
                      }
                    >
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className={
                            styles.eventImage
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

                      <span
                        className={
                          styles.categoryBadge
                        }
                      >
                        {event.category}
                      </span>

                      <span
                        className={
                          styles.typeBadge
                        }
                      >
                        {event.type}
                      </span>
                    </div>

                    <div
                      className={
                        styles.eventContent
                      }
                    >
                      <div
                        className={
                          styles.eventDateBlock
                        }
                      >
                        <span
                          className={
                            styles.eventDate
                          }
                        >
                          {formatEventDate(
                            event.startsAt
                          )}
                        </span>

                        <span
                          className={
                            styles.eventDay
                          }
                        >
                          {formatEventDay(
                            event.startsAt
                          )}
                        </span>
                      </div>

                      <div
                        className={
                          styles.eventMain
                        }
                      >
                        <h2>
                          {event.title}
                        </h2>

                        <div
                          className={
                            styles.eventMeta
                          }
                        >
                          <div>
                            <span>
                              Time
                            </span>

                            <strong>
                              {formatEventTime(
                                event.startsAt
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Duration
                            </span>

                            <strong>
                              {getDuration(
                                event.startsAt,
                                event.endsAt,
                                event.durationMinutes
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Price
                            </span>

                            <strong>
                              {formatPrice(
                                event.price
                              )}
                            </strong>
                          </div>
                        </div>

                        <div
                          className={
                            styles.eventBottom
                          }
                        >
                          <span
                            className={`${
                              styles.availability
                            } ${
                              event.availability ===
                              "Last places"
                                ? styles.lastPlaces
                                : event.availability ===
                                    "Filling up"
                                  ? styles.fillingUp
                                  : event.availability ===
                                      "Fully booked"
                                    ? styles.fullyBooked
                                    : ""
                            }`}
                          >
                            {
                              event.availability
                            }
                          </span>

                          <Link
                            href={
                              event.href
                            }
                            className={
                              styles.eventLink
                            }
                          >
                            View details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div
              className={styles.emptyState}
            >
              <h2>
                No sessions match those
                filters.
              </h2>

              <p>
                {events.length === 0
                  ? "There are no upcoming published sessions yet. Check back soon."
                  : "Try changing the material or experience type."}
              </p>

              {(categoryFilter !== "All" ||
                typeFilter !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter(
                      "All"
                    );

                    setTypeFilter("All");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>

        <div
          className={styles.sectionDivider}
        >
          <span></span>

          <span
            className={
              styles.dividerDiamond
            }
          >
            ◇
          </span>

          <span></span>
        </div>

        {/* PYOP */}
        <section
          style={{
            order:
              getSectionOrder(
                "pyop"
              ),
          }}
          hidden={
            !isSectionVisible(
              "pyop"
            )
          }
          className={styles.pyopSection}
        >
          <div
            className={styles.pyopContent}
          >
            <p className={styles.eyebrow}>
              Want something more flexible?
            </p>

            <h2>
              Paint Your Own Pottery.
            </h2>

            <p>
              Choose a piece, paint it your
              way and let us take care of the
              glazing and firing.
            </p>

            <Link
              href="/paint-your-own-pottery"
              className={
                styles.primaryButton
              }
            >
              Discover PYOP
            </Link>
          </div>

          <div
            className={
              styles.pyopImageWrapper
            }
          >
            <img
              src="/pick-a-piece/paint-pottery.png"
              alt="Painting pottery at Crafteris"
              className={styles.pyopImage}
            />
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            order:
              getSectionOrder(
                "final_cta"
              ),
          }}
          hidden={
            !isSectionVisible(
              "final_cta"
            )
          }
          className={styles.finalCta}
        >
          <div
            className={styles.finalInner}
          >
            <p className={styles.eyebrow}>
              Can&apos;t find the right date?
            </p>

            <h2>
              There are other ways to make.
            </h2>

            <p>
              Explore programmes, membership
              or private group experiences if
              you&apos;re looking for
              something different.
            </p>

            <div
              className={styles.finalActions}
            >
              <Link
                href="/programmes"
                className={
                  styles.primaryButton
                }
              >
                Explore programmes
              </Link>

              <Link
                href="/membership"
                className={
                  styles.secondaryLink
                }
              >
                View membership →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}