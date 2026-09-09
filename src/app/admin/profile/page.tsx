"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
} from "lucide-react";

import {
  createClient,
} from "@/lib/supabase/client";

import styles from "./profile.module.css";

export default function AdminProfilePage() {
  const [
    firstName,
    setFirstName,
  ] = useState("");

  const [
    lastName,
    setLastName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    originalEmail,
    setOriginalEmail,
  ] = useState("");

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
  ] = useState(true);

  const [
    savingProfile,
    setSavingProfile,
  ] = useState(false);

  const [
    savingPassword,
    setSavingPassword,
  ] = useState(false);

  const [
    profileMessage,
    setProfileMessage,
  ] = useState("");

  const [
    profileError,
    setProfileError,
  ] = useState("");

  const [
    passwordMessage,
    setPasswordMessage,
  ] = useState("");

  const [
    passwordError,
    setPasswordError,
  ] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase =
        createClient();

      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setProfileError(
          "Could not load the current admin account."
        );

        setLoading(false);

        return;
      }

      const currentEmail =
        user.email || "";

      setEmail(
        currentEmail
      );

      setOriginalEmail(
        currentEmail
      );

      const {
        data: profile,
        error,
      } = await supabase
        .from("profiles")
        .select(
          "first_name, last_name"
        )
        .eq(
          "id",
          user.id
        )
        .single();

      if (error) {
        setProfileError(
          "Could not load your profile."
        );

        setLoading(false);

        return;
      }

      setFirstName(
        profile.first_name ||
          ""
      );

      setLastName(
        profile.last_name ||
          ""
      );

      setLoading(false);
    }

    void loadProfile();
  }, []);

  async function handleProfileSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSavingProfile(
      true
    );

    setProfileMessage("");
    setProfileError("");

    const supabase =
      createClient();

    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();

    if (!user) {
      setProfileError(
        "Your session has expired. Please sign in again."
      );

      setSavingProfile(
        false
      );

      return;
    }

    const {
      error:
        profileUpdateError,
    } = await supabase
      .from("profiles")
      .update({
        first_name:
          firstName.trim(),
        last_name:
          lastName.trim(),
      })
      .eq(
        "id",
        user.id
      );

    if (
      profileUpdateError
    ) {
      setProfileError(
        profileUpdateError.message
      );

      setSavingProfile(
        false
      );

      return;
    }

    if (
      email.trim() &&
      email.trim() !==
        originalEmail
    ) {
      const {
        error:
          emailError,
      } =
        await supabase.auth.updateUser(
          {
            email:
              email.trim(),
          }
        );

      if (emailError) {
        setProfileError(
          `Your name was updated, but the email could not be changed: ${emailError.message}`
        );

        setSavingProfile(
          false
        );

        return;
      }

      setProfileMessage(
        "Your profile was updated. Check your email if Supabase requires confirmation of the new email address."
      );
    } else {
      setProfileMessage(
        "Your profile was updated successfully."
      );
    }

    setSavingProfile(
      false
    );
  }

  async function handlePasswordSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (
      password.length < 8
    ) {
      setPasswordError(
        "Your new password must contain at least 8 characters."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setPasswordError(
        "The passwords do not match."
      );

      return;
    }

    setSavingPassword(
      true
    );

    const supabase =
      createClient();

    const {
      error,
    } =
      await supabase.auth.updateUser(
        {
          password,
        }
      );

    if (error) {
      setPasswordError(
        error.message
      );

      setSavingPassword(
        false
      );

      return;
    }

    setPassword("");
    setConfirmPassword("");

    setPasswordMessage(
      "Your password was changed successfully."
    );

    setSavingPassword(
      false
    );
  }

  if (loading) {
    return (
      <div
        className={
          styles.page
        }
      >
        <p>
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div
      className={styles.page}
    >
      <div
        className={
          styles.header
        }
      >
        <div>
          <p
            className={
              styles.eyebrow
            }
          >
            ADMIN ACCOUNT
          </p>

          <h1>
            My Profile
          </h1>

          <p
            className={
              styles.subtitle
            }
          >
            Manage your personal
            details, login email
            and password.
          </p>
        </div>
      </div>

      <div
        className={styles.grid}
      >
        <section
          className={styles.card}
        >
          <div
            className={
              styles.cardHeading
            }
          >
            <div
              className={
                styles.iconBox
              }
            >
              <UserRound
                size={21}
              />
            </div>

            <div>
              <h2>
                Profile details
              </h2>

              <p>
                Update your name
                and account email.
              </p>
            </div>
          </div>

          <form
            className={
              styles.form
            }
            onSubmit={
              handleProfileSave
            }
          >
            <div
              className={
                styles.nameGrid
              }
            >
              <div
                className={
                  styles.formGroup
                }
              >
                <label
                  htmlFor="firstName"
                >
                  First name
                </label>

                <input
                  id="firstName"
                  value={
                    firstName
                  }
                  onChange={(
                    event
                  ) =>
                    setFirstName(
                      event.target.value
                    )
                  }
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label
                  htmlFor="lastName"
                >
                  Last name
                </label>

                <input
                  id="lastName"
                  value={
                    lastName
                  }
                  onChange={(
                    event
                  ) =>
                    setLastName(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

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

              <div
                className={
                  styles.inputWithIcon
                }
              >
                <Mail
                  size={18}
                />

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
                  required
                />
              </div>
            </div>

            {profileError && (
              <div
                className={
                  styles.error
                }
              >
                {profileError}
              </div>
            )}

            {profileMessage && (
              <div
                className={
                  styles.success
                }
              >
                {
                  profileMessage
                }
              </div>
            )}

            <button
              type="submit"
              className={
                styles.primaryButton
              }
              disabled={
                savingProfile
              }
            >
              {savingProfile
                ? "Saving..."
                : "Save profile"}
            </button>
          </form>
        </section>

        <section
          className={styles.card}
        >
          <div
            className={
              styles.cardHeading
            }
          >
            <div
              className={
                styles.iconBox
              }
            >
              <LockKeyhole
                size={21}
              />
            </div>

            <div>
              <h2>
                Change password
              </h2>

              <p>
                Choose a new
                password for your
                admin account.
              </p>
            </div>
          </div>

          <form
            className={
              styles.form
            }
            onSubmit={
              handlePasswordSave
            }
          >
            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="newPassword"
              >
                New password
              </label>

              <div
                className={
                  styles.passwordWrapper
                }
              >
                <input
                  id="newPassword"
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
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
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
                Confirm password
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

            {passwordError && (
              <div
                className={
                  styles.error
                }
              >
                {
                  passwordError
                }
              </div>
            )}

            {passwordMessage && (
              <div
                className={
                  styles.success
                }
              >
                {
                  passwordMessage
                }
              </div>
            )}

            <button
              type="submit"
              className={
                styles.primaryButton
              }
              disabled={
                savingPassword
              }
            >
              {savingPassword
                ? "Updating..."
                : "Change password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}