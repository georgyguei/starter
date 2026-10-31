---
title: Animation Utilities
description: API reference for animation shortcut utilities — delay-* and repeat-*.
related:
  title: Related
  description: Complex utilities that build on these basics.
  links:
    - css-utils/api-reference/compositions
    - css-utils/transitions-and-animations
---

These utilities surface CSS animation properties as Tailwind classes, optimized for composing with custom keyframe animations.

## `delay-*`

Sets an `animation-delay` via a custom property `--delay`. Accepts bare integers (treated as `ms`), theme values, or arbitrary values.

### Syntax

```
delay-{value}
delay-{value}/{modifier}
```

### Definition

```css
@utility delay-* {
  --delay: --value(integer) ms;
  --delay: --value(--delay-*, [*]);
}
```

### Usage

```html
<div class="animate-fade-in delay-300">...</div>
```

| Class          | `--delay` output |
| -------------- | ---------------- |
| `delay-100`    | `100ms`          |
| `delay-500`    | `500ms`          |
| `delay-[2000]` | `2000ms`         |

Use `var(--delay)` in your animation shorthand or as `animation-delay: var(--delay)`.

---

## `repeat-*`

Sets `animation-iteration-count`. Supports keyword values and bare integers.

### Syntax

```
repeat-{value}
```

### Definition

```css
@utility repeat-* {
  animation-iteration-count: --value("infinite", "normal", integer);
}
```

### Usage

```html
<div class="animate-spin repeat-infinite">...</div>
<div class="animate-pulse repeat-3">...</div>
```

| Class             | Output                                        |
| ----------------- | --------------------------------------------- |
| `repeat-infinite` | `animation-iteration-count: infinite`         |
| `repeat-normal`   | `animation-iteration-count: normal` (default) |
| `repeat-3`        | `animation-iteration-count: 3`                |

---

## Common patterns

### Staggered animation with `delay-*` + `sibling-index()`

```css
li {
  animation: fade-in 0.3s ease-out forwards;
  animation-delay: calc(var(--delay) * sibling-index());
}
```

```html
<li class="delay-100">First</li>
<li class="delay-100">Second</li>
<li class="delay-100">Third</li>
```

> **Good to know**: These utilities use custom properties (`--delay`) rather than setting CSS properties directly. This lets you compose them flexibly — use `var(--delay)` anywhere in your CSS, not just in `animation-delay`.
