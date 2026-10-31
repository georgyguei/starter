---
title: Scroll-Driven Animations
description: Create animations that progress based on scroll position using scroll() and view() timeline functions with animation-timeline.
related:
  title: Related
  description: Entry/exit and page transition features.
  links:
    - css-utils/transitions-and-animations/starting-style
    - css-utils/transitions-and-animations/view-transitions
---

Scroll-driven animations link a `@keyframes` animation's progress to the user's scroll position — no JavaScript needed. Two functions provide different timeline sources: `scroll()` for the scrollbar position, and `view()` for element visibility within the scrollport.

> **⚠️ Limited availability**: Not yet Baseline. Check browser support before using in production.

## How it works

Instead of using `animation-duration` to control timing, scroll-driven animations use `animation-timeline` with a `scroll()` or `view()` function. The animation progress (0%–100%) maps directly to scroll position.

```
animation-timeline: scroll()   → progress = scrollbar position
animation-timeline: view()     → progress = element visibility in scrollport
```

> **Note**: Firefox requires `animation-duration: 1ms` (or any non-zero value) for the animation to apply, even when using `animation-timeline`.

---

## `scroll()` function

Creates an **anonymous scroll progress timeline** from a scroller's scrollbar. The animation progresses as the user scrolls through the scroller.

### Syntax

```
scroll(<scroller>? <axis>?)
```

| Parameter    | Values                      | Default   | Description                                |
| ------------ | --------------------------- | --------- | ------------------------------------------ |
| `<scroller>` | `nearest`, `root`, `self`   | `nearest` | Which element's scrollbar to use           |
| `<axis>`     | `block`, `inline`, `x`, `y` | `block`   | Which scroll direction drives the timeline |

The scroller and axis can be specified in **any order**.

### Scroller values

| Value     | Description                                                |
| --------- | ---------------------------------------------------------- |
| `nearest` | Nearest ancestor with scrollbars on either axis (default). |
| `root`    | The document's root element.                               |
| `self`    | The element itself.                                        |

### Axis values

| Value    | Description                     |
| -------- | ------------------------------- |
| `block`  | Block-axis scrollbar (default). |
| `inline` | Inline-axis scrollbar.          |
| `x`      | Horizontal scrollbar.           |
| `y`      | Vertical scrollbar.             |

> **Important**: If the indicated axis has **no scrollbar**, the timeline is **inactive** (animation doesn't run).

### Equivalent declarations

All five produce the same result:

```css
animation-timeline: scroll();
animation-timeline: scroll(block);
animation-timeline: scroll(nearest);
animation-timeline: scroll(block nearest);
animation-timeline: scroll(nearest block);
```

### Example: rotate on scroll

```css
#square {
  animation-name: rotateAnimation;
  animation-duration: 1ms; /* Required by Firefox */
  animation-direction: alternate;
  animation-timeline: scroll(block nearest);
}

@keyframes rotateAnimation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

> **Ready-made utilities**: The project ships one-class scroll-scrubbed animations built on `scroll()` — see [Scroll Timeline Utilities](/docs/css-utils/transitions-and-animations/scroll-timeline).

---

## `view()` function

Creates an **anonymous view progress timeline** based on when the subject element enters and leaves the scrollport. The animation runs only while the element is "in view."

### Syntax

```
view(<axis>? <view-timeline-inset>?)
```

| Parameter               | Values                                     | Default | Description                                                               |
| ----------------------- | ------------------------------------------ | ------- | ------------------------------------------------------------------------- |
| `<axis>`                | `block`, `inline`, `x`, `y`                | `block` | Scroll direction for tracking visibility                                  |
| `<view-timeline-inset>` | `auto` or 1–2 `<length-percentage>` values | `auto`  | Inward/outward offsets adjusting when the element is considered "in view" |

The axis and inset can be specified in **any order**.

### Insets

Insets adjust the "in view" boundaries. Without insets, the timeline starts when the element first touches the scrollport edge and ends when it reaches the opposite edge.

```
view(block 50% 10%)
           ↑    ↑
       start  end
       inset  inset
```

| Format                | Meaning                                                                         |
| --------------------- | ------------------------------------------------------------------------------- |
| `auto`                | Default boundary.                                                               |
| `<length-percentage>` | Inward offset (positive) or outward offset (negative) from the scrollport edge. |
| One value             | Applies to **start** inset only.                                                |
| Two values            | First = **start** inset, second = **end** inset.                                |

### Example: reveal on scroll

```css
.subject {
  animation-timeline: view(block 50% 10%);
  animation-name: grow;
  animation-timing-function: linear;
}

@keyframes grow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
```

- Animation **starts** when the element is 10% from the bottom of the scrollport.
- Animation **ends** when the element is 50% from the top of the scrollport.
- Scrolling in reverse runs the animation **backward**.

> **Key insight**: The animation only lasts as long as the element is within the inset-adjusted view. When the element leaves the defined boundary, the animation stops.

> **Ready-made utilities**: The project ships one-class enter/exit animations built on `view()` — see [View Timeline Utilities](/docs/css-utils/transitions-and-animations/view-timeline).
