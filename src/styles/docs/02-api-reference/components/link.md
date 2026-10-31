---
title: Link
description: The link component — inline links with hover underline, plus link-box and link-overlay for making entire cards clickable while preserving nested interactivity.
related:
  title: Related
  description: Combine with these components.
  links:
    - css-utils/api-reference/components/card
    - css-utils/api-reference/components/btn
---

The `link` component provides an inline link style, plus a `link-box`/`link-overlay` pairing that makes an entire card or container clickable while keeping nested buttons and links independently interactive.

## Quick reference

| Utility        | Purpose                                                           |
| -------------- | ----------------------------------------------------------------- |
| `link`         | Inline link — underline on hover, `underline-offset-3`            |
| `link-box`     | Wrapper — establishes `relative` context, pushes `.link` to `z-2` |
| `link-overlay` | Stretches a `::before` pseudo over the entire `link-box` parent   |

---

## `link` — Inline link

```html
<a href="#" class="link">Learn more</a>
```

| Property         | Value                         |
| ---------------- | ----------------------------- |
| Display          | `inline-flex`                 |
| Cursor           | `pointer`                     |
| Decoration       | `currentColor` at 20% opacity |
| Underline offset | `3px`                         |
| Hover            | `underline`                   |

---

## `link-box` + `link-overlay` — Clickable card

`link-box` wraps the container. `link-overlay` goes on the main `<a>` to make the whole card clickable. Nested links/buttons are promoted to `z-2` so they remain independently clickable.

```html
<div class="link-box">
  <article class="card">
    <img src="thumbnail.jpg" />
    <div class="card-body">
      <h3>Card Title</h3>
      <p>Description text</p>
      <a href="/detail" class="link-overlay">
        <!-- stretches over entire card -->
        <span class="sr-only">View details</span>
      </a>
      <button class="btn relative z-2">Save</button>
      <!-- still clickable -->
    </div>
  </article>
</div>
```

### How it works

```
┌──────────────────────────────────┐
│ link-box (relative)              │
│  ┌────────────────────────────┐  │
│  │ card                       │  │
│  │  ┌──────────────────────┐  │  │
│  │  │ ::before (absolute)  │  │  │  ← link-overlay covers entire card
│  │  │ inset: 0, z-index: 1 │  │  │
│  │  └──────────────────────┘  │  │
│  │  [button z-index: 2]       │  │  ← nested interactive elements
│  │  [other .link z-index: 2]  │  │     sit above the overlay
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

1. `link-box` sets `position: relative` on the wrapper
2. `link-overlay` creates an invisible `::before` that covers the entire wrapper
3. Any `.link` inside `link-box` is raised to `z-2` via the descendant selector
4. Nested buttons/links need `relative z-2` to sit above the overlay

> **Important**: Nested interactive elements (buttons, secondary links) need `relative z-2` to be clickable. Without it, the overlay captures all clicks.
