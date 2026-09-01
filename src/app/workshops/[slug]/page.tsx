import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Euro,
  Sparkles,
  Users,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

import styles from "./workshop-detail.module.css";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Workshop = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  duration_minutes: number | null;
  level: string | null;
  base_price: number | null;
  status: "draft" | "published" | "archived";
};

type WorkshopSession = {
  id: string;
  starts_at: string;
  ends_at: string | null;
  capacity: number;
  booked_places: number;
  price: number | null;
  is_cancelled: boolean;
};

function formatDuration(minutes: number | null) {
  if (!minutes) {
    return "Ask us";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Malta",
  }).format(new Date(date));
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Malta",
  }).format(new Date(date));
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Malta",
  }).format(new Date(date));
}

function getAvailability(
  capacity: number,
  bookedPlaces: number
) {
  const remaining = capacity - bookedPlaces;

  if (remaining <= 0) {
    return {
      label: "Fully booked",
      className: styles.fullyBooked,
    };
  }

  if (remaining <= 2) {
    return {
      label: "Last places",
      className: styles.lastPlaces,
    };
  }

  if (
    capacity > 0 &&
    remaining <= Math.ceil(capacity / 2)
  ) {
    return {
      label: "Filling up",
      className: styles.fillingUp,
    };
  }

  return {
    label: "Available",
    className: styles.available,
  };
}

