---
title: Carousel
description: The carousel component — pure-CSS paginated scroller with browser-generated scroll buttons (::scroll-button) and scroll markers (::scroll-marker) plus :target-current states. No JavaScript.
related:
  title: Related
  description: Use with these components.
  links:
    - css-utils/api-reference/components/btn
    - css-utils/api-reference/components/list
---

The `carousel` system paginates overflowing content with scroll snapping, and adds the modern CSS carousel features — browser-generated scroll buttons and scroll markers — so a fully working carousel needs **zero JavaScript**.

> **⚠️ Availability**: `::scroll-button()`, `::scroll-marker`, `scroll-marker-group`, `:target-current`, and `::column` are Chrome 135+. Other browsers simply render a scrollable list without buttons/markers — content stays fully usable.

## `carousel` — Scroll container

Turns any element into a horizontal snap-scrolling strip:

```html
<ul class="carousel w-full carousel-center">
  <li class="carousel-item w-64"><img … /></li>
  <li class="carousel-item w-64">…</li>
</ul>
```

| Property           | Default                                            |
| ------------------ | -------------------------------------------------- |
| `scroll-snap-type` | `var(--carousel-scroll-snap-type)` — `x mandatory` |
| `scroll-behavior`  | `smooth` (`auto` under `prefers-reduced-motion`)   |
| Scrollbar          | Hidden                                             |

### Variants

| Utility               | Direction     |
| --------------------- | ------------- |
| `carousel-horizontal` | `x` (default) |
| `carousel-vertical`   | `y`           |

### Snap alignment modifiers

| Utility           | `.carousel-item` snap |
| ----------------- | --------------------- |
| `carousel-start`  | `start` (default)     |
| `carousel-center` | `center`              |
| `carousel-end`    | `end`                 |

## CSS carousel features

### `carousel-page`

Full-width page item for single-page carousels (`flex: 0 0 100%`). Combine with `carousel-center`:

```html
<ul class="carousel-buttons carousel-markers carousel carousel-center">
  <li class="carousel-item carousel-page" data-accName="Page 1">…</li>
  <li class="carousel-item carousel-page" data-accName="Page 2">…</li>
</ul>
```

### `carousel-buttons`

Generates previous/next buttons inside the carousel via `::scroll-button(left/right)`, anchor-positioned to its sides. The buttons are **automatically `:disabled`** at the start/end of the scroll range.

```html
<ul class="carousel-buttons carousel carousel-center">
  …
</ul>
```

Accessible names come from the `content` alt text (`"◄" / "Previous"`, `"►" / "Next"`).

### `carousel-markers`

Generates a scroll marker for **each child** via `& > *::scroll-marker`, collected in a `::scroll-marker-group` anchored to the bottom of the carousel. Each marker's accessible name is read from the child's `data-accName` attribute:

```html
<ul class="carousel-markers carousel carousel-center">
  <li class="carousel-item carousel-page" data-accName="Page 1">…</li>
</ul>
```

`:target-current` highlights the active marker. The marker group behaves as a **tablist**: `Tab` into it, then arrow keys move between pages.

### `carousel-columns` — responsive multi-item pages

A **modifier of the base `carousel` utility**: switches from flex to CSS multi-column pages whose snap targets are the generated `::column` fragments. One or more `carousel-column-item`s fit per column depending on the viewport width — the page count adapts automatically.

```html
<ul class="carousel-column-markers carousel carousel-columns">
  <li class="carousel-column-item">Item 1</li>
  <li class="carousel-column-item">Item 2</li>
  …
</ul>
```

> **Static CSS note**: the `::column` rules are served from `/static/styles/carousel-columns.css` (linked in the layout) — Lightning CSS doesn't recognize the `::column` pseudo-element yet, same workaround as `tooltip-anchored.css`. Without it there is no snapping.

### `carousel-column-markers`

One marker per generated column (`::column::scroll-marker`), with `:target-before` / `:target-current` / `:target-after` styling for already-seen, current, and upcoming pages.

> **⚠️ WCAG**: `::column`-based markers use `content: ""` — there is no element to draw an accessible name from in this pattern, which creates a SC 4.1.2 Name, Role, Value violation. Prefer `carousel-markers` (with `data-accName`) where possible.

## Custom variants for the generated pieces

A JS plugin (`carousel.plugin.js`, loaded via `@plugin`) exposes the pseudo-elements as variants, so the generated buttons/markers can be styled with **any** Tailwind utility from the carousel's own class list:

| Variant                                                          | Selector                                                            |
| ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| `carousel-scroll-button:`                                        | `&::scroll-button(*)`                                               |
| `carousel-scroll-button-left:` / `carousel-scroll-button-right:` | `&::scroll-button(left/right)` — values captured via `matchVariant` |
| `carousel-scroll-marker-group:`                                  | `&::scroll-marker-group`                                            |
| `carousel-scroll-marker:`                                        | `& > *::scroll-marker`                                              |
| `carousel-scroll-marker-current:`                                | `& > *::scroll-marker:target-current`                               |

```html
<ul
  class="carousel-buttons carousel-scroll-button:shadow-md carousel-scroll-button-right:btn-primary
           carousel-scroll-marker-group:gap-8
           carousel-markers
           carousel
           carousel-scroll-marker-current:scale-125"
></ul>
```

This works because the variant class sits on the live carousel element — the browser matches the compound selector against it and applies the utility inside the generated pseudo context.
