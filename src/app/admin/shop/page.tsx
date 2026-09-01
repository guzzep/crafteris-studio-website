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
  Package,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

import styles from "./shop.module.css";

type ProductStatus =
  | "draft"
  | "published"
  | "archived";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  stock: number;
  status: ProductStatus;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type ProductForm = {
  name: string;
  slug: string;
  category: string;
  description: string;
  price: string;
  image_url: string;
  stock: string;
  status: ProductStatus;
  is_featured: boolean;
  sort_order: string;
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  category: "Pottery",
  description: "",
  price: "",
  image_url: "",
  stock: "0",
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

export default function ShopAdminPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [products, setProducts] =
    useState<Product[]>([]);

  const [form, setForm] =
    useState<ProductForm>(emptyForm);

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

  const loadProducts =
    useCallback(async () => {
      setLoading(true);
      setError("");

      const { data, error } =
        await supabase
          .from("products")
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

      setProducts(
        (data as Product[]) ?? []
      );

      setLoading(false);
    }, [supabase]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  function updateForm<
    K extends keyof ProductForm
  >(
    key: K,
    value: ProductForm[K]
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
    product: Product
  ) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,

      description:
        product.description ?? "",

      price:
        product.price?.toString() ?? "",

      image_url:
        product.image_url ?? "",

      stock:
        product.stock?.toString() ?? "0",

      status: product.status,

      is_featured:
        product.is_featured,

      sort_order:
        product.sort_order?.toString() ??
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

    const name = form.name.trim();

    const slug =
      form.slug.trim() ||
      createSlug(name);

    if (!name) {
      setError(
        "Product name is required."
      );

      setSaving(false);
      return;
    }

    if (!slug) {
      setError(
        "Product slug is required."
      );

      setSaving(false);
      return;
    }

    const stock =
      form.stock === ""
        ? 0
        : Number(form.stock);

    if (
      Number.isNaN(stock) ||
      stock < 0
    ) {
      setError(
        "Stock must be 0 or higher."
      );

      setSaving(false);
      return;
    }

    const payload = {
      name,
      slug,

      category:
        form.category.trim(),

      description:
        form.description.trim() ||
        null,

      price:
        form.price === ""
          ? null
          : Number(form.price),

      image_url:
        form.image_url.trim() ||
        null,

      stock,

      status: form.status,

      is_featured:
        form.is_featured,

      sort_order:
        Number(form.sort_order) || 0,
    };

    if (editingId) {
      const { error } =
        await supabase
          .from("products")
          .update(payload)
          .eq("id", editingId);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }

      setMessage(
        "Product updated successfully."
      );
    } else {
      const { error } =
        await supabase
          .from("products")
          .insert(payload);

      if (error) {
        if (
          error.message
            .toLowerCase()
            .includes("duplicate")
        ) {
          setError(
            "That product URL slug is already being used."
          );
        } else {
          setError(error.message);
        }

        setSaving(false);
        return;
      }

      setMessage(
        "Product created successfully."
      );
    }

    setSaving(false);
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);

    await loadProducts();
  }

  async function handleDelete(
    product: Product
  ) {
    const confirmed =
      window.confirm(
        `Delete "${product.name}"?\n\nThis cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(product.id);
    setMessage("");
    setError("");

    const { error } =
      await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

    if (error) {
      setError(error.message);
      setDeletingId(null);
      return;
    }

    setMessage(
      `"${product.name}" was deleted.`
    );

    setDeletingId(null);

    await loadProducts();
  }

  async function updateStatus(
    product: Product,
    status: ProductStatus
  ) {
    setMessage("");
    setError("");

    const { error } =
      await supabase
        .from("products")
        .update({ status })
        .eq("id", product.id);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      `${product.name} is now ${status}.`
    );

    await loadProducts();
  }

  const filteredProducts =
    products.filter((product) => {
      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchValue) ||
        product.category
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        product.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  const publishedCount =
    products.filter(
      (product) =>
        product.status ===
        "published"
    ).length;

  const lowStockCount =
    products.filter(
      (product) =>
        product.stock > 0 &&
        product.stock <= 3
    ).length;

  const outOfStockCount =
    products.filter(
      (product) =>
        product.stock === 0
    ).length;

  return (
    <div className={styles.page}>
      <section
        className={styles.pageHeader}
      >
        <div>
          <p className={styles.eyebrow}>
            STUDIO SHOP
          </p>

          <h1>Shop</h1>

          <p className={styles.intro}>
            Manage handmade products,
            creative pieces and studio items
            shown on the public shop page.
          </p>
        </div>

        <button
          className={
            styles.primaryButton
          }
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Add product
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
                  ? "EDIT PRODUCT"
                  : "NEW PRODUCT"}
              </p>

              <h2>
                {editingId
                  ? "Update product"
                  : "Create a product"}
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
                  Product name *
                </label>

                <input
                  id="name"
                  value={form.name}
                  onChange={(event) =>
                    handleNameChange(
                      event.target.value
                    )
                  }
                  placeholder="Handmade Glass Bowl"
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
                  placeholder="handmade-glass-bowl"
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
                  <option value="Pottery">
                    Pottery
                  </option>

                  <option value="Glass">
                    Glass
                  </option>

                  <option value="Homeware">
                    Homeware
                  </option>

                  <option value="Decor">
                    Decor
                  </option>

                  <option value="Jewellery">
                    Jewellery
                  </option>

                  <option value="Gift">
                    Gift
                  </option>

                  <option value="Other">
                    Other
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
                  placeholder="35.00"
                />
              </div>

              <div
                className={
                  styles.formGroup
                }
              >
                <label htmlFor="stock">
                  Stock
                </label>

                <input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(event) =>
                    updateForm(
                      "stock",
                      event.target.value
                    )
                  }
                  placeholder="5"
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
                        .value as ProductStatus
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
                placeholder="Describe the product, materials, finish and any useful details..."
              />
            </div>

            <div
              className={
                styles.formGroup
              }
            >
              <label>
                Product image
              </label>

              <ImageUpload
                value={form.image_url}
                onChange={(url) =>
                  updateForm(
                    "image_url",
                    url
                  )
                }
                folder="products"
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
                  Featured product
                </strong>

                <small>
                  Featured items can appear
                  in highlighted areas of the
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
                      : "Create product"}
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
          <span>Total products</span>

          <strong>
            {products.length}
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
          <span>Low stock</span>

          <strong>
            {lowStockCount}
          </strong>
        </div>

        <div
          className={styles.summaryCard}
        >
          <span>Out of stock</span>

          <strong>
            {outOfStockCount}
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
              placeholder="Search products..."
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

            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length ===
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
              <Package size={24} />
            </div>

            <h3>
              No products found
            </h3>

            <p>
              {products.length === 0
                ? "Create your first shop product."
                : "No products match your current search or filter."}
            </p>

            {products.length === 0 && (
              <button
                onClick={openCreateForm}
              >
                <Plus size={16} />
                Add first product
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              styles.productList
            }
          >
            {filteredProducts.map(
              (product) => (
                <article
                  key={product.id}
                  className={
                    styles.productCard
                  }
                >
                  <div
                    className={
                      styles.imageWrapper
                    }
                  >
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          product.image_url
                        }
                        alt={product.name}
                      />
                    ) : (
                      <div
                        className={
                          styles.noImage
                        }
                      >
                        Product
                      </div>
                    )}

                    {product.is_featured && (
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
                      styles.productContent
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
                          {product.category}
                        </span>

                        <h3>
                          {product.name}
                        </h3>
                      </div>

                      <StatusBadge
                        status={
                          product.status
                        }
                      />
                    </div>

                    <p
                      className={
                        styles.description
                      }
                    >
                      {product.description ||
                        "No description added yet."}
                    </p>

                    <div
                      className={
                        styles.productMeta
                      }
                    >
                      <strong>
                        {product.price !==
                        null
                          ? `€${Number(
                              product.price
                            ).toFixed(2)}`
                          : "Price not set"}
                      </strong>

                      <StockBadge
                        stock={product.stock}
                      />
                    </div>

                    <div
                      className={
                        styles.cardActions
                      }
                    >
                      <button
                        onClick={() =>
                          openEditForm(
                            product
                          )
                        }
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>

                      {product.status !==
                        "published" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              product,
                              "published"
                            )
                          }
                        >
                          <Eye size={15} />
                          Publish
                        </button>
                      )}

                      {product.status ===
                        "published" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              product,
                              "draft"
                            )
                          }
                        >
                          <EyeOff size={15} />
                          Unpublish
                        </button>
                      )}

                      {product.status !==
                        "archived" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              product,
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
                          product.id
                        }
                        onClick={() =>
                          handleDelete(
                            product
                          )
                        }
                      >
                        {deletingId ===
                        product.id ? (
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
  status: ProductStatus;
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

function StockBadge({
  stock,
}: {
  stock: number;
}) {
  if (stock <= 0) {
    return (
      <span
        className={
          styles.outOfStock
        }
      >
        Out of stock
      </span>
    );
  }

  if (stock <= 3) {
    return (
      <span
        className={
          styles.lowStock
        }
      >
        Only {stock} left
      </span>
    );
  }

  return (
    <span
      className={styles.inStock}
    >
      {stock} in stock
    </span>
  );
}