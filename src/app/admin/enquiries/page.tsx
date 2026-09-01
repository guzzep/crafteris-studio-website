"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  ChevronRight,
  Inbox,
  Loader2,
  Mail,
  MailOpen,
  Phone,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import styles from "./enquiries.module.css";

type Enquiry = {
  id: string;
  names: string;
  email: string;
  phone: string | null;
  reason: string | null;
  group_size: number | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

type FilterType =
  | "all"
  | "unread"
  | "read";

export default function EnquiriesAdminPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [enquiries, setEnquiries] =
    useState<Enquiry[]>([]);

  const [
    selectedEnquiry,
    setSelectedEnquiry,
  ] = useState<Enquiry | null>(null);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<FilterType>("all");

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const loadEnquiries =
    useCallback(async () => {
      setLoading(true);
      setError("");

      const { data, error } =
        await supabase
          .from("contact_enquiries")
          .select(
            `
              id,
              names,
              email,
              phone,
              reason,
              group_size,
              message,
              is_read,
              created_at
            `
          )
          .order("created_at", {
            ascending: false,
          });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setEnquiries(
        (data as Enquiry[]) ?? []
      );

      setLoading(false);
    }, [supabase]);

  useEffect(() => {
    void loadEnquiries();
  }, [loadEnquiries]);

  async function openEnquiry(
    enquiry: Enquiry
  ) {
    setSelectedEnquiry(enquiry);

    setMessage("");
    setError("");

    if (enquiry.is_read) {
      return;
    }

    setUpdatingId(enquiry.id);

    const { error } =
      await supabase
        .from("contact_enquiries")
        .update({
          is_read: true,
        })
        .eq("id", enquiry.id);

    if (error) {
      setError(error.message);
      setUpdatingId(null);
      return;
    }

    setEnquiries((current) =>
      current.map((item) =>
        item.id === enquiry.id
          ? {
              ...item,
              is_read: true,
            }
          : item
      )
    );

    setSelectedEnquiry((current) =>
      current
        ? {
            ...current,
            is_read: true,
          }
        : current
    );

    setUpdatingId(null);
  }

  async function toggleReadStatus(
    enquiry: Enquiry
  ) {
    setUpdatingId(enquiry.id);

    setError("");
    setMessage("");

    const nextStatus =
      !enquiry.is_read;

    const { error } =
      await supabase
        .from("contact_enquiries")
        .update({
          is_read: nextStatus,
        })
        .eq("id", enquiry.id);

    if (error) {
      setError(error.message);
      setUpdatingId(null);
      return;
    }

    setEnquiries((current) =>
      current.map((item) =>
        item.id === enquiry.id
          ? {
              ...item,
              is_read: nextStatus,
            }
          : item
      )
    );

    setSelectedEnquiry((current) =>
      current?.id === enquiry.id
        ? {
            ...current,
            is_read: nextStatus,
          }
        : current
    );

    setMessage(
      nextStatus
        ? "Enquiry marked as read."
        : "Enquiry marked as unread."
    );

    setUpdatingId(null);
  }

  async function deleteEnquiry(
    enquiry: Enquiry
  ) {
    const confirmed =
      window.confirm(
        `Delete the enquiry from "${enquiry.names}"?\n\nThis cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(enquiry.id);

    setError("");
    setMessage("");

    const { error } =
      await supabase
        .from("contact_enquiries")
        .delete()
        .eq("id", enquiry.id);

    if (error) {
      setError(error.message);
      setDeletingId(null);
      return;
    }

    setEnquiries((current) =>
      current.filter(
        (item) =>
          item.id !== enquiry.id
      )
    );

    if (
      selectedEnquiry?.id ===
      enquiry.id
    ) {
      setSelectedEnquiry(null);
    }

    setMessage(
      "Enquiry deleted successfully."
    );

    setDeletingId(null);
  }

  function closeEnquiry() {
    setSelectedEnquiry(null);
  }

  function formatDate(
    date: string
  ) {
    return new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Europe/Malta",
      }
    ).format(new Date(date));
  }

  function formatDateTime(
    date: string
  ) {
    return new Intl.DateTimeFormat(
      "en-GB",
      {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/Malta",
      }
    ).format(new Date(date));
  }

  const filteredEnquiries =
    enquiries.filter(
      (enquiry) => {
        const searchValue =
          search
            .trim()
            .toLowerCase();

        const matchesSearch =
          enquiry.names
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          enquiry.email
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          (enquiry.reason ?? "")
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          enquiry.message
            .toLowerCase()
            .includes(
              searchValue
            );

        const matchesFilter =
          filter === "all" ||
          (filter === "unread" &&
            !enquiry.is_read) ||
          (filter === "read" &&
            enquiry.is_read);

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );

  const unreadCount =
    enquiries.filter(
      (enquiry) =>
        !enquiry.is_read
    ).length;

  const readCount =
    enquiries.filter(
      (enquiry) =>
        enquiry.is_read
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
            CONTACT
          </p>

          <h1>Enquiries</h1>

          <p
            className={
              styles.intro
            }
          >
            View and manage
            messages submitted
            through the Crafteris
            website.
          </p>
        </div>
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
          styles.summaryGrid
        }
      >
        <div
          className={
            styles.summaryCard
          }
        >
          <div
            className={
              styles.summaryIcon
            }
          >
            <Inbox size={19} />
          </div>

          <div>
            <span>
              Total enquiries
            </span>

            <strong>
              {enquiries.length}
            </strong>
          </div>
        </div>

        <div
          className={
            styles.summaryCard
          }
        >
          <div
            className={
              styles.summaryIcon
            }
          >
            <Mail size={19} />
          </div>

          <div>
            <span>Unread</span>

            <strong>
              {unreadCount}
            </strong>
          </div>
        </div>

        <div
          className={
            styles.summaryCard
          }
        >
          <div
            className={
              styles.summaryIcon
            }
          >
            <MailOpen
              size={19}
            />
          </div>

          <div>
            <span>Read</span>

            <strong>
              {readCount}
            </strong>
          </div>
        </div>
      </section>

      <section
        className={
          styles.inboxPanel
        }
      >
        <div
          className={
            styles.toolbar
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
              placeholder="Search enquiries..."
              value={search}
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

          <div
            className={
              styles.filters
            }
          >
            <button
              type="button"
              className={
                filter === "all"
                  ? styles.activeFilter
                  : ""
              }
              onClick={() =>
                setFilter("all")
              }
            >
              All
            </button>

            <button
              type="button"
              className={
                filter === "unread"
                  ? styles.activeFilter
                  : ""
              }
              onClick={() =>
                setFilter(
                  "unread"
                )
              }
            >
              Unread
            </button>

            <button
              type="button"
              className={
                filter === "read"
                  ? styles.activeFilter
                  : ""
              }
              onClick={() =>
                setFilter("read")
              }
            >
              Read
            </button>
          </div>
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
              Loading enquiries...
            </p>
          </div>
        ) : filteredEnquiries.length ===
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
              <Inbox size={25} />
            </div>

            <h3>
              No enquiries found
            </h3>

            <p>
              {enquiries.length ===
              0
                ? "New contact enquiries will appear here."
                : "No enquiries match your current search or filter."}
            </p>
          </div>
        ) : (
          <div
            className={
              styles.enquiryList
            }
          >
            {filteredEnquiries.map(
              (enquiry) => (
                <article
                  key={
                    enquiry.id
                  }
                  className={`${styles.enquiryRow} ${
                    !enquiry.is_read
                      ? styles.unreadRow
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className={
                      styles.enquiryMain
                    }
                    onClick={() =>
                      void openEnquiry(
                        enquiry
                      )
                    }
                  >
                    <div
                      className={
                        styles.readIndicator
                      }
                    >
                      {!enquiry.is_read && (
                        <span />
                      )}
                    </div>

                    <div
                      className={
                        styles.enquiryIdentity
                      }
                    >
                      <strong>
                        {enquiry.names}
                      </strong>

                      <span>
                        {enquiry.email}
                      </span>
                    </div>

                    <div
                      className={
                        styles.enquiryPreview
                      }
                    >
                      <strong>
                        {enquiry.reason ||
                          "General enquiry"}
                      </strong>

                      <p>
                        {enquiry.message}
                      </p>
                    </div>

                    <div
                      className={
                        styles.enquiryDate
                      }
                    >
                      <span>
                        {formatDate(
                          enquiry.created_at
                        )}
                      </span>

                      <ChevronRight
                        size={17}
                      />
                    </div>
                  </button>

                  <div
                    className={
                      styles.rowActions
                    }
                  >
                    <button
                      type="button"
                      title={
                        enquiry.is_read
                          ? "Mark unread"
                          : "Mark read"
                      }
                      onClick={() =>
                        void toggleReadStatus(
                          enquiry
                        )
                      }
                      disabled={
                        updatingId ===
                        enquiry.id
                      }
                    >
                      {updatingId ===
                      enquiry.id ? (
                        <Loader2
                          size={16}
                          className={
                            styles.spin
                          }
                        />
                      ) : enquiry.is_read ? (
                        <Mail
                          size={16}
                        />
                      ) : (
                        <MailOpen
                          size={16}
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      title="Delete enquiry"
                      className={
                        styles.deleteButton
                      }
                      onClick={() =>
                        void deleteEnquiry(
                          enquiry
                        )
                      }
                      disabled={
                        deletingId ===
                        enquiry.id
                      }
                    >
                      {deletingId ===
                      enquiry.id ? (
                        <Loader2
                          size={16}
                          className={
                            styles.spin
                          }
                        />
                      ) : (
                        <Trash2
                          size={16}
                        />
                      )}
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>

      {selectedEnquiry && (
        <div
          className={
            styles.modalBackdrop
          }
          onClick={
            closeEnquiry
          }
        >
          <section
            className={
              styles.enquiryModal
            }
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <div
              className={
                styles.modalHeader
              }
            >
              <div>
                <p
                  className={
                    styles.eyebrow
                  }
                >
                  ENQUIRY
                </p>

                <h2>
                  {
                    selectedEnquiry.names
                  }
                </h2>

                <span
                  className={
                    styles.submittedDate
                  }
                >
                  Submitted{" "}
                  {formatDateTime(
                    selectedEnquiry.created_at
                  )}
                </span>
              </div>

              <button
                type="button"
                className={
                  styles.closeButton
                }
                onClick={
                  closeEnquiry
                }
                aria-label="Close enquiry"
              >
                <X size={20} />
              </button>
            </div>

            <div
              className={
                styles.contactGrid
              }
            >
              <div
                className={
                  styles.contactItem
                }
              >
                <Mail
                  size={17}
                />

                <div>
                  <span>Email</span>

                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                  >
                    {
                      selectedEnquiry.email
                    }
                  </a>
                </div>
              </div>

              <div
                className={
                  styles.contactItem
                }
              >
                <Phone
                  size={17}
                />

                <div>
                  <span>Phone</span>

                  {selectedEnquiry.phone ? (
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                    >
                      {
                        selectedEnquiry.phone
                      }
                    </a>
                  ) : (
                    <strong>
                      Not provided
                    </strong>
                  )}
                </div>
              </div>

              <div
                className={
                  styles.contactItem
                }
              >
                <Inbox
                  size={17}
                />

                <div>
                  <span>
                    Reason
                  </span>

                  <strong>
                    {selectedEnquiry.reason ||
                      "General enquiry"}
                  </strong>
                </div>
              </div>

              <div
                className={
                  styles.contactItem
                }
              >
                <Users
                  size={17}
                />

                <div>
                  <span>
                    Group size
                  </span>

                  <strong>
                    {selectedEnquiry.group_size !==
                    null
                      ? selectedEnquiry.group_size
                      : "Not provided"}
                  </strong>
                </div>
              </div>
            </div>

            <div
              className={
                styles.messageSection
              }
            >
              <span>
                MESSAGE
              </span>

              <p>
                {
                  selectedEnquiry.message
                }
              </p>
            </div>

            <div
              className={
                styles.modalActions
              }
            >
              <button
                type="button"
                className={
                  styles.statusButton
                }
                onClick={() =>
                  void toggleReadStatus(
                    selectedEnquiry
                  )
                }
                disabled={
                  updatingId ===
                  selectedEnquiry.id
                }
              >
                {updatingId ===
                selectedEnquiry.id ? (
                  <Loader2
                    size={16}
                    className={
                      styles.spin
                    }
                  />
                ) : selectedEnquiry.is_read ? (
                  <Mail size={16} />
                ) : (
                  <MailOpen
                    size={16}
                  />
                )}

                {selectedEnquiry.is_read
                  ? "Mark as unread"
                  : "Mark as read"}
              </button>

              <a
                href={`mailto:${selectedEnquiry.email}`}
                className={
                  styles.replyButton
                }
              >
                <Mail size={16} />

                Reply by email
              </a>

              <button
                type="button"
                className={
                  styles.modalDeleteButton
                }
                onClick={() =>
                  void deleteEnquiry(
                    selectedEnquiry
                  )
                }
                disabled={
                  deletingId ===
                  selectedEnquiry.id
                }
              >
                {deletingId ===
                selectedEnquiry.id ? (
                  <Loader2
                    size={16}
                    className={
                      styles.spin
                    }
                  />
                ) : (
                  <Trash2
                    size={16}
                  />
                )}

                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}