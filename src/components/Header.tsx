"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

import styles from "./Header.module.css";

export default function Header() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [siteName, setSiteName] =
    useState("Crafteris");

  useEffect(() => {
    let active = true;

    async function loadSiteName() {
      const {
        data,
        error,
      } = await supabase
        .from("site_settings")
        .select("site_name")
        .limit(1)
        .maybeSingle();

      if (!active) {
        return;
      }

      if (error) {
        console.error(
          "Could not load site name:",
          error.message
        );

        return;
      }

      if (
        data?.site_name &&
        data.site_name.trim()
      ) {
        setSiteName(
          data.site_name.trim()
        );
      }
    }

    void loadSiteName();

    return () => {
      active = false;
    };
  }, [supabase]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link
          href="/"
          className={styles.logo}
          onClick={closeMenu}
        >
          {siteName}
        </Link>

        <nav
          className={`${styles.nav} ${
            menuOpen
              ? styles.navOpen
              : ""
          }`}
        >
          <Link
            href="/explore"
            onClick={closeMenu}
          >
            Explore
          </Link>

          <Link
            href="/workshops"
            onClick={closeMenu}
          >
            Workshops
          </Link>

          <Link
            href="/programmes"
            onClick={closeMenu}
          >
            Programmes / Courses
          </Link>

          <Link
            href="/paint-your-own-pottery"
            onClick={closeMenu}
          >
            Paint Your Own Pottery
          </Link>

          <Link
            href="/membership"
            onClick={closeMenu}
          >
            Membership
          </Link>

          <Link
            href="/shop"
            onClick={closeMenu}
          >
            Shop
          </Link>

          <Link
            href="/visit"
            onClick={closeMenu}
          >
            Visit
          </Link>
        </nav>

        <div className={styles.headerActions}>
          <Link
            href="/whats-on"
            className={styles.bookNow}
            onClick={closeMenu}
          >
            Book Now
          </Link>

          <button
            type="button"
            className={styles.menuButton}
            onClick={() =>
              setMenuOpen(
                (current) =>
                  !current
              )
            }
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}