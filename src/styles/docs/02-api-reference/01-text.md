---
title: Text Utilities
description: API reference for typography-related CSS utilities.
---

## `text-rendering-*`

Controls the [`text-rendering`](https://developer.mozilla.org/docs/Web/CSS/text-rendering) CSS property, which provides hints to the browser about what to optimize when rendering text.

### Syntax

```
text-rendering-{value}
```

### Allowed values

| Value                | Description                                                     |
| -------------------- | --------------------------------------------------------------- |
| `auto`               | Browser makes trade-offs based on content.                      |
| `optimizeSpeed`      | Prioritizes rendering speed over legibility.                    |
| `optimizeLegibility` | Prioritizes legibility over speed (enables kerning, ligatures). |
| `geometricPrecision` | Prioritizes geometric precision over speed.                     |

### Definition

```css
@utility text-rendering-* {
  text-rendering: --value("auto", "optimizeSpeed", "optimizeLegibility", "geometricPrecision");
}
```

### Usage

```tsx
<html className="text-rendering-optimizeLegibility">
```

### Applied by default

The `html` element already has this utility applied:

```css
html {
  @apply text-rendering-optimizeLegibility;
}
```
