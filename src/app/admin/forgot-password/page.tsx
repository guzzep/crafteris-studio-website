"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  createClient,
} from "@/lib/supabase/client";

import styles from "../login/login.module.css";

export default function ForgotPasswordPage() {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const supabase =
      createClient();

    const redirectTo =
      `${window.location.origin}/admin/reset-password`;

    const {
      error:
        resetError,
    } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo,
        }
      );

    if (resetError) {
      setError(
        resetError.message
      );

      setLoading(false);

      return;
    }

    setSuccess(
      "If an account exists for this email address, a password reset link has been sent."
    );

    setLoading(false);
  }

  return (
    <main
      className={
        styles.page
      }
    >
      <div
        className={
          styles.loginCard
        }
      >
        <div
          className={
            styles.brand
          }
        >
          <Link href="/">
            Crafteris
          </Link>

          <span>
            Studio Management
          </span>
        </div>

        <div
          className={
            styles.heading
          }
        >
          <p>
            PASSWORD RECOVERY
          </p>

          <h1>
            Forgot your password?
          </h1>

          <span>
            Enter the email
            address connected to
            your admin account and
            we&apos;ll send you a
            password reset link.
          </span>
        </div>

        <form
          className={
            styles.form
          }
          onSubmit={
            handleSubmit
          }
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

          {error && (
            <div
              className={
                styles.error
              }
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className={
                styles.success
              }
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            className={
              styles.loginButton
            }
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : (
                <>
                  Send reset link
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
          <Link href="/admin/login">
            ← Back to admin login
          </Link>
        </div>
      </div>
    </main>
  );
}