import { createServerClient } from "@supabase/ssr";
import {
  NextResponse,
  type NextRequest,
} from "next/server";

export async function updateSession(
  request: NextRequest
) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) =>
              request.cookies.set(
                name,
                value
              )
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }) =>
              response.cookies.set(
                name,
                value,
                options
              )
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname =
    request.nextUrl.pathname;

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
    if (
      pathname ===
        "/admin/login" &&
      user
    ) {
      const {
        data: profile,
      } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (
        profile?.role ===
        "admin"
      ) {
        const url =
          request.nextUrl.clone();

        url.pathname =
          "/admin";

        return NextResponse.redirect(
          url
        );
      }
    }

    return response;
  }

  if (
    pathname.startsWith(
      "/admin"
    )
  ) {
    if (!user) {
      const url =
        request.nextUrl.clone();

      url.pathname =
        "/admin/login";

      return NextResponse.redirect(
        url
      );
    }

    const {
      data: profile,
    } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      !profile ||
      profile.role !==
        "admin"
    ) {
      await supabase.auth.signOut();

      const url =
        request.nextUrl.clone();

      url.pathname =
        "/admin/login";

      return NextResponse.redirect(
        url
      );
    }
  }

  return response;
}