/**
 * File Upload Utilities
 *
 * Pure functions — zero React dependency. Extracted from the prototype and
 * hardened with performance optimizations.
 */

import { slashSuffixRegex } from "@/utils/mask";

import type { FileError, FileMimeType, FileRejection } from "./types";

// ---------------------------------------------------------------------------
// MIME types — compact lookup map parsed once at module load
// ---------------------------------------------------------------------------

const MIME_TYPES_RAW =
  /*#__PURE__*/
  "3g2_video/3gpp2[3gp,3gpp_video/3gpp[3mf_model/3mf[7z_application/x-7z-compressed[aac_audio/aac[ac_application/pkix-attr-cert[adp_audio/adpcm[adts_audio/aac[ai_application/postscript[aml_application/automationml-aml+xml[amlx_application/automationml-amlx+zip[amr_audio/amr[apk_application/vnd.android.package-archive[apng_image/apng[appcache,manifest_text/cache-manifest[appinstaller_application/appinstaller[appx_application/appx[appxbundle_application/appxbundle[asc_application/pgp-keys[atom_application/atom+xml[atomcat_application/atomcat+xml[atomdeleted_application/atomdeleted+xml[atomsvc_application/atomsvc+xml[au,snd_audio/basic[avi_video/x-msvideo[avci_image/avci[avcs_image/avcs[avif_image/avif[aw_application/applixware[bdoc_application/bdoc[bin,bpk,buffer,deb,deploy,dist,distz,dll,dmg,dms,dump,elc,exe,img,iso,lrf,mar,msi,msm,msp,pkg,so_application/octet-stream[bmp,dib_image/bmp[btf,btif_image/prs.btif[bz2_application/x-bzip2[c_text/x-c[ccxml_application/ccxml+xml[cdfx_application/cdfx+xml[cdmia_application/cdmi-capability[cdmic_application/cdmi-container[cdmid_application/cdmi-domain[cdmio_application/cdmi-object[cdmiq_application/cdmi-queue[cer_application/pkix-cert[cgm_image/cgm[cjs_application/node[class_application/java-vm[coffee,litcoffee_text/coffeescript[conf,def,in,ini,list,log,text,txt_text/plain[cpp,cxx,cc_text/x-c++src[cpl_application/cpl+xml[cpt_application/mac-compactpro[crl_application/pkix-crl[css_text/css[csv_text/csv[cu_application/cu-seeme[cwl_application/cwl[cww_application/prs.cww[davmount_application/davmount+xml[dbk_application/docbook+xml[doc_application/msword[docx_application/vnd.openxmlformats-officedocument.wordprocessingml.document[dsc_text/prs.lines.tag[dssc_application/dssc+der[dtd_application/xml-dtd[dwd_application/atsc-dwd+xml[ear,jar,war_application/java-archive[ecma_application/ecmascript[emf_image/emf[eml,mime_message/rfc822[emma_application/emma+xml[emotionml_application/emotionml+xml[eot_application/vnd.ms-fontobject[eps,ps_application/postscript[epub_application/epub+zip[exi_application/exi[exp_application/express[exr_image/aces[ez_application/andrew-inset[fdf_application/fdf[fdt_application/fdt+xml[fits_image/fits[flac_audio/flac[flv_video/x-flv[g3_image/g3fax[geojson_application/geo+json[gif_image/gif[glb_model/gltf-binary[gltf_model/gltf+json[gml_application/gml+xml[go_text/x-go[gpx_application/gpx+xml[gz_application/gzip[h_text/x-h[h261_video/h261[h263_video/h263[h264_video/h264[heic_image/heic[heics_image/heic-sequence[heif_image/heif[heifs_image/heif-sequence[htm,html,shtml_text/html[ico_image/x-icon[icns_image/x-icns[ics,ifb_text/calendar[iges,igs_model/iges[ink,inkml_application/inkml+xml[ipa_application/octet-stream[java_text/x-java-source[jp2,jpg2_image/jp2[jpeg,jpe,jpg_image/jpeg[jpf,jpx_image/jpx[jpm,jpgm_image/jpm[jpgv_video/jpeg[jph_image/jph[js,mjs_text/javascript[json_application/json[json5_application/json5[jsonld_application/ld+json[jsx_text/jsx[jxl_image/jxl[jxr_image/jxr[ktx_image/ktx[ktx2_image/ktx2[less_text/less[m1v,m2v,mpe,mpeg,mpg_video/mpeg[m4a_audio/mp4[m4v_video/x-m4v[md,markdown_text/markdown[mid,midi,kar,rmi_audio/midi[mkv_video/x-matroska[mp2,mp2a,mp3,mpga,m3a,m2a_audio/mpeg[mp4,mp4v,mpg4_video/mp4[mp4a_audio/mp4[mp4s,m4p_application/mp4[odp_application/vnd.oasis.opendocument.presentation[oda_application/oda[ods_application/vnd.oasis.opendocument.spreadsheet[odt_application/vnd.oasis.opendocument.text[oga,ogg,opus,spx_audio/ogg[ogv_video/ogg[ogx_application/ogg[otf_font/otf[p12,pfx_application/x-pkcs12[pdf_application/pdf[pem_application/x-pem-file[php_text/x-php[png_image/png[ppt_application/vnd.ms-powerpoint[pptx_application/vnd.openxmlformats-officedocument.presentationml.presentation[pskcxml_application/pskc+xml[psd_image/vnd.adobe.photoshop[py_text/x-python[qt,mov_video/quicktime[rar_application/vnd.rar[rdf_application/rdf+xml[rtf_text/rtf[sass_text/x-sass[scss_text/x-scss[sgm,sgml_text/sgml[sh_application/x-sh[svg,svgz_image/svg+xml[swf_application/x-shockwave-flash[tar_application/x-tar[tif,tiff_image/tiff[toml_application/toml[ts_video/mp2t[tsx_text/tsx[tsv_text/tab-separated-values[ttc_font/collection[ttf_font/ttf[vtt_text/vtt[wasm_application/wasm[wav_audio/wav[weba_audio/webm[webm_video/webm[webmanifest_application/manifest+json[webp_image/webp[wma_audio/x-ms-wma[wmv_video/x-ms-wmv[woff_font/woff[woff2_font/woff2[xls_application/vnd.ms-excel[xlsx_application/vnd.openxmlformats-officedocument.spreadsheetml.sheet[xml_application/xml[xz_application/x-xz[yaml,yml_text/yaml[zip_application/zip";

