"use client";

/**
 * File Upload Store — minimal Zustand store for the useFileUpload hook.
 *
 * Manages per-file upload lifecycle state:
 *   - pending  → uploading → processing → complete
 *   - any      → failed (on error)
 *
 * For demo/development, uploads are simulated with a fake progress
 * interval. Replace simulateUpload with your real S3/API upload logic.
 */

import { create } from "zustand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UploadStatus = "idle" | "uploading" | "processing" | "complete" | "failed";

export interface UploadEntry {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number; // 0–100
  resolvedUrl: string | null;
}

interface FileUploadState {
  /** Map of all active uploads keyed by entry ID */
  uploads: Map<string, UploadEntry>;

  /** Add a file to the store and begin uploading */
  addUpload: (file: File, key: string, generateKey?: (file: File) => string) => string;

  /** Remove an upload from the store */
  removeUpload: (id: string) => void;

  /** Clear all uploads */
  clearAll: () => void;
}

// ---------------------------------------------------------------------------
// Simulated upload — replace with real S3 / API call
// ---------------------------------------------------------------------------

function simulateUpload(id: string, _file: File, setUploads: (updater: (prev: Map<string, UploadEntry>) => Map<string, UploadEntry>) => void) {
  const interval = setInterval(() => {
    setUploads((prev) => {
      const entry = prev.get(id);
      if (!entry) {
        clearInterval(interval);
        return prev;
      }

      const nextProgress = Math.min(entry.progress + Math.random() * 25, 100);
      const done = nextProgress >= 100;

      const next = new Map(prev);
      next.set(id, {
        ...entry,
        progress: nextProgress,
        status: done ? "complete" : "uploading",
        resolvedUrl: done ? URL.createObjectURL(entry.file) : null,
      });

      if (done) {
        clearInterval(interval);
      }
      return next;
    });
  }, 300);
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useFileUploadStore = create<FileUploadState>((set, get) => ({
  uploads: new Map(),

  addUpload: (file, _key, generateKey) => {
    const id = generateKey ? generateKey(file) : `${file.name}-${Date.now()}`;

    const entry: UploadEntry = {
      id,
      file,
      status: "idle",
      progress: 0,
      resolvedUrl: null,
    };

    set((state) => {
      const next = new Map(state.uploads);
      next.set(id, entry);
      return { uploads: next };
    });

    // Start simulated upload
    const setUploads = (updater: (prev: Map<string, UploadEntry>) => Map<string, UploadEntry>) => set((state) => ({ uploads: updater(state.uploads) }));

    simulateUpload(id, file, setUploads);

    return id;
  },

  removeUpload: (id) => {
    set((state) => {
      const entry = state.uploads.get(id);
      if (entry?.resolvedUrl) {
        URL.revokeObjectURL(entry.resolvedUrl);
      }
      const next = new Map(state.uploads);
      next.delete(id);
      return { uploads: next };
    });
  },

  clearAll: () => {
    const { uploads } = get();
    for (const entry of uploads.values()) {
      if (entry.resolvedUrl) {
        URL.revokeObjectURL(entry.resolvedUrl);
      }
    }
    set({ uploads: new Map() });
  },
}));

// ---------------------------------------------------------------------------
// Selector hooks (shallow stable)
// ---------------------------------------------------------------------------

export function useAddUpload() {
  return useFileUploadStore((s) => s.addUpload);
}

export function useRemoveUpload() {
  return useFileUploadStore((s) => s.removeUpload);
}
