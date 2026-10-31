---
title: List
description: The list component — a vertical list of rows with auto-expanding grid columns, dividers, and column wrapping.
related:
  title: Related
  description: Combine with these components.
  links:
    - css-utils/api-reference/components/card
    - css-utils/api-reference/components/menu
---

The `list` component is a vertical stack of rows, each a CSS Grid with one flexible column that expands automatically. Rows are separated by a thin divider, and children can be wrapped to a second row.

## Quick reference

| Utility         | Purpose                                                                             |
| --------------- | ----------------------------------------------------------------------------------- |
| `list`          | Wrapper — `flex flex-col text-sm`                                                   |
| `list-row`      | Grid row — `grid-flow-col` with auto columns, rounded, padded, divider between rows |
| `list-col-grow` | Marker on a child — makes that column `1fr` (`min-width: 0` prevents overflow)      |
| `list-col-wrap` | Pushes the element to row 2                                                         |

---

## `list` — Wrapper

```html
<ul class="list">
  <li class="list-row">...</li>
  <li class="list-row">...</li>
</ul>
```

Sets `flex flex-col` and `text-sm`. Use on `<ul>`, `<ol>`, or any block container.

---

## `list-row` — Grid row

Each row is a `grid-flow-col` grid with `gap-4`, `p-4`, and `rounded-lg`.

### Default grid

By default, the grid has two columns: `minmax(0, auto) 1fr` — first column auto-sizes to content, second column fills remaining space.

```html
<ul class="list">
  <li class="list-row">
    <figure><img src="avatar.jpg" /></figure>
    <div>
      <p>Title</p>
      <p>Subtitle</p>
    </div>
  </li>
</ul>
```

### Dividers

Every `list-row` except the last child gets a `::after` pseudo-element — a thin horizontal rule at the bottom, inset from the sides by `--radius-lg`.

### `list-col-grow` — Flexible column

Adding `list-col-grow` to a child makes **that child** the `1fr` column. The other columns become `minmax(0, auto)`. Supports up to 6 children.

```html
<li class="list-row">
  <figure>...</figure>
  <div class="list-col-grow">
    <!-- this column expands -->
    <p>Long content that should fill space</p>
  </div>
  <button>Action</button>
</li>
```

| `list-col-grow` on child # | Grid tracks                                           |
| -------------------------- | ----------------------------------------------------- |
| 1                          | `1fr`                                                 |
| 2 (default)                | `minmax(0, auto) 1fr`                                 |
| 3                          | `minmax(0, auto) minmax(0, auto) 1fr`                 |
| 4                          | `minmax(0, auto) minmax(0, auto) minmax(0, auto) 1fr` |
| …up to 6                   | …                                                     |

> `list-col-grow` also sets `min-width: 0` to prevent the flexible column from blowing out the grid with long content.

---

## `list-col-wrap` — Row wrapping

Pushes an element to row 2 of the grid. Useful for metadata below the main content.

```html
<li class="list-row">
  <figure>...</figure>
  <div class="list-col-grow">
    <p>Title</p>
  </div>
  <button>Action</button>
  <p class="list-col-wrap text-xs opacity-60">2 hours ago</p>
</li>
```

Without `list-col-wrap`, all children sit on row 1. With it, the element drops to row 2 while others stay on row 1.

---

## Usage patterns

### Simple two-column list (no grow)

Default layout: first column auto, second fills.

```html
<ul class="list">
  <li class="list-row">
    <span>Label</span>
    <span>Value that fills remaining space</span>
  </li>
</ul>
```

### Media list (image + content + actions)

```html
<ul class="list rounded-lg border border-base-300 bg-base-100">
  <li class="list-row">
    <figure>
      <img class="size-10 rounded-lg" src="avatar.jpg" />
    </figure>
    <div class="list-col-grow">
      <p>Song Title</p>
      <p class="text-xs uppercase opacity-60">Artist Name</p>
    </div>
    <button class="btn btn-square btn-ghost">♡</button>
    <button class="btn btn-square btn-ghost">▶</button>
    <p class="list-col-wrap text-xs opacity-60">3:45</p>
  </li>
</ul>
```
