"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Link2,
  Mail,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";

import {
  createClient,
} from "@/lib/supabase/client";

import CookieBanner from "./CookieBanner";

import styles from "./Footer.module.css";

type SiteSettings = {
  site_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
};

const fallbackSettings: SiteSettings = {
  site_name: "Crafteris",
  email: null,
  phone: null,
  address: null,
  instagram_url: null,
  facebook_url: null,
};

export default function Footer() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [
    settings,
    setSettings,
  ] = useState<SiteSettings>(
    fallbackSettings
  );

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      const {
        data,
        error,
      } = await supabase
        .from("site_settings")
        .select(
          `
            site_name,
            email,
            phone,
            address,
            instagram_url,
            facebook_url
          `
        )
        .limit(1)
        .maybeSingle();

      if (!active) {
        return;
      }

      if (error) {
        console.error(
          "Could not load footer settings:",
          error.message
        );

        return;
      }

      if (data) {
        setSettings(
          data as SiteSettings
        );
      }
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, [supabase]);

  const siteName =
    settings.site_name ||
    "Crafteris";

  const email =
    settings.email || "";

  const phone =
    settings.phone || "";

  const address =
    settings.address || "";

  const instagram =
    settings.instagram_url || "";

  const facebook =
    settings.facebook_url || "";

  return (
    <>
      <footer
        className={
          styles.footer
        }
      >
        <div
          className={
            styles.footerInner
          }
        >
          <div
            className={
              styles.footerBrand
            }
          >
            <h2>
              {siteName}
            </h2>

            <p>
              Pottery, glass and
              creative experiences
              in Malta.
            </p>

            {(email ||
              phone ||
              address) && (
              <div
                className={
                  styles.contactDetails
                }
              >
                {email && (
                  <a
                    href={`mailto:${email}`}
                  >
                    <Mail
                      size={15}
                    />

                    <span>
                      {email}
                    </span>
                  </a>
                )}

                {phone && (
                  <a
                    href={`tel:${phone.replace(
                      /\s+/g,
                      ""
                    )}`}
                  >
                    <Phone
                      size={15}
                    />

                    <span>
                      {phone}
                    </span>
                  </a>
                )}

                {address && (
                  <div>
                    <MapPin
                      size={15}
                    />

                    <span>
                      {address}
                    </span>
                  </div>
                )}
              </div>
            )}

            {(instagram ||
              facebook) && (
              <div
                className={
                  styles.socialLinks
                }
              >
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                  >
                    <Share2
                      size={18}
                    />
                  </a>
                )}

                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    title="Facebook"
                  >
                    <Link2
                      size={18}
                    />
                  </a>
                )}
              </div>
            )}
          </div>

          <div
            className={
              styles.footerColumn
            }
          >
            <h3>
              Explore
            </h3>

            <Link href="/explore">
              Explore
            </Link>

            <Link href="/workshops">
              Workshops
            </Link>

            <Link href="/programmes">
              Programmes / Courses
            </Link>

            <Link href="/paint-your-own-pottery">
              Paint Your Own Pottery
            </Link>

            <Link href="/membership">
              Membership
            </Link>

            <Link href="/shop">
              Shop
            </Link>

            <Link href="/team-building">
              Team Building
            </Link>

            <Link href="/visit">
              Visit
            </Link>
          </div>

          <div
            className={
              styles.footerColumn
            }
          >
            <h3>
              Help
            </h3>

            <Link href="/about">
              About
            </Link>

            <Link href="/gallery">
              Gallery
            </Link>

            <Link href="/gift-vouchers">
              Gift Vouchers
            </Link>

            <Link href="/faqs">
              FAQs
            </Link>

            <Link href="/contact">
              Contact
            </Link>

            <Link href="/accessibility">
              Accessibility
            </Link>

            <Link href="/policies">
              Policies
            </Link>
          </div>

          <div
            className={
              styles.footerColumn
            }
          >
            <h3>
              Account
            </h3>

            <Link href="/member-login">
              Member Login
            </Link>

            <Link href="/manage-booking">
              Manage Booking
            </Link>

            <div
              className={
                styles.adminLinkWrapper
              }
            >
              <Link
                href="/admin"
                className={
                  styles.adminLink
                }
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>

        <div
          className={
            styles.footerBottom
          }
        >
          <p>
            © 2026 {siteName}. All
            rights reserved.
          </p>

          <div
            className={
              styles.footerLegal
            }
          >
            <Link href="/privacy">
              Privacy
            </Link>

            <span>|</span>

            <Link href="/booking-terms">
              Booking Terms
            </Link>

            <span>|</span>

            <Link href="/cancellation-refunds">
              Cancellation &amp; Refunds
            </Link>

            <span>|</span>

            <Link href="/membership-terms">
              Membership Terms
            </Link>

            <span>|</span>

            <Link href="/cookies">
              Cookie Policy
            </Link>

            <span>|</span>

            <Link href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </>
  );
}