"use client";

/**
 * useFileUpload — Headless file upload hook
 *
 * Manages the entire file upload lifecycle:
 *   1. File acceptance pipeline (validate → transform → preview → upload)
 *   2. Drag/drop with nested element handling
 *   3. Clipboard paste support
 *   4. Prop getters for dropzone and hidden input
 *   5. Per-file state (FileEntry) with optimistic blob previews
 *   6. Cancel / retry / remove actions
 *   7. Integration with the Zustand file-upload store for S3 uploading
 *
 * Performance notes:
 *   - useEffectEvent for stable callbacks that read latest props without deps
 *   - useReducer for batched state updates
 *   - blob URLs are created synchronously (instant preview) and revoked on cleanup
 *   - drag counter pattern prevents flickering on nested elements
 */

import { useCallback, useEffect, useEffectEvent, useMemo, useReducer, useRef } from "react";

import type { FileEntry, FileEntryStatus, UseFileUploadOptions } from "./types";

import { useAddUpload, useFileUploadStore, useRemoveUpload } from "./file-upload-store";
import { createPreviewUrl, getAcceptAttrString, getFilesFromClipboard, getFilesFromDataTransfer, partitionFiles, revokePreviewUrl } from "./utils";

// ---------------------------------------------------------------------------
// Reducer — single source of truth for local state
// ---------------------------------------------------------------------------

interface State {
  entries: FileEntry[];
  isDragging: boolean;
}

type Action =
  | { type: "ADD_ENTRIES"; entries: FileEntry[] }
  | { type: "UPDATE_ENTRY"; id: string; patch: Partial<FileEntry> }
  | { type: "REMOVE_ENTRY"; id: string }
  | { type: "SET_DRAGGING"; value: boolean }
  | { type: "CLEAR_ALL" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_ENTRIES":
      return { ...state, entries: [...state.entries, ...action.entries] };

    case "UPDATE_ENTRY": {
      const idx = state.entries.findIndex((e) => e.id === action.id);
      if (idx === -1) {
        return state;
      }
      const updated = [...state.entries];
      updated[idx] = { ...updated[idx], ...action.patch };
      return { ...state, entries: updated };
    }

    case "REMOVE_ENTRY":
      return { ...state, entries: state.entries.filter((e) => e.id !== action.id) };

    case "SET_DRAGGING":
      if (state.isDragging === action.value) {
        return state; // bail early
      }
      return { ...state, isDragging: action.value };

    case "CLEAR_ALL":
      return { ...state, entries: [] };

    default:
      return state;
  }
}

