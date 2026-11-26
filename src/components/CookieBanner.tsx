"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import styles from "./CookieBanner.module.css";

const CONSENT_KEY =
  "crafteris_cookie_consent_v2";

const OPEN_SETTINGS_EVENT =
  "crafteris-open-cookie-settings";

type CookieConsent = {
  version: 2;
  analytics: boolean;
  savedAt: string;
};

function readConsent(): CookieConsent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as CookieConsent;
    const saved = new Date(value.savedAt);
    const expiry = new Date(saved);
    expiry.setMonth(expiry.getMonth() + 6);
    if (value.version !== 2 || typeof value.analytics !== "boolean" || !Number.isFinite(saved.getTime()) || saved.getTime() > Date.now() || expiry.getTime() <= Date.now()) {
      window.localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    return value;
  } catch { return null; }
}

export function openCookieSettings() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new Event(
      OPEN_SETTINGS_EVENT
    )
  );
}

export default function CookieBanner() {
  const [ready, setReady] =
    useState(false);

  const [
    bannerVisible,
    setBannerVisible,
  ] = useState(false);

  const [
    settingsOpen,
    setSettingsOpen,
  ] = useState(false);

  const [
    analyticsEnabled,
    setAnalyticsEnabled,
  ] = useState(false);

  useEffect(() => {
    const storedConsent = readConsent();

    if (storedConsent) {
      setAnalyticsEnabled(
        Boolean(
          storedConsent.analytics
        )
      );

      setBannerVisible(false);
    } else {
      setBannerVisible(true);
    }

    setReady(true);

    function handleOpenSettings() {
      setAnalyticsEnabled(readConsent()?.analytics ?? false);
      setSettingsOpen(true);
    }

    window.addEventListener(
      OPEN_SETTINGS_EVENT,
      handleOpenSettings
    );

    return () => {
      window.removeEventListener(
        OPEN_SETTINGS_EVENT,
        handleOpenSettings
      );
    };
  }, []);

  function saveConsent(
    analytics: boolean
  ) {
    const consent: CookieConsent =
      {
        version: 2,
        analytics,
        savedAt:
          new Date().toISOString(),
      };

    try {
      window.localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify(
          consent
        )
      );
    } catch {
      // The site still works if
      // localStorage is unavailable.
    }

    setAnalyticsEnabled(
      analytics
    );

    setBannerVisible(false);
    setSettingsOpen(false);

    window.dispatchEvent(
      new CustomEvent(
        "crafteris-cookie-consent-changed",
        {
          detail: consent,
        }
      )
    );
  }

  function acceptAll() {
    saveConsent(true);
  }

  function rejectOptional() {
    saveConsent(false);
  }

  function savePreferences() {
    saveConsent(
      analyticsEnabled
    );
  }

  if (!ready) {
    return null;
  }

  return (
    <>
      {bannerVisible && (
        <div
          className={
            styles.banner
          }
          role="region"
          aria-label="Cookie notice"
        >
          <div
            className={
              styles.bannerInner
            }
          >
            <p
              className={
                styles.bannerText
              }
            >
              We use essential
              cookies so you can use
              the Crafteris website
              securely. Optional analytics are not currently configured. You can manage your preferences below.{" "}

              <Link href="/cookies">
                Cookie Policy
              </Link>
            </p>

            <div
              className={
                styles.bannerActions
              }
            >
              <button
                type="button"
                className={
                  styles.settingsButton
                }
                onClick={() =>
                  setSettingsOpen(
                    true
                  )
                }
              >
                Cookie Settings
              </button>

              <button
                type="button"
                className={
                  styles.rejectButton
                }
                onClick={
                  rejectOptional
                }
              >
                Reject Non-Essential
              </button>

              <button
                type="button"
                className={
                  styles.acceptButton
                }
                onClick={
                  acceptAll
                }
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div
          className={
            styles.overlay
          }
          role="presentation"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSettingsOpen(
                false
              );
            }
          }}
        >
          <div
            className={
              styles.modal
            }
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
          >
            <div
              className={
                styles.modalHeader
              }
            >
              <h2
                id="cookie-settings-title"
              >
                Cookie Settings
              </h2>
            </div>

            <div
              className={
                styles.modalBody
              }
            >
              <p
                className={
                  styles.modalIntro
                }
              >
                Choose which optional
                cookies we may use.
                Essential cookies are
                always active because
                they are required for
                the site to work.
              </p>

              <div
                className={
                  styles.preferenceRow
                }
              >
                <div>
                  <strong>
                    Essential cookies
                  </strong>

                  <p>
                    Required for
                    security, bookings,
                    cookie preferences
                    and basic site
                    functionality.
                    These cannot be
                    switched off.
                  </p>
                </div>

                <span
                  className={
                    styles.alwaysOn
                  }
                >
                  Always on
                </span>
              </div>

              <div
                className={
                  styles.preferenceRow
                }
              >
                <div>
                  <strong>
                    Analytics cookies
                  </strong>

                  <p>
                    Optional analytics are not currently configured. If introduced, they will require a new consent choice.
                  </p>
                </div>

                <button
                  type="button"
                  className={`${styles.toggle} ${
                    analyticsEnabled
                      ? styles.toggleOn
                      : ""
                  }`}
                  role="switch"
                  aria-label="Allow optional analytics cookies"
                  aria-checked={
                    analyticsEnabled
                  }
                  onClick={() =>
                    setAnalyticsEnabled(
                      (
                        current
                      ) => !current
                    )
                  }
                >
                  <span />
                </button>
              </div>

              <Link
                href="/cookies"
                className={
                  styles.policyLink
                }
                onClick={() =>
                  setSettingsOpen(
                    false
                  )
                }
              >
                Read our Cookie Policy
              </Link>
            </div>

            <div
              className={
                styles.modalFooter
              }
            >
              <button
                type="button"
                className={
                  styles.cancelButton
                }
                onClick={() =>
                  setSettingsOpen(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className={
                  styles.saveButton
                }
                onClick={
                  savePreferences
                }
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}