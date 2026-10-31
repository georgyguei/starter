// ---------------------------------------------------------------------------
// Error types
// ---------------------------------------------------------------------------

type AnyString = string & {};

export type FileError = "TOO_MANY_FILES" | "FILE_INVALID_TYPE" | "FILE_TOO_LARGE" | "FILE_TOO_SMALL" | "FILE_INVALID" | "FILE_EXISTS" | AnyString;

// ---------------------------------------------------------------------------
// MIME types
// ---------------------------------------------------------------------------

export type ImageFileMimeType = "image/png" | "image/gif" | "image/jpeg" | "image/svg+xml" | "image/webp" | "image/avif" | "image/heic" | "image/bmp";

export type ApplicationFileMimeType =
  | "application/pdf"
  | "application/zip"
  | "application/json"
  | "application/xml"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "application/vnd.ms-powerpoint"
  | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  | "application/rtf"
  | "application/x-rar"
  | "application/x-7z-compressed"
  | "application/x-tar"
  | "application/vnd.microsoft.portable-executable";

export type TextFileMimeType = "text/css" | "text/csv" | "text/html" | "text/markdown" | "text/plain";

export type FontFileMimeType = "font/ttf" | "font/otf" | "font/woff" | "font/woff2" | "font/eot" | "font/svg";

export type VideoFileMimeType = "video/mp4" | "video/webm" | "video/ogg" | "video/quicktime" | "video/x-msvideo";

export type AudioFileMimeType = "audio/mpeg" | "audio/ogg" | "audio/wav" | "audio/webm" | "audio/aac" | "audio/flac" | "audio/x-m4a";

export type FileMimeTypeGroup = "image/*" | "audio/*" | "video/*" | "text/*" | "application/*" | "font/*";

export type FileMimeType =
  | ImageFileMimeType
  | ApplicationFileMimeType
  | TextFileMimeType
  | FontFileMimeType
  | VideoFileMimeType
  | AudioFileMimeType
  | FileMimeTypeGroup
  | AnyString;

// ---------------------------------------------------------------------------
// Callback detail types
// ---------------------------------------------------------------------------

export interface FileRejection {
  file: File;
  errors: FileError[];
}

export interface FileChangeDetails {
  acceptedFiles: File[];
  rejectedFiles: FileRejection[];
}

export interface FileAcceptDetails {
  files: File[];
}

export interface FileRejectDetails {
  files: FileRejection[];
}

export interface FileValidateDetails {
  acceptedFiles: File[];
  rejectedFiles: FileRejection[];
}

// ---------------------------------------------------------------------------
// FileEntry — per-file state managed by the hook
// ---------------------------------------------------------------------------

export type FileEntryStatus = "pending" | "uploading" | "processing" | "done" | "error";

export interface FileEntry {
  /** Unique ID for this entry */
  id: string;
  /** Original File object */
  file: File;
  /** Current lifecycle status */
  status: FileEntryStatus;
  /** Upload progress 0–100 */
  progress: number;
  /** Instant local preview via URL.createObjectURL (revoked on cleanup) */
  previewUrl: string | null;
  /** Final CDN URL — populated when status becomes "done" */
  resolvedUrl: string | null;
  /** Validation or upload errors */
  errors: FileError[];
}

// ---------------------------------------------------------------------------
// Hook options
// ---------------------------------------------------------------------------

export interface UseFileUploadOptions {
  /** Accepted file types — MIME string, array, or Record<mime, extensions[]> */
  accept?: Record<string, string[]> | FileMimeType | FileMimeType[];

  /** Maximum number of files. @default 1 */
  maxFiles?: number;

  /** Maximum file size in bytes. @default Infinity */
  maxFileSize?: number;

  /** Minimum file size in bytes. @default 0 */
  minFileSize?: number;

  /** Whether to allow drag and drop on the dropzone. @default true */
  allowDrop?: boolean;

  /** Whether to listen for paste events on the dropzone. @default false */
  allowPaste?: boolean;

  /** Whether to accept directories (webkit only). @default false */
  directory?: boolean;

  /** Whether the upload is disabled. @default false */
  disabled?: boolean;

  /** Camera capture mode for mobile. */
  capture?: "user" | "environment";

  /** Generate S3 key for each file */
  generateKey?: (file: File) => string;

  /** Called with all accepted + rejected files after processing */
  onFileChange?: (details: FileChangeDetails) => void;

  /** Called for accepted files only */
  onFileAccept?: (details: FileAcceptDetails) => void;

  /** Called for rejected files only */
  onFileReject?: (details: FileRejectDetails) => void;

  /** Called when a file upload completes */
  onUploadComplete?: (entry: FileEntry) => void;

  /** Custom validation — return error codes or null */
  validate?: (file: File, details: FileValidateDetails) => FileError[] | null;

  /** Transform files before uploading (e.g. client-side resize) */
  transformFiles?: (files: File[]) => Promise<File[]>;
}
