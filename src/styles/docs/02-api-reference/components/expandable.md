---
title: Expandable
description: The expandable component — a CSS-only animated collapse/expand panel using grid-template-rows animation (0fr ↔ 1fr).
related:
  title: Related
  description: Use with these components.
  links:
    - css-utils/api-reference/components/collapse
    - css-utils/transitions-and-animations/overview
---

The `expandable` component animates height between collapsed (`0fr`) and expanded (`1fr`) using `grid-template-rows`. The expanded state is driven by `aria-expanded="true"` — a single source of truth for both ARIA and visuals.

## Quick reference

| Utility                               | State               | Trigger                  |
| ------------------------------------- | ------------------- | ------------------------ |
| `expandable`                          | Collapsed (default) | —                        |
| `expandable` + `aria-expanded="true"` | Expanded            | `[aria-expanded="true"]` |

---

## How it works

`grid-template-rows` animates between `0fr` and `1fr`, producing smooth height expansion. `content-visibility` is transitioned with `allow-discrete` — it flips from `hidden` to `visible` at ~50% of the transition duration so the content doesn't vanish instantly on collapse.

```css
transition:
  grid-template-rows 200ms ease-out,
  content-visibility 200ms ease-out allow-discrete;
```

> Without `content-visibility` in the transition, collapse would snap content invisible at frame 0 while the grid row is still animating.

---

## `expandable` — Collapsed (default)

```html
<div class="expandable">
  <div>
    <p>This content is hidden and smoothly revealed on expand.</p>
  </div>
</div>
```

The direct child (`> *`) gets `overflow: hidden` and `min-height: 0` automatically.

## Expanded state

Set `aria-expanded="true"` to trigger the open state:

```html
<div class="expandable" aria-expanded="true">
  <div>
    <p>This content is visible and smoothly collapses when set back to false.</p>
  </div>
</div>
```

---

## Usage patterns

### Toggle with JavaScript

```html
<button onclick="const el = this.nextElementSibling?.toggleAttribute('aria-expanded')>
  Toggle
</button>
<div class="expandable">
  <div>Expandable content here</div>
</div>
```

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .expandable {
    transition: none !important;
  }
}
```

This is built into the utility — no extra classes needed.

### Fallback for older browsers

Browsers without `content-visibility` support fall back to `visibility: hidden` / `visibility: visible`.
