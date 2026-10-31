---
title: Anchor Positioning
description: Position elements relative to their anchor using position-area, the anchor() function, and anchor-center alignment.
related:
  title: Prerequisites
  description: Make sure your elements are associated first.
  links:
    - css-utils/anchor-positioning/association
    - css-utils/anchor-positioning/sizing
    - css-utils/anchor-positioning/fallback
---

Once an anchor and a positioned element are [associated](/docs/css-utils/anchor-positioning/association), you can place the positioned element relative to the anchor. There are three approaches: `position-area` (grid-based), `anchor()` (inset-based), and `anchor-center` (alignment-based).

## `position-area`

Places the positioned element on a **3×3 implicit grid** where the anchor is the center cell. This is the simplest way to position relative to an anchor.

> **Baseline 2026**. Formerly named `inset-area` in Chromium (both names are supported for backwards compatibility).

### The position-area grid

```
┌──────────┬──────────┬──────────┐
│ top left │ top      │ top right│
│ start    │ center   │ end      │
├──────────┼──────────┼──────────┤
│ left     │  ANCHOR  │ right    │
│ center   │ (center) │ center   │
├──────────┼──────────┼──────────┤
│ bottom   │ bottom   │ bottom   │
│ left     │ center   │ right    │
└──────────┴──────────┴──────────┘
```

The dimensions of the center tile match the anchor's containing block. The outer edge dimensions match the positioned element's containing block.

### Syntax

```css
/* Default */
position-area: none;

/* Single tile (two values: row + column) */
position-area: top left;
position-area: bottom center;
position-area: start end;

/* Span two tiles */
position-area: top span-left;
position-area: center span-start;

/* Span three tiles (entire row/column) */
position-area: top span-all;
position-area: block-end span-all;

/* One value (second is implied) */
position-area: top; /* equiv: top span-all */
position-area: center; /* equiv: center center */
position-area: end; /* equiv: end end */
```

### Value axes

You can use physical, logical, or coordinate keywords (but **don't mix physical with logical** in the same declaration):

| Axis    | Physical                  | Logical                                | Coordinate                   | Span                                                                |
| ------- | ------------------------- | -------------------------------------- | ---------------------------- | ------------------------------------------------------------------- |
| Rows    | `top`, `center`, `bottom` | `block-start`, `center`, `block-end`   | `y-start`, `center`, `y-end` | `span-top`, `span-bottom`, `span-y-start`, `span-y-end`, `span-all` |
| Columns | `left`, `center`, `right` | `inline-start`, `center`, `inline-end` | `x-start`, `center`, `x-end` | `span-left`, `span-right`, `span-x-start`, `span-x-end`, `span-all` |

### Usage

```css
.infobox {
  position: fixed;
  position-anchor: --my-anchor;
  position-area: top span-all;
  margin-bottom: 5px;
}
```

### Auto-sizing behavior

When using `position-area` without explicit sizing:

| Placement                                              | Width behavior                           |
| ------------------------------------------------------ | ---------------------------------------- |
| Single cell (top-center, bottom-center, center-center) | Same width as the anchor                 |
| Any other single cell or spanning multiple cells       | `max-content` (stretches to fit content) |

> **Good to know**: When using `position-area` to position popovers, reset default `margin` and `inset` to avoid conflicts:
>
> ```css
> .my-popover {
>   margin: 0;
>   inset: auto;
> }
> ```

---

## `anchor()` function

Returns a `<length>` based on an anchor's side position. Used inside **inset properties** (`top`, `left`, `inset-block-start`, etc.) for precise control.

### Syntax

```
anchor(<anchor-name> <anchor-side>, <fallback>)
```

| Argument        | Description                                                                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<anchor-name>` | The anchor's name (dashed-ident). Omit to use the **default anchor** (from `position-anchor`).                                                                 |
| `<anchor-side>` | Which side of the anchor to measure from: `top`, `left`, `right`, `bottom`, `start`, `end`, `self-start`, `self-end`, `center`, or a `<percentage>` (0%–100%). |
| `<fallback>`    | A `<length-percentage>` used if the anchor doesn't exist or the side is incompatible with the inset property.                                                  |

> **Important**: Specifying an `<anchor-name>` in `anchor()` positions relative to that anchor but does **not** create an association. The positioned element remains associated only via `position-anchor`.

### Usage

```css
/* Left edge flush with anchor's right edge */
.infobox {
  left: anchor(right);
  margin-left: 10px;
}

/* Using calc() for spacing */
.infobox {
  inset-block-end: calc(anchor(start) + 10px);
}

/* Explicit anchor reference + fallback */
.infobox {
  top: anchor(--my-anchor bottom, 50px);
}
```

### Incompatible sides

If the `<anchor-side>` is incompatible with the inset property (e.g., `left: anchor(top)`), the **fallback** is used. Without a fallback, the declaration is equivalent to a plain length value:

```css
/* These are equivalent when anchor-side is incompatible */
bottom: anchor(right, 50px);
bottom: 50px;
```

---

## `anchor-center`

A special alignment value that centers a positioned element on its anchor. Used with `justify-self`, `align-self`, `justify-items`, or `align-items`.

### Usage

```css
.infobox {
  position: fixed;
  position-anchor: --my-anchor;
  top: calc(anchor(bottom) + 5px);
  justify-self: anchor-center;
}
```

This centers the infobox horizontally on the anchor, 5px below its bottom edge.

> **Good to know**: `anchor-center` works alongside inset properties (not `position-area`). Use it when you need precise control over one axis while centering on the other.