/** Extension → MIME type lookup, parsed once at module load. */
export const mimeTypesMap: ReadonlyMap<string, string> = /*#__PURE__*/ new Map<string, string>(
  MIME_TYPES_RAW.split("[").flatMap((chunk) => {
    const [extensions, mimeType] = chunk.split("_");
    return extensions.split(",").map((ext) => [ext, mimeType] as [string, string]);
  }),
);

// ---------------------------------------------------------------------------
// Accept string helpers
// ---------------------------------------------------------------------------

const isMIMEType = (v: string) => v === "audio/*" || v === "video/*" || v === "image/*" || v === "text/*" || /\w+\/[-+.\w]+/g.test(v);

const isExt = (v: string) => /^.*\.[\w]+$/.test(v);
const isValidMIME = (v: string) => isMIMEType(v) || isExt(v);

/**
 * Normalise accept prop to the `<input accept="">` attribute string.
 * Handles string, string[], and Record<mime, ext[]> formats.
 */
export function getAcceptAttrString(accept: Record<string, string[]> | string | string[] | undefined): string | undefined {
  if (accept == null) {
    return undefined;
  }
  if (typeof accept === "string") {
    return accept;
  }
  if (Array.isArray(accept)) {
    return accept.filter(isValidMIME).join(",");
  }
  return Object.entries(accept)
    .reduce<string[]>((a, [mimeType, ext]) => {
      a.push(mimeType, ...ext);
      return a;
    }, [])
    .filter(isValidMIME)
    .join(",");
}

/** Resolve extension → MIME type from the lookup map. */
export function getFileMimeType(name: string): FileMimeType | null {
  const ext = name.split(".").pop();
  return ext ? ((mimeTypesMap.get(ext) as FileMimeType) ?? null) : null;
}

/** Sum sizes of all files in bytes. */
export const getTotalFileSize = (files: File[]): number => files.reduce((sum, f) => sum + f.size, 0);

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const isDefined = <T>(v: T | undefined): v is T => v !== undefined && v !== null;

