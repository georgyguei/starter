---
title: Divider
description: The divider component — a horizontal or vertical rule with optional centered text, used to separate content sections.
related:
  title: Related
  description: Use in layouts with these components.
  links:
    - css-utils/api-reference/components/menu
    - css-utils/api-reference/components/card
---

The `divider` component renders a rule line with optional centered text. It uses `::before` and `::after` pseudo-elements as the lines, with the element's text content between them.

## Quick reference

| Utility              | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `divider`            | Base — horizontal lines with centered text |
| `divider-*`          | Color setter (e.g. `divider-primary`)      |
| `divider-horizontal` | Vertical lines (left/right of text)        |
| `divider-start`      | Hides `::before` — line on right only      |
| `divider-end`        | Hides `::after` — line on left only        |

---

## `divider` — Base

```html
<div class="divider">OR</div>
```

Renders as:

```
────────── OR ──────────
```

| Property | Default                                                           |
| -------- | ----------------------------------------------------------------- |
| Display  | `flex` row                                                        |
| Lines    | `0.5px` height, full width, `--divider-color`                     |
| Color    | `color-mix(in oklab, var(--color-base-content) 10%, transparent)` |
| Margin   | `1rem 0`                                                          |

Without text, it's a plain rule:

```html
<div class="divider"></div>
```

---

## `divider-*` — Color setter

Sets `--divider-color` from any theme color.

```html
<div class="divider divider-primary">Primary</div>
<div class="divider divider-error">Error</div>
```

---

## Orientation

### Default (horizontal)

The base `divider` renders horizontal lines above and below text. Margin: `1rem 0`.

```html
<div class="divider">Section</div>
```

Use `gap` to control spacing between text and lines:

```html
<div class="divider gap-2">More space</div>
<div class="divider gap-0">Tight</div>
```

### `divider-horizontal`

Vertical lines to the left and right of text. Margin: `0 1rem`. The container stretches to full height.

```html
<div class="flex h-40">
  <div class="divider divider-horizontal">OR</div>
  <div>Content</div>
</div>
```

---

## One-sided lines

### `divider-start`

Hides the `::before` pseudo — only the right-side line remains.

```html
<div class="divider divider-start">Text ──────────</div>
```

### `divider-end`

Hides the `::after` pseudo — only the left-side line remains.

```html
<div class="divider divider-end">────────── Text</div>
```
