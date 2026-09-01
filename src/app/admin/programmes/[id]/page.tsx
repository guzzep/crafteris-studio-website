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
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import styles from "./programme-detail.module.css";

type Programme = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string | null;
  number_of_sessions: number | null;
  session_duration_minutes: number | null;
  base_price: number | null;
  status: "draft" | "published" | "archived";
};

type ProgrammeSession = {
  id: string;
  programme_id: string;
  starts_at: string;
  ends_at: string | null;
  session_number: number | null;
  created_at: string;
  updated_at: string;
};

type SessionForm = {
  date: string;
  start_time: string;
  end_time: string;
  session_number: string;
};

const emptySessionForm: SessionForm = {
  date: "",
  start_time: "",
  end_time: "",
  session_number: "",
};

export default function ProgrammeDetailPage() {
  const params = useParams();

  const programmeId = params.id as string;

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [programme, setProgramme] =
    useState<Programme | null>(null);

  const [sessions, setSessions] =
    useState<ProgrammeSession[]>([]);

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

  const loadProgramme =
    useCallback(async () => {
      setLoading(true);
      setError("");

      const {
        data: programmeData,
        error: programmeError,
      } = await supabase
        .from("programmes")
        .select(
          `
            id,
            title,
            slug,
            category,
            short_description,
            number_of_sessions,
            session_duration_minutes,
            base_price,
            status
          `
        )
        .eq("id", programmeId)
        .single();

      if (programmeError) {
        setError(programmeError.message);
        setLoading(false);
        return;
      }

      const {
        data: sessionData,
        error: sessionError,
      } = await supabase
        .from("programme_sessions")
        .select("*")
        .eq("programme_id", programmeId)
        .order("session_number", {
          ascending: true,
        })
        .order("starts_at", {
          ascending: true,
        });

      if (sessionError) {
        setError(sessionError.message);
        setLoading(false);
        return;
      }

      setProgramme(
        programmeData as Programme
      );

      setSessions(
        (sessionData as ProgrammeSession[]) ??
          []
      );

      setLoading(false);
    }, [supabase, programmeId]);

  useEffect(() => {
    void loadProgramme();
  }, [loadProgramme]);

  function updateForm<
    K extends keyof SessionForm
  >(key: K, value: SessionForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function openSessionForm() {
    const nextNumber =
      sessions.length + 1;

    setForm({
      date: "",
      start_time: "",
      end_time: "",
      session_number:
        nextNumber.toString(),
    });

    setMessage("");
    setError("");

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

    let endsAt: string | null = null;

    if (form.end_time) {
      endsAt = createDateTime(
        form.date,
        form.end_time
      );
    } else if (
      startsAt &&
      programme?.session_duration_minutes
    ) {
      const end = new Date(startsAt);

      end.setMinutes(
        end.getMinutes() +
          programme.session_duration_minutes
      );

      endsAt = end.toISOString();
    }

    if (!startsAt) {
      setError(
        "Could not create the programme session date."
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

    const sessionNumber =
      form.session_number === ""
        ? null
        : Number(form.session_number);

    if (
      sessionNumber !== null &&
      sessionNumber < 1
    ) {
      setError(
        "Session number must be at least 1."
      );

      setSaving(false);
      return;
    }

    const { error: insertError } =
      await supabase
        .from("programme_sessions")
        .insert({
          programme_id: programmeId,

          starts_at: startsAt,

          ends_at: endsAt,

          session_number:
            sessionNumber,
        });

    if (insertError) {
      setError(insertError.message);

      setSaving(false);
      return;
    }

    setMessage(
      "Programme session added successfully."
    );

    setSaving(false);
    setFormOpen(false);
    setForm(emptySessionForm);

    await loadProgramme();
  }

  async function deleteSession(
    session: ProgrammeSession
  ) {
    const confirmed =
      window.confirm(
        `Delete session ${
          session.session_number ?? ""
        }?\n\nThis cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(session.id);

    setError("");
    setMessage("");

    const { error: deleteError } =
      await supabase
        .from("programme_sessions")
        .delete()
        .eq("id", session.id);

    if (deleteError) {
      setError(deleteError.message);

      setDeletingId(null);
      return;
    }

    setMessage(
      "Programme session deleted."
    );

    setDeletingId(null);

    await loadProgramme();
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat(
      "en-GB",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Europe/Malta",
      }
    ).format(new Date(date));
  }

  function formatTime(date: string) {
    return new Intl.DateTimeFormat(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/Malta",
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

        <p>Loading programme...</p>
      </div>
    );
  }

  if (!programme) {
    return (
      <div className={styles.page}>
        <Link
          href="/admin/programmes"
          className={styles.backLink}
        >
          <ArrowLeft size={16} />
          Back to programmes
        </Link>

        <div
          className={
            styles.errorMessage
          }
        >
          Programme could not be found.
        </div>
      </div>
    );
  }

  const configuredSessions =
    sessions.length;

  const expectedSessions =
    programme.number_of_sessions ?? 0;

  return (
    <div className={styles.page}>
      <Link
        href="/admin/programmes"
        className={styles.backLink}
      >
        <ArrowLeft size={16} />
        Back to programmes
      </Link>

      <section
        className={styles.pageHeader}
      >
        <div>
          <p className={styles.eyebrow}>
            {programme.category}
          </p>

          <h1>{programme.title}</h1>

          <p className={styles.intro}>
            Manage the individual dates that
            make up this programme.
          </p>
        </div>

        <button
          className={
            styles.primaryButton
          }
          onClick={openSessionForm}
        >
          <Plus size={18} />
          Add session
        </button>
      </section>

      {message && (
        <div
          className={
            styles.successMessage
          }
        >
          <Check size={18} />
          {message}
        </div>
      )}

      {error && (
        <div
          className={
            styles.errorMessage
          }
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
              Sessions configured
            </span>

            <strong>
              {configuredSessions}
              {expectedSessions > 0
                ? ` / ${expectedSessions}`
                : ""}
            </strong>
          </div>
        </div>

        <div className={styles.infoCard}>
          <Clock size={20} />

          <div>
            <span>
              Session duration
            </span>

            <strong>
              {programme.session_duration_minutes
                ? `${programme.session_duration_minutes} min`
                : "Not set"}
            </strong>
          </div>
        </div>

        <div className={styles.infoCard}>
          <span
            className={
              styles.priceSymbol
            }
          >
            €
          </span>

          <div>
            <span>
              Programme price
            </span>

            <strong>
              {programme.base_price !== null
                ? `€${Number(
                    programme.base_price
                  ).toFixed(2)}`
                : "Not set"}
            </strong>
          </div>
        </div>
      </section>

      {expectedSessions > 0 &&
        configuredSessions !==
          expectedSessions && (
          <div
            className={
              styles.sessionNotice
            }
          >
            This programme is configured for{" "}
            <strong>
              {expectedSessions} sessions
            </strong>
            , but currently has{" "}
            <strong>
              {configuredSessions}
            </strong>{" "}
            dates added.
          </div>
        )}

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

              <h2>
                Add programme session
              </h2>
            </div>

            <button
              type="button"
              className={
                styles.closeButton
              }
              onClick={closeSessionForm}
              aria-label="Close form"
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
                <label
                  htmlFor="number"
                >
                  Session number
                </label>

                <input
                  id="number"
                  type="number"
                  min="1"
                  value={
                    form.session_number
                  }
                  onChange={(event) =>
                    updateForm(
                      "session_number",
                      event.target.value
                    )
                  }
                  placeholder="1"
                />
              </div>

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
                  value={
                    form.end_time
                  }
                  onChange={(event) =>
                    updateForm(
                      "end_time",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <p className={styles.hint}>
              If you leave the end time
              empty, Crafteris will calculate
              it automatically from the
              programme&apos;s session
              duration.
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
              PROGRAMME SCHEDULE
            </p>

            <h2>
              Programme sessions
            </h2>
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

            <h3>
              No sessions added yet.
            </h3>

            <p>
              Add each date that forms part
              of this programme.
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
            {sessions.map((session) => (
              <article
                key={session.id}
                className={
                  styles.sessionCard
                }
              >
                <div
                  className={
                    styles.sessionNumber
                  }
                >
                  <span>Session</span>

                  <strong>
                    {session.session_number ??
                      "—"}
                  </strong>
                </div>

                <div
                  className={
                    styles.sessionMain
                  }
                >
                  <h3>
                    {formatDate(
                      session.starts_at
                    )}
                  </h3>

                  <div
                    className={
                      styles.sessionMeta
                    }
                  >
                    <span>
                      <Clock size={14} />

                      {formatTime(
                        session.starts_at
                      )}

                      {session.ends_at &&
                        ` – ${formatTime(
                          session.ends_at
                        )}`}
                    </span>
                  </div>
                </div>

                <button
                  className={
                    styles.deleteButton
                  }
                  onClick={() =>
                    deleteSession(session)
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
                    <Trash2 size={15} />
                  )}

                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}