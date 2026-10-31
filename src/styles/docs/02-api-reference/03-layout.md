---
title: Layout Utilities
description: API reference for sizing and layout shortcut utilities — w-*, h-*, min-w-*, max-w-*, min-h-*, max-h-*.
related:
  title: Related
  description: Theme tokens these utilities depend on.
  links:
    - css-utils/guides/theme-variables
    - css-utils/api-reference/compositions
---

These utilities surface CSS sizing properties as Tailwind classes, pulling values from the `--size-*` theme namespace.

## `w-*`

Sets the `width` property from the `--size-*` theme scale.

### Syntax

```
w-{size-key}
```

### Definition

```css
@utility w-* {
  width: --value(--size-*);
}
```

### Usage

```html
<div class="w-md">...</div>
```

Maps to theme values like `--size-xs`, `--size-sm`, `--size-md`, etc. defined in `src/styles/theme/default.css`.

---

## `min-w-*`

Sets the `min-width` property.

```css
@utility min-w-* {
  min-width: --value(--size-*);
}
```

---

## `max-w-*`

Sets the `max-width` property.

```css
@utility max-w-* {
  max-width: --value(--size-*);
}
```

---

## `h-*`

Sets the `height` property.

```css
@utility h-* {
  height: --value(--size-*);
}
```

---

## `min-h-*`

Sets the `min-height` property.

```css
@utility min-h-* {
  min-height: --value(--size-*);
}
```

---

## `max-h-*`

Sets the `max-height` property.

```css
@utility max-h-* {
  max-height: --value(--size-*);
}
```

---

## Available size values

| Key   | Value |
| ----- | ----- |
| `3xs` | 14rem |
| `2xs` | 16rem |
| `xs`  | 20rem |
| `sm`  | 24rem |
| `md`  | 28rem |
| `lg`  | 32rem |
| `xl`  | 36rem |
| `2xl` | 42rem |
| `3xl` | 48rem |
| `4xl` | 56rem |
| `5xl` | 64rem |
| `6xl` | 72rem |
| `7xl` | 80rem |
| `8xl` | 90rem |

---

## Anchor-size matching

These utilities use `anchor-size()` to match an element's dimensions to its anchor. Works on any anchor-positioned element (popover, tooltip content, dialog, drawer).

### `w-anchor`

Matches the anchor's width.

```css
@utility w-anchor {
  width: anchor-size(width);
}
```

```html
<div popover class="popover popover-bottom w-anchor">...</div>
```

### `min-w-anchor`

```css
@utility min-w-anchor {
  min-width: anchor-size(width);
}
```

### `max-w-anchor`

```css
@utility max-w-anchor {
  max-width: anchor-size(width);
}
```

### `h-anchor`

```css
@utility h-anchor {
  height: anchor-size(height);
}
```

### `min-h-anchor`

```css
@utility min-h-anchor {
  min-height: anchor-size(height);
}
```

### `max-h-anchor`

```css
@utility max-h-anchor {
  max-height: anchor-size(height);
}
```

> **Requires**: The element must have an associated anchor (via `position-anchor`, `[position-anchor]`, or implicit popover association).
