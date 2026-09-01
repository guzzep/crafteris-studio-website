"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Loader2,
  Search,
  Users,
  XCircle,
} from "lucide-react";

import {
  createClient,
} from "@/lib/supabase/client";

import styles from "./whats-on.module.css";

type Workshop = {
  id: string;
  title: string;
  status: string;
};

type Programme = {
  id: string;
  title: string;
  status: string;
};

type WorkshopSession = {
  id: string;
  workshop_id: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  booked_places: number;
  price: number | null;
  is_cancelled: boolean;
};

type ProgrammeSession = {
  id: string;
  programme_id: string;
  starts_at: string;
  ends_at: string;
  session_number: number | null;
};

type ScheduleItem = {
  id: string;
  parentId: string;
  type: "workshop" | "programme";
  title: string;
  startsAt: string;
  endsAt: string;
  capacity: number | null;
  bookedPlaces: number | null;
  price: number | null;
  isCancelled: boolean;
  sessionNumber: number | null;
};

type TypeFilter =
  | "all"
  | "workshop"
  | "programme";

type DateFilter =
  | "upcoming"
  | "past"
  | "all";

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone:
        "Europe/Malta",
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(
    new Date(value)
  );
}

function formatTime(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone:
        "Europe/Malta",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  ).format(
    new Date(value)
  );
}

function formatPrice(
  value: number | null
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  return new Intl.NumberFormat(
    "en-MT",
    {
      style: "currency",
      currency: "EUR",
    }
  ).format(value);
}

