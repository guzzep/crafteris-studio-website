"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { Facebook, Instagram } from "./SocialIcons";

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

  const [socials, setSocials] = useState({ facebook_url: "https://www.facebook.com/glassxpressionsmalta/", instagram_url: "" });

  useEffect(() => {
    let active = true;

    async function loadSiteName() {
      const {
        data,
        error,
      } = await supabase
        .from("site_settings")
        .select("site_name, facebook_url, instagram_url")
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

      if (data) setSocials({ facebook_url: data.facebook_url || "https://www.facebook.com/glassxpressionsmalta/", instagram_url: data.instagram_url || "" });

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
          <span>{siteName}</span>
          <span className={styles.brandTagline}>Home of GlassXpressions</span>
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
            Courses
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
          <div className={styles.socialLinks}>
            {socials.facebook_url && /^https?:\/\//i.test(socials.facebook_url) && <a href={socials.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Crafteris on Facebook"><Facebook size={20} /></a>}
            {socials.instagram_url && /^https?:\/\//i.test(socials.instagram_url) && <a href={socials.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Crafteris on Instagram"><Instagram size={20} /></a>}
          </div>
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