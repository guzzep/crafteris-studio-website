"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  LayoutDashboard,
  PanelsTopLeft,
  CalendarDays,
  Paintbrush,
  GraduationCap,
  BadgeCheck,
  ShoppingBag,
  Gift,
  Mail,
  Images,
  Settings,
  UserRound,
  X,
  ExternalLink,
} from "lucide-react";

import styles from "./AdminSidebar.module.css";

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Website Content",
    href: "/admin/website-content",
    icon: PanelsTopLeft,
  },
  {
    label: "What's On",
    href: "/admin/whats-on",
    icon: CalendarDays,
  },
  {
    label: "Workshops",
    href: "/admin/workshops",
    icon: Paintbrush,
  },
  {
    label: "Programmes",
    href: "/admin/programmes",
    icon: GraduationCap,
  },
  {
    label: "Memberships",
    href: "/admin/memberships",
    icon: BadgeCheck,
  },
  {
    label: "Shop",
    href: "/admin/shop",
    icon: ShoppingBag,
  },
  {
    label: "Gift Vouchers",
    href: "/admin/gift-vouchers",
    icon: Gift,
  },
  {
    label: "Enquiries",
    href: "/admin/enquiries",
    icon: Mail,
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: Images,
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: UserRound,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  open,
  onClose,
}: AdminSidebarProps) {
  const pathname =
    usePathname();

  function isActive(
    href: string
  ) {
    if (
      href === "/admin"
    ) {
      return (
        pathname === "/admin"
      );
    }

    return pathname.startsWith(
      href
    );
  }

  return (
    <aside
      className={`${styles.sidebar} ${
        open
          ? styles.open
          : ""
      }`}
    >
      <div
        className={styles.top}
      >
        <div
          className={
            styles.brand
          }
        >
          <div>
            <Link href="/admin">
              Crafteris
            </Link>

            <span>
              Studio Management
            </span>
          </div>

          <button
            className={
              styles.closeButton
            }
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={21} />
          </button>
        </div>

        <nav
          className={
            styles.navigation
          }
        >
          {navigation.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  onClick={
                    onClose
                  }
                  className={`${styles.navItem} ${
                    isActive(
                      item.href
                    )
                      ? styles.active
                      : ""
                  }`}
                >
                  <Icon
                    size={19}
                  />

                  <span>
                    {item.label}
                  </span>
                </Link>
              );
            }
          )}
        </nav>
      </div>

      <div
        className={
          styles.bottom
        }
      >
        <Link
          href="/"
          target="_blank"
          className={
            styles.viewWebsite
          }
        >
          <span>
            View website
          </span>

          <ExternalLink
            size={17}
          />
        </Link>

        <p>
          Crafteris Studio
          <br />
          Admin Panel
        </p>
      </div>
    </aside>
  );
}