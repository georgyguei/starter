import { createHighlighter } from "shiki";

/**
 * Shared highlighter singleton — cached on `globalThis` so HMR in dev
 * doesn't create duplicate instances. Follows the same pattern as Prisma.
 *
 * @see https://shiki.style/guide/next#highlighter-instance
 */

const globalForHighlighter = globalThis as typeof globalThis & {
  __highlighter?: ReturnType<typeof createHighlighter>;
};

export const highlighter =
  globalForHighlighter.__highlighter ??
  createHighlighter({
    themes: ["dracula"],
    langs: ["html", "tsx"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForHighlighter.__highlighter = highlighter;
}
