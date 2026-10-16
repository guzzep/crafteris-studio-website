"use client";

import {
  useEffect,
  useMemo,
  useRef,
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

  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const exploreButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (!exploreRef.current?.contains(event.target as Node)) setExploreOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  const [siteName, setSiteName] =
    useState("Crafteris");

  const [socials, setSocials] = useState({ facebook_url: "https://www.facebook.com/glassxpressionsmalta/", instagram_url: "https://www.instagram.com/glassxpressions/" });

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

      if (data) setSocials({ facebook_url: data.facebook_url || "https://www.facebook.com/glassxpressionsmalta/", instagram_url: data.instagram_url || "https://www.instagram.com/glassxpressions/" });

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
    setExploreOpen(false);
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
          id="main-navigation"
          aria-label="Main navigation"
          className={`${styles.nav} ${
            menuOpen
              ? styles.navOpen
              : ""
          }`}
        >
          <div className={styles.exploreDropdown} ref={exploreRef}
            onKeyDown={(event) => { if (event.key === "Escape") { setExploreOpen(false); exploreButton.current?.focus(); } }}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setExploreOpen(false); }}>
            <button type="button" className={styles.exploreToggle} ref={exploreButton}
              aria-expanded={exploreOpen} aria-controls="explore-links"
              onClick={() => setExploreOpen(current => !current)}>
              Explore <span aria-hidden="true">{exploreOpen ? "▴" : "▾"}</span>
            </button>
            <div id="explore-links" className={styles.exploreLinks} hidden={!exploreOpen}>
              <Link href="/explore" onClick={closeMenu}>Explore the studio</Link>
              <Link href="/paint-your-own-pottery" onClick={closeMenu}>Paint Your Own Pottery</Link>
              <Link href="/glass" onClick={closeMenu}>Glass</Link>
              <Link href="/pottery" onClick={closeMenu}>Pottery</Link>
              <Link href="/mosaic" onClick={closeMenu}>Mosaic</Link>
              <Link href="/team-building" onClick={closeMenu}>Team Building &amp; Groups</Link>
            </div>
          </div>

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
            Visit &amp; Contact
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
            aria-controls="main-navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}