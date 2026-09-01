import Link from "next/link";

import {
  CalendarDays,
  ChevronRight,
  GraduationCap,
  Mail,
  Paintbrush,
  ShoppingBag,
  BadgeCheck,
  Plus,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import styles from "./admin.module.css";

export default async function AdminPage() {
  const supabase = await createClient();

  const [
    workshopsResult,
    programmesResult,
    membershipsResult,
    productsResult,
    enquiriesResult,
    sessionsResult,
  ] = await Promise.all([
    supabase
      .from("workshops")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("programmes")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("membership_plans")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("products")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("contact_enquiries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("is_read", false),

    supabase
      .from("workshop_sessions")
      .select(
        `
          id,
          starts_at,
          capacity,
          booked_places,
          workshops (
            title
          )
        `
      )
      .eq("is_cancelled", false)
      .gte(
        "starts_at",
        new Date().toISOString()
      )
      .order("starts_at", {
        ascending: true,
      })
      .limit(5),
  ]);

  const stats = [
    {
      label: "Workshops",
      value: workshopsResult.count ?? 0,
      icon: Paintbrush,
      href: "/admin/workshops",
    },
    {
      label: "Programmes",
      value: programmesResult.count ?? 0,
      icon: GraduationCap,
      href: "/admin/programmes",
    },
    {
      label: "Membership plans",
      value: membershipsResult.count ?? 0,
      icon: BadgeCheck,
      href: "/admin/memberships",
    },
    {
      label: "Shop products",
      value: productsResult.count ?? 0,
      icon: ShoppingBag,
      href: "/admin/shop",
    },
  ];

  const upcomingSessions =
    sessionsResult.data ?? [];

  return (
    <div className={styles.page}>
      <section className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>
            OVERVIEW
          </p>

          <h1>Dashboard</h1>

          <p className={styles.intro}>
            Manage your website, experiences
            and studio content from one place.
          </p>
        </div>

        <Link
          href="/admin/workshops"
          className={styles.primaryButton}
        >
          <Plus size={17} />

          Manage workshops
        </Link>
      </section>

      <section className={styles.statsGrid}>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              href={stat.href}
              className={styles.statCard}
              key={stat.label}
            >
              <div
                className={styles.statIcon}
              >
                <Icon size={22} />
              </div>

              <div className={styles.statData}>
                <strong>
                  {stat.value}
                </strong>

                <span>{stat.label}</span>
              </div>

              <ChevronRight
                className={styles.statArrow}
                size={18}
              />
            </Link>
          );
        })}
      </section>

      <section className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.smallLabel}>
                SCHEDULE
              </p>

              <h2>
                Upcoming workshops
              </h2>
            </div>

            <Link href="/admin/whats-on">
              View all
            </Link>
          </div>

          {upcomingSessions.length ===
          0 ? (
            <div
              className={styles.emptyState}
            >
              <CalendarDays size={28} />

              <h3>
                No upcoming sessions
              </h3>

              <p>
                Workshop dates will appear
                here once you add them.
              </p>

              <Link href="/admin/workshops">
                Add workshop
              </Link>
            </div>
          ) : (
            <div
              className={
                styles.sessionList
              }
            >
              {upcomingSessions.map(
                (session) => {
                  const workshop =
                    Array.isArray(
                      session.workshops
                    )
                      ? session.workshops[0]
                      : session.workshops;

                  const startDate =
                    new Date(
                      session.starts_at
                    );

                  return (
                    <div
                      className={
                        styles.session
                      }
                      key={session.id}
                    >
                      <div
                        className={
                          styles.dateBox
                        }
                      >
                        <span>
                          {startDate.toLocaleString(
                            "en-GB",
                            {
                              month:
                                "short",
                            }
                          )}
                        </span>

                        <strong>
                          {startDate.getDate()}
                        </strong>
                      </div>

                      <div
                        className={
                          styles.sessionInfo
                        }
                      >
                        <strong>
                          {workshop?.title ??
                            "Workshop"}
                        </strong>

                        <span>
                          {startDate.toLocaleTimeString(
                            "en-GB",
                            {
                              hour: "2-digit",
                              minute:
                                "2-digit",
                            }
                          )}
                        </span>
                      </div>

                      <div
                        className={
                          styles.capacity
                        }
                      >
                        {session.booked_places}
                        /
                        {session.capacity}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        <div className={styles.sideColumn}>
          <div className={styles.panel}>
            <div
              className={
                styles.panelHeader
              }
            >
              <div>
                <p
                  className={
                    styles.smallLabel
                  }
                >
                  INBOX
                </p>

                <h2>Enquiries</h2>
              </div>

              <Mail size={20} />
            </div>

            <div
              className={
                styles.enquiryCount
              }
            >
              <strong>
                {enquiriesResult.count ??
                  0}
              </strong>

              <span>
                unread enquiries
              </span>
            </div>

            <Link
              href="/admin/enquiries"
              className={
                styles.secondaryButton
              }
            >
              Open enquiries

              <ChevronRight size={16} />
            </Link>
          </div>

          <div className={styles.panel}>
            <p
              className={
                styles.smallLabel
              }
            >
              QUICK ACTIONS
            </p>

            <h2>Manage studio</h2>

            <div
              className={
                styles.quickActions
              }
            >
              <Link href="/admin/workshops">
                Workshops
                <ChevronRight size={16} />
              </Link>

              <Link href="/admin/programmes">
                Programmes
                <ChevronRight size={16} />
              </Link>

              <Link href="/admin/memberships">
                Memberships
                <ChevronRight size={16} />
              </Link>

              <Link href="/admin/website-content">
                Website content
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}