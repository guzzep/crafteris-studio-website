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
  Gift,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import styles from "./gift-vouchers.module.css";

type VoucherStatus =
  | "draft"
  | "published"
  | "archived";

type GiftVoucher = {
  id: string;
  name: string;
  amount: number | null;
  description: string | null;
  is_custom_amount: boolean;
  status: VoucherStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type VoucherForm = {
  name: string;
  amount: string;
  description: string;
  is_custom_amount: boolean;
  status: VoucherStatus;
  sort_order: string;
};

const emptyForm: VoucherForm = {
  name: "",
  amount: "",
  description: "",
  is_custom_amount: false,
  status: "draft",
  sort_order: "0",
};

export default function GiftVouchersAdminPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [vouchers, setVouchers] =
    useState<GiftVoucher[]>([]);

  const [form, setForm] =
    useState<VoucherForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

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

  const loadVouchers =
    useCallback(async () => {
      setLoading(true);
      setError("");

      const { data, error } =
        await supabase
          .from("gift_voucher_options")
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

      setVouchers(
        (data as GiftVoucher[]) ?? []
      );

      setLoading(false);
    }, [supabase]);

  useEffect(() => {
    void loadVouchers();
  }, [loadVouchers]);

  function updateForm<
    K extends keyof VoucherForm
  >(
    key: K,
    value: VoucherForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
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
    voucher: GiftVoucher
  ) {
    setEditingId(voucher.id);

    setForm({
      name: voucher.name,

      amount:
        voucher.amount?.toString() ?? "",

      description:
        voucher.description ?? "",

      is_custom_amount:
        voucher.is_custom_amount,

      status: voucher.status,

      sort_order:
        voucher.sort_order?.toString() ??
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
    setEditingId(null);

    setForm(emptyForm);

    setFormOpen(false);

    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);

    setMessage("");
    setError("");

    const name = form.name.trim();

    if (!name) {
      setError(
        "Voucher name is required."
      );

      setSaving(false);
      return;
    }

    if (
      !form.is_custom_amount &&
      form.amount === ""
    ) {
      setError(
        "Add an amount or enable custom amount."
      );

      setSaving(false);
      return;
    }

    const amount =
      form.is_custom_amount ||
      form.amount === ""
        ? null
        : Number(form.amount);

    if (
      amount !== null &&
      (Number.isNaN(amount) ||
        amount <= 0)
    ) {
      setError(
        "Voucher amount must be greater than €0."
      );

      setSaving(false);
      return;
    }

    const payload = {
      name,

      amount,

      description:
        form.description.trim() ||
        null,

      is_custom_amount:
        form.is_custom_amount,

      status: form.status,

      sort_order:
        Number(form.sort_order) || 0,
    };

    if (editingId) {
      const { error } =
        await supabase
          .from(
            "gift_voucher_options"
          )
          .update(payload)
          .eq("id", editingId);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }

      setMessage(
        "Gift voucher updated successfully."
      );
    } else {
      const { error } =
        await supabase
          .from(
            "gift_voucher_options"
          )
          .insert(payload);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }

      setMessage(
        "Gift voucher created successfully."
      );
    }

    setSaving(false);

    setEditingId(null);

    setForm(emptyForm);

    setFormOpen(false);

    await loadVouchers();
  }

  async function updateStatus(
    voucher: GiftVoucher,
    status: VoucherStatus
  ) {
    setMessage("");
    setError("");

    const { error } =
      await supabase
        .from(
          "gift_voucher_options"
        )
        .update({ status })
        .eq("id", voucher.id);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      `${voucher.name} is now ${status}.`
    );

    await loadVouchers();
  }

  async function handleDelete(
    voucher: GiftVoucher
  ) {
    const confirmed =
      window.confirm(
        `Delete "${voucher.name}"?\n\nThis cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(voucher.id);

    setMessage("");
    setError("");

    const { error } =
      await supabase
        .from(
          "gift_voucher_options"
        )
        .delete()
        .eq("id", voucher.id);

    if (error) {
      setError(error.message);

      setDeletingId(null);
      return;
    }

    setMessage(
      `"${voucher.name}" was deleted.`
    );

    setDeletingId(null);

    await loadVouchers();
  }

  const filteredVouchers =
    vouchers.filter((voucher) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        voucher.name
          .toLowerCase()
          .includes(searchValue) ||
        (voucher.description ?? "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        voucher.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const publishedCount =
    vouchers.filter(
      (voucher) =>
        voucher.status ===
        "published"
    ).length;

  const customCount =
    vouchers.filter(
      (voucher) =>
        voucher.is_custom_amount
    ).length;

  return (
    <div className={styles.page}>
      <section
        className={styles.pageHeader}
      >
        <div>
          <p className={styles.eyebrow}>
            GIFTS
          </p>

          <h1>Gift Vouchers</h1>

          <p className={styles.intro}>
            Create and manage gift voucher
            options shown on the public
            website.
          </p>
        </div>

        <button
          className={
            styles.primaryButton
          }
          onClick={openCreateForm}
        >
          <Plus size={18} />

          Add voucher
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
                  ? "EDIT VOUCHER"
                  : "NEW VOUCHER"}
              </p>

              <h2>
                {editingId
                  ? "Update gift voucher"
                  : "Create gift voucher"}
              </h2>
            </div>

            <button
              type="button"
              className={
                styles.closeButton
              }
              onClick={closeForm}
            >
              <X size={20} />
            </button>
          </div>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
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
                  Voucher name *
                </label>

                <input
                  id="name"
                  value={form.name}
                  onChange={(event) =>
                    updateForm(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="€50 Gift Voucher"
                  required
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label htmlFor="amount">
                  Amount (€)
                </label>

                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) =>
                    updateForm(
                      "amount",
                      event.target.value
                    )
                  }
                  placeholder="50"
                  disabled={
                    form.is_custom_amount
                  }
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
                        .value as VoucherStatus
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
                rows={4}
                value={
                  form.description
                }
                onChange={(event) =>
                  updateForm(
                    "description",
                    event.target.value
                  )
                }
                placeholder="A flexible gift for workshops, studio experiences and creative time."
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
                  form.is_custom_amount
                }
                onChange={(event) =>
                  updateForm(
                    "is_custom_amount",
                    event.target.checked
                  )
                }
              />

              <span>
                <strong>
                  Custom amount voucher
                </strong>

                <small>
                  Customers can choose the
                  voucher value instead of
                  using a fixed amount.
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
                      : "Create voucher"}
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
          className={styles.summaryCard}
        >
          <span>Total vouchers</span>

          <strong>
            {vouchers.length}
          </strong>
        </div>

        <div
          className={styles.summaryCard}
        >
          <span>Published</span>

          <strong>
            {publishedCount}
          </strong>
        </div>

        <div
          className={styles.summaryCard}
        >
          <span>Custom amount</span>

          <strong>
            {customCount}
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
              placeholder="Search vouchers..."
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
              Loading gift vouchers...
            </p>
          </div>
        ) : filteredVouchers.length ===
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
              <Gift size={25} />
            </div>

            <h3>
              No gift vouchers found
            </h3>

            <p>
              {vouchers.length === 0
                ? "Create your first gift voucher option."
                : "No vouchers match your current filters."}
            </p>

            {vouchers.length === 0 && (
              <button
                onClick={
                  openCreateForm
                }
              >
                <Plus size={16} />

                Add first voucher
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              styles.voucherList
            }
          >
            {filteredVouchers.map(
              (voucher) => (
                <article
                  className={
                    styles.voucherCard
                  }
                  key={voucher.id}
                >
                  <div
                    className={
                      styles.voucherIcon
                    }
                  >
                    <Gift size={29} />
                  </div>

                  <div
                    className={
                      styles.voucherContent
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
                            styles.voucherType
                          }
                        >
                          {voucher.is_custom_amount
                            ? "Custom amount"
                            : "Fixed amount"}
                        </span>

                        <h3>
                          {voucher.name}
                        </h3>
                      </div>

                      <StatusBadge
                        status={
                          voucher.status
                        }
                      />
                    </div>

                    <p
                      className={
                        styles.description
                      }
                    >
                      {voucher.description ||
                        "No description added yet."}
                    </p>

                    <div
                      className={
                        styles.amount
                      }
                    >
                      {voucher.is_custom_amount ? (
                        <strong>
                          Customer chooses
                        </strong>
                      ) : (
                        <strong>
                          €{Number(
                            voucher.amount
                          ).toFixed(2)}
                        </strong>
                      )}
                    </div>

                    <div
                      className={
                        styles.cardActions
                      }
                    >
                      <button
                        onClick={() =>
                          openEditForm(
                            voucher
                          )
                        }
                      >
                        <Edit3
                          size={15}
                        />

                        Edit
                      </button>

                      {voucher.status !==
                        "published" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              voucher,
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

                      {voucher.status ===
                        "published" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              voucher,
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

                      {voucher.status !==
                        "archived" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              voucher,
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
                          voucher.id
                        }
                        onClick={() =>
                          handleDelete(
                            voucher
                          )
                        }
                      >
                        {deletingId ===
                        voucher.id ? (
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
  status: VoucherStatus;
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