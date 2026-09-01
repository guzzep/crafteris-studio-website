"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  Euro,
  Loader2,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import styles from "./workshop-detail.module.css";

type Workshop = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string | null;
  base_price: number | null;
  duration_minutes: number | null;
  status: "draft" | "published" | "archived";
};

type WorkshopSession = {
  id: string;
  workshop_id: string;
  starts_at: string;
  ends_at: string | null;
  capacity: number;
  booked_places: number;
  price: number | null;
  is_cancelled: boolean;
  created_at: string;
};

type SessionForm = {
  date: string;
  start_time: string;
  end_time: string;
  capacity: string;
  booked_places: string;
  price: string;
};

const emptySessionForm: SessionForm = {
  date: "",
  start_time: "",
  end_time: "",
  capacity: "8",
  booked_places: "0",
  price: "",
};

export default function WorkshopDetailPage() {
  const params = useParams();

  const workshopId = params.id as string;

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [workshop, setWorkshop] =
    useState<Workshop | null>(null);

  const [sessions, setSessions] = useState<
    WorkshopSession[]
  >([]);

  const [form, setForm] =
    useState<SessionForm>(emptySessionForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const loadWorkshop = useCallback(
    async () => {
      setLoading(true);
      setError("");

      const {
        data: workshopData,
        error: workshopError,
      } = await supabase
        .from("workshops")
        .select(
          `
            id,
            title,
            slug,
            category,
            short_description,
            base_price,
            duration_minutes,
            status
          `
        )
        .eq("id", workshopId)
        .single();

      if (workshopError) {
        setError(workshopError.message);
        setLoading(false);
        return;
      }

      const {
        data: sessionData,
        error: sessionError,
      } = await supabase
        .from("workshop_sessions")
        .select("*")
        .eq("workshop_id", workshopId)
        .order("starts_at", {
          ascending: true,
        });

      if (sessionError) {
        setError(sessionError.message);
        setLoading(false);
        return;
      }

      setWorkshop(
        workshopData as Workshop
      );

      setSessions(
        (sessionData as WorkshopSession[]) ??
          []
      );

      setLoading(false);
    },
    [supabase, workshopId]
  );

  useEffect(() => {
    void loadWorkshop();
  }, [loadWorkshop]);

  function updateForm<
    K extends keyof SessionForm
  >(key: K, value: SessionForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function openSessionForm() {
    setForm({
      ...emptySessionForm,
      price:
        workshop?.base_price?.toString() ??
        "",
    });

    setError("");
    setMessage("");
    setFormOpen(true);
  }

  function closeSessionForm() {
    setFormOpen(false);
    setForm(emptySessionForm);
    setError("");
  }

  function createDateTime(
    date: string,
    time: string
  ) {
    if (!date || !time) {
      return null;
    }

    return new Date(
      `${date}T${time}:00`
    ).toISOString();
  }

  async function handleAddSession(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    if (
      !form.date ||
      !form.start_time
    ) {
      setError(
        "Date and start time are required."
      );

      setSaving(false);
      return;
    }

    const startsAt = createDateTime(
      form.date,
      form.start_time
    );

    const endsAt = form.end_time
      ? createDateTime(
          form.date,
          form.end_time
        )
      : null;

    if (!startsAt) {
      setError(
        "Could not create the session date."
      );

      setSaving(false);
      return;
    }

    const capacity =
      Number(form.capacity);

    const bookedPlaces =
      Number(form.booked_places);

    if (
      capacity < 1 ||
      bookedPlaces < 0 ||
      bookedPlaces > capacity
    ) {
      setError(
        "Booked places must be between 0 and the total capacity."
      );

      setSaving(false);
      return;
    }

    if (
      endsAt &&
      new Date(endsAt) <=
        new Date(startsAt)
    ) {
      setError(
        "End time must be after the start time."
      );

      setSaving(false);
      return;
    }

    const { error: insertError } =
      await supabase
        .from("workshop_sessions")
        .insert({
          workshop_id: workshopId,

          starts_at: startsAt,

          ends_at: endsAt,

          capacity,

          booked_places: bookedPlaces,

          price:
            form.price === ""
              ? null
              : Number(form.price),

          is_cancelled: false,
        });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    setMessage(
      "Workshop session added successfully."
    );

    setSaving(false);
    setFormOpen(false);
    setForm(emptySessionForm);

    await loadWorkshop();
  }

  async function toggleCancelled(
    session: WorkshopSession
  ) {
    setError("");
    setMessage("");

    const newValue =
      !session.is_cancelled;

    const { error: updateError } =
      await supabase
        .from("workshop_sessions")
        .update({
          is_cancelled: newValue,
        })
        .eq("id", session.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(
      newValue
        ? "Session cancelled."
        : "Session restored."
    );

    await loadWorkshop();
  }

  async function deleteSession(
    session: WorkshopSession
  ) {
    const confirmed =
      window.confirm(
        "Delete this workshop session?\n\nThis cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(session.id);
    setError("");
    setMessage("");

    const { error: deleteError } =
      await supabase
        .from("workshop_sessions")
        .delete()
        .eq("id", session.id);

    if (deleteError) {
      setError(deleteError.message);
      setDeletingId(null);
      return;
    }

    setMessage(
      "Workshop session deleted."
    );

    setDeletingId(null);

    await loadWorkshop();
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: "Europe/Malta",
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ).format(new Date(date));
  }

  function formatTime(date: string) {
    return new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: "Europe/Malta",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    ).format(new Date(date));
  }

  function formatDayNumber(date: string) {
    return new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: "Europe/Malta",
        day: "numeric",
      }
    ).format(new Date(date));
  }

  function formatMonth(date: string) {
    return new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: "Europe/Malta",
        month: "short",
      }
    ).format(new Date(date));
  }

  if (loading) {
    return (
      <div
        className={styles.loadingPage}
      >
        <Loader2
          size={30}
          className={styles.spin}
        />

        <p>Loading workshop...</p>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className={styles.page}>
        <Link
          href="/admin/workshops"
          className={styles.backLink}
        >
          <ArrowLeft size={16} />
          Back to workshops
        </Link>

        <div
          className={styles.errorMessage}
        >
          Workshop could not be found.
        </div>
      </div>
    );
  }

  const upcomingCount =
    sessions.filter(
      (session) =>
        !session.is_cancelled &&
        new Date(session.starts_at) >
          new Date()
    ).length;

  return (
    <div className={styles.page}>
      <Link
        href="/admin/workshops"
        className={styles.backLink}
      >
        <ArrowLeft size={16} />
        Back to workshops
      </Link>

      <section
        className={styles.pageHeader}
      >
        <div>
          <p className={styles.eyebrow}>
            {workshop.category}
          </p>

          <h1>{workshop.title}</h1>

          <p className={styles.intro}>
            Manage dates, times, capacity
            and prices for this workshop.
          </p>
        </div>

        <button
          className={styles.primaryButton}
          onClick={openSessionForm}
        >
          <Plus size={18} />
          Add session
        </button>
      </section>

      {message && (
        <div
          className={styles.successMessage}
        >
          <Check size={18} />
          {message}
        </div>
      )}

      {error && (
        <div
          className={styles.errorMessage}
        >
          <X size={18} />
          {error}
        </div>
      )}

      <section
        className={styles.infoGrid}
      >
        <div className={styles.infoCard}>
          <CalendarDays size={20} />

          <div>
            <span>
              Upcoming sessions
            </span>

            <strong>
              {upcomingCount}
            </strong>
          </div>
        </div>

        <div className={styles.infoCard}>
          <Clock size={20} />

          <div>
            <span>Duration</span>

            <strong>
              {workshop.duration_minutes
                ? `${workshop.duration_minutes} min`
                : "Not set"}
            </strong>
          </div>
        </div>

        <div className={styles.infoCard}>
          <Euro size={20} />

          <div>
            <span>Base price</span>

            <strong>
              {workshop.base_price !== null
                ? `€${Number(
                    workshop.base_price
                  ).toFixed(2)}`
                : "Not set"}
            </strong>
          </div>
        </div>
      </section>

      {formOpen && (
        <section
          className={styles.formPanel}
        >
          <div
            className={
              styles.formHeading
            }
          >
            <div>
              <p
                className={
                  styles.smallLabel
                }
              >
                NEW SESSION
              </p>

              <h2>Add workshop date</h2>
            </div>

            <button
              className={
                styles.closeButton
              }
              type="button"
              onClick={closeSessionForm}
            >
              <X size={20} />
            </button>
          </div>

          <form
            className={styles.form}
            onSubmit={handleAddSession}
          >
            <div
              className={styles.formGrid}
            >
              <div
                className={
                  styles.formGroup
                }
              >
                <label htmlFor="date">
                  Date *
                </label>

                <input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    updateForm(
                      "date",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label htmlFor="start">
                  Start time *
                </label>

                <input
                  id="start"
                  type="time"
                  value={
                    form.start_time
                  }
                  onChange={(event) =>
                    updateForm(
                      "start_time",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label htmlFor="end">
                  End time
                </label>

                <input
                  id="end"
                  type="time"
                  value={form.end_time}
                  onChange={(event) =>
                    updateForm(
                      "end_time",
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
                  htmlFor="capacity"
                >
                  Capacity *
                </label>

                <input
                  id="capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(event) =>
                    updateForm(
                      "capacity",
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label
                  htmlFor="booked"
                >
                  Booked places
                </label>

                <input
                  id="booked"
                  type="number"
                  min="0"
                  value={
                    form.booked_places
                  }
                  onChange={(event) =>
                    updateForm(
                      "booked_places",
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
                <label htmlFor="price">
                  Session price (€)
                </label>

                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    updateForm(
                      "price",
                      event.target.value
                    )
                  }
                  placeholder={
                    workshop.base_price !==
                    null
                      ? workshop.base_price.toString()
                      : "28"
                  }
                />
              </div>
            </div>

            <p className={styles.hint}>
              Leave the session price empty
              if you want to use the
              workshop&apos;s normal base
              price.
            </p>

            <div
              className={
                styles.formActions
              }
            >
              <button
                type="button"
                className={
                  styles.cancelButton
                }
                onClick={closeSessionForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={
                  styles.saveButton
                }
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      className={
                        styles.spin
                      }
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={17} />
                    Add session
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      <section
        className={styles.sessionsPanel}
      >
        <div
          className={
            styles.sessionsHeader
          }
        >
          <div>
            <p
              className={
                styles.smallLabel
              }
            >
              SCHEDULE
            </p>

            <h2>Workshop sessions</h2>
          </div>

          <span>
            {sessions.length} total
          </span>
        </div>

        {sessions.length === 0 ? (
          <div
            className={styles.emptyState}
          >
            <CalendarDays size={32} />

            <h3>No dates yet</h3>

            <p>
              Add the first date for this
              workshop. Published upcoming
              sessions will later appear on
              What&apos;s On.
            </p>

            <button
              onClick={openSessionForm}
            >
              <Plus size={16} />
              Add first session
            </button>
          </div>
        ) : (
          <div
            className={
              styles.sessionList
            }
          >
            {sessions.map((session) => {
              const remaining =
                session.capacity -
                session.booked_places;

              const actualPrice =
                session.price ??
                workshop.base_price;

              return (
                <article
                  key={session.id}
                  className={`${styles.sessionCard} ${
                    session.is_cancelled
                      ? styles.cancelled
                      : ""
                  }`}
                >
                  <div
                    className={
                      styles.dateBox
                    }
                  >
                    <strong>
                      {formatDayNumber(
                        session.starts_at
                      )}
                    </strong>

                    <span>
                      {formatMonth(
                        session.starts_at
                      )}
                    </span>
                  </div>

                  <div
                    className={
                      styles.sessionMain
                    }
                  >
                    <div
                      className={
                        styles.sessionTitle
                      }
                    >
                      <div>
                        <h3>
                          {formatDate(
                            session.starts_at
                          )}
                        </h3>

                        <p>
                          {formatTime(
                            session.starts_at
                          )}

                          {session.ends_at &&
                            ` – ${formatTime(
                              session.ends_at
                            )}`}
                        </p>
                      </div>

                      {session.is_cancelled ? (
                        <span
                          className={
                            styles.cancelledBadge
                          }
                        >
                          Cancelled
                        </span>
                      ) : (
                        <span
                          className={
                            styles.activeBadge
                          }
                        >
                          Active
                        </span>
                      )}
                    </div>

                    <div
                      className={
                        styles.sessionDetails
                      }
                    >
                      <span>
                        <Users size={14} />
                        {
                          session.booked_places
                        }
                        /{session.capacity}{" "}
                        booked
                      </span>

                      <span>
                        {remaining} places
                        left
                      </span>

                      <span>
                        <Euro size={14} />

                        {actualPrice !== null
                          ? Number(
                              actualPrice
                            ).toFixed(2)
                          : "Not set"}
                      </span>
                    </div>
                  </div>

                  <div
                    className={
                      styles.sessionActions
                    }
                  >
                    <button
                      onClick={() =>
                        toggleCancelled(
                          session
                        )
                      }
                    >
                      {session.is_cancelled
                        ? "Restore"
                        : "Cancel session"}
                    </button>

                    <button
                      className={
                        styles.deleteButton
                      }
                      onClick={() =>
                        deleteSession(
                          session
                        )
                      }
                      disabled={
                        deletingId ===
                        session.id
                      }
                    >
                      {deletingId ===
                      session.id ? (
                        <Loader2
                          size={15}
                          className={
                            styles.spin
                          }
                        />
                      ) : (
                        <Trash2
                          size={15}
                        />
                      )}

                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}