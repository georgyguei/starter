---
title: Collapse
description: The collapse component — expandable content panels with grid-template-rows animation, three trigger modes, arrow/plus indicators, and native <details> support.
related:
  title: Related
  description: Combine with these components.
  links:
    - css-utils/api-reference/components/join
    - css-utils/api-reference/components/card
    - css-utils/api-reference/components/input
---

The `collapse` component creates expandable content sections using CSS Grid animation (`grid-template-rows: 0fr → 1fr`). Supports three trigger modes: native `<details>`, hidden radio/checkbox inputs, and `tabindex` focus.

## Structure

Every collapse needs a **title** (clickable trigger) and **content** (expandable body):

```html
<div class="collapse-arrow collapse">
  <div class="collapse-title">Click me</div>
  <div class="collapse-content">Hidden content</div>
</div>
```

---

## Trigger modes

### Radio inputs (accordion)

Only one item open at a time. All radios share the same `name`. Use `class="collapse-trigger"` on the input:

```html
<div class="join join-vertical w-full join-rounded-md">
  <div class="collapse-arrow collapse border join-item border-base-300 bg-base-100">
    <label class="collapse-title font-display">
      <input type="radio" name="faq" class="collapse-trigger" checked />
      How do I create an account?
    </label>
    <div class="collapse-content text-sm">Click the "Sign Up" button in the top right corner and follow the registration process.</div>
  </div>
  <div class="collapse-arrow collapse border join-item border-base-300 bg-base-100">
    <label class="collapse-title font-display">
      <input type="radio" name="faq" class="collapse-trigger" />
      I forgot my password. What should I do?
    </label>
    <div class="collapse-content text-sm">Click on "Forgot Password" on the login page and follow the instructions sent to your email.</div>
  </div>
</div>
```

> **Accordion behavior**: Radio inputs with the same `name` naturally enforce single-selection. Combine with `join` for seamless borders between items.

### Details / summary (HTML-native)

Uses native `<details>` and `<summary>` elements. The `name` attribute on `<details>` enforces single-open accordion behavior:

```html
<!-- Single-open (name attribute) -->
<div class="join join-vertical w-full join-rounded-md">
  <details name="faq" class="collapse-arrow collapse border join-item border-base-300 bg-base-100" open>
    <summary class="collapse-title font-display">How do I create an account?</summary>
    <div class="collapse-content text-sm">Click the "Sign Up" button...</div>
  </details>
  <details name="faq" class="collapse-arrow collapse border join-item border-base-300 bg-base-100">
    <summary class="collapse-title font-display">I forgot my password.</summary>
    <div class="collapse-content text-sm">Click on "Forgot Password"...</div>
  </details>
</div>

<!-- Multi-open (no name attribute) -->
<div class="join join-vertical w-full join-rounded-md">
  <details class="collapse-arrow collapse border join-item border-base-300 bg-base-100">
    <summary class="collapse-title font-display">Section A</summary>
    <div class="collapse-content text-sm">Content A</div>
  </details>
  <details class="collapse-arrow collapse border join-item border-base-300 bg-base-100">
    <summary class="collapse-title font-display">Section B</summary>
    <div class="collapse-content text-sm">Content B</div>
  </details>
</div>
```

> **Good to know**: The `<details name="...">` attribute (for accordion behavior) and `::details-content` pseudo-element are used for smooth height animation with `interpolate-size: allow-keywords`.

### Checkbox (show more / show less)

A binary toggle — useful for "Show more" patterns:

```html
<div class="collapse rounded-md border border-base-300 bg-base-100">
  <div class="collapse-title">
    <span class="font-display">Show more</span>
    <label class="btn absolute top-1/2 right-2 -translate-y-1/2 btn-link btn-xs">
      <input type="checkbox" class="collapse-trigger" />
      <svg class="icon">...</svg>
    </label>
  </div>
  <div class="collapse-content text-sm">
    <p>Additional content that was hidden.</p>
  </div>
</div>
```

---

## Indicator variants

### `collapse-arrow`

A CSS-only chevron that rotates when expanded. Uses `:after` with a `box-shadow` trick — no SVG needed:

```html
<div class="collapse-arrow collapse">
  <div class="collapse-title">...</div>
  <div class="collapse-content">...</div>
</div>
```

### `collapse-plus`

A `+` / `−` text indicator instead of an arrow:

```html
<div class="collapse-plus collapse">
  <div class="collapse-title">...</div>
  <div class="collapse-content">...</div>
</div>
```

---

## `collapse-title`

The clickable header. When wrapping a hidden input, the label covers the entire title area. Supports embedding other components (buttons, icons) inside:

```html
<div class="collapse-title">
  <span>Section Title</span>
  <button class="btn btn-ghost btn-xs">Action</button>
</div>
```

---

## `collapse-content`

The expandable body. Uses `content-visibility: hidden` for performance and `grid-template-rows: 0fr → 1fr` for smooth animation:

```html
<div class="collapse-content text-sm">
  <p>Any content here — text, images, links, nested components.</p>
</div>
```

> **Performance**: `content-visibility: hidden` defers rendering of the content until it's visible, improving page load performance for accordions with many items.
