---
title: Fallback Options
description: Handle overflow by specifying alternative positions with position-try, position-try-fallbacks, position-try-order, and @position-try.
related:
  title: Prerequisites
  description: Understand positioning and association first.
  links:
    - css-utils/anchor-positioning/association
    - css-utils/anchor-positioning/positioning
---

When an anchor-positioned element would overflow its containing block or the viewport, you can provide **fallback positions** — alternative placements the browser tries until it finds one that keeps the element on-screen.

## `position-try-fallbacks`

Specifies a comma-separated list of fallback options. The browser tries them **in order** and applies the first one that prevents overflow.

### Syntax

```css
/* Default: no fallbacks */
position-try-fallbacks: none;

/* Predefined try-tactic values */
position-try-fallbacks: flip-block;
position-try-fallbacks: flip-inline;
position-try-fallbacks: flip-start;

/* position-area values */
position-try-fallbacks: top;
position-try-fallbacks: top, right, bottom, left;

/* Custom @position-try options */
position-try-fallbacks: --custom-option;

/* Combinations (space-separated within one option, comma-separated between options) */
position-try-fallbacks:
  flip-block,
  flip-inline,
  flip-block flip-inline;

/* Mixed */
position-try-fallbacks: flip-block, --custom-option, right;
```

### Predefined `<try-tactic>` values

| Value         | Behavior                                                                                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flip-block`  | Mirrors the element's position across the **inline axis** through the anchor's center. An element 10px above its anchor that overflows at the top will flip to 10px **below** its anchor. |
| `flip-inline` | Mirrors the element's position across the **block axis** through the anchor's center. An element 10px to the left of its anchor that overflows will flip to 10px to the **right**.        |
| `flip-start`  | Mirrors diagonally through the anchor's center. Swaps start↔start and end↔end properties.                                                                                                 |

> **Important**: Try-tactics preserve the **distance** from the anchor — they mirror the position, not move to a different edge.

### Combining multiple values into one option

A single space-separated fallback option can combine multiple `<try-tactic>` values or a `<try-tactic>` with a custom `@position-try` name. The browser composes their effects into a single combined fallback:

```css
/* Individual options tried first, then combined */
position-try-fallbacks:
  flip-block,
  flip-inline,
  flip-block flip-inline;
```

**Why combine?** Without a combined option, the browser tries `flip-block` (fails), then `flip-inline` (fails), and since no single option works, it **reverts to the original position** — which overflows. The combined `flip-block flip-inline` handles both axes simultaneously:

```
Default (top-left) → overflows top       → flip-block → bottom-left    ✅
Default (top-left) → overflows left      → flip-inline → top-right     ✅
Default (top-left) → overflows top+left  → flip-block flip-inline → bottom-right ✅
```

### Using `position-area` as fallback

`position-area` values can be used directly in the `position-try-fallbacks` list as a shortcut for a custom `@position-try` containing only a `position-area` descriptor. This is more verbose than try-tactics but gives **granular control** over every possible position:

```css
.infobox {
  position: fixed;
  position-anchor: --my-anchor;
  position-area: top left;

  position-try-fallbacks:
    top,
    top right,
    right,
    bottom right,
    bottom,
    bottom left,
    left;
}
```

> **Note**: `position-area` fallback values **cannot** be combined in a space-separated option (unlike try-tactics).

---

## `position-try-order`

Determines **which** fallback gets tried first when the element is **initially displayed** (not during scroll). It selects the option that gives the element's containing block the most space in a given dimension.

### Syntax

```css
position-try-order: normal; /* Default: use initial position */
position-try-order: most-height; /* Choose option with most height */
position-try-order: most-width; /* Choose option with most width */
position-try-order: most-block-size; /* Choose option with most block size */
position-try-order: most-inline-size; /* Choose option with most inline size */
```

### Usage

```css
.infobox {
  position: fixed;
  position-anchor: --my-anchor;
  bottom: anchor(top);
  margin-bottom: 10px;

  position-try-order: most-height;
  position-try-fallbacks: --custom-bottom;
}
```

If more vertical space exists **below** the anchor than above it, `most-height` will apply `--custom-bottom` immediately, placing the element below.

---

## `position-try` (shorthand)

Combines `position-try-order` and `position-try-fallbacks` in one declaration:

```css
/* <position-try-order>? <position-try-fallbacks> */
position-try: normal flip-block;
position-try: most-height --custom-option;
position-try:
  most-width flip-block,
  right,
  --custom-option;
```

If the order is omitted, it defaults to `normal`.

---

## `@position-try` at-rule

Defines a **custom** fallback position that can be referenced by name in `position-try-fallbacks`.

### Syntax

```css
@position-try --try-fallback-name {
  descriptor-list
}
```

The `--try-fallback-name` is a developer-defined `<dashed-ident>`. If multiple `@position-try` rules share the same name, the **last one in document order** wins. Avoid reusing anchor names or custom property names — it won't break anything, but it will make your CSS hard to follow.

### Allowed descriptors

Only these properties can be used inside `@position-try`:

| Category             | Properties                                                       |
| -------------------- | ---------------------------------------------------------------- |
| **Position area**    | `position-area`                                                  |
| **Inset**            | `top`, `left`, `right`, `bottom`, `inset-*` logical properties   |
| **Margin**           | `margin`, `margin-left`, `margin-block-start`, etc.              |
| **Self-alignment**   | `align-self`, `justify-self`, `place-self`                       |
| **Sizing**           | `width`, `height`, `block-size`, `inline-size`, `min-*`, `max-*` |
| **Anchor reference** | `position-anchor`                                                |

### Full example: multiple custom options

```css
/* Define four custom fallback positions */
@position-try --custom-left {
  position-area: left;
  width: 100px;
  margin-right: 10px;
}

@position-try --custom-bottom {
  position-area: bottom;
  margin-top: 10px;
}

@position-try --custom-right {
  position-area: right;
  width: 100px;
  margin-left: 10px;
}

@position-try --custom-bottom-right {
  position-area: bottom right;
  margin: 10px 0 0 10px;
}

/* Use them in order */
.infobox {
  position: fixed;
  position-anchor: --my-anchor;
  position-area: top; /* default position */
  width: 200px;
  margin-bottom: 10px;
  position-try-fallbacks: --custom-left, --custom-bottom, --custom-right, --custom-bottom-right;
}
```

### How overrides work

When a fallback option is applied:

- Its descriptor values **override** the corresponding properties set on the positioned element.
- Properties **not** listed in the descriptor keep their original values (e.g., `--custom-bottom` above doesn't set `width`, so the element keeps its default `200px`).
- When scrolling causes a **different** fallback (or none) to be applied, the previous fallback's values are **unset** and the new fallback's (or the defaults) take over.

> **Good to know**: If no fallback option can place the element fully on-screen, the browser reverts to the element's **original position** before any fallbacks were tried.
