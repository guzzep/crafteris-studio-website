"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  Clock3,
  Link2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings2,
  Share2,
  Store,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import styles from "./settings.module.css";

type OpeningHours = {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  note: string;
};

type SiteSettings = {
  id: string;

  site_name: string;

  email: string | null;
  phone: string | null;
  address: string | null;

  instagram_url: string | null;
  facebook_url: string | null;

  opening_hours: Partial<OpeningHours> | null;

  created_at: string;
  updated_at: string;
};

type SettingsForm = {
  site_name: string;

  email: string;
  phone: string;
  address: string;

  instagram_url: string;
  facebook_url: string;

  opening_hours: OpeningHours;
};

const defaultOpeningHours: OpeningHours = {
  monday: "",
  tuesday: "",
  wednesday: "",
  thursday: "",
  friday: "",
  saturday: "",
  sunday: "",
  note: "",
};

const emptyForm: SettingsForm = {
  site_name: "Crafteris",

  email: "",
  phone: "",
  address: "",

  instagram_url: "",
  facebook_url: "",

  opening_hours: {
    ...defaultOpeningHours,
  },
};

const days: {
  key: keyof Omit<
    OpeningHours,
    "note"
  >;
  label: string;
}[] = [
  {
    key: "monday",
    label: "Monday",
  },
  {
    key: "tuesday",
    label: "Tuesday",
  },
  {
    key: "wednesday",
    label: "Wednesday",
  },
  {
    key: "thursday",
    label: "Thursday",
  },
  {
    key: "friday",
    label: "Friday",
  },
  {
    key: "saturday",
    label: "Saturday",
  },
  {
    key: "sunday",
    label: "Sunday",
  },
];