/** Check if a file meets size constraints. Returns [valid, errorCode]. */
export function isValidFileSize(file: File, minSize?: number, maxSize?: number): [valid: boolean, error: FileError | null] {
  if (isDefined(file.size)) {
    if (isDefined(maxSize) && file.size > maxSize) {
      return [false, "FILE_TOO_LARGE"];
    }
    if (isDefined(minSize) && file.size < minSize) {
      return [false, "FILE_TOO_SMALL"];
    }
  }
  return [true, null];
}

/** Check if a file matches allowed MIME types + extensions. */
function isFileAccepted(file: File | null, accept: string[] | string | undefined): boolean {
  if (!file || !accept) {
    return true;
  }

  const types = Array.isArray(accept) ? accept : typeof accept === "string" ? accept.split(",") : [];
  if (types.length === 0) {
    return true;
  }

  const fileName = file.name || "";
  const mimeType = (file.type || getFileMimeType(fileName) || "").toLowerCase();
  const baseMimeType = mimeType.replace(slashSuffixRegex, "");

  return types.some((type) => {
    const t = type.trim().toLowerCase();
    if (t.charAt(0) === ".") {
      return fileName.toLowerCase().endsWith(t);
    }
    if (t.endsWith("/*")) {
      return baseMimeType === t.replace(slashSuffixRegex, "");
    }
    return mimeType === t;
  });
}

/** Check if a file passes type validation. Returns [valid, errorCode]. */
export function isValidFileType(file: File, accept: string | undefined): [valid: boolean, error: FileError | null] {
  // Firefox uses this MIME for files from the filesystem
  const ok = file.type === "application/x-moz-file" || isFileAccepted(file, accept);
  return [ok, ok ? null : "FILE_INVALID_TYPE"];
}

/** Shallow file equality check (name + size + type). */
export const isFileEqual = (a: File, b: File): boolean => a.name === b.name && a.size === b.size && a.type === b.type;

/**
 * Run all built-in validations on a single file.
 * Returns an array of error codes (empty if valid).
 */
export function validateFile(
  file: File,
  accept: string | undefined,
  minSize: number,
  maxSize: number,
  customValidate?: (file: File) => FileError[] | null,
): FileError[] {
  const errors: FileError[] = [];

  const [typeOk, typeErr] = isValidFileType(file, accept);
  if (!typeOk && typeErr) {
    errors.push(typeErr);
  }

  const [sizeOk, sizeErr] = isValidFileSize(file, minSize, maxSize);
  if (!sizeOk && sizeErr) {
    errors.push(sizeErr);
  }

  if (customValidate) {
    const custom = customValidate(file);
    if (custom) {
      errors.push(...custom);
    }
  }

  return errors;
}

/**
 * Partition an array of files into accepted and rejected, applying
 * per-file and count validations.
 */
export function partitionFiles(
  files: File[],
  options: {
    accept: string | undefined;
    minSize: number;
    maxSize: number;
    maxFiles: number;
    existingCount: number;
    validate?: (file: File) => FileError[] | null;
  },
): { accepted: File[]; rejected: FileRejection[] } {
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];

  const remaining = options.maxFiles - options.existingCount;

  for (const file of files) {
    const errors = validateFile(file, options.accept, options.minSize, options.maxSize, options.validate);

    if (errors.length > 0) {
      rejected.push({ file, errors });
    } else if (accepted.length >= remaining) {
      rejected.push({ file, errors: ["TOO_MANY_FILES"] });
    } else {
      accepted.push(file);
    }
  }

  return { accepted, rejected };
}

// ---------------------------------------------------------------------------
// Data URL / Blob helpers
// ---------------------------------------------------------------------------

/** Convert a data URI to a Blob. */
export function dataURItoBlob(uri: string): Blob {
  const binary = atob(uri.split(",")[1]);
  const mimeString = uri.split(",")[0].split(":")[1].split(";")[0];
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return new Blob([buffer], { type: mimeString });
}

/** Read file as data URL. Prefer `URL.createObjectURL` for previews — it's sync. */
export const getFileDataUrl = (file: File | Blob): Promise<string | undefined> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reader.abort();
      reject(new Error("Failed to read file as data URL"));
    };
    reader.onloadend = () => {
      const { result } = reader;
      if (result instanceof ArrayBuffer) {
        reject(new Error("Expected DataURL string, got ArrayBuffer"));
      } else {
        resolve(result || undefined);
      }
    };
    reader.readAsDataURL(file);
  });

