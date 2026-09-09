"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

import styles from "./AdminShell.module.css";

type AdminShellProps = {
  children: React.ReactNode;
  adminName: string;
  adminEmail: string;
};

export default function AdminShell({
  children,
  adminName,
  adminEmail,
}: AdminShellProps) {
  const pathname =
    usePathname();

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const publicAdminRoutes = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
  ];

  if (
    publicAdminRoutes.includes(
      pathname
    )
  ) {
    return <>{children}</>;
  }

  return (
    <div
      className={
        styles.shell
      }
    >
      <AdminSidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      {sidebarOpen && (
        <button
          className={
            styles.overlay
          }
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-label="Close navigation"
        />
      )}

      <div
        className={
          styles.main
        }
      >
        <AdminHeader
          adminName={
            adminName
          }
          adminEmail={
            adminEmail
          }
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <div
          className={
            styles.content
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}