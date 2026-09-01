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
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import ImageUpload from "@/components/admin/ImageUpload";

import styles from "./workshops.module.css";

type WorkshopStatus =
  | "draft"
  | "published"
  | "archived";

type Workshop = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  duration_minutes: number | null;
  level: string | null;
  base_price: number | null;
  status: WorkshopStatus;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type WorkshopForm = {
  title: string;
  slug: string;
  category: string;
  short_description: string;
  description: string;
  image_url: string;
  duration_minutes: string;
  level: string;
  base_price: string;
  status: WorkshopStatus;
  is_featured: boolean;
  sort_order: string;
};

const emptyForm: WorkshopForm = {
  title: "",
  slug: "",
  category: "Pottery",
  short_description: "",
  description: "",
  image_url: "",
  duration_minutes: "",
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

export default function WorkshopsAdminPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [workshops, setWorkshops] =
    useState<Workshop[]>([]);

  const [form, setForm] =
    useState<WorkshopForm>(
      emptyForm
    );

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(
    null
  );

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [
    formOpen,
    setFormOpen,
  ] = useState(false);

  const loadWorkshops =
    useCallback(async () => {
      setLoading(true);
      setError("");

      const { data, error } =
        await supabase
          .from("workshops")
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

      setWorkshops(
        (data as Workshop[]) ??
          []
      );

      setLoading(false);
    }, [supabase]);

  useEffect(() => {
    void loadWorkshops();
  }, [loadWorkshops]);

  function updateForm<
    K extends keyof WorkshopForm,
  >(
    key: K,
    value: WorkshopForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleTitleChange(
    value: string
  ) {
    setForm((current) => {
      const shouldUpdateSlug =
        !editingId ||
        current.slug ===
          createSlug(
            current.title
          );

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
    workshop: Workshop
  ) {
    setEditingId(workshop.id);

    setForm({
      title: workshop.title,

      slug: workshop.slug,

      category:
        workshop.category,

      short_description:
        workshop.short_description ??
        "",

      description:
        workshop.description ??
        "",

      image_url:
        workshop.image_url ?? "",

      duration_minutes:
        workshop.duration_minutes?.toString() ??
        "",

      level:
        workshop.level ?? "",

      base_price:
        workshop.base_price?.toString() ??
        "",

      status:
        workshop.status,

      is_featured:
        workshop.is_featured,

      sort_order:
        workshop.sort_order?.toString() ??
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

    const title =
      form.title.trim();

    const slug =
      form.slug.trim() ||
      createSlug(form.title);

    if (!title) {
      setError(
        "Workshop title is required."
      );

      setSaving(false);

      return;
    }

    if (!slug) {
      setError(
        "Workshop slug is required."
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
        form.description.trim() ||
        null,

      image_url:
        form.image_url.trim() ||
        null,

      duration_minutes:
        form.duration_minutes ===
        ""
          ? null
          : Number(
              form.duration_minutes
            ),

      level:
        form.level.trim() ||
        null,

      base_price:
        form.base_price === ""
          ? null
          : Number(
              form.base_price
            ),

      status: form.status,

      is_featured:
        form.is_featured,

      sort_order:
        Number(
          form.sort_order
        ) || 0,
    };

    if (editingId) {
      const { error } =
        await supabase
          .from("workshops")
          .update(payload)
          .eq(
            "id",
            editingId
          );

      if (error) {
        setError(
          error.message
        );

        setSaving(false);

        return;
      }

      setMessage(
        "Workshop updated successfully."
      );
    } else {
      const { error } =
        await supabase
          .from("workshops")
          .insert(payload);

      if (error) {
        if (
          error.message
            .toLowerCase()
            .includes(
              "duplicate"
            )
        ) {
          setError(
            "That workshop URL slug is already being used."
          );
        } else {
          setError(
            error.message
          );
        }

        setSaving(false);

        return;
      }

      setMessage(
        "Workshop created successfully."
      );
    }

    setSaving(false);

    setFormOpen(false);

    setEditingId(null);

    setForm(emptyForm);

    await loadWorkshops();
  }

  async function handleDelete(
    workshop: Workshop
  ) {
    const confirmed =
      window.confirm(
        `Delete "${workshop.title}"?\n\nThis cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(
      workshop.id
    );

    setError("");
    setMessage("");

    const { error } =
      await supabase
        .from("workshops")
        .delete()
        .eq(
          "id",
          workshop.id
        );

    if (error) {
      setError(
        error.message
      );

      setDeletingId(null);

      return;
    }

    setMessage(
      `"${workshop.title}" was deleted.`
    );

    setDeletingId(null);

    await loadWorkshops();
  }

  async function updateStatus(
    workshop: Workshop,
    status: WorkshopStatus
  ) {
    setError("");
    setMessage("");

    const { error } =
      await supabase
        .from("workshops")
        .update({
          status,
        })
        .eq(
          "id",
          workshop.id
        );

    if (error) {
      setError(
        error.message
      );

      return;
    }

    setMessage(
      `${workshop.title} is now ${status}.`
    );

    await loadWorkshops();
  }

  const filteredWorkshops =
    workshops.filter(
      (workshop) => {
        const searchValue =
          search.toLowerCase();

        const matchesSearch =
          workshop.title
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          workshop.category
            .toLowerCase()
            .includes(
              searchValue
            );

        const matchesStatus =
          statusFilter ===
            "all" ||
          workshop.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  const publishedCount =
    workshops.filter(
      (workshop) =>
        workshop.status ===
        "published"
    ).length;

  const draftCount =
    workshops.filter(
      (workshop) =>
        workshop.status ===
        "draft"
    ).length;

  return (
    <div className={styles.page}>
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
            EXPERIENCES
          </p>

          <h1>Workshops</h1>

          <p
            className={
              styles.intro
            }
          >
            Create, edit and
            publish the workshops
            shown on the Crafteris
            website.
          </p>
        </div>

        <button
          className={
            styles.primaryButton
          }
          onClick={
            openCreateForm
          }
        >
          <Plus size={18} />

          Add workshop
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

      {formOpen && (
        <section
          className={
            styles.formPanel
          }
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
                  ? "EDIT WORKSHOP"
                  : "NEW WORKSHOP"}
              </p>

              <h2>
                {editingId
                  ? "Update workshop"
                  : "Create a workshop"}
              </h2>
            </div>

            <button
              type="button"
              onClick={
                closeForm
              }
              className={
                styles.closeButton
              }
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className={
              styles.form
            }
          >
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
                  htmlFor="title"
                >
                  Workshop title *
                </label>

                <input
                  id="title"
                  value={
                    form.title
                  }
                  onChange={(
                    event
                  ) =>
                    handleTitleChange(
                      event.target
                        .value
                    )
                  }
                  placeholder="Fused Glass Workshop"
                  required
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label
                  htmlFor="slug"
                >
                  URL slug *
                </label>

                <input
                  id="slug"
                  value={
                    form.slug
                  }
                  onChange={(
                    event
                  ) =>
                    updateForm(
                      "slug",
                      createSlug(
                        event.target
                          .value
                      )
                    )
                  }
                  placeholder="fused-glass"
                  required
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label
                  htmlFor="category"
                >
                  Category
                </label>

                <select
                  id="category"
                  value={
                    form.category
                  }
                  onChange={(
                    event
                  ) =>
                    updateForm(
                      "category",
                      event.target
                        .value
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
                <label
                  htmlFor="level"
                >
                  Level
                </label>

                <select
                  id="level"
                  value={
                    form.level
                  }
                  onChange={(
                    event
                  ) =>
                    updateForm(
                      "level",
                      event.target
                        .value
                    )
                  }
                >
                  <option value="Beginner friendly">
                    Beginner
                    friendly
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
                  htmlFor="duration"
                >
                  Duration in
                  minutes
                </label>

                <input
                  id="duration"
                  type="number"
                  min="1"
                  value={
                    form.duration_minutes
                  }
                  onChange={(
                    event
                  ) =>
                    updateForm(
                      "duration_minutes",
                      event.target
                        .value
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
                <label
                  htmlFor="price"
                >
                  Base price (€)
                </label>

                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.base_price
                  }
                  onChange={(
                    event
                  ) =>
                    updateForm(
                      "base_price",
                      event.target
                        .value
                    )
                  }
                  placeholder="28.00"
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label
                  htmlFor="status"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={
                    form.status
                  }
                  onChange={(
                    event
                  ) =>
                    updateForm(
                      "status",
                      event.target
                        .value as WorkshopStatus
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
                <label
                  htmlFor="order"
                >
                  Display order
                </label>

                <input
                  id="order"
                  type="number"
                  min="0"
                  value={
                    form.sort_order
                  }
                  onChange={(
                    event
                  ) =>
                    updateForm(
                      "sort_order",
                      event.target
                        .value
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
                htmlFor="short"
              >
                Short description
              </label>

              <textarea
                id="short"
                rows={2}
                value={
                  form.short_description
                }
                onChange={(
                  event
                ) =>
                  updateForm(
                    "short_description",
                    event.target
                      .value
                  )
                }
                placeholder="A short description used on workshop cards."
              />
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="description"
              >
                Full description
              </label>

              <textarea
                id="description"
                rows={6}
                value={
                  form.description
                }
                onChange={(
                  event
                ) =>
                  updateForm(
                    "description",
                    event.target
                      .value
                  )
                }
                placeholder="Tell visitors what they will make and what to expect..."
              />
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label>
                Workshop image
              </label>

              <ImageUpload
                value={
                  form.image_url
                }
                onChange={(url) =>
                  updateForm(
                    "image_url",
                    url
                  )
                }
                folder="workshops"
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
                onChange={(
                  event
                ) =>
                  updateForm(
                    "is_featured",
                    event.target
                      .checked
                  )
                }
              />

              <span>
                <strong>
                  Featured
                  workshop
                </strong>

                <small>
                  Featured
                  workshops can
                  appear in
                  highlighted
                  areas of the
                  website.
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
                onClick={
                  closeForm
                }
              >
                Cancel
              </button>

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
                      size={17}
                      className={
                        styles.spin
                      }
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Check
                      size={17}
                    />

                    {editingId
                      ? "Save changes"
                      : "Create workshop"}
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      <section
        className={
          styles.summaryGrid
        }
      >
        <div
          className={
            styles.summaryCard
          }
        >
          <span>
            Total workshops
          </span>

          <strong>
            {workshops.length}
          </strong>
        </div>

        <div
          className={
            styles.summaryCard
          }
        >
          <span>Published</span>

          <strong>
            {publishedCount}
          </strong>
        </div>

        <div
          className={
            styles.summaryCard
          }
        >
          <span>Drafts</span>

          <strong>
            {draftCount}
          </strong>
        </div>
      </section>

      <section
        className={
          styles.listPanel
        }
      >
        <div
          className={
            styles.listToolbar
          }
        >
          <div
            className={
              styles.searchBox
            }
          >
            <Search
              size={18}
            />

            <input
              type="search"
              placeholder="Search workshops..."
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
            />
          </div>

          <select
            className={
              styles.filterSelect
            }
            value={
              statusFilter
            }
            onChange={(
              event
            ) =>
              setStatusFilter(
                event.target
                  .value
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
            className={
              styles.loadingState
            }
          >
            <Loader2
              className={
                styles.spin
              }
              size={28}
            />

            <p>
              Loading
              workshops...
            </p>
          </div>
        ) : filteredWorkshops.length ===
          0 ? (
          <div
            className={
              styles.emptyState
            }
          >
            <div
              className={
                styles.emptyIcon
              }
            >
              <Plus
                size={24}
              />
            </div>

            <h3>
              No workshops found
            </h3>

            <p>
              {workshops.length ===
              0
                ? "Create your first workshop to start managing studio experiences."
                : "No workshops match your current search or filter."}
            </p>

            {workshops.length ===
              0 && (
              <button
                onClick={
                  openCreateForm
                }
              >
                <Plus
                  size={16}
                />

                Add first
                workshop
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              styles.workshopList
            }
          >
            {filteredWorkshops.map(
              (
                workshop
              ) => (
                <article
                  className={
                    styles.workshopCard
                  }
                  key={
                    workshop.id
                  }
                >
                  <div
                    className={
                      styles.imageWrapper
                    }
                  >
                    {workshop.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          workshop.image_url
                        }
                        alt={
                          workshop.title
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

                    {workshop.is_featured && (
                      <span
                        className={
                          styles.featuredBadge
                        }
                      >
                        <Star
                          size={12}
                        />

                        Featured
                      </span>
                    )}
                  </div>

                  <div
                    className={
                      styles.workshopContent
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
                            workshop.category
                          }
                        </span>

                        <h3>
                          {
                            workshop.title
                          }
                        </h3>
                      </div>

                      <StatusBadge
                        status={
                          workshop.status
                        }
                      />
                    </div>

                    <p
                      className={
                        styles.description
                      }
                    >
                      {workshop.short_description ||
                        "No short description added yet."}
                    </p>

                    <div
                      className={
                        styles.details
                      }
                    >
                      <span>
                        {workshop.duration_minutes
                          ? `${workshop.duration_minutes} min`
                          : "Duration not set"}
                      </span>

                      <span>
                        {workshop.base_price !==
                        null
                          ? `€${Number(
                              workshop.base_price
                            ).toFixed(
                              2
                            )}`
                          : "Price not set"}
                      </span>

                      <span>
                        {workshop.level ||
                          "Level not set"}
                      </span>
                    </div>

                    <div
                      className={
                        styles.cardActions
                      }
                    >
                      <Link
                        href={`/admin/workshops/${workshop.id}`}
                        className={
                          styles.manageDatesButton
                        }
                      >
                        <CalendarDays
                          size={15}
                        />

                        Manage
                        dates
                      </Link>

                      <button
                        onClick={() =>
                          openEditForm(
                            workshop
                          )
                        }
                      >
                        <Edit3
                          size={15}
                        />

                        Edit
                      </button>

                      {workshop.status !==
                        "published" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              workshop,
                              "published"
                            )
                          }
                        >
                          <Eye
                            size={15}
                          />

                          Publish
                        </button>
                      )}

                      {workshop.status ===
                        "published" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              workshop,
                              "draft"
                            )
                          }
                        >
                          <EyeOff
                            size={15}
                          />

                          Unpublish
                        </button>
                      )}

                      {workshop.status !==
                        "archived" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              workshop,
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
                          workshop.id
                        }
                        onClick={() =>
                          handleDelete(
                            workshop
                          )
                        }
                      >
                        {deletingId ===
                        workshop.id ? (
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
  status: WorkshopStatus;
}) {
  return (
    <span
      className={`${
        styles.statusBadge
      } ${
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