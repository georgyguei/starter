import { type NextRequest, NextResponse } from "next/server";

import { getImagePlaceholders } from "@/lib/server/image-placeholders";
import { domainHostnameRegex } from "@/utils/mask";

/** Maximum number of images accepted per request. */
const MAX_SRCS = 100;
/** Maximum length of a single image URL. */
const MAX_SRC_LENGTH = 2048;
/** Maximum accepted JSON body size. */
const MAX_BODY_BYTES = 64 * 1024;

/** The accepted request body shape. */
interface ImagePlaceholdersBody {
  srcs?: string[];
}

/** Rejects non-HTTPS and non-domain hosts (no IP literals, localhost,
 * .local or numeric-obfuscated hosts) — basic SSRF protection. */
function isSafeImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > MAX_SRC_LENGTH) {
    return false;
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") {
    return false;
  }
  // Only real domain names: requires at least one dot, no colons or
  // leading digits (blocks IP literals and numeric host tricks).
  const host = url.hostname;
  return domainHostnameRegex.test(host);
}

function isImagePlaceholdersBody(value: unknown): value is ImagePlaceholdersBody {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (!("srcs" in value)) {
    return true;
  }
  return Array.isArray((value as ImagePlaceholdersBody).srcs);
}

export async function POST(request: NextRequest) {
  // Reject oversized bodies before parsing them.
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }

  const body: unknown = await request.json().catch(() => null);

  if (!isImagePlaceholdersBody(body)) {
    return NextResponse.json({ error: "Body must be JSON with a 'srcs' array" }, { status: 400 });
  }

  // Validate, deduplicate and cap the sources.
  const srcs = [...new Set((body.srcs ?? []).filter(isSafeImageUrl))].slice(0, MAX_SRCS);

  if (srcs.length === 0) {
    return NextResponse.json({ placeholders: [] });
  }

  const placeholders = await getImagePlaceholders(srcs);

  return NextResponse.json({ placeholders }, { headers: { "cache-control": "public, max-age=86400, s-maxage=86400" } });
}
