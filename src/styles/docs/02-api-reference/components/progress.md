---
title: Progress
description: Progress indicators — a native <progress> bar with automatic stripes and label overlay, plus pure-CSS radial rings and filled pies with a fully customizable value, size, thickness, track and fill.
related:
  title: Related
  description: Use with these components.
  links:
    - css-utils/api-reference/components/loading
    - css-utils/api-reference/components/stat
---

The `progress` system covers both shapes of progress indication:

- `progress` — a styled native `<progress>` element. Keeps full accessibility (role, value, max) for free.
- `progress-radial` / `progress-radial-filled` — pure-CSS conic-gradient indicators. The value is driven by the `--value` custom property (0–100).

> **⚠️ Availability**: everything except the animated value transition works everywhere. Smooth value animation uses `@property` (`--radialprogress`) — Chrome 85+, Safari 16.4+, Firefox 128+. Older browsers snap instantly instead.

## `progress` — Linear bar

Styles the native element. The fill follows `--progress-color` (set with `progress-color-*`), while `text-*` styles only the label overlay:

```html
<progress class="progress w-full" value="70" max="100"></progress> <progress class="progress-color-primary progress w-full" value="40" max="100"></progress>
```

| Property    | Default                                              |
| ----------- | ---------------------------------------------------- |
| Height      | `var(--size)` — `8px`                                |
| Fill color  | `var(--progress-color)` — `base-content`             |
| Track color | `var(--track-color)` — 8% tint of `--progress-color` |
| Radius      | `rounded-md`                                         |
| Appearance  | `none` (WebKit + Firefox pseudo-elements styled)     |
| Transition  | `var(--progress-duration)` — `0.3s` (animated fill)  |

### Label overlay

Adding `aria-label` draws the text centered inside the bar. The label inherits the `color` property — use `text-*` for it (white + the built-in `mix-blend-mode: difference` stays readable across fill and track):

```html
<progress class="progress w-full" value="70" max="100" aria-label="Uploading 70%"></progress>
```

The font size auto-scales with the bar height — the same formula as the radial labels (`clamp(0.5rem, size × 0.25, 1.25rem)`). Use `progress-size-*`, a size modifier, or any `h-*` utility for a taller, labeled bar.

### Indeterminate

A `<progress>` without a `value` attribute automatically shows moving stripes:

```html
<progress class="progress w-full" aria-label="Loading…"></progress>
```

Stripes follow `--progress-color` and pause under `prefers-reduced-motion: reduce` (Firefox included).

## `progress-radial` — Ring with dot

> **⚠️ Availability**: the ring is drawn with `::before`/`::after` on the native `<progress>` element — Chrome-verified. Pseudo-element support on `<progress>` has historically varied across Firefox/Safari, so spot-check those browsers before relying on the radial shapes there.

```html
<progress class="progress-radial" value="65" max="100" aria-label="65%"></progress>
```

| Property    | Default                                              |
| ----------- | ---------------------------------------------------- |
| Value       | `--value` — `attr(value number, 0)` (0–100, clamped) |
| Diameter    | `var(--size)` — `5rem`                               |
| Thickness   | `var(--thickness)` — `size / 10`                     |
| Arc color   | `var(--progress-color)` — `base-content`             |
| Track color | `var(--track-color)` — 8% tint of `--progress-color` |
| Transition  | `var(--progress-duration)` — `0.3s`                  |

The dot sits on the arc end and rotates with the value. Add `aria-label` to show centered text instead of the dot — the same overlay mechanism as the linear bar. The text is clamped inside the ring hole, so keep labels short. Unlabeled rings always keep the dot.

## `progress-radial-filled` — Pie

Same API as the ring, minus the dot and the hole — a full disc filled up to the value:

```html
<progress class="progress-color-primary progress-fill-primary progress-radial-filled" value="40" max="100" aria-label="40%"></progress>
```

| Property    | Default                                              |
| ----------- | ---------------------------------------------------- |
| Fill color  | `var(--fill-color)` — `--progress-color`             |
| Track color | `var(--track-color)` — 8% tint of `--progress-color` |

The label comes from `aria-label` and renders via `::after`, always above the pie. It inherits the `color` property — use `text-*` (e.g. `text-white`) for contrast on the fill.

### Busy state

`aria-busy="true"` swaps the ring/pie for the `loading` spinner at the same size:

```html
<div class="progress-color-primary progress-radial" aria-busy="true"></div>
<div class="progress-color-secondary progress-radial-filled" aria-busy="true"></div>
```

## Modifiers

### Sizes

| Utility           | `--size`      | Notes                                       |
| ----------------- | ------------- | ------------------------------------------- |
| `progress-xs`     | `1.5rem`      |                                             |
| `progress-sm`     | `2rem`        |                                             |
| `progress-md`     | `2.5rem`      |                                             |
| `progress-lg`     | `3rem`        |                                             |
| `progress-xl`     | `4rem`        |                                             |
| `progress-size-*` | `spacing × n` | `progress-size-16`, `progress-size-[10rem]` |

Sizes set `--size`, which is the **height** of a linear bar and the **diameter** of a radial indicator. Label text scales with the size (`clamp(0.5rem, size × 0.25, 1.25rem)`), so both the fixed modifiers and `progress-size-*` keep labels proportional.

### Thickness, duration

| Utility                | Sets                  | Example                                            |
| ---------------------- | --------------------- | -------------------------------------------------- |
| `progress-thickness-*` | `--thickness`         | `progress-thickness-2`, `progress-thickness-[6px]` |
| `progress-duration-*`  | `--progress-duration` | `progress-duration-1000`, `progress-duration-[2s]` |

`progress-duration-*` animates the radial arc, the pie, the dot, and the linear fill width (`::before` overlay — the native fill can't be transitioned, so the bar draws its own animated fill).

The value comes from the native `value` attribute via a typed `attr()` (Chrome 133+, Safari 18.2+, Firefox 128+) — update the attribute and the ring follows. For values that change at runtime without the attribute, set the property directly: `style="--value: 65"`.

### Colors

| Utility            | Sets               | Example                                                                         |
| ------------------ | ------------------ | ------------------------------------------------------------------------------- |
| `progress-color-*` | `--progress-color` | `progress-color-primary`, `progress-color-primary/50` (fill + track tint)       |
| `progress-track-*` | `--track-color`    | `progress-track-primary`, `progress-track-primary/20`, `progress-track-current` |
| `progress-fill-*`  | `--fill-color`     | `progress-fill-secondary` (radial-filled only)                                  |

`progress-color-*` sets the fill and derives the track from it; `progress-track-*` overrides the track and `progress-fill-*` overrides the pie fill. The alpha modifier (`/20`) works on all three. The `color` property (`text-*`) affects only the label.

## Reduced motion

- Indeterminate stripes and busy spinners keep animating (they convey state), except the stripes, which freeze under `prefers-reduced-motion: reduce`.
- Value transitions (`--radialprogress`, dot `transform`) are disabled under `prefers-reduced-motion: reduce`.

## Testing

Run `pnpm dev` and open `/progress-lab` — deterministic bars, rings and pies across sizes/colors, plus interactive sliders for the value, busy and indeterminate states.
