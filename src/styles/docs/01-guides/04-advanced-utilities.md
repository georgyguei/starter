---
title: Advanced Utilities
description: Deep dive into functional utilities — theme values, bare values, arbitrary values, modifiers, fractions, negative values, and defaults.
related:
  title: Prerequisites
  description: Make sure you understand the basics first.
  links:
    - css-utils/guides/core-concepts
    - css-utils/guides/getting-started
    - css-utils/guides/creating-utilities
---

Once you're comfortable with [simple utilities](/docs/css-utils/guides/getting-started), you can build **functional utilities** — utilities that accept a value, like `tab-4` or `opacity-50`. This guide covers every value-matching strategy available with the `--value()` function.

## Simple utilities

A simple utility maps a class name to a single CSS declaration:

```css
@utility content-auto {
  content-visibility: auto;
}
```

```html
<div class="content-auto">
  <!-- ... -->
</div>
```

It works with all standard variants like `hover:`, `focus:`, and `lg:`:

```html
<div class="hover:content-auto">
  <!-- ... -->
</div>
```

Custom utilities are automatically inserted into the `utilities` layer alongside all built-in framework utilities.

## Complex utilities (nesting)

If your utility needs more than a single declaration, use nesting:

```css
@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
}
```

## Functional utilities

Functional utilities accept an argument via the `-*` suffix and use the special `--value()` function to resolve it:

```css
@utility tab-* {
  tab-size: --value(--tab-size-*);
}
```

### How `--value()` works

The `--value()` function resolves to **plain text** at build time — as if you typed the value directly into a CSS file. This has important implications:

**✅ You can concatenate as a prefix:**

```css
@utility text-* {
  color: --value("current") Color;
}
/* text-current → color: currentColor */
```

Numeric values work the same way, so they can be used in calculations:

```css
@utility opacity-* {
  opacity: calc(--value(integer) * 1%);
}
/* opacity-50 → opacity: calc(50 * 1%) → 50% */
```

**❌ You cannot use `--value()` as a suffix:**

```css
@utility bg-* {
  background: current--value("Color");
}
/* bg-anything → background: current--value("Color") */
/* The expression is NOT evaluated — it stays as literal plain text */
```

> **Important**: `--value()` only works when it appears at the **start** of a value. Placing it mid-value or as a suffix means the function is **not evaluated** and the expression remains as raw text in the compiled CSS. The same rule applies to `--modifier()`.

**❗ Unresolvable values drop the entire declaration:**

If `--value()` can't resolve (no matching theme key, or an invalid bare type), the **entire CSS property** that uses it is silently dropped from the output. No error, no fallback — the declaration simply vanishes. The same applies to `--modifier()`:

```css
@utility tab-* {
  tab-size: --value(integer); /* tab-4 ✅ → tab-size: 4 */
  tab-size: --value("literal"); /* tab-4 ❌ → entire declaration dropped */
}
/* Using tab-4: only the first declaration survives */

@utility animate-* {
  animation-name: --value(--animate-*);
}
/* animate-bounce ✅ if --animate-bounce exists in theme */
/* animate-fake  ❌ no matching theme key → entire declaration dropped */
```

### Matching theme values

Use `--value(--theme-key-*)` to resolve the value against a set of theme keys:

```css
@theme {
  --tab-size-2: 2;
  --tab-size-4: 4;
  --tab-size-github: 8;
}

@utility tab-* {
  tab-size: --value(--tab-size-*);
}
```

This matches `tab-2`, `tab-4`, and `tab-github`.

### Bare values

Use `--value({type})` to resolve the value as a bare value of a specific data type:

```css
@utility tab-* {
  tab-size: --value(integer);
}
```

This matches `tab-1`, `tab-76`, etc.

| Available bare value types |                       |
| -------------------------- | --------------------- |
| `number`                   | Any numeric value     |
| `integer`                  | Whole numbers only    |
| `ratio`                    | Fraction like `3/4`   |
| `percentage`               | Percentage like `50%` |

### Literal values

