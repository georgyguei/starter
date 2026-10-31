---
title: Anchored Container Queries
description: Use container-type: anchored and @container anchored(fallback: ...) to style anchor-positioned elements differently based on which fallback option is active.
related:
  title: Prerequisites
  description: You need to understand fallback options first.
  links:
    - css-utils/anchor-positioning/fallback
    - css-utils/anchor-positioning/positioning
---

When a fallback option moves an anchor-positioned element to a different position, you often need to update its **styling** too — for example, rotating an arrow that points at the anchor, or changing which corner of a tooltip is rounded. **Anchored container queries** solve this by letting you detect which fallback is active and apply styles accordingly.

## How it works

Anchored container queries combine two features:

| Feature                              | Purpose                                                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `container-type: anchored`           | Applied to the anchor-positioned element to make it an **anchored query container**.           |
| `@container anchored(fallback: ...)` | A container query that matches when a specific fallback option is **active** on the container. |

> **Important**: As with all container queries, styles inside `@container` only affect **descendants** of the container — not the container itself. Use a wrapper element if you need to style the positioned element's own box.

## Basic usage

### Step 1: Set `container-type: anchored`

```css
.tooltip {
  position: absolute;
  position-anchor: --my-anchor;
  position-area: top;
  position-try-fallbacks: flip-block;
  container-type: anchored;
}
```

### Step 2: Write container queries

```css
@container anchored(fallback: flip-block) {
  /* Styles applied to descendants when flip-block is active */
  .tooltip::before {
    content: "▲";
    bottom: 100%;
    top: auto;
  }
}
```

### Full example: Arrow direction

A tooltip positioned above an anchor has a down-arrow (`▼`). When it flips below the anchor, the arrow should point up (`▲`):

```css
.anchor {
  anchor-name: --my-anchor;
}

.infobox {
  position: fixed;
  position-anchor: --my-anchor;
  position-area: top;
  position-try-fallbacks: bottom;
  container-type: anchored;
}

/* Default arrow: pointing down (infobox is above anchor) */
.infobox::before {
  content: "▼";
  position: absolute;
  top: 105%;
}

/* When bottom fallback is active: arrow points up (infobox is below anchor) */
@container anchored(fallback: bottom) {
  .infobox::before {
    content: "▲";
    bottom: 100%;
    top: auto;
  }
}
```

Scroll the anchor near the top of the viewport — the infobox flips below it and the arrow flips direction automatically.

## Multiple fallbacks example

When you have several fallback options, write a query for each one:

```css
.infobox {
  position: absolute;
  position-anchor: --my-anchor;
  position-area: top left;
  position-try-fallbacks:
    flip-block,
    flip-inline,
    flip-block flip-inline;
  container-type: anchored;
}
```

Because `@container` can't style the container itself, apply visual styles to a **wrapper** `<div>` inside the infobox:

```css
/* Default: rounded except bottom-right (pointing to anchor at top-left) */
.infobox div {
  border-radius: 10px 10px 0 10px;
}

@container anchored(fallback: flip-block) {
  .infobox div {
    border-radius: 10px 0 10px 10px; /* Point to anchor at bottom-left */
  }
}

@container anchored(fallback: flip-inline) {
  .infobox div {
    border-radius: 10px 10px 10px 0; /* Point to anchor at top-right */
  }
}

@container anchored(fallback: flip-block flip-inline) {
  .infobox div {
    border-radius: 0 10px 10px 10px; /* Point to anchor at bottom-right */
  }
}
```

## Key takeaways

1. **`container-type: anchored`** goes on the anchor-positioned element itself.
2. **`@container anchored(fallback: <value>)`** matches when that exact fallback is active.
3. Queried styles can only affect **descendants** — use a wrapper `<div>` for box-level styles.
4. When no fallback is active (element is in its default position), no anchored query matches — your default styles apply.
