"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";

import styles from "./website-content.module.css";

type ContentItem = {
  title?: string;
  text?: string;
  image_url?: string;
  button_label?: string;
  button_url?: string;

  // Optional fields used by some public-page card types.
  meta?: string;
  duration?: string;
  group_size?: string;

  // Preserve future/custom item fields instead of deleting them on save.
  [key: string]: unknown;
};

type SectionContent = {
  items?: ContentItem[];
  [key: string]: unknown;
};

type PageSection = {
  id: string;
  page_key: string;
  section_key: string;

  admin_label: string | null;
  section_type: string | null;

  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  body: string | null;

  image_url: string | null;

  button_label: string | null;
  button_url: string | null;

  secondary_button_label: string | null;
  secondary_button_url: string | null;

  content: SectionContent | null;

  is_visible: boolean;
  sort_order: number;

  created_at: string;
  updated_at: string;
};

type SectionForm = {
  page_key: string;
  section_key: string;

  admin_label: string;
  section_type: string;

  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;

  image_url: string;

  button_label: string;
  button_url: string;

  secondary_button_label: string;
  secondary_button_url: string;

  items: ContentItem[];

  // Keep section-level JSON such as opening-hours notes and any future
  // custom content fields safe when the section is edited.
  content_extras: SectionContent;
  content_note: string;

  is_visible: boolean;
  sort_order: string;
};

const pages = [
  {
    key: "home",
    label: "Home",
    path: "/",
  },
  {
    key: "explore",
    label: "Explore",
    path: "/explore",
  },
  {
    key: "workshops",
    label: "Workshops",
    path: "/workshops",
  },
  {
    key: "programmes",
    label: "Programmes / Courses",
    path: "/programmes",
  },
  {
    key: "membership",
    label: "Membership",
    path: "/membership",
  },
  {
    key: "shop",
    label: "Shop",
    path: "/shop",
  },
  {
    key: "whats-on",
    label: "What's On",
    path: "/whats-on",
  },
  {
    key: "paint-your-own-pottery",
    label: "Paint Your Own Pottery",
    path: "/paint-your-own-pottery",
  },
  {
    key: "team-building",
    label: "Team Building",
    path: "/team-building",
  },
  {
    key: "gift-vouchers",
    label: "Gift Vouchers",
    path: "/gift-vouchers",
  },
  {
    key: "visit",
    label: "Visit",
    path: "/visit",
  },
  {
    key: "about",
    label: "About",
    path: "/about",
  },
  {
    key: "gallery",
    label: "Gallery",
    path: "/gallery",
  },
  {
    key: "faqs",
    label: "FAQs",
    path: "/faqs",
  },
  {
    key: "contact",
    label: "Contact",
    path: "/contact",
  },
];

const emptyForm: SectionForm = {
  page_key: "home",
  section_key: "",

  admin_label: "",
  section_type: "standard",

  eyebrow: "",
  title: "",
  subtitle: "",
  body: "",

  image_url: "",

  button_label: "",
  button_url: "",

  secondary_button_label: "",
  secondary_button_url: "",

  items: [],

  content_extras: {},
  content_note: "",

  is_visible: true,
  sort_order: "0",
};

function createSectionKey(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_")
    .replace(/_+/g, "_");
}

function normaliseContent(
  content: SectionContent | null
) {
  if (!content || !Array.isArray(content.items)) {
    return [];
  }

  return content.items.map((item) => ({
    ...item,
    title:
      typeof item.title === "string"
        ? item.title
        : "",
    text:
      typeof item.text === "string"
        ? item.text
        : "",
    image_url:
      typeof item.image_url === "string"
        ? item.image_url
        : "",
    button_label:
      typeof item.button_label === "string"
        ? item.button_label
        : "",
    button_url:
      typeof item.button_url === "string"
        ? item.button_url
        : "",
    meta:
      typeof item.meta === "string"
        ? item.meta
        : "",
    duration:
      typeof item.duration === "string"
        ? item.duration
        : "",
    group_size:
      typeof item.group_size === "string"
        ? item.group_size
        : "",
  }));
}

