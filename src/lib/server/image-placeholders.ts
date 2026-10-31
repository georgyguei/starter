/**
 * SERVER-ONLY image placeholder generation (plaiceholder + sharp).
 *
 * Lives under lib/server/ — code here must only ever be imported from server
 * code (Server Components, route handlers). The `server-only` marker makes
 * importing it from a client component fail the build.
 *
 * The browser equivalent lives in
 * src/components/virtual/use-image-placeholder.ts (it delegates to the
 * /api/image-placeholders route, which uses this module).
 */

import "server-only";
import { unstable_cache } from "next/cache";
import { getPlaiceholder } from "plaiceholder";

/** Blur placeholder payload — pass to next/image `placeholder="blur"`. */
export interface ImagePlaceholder {
  /** Base64 blur placeholder — pass to next/image `blurDataURL`. */
  blurDataURL: string;
  /** Intrinsic dimensions of the source image. */
  width: number;
  height: number;
}

/** Generates one placeholder — cached for a day per URL. */
async function computeOne(src: string): Promise<ImagePlaceholder | null> {
  try {
    const response = await fetch(src, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 86400 },
    });
    if (!response.ok) {
      return null;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const { base64, metadata } = await getPlaiceholder(buffer, { size: 12 });
    return {
      blurDataURL: base64,
      width: metadata.width,
      height: metadata.height,
    };
  } catch {
    // Never break the page because a placeholder failed to generate.
    return null;
  }
}

const computeCached = unstable_cache(computeOne, ["image-placeholder"], {
  revalidate: 86400,
});

/** Runs `fn` over `items` with at most `limit` concurrent executions. */
async function mapWithConcurrency<T, R>(items: readonly T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      // oxlint-disable-next-line no-await-in-loop -- bounded-concurrency workers await intentionally.
      results[index] = await fn(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

/** Computes placeholders for many sources (server-only, cached).
 * Sharp is CPU-heavy, so execution is capped at 4 concurrent images. */
export async function getImagePlaceholders(srcs: readonly string[]): Promise<(ImagePlaceholder | null)[]> {
  return mapWithConcurrency(srcs, 4, (src) => computeCached(src));
}

export async function getImagePlaceholder(src: string): Promise<ImagePlaceholder | null> {
  const [placeholder] = await getImagePlaceholders([src]);
  return placeholder ?? null;
}