export default function WhatsOnAdminPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [
    items,
    setItems,
  ] = useState<
    ScheduleItem[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    typeFilter,
    setTypeFilter,
  ] =
    useState<TypeFilter>(
      "all"
    );

  const [
    dateFilter,
    setDateFilter,
  ] =
    useState<DateFilter>(
      "upcoming"
    );

  useEffect(() => {
    let active = true;

    async function loadSchedule() {
      setLoading(true);
      setError("");

      const [
        workshopsResult,
        workshopSessionsResult,
        programmesResult,
        programmeSessionsResult,
      ] = await Promise.all([
        supabase
          .from("workshops")
          .select(
            "id, title, status"
          ),

        supabase
          .from(
            "workshop_sessions"
          )
          .select(
            `
              id,
              workshop_id,
              starts_at,
              ends_at,
              capacity,
              booked_places,
              price,
              is_cancelled
            `
          ),

        supabase
          .from("programmes")
          .select(
            "id, title, status"
          ),

        supabase
          .from(
            "programme_sessions"
          )
          .select(
            `
              id,
              programme_id,
              starts_at,
              ends_at,
              session_number
            `
          ),
      ]);

      if (!active) {
        return;
      }

      const firstError =
        workshopsResult.error ||
        workshopSessionsResult.error ||
        programmesResult.error ||
        programmeSessionsResult.error;

      if (firstError) {
        console.error(
          "Could not load What's On:",
          firstError.message
        );

        setError(
          "Could not load the studio schedule."
        );

        setLoading(false);

        return;
      }

      const workshops =
        (workshopsResult.data ??
          []) as Workshop[];

      const workshopSessions =
        (workshopSessionsResult.data ??
          []) as WorkshopSession[];

      const programmes =
        (programmesResult.data ??
          []) as Programme[];

      const programmeSessions =
        (programmeSessionsResult.data ??
          []) as ProgrammeSession[];

      const workshopMap =
        new Map(
          workshops.map(
            (workshop) => [
              workshop.id,
              workshop,
            ]
          )
        );

      const programmeMap =
        new Map(
          programmes.map(
            (programme) => [
              programme.id,
              programme,
            ]
          )
        );

      const combined: ScheduleItem[] =
        [];

      for (
        const session of workshopSessions
      ) {
        const workshop =
          workshopMap.get(
            session.workshop_id
          );

        if (!workshop) {
          continue;
        }

        combined.push({
          id: session.id,
          parentId:
            session.workshop_id,
          type: "workshop",
          title:
            workshop.title,
          startsAt:
            session.starts_at,
          endsAt:
            session.ends_at,
          capacity:
            session.capacity,
          bookedPlaces:
            session.booked_places,
          price:
            session.price,
          isCancelled:
            session.is_cancelled,
          sessionNumber: null,
        });
      }

      for (
        const session of programmeSessions
      ) {
        const programme =
          programmeMap.get(
            session.programme_id
          );

        if (!programme) {
          continue;
        }

        combined.push({
          id: session.id,
          parentId:
            session.programme_id,
          type: "programme",
          title:
            programme.title,
          startsAt:
            session.starts_at,
          endsAt:
            session.ends_at,
          capacity: null,
          bookedPlaces: null,
          price: null,
          isCancelled: false,
          sessionNumber:
            session.session_number,
        });
      }

      combined.sort(
        (a, b) =>
          new Date(
            a.startsAt
          ).getTime() -
          new Date(
            b.startsAt
          ).getTime()
      );

      setItems(combined);
      setLoading(false);
    }

    void loadSchedule();

    return () => {
      active = false;
    };
  }, [supabase]);

  const now = Date.now();

  const filteredItems =
    items.filter(
      (item) => {
        const startsAt =
          new Date(
            item.startsAt
          ).getTime();

        const matchesType =
          typeFilter ===
            "all" ||
          item.type ===
            typeFilter;

        const matchesDate =
          dateFilter ===
            "all" ||
          (dateFilter ===
            "upcoming" &&
            startsAt >= now) ||
          (dateFilter ===
            "past" &&
            startsAt < now);

        const matchesSearch =
          item.title
            .toLowerCase()
            .includes(
              search
                .trim()
                .toLowerCase()
            );

        return (
          matchesType &&
          matchesDate &&
          matchesSearch
        );
      }
    );

  const upcomingCount =
    items.filter(
      (item) =>
        new Date(
          item.startsAt
        ).getTime() >= now
    ).length;

  const workshopCount =
    items.filter(
      (item) =>
        item.type ===
          "workshop" &&
        new Date(
          item.startsAt
        ).getTime() >= now
    ).length;

  const programmeCount =
    items.filter(
      (item) =>
        item.type ===
          "programme" &&
        new Date(
          item.startsAt
        ).getTime() >= now
    ).length;

  const cancelledCount =
    items.filter(
      (item) =>
        item.type ===
          "workshop" &&
        item.isCancelled &&
        new Date(
          item.startsAt
        ).getTime() >= now
    ).length;

  return (
    <div
      className={
        styles.page
      }
    >
      <div
        className={
          styles.pageHeader
        }
      >
        <div>
          <p
            className={
              styles.eyebrow
            }
          >
            STUDIO SCHEDULE
          </p>

          <h1>
            What&apos;s On
          </h1>

          <p
            className={
              styles.pageDescription
            }
          >
            View workshop
            and programme
            sessions in one
            place.
          </p>
        </div>
      </div>

      <div
        className={
          styles.statsGrid
        }
      >
        <div
          className={
            styles.statCard
          }
        >
          <div
            className={
              styles.statIcon
            }
          >
            <CalendarDays
              size={20}
            />
          </div>

          <div>
            <span>
              Upcoming
            </span>

            <strong>
              {upcomingCount}
            </strong>
          </div>
        </div>

        <div
          className={
            styles.statCard
          }
        >
          <div
            className={
              styles.statIcon
            }
          >
            <Clock3
              size={20}
            />
          </div>

          <div>
            <span>
              Workshops
            </span>

            <strong>
              {workshopCount}
            </strong>
          </div>
        </div>

        <div
          className={
            styles.statCard
          }
        >
          <div
            className={
              styles.statIcon
            }
          >
            <Users
              size={20}
            />
          </div>

          <div>
            <span>
              Programme
              sessions
            </span>

            <strong>
              {programmeCount}
            </strong>
          </div>
        </div>

        <div
          className={
            styles.statCard
          }
        >
          <div
            className={
              styles.statIcon
            }
          >
            <XCircle
              size={20}
            />
          </div>

          <div>
            <span>
              Cancelled
            </span>

            <strong>
              {cancelledCount}
            </strong>
          </div>
        </div>
      </div>

      <section
        className={
          styles.scheduleCard
        }
      >
        <div
          className={
            styles.toolbar
          }
        >
          <div
            className={
              styles.searchBox
            }
          >
            <Search
              size={17}
            />

            <input
              type="search"
              placeholder="Search sessions..."
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
            />
          </div>

          <div
            className={
              styles.filters
            }
          >
            <select
              value={
                typeFilter
              }
              onChange={(
                event
              ) =>
                setTypeFilter(
                  event.target
                    .value as TypeFilter
                )
              }
            >
              <option value="all">
                All types
              </option>

              <option value="workshop">
                Workshops
              </option>

              <option value="programme">
                Programmes
              </option>
            </select>

            <select
              value={
                dateFilter
              }
              onChange={(
                event
              ) =>
                setDateFilter(
                  event.target
                    .value as DateFilter
                )
              }
            >
              <option value="upcoming">
                Upcoming
              </option>

              <option value="past">
                Past
              </option>

              <option value="all">
                All dates
              </option>
            </select>
          </div>
        </div>

        {loading && (
          <div
            className={
              styles.stateBox
            }
          >
            <Loader2
              size={22}
              className={
                styles.spin
              }
            />

            <p>
              Loading
              schedule...
            </p>
          </div>
        )}

        {!loading &&
          error && (
            <div
              className={
                styles.errorBox
              }
            >
              {error}
            </div>
          )}

        {!loading &&
          !error &&
          filteredItems
            .length === 0 && (
            <div
              className={
                styles.stateBox
              }
            >
              <CalendarDays
                size={26}
              />

              <strong>
                No sessions
                found
              </strong>

              <p>
                Try changing
                the filters or
                add a session
                to a workshop
                or programme.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          filteredItems
            .length > 0 && (
            <div
              className={
                styles.scheduleList
              }
            >
              {filteredItems.map(
                (item) => {
                  const isPast =
                    new Date(
                      item.startsAt
                    ).getTime() <
                    now;

                  const parentUrl =
                    item.type ===
                    "workshop"
                      ? `/admin/workshops/${item.parentId}`
                      : `/admin/programmes/${item.parentId}`;

                  return (
                    <article
                      key={`${item.type}-${item.id}`}
                      className={`${styles.sessionCard} ${
                        item.isCancelled
                          ? styles.cancelled
                          : ""
                      } ${
                        isPast
                          ? styles.past
                          : ""
                      }`}
                    >
                      <div
                        className={
                          styles.dateBlock
                        }
                      >
                        <strong>
                          {formatDate(
                            item.startsAt
                          )}
                        </strong>

                        <span>
                          {formatTime(
                            item.startsAt
                          )}
                          {" – "}
                          {formatTime(
                            item.endsAt
                          )}
                        </span>
                      </div>

                      <div
                        className={
                          styles.sessionMain
                        }
                      >
                        <div
                          className={
                            styles.sessionTop
                          }
                        >
                          <div>
                            <div
                              className={
                                styles.badges
                              }
                            >
                              <span
                                className={
                                  item.type ===
                                  "workshop"
                                    ? styles.workshopBadge
                                    : styles.programmeBadge
                                }
                              >
                                {item.type ===
                                "workshop"
                                  ? "Workshop"
                                  : "Programme"}
                              </span>

                              {item.isCancelled && (
                                <span
                                  className={
                                    styles.cancelledBadge
                                  }
                                >
                                  Cancelled
                                </span>
                              )}

                              {isPast &&
                                !item.isCancelled && (
                                  <span
                                    className={
                                      styles.pastBadge
                                    }
                                  >
                                    Past
                                  </span>
                                )}
                            </div>

                            <h2>
                              {
                                item.title
                              }
                            </h2>

                            {item.type ===
                              "programme" &&
                              item.sessionNumber !==
                                null && (
                                <p
                                  className={
                                    styles.sessionNumber
                                  }
                                >
                                  Session{" "}
                                  {
                                    item.sessionNumber
                                  }
                                </p>
                              )}
                          </div>

                          <Link
                            href={
                              parentUrl
                            }
                            className={
                              styles.manageLink
                            }
                          >
                            Manage
                            <ArrowRight
                              size={
                                16
                              }
                            />
                          </Link>
                        </div>

                        {item.type ===
                          "workshop" && (
                          <div
                            className={
                              styles.metaRow
                            }
                          >
                            <div>
                              <span>
                                Booked
                              </span>

                              <strong>
                                {item.bookedPlaces ??
                                  0}
                                {" / "}
                                {item.capacity ??
                                  0}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Available
                              </span>

                              <strong>
                                {Math.max(
                                  (item.capacity ??
                                    0) -
                                    (item.bookedPlaces ??
                                      0),
                                  0
                                )}
                              </strong>
                            </div>

                            {formatPrice(
                              item.price
                            ) && (
                              <div>
                                <span>
                                  Price
                                </span>

                                <strong>
                                  {formatPrice(
                                    item.price
                                  )}
                                </strong>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
      </section>
    </div>
  );
}