"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Archive,
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

import styles from "./memberships.module.css";

type MembershipStatus =
  | "draft"
  | "published"
  | "archived";

type MembershipPlan = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number | null;
  billing_label: string | null;
  included_hours: number | null;
  validity_months: number | null;
  hours_per_week: number | null;
  features: string[] | null;
  image_url: string | null;
  status: MembershipStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type MembershipForm = {
  name: string;
  slug: string;
  category: string;
  description: string;
  price: string;
  billing_label: string;
  included_hours: string;
  validity_months: string;
  hours_per_week: string;
  features: string[];
  image_url: string;
  status: MembershipStatus;
  sort_order: string;
};

const emptyForm: MembershipForm = {
  name: "",
  slug: "",
  category: "Membership",
  description: "",
  price: "",
  billing_label: "per month",
  included_hours: "",
  validity_months: "",
  hours_per_week: "",
  features: [""],
  image_url: "",
  status: "draft",
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

function formatNumber(value: number | null) {
  if (value === null) {
    return "—";
  }

  if (Number.isInteger(value)) {
    return value.toString();
  }

  return Number(value).toFixed(1);
}

export default function MembershipsAdminPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [
    memberships,
    setMemberships,
  ] = useState<MembershipPlan[]>([]);

  const [form, setForm] =
    useState<MembershipForm>(emptyForm);

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
  ] = useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const loadMemberships =
    useCallback(async () => {
      setLoading(true);
      setError("");

      const { data, error } =
        await supabase
          .from("membership_plans")
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

      setMemberships(
        (data as MembershipPlan[]) ?? []
      );

      setLoading(false);
    }, [supabase]);

  useEffect(() => {
    void loadMemberships();
  }, [loadMemberships]);

  function updateForm<
    K extends keyof MembershipForm
  >(
    key: K,
    value: MembershipForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleNameChange(
    value: string
  ) {
    setForm((current) => {
      const shouldUpdateSlug =
        !editingId ||
        current.slug ===
          createSlug(current.name);

      return {
        ...current,
        name: value,
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
    membership: MembershipPlan
  ) {
    setEditingId(membership.id);

    setForm({
      name: membership.name,
      slug: membership.slug,
      category:
        membership.category ||
        "Membership",

      description:
        membership.description ?? "",

      price:
        membership.price?.toString() ??
        "",

      billing_label:
        membership.billing_label ??
        "",

      included_hours:
        membership.included_hours?.toString() ??
        "",

      validity_months:
        membership.validity_months?.toString() ??
        "",

      hours_per_week:
        membership.hours_per_week?.toString() ??
        "",

      features:
        membership.features &&
        membership.features.length > 0
          ? membership.features
          : [""],

      image_url:
        membership.image_url ?? "",

      status: membership.status,

      sort_order:
        membership.sort_order?.toString() ??
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

  function updateFeature(
    index: number,
    value: string
  ) {
    setForm((current) => {
      const nextFeatures = [
        ...current.features,
      ];

      nextFeatures[index] = value;

      return {
        ...current,
        features: nextFeatures,
      };
    });
  }

  function addFeature() {
    setForm((current) => ({
      ...current,
      features: [
        ...current.features,
        "",
      ],
    }));
  }

  function removeFeature(
    index: number
  ) {
    setForm((current) => {
      const nextFeatures =
        current.features.filter(
          (_, featureIndex) =>
            featureIndex !== index
        );

      return {
        ...current,
        features:
          nextFeatures.length > 0
            ? nextFeatures
            : [""],
      };
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    const name = form.name.trim();

    const slug =
      form.slug.trim() ||
      createSlug(name);

    if (!name) {
      setError(
        "Membership name is required."
      );

      setSaving(false);
      return;
    }

    if (!slug) {
      setError(
        "Membership slug is required."
      );

      setSaving(false);
      return;
    }

    const cleanFeatures =
      form.features
        .map((feature) =>
          feature.trim()
        )
        .filter(Boolean);

    const payload = {
      name,
      slug,

      category:
        form.category.trim() ||
        "Membership",

      description:
        form.description.trim() ||
        null,

      price:
        form.price === ""
          ? null
          : Number(form.price),

      billing_label:
        form.billing_label.trim() ||
        null,

      included_hours:
        form.included_hours === ""
          ? null
          : Number(
              form.included_hours
            ),

      validity_months:
        form.validity_months === ""
          ? null
          : Number(
              form.validity_months
            ),

      hours_per_week:
        form.hours_per_week === ""
          ? null
          : Number(
              form.hours_per_week
            ),

      features: cleanFeatures,

      image_url:
        form.image_url.trim() ||
        null,

      status: form.status,

      sort_order:
        Number(form.sort_order) || 0,
    };

    if (editingId) {
      const { error } =
        await supabase
          .from("membership_plans")
          .update(payload)
          .eq("id", editingId);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }

      setMessage(
        "Membership updated successfully."
      );
    } else {
      const { error } =
        await supabase
          .from("membership_plans")
          .insert(payload);

      if (error) {
        if (
          error.message
            .toLowerCase()
            .includes("duplicate")
        ) {
          setError(
            "That membership URL slug is already being used."
          );
        } else {
          setError(error.message);
        }

        setSaving(false);
        return;
      }

      setMessage(
        "Membership created successfully."
      );
    }

    setSaving(false);
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);

    await loadMemberships();
  }

  async function handleDelete(
    membership: MembershipPlan
  ) {
    const confirmed =
      window.confirm(
        `Delete "${membership.name}"?\n\nThis cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(membership.id);
    setMessage("");
    setError("");

    const { error } =
      await supabase
        .from("membership_plans")
        .delete()
        .eq("id", membership.id);

    if (error) {
      setError(error.message);
      setDeletingId(null);
      return;
    }

    setMessage(
      `"${membership.name}" was deleted.`
    );

    setDeletingId(null);

    await loadMemberships();
  }

  async function updateStatus(
    membership: MembershipPlan,
    status: MembershipStatus
  ) {
    setMessage("");
    setError("");

    const { error } =
      await supabase
        .from("membership_plans")
        .update({ status })
        .eq("id", membership.id);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      `${membership.name} is now ${status}.`
    );

    await loadMemberships();
  }

  const filteredMemberships =
    memberships.filter(
      (membership) => {
        const searchValue =
          search.toLowerCase();

        const matchesSearch =
          membership.name
            .toLowerCase()
            .includes(searchValue) ||
          membership.category
            .toLowerCase()
            .includes(searchValue);

        const matchesStatus =
          statusFilter === "all" ||
          membership.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  const publishedCount =
    memberships.filter(
      (membership) =>
        membership.status ===
        "published"
    ).length;

  const draftCount =
    memberships.filter(
      (membership) =>
        membership.status === "draft"
    ).length;

  return (
    <div className={styles.page}>
      <section
        className={styles.pageHeader}
      >
        <div>
          <p className={styles.eyebrow}>
            STUDIO ACCESS
          </p>

          <h1>Memberships</h1>

          <p className={styles.intro}>
            Create and manage studio
            membership plans, passes and
            recurring access options.
          </p>
        </div>

        <button
          className={
            styles.primaryButton
          }
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Add membership
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
                  ? "EDIT MEMBERSHIP"
                  : "NEW MEMBERSHIP"}
              </p>

              <h2>
                {editingId
                  ? "Update membership"
                  : "Create a membership"}
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
              className={
                styles.formGrid
              }
            >
              <div
                className={
                  styles.formGroup
                }
              >
                <label htmlFor="name">
                  Membership name *
                </label>

                <input
                  id="name"
                  value={form.name}
                  onChange={(event) =>
                    handleNameChange(
                      event.target.value
                    )
                  }
                  placeholder="Maker Light"
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
                  placeholder="maker-light"
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
                  value={form.category}
                  onChange={(event) =>
                    updateForm(
                      "category",
                      event.target.value
                    )
                  }
                >
                  <option value="Membership">
                    Membership
                  </option>

                  <option value="Hours Pack">
                    Hours Pack
                  </option>

                  <option value="Unlimited">
                    Unlimited
                  </option>

                  <option value="Pay As You Go">
                    Pay As You Go
                  </option>

                  <option value="Maker Plan">
                    Maker Plan
                  </option>
                </select>
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label htmlFor="price">
                  Price (€)
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
                  placeholder="79.00"
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label
                  htmlFor="billing"
                >
                  Billing label
                </label>

                <input
                  id="billing"
                  value={
                    form.billing_label
                  }
                  onChange={(event) =>
                    updateForm(
                      "billing_label",
                      event.target.value
                    )
                  }
                  placeholder="per month"
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label
                  htmlFor="includedHours"
                >
                  Included hours
                </label>

                <input
                  id="includedHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={
                    form.included_hours
                  }
                  onChange={(event) =>
                    updateForm(
                      "included_hours",
                      event.target.value
                    )
                  }
                  placeholder="20"
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label
                  htmlFor="hoursPerWeek"
                >
                  Hours per week
                </label>

                <input
                  id="hoursPerWeek"
                  type="number"
                  min="0"
                  step="0.5"
                  value={
                    form.hours_per_week
                  }
                  onChange={(event) =>
                    updateForm(
                      "hours_per_week",
                      event.target.value
                    )
                  }
                  placeholder="4"
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label
                  htmlFor="validity"
                >
                  Validity in months
                </label>

                <input
                  id="validity"
                  type="number"
                  min="1"
                  value={
                    form.validity_months
                  }
                  onChange={(event) =>
                    updateForm(
                      "validity_months",
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
                  htmlFor="status"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target
                        .value as MembershipStatus
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
              className={
                styles.formGroup
              }
            >
              <label
                htmlFor="description"
              >
                Description
              </label>

              <textarea
                id="description"
                rows={5}
                value={
                  form.description
                }
                onChange={(event) =>
                  updateForm(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Explain who this membership is for and how it works..."
              />
            </div>

            <div
              className={
                styles.featuresSection
              }
            >
              <div
                className={
                  styles.featuresHeading
                }
              >
                <div>
                  <label>
                    Membership features
                  </label>

                  <p>
                    These will appear as
                    bullet points on the
                    membership card.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addFeature}
                  className={
                    styles.addFeatureButton
                  }
                >
                  <Plus size={15} />
                  Add feature
                </button>
              </div>

              <div
                className={
                  styles.featureList
                }
              >
                {form.features.map(
                  (feature, index) => (
                    <div
                      className={
                        styles.featureRow
                      }
                      key={index}
                    >
                      <span>
                        {index + 1}
                      </span>

                      <input
                        value={feature}
                        onChange={(event) =>
                          updateFeature(
                            index,
                            event.target
                              .value
                          )
                        }
                        placeholder="Firings included"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeFeature(
                            index
                          )
                        }
                        aria-label="Remove feature"
                      >
                        <Trash2
                          size={15}
                        />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label>
                Membership image
              </label>

              <ImageUpload
                value={form.image_url}
                onChange={(url) =>
                  updateForm(
                    "image_url",
                    url
                  )
                }
                folder="memberships"
              />
            </div>

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
                      : "Create membership"}
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
        <div
          className={
            styles.summaryCard
          }
        >
          <span>Total plans</span>

          <strong>
            {memberships.length}
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
        className={styles.listPanel}
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
            <Search size={18} />

            <input
              type="search"
              placeholder="Search memberships..."
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
              Loading memberships...
            </p>
          </div>
        ) : filteredMemberships.length ===
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
              <Star size={24} />
            </div>

            <h3>
              No memberships found
            </h3>

            <p>
              {memberships.length === 0
                ? "Create your first membership plan."
                : "No memberships match your current search or filter."}
            </p>

            {memberships.length ===
              0 && (
              <button
                onClick={
                  openCreateForm
                }
              >
                <Plus size={16} />
                Add first membership
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              styles.membershipList
            }
          >
            {filteredMemberships.map(
              (membership) => (
                <article
                  key={membership.id}
                  className={
                    styles.membershipCard
                  }
                >
                  <div
                    className={
                      styles.imageWrapper
                    }
                  >
                    {membership.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          membership.image_url
                        }
                        alt={
                          membership.name
                        }
                      />
                    ) : (
                      <div
                        className={
                          styles.noImage
                        }
                      >
                        Membership
                      </div>
                    )}
                  </div>

                  <div
                    className={
                      styles.membershipContent
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
                            membership.category
                          }
                        </span>

                        <h3>
                          {
                            membership.name
                          }
                        </h3>
                      </div>

                      <StatusBadge
                        status={
                          membership.status
                        }
                      />
                    </div>

                    <p
                      className={
                        styles.description
                      }
                    >
                      {membership.description ||
                        "No description added yet."}
                    </p>

                    <div
                      className={
                        styles.priceRow
                      }
                    >
                      <strong>
                        {membership.price !==
                        null
                          ? `€${Number(
                              membership.price
                            ).toFixed(2)}`
                          : "Price not set"}
                      </strong>

                      {membership.billing_label && (
                        <span>
                          {
                            membership.billing_label
                          }
                        </span>
                      )}
                    </div>

                    <div
                      className={
                        styles.details
                      }
                    >
                      {membership.included_hours !==
                        null && (
                        <span>
                          {formatNumber(
                            membership.included_hours
                          )}{" "}
                          included hours
                        </span>
                      )}

                      {membership.hours_per_week !==
                        null && (
                        <span>
                          {formatNumber(
                            membership.hours_per_week
                          )}{" "}
                          hrs/week
                        </span>
                      )}

                      {membership.validity_months !==
                        null && (
                        <span>
                          {
                            membership.validity_months
                          }{" "}
                          month validity
                        </span>
                      )}
                    </div>

                    {membership.features &&
                      membership.features
                        .length > 0 && (
                        <ul
                          className={
                            styles.featurePreview
                          }
                        >
                          {membership.features
                            .slice(0, 3)
                            .map(
                              (
                                feature,
                                index
                              ) => (
                                <li
                                  key={
                                    index
                                  }
                                >
                                  <Check
                                    size={
                                      13
                                    }
                                  />

                                  {
                                    feature
                                  }
                                </li>
                              )
                            )}

                          {membership.features
                            .length >
                            3 && (
                            <li
                              className={
                                styles.moreFeatures
                              }
                            >
                              +
                              {membership
                                .features
                                .length -
                                3}{" "}
                              more
                            </li>
                          )}
                        </ul>
                      )}

                    <div
                      className={
                        styles.cardActions
                      }
                    >
                      <button
                        onClick={() =>
                          openEditForm(
                            membership
                          )
                        }
                      >
                        <Edit3
                          size={15}
                        />
                        Edit
                      </button>

                      {membership.status !==
                        "published" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              membership,
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

                      {membership.status ===
                        "published" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              membership,
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

                      {membership.status !==
                        "archived" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              membership,
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
                          membership.id
                        }
                        onClick={() =>
                          handleDelete(
                            membership
                          )
                        }
                      >
                        {deletingId ===
                        membership.id ? (
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
  status: MembershipStatus;
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