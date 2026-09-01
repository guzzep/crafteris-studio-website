import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Euro,
  Layers3,
  Sparkles,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { createClient } from "@/lib/supabase/server";

import styles from "./programme-detail.module.css";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Programme = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  number_of_sessions: number | null;
  session_duration_minutes: number | null;
  level: string | null;
  base_price: number | null;
  status: "draft" | "published" | "archived";
};

type ProgrammeSession = {
  id: string;
  programme_id: string;
  starts_at: string;
  ends_at: string | null;
  session_number: number | null;
};

function formatPrice(price: number | null) {
  if (price === null) {
    return "Ask us";
  }

  return `€${Number(price).toFixed(2)}`;
}

function formatDuration(minutes: number | null) {
  if (!minutes) {
    return "Flexible";
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

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Malta",
    }
  ).format(new Date(date));
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Malta",
    }
  ).format(new Date(date));
}

async function getProgramme(slug: string) {
  const supabase = await createClient();

  const {
    data: programme,
    error: programmeError,
  } = await supabase
    .from("programmes")
    .select(
      `
        id,
        title,
        slug,
        category,
        short_description,
        description,
        image_url,
        number_of_sessions,
        session_duration_minutes,
        level,
        base_price,
        status
      `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (programmeError || !programme) {
    return null;
  }

  const {
    data: sessions,
    error: sessionError,
  } = await supabase
    .from("programme_sessions")
    .select(
      `
        id,
        programme_id,
        starts_at,
        ends_at,
        session_number
      `
    )
    .eq("programme_id", programme.id)
    .order("session_number", {
      ascending: true,
    })
    .order("starts_at", {
      ascending: true,
    });

  return {
    programme: programme as Programme,

    sessions: sessionError
      ? []
      : ((sessions as ProgrammeSession[]) ??
        []),
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const result =
    await getProgramme(slug);

  if (!result) {
    return {
      title: "Programme | Crafteris",
    };
  }

  return {
    title: `${result.programme.title} | Crafteris`,

    description:
      result.programme
        .short_description ||
      result.programme.description ||
      `Discover ${result.programme.title} at Crafteris Studio.`,
  };
}

export default async function ProgrammePage({
  params,
}: PageProps) {
  const { slug } = await params;

  const result =
    await getProgramme(slug);

  if (!result) {
    notFound();
  }

  const {
    programme,
    sessions,
  } = result;

  return (
    <>
      <Header />

      <main className={styles.page}>
        {/* HERO */}
        <section className={styles.hero}>
          <div
            className={styles.heroContent}
          >
            <Link
              href="/programmes"
              className={styles.backLink}
            >
              <ArrowLeft size={16} />
              All programmes
            </Link>

            <p className={styles.eyebrow}>
              {programme.category} programme
            </p>

            <h1>{programme.title}</h1>

            <p
              className={
                styles.heroDescription
              }
            >
              {programme.short_description ||
                programme.description ||
                "A guided creative programme at Crafteris Studio."}
            </p>

            <div
              className={styles.heroMeta}
            >
              <span>
                <Layers3 size={17} />

                {programme.number_of_sessions
                  ? `${programme.number_of_sessions} sessions`
                  : "Multiple sessions"}
              </span>

              <span>
                <Clock size={17} />

                {formatDuration(
                  programme.session_duration_minutes
                )}{" "}
                each
              </span>

              <span>
                <Sparkles size={17} />

                {programme.level ||
                  "All levels"}
              </span>

              <span>
                <Euro size={17} />

                {formatPrice(
                  programme.base_price
                )}
              </span>
            </div>

            {sessions.length > 0 ? (
              <a
                href="#schedule"
                className={
                  styles.primaryButton
                }
              >
                View programme dates
                <ArrowRight size={16} />
              </a>
            ) : (
              <Link
                href="/contact"
                className={
                  styles.primaryButton
                }
              >
                Ask about this programme
              </Link>
            )}
          </div>

          <div
            className={
              styles.heroImageWrapper
            }
          >
            {programme.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={programme.image_url}
                alt={programme.title}
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
                Crafteris
              </div>
            )}
          </div>
        </section>

        {/* ABOUT */}
        <section className={styles.about}>
          <div
            className={
              styles.aboutHeading
            }
          >
            <p className={styles.eyebrow}>
              THE PROGRAMME
            </p>

            <h2>
              Learn through making.
            </h2>
          </div>

          <div
            className={
              styles.aboutContent
            }
          >
            <p>
              {programme.description ||
                programme.short_description ||
                "Develop your creative skills through a structured series of guided studio sessions."}
            </p>
          </div>
        </section>

        <div className={styles.divider}>
          <span />
          <span>◇</span>
          <span />
        </div>

        {/* SCHEDULE */}
        <section
          className={styles.scheduleSection}
          id="schedule"
        >
          <div
            className={
              styles.sectionHeading
            }
          >
            <p className={styles.eyebrow}>
              PROGRAMME SCHEDULE
            </p>

            <h2>
              Your sessions.
            </h2>

            <p>
              These are the dates currently
              scheduled for this programme.
            </p>
          </div>

          {sessions.length === 0 ? (
            <div
              className={styles.emptySchedule}
            >
              <CalendarDays size={32} />

              <h3>
                Dates are coming soon.
              </h3>

              <p>
                Contact the studio if you
                would like to know when the
                next programme starts.
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
              className={styles.scheduleList}
            >
              {sessions.map((session) => (
                <article
                  className={
                    styles.scheduleCard
                  }
                  key={session.id}
                >
                  <div
                    className={
                      styles.sessionNumber
                    }
                  >
                    <span>Session</span>

                    <strong>
                      {session.session_number ??
                        "—"}
                    </strong>
                  </div>

                  <div
                    className={
                      styles.sessionInfo
                    }
                  >
                    <h3>
                      {formatDate(
                        session.starts_at
                      )}
                    </h3>

                    <span>
                      <Clock size={15} />

                      {formatTime(
                        session.starts_at
                      )}

                      {session.ends_at &&
                        ` – ${formatTime(
                          session.ends_at
                        )}`}
                    </span>
                  </div>
                </article>
              ))}
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
              Learn progressively
            </h3>

            <p>
              Each session builds on what
              you learned previously.
            </p>
          </div>

          <div className={styles.infoCard}>
            <span>02</span>

            <h3>
              Guided studio time
            </h3>

            <p>
              Receive hands-on guidance
              while developing your own
              creative direction.
            </p>
          </div>

          <div className={styles.infoCard}>
            <span>03</span>

            <h3>
              Make more ambitious work
            </h3>

            <p>
              More studio time means more
              space to experiment, practise
              and refine your work.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.finalCta}>
          <div
            className={styles.finalInner}
          >
            <p className={styles.eyebrow}>
              NEXT STEP
            </p>

            <h2>
              Ready to continue your
              creative journey?
            </h2>

            <p>
              Browse the studio calendar to
              see upcoming programmes and
              workshops.
            </p>

            <Link
              href="/whats-on"
              className={
                styles.primaryButton
              }
            >
              See what&apos;s on
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}