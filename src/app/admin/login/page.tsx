"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import styles from "./login.module.css";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const supabase = createClient();

    const {
      data: authData,
      error: authError,
    } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    if (
      authError ||
      !authData.user
    ) {
      setError(
        "Incorrect email or password."
      );

      setLoading(false);

      return;
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("role")
      .eq(
        "id",
        authData.user.id
      )
      .single();

    if (
      profileError ||
      !profile
    ) {
      await supabase.auth.signOut();

      setError(
        "Your account does not have an admin profile."
      );

      setLoading(false);

      return;
    }

    if (
      profile.role !== "admin"
    ) {
      await supabase.auth.signOut();

      setError(
        "You do not have permission to access the admin area."
      );

      setLoading(false);

      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main
      className={styles.page}
    >
      <div
        className={
          styles.loginCard
        }
      >
        <div
          className={styles.brand}
        >
          <Link href="/">
            Crafteris
          </Link>

          <span>
            Studio Management
          </span>
        </div>

        <div
          className={styles.heading}
        >
          <p>
            ADMIN ACCESS
          </p>

          <h1>
            Welcome back.
          </h1>

          <span>
            Sign in to manage the
            Crafteris Studio website.
          </span>
        </div>

        <form
          className={styles.form}
          onSubmit={handleLogin}
        >
          <div
            className={
              styles.formGroup
            }
          >
            <label
              htmlFor="email"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(
                event
              ) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="admin@crafteris.com"
              autoComplete="email"
              required
            />
          </div>

          <div
            className={
              styles.formGroup
            }
          >
            <div
              className={
                styles.passwordLabel
              }
            >
              <label
                htmlFor="password"
              >
                Password
              </label>

              <Link
                href="/admin/forgot-password"
                className={
                  styles.forgotLink
                }
              >
                Forgot password?
              </Link>
            </div>

            <div
              className={
                styles.passwordWrapper
              }
            >
              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(
                  event
                ) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className={
                  styles.passwordToggle
                }
                onClick={() =>
                  setShowPassword(
                    (
                      current
                    ) => !current
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                title={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff
                    size={19}
                  />
                ) : (
                  <Eye
                    size={19}
                  />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              className={
                styles.error
              }
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className={
              styles.loginButton
            }
            disabled={loading}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Sign in
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div
          className={
            styles.backLink
          }
        >
          <Link href="/">
            ← Back to Crafteris
            Studio
          </Link>
        </div>
      </div>
    </main>
  );
}