Use `--value('literal')` (with quotes) to support specific keyword values:

```css
@utility tab-* {
  tab-size: --value("inherit", "initial", "unset");
}
```

This matches `tab-inherit`, `tab-initial`, and `tab-unset`.

### Arbitrary values

Use `--value([{type}])` (with square brackets) to support arbitrary values:

```css
@utility tab-* {
  tab-size: --value([integer]);
}
```

This matches `tab-[1]` and `tab-[76]`.

| Available arbitrary value types |               |
| ------------------------------- | ------------- |
| `absolute-size`                 | `angle`       | `bg-size`       |
| `color`                         | `family-name` | `generic-name`  |
| `image`                         | `integer`     | `length`        |
| `line-width`                    | `number`      | `percentage`    |
| `position`                      | `ratio`       | `relative-size` |
| `url`                           | `vector`      | `*` (any)       |

## Combining value strategies

### Multiple declarations (different handling per case)

All three forms of `--value()` can be used as multiple declarations. Any that fail to resolve are simply omitted from the output:

```css
@theme {
  --tab-size-github: 8;
}

@utility tab-* {
  tab-size: --value([integer]); /* arbitrary: tab-[4] */
  tab-size: --value(integer); /* bare:      tab-4     */
  tab-size: --value(--tab-size-*); /* theme:     tab-github */
}
```

This makes it possible to treat the value differently in each case — for example, translating a bare integer to a percentage:

```css
@utility opacity-* {
  opacity: --value([percentage]); /* arbitrary */
  opacity: calc(--value(integer) * 1%); /* bare → % */
  opacity: --value(--opacity-*); /* theme     */
}
```

### Single declaration (left-to-right resolution)

`--value()` can also take multiple arguments and resolve them left to right when you don't need different handling per case:

```css
@theme {
  --tab-size-github: 8;
}

@utility tab-* {
  tab-size: --value(--tab-size-*, integer, [integer]);
}

@utility opacity-* {
  opacity: calc(--value(integer) * 1%);
  opacity: --value(--opacity-*, [percentage]);
}
```

## Default values

Use `--default()` inside `--value()` to provide a fallback when the utility is used **without** an explicit value:

```css
@utility tab-* {
  tab-size: --value(integer, --default(4));
}
```

| Class   | Compiled CSS  |
| ------- | ------------- |
| `tab`   | `tab-size: 4` |
| `tab-2` | `tab-size: 2` |

## Modifiers

Modifiers are handled with the `--modifier()` function, which works exactly like `--value()` but operates on the **modifier** (the value after `/`):

```css
@utility text-* {
  font-size: --value(--text-*, [length]);
  line-height: --modifier(--leading-*, [length], [*]);
}
```

This matches `text-base/loose` where `base` sets `font-size` and `loose` sets `line-height`.

> **Good to know**: If a modifier isn't present, any declaration depending on `--modifier()` is simply not included in the output. All the `--value()` behaviors — prefix-only concatenation, suffix leaving literal text, and unresolvable values dropping the declaration — apply to `--modifier()` as well.

`--default()` also works inside `--modifier()`:

```css
@utility tab-* {
  tab-size: --value(integer);
  line-height: --modifier(integer, --default(1));
}
```

This matches `tab-2/3` (line-height: 3) and `tab-2` (line-height: 1).

## Negative values

To support negative values, register separate positive and negative utilities:

```css
@utility inset-* {
  inset: --spacing(--value(integer));
  inset: --value([percentage], [length]);
}

@utility -inset-* {
  inset: --spacing(--value(integer) * -1);
  inset: calc(--value([percentage], [length]) * -1);
}
```

## Fractions

To handle fractions like `3/4`, use the CSS `ratio` data type. When `ratio` is used with `--value()`, Tailwind treats the value and modifier as a **single combined value**:

```css
@utility aspect-* {
  aspect-ratio: --value(--aspect-ratio-*, ratio, [ratio]);
}
```

This matches `aspect-square`, `aspect-3/4`, and `aspect-[7/9]`.
