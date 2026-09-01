"use client";

import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Check,
  Clipboard,
  ImageIcon,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import styles from "./media.module.css";

type MediaFile = {
  name: string;
  id: string | null;
  updated_at: string | null;
  created_at: string | null;
  last_accessed_at: string | null;
  metadata:
    | Record<string, unknown>
    | null;
  path: string;
  publicUrl: string;
};

const BUCKET = "studio-media";

export default function AdminMediaPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [files, setFiles] =
    useState<MediaFile[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [
    deletingPath,
    setDeletingPath,
  ] = useState<string | null>(
    null
  );

  const [
    copiedPath,
    setCopiedPath,
  ] = useState<string | null>(
    null
  );

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const loadFiles = useCallback(
    async () => {
      setLoading(true);
      setError("");

      const collectedFiles:
        MediaFile[] = [];

      async function walkFolder(
        folder = ""
      ) {
        const {
          data,
          error: listError,
        } = await supabase.storage
          .from(BUCKET)
          .list(folder, {
            limit: 1000,
            sortBy: {
              column: "name",
              order: "asc",
            },
          });

        if (listError) {
          throw listError;
        }

        for (const item of data ?? []) {
          const path = folder
            ? `${folder}/${item.name}`
            : item.name;

          const isFolder =
            item.id === null &&
            item.metadata === null;

          if (isFolder) {
            await walkFolder(path);
            continue;
          }

          const {
            data: publicUrlData,
          } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(path);

          collectedFiles.push({
            ...item,
            path,
            publicUrl:
              publicUrlData.publicUrl,
          });
        }
      }

      try {
        await walkFolder();

        collectedFiles.sort(
          (a, b) => {
            const aDate =
              a.updated_at ||
              a.created_at ||
              "";

            const bDate =
              b.updated_at ||
              b.created_at ||
              "";

            return bDate.localeCompare(
              aDate
            );
          }
        );

        setFiles(
          collectedFiles
        );
      } catch (loadError) {
        const text =
          loadError instanceof Error
            ? loadError.message
            : "Could not load media.";

        setError(text);
      }

      setLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    void loadFiles();
  }, [loadFiles]);

  async function handleUpload(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles =
      Array.from(
        event.target.files ?? []
      );

    if (
      selectedFiles.length === 0
    ) {
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      for (const file of selectedFiles) {
        if (
          !file.type.startsWith(
            "image/"
          )
        ) {
          throw new Error(
            `"${file.name}" is not an image.`
          );
        }

        if (
          file.size >
          8 * 1024 * 1024
        ) {
          throw new Error(
            `"${file.name}" is larger than 8MB.`
          );
        }

        const extension =
          file.name
            .split(".")
            .pop()
            ?.toLowerCase() ||
          "jpg";

        const fileName =
          `${crypto.randomUUID()}.${extension}`;

        const path =
          `media/${fileName}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from(BUCKET)
          .upload(
            path,
            file,
            {
              cacheControl:
                "3600",
              upsert: false,
            }
          );

        if (uploadError) {
          throw uploadError;
        }
      }

      setMessage(
        selectedFiles.length === 1
          ? "Image uploaded successfully."
          : `${selectedFiles.length} images uploaded successfully.`
      );

      await loadFiles();
    } catch (uploadError) {
      const text =
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed.";

      setError(text);
    }

    setUploading(false);

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }
  }

  async function deleteFile(
    file: MediaFile
  ) {
    const confirmed =
      window.confirm(
        `Delete "${file.name}"?\n\nIf this image is still used on a public page, it will stop displaying there.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingPath(
      file.path
    );

    setError("");
    setMessage("");

    const {
      error: deleteError,
    } = await supabase.storage
      .from(BUCKET)
      .remove([
        file.path,
      ]);

    if (deleteError) {
      setError(
        deleteError.message
      );

      setDeletingPath(null);

      return;
    }

    setMessage(
      "Image deleted."
    );

    setDeletingPath(null);

    await loadFiles();
  }

  async function copyUrl(
    file: MediaFile
  ) {
    try {
      await navigator.clipboard
        .writeText(
          file.publicUrl
        );

      setCopiedPath(
        file.path
      );

      window.setTimeout(
        () => {
          setCopiedPath(
            (current) =>
              current ===
              file.path
                ? null
                : current
          );
        },
        1600
      );
    } catch {
      setError(
        "Could not copy the image URL."
      );
    }
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
            Media
          </h1>

          <p
            className={
              styles.intro
            }
          >
            Manage images uploaded
            to the Crafteris media
            library.
          </p>
        </div>

        <div
          className={
            styles.headerActions
          }
        >
          <button
            type="button"
            className={
              styles.secondaryButton
            }
            onClick={() =>
              void loadFiles()
            }
            disabled={
              loading
            }
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? styles.spin
                  : undefined
              }
            />

            Refresh
          </button>

          <button
            type="button"
            className={
              styles.uploadButton
            }
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={
              uploading
            }
          >
            {uploading ? (
              <>
                <Loader2
                  size={16}
                  className={
                    styles.spin
                  }
                />

                Uploading...
              </>
            ) : (
              <>
                <Upload
                  size={16}
                />

                Upload images
              </>
            )}
          </button>

          <input
            ref={
              fileInputRef
            }
            className={
              styles.hiddenInput
            }
            type="file"
            accept="image/*"
            multiple
            onChange={
              handleUpload
            }
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

      <section
        className={
          styles.libraryCard
        }
      >
        <div
          className={
            styles.libraryHeader
          }
        >
          <div>
            <h2>
              Media library
            </h2>

            <p>
              {files.length}{" "}
              {files.length ===
              1
                ? "image"
                : "images"}
            </p>
          </div>

          <span>
            Bucket:{" "}
            <strong>
              {BUCKET}
            </strong>
          </span>
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
              Loading media...
            </p>
          </div>
        ) : files.length ===
          0 ? (
          <div
            className={
              styles.emptyState
            }
          >
            <ImageIcon
              size={34}
            />

            <h3>
              No images yet
            </h3>

            <p>
              Upload your first
              image to the media
              library.
            </p>

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              <Upload
                size={16}
              />

              Upload image
            </button>
          </div>
        ) : (
          <div
            className={
              styles.mediaGrid
            }
          >
            {files.map(
              (file) => (
                <article
                  className={
                    styles.mediaCard
                  }
                  key={
                    file.path
                  }
                >
                  <div
                    className={
                      styles.imageWrapper
                    }
                  >
                    <img
                      src={
                        file.publicUrl
                      }
                      alt=""
                    />
                  </div>

                  <div
                    className={
                      styles.mediaContent
                    }
                  >
                    <div
                      className={
                        styles.fileInfo
                      }
                    >
                      <strong
                        title={
                          file.name
                        }
                      >
                        {
                          file.name
                        }
                      </strong>

                      <span
                        title={
                          file.path
                        }
                      >
                        {
                          file.path
                        }
                      </span>
                    </div>

                    <div
                      className={
                        styles.cardActions
                      }
                    >
                      <button
                        type="button"
                        className={
                          styles.copyButton
                        }
                        onClick={() =>
                          void copyUrl(
                            file
                          )
                        }
                      >
                        {copiedPath ===
                        file.path ? (
                          <>
                            <Check
                              size={
                                14
                              }
                            />

                            Copied
                          </>
                        ) : (
                          <>
                            <Clipboard
                              size={
                                14
                              }
                            />

                            Copy URL
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className={
                          styles.deleteButton
                        }
                        disabled={
                          deletingPath ===
                          file.path
                        }
                        onClick={() =>
                          void deleteFile(
                            file
                          )
                        }
                      >
                        {deletingPath ===
                        file.path ? (
                          <Loader2
                            size={
                              14
                            }
                            className={
                              styles.spin
                            }
                          />
                        ) : (
                          <Trash2
                            size={
                              14
                            }
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