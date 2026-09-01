"use client";

import {
  LogOut,
  Menu,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import styles from "./AdminHeader.module.css";

type AdminHeaderProps = {
  adminName: string;
  adminEmail: string;
  onMenuClick: () => void;
};

export default function AdminHeader({
  adminName,
  adminEmail,
  onMenuClick,
}: AdminHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/admin/login");
    router.refresh();
  }

  const initials = adminName
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={23} />
        </button>

        <div>
          <span className={styles.eyebrow}>
            Crafteris Studio
          </span>

          <p>Management Dashboard</p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.user}>
          <div className={styles.avatar}>
            {initials || (
              <UserRound size={18} />
            )}
          </div>

          <div className={styles.userDetails}>
            <strong>{adminName}</strong>

            <span>{adminEmail}</span>
          </div>
        </div>

        <button
          className={styles.logoutButton}
          onClick={handleLogout}
          title="Log out"
        >
          <LogOut size={18} />

          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}