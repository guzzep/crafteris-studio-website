"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  createClient,
} from "@/lib/supabase/client";

import styles from "../login/login.module.css";

export default function ResetPasswordPage() {
  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    checkingSession,
    setCheckingSession,
  ] = useState(true);

  const [
    sessionReady,
    setSessionReady,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  useEffect(() => {
    async function prepareSession() {
      const supabase =
        createClient();

      try {
        const params =
          new URLSearchParams(
            window.location.search
          );

        const code =
          params.get("code");

        if (code) {
          const {
            error:
              exchangeError,
          } =
            await supabase.auth.exchangeCodeForSession(
              code
            );

          if (
            exchangeError
          ) {
            setError(
              "This password reset link is invalid or has expired."
            );

            setCheckingSession(
              false
            );

            return;
          }

          window.history.replaceState(
            {},
            "",
            window.location.pathname
          );
        }

        const {
          data,
        } =
          await supabase.auth.getSession();

        if (
          !data.session
        ) {
          setError(
            "This password reset link is invalid or has expired. Please request a new one."
          );

          setCheckingSession(
            false
          );

          return;
        }

        setSessionReady(
          true
        );
      } catch {
        setError(
          "We could not verify this password reset link."
        );
      }

      setCheckingSession(
        false
      );
    }

    void prepareSession();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      password.length < 8
    ) {
      setError(
        "Your new password must contain at least 8 characters."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "The passwords do not match."
      );

      return;
    }

    setLoading(true);

    const supabase =
      createClient();

    const {
      error:
        updateError,
    } =
      await supabase.auth.updateUser(
        {
          password,
        }
      );

    if (
      updateError
    ) {
      setError(
        updateError.message
      );

      setLoading(false);

      return;
    }

    setPassword("");
    setConfirmPassword("");

    setSuccess(
      "Your password has been changed successfully. You can now sign in with your new password."
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
            PASSWORD RESET
          </p>

          <h1>
            Create a new password.
          </h1>

          <span>
            Choose a new password
            for your Crafteris
            admin account.
          </span>
        </div>

        {checkingSession ? (
          <p>
            Checking your reset
            link...
          </p>
        ) : (
          <>
            {error &&
              !sessionReady && (
                <div
                  className={
                    styles.error
                  }
                >
                  {error}
                </div>
              )}

            {sessionReady && (
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
                    htmlFor="password"
                  >
                    New password
                  </label>

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
                      value={
                        password
                      }
                      onChange={(
                        event
                      ) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
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
                          ) =>
                            !current
                        )
                      }
                      aria-label={
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

                <div
                  className={
                    styles.formGroup
                  }
                >
                  <label
                    htmlFor="confirmPassword"
                  >
                    Confirm new
                    password
                  </label>

                  <input
                    id="confirmPassword"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      confirmPassword
                    }
                    onChange={(
                      event
                    ) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
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

                {!success && (
                  <button
                    type="submit"
                    className={
                      styles.loginButton
                    }
                    disabled={
                      loading
                    }
                  >
                    {loading
                      ? "Updating..."
                      : (
                        <>
                          Update password
                          <span>
                            →
                          </span>
                        </>
                      )}
                  </button>
                )}
              </form>
            )}
          </>
        )}

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