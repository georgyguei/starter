---
title: Breadcrumbs
description: The breadcrumbs component — a navigation trail with auto-generated separators via ::before, four separator variants, and overflow scrolling.
related:
  title: Related
  description: Combine with these components.
  links:
    - css-utils/api-reference/components/btn
    - css-utils/api-reference/components/icon
---

The `breadcrumbs` component renders a horizontal navigation trail with separators automatically inserted between items using `li + *:before` and the `--breadcrumbs-separator` custom property. No extra markup for separators — they're pure CSS.

## `breadcrumbs` — Base

```html
<div class="breadcrumbs">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li>Category</li>
  </ul>
</div>
```

The default separator is a chevron (`❯`) inserted via `content-(--breadcrumbs-separator)`. Items auto-wrap, and the container scrolls horizontally on overflow.

---

## Separator variants

| Utility               | Separator                       |
| --------------------- | ------------------------------- |
| (default)             | `❯` chevron                     |
| `breadcrumbs-chevron` | `❯` chevron (explicit)          |
| `breadcrumbs-slash`   | `/` slash                       |
| `breadcrumbs-dot`     | `•` dot (slightly larger scale) |
| `breadcrumbs-pipe`    | `\|` pipe                       |

```html
<div class="breadcrumbs breadcrumbs-slash">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li>Category</li>
  </ul>
</div>
```

---

## Usage patterns

### With links

Each item can be a link or plain text for the current page:

```html
<div class="breadcrumbs">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/docs">Docs</a></li>
    <li><a href="/docs/components">Components</a></li>
    <li>Breadcrumbs</li>
  </ol>
</div>
```

### With icons

Links support icons alongside text:

```html
<div class="breadcrumbs">
  <ul>
    <li>
      <a href="/">
        <svg class="icon">...</svg>
        Home
      </a>
    </li>
    <li>Page</li>
  </ul>
</div>
```

### Overflow handling

When breadcrumbs exceed the container width, they scroll horizontally:

```html
<div class="breadcrumbs max-w-xs">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/a">Section</a></li>
    <li><a href="/a/b">Subsection</a></li>
    <li><a href="/a/b/c">Deep</a></li>
    <li><a href="/a/b/c/d">Deeper</a></li>
    <li>Current</li>
  </ul>
</div>
```

> **Tip**: Limit the container width with `max-w-*` to enable horizontal scrolling when the trail is long, keeping the layout stable.
