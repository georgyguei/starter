import type { Metadata } from "next";

import { HighlightDemo } from "./highlight-demo";

export const metadata: Metadata = {
  title: "Highlight Lab",
  description: "Test substring highlighting, query lists, and match behavior.",
};

export default function HighlightLabPage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="font-display text-2xl">Highlight Lab</h1>
      <p className="mt-2 text-sm opacity-80">Exercise literal queries, overlap priority, first/all matching, and case-insensitive matching.</p>
      <HighlightDemo />
    </main>
  );
}
