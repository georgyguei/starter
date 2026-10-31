"use client";

import { useState } from "react";

import { Highlight } from "@/components/ui/highlight";

const regressionCases = [
  {
    label: "Longest overlapping term wins",
    text: "caterpillar, then cat",
    query: ["cat", "cater"],
  },
  {
    label: "Query punctuation is literal",
    text: "Use a+b? as ordinary text, not a regular expression.",
    query: "a+b?",
  },
  {
    label: "Empty terms are ignored",
    text: "Empty entries should not match every character.",
    query: ["", "entries", ""],
  },
];

export function HighlightDemo() {
  const [text, setText] = useState("The caterpillar caught a cat. Catapult? cats!");
  const [queryInput, setQueryInput] = useState("cat\ncater");
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [matchAll, setMatchAll] = useState(true);

  const queryTerms = queryInput.split(/\r?\n/).filter((term) => term.length > 0);
  const query = queryTerms.length > 1 ? queryTerms : (queryTerms[0] ?? "");
  const singleTerm = queryTerms.length <= 1;
  const effectiveMatchAll = singleTerm ? matchAll : true;

  return (
    <>
      <section className="mt-8 grid gap-6 border-y border-base-300 py-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Text
          <textarea className="input min-h-32 w-full font-normal" rows={5} value={text} onChange={(event) => setText(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Query terms, one per line
          <textarea
            className="font-mono input min-h-32 w-full font-normal"
            rows={5}
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
          />
        </label>

        <div className="flex flex-wrap gap-x-6 gap-y-3 md:col-span-2">
          <label className="flex items-center gap-2 text-sm">
            <input className="checkbox" type="checkbox" checked={ignoreCase} onChange={(event) => setIgnoreCase(event.target.checked)} />
            Ignore case
          </label>
          <label className="flex items-center gap-2 text-sm" title={singleTerm ? undefined : "First-only requires a single query term"}>
            <input
              className="checkbox"
              type="checkbox"
              checked={effectiveMatchAll}
              disabled={!singleTerm}
              onChange={(event) => setMatchAll(event.target.checked)}
            />
            Highlight every occurrence
            {!singleTerm && <span className="text-xs opacity-60">(single term required for first-only)</span>}
          </label>
        </div>
      </section>

      <section className="mt-6" aria-live="polite">
        <h2 className="text-lg font-semibold">Preview</h2>
        <p className="leading-relaxed mt-3 min-h-16 rounded-md border border-base-300 bg-base-200 p-4">
          <Highlight query={query} ignoreCase={ignoreCase} matchAll={effectiveMatchAll} className="badge-soft badge-primary">
            {text}
          </Highlight>
        </p>
        <p className="mt-2 text-xs opacity-70">
          {queryTerms.length === 0 ? "No query terms" : `${queryTerms.length} query term${queryTerms.length === 1 ? "" : "s"}`} ·{" "}
          {effectiveMatchAll ? "all matches" : "first match only"} · {ignoreCase ? "case-insensitive" : "case-sensitive"}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold">Plain badge style</h2>
        <p className="mt-2">
          <Highlight query="plain" className="badge-primary">
            This plain badge uses intrinsic sizing.
          </Highlight>
        </p>
      </section>

      <section className="mt-10 border-t border-base-300 pt-6">
        <h2 className="text-lg font-semibold">Regression examples</h2>
        <div className="mt-4 grid gap-5">
          {regressionCases.map(({ label, text: sample, query: sampleQuery }) => (
            <div key={label}>
              <h3 className="text-sm font-semibold">{label}</h3>
              <p className="leading-relaxed mt-1">
                <Highlight query={sampleQuery} ignoreCase matchAll>
                  {sample}
                </Highlight>
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
