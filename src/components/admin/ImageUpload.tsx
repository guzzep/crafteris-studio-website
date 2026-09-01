"use client";

import {
  ChangeEvent,
  useMemo,
  useState,
} from "react";

import {
  ImagePlus,
  Loader2,
  Trash2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import styles from "./ImageUpload.module.css";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
};

export default function ImageUpload({
  value,
  onChange,
  folder = "general",
}: ImageUploadProps) {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] = useState("");

  async function handleUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (!file.type.startsWith("image/")) {
      setError(
        "Please choose an image file."
      );

      event.target.value = "";

      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError(
        "The image must be smaller than 8 MB."
      );

      event.target.value = "";

      return;
    }

    setUploading(true);

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const filePath =
      `${folder}/${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from("studio-media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      event.target.value = "";
      return;
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("studio-media")
      .getPublicUrl(filePath);

    onChange(
      publicUrlData.publicUrl
    );

    setUploading(false);

    event.target.value = "";
  }

  function clearImage() {
    onChange("");
    setError("");
  }

  return (
    <div className={styles.wrapper}>
      {value ? (
        <div
          className={
            styles.previewWrapper
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded preview"
            className={styles.preview}
          />

          <div
            className={styles.previewActions}
          >
            <label
              className={
                styles.replaceButton
              }
            >
              <ImagePlus size={16} />

              Replace image

              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>

            <button
              type="button"
              className={
                styles.removeButton
              }
              onClick={clearImage}
              disabled={uploading}
            >
              <Trash2 size={16} />

              Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          className={
            styles.uploadArea
          }
        >
          {uploading ? (
            <>
              <Loader2
                size={28}
                className={styles.spin}
              />

              <strong>
                Uploading image...
              </strong>
            </>
          ) : (
            <>
              <ImagePlus size={30} />

              <strong>
                Upload image
              </strong>

              <span>
                JPG, PNG or WebP · max 8 MB
              </span>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}

      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}