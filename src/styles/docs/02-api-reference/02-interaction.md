---
title: Interaction Utilities
description: API reference for interaction-related CSS utilities.
---

## `touch-action-*`

Controls the [`touch-action`](https://developer.mozilla.org/docs/Web/CSS/touch-action) CSS property, which sets how the browser handles touch and pen input on an element.

### Syntax

```
touch-action-{value}
```

### Allowed values

| Value          | Description                                               |
| -------------- | --------------------------------------------------------- |
| `auto`         | Browser determines permitted touch behaviors.             |
| `none`         | Disables all browser handling of touch gestures.          |
| `pan-x`        | Enables single-finger horizontal panning.                 |
| `pan-left`     | Enables single-finger panning to the left only.           |
| `pan-right`    | Enables single-finger panning to the right only.          |
| `pan-y`        | Enables single-finger vertical panning.                   |
| `pan-up`       | Enables single-finger panning upward only.                |
| `pan-down`     | Enables single-finger panning downward only.              |
| `pinch-zoom`   | Enables multi-finger pinch-zoom gestures.                 |
| `manipulation` | Enables panning and pinch-zoom, disables double-tap zoom. |

### Definition

```css
@utility touch-action-* {
  touch-action: --value("auto", "none", "pan-x", "pan-left", "pan-right", "pan-y", "pan-up", "pan-down", "pinch-zoom", "manipulation");
}
```

### Usage

```tsx
<div className="touch-action-pan-x">Swipeable carousel</div>
```

### Applied by default

The `html` element already has this utility applied:

```css
html {
  @apply touch-action-manipulation;
}
```
