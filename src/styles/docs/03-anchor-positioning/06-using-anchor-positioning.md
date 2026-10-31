---
title: Using CSS Anchor Positioning
description: A practical guide tying together association, positioning, sizing, fallbacks, and visibility — everything you need to use CSS anchor positioning in your utilities.
related:
  title: Reference Pages
  description: Dive deeper into each topic.
  links:
    - css-utils/anchor-positioning/association
    - css-utils/anchor-positioning/positioning
    - css-utils/anchor-positioning/sizing
    - css-utils/anchor-positioning/fallback
    - css-utils/anchor-positioning/visibility
    - css-utils/anchor-positioning/container-queries
---

This guide walks through the entire anchor positioning workflow: from associating elements, to positioning and sizing them relative to their anchor, to handling overflow with fallbacks.

## Step 1: Associate an anchor with a positioned element

You need **two elements**: an anchor and a positioned element. Link them with `anchor-name` and `position-anchor`:

```html
<div class="anchor">⚓︎</div>
<div class="infobox">
  <p>This is an information box.</p>
</div>
```

```css
.anchor {
  anchor-name: --my-anchor;
  width: fit-content;
}

.infobox {
  position: fixed;
  position-anchor: --my-anchor;
}
```

At this point the elements are **associated but not yet tethered** — moving the anchor won't move the infobox. You need positioning next.

## Step 2: Position the element relative to the anchor

Three approaches, choose one:

### A) Using `position-area` (simplest)

```css
.infobox {
  position: fixed;
  position-anchor: --my-anchor;
  position-area: top; /* Places infobox above the anchor, spanning full width */
}
```

### B) Using `anchor()` (precise control)

```css
.infobox {
  position: fixed;
  position-anchor: --my-anchor;
  left: anchor(right); /* Left edge at anchor's right edge */
  top: anchor(top); /* Top edges aligned */
  margin-left: 10px; /* Breathing room */
}
```

### C) Using `anchor-center` (centering)

```css
.infobox {
  position: fixed;
  position-anchor: --my-anchor;
  top: calc(anchor(bottom) + 5px); /* Below anchor */
  justify-self: anchor-center; /* Centered horizontally */
}
```

## Step 3: Size elements based on the anchor

Use `anchor-size()` to make the positioned element's dimensions relative to the anchor:

```css
.infobox {
  position: fixed;
  position-anchor: --my-anchor;
  position-area: right;
  width: calc(anchor-size(width) * 5); /* 5× the anchor's width */
}
```

## Step 4: Handle overflow with fallbacks

When the anchor gets close to a viewport edge, the positioned element might overflow. Provide fallback positions:

```css
.infobox {
  position: fixed;
  position-anchor: --my-anchor;
  position-area: top left;

  /* Try these in order until one keeps the element on-screen */
  position-try-fallbacks:
    flip-block,
    flip-inline,
    flip-block flip-inline;
}
```

For more control, define custom fallback positions:

```css
@position-try --custom-bottom {
  top: anchor(bottom);
  bottom: unset;
  margin-top: 10px;
}

.infobox {
  position: fixed;
  position-anchor: --my-anchor;
  bottom: anchor(top);

  position-try-order: most-height;
  position-try-fallbacks: --custom-bottom;
}
```

## Step 5: Scope anchors in repeated components

When multiple components use the same anchor name, scope them to prevent cross-binding:

```html
<section class="scoped">
  <div class="anchor">⚓︎</div>
  <div class="positioned">Info 1</div>
</section>
<section class="scoped">
  <div class="anchor">⚓︎</div>
  <div class="positioned">Info 2</div>
</section>
```

```css
.anchor {
  anchor-name: --my-anchor;
}
.positioned {
  position: absolute;
  position-anchor: --my-anchor;
  position-area: right;
}
.scoped {
  anchor-scope: --my-anchor;
}
```

Without `anchor-scope`, both positioned elements would bind to the **last** anchor on the page. With it, each binds to the anchor in its own section.

## Step 6: Conditionally hide elements

If repositioning isn't appropriate, hide the element instead:

```css
.infobox {
  position: fixed;
  position-anchor: --my-anchor;
  position-area: top span-all;
  position-visibility: anchors-visible; /* Hide when anchor scrolls offscreen */
}
```

## Implicit anchors

Some elements create implicit anchor associations automatically:

- **Popovers**: Using `popovertarget`/`id` or the `commandfor`/`id` attributes
- **Customizable `<select>`**: When using `appearance: base-select`, the picker is implicitly anchored to the `<select>`

To override an implicit association:

```css
::picker(select) {
  position-anchor: none;
}
```

## Key takeaways

1. **Association** comes first — `anchor-name` on the anchor, `position-anchor` on the positioned element
2. **Position** with `position-area` for simplicity, `anchor()` for precision, `anchor-center` for centering
3. **Size** with `anchor-size()` to make dimensions relative to the anchor
4. **Scope** with `anchor-scope` to prevent cross-component binding in repeated patterns
5. **Fallback** with `position-try-fallbacks` before resorting to hiding with `position-visibility`
6. **Style per fallback** with [anchored container queries](/docs/css-utils/anchor-positioning/container-queries) — `container-type: anchored` + `@container anchored(fallback: ...)`
7. The anchor must be a **visible DOM node** — `display: none` or `visibility: hidden` breaks the tether