const INITIAL_STATE: State = { entries: [], isDragging: false };

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    accept,
    maxFiles = 1,
    maxFileSize = Infinity,
    minFileSize = 0,
    allowDrop = true,
    allowPaste = false,
    directory = false,
    disabled = false,
    capture,
  } = options;

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // ---- Store integration ----
  const addUpload = useAddUpload();
  const removeUpload = useRemoveUpload();
  const storeUploads = useFileUploadStore((s) => s.uploads);

  // ---- Accept string (memoised) ----
  const acceptString = useMemo(() => getAcceptAttrString(accept), [accept]);

  // ===========================================================================
  // useEffectEvent — stable callbacks that always read latest props/state
  // ===========================================================================

  /**
   * Sync store → local entries.
   * Reads state.entries and storeUploads but must not re-subscribe on entries changes
   * (only trigger when storeUploads changes). useEffectEvent is the correct primitive.
   */
  const syncStoreToEntries = useEffectEvent(() => {
    for (const entry of state.entries) {
      if (entry.status === "done" || entry.status === "error") {
        continue;
      }

      const storeEntry = storeUploads.get(entry.id);

      if (!storeEntry) {
        continue;
      }

      // Map store status → local status
      let nextStatus: FileEntryStatus = entry.status;
      if (storeEntry.status === "uploading") {
        nextStatus = "uploading";
      } else if (storeEntry.status === "processing") {
        nextStatus = "processing";
      } else if (storeEntry.status === "complete") {
        nextStatus = "done";
      } else if (storeEntry.status === "failed") {
        nextStatus = "error";
      }

      const changed =
        nextStatus !== entry.status || storeEntry.progress !== entry.progress || (storeEntry.resolvedUrl && storeEntry.resolvedUrl !== entry.resolvedUrl);

      if (changed) {
        dispatch({
          type: "UPDATE_ENTRY",
          id: entry.id,
          patch: {
            status: nextStatus,
            progress: storeEntry.progress,
            resolvedUrl: storeEntry.resolvedUrl ?? entry.resolvedUrl,
          },
        });

        // Fire completion callback
        if (nextStatus === "done" && storeEntry.resolvedUrl) {
          options.onUploadComplete?.({
            ...entry,
            status: "done",
            progress: 100,
            resolvedUrl: storeEntry.resolvedUrl,
          });
        }
      }
    }
  });

  // React to store changes only
  useEffect(() => {
    syncStoreToEntries();
    // oxlint-disable-next-line react/exhaustive-effect-dependencies -- We want to sync store changes to local state
  }, [storeUploads]);

  // ---- Blob URL cleanup on unmount ----
  const cleanupBlobUrls = useEffectEvent(() => {
    for (const entry of state.entries) {
      revokePreviewUrl(entry.previewUrl);
    }
  });

  useEffect(() => {
    return cleanupBlobUrls;
  }, []);

  // ---- Core: process incoming files ----
  const processFiles = useEffectEvent(async (rawFiles: File[]) => {
    if (disabled || rawFiles.length === 0) {
      return;
    }

    // 1. Run transforms if provided
    const files = options.transformFiles ? await options.transformFiles(rawFiles) : rawFiles;

    // 2. Validate + partition
    const { accepted, rejected } = partitionFiles(files, {
      accept: acceptString,
      minSize: minFileSize,
      maxSize: maxFileSize,
      maxFiles,
      existingCount: state.entries.length,
      validate: options.validate
        ? (f: File) => {
            const validateFn = options.validate;
            return validateFn ? validateFn(f, { acceptedFiles: [], rejectedFiles: [] }) : null;
          }
        : undefined,
    });

    // 3. Fire callbacks
    options.onFileChange?.({ acceptedFiles: accepted, rejectedFiles: rejected });
    if (accepted.length > 0) {
      options.onFileAccept?.({ files: accepted });
    }
    if (rejected.length > 0) {
      options.onFileReject?.({ files: rejected });
    }

    // 4. Build entries with pre-computed store keys.
    //    We compute the key ourselves (same logic as the store) so we can
    //    dispatch ADD_ENTRIES BEFORE calling addUpload. This avoids a race
    //    where the store fires async progress updates before React commits
    //    the local entries, causing the sync effect to skip them.
    const newEntries: FileEntry[] = accepted.map((file) => {
      const keyFn = options.generateKey;
      const id = keyFn ? keyFn(file) : `${file.name}-${Date.now()}`;
      return {
        id,
        file,
        status: "pending" as const,
        progress: 0,
        previewUrl: createPreviewUrl(file),
        resolvedUrl: null,
        errors: [],
      };
    });

    if (newEntries.length === 0) {
      return;
    }

    // Dispatch local entries first — ensures they exist before store updates
    dispatch({ type: "ADD_ENTRIES", entries: newEntries });

    // Now enqueue uploads — the store will use the same IDs
    for (const entry of newEntries) {
      addUpload(entry.file, "", () => entry.id);
    }
  });

  // ---- Drag/drop handlers ----
  const onDragEnter = useEffectEvent((e: React.DragEvent) => {
    if (!allowDrop || disabled) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (dragCounterRef.current === 1) {
      dispatch({ type: "SET_DRAGGING", value: true });
    }
  });

  const onDragOver = useEffectEvent((e: React.DragEvent) => {
    if (!allowDrop || disabled) {
      return;
    }
    e.preventDefault(); // Required to allow drop
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  });

  const onDragLeave = useEffectEvent((e: React.DragEvent) => {
    if (!allowDrop || disabled) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      dispatch({ type: "SET_DRAGGING", value: false });
    }
  });

  const onDrop = useEffectEvent(async (e: React.DragEvent) => {
    if (!allowDrop || disabled) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    dispatch({ type: "SET_DRAGGING", value: false });

    const files = await getFilesFromDataTransfer(e.dataTransfer.items, directory);
    processFiles(files);
  });

  // ---- Paste handler ----
  const onPaste = useEffectEvent((e: React.ClipboardEvent | ClipboardEvent) => {
    if (!allowPaste || disabled) {
      return;
    }
    const dt = "clipboardData" in e ? e.clipboardData : null;
    if (!dt) {
      return;
    }

    const files = getFilesFromClipboard(dt);
    if (files.length > 0) {
      e.preventDefault();
      processFiles(files);
    }
  });

  // ---- Input change handler ----
  const onInputChange = useEffectEvent((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    processFiles(files);
    // Reset so the same file can be selected again
    e.target.value = "";
  });

  // ---- Global paste listener ----
  useEffect(() => {
    if (!allowPaste || disabled) {
      return;
    }

    const handler = (e: ClipboardEvent) => onPaste(e);
    window.addEventListener("paste", handler);
    return () => window.removeEventListener("paste", handler);
  }, [allowPaste, disabled]);

  // ===========================================================================
  // Public API
  // ===========================================================================

  /** Programmatically open the browser file picker. */
  const open = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  /** Cancel an in-flight upload and remove the entry. */
  const cancel = useEffectEvent((entryId: string) => {
    const entry = state.entries.find((e) => e.id === entryId);
    if (entry) {
      revokePreviewUrl(entry.previewUrl);
      removeUpload(entryId);
    }
    dispatch({ type: "REMOVE_ENTRY", id: entryId });
  });

  /** Re-enqueue a failed entry. */
  const retry = useEffectEvent((entryId: string) => {
    const entry = state.entries.find((e) => e.id === entryId);
    if (entry?.status !== "error") {
      return;
    }

    dispatch({
      type: "UPDATE_ENTRY",
      id: entryId,
      patch: { status: "pending", progress: 0, errors: [] },
    });
    addUpload(entry.file, "", options.generateKey);
  });

  /** Remove a completed or failed entry. */
  const remove = useEffectEvent((entryId: string) => {
    const entry = state.entries.find((e) => e.id === entryId);
    if (entry) {
      revokePreviewUrl(entry.previewUrl);
    }
    dispatch({ type: "REMOVE_ENTRY", id: entryId });
  });

  /** Remove all entries and revoke all blob URLs. */
  const clearAll = useEffectEvent(() => {
    for (const entry of state.entries) {
      revokePreviewUrl(entry.previewUrl);
      if (entry.status === "uploading" || entry.status === "processing") {
        removeUpload(entry.id);
      }
    }
    dispatch({ type: "CLEAR_ALL" });
  });

  // ---- Derived state ----
  const isUploading = useMemo(
    () => state.entries.some((e) => e.status === "uploading" || e.status === "processing" || e.status === "pending"),
    [state.entries],
  );

  // ---- Prop getters ----
  const getDropzoneProps = useCallback(
    () => ({
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop,
      onPaste: allowPaste ? onPaste : undefined,
      role: "presentation" as const,
      tabIndex: 0,
      "data-dragging": state.isDragging || undefined,
    }),
    [state.isDragging, allowPaste],
  );

  const getInputProps = useCallback(
    () => ({
      type: "file" as const,
      ref: inputRef,
      accept: acceptString,
      multiple: maxFiles > 1,
      onChange: onInputChange,
      capture,
      webkitdirectory: directory || undefined,
      style: { display: "none" } as const,
      tabIndex: -1,
      "aria-hidden": true as const,
    }),
    [acceptString, maxFiles, capture, directory],
  );

  return {
    // State
    entries: state.entries,
    isDragging: state.isDragging,
    isUploading,

    // Prop getters
    getDropzoneProps,
    getInputProps,

    // Actions
    open,
    cancel,
    retry,
    remove,
    clearAll,
    processFiles,
  } as const;
}
