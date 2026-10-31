---
title: FAB
description: The FAB (Floating Action Button) component — a fixed bottom-right button with expandable menu items, staggered transitions, and an optional radial flower layout using CSS trigonometry.
related:
  title: Related
  description: Use with these components.
  links:
    - css-utils/api-reference/components/btn
    - css-utils/api-reference/components/tooltip
---

The `fab` component is a fixed-position floating action button that expands on `focus-within` to reveal additional actions. Items have staggered transitions and the `fab-flower` variant fans items out radially using `cos()`/`sin()`.

## Quick reference

| Utility           | Purpose                                                                      |
| ----------------- | ---------------------------------------------------------------------------- |
| `fab`             | Container — fixed bottom-right, `flex-col-reverse`, expand on `focus-within` |
| `fab-close`       | Close button — absolutely positioned at bottom-right, visible when expanded  |
| `fab-main-action` | Main action button — same position as close, visible when collapsed          |
| `fab-flower`      | Radial layout — items fanned out using `cos()`/`sin()`, up to 6 items        |

---

## `fab` — Container

```html
<div class="fab">
  <button class="btn fab-main-action btn-circle btn-primary" tabindex="0">+</button>
  <button class="btn fab-close btn-circle" tabindex="0">✕</button>
  <button class="btn">Action 1</button>
  <button class="btn">Action 2</button>
  <button class="btn">Action 3</button>
</div>
```

### How it works

- **Default state**: only the first `[tabindex]` child is visible. Remaining children are `invisible scale-80 opacity-0`.
- **`focus-within`**: when any child receives focus, children 2+ become visible with staggered delays (0ms, 30ms, 60ms, 90ms, 120ms).
- **First child** rotates 90° and fades out when expanded.
- **`pointer-events-none`** on the container prevents the background from capturing clicks; children use `pointer-events-auto`.

| State     | First child           | Children 2+                     |
| --------- | --------------------- | ------------------------------- |
| Collapsed | Visible, `rotate-0`   | `invisible scale-80 opacity-0`  |
| Expanded  | `rotate-90 opacity-0` | `visible scale-100 opacity-100` |

---

## `fab-main-action` + `fab-close`

Two utilities that swap visibility:

- `fab-main-action` — the main "+" or action button, visible when collapsed
- `fab-close` — the "✕" close button, visible when expanded (via `focus-within`)

```html
<div class="fab">
  <button class="btn fab-main-action btn-circle btn-primary" tabindex="0">
    <svg>...</svg>
    <!-- + icon -->
  </button>
  <button class="btn fab-close btn-circle" tabindex="0">
    <svg>...</svg>
    <!-- ✕ icon -->
  </button>
  <!-- additional actions -->
</div>
```

---

## `fab-flower` — Radial layout

Items fan out in a quarter-circle arc (top to right) using `cos()`/`sin()` trigonometry. Each child computes its own angle via `sibling-index()`.

```html
<div class="fab fab-flower">
  <button class="btn btn-circle btn-primary" tabindex="0">+</button>
  <button class="btn btn-circle">1</button>
  <button class="btn btn-circle">2</button>
  <button class="btn btn-circle">3</button>
  <button class="btn btn-circle">4</button>
</div>
```

| Children | Behavior                                                        |
| -------- | --------------------------------------------------------------- |
| 1–2      | Main button area (`--position: 0rem`)                           |
| 3+       | Fanned out from 180° (top) to 90° (right) via `sibling-index()` |
| 7+       | Hidden                                                          |

### The formula

```css
> :nth-child(n + 3) {
  --position: calc(100% + sibling-count() * 20%);
  --degree: calc(180deg - (sibling-index() - 3) * (90deg / max(1, sibling-count() - 3)));
}
```

- `--position` scales with total children (farther out for more items)
- `--degree` evenly spaces items across the 90° arc
- `transform` uses `cos()`/`sin()` to convert polar to cartesian coordinates
- RTL support via `--flip-degree`
