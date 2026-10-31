"use client";

import { useEffect, useState } from "react";

import type { ImagePlaceholder } from "@/lib/server/image-placeholders";

/**
 * Client-side blur placeholders. Sharp can't run in the browser, so this
 * hook asks the server through the /api/image-placeholders route (which uses
 * the server-only lib/server/image-placeholders module).
 *
 * Two caches keep it cheap while scrolling a virtualized list:
 * - `resolved` — final values per src (survives row unmount/remount),
 * - `pending` — in-flight promises (deduplicates concurrent requests).
 *
 * Requests are batched: all srcs requested within a short window go out as
 * ONE call to /api/image-placeholders.
 */

const resolved = new Map<string, ImagePlaceholder | null>();
const pending = new Map<string, Promise<ImagePlaceholder | null>>();

let queue: string[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const waiters = new Map<string, Array<(value: ImagePlaceholder | null) => void>>();

/** The client half of the placeholder API — batched POST to the route. */
async function fetchPlaceholders(srcs: readonly string[]): Promise<(ImagePlaceholder | null)[]> {
  const response = await fetch("/api/image-placeholders", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ srcs }),
  });
  if (!response.ok) {
    return srcs.map(() => null);
  }
  const json = (await response.json()) as {
    placeholders: (ImagePlaceholder | null)[];
  };
  return json.placeholders;
}

function flush() {
  flushTimer = null;
  const batch = [...new Set(queue)];
  queue = [];
  if (batch.length === 0) {
    return;
  }
  void fetchPlaceholders(batch).then((results) => {
    batch.forEach((src, index) => {
      const value = results[index] ?? null;
      resolved.set(src, value);
      pending.delete(src);
      for (const resolvePromise of waiters.get(src) ?? []) {
        resolvePromise(value);
      }
      waiters.delete(src);
    });
  });
}

function requestPlaceholder(src: string): Promise<ImagePlaceholder | null> {
  const hit = resolved.get(src);
  if (hit !== undefined) {
    return Promise.resolve(hit);
  }
  const inFlight = pending.get(src);
  if (inFlight) {
    return inFlight;
  }

  const promise = new Promise<ImagePlaceholder | null>((resolvePromise) => {
    const list = waiters.get(src) ?? [];
    list.push(resolvePromise);
    waiters.set(src, list);
    queue.push(src);
    if (!flushTimer) {
      flushTimer = setTimeout(flush, 30);
    }
  });
  pending.set(src, promise);
  return promise;
}

/** Resolves the blur placeholder for `src` — `null` until ready. */
export function useImagePlaceholder(src: string): ImagePlaceholder | null {
  const [placeholder, setPlaceholder] = useState<ImagePlaceholder | null>(() => resolved.get(src) ?? null);

  useEffect(() => {
    let alive = true;
    requestPlaceholder(src).then((value) => {
      if (alive) {
        setPlaceholder(value);
      }
    });
    return () => {
      alive = false;
    };
  }, [src]);

  return placeholder;
}