export default function AdminSettingsPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [
    settingsId,
    setSettingsId,
  ] = useState<string | null>(
    null
  );

  const [form, setForm] =
    useState<SettingsForm>(
      emptyForm
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      setLoading(true);
      setError("");

      const {
        data,
        error:
          settingsError,
      } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (!active) {
        return;
      }

      if (settingsError) {
        setError(
          settingsError.message
        );

        setLoading(false);

        return;
      }

      if (data) {
        const settings =
          data as SiteSettings;

        setSettingsId(
          settings.id
        );

        setForm({
          site_name:
            settings.site_name ||
            "Crafteris",

          email:
            settings.email ?? "",

          phone:
            settings.phone ?? "",

          address:
            settings.address ?? "",

          instagram_url:
            settings.instagram_url ??
            "",

          facebook_url:
            settings.facebook_url ??
            "",

          opening_hours: {
            monday:
              settings
                .opening_hours
                ?.monday ?? "",

            tuesday:
              settings
                .opening_hours
                ?.tuesday ?? "",

            wednesday:
              settings
                .opening_hours
                ?.wednesday ?? "",

            thursday:
              settings
                .opening_hours
                ?.thursday ?? "",

            friday:
              settings
                .opening_hours
                ?.friday ?? "",

            saturday:
              settings
                .opening_hours
                ?.saturday ?? "",

            sunday:
              settings
                .opening_hours
                ?.sunday ?? "",

            note:
              settings
                .opening_hours
                ?.note ?? "",
          },
        });
      }

      setLoading(false);
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, [supabase]);

  function updateForm<
    K extends keyof Omit<
      SettingsForm,
      "opening_hours"
    >
  >(
    key: K,
    value: SettingsForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setMessage("");
    setError("");
  }

  function updateOpeningHours(
    key: keyof OpeningHours,
    value: string
  ) {
    setForm((current) => ({
      ...current,

      opening_hours: {
        ...current.opening_hours,
        [key]: value,
      },
    }));

    setMessage("");
    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    const siteName =
      form.site_name.trim();

    if (!siteName) {
      setError(
        "Studio name is required."
      );

      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      site_name: siteName,

      email:
        form.email.trim() ||
        null,

      phone:
        form.phone.trim() ||
        null,

      address:
        form.address.trim() ||
        null,

      instagram_url:
        form.instagram_url.trim() ||
        null,

      facebook_url:
        form.facebook_url.trim() ||
        null,

      opening_hours: {
        monday:
          form.opening_hours.monday.trim(),

        tuesday:
          form.opening_hours.tuesday.trim(),

        wednesday:
          form.opening_hours.wednesday.trim(),

        thursday:
          form.opening_hours.thursday.trim(),

        friday:
          form.opening_hours.friday.trim(),

        saturday:
          form.opening_hours.saturday.trim(),

        sunday:
          form.opening_hours.sunday.trim(),

        note:
          form.opening_hours.note.trim(),
      },

      updated_at:
        new Date().toISOString(),
    };

    if (settingsId) {
      const {
        error:
          updateError,
      } = await supabase
        .from("site_settings")
        .update(payload)
        .eq(
          "id",
          settingsId
        );

      if (updateError) {
        setError(
          updateError.message
        );

        setSaving(false);

        return;
      }
    } else {
      const {
        data,
        error:
          insertError,
      } = await supabase
        .from("site_settings")
        .insert(payload)
        .select("id")
        .single();

      if (insertError) {
        setError(
          insertError.message
        );

        setSaving(false);

        return;
      }

      setSettingsId(
        data.id
      );
    }

    setMessage(
      "Settings saved successfully."
    );

    setSaving(false);
  }

  if (loading) {
    return (
      <div
        className={
          styles.loadingState
        }
      >
        <Loader2
          size={28}
          className={
            styles.spin
          }
        />

        <p>
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        styles.page
      }
    >
      <section
        className={
          styles.pageHeader
        }
      >
        <div>
          <p
            className={
              styles.eyebrow
            }
          >
            WEBSITE
          </p>

          <h1>
            Settings
          </h1>

          <p
            className={
              styles.intro
            }
          >
            Manage the main
            studio information
            used across the
            Crafteris website.
          </p>
        </div>

        <div
          className={
            styles.headerIcon
          }
        >
          <Settings2
            size={22}
          />
        </div>
      </section>

      {message && (
        <div
          className={
            styles.successMessage
          }
        >
          <Check
            size={18}
          />

          {message}
        </div>
      )}

      {error && (
        <div
          className={
            styles.errorMessage
          }
        >
          <X
            size={18}
          />

          {error}
        </div>
      )}

      <form
        onSubmit={
          handleSubmit
        }
        className={
          styles.settingsForm
        }
      >
        {/* GENERAL */}

        <section
          className={
            styles.settingsCard
          }
        >
          <div
            className={
              styles.cardHeader
            }
          >
            <div
              className={
                styles.cardIcon
              }
            >
              <Store
                size={18}
              />
            </div>

            <div>
              <h2>
                Studio details
              </h2>

              <p>
                Main information
                about the
                Crafteris studio.
              </p>
            </div>
          </div>

          <div
            className={
              styles.formGrid
            }
          >
            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="siteName"
              >
                Studio name *
              </label>

              <input
                id="siteName"
                value={
                  form.site_name
                }
                onChange={(
                  event
                ) =>
                  updateForm(
                    "site_name",
                    event
                      .target
                      .value
                  )
                }
                placeholder="Crafteris"
                required
              />
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="email"
              >
                Email
              </label>

              <div
                className={
                  styles.inputWithIcon
                }
              >
                <Mail
                  size={16}
                />

                <input
                  id="email"
                  type="email"
                  value={
                    form.email
                  }
                  onChange={(
                    event
                  ) =>
                    updateForm(
                      "email",
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="hello@crafteris.com"
                />
              </div>
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="phone"
              >
                Phone
              </label>

              <div
                className={
                  styles.inputWithIcon
                }
              >
                <Phone
                  size={16}
                />

                <input
                  id="phone"
                  type="tel"
                  value={
                    form.phone
                  }
                  onChange={(
                    event
                  ) =>
                    updateForm(
                      "phone",
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="+356 ..."
                />
              </div>
            </div>

            <div
              className={`${styles.formGroup} ${styles.fullWidth}`}
            >
              <label
                htmlFor="address"
              >
                Studio address
              </label>

              <div
                className={
                  styles.inputWithIcon
                }
              >
                <MapPin
                  size={16}
                />

                <input
                  id="address"
                  value={
                    form.address
                  }
                  onChange={(
                    event
                  ) =>
                    updateForm(
                      "address",
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Full studio address"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL */}

        <section
          className={
            styles.settingsCard
          }
        >
          <div
            className={
              styles.cardHeader
            }
          >
            <div
              className={
                styles.cardIcon
              }
            >
              <Share2  
                size={18}
              />
            </div>

            <div>
              <h2>
                Social media
              </h2>

              <p>
                Links used around
                the public
                website.
              </p>
            </div>
          </div>

          <div
            className={
              styles.formGrid
            }
          >
            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="instagram"
              >
                Instagram URL
              </label>

              <div
                className={
                  styles.inputWithIcon
                }
              >
                <Link2  
                  size={16}
                />

                <input
                  id="instagram"
                  type="url"
                  value={
                    form.instagram_url
                  }
                  onChange={(
                    event
                  ) =>
                    updateForm(
                      "instagram_url",
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="facebook"
              >
                Facebook URL
              </label>

              <div
                className={
                  styles.inputWithIcon
                }
              >
                <Link2  
                  size={16}
                />

                <input
                  id="facebook"
                  type="url"
                  value={
                    form.facebook_url
                  }
                  onChange={(
                    event
                  ) =>
                    updateForm(
                      "facebook_url",
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* OPENING HOURS */}

        <section
          className={
            styles.settingsCard
          }
        >
          <div
            className={
              styles.cardHeader
            }
          >
            <div
              className={
                styles.cardIcon
              }
            >
              <Clock3
                size={18}
              />
            </div>

            <div>
              <h2>
                Opening hours
              </h2>

              <p>
                Set the regular
                studio opening
                hours.
              </p>
            </div>
          </div>

          <div
            className={
              styles.hoursList
            }
          >
            {days.map(
              (day) => (
                <div
                  className={
                    styles.hoursRow
                  }
                  key={
                    day.key
                  }
                >
                  <label
                    htmlFor={
                      day.key
                    }
                  >
                    {
                      day.label
                    }
                  </label>

                  <input
                    id={
                      day.key
                    }
                    value={
                      form
                        .opening_hours[
                        day.key
                      ]
                    }
                    onChange={(
                      event
                    ) =>
                      updateOpeningHours(
                        day.key,
                        event
                          .target
                          .value
                      )
                    }
                    placeholder="09:00 – 17:00 or Closed"
                  />
                </div>
              )
            )}
          </div>

          <div
            className={
              styles.hoursNote
            }
          >
            <label
              htmlFor="hoursNote"
            >
              Opening hours note
            </label>

            <textarea
              id="hoursNote"
              rows={3}
              value={
                form
                  .opening_hours
                  .note
              }
              onChange={(
                event
              ) =>
                updateOpeningHours(
                  "note",
                  event.target
                    .value
                )
              }
              placeholder="Opening hours may vary on public holidays or during private events."
            />
          </div>
        </section>

        {/* SAVE */}

        <div
          className={
            styles.saveBar
          }
        >
          <div>
            <strong>
              Global website
              settings
            </strong>

            <span>
              Changes are saved
              to Supabase.
            </span>
          </div>

          <button
            type="submit"
            className={
              styles.saveButton
            }
            disabled={
              saving
            }
          >
            {saving ? (
              <>
                <Loader2
                  size={16}
                  className={
                    styles.spin
                  }
                />

                Saving...
              </>
            ) : (
              <>
                <Save
                  size={16}
                />

                Save settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}