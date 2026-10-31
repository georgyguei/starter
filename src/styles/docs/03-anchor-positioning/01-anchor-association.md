---
title: Anchor Association
description: How to define anchor elements with anchor-name, associate positioned elements with position-anchor, and limit scope with anchor-scope.
related:
  title: Next Steps
  description: Once associated, position your element relative to the anchor.
  links:
    - css-utils/anchor-positioning/positioning
    - css-utils/anchor-positioning/sizing
---

Before you can position an element relative to an anchor, you must **associate** them. This is done with three properties: `anchor-name` (on the anchor), `position-anchor` (on the positioned element), and optionally `anchor-scope` (on a container).

## `anchor-name`

Defines an element as an **anchor** by giving it one or more identifying names. Each name is a `<dashed-ident>` (must start with `--`).

### Syntax

```css
/* Single anchor name */
anchor-name: none;
anchor-name: --my-anchor;

/* Multiple anchor names (comma-separated) */
anchor-name: --name1, --name2;

/* Global values */
anchor-name: inherit;
anchor-name: initial;
anchor-name: revert;
anchor-name: unset;
```

### Values

| Value             | Description                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `none`            | Default. Element is not an anchor. Also disassociates any previously-linked positioned elements. |
| `<dashed-ident>#` | One or more comma-separated custom identifiers (must start with `--`).                           |

### Usage

```css
.anchor {
  anchor-name: --my-anchor;
  width: fit-content;
}
```

> **Good to know**: `anchor-name` is supported on **all elements that generate a principal box**, including pseudo-elements (`::before`, `::after`) and range slider thumbs (`::-webkit-slider-thumb`).

---

## `position-anchor`

Associates a positioned element with an anchor by referencing the anchor's `anchor-name` value.

### Syntax

```css
position-anchor: normal;
position-anchor: auto;
position-anchor: none;
position-anchor: --anchor-name;
position-anchor: match-parent;

/* Global values */
position-anchor: inherit;
position-anchor: initial;
position-anchor: revert;
position-anchor: unset;
```

### Values

| Value            | Description                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `normal`         | If `position-area` is `none`, behaves as `none`; otherwise behaves as `auto`.               |
| `auto`           | Associates with the element's **implicit** anchor (e.g., from the HTML `anchor` attribute). |
| `none`           | No association. Cancels a previously-made association.                                      |
| `<dashed-ident>` | The anchor name to associate with (matches an `anchor-name` value).                         |
| `match-parent`   | Uses the same default anchor as the parent element.                                         |

### Usage

```css
.anchor {
  anchor-name: --my-anchor;
}

.infobox {
  position: fixed;
  position-anchor: --my-anchor;
}
```

> **Important**: This property only applies to elements with `position: absolute` or `position: fixed`.

### Multiple anchors with the same name

If multiple elements share the same `anchor-name`, the positioned element associates with the **last one in source order**.

### Canceling an association

Set `position-anchor: none` on the positioned element, or change the anchor's `anchor-name` to a different value.

---

## `anchor-scope`

Limits which positioned elements can bind to an anchor name — restricting the "scope" to a specific subtree.

### Syntax

```css
anchor-scope: none;
anchor-scope: all;
anchor-scope: --anchor-name;
anchor-scope: --name1, --name2;

/* Global values */
anchor-scope: inherit;
anchor-scope: initial;
anchor-scope: revert;
anchor-scope: unset;
```

### Values

| Value             | Description                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| `none`            | Default. No scope limiting.                                                                                   |
| `all`             | **All** `anchor-name` values in the subtree can only be bound by positioned elements in the **same** subtree. |
| `<dashed-ident>#` | Only the **specified** anchor names in the subtree can be bound by positioned elements in the same subtree.   |

### Why use it?

Without scoping, if multiple components each have an anchor named `--my-anchor`, **all** positioned elements will bind to the **last** anchor on the page — not the one in their own component.

```css
/* Without scoping: all infoboxes bind to the last .anchor on the page */
.anchor {
  anchor-name: --my-anchor;
}
.infobox {
  position-anchor: --my-anchor;
}

/* With scoping: each infobox only sees the anchor in its own section */
section {
  anchor-scope: --my-anchor;
}
```

### `all` vs named scoping

| Value                 | Behavior                                                                             |
| --------------------- | ------------------------------------------------------------------------------------ |
| `anchor-scope: all`   | Scopes **every** anchor name in the subtree.                                         |
| `anchor-scope: --foo` | Scopes **only** the `--foo` anchor name. Other names (e.g., `--bar`) are unaffected. |

> **Note**: Anchor scopes only affect **explicit** associations (made via `position-anchor`). Implicit associations (e.g., popover-invoker relationships) are not affected.
