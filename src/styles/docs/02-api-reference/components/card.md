---
title: Card
description: The card component system — a content container with title, body, overlay, actions, and size variants.
related:
  title: Related Components
  description: Combine with other components.
  links:
    - css-utils/api-reference/components/btn
    - css-utils/guides/theme-variables
---

The `card` system provides a structured content container with slots for a title, body, overlay, and actions. Sizes cascade via custom properties set on child elements.

## Structure

```
<div class="card">
  <figure>...</figure>           ← optional media
  <div class="card-body">
    <h2 class="card-title">...</h2>
    <p>...</p>
    <div class="card-action">
      <button class="btn btn-primary">...</button>
    </div>
  </div>
  <div class="card-overlay">...</div>  ← optional overlay
</div>
```

---

## `card` — Base container

```css
@utility card {
  @layer components.l1.l2.l3 {
    @apply relative flex w-fit flex-col overflow-hidden rounded-md;

    figure {
      @apply flex items-center justify-center;
    }
  }
}
```

A flex column container with `w-fit` (sizes to content), rounded corners, and hidden overflow.

```html
<div class="card">...</div>
```

---

## `card-body`

The content area. Sets default padding and font size via custom properties, and allows `<p>` children to grow and fill space.

### Defaults

| Property       | Default    |
| -------------- | ---------- |
| `--card-p`     | `1.5rem`   |
| `--card-fs`    | `0.875rem` |
| `--tw-leading` | `1.25rem`  |

```html
<div class="card">
  <div class="card-body">
    <p>Card content goes here.</p>
  </div>
</div>
```

---

## `card-title`

Bold heading with its own font size custom property.

| Property         | Default    |
| ---------------- | ---------- |
| `--cardtitle-fs` | `1.125rem` |
| `--tw-leading`   | `1.75rem`  |

```html
<h2 class="card-title">Card Title</h2>
```

---

## `card-overlay`

An absolutely-positioned overlay that covers the entire card. Two common patterns:

**Content over image** — add `card-overlay` directly to `card-body` to place the body content on top of a card image. The image needs explicit dimensions (`w-96`, etc.) so the overlay knows what area to cover:

```html
<div class="card w-96 bg-base-100 shadow-sm">
  <figure>
    <img src="image.jpg" alt="" />
  </figure>
  <div class="card-overlay card-body">
    <h2 class="card-title">Title over image</h2>
    <p>Body content sits on top of the image.</p>
    <div class="card-action">
      <button class="btn btn-primary">Action</button>
    </div>
  </div>
</div>
```

**Backdrop overlay** — as a separate sibling for hover effects or loading states:

```html
<div class="card">
  <figure><img src="..." /></figure>
  <div class="card-overlay bg-black/0 transition-colors hover:bg-black/50"></div>
</div>
```

---

## `card-action`

A flex container for action buttons, with spacing and a larger default icon size.

```html
<div class="card-action">
  <button class="btn btn-sm btn-primary">Save</button>
  <button class="btn btn-ghost btn-sm">Cancel</button>
</div>
```

---

## Size variants

Each size variant sets `--card-p`, `--card-fs`, `--tw-leading` on `.card-body` and `--cardtitle-fs`, `--tw-leading` on `.card-title` within its scope. Apply to the `card` element and children inherit.

| Utility   | Body padding     | Body font | Title font |
| --------- | ---------------- | --------- | ---------- |
| `card-xs` | 0.5rem           | 0.6875rem | 0.875rem   |
| `card-sm` | 1rem             | 0.75rem   | 1rem       |
| `card-md` | 1.5rem (default) | 0.875rem  | 1.125rem   |
| `card-lg` | 2rem             | 1rem      | 1.25rem    |

```html
<div class="card card-sm">
  <div class="card-body">
    <h2 class="card-title">Compact Card</h2>
    <p>Smaller padding and text.</p>
  </div>
</div>
```

> **How sizes work**: Size variants use `.card-body` and `.card-title` descendant selectors, so they must be applied on the `card` element — not on `card-body` or `card-title` directly.

---

## Full example

```html
<div class="card card-md">
  <figure>
    <img src="image.jpg" alt="" />
  </figure>

  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p>Description text that grows to fill available space.</p>

    <div class="card-action">
      <button class="btn btn-sm btn-primary">Action</button>
    </div>
  </div>
</div>
```
