import { type UixComponent, uix } from "@repo/ui/factory";
import { cn } from "@repo/utils/classes";

export type HighlightChunk = {
  /**
   * Whether the text is a match
   */
  match: boolean;
  /**
   * The text to highlight
   */
  text: string;
};

export type HighlightSpan = {
  /**
   * The start index of the span
   */
  start: number;
  /**
   * The end index of the span
   */
  end: number;
  /**
   * Whether the span is a match
   */
  match?: boolean;
};

type HighlightProps = {
  /**
   * Whether to ignore case while matching
   */
  ignoreCase?: boolean;
  /**
   * Whether to match multiple instances of the query
   */
  matchAll?: boolean;
  /**
   * The query to highlight in the text
   */
  query: string | string[];
  /**
   * The text to highlight
   */
  text: string;
};

const escapeRegexp = (term: string): string => term.replace(/[|\\{}()[\]^$+*?.-]/g, (char: string) => `\\${char}`);

const REGEX_CACHE_LIMIT = 100;
const regexCache = new Map<string, RegExp>();

/**
 * Compiled patterns are cached because the same query usually repeats across
 * many rows (search results, tables). The cache key is built from the RAW
 * terms, so cache hits skip filtering, deduplication, sorting and escaping
 * entirely — all of that work happens only on a miss.
 */
const getRegex = (rawTerms: string[], flags: string): RegExp => {
  const key = `${flags}|${rawTerms.join("\u0000")}`;
  const cached = regexCache.get(key);

  if (cached) {
    return cached;
  }

  // Normalize only on miss: drop empty terms, dedupe, longest-first so
  // overlapping terms pick the longer match, then escape as literal text.
  const terms = [...new Set(rawTerms.filter(Boolean))].sort((left, right) => right.length - left.length);
  const regex = new RegExp(`(?:${terms.map(escapeRegexp).join("|")})`, flags);

  if (regexCache.size >= REGEX_CACHE_LIMIT) {
    const oldestKey = regexCache.keys().next().value;
    if (oldestKey !== undefined) {
      regexCache.delete(oldestKey);
    }
  }
  regexCache.set(key, regex);

  return regex;
};

export const highlight = (props: HighlightProps): HighlightChunk[] => {
  const { text, query, ignoreCase, matchAll } = props;
  const rawTerms = Array.isArray(query) ? query : [query];

  if (!rawTerms.some((term) => term.length > 0)) {
    return [{ text, match: false }];
  }

  const shouldMatchAll = matchAll ?? true;

  // "First match" is ambiguous across multiple queries, so reject it early.
  // This loop only runs when first-only mode is requested; it is skipped
  // entirely on the common all-matches path.
  if (!shouldMatchAll) {
    let nonEmptyTerms = 0;
    for (const term of rawTerms) {
      if (term.length > 0) {
        nonEmptyTerms++;
      }
    }
    if (nonEmptyTerms > 1) {
      throw new Error("matchAll must be true when using multiple queries");
    }
  }

  const flags = `${ignoreCase ? "i" : ""}${shouldMatchAll ? "g" : ""}`;
  const regex = getRegex(rawTerms, flags);
  const chunks: HighlightChunk[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Single pass: build the output chunks directly while scanning, no
  // intermediate span arrays. The cache shares regexes, so always reset
  // lastIndex before scanning.
  regex.lastIndex = 0;
  while ((match = regex.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    if (start > lastIndex) {
      chunks.push({ text: text.slice(lastIndex, start), match: false });
    }
    chunks.push({ text: text.slice(start, end), match: true });
    lastIndex = end;

    if (!shouldMatchAll) {
      break;
    }
  }

  if (lastIndex < text.length) {
    chunks.push({ text: text.slice(lastIndex), match: false });
  }

  return chunks;
};

export const normalizeSpan = (spans: HighlightSpan[], len: number) => {
  const result: HighlightSpan[] = [];
  const textLength = Number.isFinite(len) ? Math.max(0, Math.trunc(len)) : 0;
  const append = (start: number, end: number, match: boolean) => {
    if (end - start > 0) {
      result.push({ start, end, match });
    }
  };

  const sortedSpans = spans
    .filter((span) => Number.isFinite(span.start) && Number.isFinite(span.end))
    .map((span) => ({
      start: Math.max(0, Math.min(textLength, Math.trunc(span.start))),
      end: Math.max(0, Math.min(textLength, Math.trunc(span.end))),
    }))
    .filter((span) => span.start < span.end)
    .sort((left, right) => left.start - right.start || right.end - left.end);

  const mergedSpans: Array<{ start: number; end: number }> = [];
  for (const span of sortedSpans) {
    const previous = mergedSpans[mergedSpans.length - 1];
    if (previous && span.start <= previous.end) {
      previous.end = Math.max(previous.end, span.end);
    } else {
      mergedSpans.push(span);
    }
  }

  let lastIndex = 0;
  for (const span of mergedSpans) {
    append(lastIndex, span.start, false);
    append(span.start, span.end, true);
    lastIndex = span.end;
  }
  append(lastIndex, textLength, false);

  return result;
};

/**-----------------------------------------------------------------------------
 * Highlight Component
 * -----------------------------------------------------------------------------
 * Used to highlight substrings of a text.
 *
 * -----------------------------------------------------------------------------*/
export const Highlight: UixComponent<"mark", Omit<HighlightProps, "text">> = (props) => {
  const { children, query, ignoreCase, matchAll: matchAllProp, className, ...remainingProps } = props;

  const matchAll = typeof matchAllProp === "boolean" ? matchAllProp : Array.isArray(query);

  if (typeof children !== "string") {
    throw new Error("Highlight children must be a string");
  }

  const chunks = highlight({ ignoreCase, matchAll, query, text: children });
  const highlightClassName = cn("badge badge-plain", className);
  let chunkStart = 0;

  return chunks.map((chunk) => {
    const key = `${chunkStart}-${chunk.match ? "m" : "t"}`;
    chunkStart += chunk.text.length;

    if (!chunk.match) {
      return chunk.text;
    }
    return (
      <uix.mark key={key} className={highlightClassName} {...remainingProps}>
        {chunk.text}
      </uix.mark>
    );
  });
};
Highlight.displayName = "Highlight";
