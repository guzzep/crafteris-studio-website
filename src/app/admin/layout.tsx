import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let adminName = "Admin";
  let adminEmail = user?.email ?? "";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single();

    if (profile) {
      const fullName = [
        profile.first_name,
        profile.last_name,
      ]
        .filter(Boolean)
        .join(" ");

      if (fullName) {
        adminName = fullName;
      }
    }
  }

  return (
    <AdminShell
      adminName={adminName}
      adminEmail={adminEmail}
    >
      {children}
    </AdminShell>
  );
}