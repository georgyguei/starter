---
title: Sibling Functions
description: Use sibling-count() and sibling-index() to compute values based on an element's position among its siblings — ideal for dynamic layouts, staggered animations, and quantity-based styling.
related:
  title: Related
  description: Combine with animation features for staggered effects.
  links:
    - css-utils/transitions-and-animations/scroll-driven
    - css-utils/transitions-and-animations/starting-style
---

The `sibling-count()` and `sibling-index()` CSS functions return **integers** based on an element's position in the DOM relative to its siblings. Unlike `counter()`, which returns a `<string>` for generated content, these return `<integer>` values that can be used in `calc()` — making them ideal for dynamic sizing, staggered animations, and quantity-based styling.

> **✅ Baseline 2026**: Chrome/Edge 138+, Firefox 154+, Opera 122+, Safari 26.2+. Older browsers may lack support — the ready-made utilities below ship a graceful fallback.

## Quick comparison

| Function          | Returns                                   | Starts at     | Use case                                        |
| ----------------- | ----------------------------------------- | ------------- | ----------------------------------------------- |
| `sibling-count()` | Total number of siblings (including self) | N/A           | Divide width equally, style based on item count |
| `sibling-index()` | Position among siblings                   | **1** (not 0) | Staggered delays, progressive sizing            |
| `counter()`       | Formatted `<string>`                      | Configurable  | `content` property only                         |

---

## `sibling-count()`

Returns the total number of direct child elements of the parent, **including** the element itself.

### Syntax

```css
sibling-count()
```

No parameters. Returns an `<integer>`.

### Example: Dynamic column width

Divide each list item's width equally based on the number of items — no matter how many `<li>` elements exist:

```css
li {
  width: calc(100% / sibling-count());
}
```

With 5 items: each gets `100% / 5 = 20%` width.  
With 3 items: each gets `100% / 3 = 33.3%` width.

```html
<ul>
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
  <li>Four</li>
  <li>Five</li>
</ul>
```

---

## `sibling-index()`

Returns the **1-based** position of the element among its siblings (first child = 1, second child = 2, etc.).

### Syntax

```css
sibling-index()
```

No parameters. Returns an `<integer>`.

> **Important**: `sibling-index()` is **1-based**, like `:nth-child()`. The first child returns `1`, not `0`.

### Example: Progressive width

Each item gets wider the further down it appears:

```css
li {
  width: calc(sibling-index() * 50px);
}
```

| Child | `sibling-index()` | Width |
| ----- | ----------------- | ----- |
| 1st   | 1                 | 50px  |
| 2nd   | 2                 | 100px |
| 3rd   | 3                 | 150px |
| 4th   | 4                 | 200px |

### Example: Staggered animations

This is the most powerful use case. Use `sibling-index()` inside `animation-delay` to create cascading entrance effects — each element starts its animation slightly after the previous one:

```css
li {
  animation-name: fade-in;
  animation-duration: 1s;
  animation-iteration-count: 1;
  animation-timing-function: linear;
  animation-fill-mode: backwards;
  animation-delay: calc(1s * sibling-index());
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

**Result**: Elements fade in one after another — the 1st child starts immediately, the 2nd after 1s, the 3rd after 2s, etc.

`animation-fill-mode: backwards` ensures each element stays at `opacity: 0` (the `from` keyframe) until its delay expires.

### Stagger formula patterns

| Effect                      | Formula                                            |
| --------------------------- | -------------------------------------------------- |
| Linear stagger (0.2s apart) | `calc(0.2s * sibling-index())`                     |
| Accelerating stagger        | `calc(0.1s * sibling-index() * sibling-index())`   |
| Reverse order (last first)  | `calc(0.2s * (sibling-count() - sibling-index()))` |
| Skip first element          | `calc(0.2s * (sibling-index() - 1))`               |

---

## Combining both functions

Use `sibling-count()` and `sibling-index()` together for position-aware and quantity-aware logic:

```css
/* Width based on position relative to total */
li {
  width: calc(100% * sibling-index() / sibling-count());
}

/* Reverse stagger: last element animates first */
li {
  animation-delay: calc(0.1s * (sibling-count() - sibling-index()));
}
```

---

## Ready-made utilities

Sibling functions are **values**, so they extend the core utility namespaces instead of living in parallel utilities — `w-step-50`, `w-even`, `opacity-step-10`… Only helpers that encode sibling semantics keep the `si-` prefix (`styles/utilities/sibling-functions.css`).

### Sibling values in core utilities

| Class                   | Effect                                                                        |
| ----------------------- | ----------------------------------------------------------------------------- |
| `w-step-50`             | `width: 50 spacing steps × sibling-index()` — progressive widths              |
| `w-step-[20px]`         | Arbitrary per-step length                                                     |
| `min-w-step-20`         | Progressive minimum widths                                                    |
| `w-even`                | `width: 100% / sibling-count()` — equal columns for any item count            |
| `w-step-2`              | `width: 200% / sibling-count()` — span N of the count-based grid              |
| `ml-step-10`            | `margin-left: 10 spacing steps × (sibling-index() − 1)` on each child         |
| `pl-step-8`             | Progressive `padding-left` indentation                                        |
| `text-step-2`           | `font-size: 1rem + 2px × sibling-index()`                                     |
| `opacity-step-10`       | Each sibling 10% more transparent                                             |
| `z-step` / `z-step-rev` | z-index by position (`sibling-index()` / `sibling-count() − sibling-index()`) |

```html
<ul class="flex">
  <li class="w-even">One</li>
  <li class="w-even">Two</li>
  <li class="w-even">Three</li>
  <li class="w-even">Four</li>
  <li class="w-even">Five</li>
</ul>
```

Five items → each `20%` wide. Remove one item → each `25%` wide. No media queries needed.

### Sibling-only utilities

The few utilities that can't be expressed as core values — sibling semantics themselves:

| Class                | Effect                                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| `delay-stagger-100`  | `animation-delay: 100ms × sibling-index()` — cascading entrance (no core animation-delay utility exists) |
| `si-even` / `si-odd` | Set `--si-parity: mod(sibling-index(), 2)` on even/odd children                                          |

`si-even` / `si-odd` only **plant the flag** — they style nothing by themselves. Consume the value with `var(--si-parity)` in your own CSS: odd positions resolve to `1`, even positions to `0`, non-flagged elements fall back to whatever default you pass to `var()`.

```html
<li class="si-even si-odd">…</li>
<li class="si-even si-odd">…</li>
<li class="si-even si-odd">…</li>
```

```css
/* odd rows get 16px indent, even rows none */
li {
  margin-left: calc(var(--si-parity, 0) * 16px);
}
```

Because custom properties inherit, the flag also reaches descendants and pseudo-elements (`li::before { … var(--si-parity) … }`).

Use `delay-stagger-*` with any animation class:

```html
<ul>
  <li class="animate-fade-in delay-stagger-100">…</li>
  <li class="animate-fade-in delay-stagger-100">…</li>
  <li class="animate-fade-in delay-stagger-100">…</li>
</ul>
```

The delay is `100ms × sibling-index()`, so the first item starts at 100ms, the second at 200ms, etc. `animation-fill-mode: backwards` holds each item at its `from` state until its delay expires.

### Fallbacks

| Condition                                    | Behavior                                                                                                               |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Browser without `sibling-index()` (pre-2026) | `calc()` becomes invalid and the declaration is dropped — values degrade to their initial/fallback state automatically |
| `prefers-reduced-motion: reduce`             | Staggered delays drop to `0s` — animations play immediately                                                            |
