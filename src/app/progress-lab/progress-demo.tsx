"use client";

import { useState } from "react";

export function ProgressDemo() {
  const [value, setValue] = useState(35);
  const [busy, setBusy] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold">Interactive</h2>

      <label className="mt-4 flex items-center gap-3 text-sm">
        Value
        <input className="w-64 accent-primary" type="range" min={0} max={100} value={value} onChange={(event) => setValue(Number(event.target.value))} />
        <span className="w-10 text-end tabular-nums">{value}%</span>
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-sm" onClick={() => setValue((v) => Math.max(0, v - 10))}>
          −10
        </button>
        <button type="button" className="btn btn-sm" onClick={() => setValue((v) => Math.min(100, v + 10))}>
          +10
        </button>
        <button type="button" className="btn btn-sm" onClick={() => setBusy((b) => !b)}>
          {busy ? "Stop busy" : "Set busy"}
        </button>
        <button type="button" className="btn btn-sm" onClick={() => setIndeterminate((i) => !i)}>
          {indeterminate ? "Determinate" : "Indeterminate"}
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <progress
          className="progress-duration-1000 progress w-full text-white"
          value={indeterminate ? undefined : value}
          max={100}
          aria-label={indeterminate ? "Loading…" : `${value}%`}
        />

        <div className="flex flex-wrap items-center gap-8">
          <progress className="progress-radial progress" value={value} max={100} aria-label={`${value}%`} aria-busy={busy} />
          <progress className="progress progress-pie" value={value} max={100} aria-label={`${value}%`} />
        </div>
      </div>
    </section>
  );
}
