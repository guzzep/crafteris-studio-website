"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Archive,
  CalendarDays,
  Check,
  Edit3,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

import styles from "./programmes.module.css";

type ProgrammeStatus =
  | "draft"
  | "published"
  | "archived";

type Programme = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  number_of_sessions: number | null;
  session_duration_minutes: number | null;
  level: string | null;
  base_price: number | null;
  status: ProgrammeStatus;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type ProgrammeForm = {
  title: string;
  slug: string;
  category: string;
  short_description: string;
  description: string;
  image_url: string;
  number_of_sessions: string;
  session_duration_minutes: string;
  level: string;
  base_price: string;
  status: ProgrammeStatus;
  is_featured: boolean;
  sort_order: string;
};

const emptyForm: ProgrammeForm = {
  title: "",
  slug: "",
  category: "Pottery",
  short_description: "",
  description: "",
  image_url: "",
  number_of_sessions: "",
  session_duration_minutes: "",
  level: "Beginner friendly",
  base_price: "",
  status: "draft",
  is_featured: false,
  sort_order: "0",
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProgrammesAdminPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [programmes, setProgrammes] = useState<
    Programme[]
  >([]);

  const [form, setForm] =
    useState<ProgrammeForm>(emptyForm);

  const [editingId, setEditingId] = useState<
    string | null
  >(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<
    string | null
  >(null);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const loadProgrammes =
    useCallback(async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("programmes")
        .select("*")
        .order("sort_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setProgrammes(
        (data as Programme[]) ?? []
      );

      setLoading(false);
    }, [supabase]);

  useEffect(() => {
    void loadProgrammes();
  }, [loadProgrammes]);

  function updateForm<
    K extends keyof ProgrammeForm
  >(key: K, value: ProgrammeForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => {
      const shouldUpdateSlug =
        !editingId ||
        current.slug ===
          createSlug(current.title);

      return {
        ...current,
        title: value,
        slug: shouldUpdateSlug
          ? createSlug(value)
          : current.slug,
      };
    });
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
    setFormOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function openEditForm(
    programme: Programme
  ) {
    setEditingId(programme.id);

    setForm({
      title: programme.title,
      slug: programme.slug,
      category: programme.category,

      short_description:
        programme.short_description ?? "",

      description:
        programme.description ?? "",

      image_url:
        programme.image_url ?? "",

      number_of_sessions:
        programme.number_of_sessions?.toString() ??
        "",

      session_duration_minutes:
        programme.session_duration_minutes?.toString() ??
        "",

      level:
        programme.level ?? "",

      base_price:
        programme.base_price?.toString() ?? "",

      status: programme.status,

      is_featured:
        programme.is_featured,

      sort_order:
        programme.sort_order?.toString() ??
        "0",
    });

    setMessage("");
    setError("");
    setFormOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    const title = form.title.trim();

    const slug =
      form.slug.trim() ||
      createSlug(form.title);

    if (!title) {
      setError(
        "Programme title is required."
      );

      setSaving(false);
      return;
    }

    if (!slug) {
      setError(
        "Programme slug is required."
      );

      setSaving(false);
      return;
    }

    const payload = {
      title,
      slug,

      category:
        form.category.trim(),

      short_description:
        form.short_description.trim() ||
        null,

      description:
        form.description.trim() || null,

      image_url:
        form.image_url.trim() || null,

      number_of_sessions:
        form.number_of_sessions === ""
          ? null
          : Number(
              form.number_of_sessions
            ),

      session_duration_minutes:
        form.session_duration_minutes === ""
          ? null
          : Number(
              form.session_duration_minutes
            ),

      level:
        form.level.trim() || null,

      base_price:
        form.base_price === ""
          ? null
          : Number(form.base_price),

      status: form.status,

      is_featured:
        form.is_featured,

      sort_order:
        Number(form.sort_order) || 0,
    };

    if (editingId) {
      const { error } = await supabase
        .from("programmes")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }

      setMessage(
        "Programme updated successfully."
      );
    } else {
      const { error } = await supabase
        .from("programmes")
        .insert(payload);

      if (error) {
        if (
          error.message
            .toLowerCase()
            .includes("duplicate")
        ) {
          setError(
            "That programme URL slug is already being used."
          );
        } else {
          setError(error.message);
        }

        setSaving(false);
        return;
      }

      setMessage(
        "Programme created successfully."
      );
    }

    setSaving(false);
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);

    await loadProgrammes();
  }

  async function handleDelete(
    programme: Programme
  ) {
    const confirmed = window.confirm(
      `Delete "${programme.title}"?\n\nThis cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(programme.id);
    setError("");
    setMessage("");

    const { error } = await supabase
      .from("programmes")
      .delete()
      .eq("id", programme.id);

    if (error) {
      setError(error.message);
      setDeletingId(null);
      return;
    }

    setMessage(
      `"${programme.title}" was deleted.`
    );

    setDeletingId(null);

    await loadProgrammes();
  }

  async function updateStatus(
    programme: Programme,
    status: ProgrammeStatus
  ) {
    setError("");
    setMessage("");

    const { error } = await supabase
      .from("programmes")
      .update({ status })
      .eq("id", programme.id);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      `${programme.title} is now ${status}.`
    );

    await loadProgrammes();
  }

  const filteredProgrammes =
    programmes.filter((programme) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        programme.title
          .toLowerCase()
          .includes(searchValue) ||
        programme.category
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        programme.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const publishedCount =
    programmes.filter(
      (programme) =>
        programme.status === "published"
    ).length;

  const draftCount =
    programmes.filter(
      (programme) =>
        programme.status === "draft"
    ).length;

  return (
    <div className={styles.page}>
      <section
        className={styles.pageHeader}
      >
        <div>
          <p className={styles.eyebrow}>
            COURSES & PROGRAMMES
          </p>

          <h1>Programmes</h1>

          <p className={styles.intro}>
            Manage multi-session pottery and
            glass courses shown on the
            Crafteris website.
          </p>
        </div>

        <button
          className={styles.primaryButton}
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Add programme
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
                {editingId
                  ? "EDIT PROGRAMME"
                  : "NEW PROGRAMME"}
              </p>

              <h2>
                {editingId
                  ? "Update programme"
                  : "Create a programme"}
              </h2>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className={
                styles.closeButton
              }
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className={styles.form}
          >
            <div
              className={styles.formGrid}
            >
              <div
                className={
                  styles.formGroup
                }
              >
                <label htmlFor="title">
                  Programme title *
                </label>

                <input
                  id="title"
                  value={form.title}
                  onChange={(event) =>
                    handleTitleChange(
                      event.target.value
                    )
                  }
                  placeholder="Pottery Foundations"
                  required
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label htmlFor="slug">
                  URL slug *
                </label>

                <input
                  id="slug"
                  value={form.slug}
                  onChange={(event) =>
                    updateForm(
                      "slug",
                      createSlug(
                        event.target.value
                      )
                    )
                  }
                  placeholder="pottery-foundations"
                  required
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label htmlFor="category">
                  Category
                </label>

                <select
                  id="category"
                  value={form.category}
                  onChange={(event) =>
                    updateForm(
                      "category",
                      event.target.value
                    )
                  }
                >
                  <option value="Pottery">
                    Pottery
                  </option>

                  <option value="Glass">
                    Glass
                  </option>

                  <option value="Mixed">
                    Mixed
                  </option>
                </select>
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label htmlFor="level">
                  Level
                </label>

                <select
                  id="level"
                  value={form.level}
                  onChange={(event) =>
                    updateForm(
                      "level",
                      event.target.value
                    )
                  }
                >
                  <option value="Beginner friendly">
                    Beginner friendly
                  </option>

                  <option value="Beginner">
                    Beginner
                  </option>

                  <option value="Intermediate">
                    Intermediate
                  </option>

                  <option value="Advanced">
                    Advanced
                  </option>

                  <option value="All levels">
                    All levels
                  </option>
                </select>
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label
                  htmlFor="sessions"
                >
                  Number of sessions
                </label>

                <input
                  id="sessions"
                  type="number"
                  min="1"
                  value={
                    form.number_of_sessions
                  }
                  onChange={(event) =>
                    updateForm(
                      "number_of_sessions",
                      event.target.value
                    )
                  }
                  placeholder="6"
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label
                  htmlFor="duration"
                >
                  Session duration
                  (minutes)
                </label>

                <input
                  id="duration"
                  type="number"
                  min="1"
                  value={
                    form.session_duration_minutes
                  }
                  onChange={(event) =>
                    updateForm(
                      "session_duration_minutes",
                      event.target.value
                    )
                  }
                  placeholder="120"
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label htmlFor="price">
                  Programme price (€)
                </label>

                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.base_price}
                  onChange={(event) =>
                    updateForm(
                      "base_price",
                      event.target.value
                    )
                  }
                  placeholder="180.00"
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target
                        .value as ProgrammeStatus
                    )
                  }
                >
                  <option value="draft">
                    Draft
                  </option>

                  <option value="published">
                    Published
                  </option>

                  <option value="archived">
                    Archived
                  </option>
                </select>
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label htmlFor="order">
                  Display order
                </label>

                <input
                  id="order"
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={(event) =>
                    updateForm(
                      "sort_order",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div
              className={styles.formGroup}
            >
              <label htmlFor="short">
                Short description
              </label>

              <textarea
                id="short"
                rows={2}
                value={
                  form.short_description
                }
                onChange={(event) =>
                  updateForm(
                    "short_description",
                    event.target.value
                  )
                }
                placeholder="A short description used on programme cards."
              />
            </div>

            <div
              className={styles.formGroup}
            >
              <label htmlFor="description">
                Full description
              </label>

              <textarea
                id="description"
                rows={6}
                value={form.description}
                onChange={(event) =>
                  updateForm(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Describe what participants will learn across the programme..."
              />
            </div>

            <div
              className={styles.formGroup}
            >
              <label>
                Programme image
              </label>

              <ImageUpload
                value={form.image_url}
                onChange={(url) =>
                  updateForm(
                    "image_url",
                    url
                  )
                }
                folder="programmes"
              />
            </div>

            <label
              className={
                styles.checkboxRow
              }
            >
              <input
                type="checkbox"
                checked={
                  form.is_featured
                }
                onChange={(event) =>
                  updateForm(
                    "is_featured",
                    event.target.checked
                  )
                }
              />

              <span>
                <strong>
                  Featured programme
                </strong>

                <small>
                  Featured programmes can
                  appear in highlighted areas
                  of the public website.
                </small>
              </span>
            </label>

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
                onClick={closeForm}
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

                    {editingId
                      ? "Save changes"
                      : "Create programme"}
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      <section
        className={styles.summaryGrid}
      >
        <div className={styles.summaryCard}>
          <span>Total programmes</span>
          <strong>
            {programmes.length}
          </strong>
        </div>

        <div className={styles.summaryCard}>
          <span>Published</span>
          <strong>
            {publishedCount}
          </strong>
        </div>

        <div className={styles.summaryCard}>
          <span>Drafts</span>
          <strong>
            {draftCount}
          </strong>
        </div>
      </section>

      <section
        className={styles.listPanel}
      >
        <div
          className={styles.listToolbar}
        >
          <div
            className={styles.searchBox}
          >
            <Search size={18} />

            <input
              type="search"
              placeholder="Search programmes..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />
          </div>

          <select
            className={
              styles.filterSelect
            }
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All statuses
            </option>

            <option value="published">
              Published
            </option>

            <option value="draft">
              Draft
            </option>

            <option value="archived">
              Archived
            </option>
          </select>
        </div>

        {loading ? (
          <div
            className={styles.loadingState}
          >
            <Loader2
              className={styles.spin}
              size={28}
            />

            <p>
              Loading programmes...
            </p>
          </div>
        ) : filteredProgrammes.length ===
          0 ? (
          <div
            className={styles.emptyState}
          >
            <div
              className={styles.emptyIcon}
            >
              <GraduationCap size={24} />
            </div>

            <h3>
              No programmes found
            </h3>

            <p>
              {programmes.length === 0
                ? "Create your first programme to start managing courses."
                : "No programmes match your current search or filter."}
            </p>

            {programmes.length === 0 && (
              <button
                onClick={openCreateForm}
              >
                <Plus size={16} />
                Add first programme
              </button>
            )}
          </div>
        ) : (
          <div
            className={styles.programmeList}
          >
            {filteredProgrammes.map(
              (programme) => (
                <article
                  className={
                    styles.programmeCard
                  }
                  key={programme.id}
                >
                  <div
                    className={
                      styles.imageWrapper
                    }
                  >
                    {programme.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          programme.image_url
                        }
                        alt={
                          programme.title
                        }
                      />
                    ) : (
                      <div
                        className={
                          styles.noImage
                        }
                      >
                        No image
                      </div>
                    )}

                    {programme.is_featured && (
                      <span
                        className={
                          styles.featuredBadge
                        }
                      >
                        <Star size={12} />
                        Featured
                      </span>
                    )}
                  </div>

                  <div
                    className={
                      styles.programmeContent
                    }
                  >
                    <div
                      className={
                        styles.cardTop
                      }
                    >
                      <div>
                        <span
                          className={
                            styles.category
                          }
                        >
                          {
                            programme.category
                          }
                        </span>

                        <h3>
                          {programme.title}
                        </h3>
                      </div>

                      <StatusBadge
                        status={
                          programme.status
                        }
                      />
                    </div>

                    <p
                      className={
                        styles.description
                      }
                    >
                      {programme.short_description ||
                        "No short description added yet."}
                    </p>

                    <div
                      className={
                        styles.details
                      }
                    >
                      <span>
                        {programme.number_of_sessions
                          ? `${programme.number_of_sessions} sessions`
                          : "Sessions not set"}
                      </span>

                      <span>
                        {programme.session_duration_minutes
                          ? `${programme.session_duration_minutes} min/session`
                          : "Duration not set"}
                      </span>

                      <span>
                        {programme.base_price !==
                        null
                          ? `€${Number(
                              programme.base_price
                            ).toFixed(2)}`
                          : "Price not set"}
                      </span>

                      <span>
                        {programme.level ||
                          "Level not set"}
                      </span>
                    </div>

                    <div
                      className={
                        styles.cardActions
                      }
                    >
                      <Link
                        href={`/admin/programmes/${programme.id}`}
                        className={
                          styles.manageDatesButton
                        }
                      >
                        <CalendarDays
                          size={15}
                        />
                        Manage dates
                      </Link>

                      <button
                        onClick={() =>
                          openEditForm(
                            programme
                          )
                        }
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>

                      {programme.status !==
                        "published" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              programme,
                              "published"
                            )
                          }
                        >
                          <Eye size={15} />
                          Publish
                        </button>
                      )}

                      {programme.status ===
                        "published" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              programme,
                              "draft"
                            )
                          }
                        >
                          <EyeOff size={15} />
                          Unpublish
                        </button>
                      )}

                      {programme.status !==
                        "archived" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              programme,
                              "archived"
                            )
                          }
                        >
                          <Archive
                            size={15}
                          />
                          Archive
                        </button>
                      )}

                      <button
                        className={
                          styles.deleteButton
                        }
                        disabled={
                          deletingId ===
                          programme.id
                        }
                        onClick={() =>
                          handleDelete(
                            programme
                          )
                        }
                      >
                        {deletingId ===
                        programme.id ? (
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
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: ProgrammeStatus;
}) {
  return (
    <span
      className={`${styles.statusBadge} ${
        styles[
          `status${status
            .charAt(0)
            .toUpperCase()}${status.slice(
            1
          )}`
        ]
      }`}
    >
      {status}
    </span>
  );
}