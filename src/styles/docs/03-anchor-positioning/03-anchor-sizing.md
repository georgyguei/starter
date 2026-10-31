---
title: Anchor Sizing
description: Size elements relative to their anchor's dimensions using the anchor-size() function.
related:
  title: Related
  description: Position and associate elements first.
  links:
    - css-utils/anchor-positioning/association
    - css-utils/anchor-positioning/positioning
---

The `anchor-size()` function returns a `<length>` based on an anchor element's dimensions. Use it in sizing properties (`width`, `height`, `min-*`, `max-*`, `block-size`, `inline-size`) — and also in inset and margin properties for advanced layouts.

## `anchor-size()` function

### Syntax

```
anchor-size(<anchor-name> <anchor-size>, <fallback>)
```

| Argument        | Description                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `<anchor-name>` | The anchor's name (dashed-ident). Omit to use the **default anchor** (from `position-anchor`). |
| `<anchor-size>` | Which dimension: `width`, `height`, `inline`, `block`, `self-inline`, or `self-block`.         |
| `<fallback>`    | A `<length-percentage>` used if the element isn't positioned or the anchor doesn't exist.      |

### Basic sizing

```css
/* Match the anchor's width exactly */
.infobox {
  width: anchor-size(width);
}

/* 5× the anchor's inline size */
.infobox {
  inline-size: calc(anchor-size(self-inline) * 5);
}
```

### In sizing properties

All of these accept `anchor-size()`:

```
width          height
min-width      min-height
max-width      max-height
block-size     inline-size
min-block-size min-inline-size
max-block-size max-inline-size
```

### In inset properties (advanced)

You can use `anchor-size()` for positioning based on anchor **size** (not position). The element is positioned according to normal absolute/fixed rules — it won't follow the anchor as it moves, but its offset adapts to the anchor's dimensions:

```css
/* Position infobox to the right of the anchor, offset by anchor's width */
.infobox {
  left: anchor-size(width);
}

/* With explicit anchor reference and fallback */
.infobox {
  inset-inline-end: anchor-size(--my-anchor height, 100px);
}
```

### In margin properties (advanced)

```css
/* Left margin = ¼ of the anchor's width */
.infobox {
  margin-left: calc(anchor-size(width) / 4);
}

/* Block-start margin with explicit anchor + fallback */
.infobox {
  margin-block-start: anchor-size(--my-anchor self-block, 20px);
}
```

### Full example

```css
.anchor {
  anchor-name: --my-anchor;
  width: 100px;
  height: 100px;
  transition: 1s all;
}

.anchor:hover,
.anchor:focus {
  width: 300px; /* infobox width and position adapt proportionally */
}

.infobox {
  position-anchor: --my-anchor;
  position: absolute;
  height: 100px;
  width: 100px;

  top: anchor(top);
  left: anchor-size(width); /* offset by anchor width */
  margin-left: calc(anchor-size(width) / 4); /* spacing scales with anchor */
}
```
