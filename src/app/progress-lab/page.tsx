import type { Metadata } from "next";

import { ProgressDemo } from "./progress-demo";

export const metadata: Metadata = {
  title: "Progress Lab",
  description: "Progress utilities — native bars, radial rings and filled pies.",
};

export default function ProgressLabPage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="font-display text-2xl">Progress Lab</h1>
      <p className="mt-2 text-sm opacity-80">
        Native &lt;progress&gt; bars plus pure-CSS radial rings — value, size, thickness, track and fill are all customizable.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Linear — native progress</h2>
        <div className="mt-4 flex flex-col gap-4">
          <progress className="progress" value={25} max={100} aria-label="25%" />
          <progress className="progress progress-primary" value={50} max={100} />
          <progress className="progress progress-secondary" value={75} max={100} />
          <progress className="progress progress-accent" value={100} max={100} />
        </div>
        <p className="mt-2 text-sm opacity-70">Fill color follows progress-*; text-* styles only the aria-label overlay.</p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Track colors, sizes, height</h2>
        <div className="mt-4 flex flex-col gap-4">
          <progress className="progress progress-primary progress-track-primary/20" value={60} max={100} />
          <progress className="progress progress-secondary progress-track-secondary/20" value={60} max={100} />
          <progress className="progress" value={60} max={100} />
          <progress className="progress progress-sm" value={60} max={100} aria-label="progress-sm" />
          <progress className="progress progress-lg" value={60} max={100} aria-label="progress-lg" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Indeterminate</h2>
        <div className="mt-4 flex flex-col gap-4">
          <progress className="progress" aria-label="Loading…" />
          <progress className="progress progress-primary progress-sm" aria-label="Please wait" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Radial rings</h2>
        <div className="mt-4 flex flex-wrap items-center gap-8">
          <progress className="progress-radial progress" value={0} max={100} aria-label="0%" />
          <progress className="progress-radial progress progress-primary" value={25} max={100} aria-label="25%" />
          <progress className="progress-radial progress progress-secondary" value={50} max={100} aria-label="50%" />
          {/* No aria-label → dot instead of text */}
          <progress className="progress-radial progress progress-accent" value={75} max={100} aria-label="75%" />
          <progress className="progress-radial progress progress-success" value={100} max={100} aria-label="100%" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Sizes, thickness, track, duration</h2>
        <div className="mt-4 flex flex-wrap items-center gap-8">
          {/* Tiny rings: leave unlabeled to keep the dot */}
          <progress className="progress-radial progress progress-primary progress-xs" value={66} max={100} aria-label="66%" />
          <progress className="progress-radial progress progress-lg progress-secondary progress-thickness-1.5" value={66} max={100} aria-label="66%" />
          <progress
            className="progress-radial progress progress-accent progress-thickness-1 progress-track-primary/20 progress-xl"
            value={66}
            max={100}
            aria-label="66%"
          />
          <progress className="progress-radial progress progress-info" value={66} max={100} aria-label="66%" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Filled pies</h2>
        <div className="mt-4 flex flex-wrap items-center gap-8">
          <progress className="progress progress-pie progress-primary" value={33} max={100} aria-label="33%" />
          <progress className="progress progress-pie progress-secondary" value={66} max={100} aria-label="66%" />
          <progress className="progress progress-pie progress-accent" value={85} max={100} aria-label="85%" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Busy — aria-busy spinner</h2>
        <div className="mt-4 flex flex-wrap items-center gap-8">
          <progress className="progress-radial progress progress-primary" max={100} />
          <progress className="progress-radial progress progress-secondary progress-sm" max={100} />
          <progress className="progress progress-pie progress-accent progress-lg" max={100} />
        </div>
      </section>

      <ProgressDemo />
    </main>
  );
}