// ---------------------------------------------------------------------------
// Directory / DataTransfer helpers
// ---------------------------------------------------------------------------

const getItemEntry = (item: DataTransferItem): FileSystemEntry | null => {
  const itemWithEntry = item as DataTransferItem & {
    getAsEntry?: () => FileSystemEntry;
  };
  if (typeof itemWithEntry.getAsEntry === "function") {
    return itemWithEntry.getAsEntry();
  }
  if (typeof item.webkitGetAsEntry === "function") {
    return item.webkitGetAsEntry();
  }
  return null;
};

const isDirectoryEntry = (e: FileSystemEntry): e is FileSystemDirectoryEntry => e.isDirectory;
const isFileEntry = (e: FileSystemEntry): e is FileSystemFileEntry => e.isFile;

const addRelativePath = (file: File, path: string): File => {
  Object.defineProperty(file, "relativePath", {
    value: path ? `${path}/${file.name}` : file.name,
  });
  return file;
};

const readFileEntry = (entry: FileSystemFileEntry, path: string): Promise<File> =>
  new Promise((resolve) => {
    entry.file((file) => resolve(addRelativePath(file, path)));
  });

const readDirectoryEntries = (reader: FileSystemDirectoryReader, path: string): Promise<File[]> =>
  new Promise((resolve) => {
    const all: Promise<File | File[]>[] = [];
    const read = () => {
      reader.readEntries((entries) => {
        if (entries.length === 0) {
          resolve(Promise.all(all).then((r) => r.flat()));
          return;
        }
        for (const entry of entries) {
          if (isDirectoryEntry(entry)) {
            all.push(readDirectoryEntries(entry.createReader(), `${path}${entry.name}/`));
          } else if (isFileEntry(entry)) {
            all.push(readFileEntry(entry, path));
          }
        }
        read(); // readEntries may return batches, keep going
      });
    };
    read();
  });

/**
 * Extract File objects from a DataTransfer's item list.
 * Handles both flat files and recursive directory traversal.
 */
export async function getFilesFromDataTransfer(items: DataTransferItemList, traverseDirectories: boolean): Promise<File[]> {
  const promises: Promise<File | File[] | null>[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind !== "file") {
      continue;
    }

    const entry = getItemEntry(item);

    if (entry && isDirectoryEntry(entry) && traverseDirectories) {
      promises.push(readDirectoryEntries(entry.createReader(), `${entry.name}/`));
    } else if (entry && isFileEntry(entry)) {
      promises.push(readFileEntry(entry, ""));
    } else {
      // Fallback: getAsFile() for browsers that don't support entries API
      const file = item.getAsFile();
      if (file) {
        promises.push(Promise.resolve(addRelativePath(file, "")));
      }
    }
  }

  const results = await Promise.all(promises);
  return results.flat().filter((f): f is File => f !== null);
}

/**
 * Extract File objects from a clipboard paste event's DataTransfer.
 * Returns only file items (ignores text/html clipboard data).
 */
export function getFilesFromClipboard(dt: DataTransfer): File[] {
  const files: File[] = [];
  for (let i = 0; i < dt.items.length; i++) {
    const item = dt.items[i];
    if (item.kind === "file") {
      const file = item.getAsFile();
      if (file) {
        files.push(file);
      }
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// Preview helpers
// ---------------------------------------------------------------------------

/** Whether a MIME type can be previewed as an image. */
export function isPreviewableImage(type: string): boolean {
  return /^image\/(jpeg|png|gif|webp|avif|svg\+xml|bmp)$/i.test(type);
}

/**
 * Create an object URL for instant preview. Returns null for non-previewable types.
 * Caller MUST revoke the URL when done to free memory.
 */
export function createPreviewUrl(file: File): string | null {
  if (isPreviewableImage(file.type)) {
    return URL.createObjectURL(file);
  }
  // Videos can also be previewed
  if (file.type.startsWith("video/")) {
    return URL.createObjectURL(file);
  }
  return null;
}

/** Revoke a previously created object URL. Safe to call with null. */
export function revokePreviewUrl(url: string | null): void {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

// ---------------------------------------------------------------------------
// ID generation
// ---------------------------------------------------------------------------

let counter = 0;

/** Fast, unique ID for file entries. No crypto overhead. */
export function createEntryId(): string {
  return `fu-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
