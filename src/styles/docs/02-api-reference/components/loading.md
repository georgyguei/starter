---
title: Loading
description: The loading component — 14 SVG-masked spinner variants with size modifiers. Uses currentColor for automatic color inheritance.
related:
  title: Related
  description: Use with these components.
  links:
    - css-utils/api-reference/components/btn
    - css-utils/api-reference/components/icon
---

The `loading` component displays an animated spinner using SVG masks. All variants inherit `currentColor`, so they automatically match the text color of their parent — no color class needed.

> **Accessibility**: Wrap in an element with `aria-busy="true"` when loading, and `role="status"` for screen reader announcements.

## Variants

### `loading` (default spinner)

A rotating arc with animated dash. The default variant — no extra class needed beyond `loading`.

```html
<span class="loading"></span>
```

### `loading-spinner`

Identical to the default `loading`. Provided as an explicit alias.

```html
<span class="loading loading-spinner"></span>
```

### `loading-dots`

Three dots bouncing vertically with staggered timing.

```html
<span class="loading loading-dots"></span>
```

### `loading-ring`

Two concentric rings expanding outward with fading opacity.

```html
<span class="loading loading-ring"></span>
```

### `loading-ball`

A bouncing ball with squash-and-stretch deformation.

```html
<span class="loading loading-ball"></span>
```

### `loading-bars`

Three vertical bars animating height and opacity in sequence.

```html
<span class="loading loading-bars"></span>
```

### `loading-infinity`

An infinity-loop path with animated dash offset.

```html
<span class="loading loading-infinity"></span>
```

### `loading-pulse`

A circle pulsing with opacity and radius.

```html
<span class="loading loading-pulse"></span>
```

### `loading-ripple`

Three concentric circles expanding outward in staggered waves.

```html
<span class="loading loading-ripple"></span>
```

### `loading-square`

Four squares rotating around their corners in sequence.

```html
<span class="loading loading-square"></span>
```

### `loading-clock`

A clock face with rotating hour and minute hands.

```html
<span class="loading loading-clock"></span>
```

### `loading-orbit`

Four dots orbiting a center point at different opacities.

```html
<span class="loading loading-orbit"></span>
```

### `loading-gradient`

A shimmering gradient bar — ideal for skeleton loading states.

```html
<span class="loading loading-gradient"></span>
```

### `loading-dots-horizontal`

Three dots fading in sequence horizontally.

```html
<span class="loading loading-dots-horizontal"></span>
```

### `loading-grid`

A 3×3 grid of squares fading in a staggered pattern.

```html
<span class="loading loading-grid"></span>
```

---

## Size variants

| Class        | Size                   |
| ------------ | ---------------------- |
| `loading-xs` | 1rem (16px)            |
| `loading-sm` | 1.25rem (20px)         |
| `loading-md` | 1.5rem (24px, default) |
| `loading-lg` | 1.75rem (28px)         |
| `loading-xl` | 2rem (32px)            |

```html
<span class="loading loading-lg loading-spinner"></span>
```

---

## Usage patterns

### Inside a button

```html
<button class="btn btn-primary" disabled>
  <span class="loading loading-spinner loading-xs"></span>
  Loading...
</button>
```

### Skeleton placeholder

```html
<div class="space-y-2">
  <span class="loading block w-full loading-gradient loading-lg"></span>
  <span class="loading block h-7 w-full loading-gradient"></span>
  <span class="loading block w-3/4 loading-gradient loading-sm"></span>
</div>
```

> **Tip**: `loading-gradient` with `w-full` and `block` creates skeleton loading bars. Override the default square aspect ratio with explicit width classes.

### Inline with text

```html
<p>
  <span class="loading mr-1 inline-block align-middle loading-dots loading-xs"></span>
  Processing...
</p>
```