export default function WebsiteContentAdminPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [selectedPage, setSelectedPage] =
    useState("home");

  const [sections, setSections] =
    useState<PageSection[]>([]);

  const [expandedId, setExpandedId] =
    useState<string | null>(null);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<SectionForm>(emptyForm);

  const [createOpen, setCreateOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [movingId, setMovingId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const loadSections = useCallback(
    async () => {
      setLoading(true);
      setError("");

      const { data, error } =
        await supabase
          .from("page_sections")
          .select("*")
          .eq("page_key", selectedPage)
          .order("sort_order", {
            ascending: true,
          });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setSections(
        (data as PageSection[]) ?? []
      );

      setLoading(false);
    },
    [supabase, selectedPage]
  );

  useEffect(() => {
    void loadSections();

    setExpandedId(null);
    setEditingId(null);
    setCreateOpen(false);
  }, [loadSections]);

  function updateForm<
    K extends keyof SectionForm
  >(
    key: K,
    value: SectionForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function openCreateSection() {
    const nextOrder =
      sections.length === 0
        ? 10
        : Math.max(
            ...sections.map(
              (section) =>
                section.sort_order
            )
          ) + 10;

    setForm({
      ...emptyForm,
      page_key: selectedPage,
      sort_order:
        nextOrder.toString(),
    });

    setEditingId(null);
    setCreateOpen(true);

    setMessage("");
    setError("");
  }

  function openEditSection(
    section: PageSection
  ) {
    setForm({
      page_key: section.page_key,
      section_key:
        section.section_key,

      admin_label:
        section.admin_label ?? "",

      section_type:
        section.section_type ??
        "standard",

      eyebrow:
        section.eyebrow ?? "",

      title:
        section.title ?? "",

      subtitle:
        section.subtitle ?? "",

      body:
        section.body ?? "",

      image_url:
        section.image_url ?? "",

      button_label:
        section.button_label ?? "",

      button_url:
        section.button_url ?? "",

      secondary_button_label:
        section.secondary_button_label ??
        "",

      secondary_button_url:
        section.secondary_button_url ??
        "",

      items: normaliseContent(
        section.content
      ),

      content_extras: {
        ...(section.content ?? {}),
      },

      content_note:
        typeof section.content?.note ===
        "string"
          ? section.content.note
          : "",

      is_visible:
        section.is_visible,

      sort_order:
        section.sort_order.toString(),
    });

    setEditingId(section.id);
    setCreateOpen(false);

    setExpandedId(section.id);

    setMessage("");
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setCreateOpen(false);
    setForm(emptyForm);
    setError("");
  }

  function updateItem(
    index: number,
    key: keyof ContentItem,
    value: string
  ) {
    setForm((current) => {
      const items = [
        ...current.items,
      ];

      items[index] = {
        ...items[index],
        [key]: value,
      };

      return {
        ...current,
        items,
      };
    });
  }

  function addItem() {
    setForm((current) => ({
      ...current,

      items: [
        ...current.items,
        {
          title: "",
          text: "",
          image_url: "",
          button_label: "",
          button_url: "",
          meta: "",
          duration: "",
          group_size: "",
        },
      ],
    }));
  }

  function removeItem(
    index: number
  ) {
    setForm((current) => ({
      ...current,

      items:
        current.items.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    }));
  }

  function moveItem(
    index: number,
    direction: "up" | "down"
  ) {
    setForm((current) => {
      const targetIndex =
        direction === "up"
          ? index - 1
          : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >=
          current.items.length
      ) {
        return current;
      }

      const items = [
        ...current.items,
      ];

      const currentItem =
        items[index];

      items[index] =
        items[targetIndex];

      items[targetIndex] =
        currentItem;

      return {
        ...current,
        items,
      };
    });
  }

  async function saveSection(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    const adminLabel =
      form.admin_label.trim();

    const sectionKey =
      form.section_key.trim() ||
      createSectionKey(adminLabel);

    if (!adminLabel) {
      setError(
        "Section name is required."
      );

      setSaving(false);
      return;
    }

    if (!sectionKey) {
      setError(
        "Section key is required."
      );

      setSaving(false);
      return;
    }

    const cleanedItems =
      form.items
        .map((item) => ({
          ...item,

          title:
            typeof item.title === "string"
              ? item.title.trim()
              : "",

          text:
            typeof item.text === "string"
              ? item.text.trim()
              : "",

          image_url:
            typeof item.image_url === "string"
              ? item.image_url.trim()
              : "",

          button_label:
            typeof item.button_label === "string"
              ? item.button_label.trim()
              : "",

          button_url:
            typeof item.button_url === "string"
              ? item.button_url.trim()
              : "",

          meta:
            typeof item.meta === "string"
              ? item.meta.trim()
              : "",

          duration:
            typeof item.duration === "string"
              ? item.duration.trim()
              : "",

          group_size:
            typeof item.group_size === "string"
              ? item.group_size.trim()
              : "",
        }))
        .filter((item) => {
          const knownContent =
            item.title ||
            item.text ||
            item.image_url ||
            item.button_label ||
            item.button_url ||
            item.meta ||
            item.duration ||
            item.group_size;

          const customContent =
            Object.entries(item).some(
              ([key, value]) =>
                ![
                  "title",
                  "text",
                  "image_url",
                  "button_label",
                  "button_url",
                  "meta",
                  "duration",
                  "group_size",
                ].includes(key) &&
                value !== null &&
                value !== undefined &&
                value !== ""
            );

          return Boolean(
            knownContent ||
              customContent
          );
        });

    const contentPayload: SectionContent = {
      ...form.content_extras,
      items: cleanedItems,
    };

    const note =
      form.content_note.trim();

    if (note) {
      contentPayload.note = note;
    } else {
      delete contentPayload.note;
    }

    const payload = {
      page_key: selectedPage,

      section_key:
        sectionKey,

      admin_label:
        adminLabel,

      section_type:
        form.section_type.trim() ||
        "standard",

      eyebrow:
        form.eyebrow.trim() ||
        null,

      title:
        form.title.trim() ||
        null,

      subtitle:
        form.subtitle.trim() ||
        null,

      body:
        form.body.trim() ||
        null,

      image_url:
        form.image_url.trim() ||
        null,

      button_label:
        form.button_label.trim() ||
        null,

      button_url:
        form.button_url.trim() ||
        null,

      secondary_button_label:
        form.secondary_button_label.trim() ||
        null,

      secondary_button_url:
        form.secondary_button_url.trim() ||
        null,

      content: contentPayload,

      is_visible:
        form.is_visible,

      sort_order:
        Number(
          form.sort_order
        ) || 0,
    };

    if (editingId) {
      const { error } =
        await supabase
          .from("page_sections")
          .update(payload)
          .eq("id", editingId);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }

      setMessage(
        "Section updated successfully."
      );
    } else {
      const { error } =
        await supabase
          .from("page_sections")
          .insert(payload);

      if (error) {
        if (
          error.message
            .toLowerCase()
            .includes("duplicate")
        ) {
          setError(
            "A section with this key already exists on this page."
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
        "Section created successfully."
      );
    }

    setSaving(false);

    setEditingId(null);
    setCreateOpen(false);

    setForm(emptyForm);

    await loadSections();
  }

  async function toggleVisibility(
    section: PageSection
  ) {
    setError("");
    setMessage("");

    const { error } =
      await supabase
        .from("page_sections")
        .update({
          is_visible:
            !section.is_visible,
        })
        .eq("id", section.id);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      section.is_visible
        ? `${section.admin_label ?? section.section_key} is now hidden.`
        : `${section.admin_label ?? section.section_key} is now visible.`
    );

    await loadSections();
  }

  async function deleteSection(
    section: PageSection
  ) {
    const confirmed =
      window.confirm(
        `Delete "${
          section.admin_label ??
          section.section_key
        }"?\n\nThis section will be removed from the CMS and cannot be restored automatically.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(section.id);

    setError("");
    setMessage("");

    const { error } =
      await supabase
        .from("page_sections")
        .delete()
        .eq("id", section.id);

    if (error) {
      setError(error.message);

      setDeletingId(null);
      return;
    }

    if (
      expandedId ===
      section.id
    ) {
      setExpandedId(null);
    }

    if (
      editingId ===
      section.id
    ) {
      cancelEdit();
    }

    setMessage(
      "Section deleted."
    );

    setDeletingId(null);

    await loadSections();
  }

  async function moveSection(
    section: PageSection,
    direction: "up" | "down"
  ) {
    const currentIndex =
      sections.findIndex(
        (item) =>
          item.id === section.id
      );

    if (currentIndex === -1) {
      return;
    }

    const targetIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= sections.length
    ) {
      return;
    }

    setMovingId(section.id);
    setError("");
    setMessage("");

    const reordered = [
      ...sections,
    ];

    const [movedSection] =
      reordered.splice(
        currentIndex,
        1
      );

    reordered.splice(
      targetIndex,
      0,
      movedSection
    );

    const normalised =
      reordered.map(
        (item, index) => ({
          ...item,
          sort_order:
            (index + 1) * 10,
        })
      );

    /*
      Update the UI immediately so the move
      feels instant, then persist the complete
      order to Supabase. Writing every section
      also fixes duplicate / inconsistent
      sort_order values from older data.
    */
    setSections(normalised);

    const results =
      await Promise.all(
        normalised.map(
          (item) =>
            supabase
              .from(
                "page_sections"
              )
              .update({
                sort_order:
                  item.sort_order,
              })
              .eq(
                "id",
                item.id
              )
        )
      );

    const failedResult =
      results.find(
        (result) =>
          result.error
      );

    if (
      failedResult?.error
    ) {
      setError(
        failedResult.error
          .message
      );

      setMovingId(null);

      await loadSections();
      return;
    }

    setMessage(
      "Section order updated."
    );

    setMovingId(null);

    await loadSections();
  }

  const currentPage =
    pages.find(
      (page) =>
        page.key === selectedPage
    );

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
            WEBSITE
          </p>

          <h1>
            Website Content
          </h1>

          <p
            className={
              styles.intro
            }
          >
            Edit the text,
            images, buttons and
            sections shown on the
            public Crafteris
            website.
          </p>
        </div>

        <a
          href={
            currentPage?.path ??
            "/"
          }
          target="_blank"
          rel="noreferrer"
          className={
            styles.previewButton
          }
        >
          <Eye size={17} />

          Preview page
        </a>
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
        className={
          styles.cmsLayout
        }
      >
        {/* PAGE SELECTOR */}

        <aside
          className={
            styles.pageSelector
          }
        >
          <div
            className={
              styles.pageSelectorHeader
            }
          >
            <FileText
              size={18}
            />

            <span>
              Public pages
            </span>
          </div>

          <nav
            className={
              styles.pageList
            }
          >
            {pages.map(
              (pageItem) => (
                <button
                  key={
                    pageItem.key
                  }
                  type="button"
                  className={
                    selectedPage ===
                    pageItem.key
                      ? styles.activePage
                      : ""
                  }
                  onClick={() =>
                    setSelectedPage(
                      pageItem.key
                    )
                  }
                >
                  <span>
                    {
                      pageItem.label
                    }
                  </span>

                  {selectedPage ===
                    pageItem.key && (
                    <span
                      className={
                        styles.activeDot
                      }
                    />
                  )}
                </button>
              )
            )}
          </nav>
        </aside>

        {/* PAGE CONTENT */}

        <div
          className={
            styles.contentPanel
          }
        >
          <div
            className={
              styles.contentHeader
            }
          >
            <div>
              <p
                className={
                  styles.smallLabel
                }
              >
                EDITING PAGE
              </p>

              <h2>
                {
                  currentPage?.label
                }
              </h2>

              <p>
                {sections.length}{" "}
                {sections.length ===
                1
                  ? "section"
                  : "sections"}
              </p>
            </div>

            <button
              type="button"
              className={
                styles.addSectionButton
              }
              onClick={
                openCreateSection
              }
            >
              <Plus size={16} />

              Add section
            </button>
          </div>

          {createOpen && (
            <SectionEditor
              form={form}
              updateForm={
                updateForm
              }
              updateItem={
                updateItem
              }
              addItem={
                addItem
              }
              removeItem={
                removeItem
              }
              moveItem={
                moveItem
              }
              onSubmit={
                saveSection
              }
              onCancel={
                cancelEdit
              }
              saving={
                saving
              }
              mode="create"
            />
          )}

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
                Loading page
                content...
              </p>
            </div>
          ) : sections.length ===
            0 ? (
            <div
              className={
                styles.emptyState
              }
            >
              <FileText
                size={31}
              />

              <h3>
                No sections yet
              </h3>

              <p>
                This page has not
                been connected to
                the content system
                yet.
              </p>

              <button
                type="button"
                onClick={
                  openCreateSection
                }
              >
                <Plus
                  size={16}
                />

                Create first
                section
              </button>
            </div>
          ) : (
            <div
              className={
                styles.sectionList
              }
            >
              {sections.map(
                (
                  section,
                  index
                ) => {
                  const expanded =
                    expandedId ===
                    section.id;

                  const editing =
                    editingId ===
                    section.id;

                  return (
                    <article
                      key={
                        section.id
                      }
                      className={
                        styles.sectionCard
                      }
                    >
                      <div
                        className={
                          styles.sectionSummary
                        }
                      >
                        <div
                          className={
                            styles.dragArea
                          }
                        >
                          <GripVertical
                            size={17}
                          />
                        </div>

                        <button
                          type="button"
                          className={
                            styles.sectionMain
                          }
                          onClick={() =>
                            setExpandedId(
                              expanded
                                ? null
                                : section.id
                            )
                          }
                        >
                          <div>
                            <div
                              className={
                                styles.sectionNameRow
                              }
                            >
                              <h3>
                                {section.admin_label ||
                                  section.section_key}
                              </h3>

                              <span
                                className={
                                  styles.typeBadge
                                }
                              >
                                {section.section_type ||
                                  "standard"}
                              </span>

                              <span
                                className={
                                  section.is_visible
                                    ? styles.visibleBadge
                                    : styles.hiddenBadge
                                }
                              >
                                {section.is_visible
                                  ? "Visible"
                                  : "Hidden"}
                              </span>
                            </div>

                            <p>
                              {section.title ||
                                section.body ||
                                "No content added yet."}
                            </p>
                          </div>

                          {expanded ? (
                            <ChevronUp
                              size={18}
                            />
                          ) : (
                            <ChevronDown
                              size={18}
                            />
                          )}
                        </button>

                        <div
                          className={
                            styles.sectionActions
                          }
                        >
                          <button
                            type="button"
                            title="Move up"
                            disabled={
                              index ===
                                0 ||
                              movingId ===
                                section.id
                            }
                            onClick={() =>
                              void moveSection(
                                section,
                                "up"
                              )
                            }
                          >
                            <ChevronUp
                              size={15}
                            />
                          </button>

                          <button
                            type="button"
                            title="Move down"
                            disabled={
                              index ===
                                sections.length -
                                  1 ||
                              movingId ===
                                section.id
                            }
                            onClick={() =>
                              void moveSection(
                                section,
                                "down"
                              )
                            }
                          >
                            <ChevronDown
                              size={15}
                            />
                          </button>

                          <button
                            type="button"
                            title={
                              section.is_visible
                                ? "Hide section"
                                : "Show section"
                            }
                            onClick={() =>
                              void toggleVisibility(
                                section
                              )
                            }
                          >
                            {section.is_visible ? (
                              <Eye
                                size={15}
                              />
                            ) : (
                              <EyeOff
                                size={15}
                              />
                            )}
                          </button>
                        </div>
                      </div>

                      {expanded && (
                        <div
                          className={
                            styles.expandedContent
                          }
                        >
                          {!editing && (
                            <>
                              <SectionPreview
                                section={
                                  section
                                }
                              />

                              <div
                                className={
                                  styles.expandedActions
                                }
                              >
                                <button
                                  type="button"
                                  className={
                                    styles.editButton
                                  }
                                  onClick={() =>
                                    openEditSection(
                                      section
                                    )
                                  }
                                >
                                  Edit
                                  section
                                </button>

                                <button
                                  type="button"
                                  className={
                                    styles.deleteButton
                                  }
                                  disabled={
                                    deletingId ===
                                    section.id
                                  }
                                  onClick={() =>
                                    void deleteSection(
                                      section
                                    )
                                  }
                                >
                                  {deletingId ===
                                  section.id ? (
                                    <Loader2
                                      size={
                                        15
                                      }
                                      className={
                                        styles.spin
                                      }
                                    />
                                  ) : (
                                    <Trash2
                                      size={
                                        15
                                      }
                                    />
                                  )}

                                  Delete
                                </button>
                              </div>
                            </>
                          )}

                          {editing && (
                            <SectionEditor
                              form={
                                form
                              }
                              updateForm={
                                updateForm
                              }
                              updateItem={
                                updateItem
                              }
                              addItem={
                                addItem
                              }
                              removeItem={
                                removeItem
                              }
                              moveItem={
                                moveItem
                              }
                              onSubmit={
                                saveSection
                              }
                              onCancel={
                                cancelEdit
                              }
                              saving={
                                saving
                              }
                              mode="edit"
                            />
                          )}
                        </div>
                      )}
                    </article>
                  );
                }
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SectionPreview({
  section,
}: {
  section: PageSection;
}) {
  const items =
    normaliseContent(
      section.content
    );

  return (
    <div
      className={
        styles.sectionPreview
      }
    >
      {section.image_url && (
        <div
          className={
            styles.previewImage
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              section.image_url
            }
            alt=""
          />
        </div>
      )}

      <div
        className={
          styles.previewText
        }
      >
        {section.eyebrow && (
          <span>
            {section.eyebrow}
          </span>
        )}

        {section.title && (
          <h4>
            {section.title}
          </h4>
        )}

        {section.subtitle && (
          <strong>
            {section.subtitle}
          </strong>
        )}

        {section.body && (
          <p>
            {section.body}
          </p>
        )}

        {(section.button_label ||
          section.secondary_button_label) && (
          <div
            className={
              styles.previewButtons
            }
          >
            {section.button_label && (
              <span>
                {
                  section.button_label
                }
              </span>
            )}

            {section.secondary_button_label && (
              <span>
                {
                  section.secondary_button_label
                }
              </span>
            )}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div
          className={
            styles.previewItems
          }
        >
          {items.map(
            (item, index) => (
              <div
                key={index}
                className={
                  styles.previewItem
                }
              >
                <strong>
                  {item.title ||
                    `Item ${index + 1}`}
                </strong>

                {item.image_url && (
                  <div
                    className={
                      styles.previewItemImage
                    }
                  >
                    <img
                      src={
                        item.image_url
                      }
                      alt=""
                    />
                  </div>
                )}

                {(item.meta ||
                  item.duration ||
                  item.group_size) && (
                  <div
                    className={
                      styles.previewItemMeta
                    }
                  >
                    {item.meta && (
                      <span>
                        {String(
                          item.meta
                        )}
                      </span>
                    )}

                    {item.duration && (
                      <span>
                        {String(
                          item.duration
                        )}
                      </span>
                    )}

                    {item.group_size && (
                      <span>
                        {String(
                          item.group_size
                        )}
                      </span>
                    )}
                  </div>
                )}

                {item.text && (
                  <p>
                    {item.text}
                  </p>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

type SectionEditorProps = {
  form: SectionForm;

  updateForm: <
    K extends keyof SectionForm
  >(
    key: K,
    value: SectionForm[K]
  ) => void;

  updateItem: (
    index: number,
    key: keyof ContentItem,
    value: string
  ) => void;

  addItem: () => void;

  removeItem: (
    index: number
  ) => void;

  moveItem: (
    index: number,
    direction: "up" | "down"
  ) => void;

  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;

  onCancel: () => void;

  saving: boolean;

  mode: "create" | "edit";
};

function SectionEditor({
  form,
  updateForm,
  updateItem,
  addItem,
  removeItem,
  moveItem,
  onSubmit,
  onCancel,
  saving,
  mode,
}: SectionEditorProps) {
  return (
    <form
      className={
        styles.editor
      }
      onSubmit={onSubmit}
    >
      <div
        className={
          styles.editorHeader
        }
      >
        <div>
          <p
            className={
              styles.smallLabel
            }
          >
            {mode === "create"
              ? "NEW SECTION"
              : "EDIT SECTION"}
          </p>

          <h3>
            {mode === "create"
              ? "Create page section"
              : "Edit page section"}
          </h3>
        </div>

        <button
          type="button"
          className={
            styles.editorClose
          }
          onClick={onCancel}
        >
          <X size={18} />
        </button>
      </div>

      <div
        className={
          styles.editorGrid
        }
      >
        <div
          className={
            styles.formGroup
          }
        >
          <label>
            Section name *
          </label>

          <input
            value={
              form.admin_label
            }
            onChange={(event) =>
              updateForm(
                "admin_label",
                event.target.value
              )
            }
            placeholder="Hero"
            required
          />
        </div>

        <div
          className={
            styles.formGroup
          }
        >
          <label>
            Section key
          </label>

          <input
            value={
              form.section_key
            }
            onChange={(event) =>
              updateForm(
                "section_key",
                createSectionKey(
                  event.target.value
                )
              )
            }
            placeholder="hero"
            readOnly={
              mode === "edit"
            }
          />

          <small>
            Used internally. Do
            not change existing
            keys unless necessary.
          </small>
        </div>

        <div
          className={
            styles.formGroup
          }
        >
          <label>
            Section type
          </label>

          <select
            value={
              form.section_type
            }
            onChange={(event) =>
              updateForm(
                "section_type",
                event.target.value
              )
            }
          >
            <option value="standard">
              Standard
            </option>

            <option value="hero">
              Hero
            </option>

            <option value="feature">
              Feature
            </option>

            <option value="cards">
              Cards
            </option>

            <option value="banner">
              Banner
            </option>

            <option value="gallery">
              Gallery
            </option>

            <option value="dynamic">
              Dynamic content
            </option>

            <option value="faq">
              FAQ
            </option>

            <option value="cta">
              Call to action
            </option>
          </select>
        </div>

        <div
          className={
            styles.formGroup
          }
        >
          <label>
            Display order
          </label>

          <input
            type="number"
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
          styles.editorSection
        }
      >
        <div
          className={
            styles.editorSectionHeading
          }
        >
          <h4>
            Text content
          </h4>

          <p>
            Main text shown in
            this section.
          </p>
        </div>

        <div
          className={
            styles.formGroup
          }
        >
          <label>
            Eyebrow
          </label>

          <input
            value={
              form.eyebrow
            }
            onChange={(event) =>
              updateForm(
                "eyebrow",
                event.target.value
              )
            }
            placeholder="MAKE AT CRAFTERIS"
          />
        </div>

        <div
          className={
            styles.formGroup
          }
        >
          <label>
            Heading
          </label>

          <input
            value={
              form.title
            }
            onChange={(event) =>
              updateForm(
                "title",
                event.target.value
              )
            }
            placeholder="Make something worth keeping."
          />
        </div>

        <div
          className={
            styles.formGroup
          }
        >
          <label>
            Subtitle
          </label>

          <textarea
            rows={2}
            value={
              form.subtitle
            }
            onChange={(event) =>
              updateForm(
                "subtitle",
                event.target.value
              )
            }
            placeholder="Short supporting text..."
          />
        </div>

        <div
          className={
            styles.formGroup
          }
        >
          <label>
            Paragraph / body
          </label>

          <textarea
            rows={6}
            value={
              form.body
            }
            onChange={(event) =>
              updateForm(
                "body",
                event.target.value
              )
            }
            placeholder="Main paragraph..."
          />
        </div>
      </div>

      <div
        className={
          styles.editorSection
        }
      >
        <div
          className={
            styles.editorSectionHeading
          }
        >
          <h4>
            Section image
          </h4>

          <p>
            Upload or replace
            the main image for
            this section.
          </p>
        </div>

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
          folder="website-content"
        />
      </div>

      <div
        className={
          styles.editorSection
        }
      >
        <div
          className={
            styles.editorSectionHeading
          }
        >
          <h4>
            Buttons
          </h4>

          <p>
            Change button text
            and destination.
          </p>
        </div>

        <div
          className={
            styles.editorGrid
          }
        >
          <div
            className={
              styles.formGroup
            }
          >
            <label>
              Primary button
            </label>

            <input
              value={
                form.button_label
              }
              onChange={(event) =>
                updateForm(
                  "button_label",
                  event.target.value
                )
              }
              placeholder="Explore experiences"
            />
          </div>

          <div
            className={
              styles.formGroup
            }
          >
            <label>
              Primary URL
            </label>

            <input
              value={
                form.button_url
              }
              onChange={(event) =>
                updateForm(
                  "button_url",
                  event.target.value
                )
              }
              placeholder="/explore"
            />
          </div>

          <div
            className={
              styles.formGroup
            }
          >
            <label>
              Secondary button
            </label>

            <input
              value={
                form.secondary_button_label
              }
              onChange={(event) =>
                updateForm(
                  "secondary_button_label",
                  event.target.value
                )
              }
              placeholder="Visit the studio"
            />
          </div>

          <div
            className={
              styles.formGroup
            }
          >
            <label>
              Secondary URL
            </label>

            <input
              value={
                form.secondary_button_url
              }
              onChange={(event) =>
                updateForm(
                  "secondary_button_url",
                  event.target.value
                )
              }
              placeholder="/visit"
            />
          </div>
        </div>
      </div>

      <div
        className={
          styles.editorSection
        }
      >
        <div
          className={
            styles.repeatableHeading
          }
        >
          <div>
            <h4>
              Cards / items
            </h4>

            <p>
              Use these when a
              section contains
              several cards,
              steps, gallery
              items or similar
              content.
            </p>
          </div>

          <button
            type="button"
            className={
              styles.addItemButton
            }
            onClick={addItem}
          >
            <Plus size={15} />

            Add item
          </button>
        </div>

        <div
          className={
            styles.formGroup
          }
        >
          <label>
            Section note / footnote
          </label>

          <textarea
            rows={3}
            value={
              form.content_note
            }
            onChange={(event) =>
              updateForm(
                "content_note",
                event.target.value
              )
            }
            placeholder="Optional note shown by sections such as opening hours."
          />

          <small>
            Used by sections that
            need a note below their
            repeated items.
          </small>
        </div>

        {form.items.length ===
        0 ? (
          <div
            className={
              styles.noItems
            }
          >
            No repeated items in
            this section.
          </div>
        ) : (
          <div
            className={
              styles.itemList
            }
          >
            {form.items.map(
              (item, index) => (
                <div
                  className={
                    styles.itemEditor
                  }
                  key={index}
                >
                  <div
                    className={
                      styles.itemHeader
                    }
                  >
                    <strong>
                      Item{" "}
                      {index + 1}
                    </strong>

                    <div
                      className={
                        styles.itemHeaderActions
                      }
                    >
                      <button
                        type="button"
                        className={
                          styles.itemMoveButton
                        }
                        title="Move item up"
                        disabled={
                          index === 0
                        }
                        onClick={() =>
                          moveItem(
                            index,
                            "up"
                          )
                        }
                      >
                        <ChevronUp
                          size={14}
                        />
                      </button>

                      <button
                        type="button"
                        className={
                          styles.itemMoveButton
                        }
                        title="Move item down"
                        disabled={
                          index ===
                          form.items.length -
                            1
                        }
                        onClick={() =>
                          moveItem(
                            index,
                            "down"
                          )
                        }
                      >
                        <ChevronDown
                          size={14}
                        />
                      </button>

                      <button
                        type="button"
                        className={
                          styles.itemRemoveButton
                        }
                        onClick={() =>
                          removeItem(
                            index
                          )
                        }
                      >
                        <Trash2
                          size={15}
                        />

                        Remove
                      </button>
                    </div>
                  </div>

                  <div
                    className={
                      styles.editorGrid
                    }
                  >
                    <div
                      className={
                        styles.formGroup
                      }
                    >
                      <label>
                        Title
                      </label>

                      <input
                        value={
                          item.title ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            index,
                            "title",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </div>

                    <div
                      className={
                        styles.formGroup
                      }
                    >
                      <label>
                        Button text
                      </label>

                      <input
                        value={
                          item.button_label ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            index,
                            "button_label",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </div>

                    <div
                      className={
                        styles.formGroup
                      }
                    >
                      <label>
                        Button URL
                      </label>

                      <input
                        value={
                          item.button_url ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            index,
                            "button_url",
                            event
                              .target
                              .value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div
                    className={
                      styles.editorGrid
                    }
                  >
                    <div
                      className={
                        styles.formGroup
                      }
                    >
                      <label>
                        Label / category
                      </label>

                      <input
                        value={
                          typeof item.meta ===
                          "string"
                            ? item.meta
                            : ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            index,
                            "meta",
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Glass, Pottery, Best for..."
                      />
                    </div>

                    <div
                      className={
                        styles.formGroup
                      }
                    >
                      <label>
                        Duration
                      </label>

                      <input
                        value={
                          typeof item.duration ===
                          "string"
                            ? item.duration
                            : ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            index,
                            "duration",
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Around 2 hours"
                      />
                    </div>

                    <div
                      className={
                        styles.formGroup
                      }
                    >
                      <label>
                        Group size
                      </label>

                      <input
                        value={
                          typeof item.group_size ===
                          "string"
                            ? item.group_size
                            : ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            index,
                            "group_size",
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Flexible group sizes"
                      />
                    </div>
                  </div>

                  <div
                    className={
                      styles.formGroup
                    }
                  >
                    <label>
                      Text
                    </label>

                    <textarea
                      rows={3}
                      value={
                        item.text ??
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateItem(
                          index,
                          "text",
                          event
                            .target
                            .value
                        )
                      }
                    />
                  </div>

                  <div
                    className={
                      styles.formGroup
                    }
                  >
                    <label>
                      Item image
                    </label>

                    <ImageUpload
                      value={
                        item.image_url ??
                        ""
                      }
                      onChange={(
                        url
                      ) =>
                        updateItem(
                          index,
                          "image_url",
                          url
                        )
                      }
                      folder="website-content/items"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <label
        className={
          styles.visibilityControl
        }
      >
        <input
          type="checkbox"
          checked={
            form.is_visible
          }
          onChange={(event) =>
            updateForm(
              "is_visible",
              event.target.checked
            )
          }
        />

        <div>
          <strong>
            Show this section
          </strong>

          <span>
            Hidden sections stay
            saved in the CMS but
            do not appear on the
            public page.
          </span>
        </div>
      </label>

      <div
        className={
          styles.editorActions
        }
      >
        <button
          type="button"
          className={
            styles.cancelButton
          }
          onClick={onCancel}
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

              Save section
            </>
          )}
        </button>
      </div>
    </form>
  );
}