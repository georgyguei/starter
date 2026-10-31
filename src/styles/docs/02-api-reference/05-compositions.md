---
title: Composition Utilities
description: API reference for complex, multi-property composition utilities — bg-*, color-contrast-*, text-contrast, and scroll-lock.
related:
  title: Dependencies
  description: These utilities depend on theme tokens and other utilities.
  links:
    - css-utils/guides/theme-variables
    - css-utils/api-reference/layout
    - css-utils/api-reference/animation
---

Composition utilities are **not** simple CSS property shortcuts. They combine multiple properties, depend on other utilities, or encapsulate complex logic that isn't obvious from the class name alone. **Read the docs before using them.**

---

## `bg-*`

Sets a custom property `--color-bg` used by other composition utilities (`text-contrast`). Supports both plain colors and alpha-modified colors with the `/` modifier.

### Syntax

```
bg-{color-key}
bg-{color-key}/{opacity}
```

### Definition

```css
/* With alpha modifier: bg-red-500/50 */
@utility bg-* {
  --color-bg: --alpha(--value("current") Color / --modifier(integer) * 1%);
  --color-bg: --alpha(--value(--color-*, [*]) / --modifier(integer) * 1%);
}

/* Without modifier: bg-red-500, bg-current */
@utility bg-* {
  --color-bg: --value("current") Color;
  --color-bg: --value(--color-*, [*]);
}
```

### Usage

| Class           | `--color-bg`                                                    |
| --------------- | --------------------------------------------------------------- |
| `bg-red-500`    | `oklch(0.64 0.208 25.33)`                                       |
| `bg-red-500/50` | `color-mix(in oklab, oklch(0.64 0.208 25.33) 50%, transparent)` |
| `bg-current`    | `currentColor`                                                  |

> **Design note**: Tailwind's built-in `bg-*` utility already handles `background-color`. Defining it again in a custom `@utility bg-*` would create two classes competing for the same property, causing cascade issues. Our `bg-*` only sets the `--color-bg` custom property — leaving `background-color` to Tailwind's default — so both can coexist without conflict.

---

## `color-contrast-*`

Generates an **automatic contrasting color** from any source color using the `oklch(from ...)` relative color syntax. Light backgrounds produce dark tinted text; dark backgrounds produce light tinted text. Always preserves 50% of the source hue and chroma so the result feels related to the original.

### Syntax

```
color-contrast-{color-key}
color-contrast-[{arbitrary-color}]
```

### Definition

```css
@utility color-contrast-* {
  --color-contrast: oklch(
    from --value(--color-*, [*]) calc() /* adaptive lightness formula based on background l */ calc(c * 0.5) /* half the original chroma */ h /
      /* original hue preserved */ 1
  );
}
```

### How it works

| Background lightness | Contrast output                                                               |
| -------------------- | ----------------------------------------------------------------------------- |
| Light (`l > 0.675`)  | Dark text at ~43% of the background's lightness                               |
| Dark (`l ≤ 0.675`)   | Light text, floor at 96% lightness for black backgrounds                      |
| Any                  | 50% of original chroma, 100% of original hue (tinted, never pure white/black) |

### Usage

```html
<div class="bg-primary color-contrast-primary">
  <!-- --color-contrast is a readable contrasting color derived from primary -->
</div>
```

---

## `text-contrast-*`

Combines `color-contrast-*` with `color: var(--color-contrast)` in one utility. This is the **most common usage pattern**.

### Syntax

```
text-contrast-{color-key}
```

### Definition

```css
@utility text-contrast-* {
  @apply color-contrast-[--value(--color-*,[*])];
  color: var(--color-contrast);
}
```

### Usage

```html
<!-- Auto-contrasting text on any background -->
<div class="bg-primary text-contrast-primary">Always readable</div>
<div class="bg-success text-contrast-success">Always readable</div>
```

---

## `text-contrast`

Applies contrast text using the **current** `--color-bg` (set by `bg-*`). No need to repeat the color key.

### Syntax

```
text-contrast
```

### Definition

```css
@utility text-contrast {
  @apply color-contrast-(--color-bg);
  color: var(--color-contrast);
}
```

### Usage

```html
<div class="bg-primary text-contrast">Readable text</div>
<div class="bg-success text-contrast">Readable text</div>
```

> **Good to know**: `--color-bg` inherits from ancestors, so `text-contrast` works on any descendant of a `bg-*` element — you don't need to repeat `bg-*` on the same element.

---

## `scroll-lock`

Locks page scroll and applies a dimmed backdrop when a popover, dialog, or `<details>` element is open. Designed to be applied **on the overlay element itself**.

### Syntax

```
scroll-lock
```

### Definition

This utility uses `@layer components` nesting, `:has()`, and custom properties for a coordinated page-level effect. See the source at `src/styles/utilities/compositions.css` for the full implementation.

### What it does

| When the element is `[open]` / `:popover-open` / `:open` | Effect                                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------------------ |
| `:root`                                                  | Gets a semi-transparent backdrop (`--page-scroll-bg`)                    |
| `:root`                                                  | `overflow: hidden` (page scroll locked)                                  |
| `:root`                                                  | `scrollbar-gutter: stable` (prevents layout shift)                       |
| `:root`                                                  | Smooth `background-color` transition (respects `prefers-reduced-motion`) |

### Usage

```html
<dialog class="scroll-lock">
  <p>Page scroll is locked while I'm open.</p>
</dialog>

<div popover class="scroll-lock">
  <p>Same for popovers.</p>
</div>
```