async function getWorkshop(slug: string) {
  const supabase = await createClient();

  const { data: workshop, error } =
    await supabase
      .from("workshops")
      .select(
        `
          id,
          title,
          slug,
          category,
          short_description,
          description,
          image_url,
          duration_minutes,
          level,
          base_price,
          status
        `
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

  if (error || !workshop) {
    return null;
  }

  const { data: sessions } = await supabase
    .from("workshop_sessions")
    .select(
      `
        id,
        starts_at,
        ends_at,
        capacity,
        booked_places,
        price,
        is_cancelled
      `
    )
    .eq("workshop_id", workshop.id)
    .eq("is_cancelled", false)
    .gte(
      "starts_at",
      new Date().toISOString()
    )
    .order("starts_at", {
      ascending: true,
    });

  return {
    workshop: workshop as Workshop,
    sessions:
      (sessions as WorkshopSession[]) ?? [],
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const result = await getWorkshop(slug);

  if (!result) {
    return {
      title: "Workshop | Crafteris",
    };
  }

  const { workshop } = result;

  return {
    title: `${workshop.title} | Crafteris`,
    description:
      workshop.short_description ||
      workshop.description ||
      `Discover ${workshop.title} at Crafteris.`,
  };
}

export default async function WorkshopPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const result = await getWorkshop(slug);

  if (!result) {
    notFound();
  }

  const { workshop, sessions } = result;

  return (
    <>
      <Header />

      <main className={styles.page}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <Link
              href="/workshops"
              className={styles.backLink}
            >
              <ArrowLeft size={16} />
              All workshops
            </Link>

            <p className={styles.eyebrow}>
              {workshop.category} workshop
            </p>

            <h1>{workshop.title}</h1>

            <p
              className={
                styles.heroDescription
              }
            >
              {workshop.short_description ||
                workshop.description ||
                "A hands-on creative workshop at Crafteris Studio."}
            </p>

            <div className={styles.heroDetails}>
              <div>
                <Clock size={18} />

                <span>
                  {formatDuration(
                    workshop.duration_minutes
                  )}
                </span>
              </div>

              <div>
                <Sparkles size={18} />

                <span>
                  {workshop.level ||
                    "All levels"}
                </span>
              </div>

              <div>
                <Euro size={18} />

                <span>
                  {formatPrice(
                    workshop.base_price
                  )}
                </span>
              </div>
            </div>

            {sessions.length > 0 ? (
              <a
                href="#sessions"
                className={
                  styles.primaryButton
                }
              >
                Choose a session
              </a>
            ) : (
              <Link
                href="/contact"
                className={
                  styles.primaryButton
                }
              >
                Ask about this workshop
              </Link>
            )}
          </div>

          <div
            className={
              styles.heroImageWrapper
            }
          >
            {workshop.image_url ? (
              <img
                src={workshop.image_url}
                alt={workshop.title}
                className={
                  styles.heroImage
                }
              />
            ) : (
              <div
                className={
                  styles.heroPlaceholder
                }
              >
                <span>Crafteris</span>
              </div>
            )}
          </div>
        </section>

        {/* DESCRIPTION */}
        <section
          className={styles.aboutSection}
        >
          <div
            className={
              styles.aboutHeading
            }
          >
            <p className={styles.eyebrow}>
              The experience
            </p>

            <h2>
              Make something worth keeping.
            </h2>
          </div>

          <div
            className={styles.aboutContent}
          >
            <p>
              {workshop.description ||
                workshop.short_description ||
                "Join us for a relaxed creative session with guidance throughout the experience."}
            </p>
          </div>
        </section>

        <div
          className={styles.sectionDivider}
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

        {/* SESSION LIST */}
        <section
          className={styles.sessionsSection}
          id="sessions"
        >
          <div
            className={
              styles.sectionHeading
            }
          >
            <p className={styles.eyebrow}>
              Upcoming dates
            </p>

            <h2>
              Choose when you&apos;d like to
              make.
            </h2>

            <p>
              Select an upcoming session that
              works for you.
            </p>
          </div>

          {sessions.length === 0 ? (
            <div
              className={
                styles.noSessions
              }
            >
              <CalendarDays size={32} />

              <h3>
                No upcoming dates just yet.
              </h3>

              <p>
                Contact the studio if
                you&apos;d like to ask about
                the next available date or a
                private session.
              </p>

              <Link
                href="/contact"
                className={
                  styles.primaryButton
                }
              >
                Contact us
              </Link>
            </div>
          ) : (
            <div
              className={styles.sessionsList}
            >
              {sessions.map((session) => {
                const availability =
                  getAvailability(
                    session.capacity,
                    session.booked_places
                  );

                const remaining =
                  session.capacity -
                  session.booked_places;

                const price =
                  session.price ??
                  workshop.base_price;

                return (
                  <article
                    className={
                      styles.sessionCard
                    }
                    key={session.id}
                  >
                    <div
                      className={
                        styles.sessionDate
                      }
                    >
                      <span>
                        {formatShortDate(
                          session.starts_at
                        )}
                      </span>

                      <strong>
                        {formatDate(
                          session.starts_at
                        )}
                      </strong>
                    </div>

                    <div
                      className={
                        styles.sessionInformation
                      }
                    >
                      <div
                        className={
                          styles.sessionMeta
                        }
                      >
                        <div>
                          <Clock
                            size={16}
                          />

                          <span>
                            {formatTime(
                              session.starts_at
                            )}

                            {session.ends_at &&
                              ` – ${formatTime(
                                session.ends_at
                              )}`}
                          </span>
                        </div>

                        <div>
                          <Users
                            size={16}
                          />

                          <span>
                            {remaining > 0
                              ? `${remaining} ${
                                  remaining ===
                                  1
                                    ? "place"
                                    : "places"
                                } left`
                              : "No places left"}
                          </span>
                        </div>

                        <div>
                          <Euro
                            size={16}
                          />

                          <span>
                            {formatPrice(
                              price
                            )}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`${styles.availability} ${availability.className}`}
                      >
                        {
                          availability.label
                        }
                      </span>
                    </div>

                    {remaining > 0 ? (
                      <Link
                        href="/contact"
                        className={
                          styles.sessionButton
                        }
                      >
                        Enquire
                      </Link>
                    ) : (
                      <span
                        className={
                          styles.disabledButton
                        }
                      >
                        Fully booked
                      </span>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* INFO */}
        <section
          className={styles.infoSection}
        >
          <div className={styles.infoCard}>
            <span>01</span>

            <h3>
              Everything is prepared
            </h3>

            <p>
              Tools, materials and guidance
              are ready when you arrive.
            </p>
          </div>

          <div className={styles.infoCard}>
            <span>02</span>

            <h3>
              Beginner friendly
            </h3>

            <p>
              You don&apos;t need previous
              experience unless the workshop
              says otherwise.
            </p>
          </div>

          <div className={styles.infoCard}>
            <span>03</span>

            <h3>
              Create something real
            </h3>

            <p>
              Enjoy the process and make a
              piece that feels completely
              yours.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.finalCta}>
          <div
            className={styles.finalInner}
          >
            <p className={styles.eyebrow}>
              Looking for something else?
            </p>

            <h2>
              Explore more ways to make.
            </h2>

            <p>
              Discover other pottery and
              glass workshops, upcoming
              sessions and creative
              programmes.
            </p>

            <div
              className={
                styles.finalActions
              }
            >
              <Link
                href="/workshops"
                className={
                  styles.primaryButton
                }
              >
                All workshops
              </Link>

              <Link
                href="/whats-on"
                className={
                  styles.secondaryLink
                }
              >
                See what&apos;s on →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}