---
title: Scroll Timeline Utilities
description: One-class scroll-scrubbed animations built on scroll() — scroll-scrub drives an animation from a scroller's scrollbar position across its full scroll range, with optional custom keyframes, scroller, axis and range modifiers.
related:
  title: Related
  description: The raw CSS function and other animation features.
  links:
    - css-utils/transitions-and-animations/scroll-driven
    - css-utils/transitions-and-animations/view-timeline
    - css-utils/transitions-and-animations/starting-style
---

The `scroll-scrub` utilities wrap the CSS [`scroll()`](/docs/css-utils/transitions-and-animations/scroll-driven#scroll-function) function into a single class that **scrubs an animation across a scroller's scrollbar** — the animation's progress is driven directly by how far the scroller has scrolled, no JavaScript.

> **⚠️ Limited availability**: `scroll()` is not yet Baseline — Chrome/Edge 115+, Opera 101+, Safari 26, Firefox Nightly only (Firefox for Android not supported). See [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/scroll#browser_compatibility). In unsupported browsers the content simply renders statically (a `@supports` fallback disables the animation).

## Quick start

```html
<div class="h-96 overflow-y-auto">
  <div class="scroll-scrub">…</div>
</div>
```

The element starts hidden and fades/rises into view as the scroll container is scrolled to the end — the whole scrollable range is the timeline.

## How it works

Unlike `view()`, which tracks an element's visibility inside the scrollport, `scroll()` tracks the **scroller's scrollbar position**: 0% is the scroller at the start, 100% is the scroller at the end. The animation scrubs forward as you scroll down and runs in reverse as you scroll back up.

Two details make this reliable:

- **Progress clamps to `[0, 1]`.** Scroll progress never goes negative or past 100%, unlike `view()` progress — so a plain `from`/`to` keyframe pair is all you need (no "journey" plateau keyframes).
- **`animation-fill-mode: both` is still kept.** If the scroller has no scrollable range on the chosen axis, the timeline is inactive and fill-mode guarantees a defined end state instead of a flash of base styles.

```css
animation-timeline: scroll();
animation-duration: auto; /* the scroll timeline drives the duration */
animation-timing-function: linear;
animation-fill-mode: both;
```

> Firefox (Nightly) additionally requires a non-zero `animation-duration` to apply scroll-timeline animations; `auto` satisfies this.

## Built-in effects

| Class               | Keyframes     | Effect                                                          |
| ------------------- | ------------- | --------------------------------------------------------------- |
| `scroll-scrub`      | `rise-scroll` | `translateY(2rem)` + fade (default)                             |
| `scroll-scrub-fade` | `fade-scroll` | Fade only                                                       |
| `scroll-scrub-zoom` | `zoom-scroll` | `scale(0.85)` + fade                                            |
| `scroll-scrub-blur` | `blur-scroll` | `blur(8px)` + fade                                              |
| `scroll-scrub-grow` | `grow-scroll` | `scaleX(0)` → `scaleX(1)`, origin left — a reading progress bar |

All variants apply the same timeline machinery shown above.

## Custom animation

Keep the timeline machinery, use **your own keyframes** — pass the keyframe name as an arbitrary value:

```html
<div class="scroll-scrub-[my-keyframes]">…</div>
```

```css
@keyframes my-keyframes {
  from {
    opacity: 0;
    transform: rotate(-8deg);
  }
  to {
    opacity: 1;
    transform: rotate(0deg);
  }
}
```

## Timeline modifiers

Modifiers override the timeline — combine them **after** the base class.

### Scroller

```html
<div class="scroll-scrub scroll-scroller-root">…</div>
```

| Class                     | Timeline          | Scroller                              |
| ------------------------- | ----------------- | ------------------------------------- |
| `scroll-scroller-nearest` | `scroll(nearest)` | Nearest scrollable ancestor (default) |
| `scroll-scroller-root`    | `scroll(root)`    | The document root (page scrollbar)    |
| `scroll-scroller-self`    | `scroll(self)`    | The element itself                    |

### Axis

```html
<div class="scroll-scrub scroll-axis-x">…</div>
```

| Class                | Timeline         | Tracks               |
| -------------------- | ---------------- | -------------------- |
| `scroll-axis-block`  | `scroll(block)`  | Block axis (default) |
| `scroll-axis-inline` | `scroll(inline)` | Inline axis          |
| `scroll-axis-x`      | `scroll(x)`      | Horizontal scrollbar |
| `scroll-axis-y`      | `scroll(y)`      | Vertical scrollbar   |

> If the chosen axis has no scrollbar, the timeline is **inactive** — the animation never runs.

> **Note**: scroller and axis modifiers both set `animation-timeline`, so they can't be combined — use one or the other (the scroller/axis not mentioned keeps its default).

### Range

```html
<div class="scroll-scrub scroll-range-[0_20%]">…</div>
```

`animation-range` windows the animation to a slice of the scroll timeline instead of the full range:

| Class                     | Meaning                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| `scroll-range-[0_20%]`    | Animate during the first 20% of the scroll range, stay visible afterwards |
| `scroll-range-[50%_100%]` | Stay hidden for the first half, animate during the second                 |

This is the usual remedy when scrubbing across a long page would leave content invisible for too long.

## Fallbacks

The utility ships two automatic fallbacks:

| Condition                                   | Behavior                                                                                                          |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Browser without `scroll()` (stable Firefox) | `@supports not (animation-timeline: scroll())` disables the animation — content renders statically, fully visible |
| `prefers-reduced-motion: reduce`            | Animation disabled — content fully visible                                                                        |

## Examples

### Reading progress bar

```html
<div class="sticky top-0 h-1 bg-accent scroll-scrub-grow scroll-scroller-root"></div>
```

The bar grows left-to-right as the page scrolls and shrinks when scrolling back up.

### Scrubbed cards

```html
<section class="h-96 overflow-y-auto">
  <div class="scroll-scrub">Card 1</div>
  <div class="scroll-scrub-fade scroll-axis-y">Card 2</div>
  <div class="scroll-scrub-zoom scroll-range-[0_30%]">Card 3</div>
  <div class="scroll-scrub-[my-keyframes]">Card 4</div>
</section>
```

Each card is scrubbed by **the container's scrollbar** — scrolling down animates them progressively; scrolling back up reverses the animations.
