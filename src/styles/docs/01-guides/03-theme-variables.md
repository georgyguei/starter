---
title: Theme Variables
description: A complete reference for Tailwind CSS v4 theme variable namespaces, custom tokens, overriding defaults, and sharing themes across projects.
related:
  title: Related
  description: Learn the fundamentals first.
  links:
    - css-utils/guides/core-concepts
    - css-utils/guides/getting-started
---

Theme variables are the design tokens that power every Tailwind utility class. They're defined with the `@theme` directive and organized into **namespaces** — each namespace maps to one or more utility class or variant APIs.

## Theme variable namespaces

Defining new theme variables in these namespaces makes new corresponding utilities and variants available in your project:

| Namespace          | Utility classes                                                          |
| ------------------ | ------------------------------------------------------------------------ |
| `--color-*`        | Color utilities like `bg-red-500`, `text-sky-300`, and many more         |
| `--font-*`         | Font family utilities like `font-sans`                                   |
| `--text-*`         | Font size utilities like `text-xl`                                       |
| `--font-weight-*`  | Font weight utilities like `font-bold`                                   |
| `--tracking-*`     | Letter spacing utilities like `tracking-wide`                            |
| `--leading-*`      | Line height utilities like `leading-tight`                               |
| `--tab-size-*`     | Tab size utilities like `tab-github`                                     |
| `--breakpoint-*`   | Responsive breakpoint variants like `sm:*`                               |
| `--container-*`    | Container query variants like `@sm:*` and size utilities like `max-w-md` |
| `--spacing-*`      | Spacing and sizing utilities like `px-4`, `max-h-16`, and many more      |
| `--radius-*`       | Border radius utilities like `rounded-sm`                                |
| `--shadow-*`       | Box shadow utilities like `shadow-md`                                    |
| `--inset-shadow-*` | Inset box shadow utilities like `inset-shadow-xs`                        |
| `--drop-shadow-*`  | Drop shadow filter utilities like `drop-shadow-md`                       |
| `--blur-*`         | Blur filter utilities like `blur-md`                                     |
| `--perspective-*`  | Perspective utilities like `perspective-near`                            |
| `--zoom-*`         | Zoom utilities like `zoom-compact`                                       |
| `--aspect-*`       | Aspect ratio utilities like `aspect-video`                               |
| `--ease-*`         | Transition timing function utilities like `ease-out`                     |
| `--animate-*`      | Animation utilities like `animate-spin`                                  |

These are all of the default theme variable namespaces provided by Tailwind CSS v4.

## Custom theme variable tokens

You can create your own custom tokens that can be referenced by any utility:

```css
@theme default {
  --token-*: initial; /* Declare a custom namespace */
  --token-abc: some-value;
  --token-12: another-value;
  /* ... */
}
```

Custom tokens behave like built-in namespaces — they become CSS variables and can be used anywhere in your stylesheets.

## Overriding namespaces

### Override a single namespace

To completely override an entire namespace in the default theme, set it to `initial` using the special asterisk syntax, then redefine only the values you need:

```css
@import "tailwindcss";

@theme {
  --color-*: initial;
  --color-white: #fff;
  --color-purple: #3f3cbb;
}
```

When you do this, **all default utilities that use that namespace** (like `bg-red-500`) are removed, and only your custom values (like `bg-purple`) remain available. This also works for custom tokens.

### Disable the entire default theme

To completely disable the default theme and use only custom values, set the global namespace to `initial`:

```css
@import "tailwindcss";

@theme {
  --*: initial;
  --spacing: 4px;
  --font-body: Inter, sans-serif;
  --color-lagoon: oklch(0.72 0.11 221.19);
  --color-coral: oklch(0.74 0.17 40.24);
  --color-driftwood: oklch(0.79 0.06 74.59);
  --color-tide: oklch(0.49 0.08 205.88);
  --color-dusk: oklch(0.82 0.15 72.09);
}
```

> **Warning**: This removes every default utility class. Only use this if you intend to build a fully custom design system from scratch.

## Defining animation keyframes

Define the `@keyframes` rules for your `--animate-*` theme variables **within `@theme`** to include them in your generated CSS:

```css
@import "tailwindcss";

@theme {
  --animate-fade-in-scale: fade-in-scale 0.3s ease-out;

  @keyframes fade-in-scale {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
}
```

If you want your custom `@keyframes` rules to always be included even when not referenced by an `--animate-*` variable, define them **outside** of `@theme` instead.

## Referencing other variables

When defining theme variables that reference other variables, use the `inline` option to avoid variable resolution issues:

```css
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-inter);
}
```

With `inline`, the utility class uses the theme variable **value** instead of referencing the theme variable itself:

```css
/* Compiled CSS */
.font-sans {
  font-family: var(--font-inter);
}
```

### Why `inline` matters

Without `inline`, your utility classes might resolve to unexpected values because of how CSS variable scoping works:

```html
<div id="parent" style="--font-sans: var(--font-inter, sans-serif);">
  <div id="child" style="--font-inter: Inter; font-family: var(--font-sans);">This text will use the sans-serif font, not Inter.</div>
</div>
```

This happens because `var(--font-sans)` is resolved where `--font-sans` is defined (on `#parent`), and `--font-inter` has no value there since it's not defined until deeper in the tree (on `#child`).

## Generating all CSS variables

By default, only CSS variables that are **actually used** by your utilities will be emitted in the final CSS output. To always generate all variables regardless of usage, use the `static` theme option:

```css
@import "tailwindcss";

@theme static {
  --color-primary: var(--color-red-500);
  --color-secondary: var(--color-blue-500);
}
```

## Sharing themes across projects

Since theme variables are defined in CSS, sharing them across projects is as simple as putting them in their own CSS file and importing it:

```css title="packages/brand/theme.css"
@theme {
  --*: initial;
  --spacing: 4px;
  --font-body: Inter, sans-serif;
  --color-lagoon: oklch(0.72 0.11 221.19);
  --color-coral: oklch(0.74 0.17 40.24);
  --color-driftwood: oklch(0.79 0.06 74.59);
  --color-tide: oklch(0.49 0.08 205.88);
  --color-dusk: oklch(0.82 0.15 72.09);
}
```

Then import it in any project:

```css title="apps/admin/app.css"
@import "tailwindcss";
@import "../brand/theme.css";
```

You can put shared theme variables in their own package in monorepo setups, or even publish them to npm and import them like any other third-party CSS file.

## Using theme variables in custom CSS

All theme variables are compiled to regular CSS custom properties:

```css
:root {
  --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --color-red-50: oklch(0.971 0.013 17.38);
  --color-red-100: oklch(0.936 0.032 17.717);
  --color-red-200: oklch(0.885 0.062 18.334);
  /* ... */
  --shadow-2xs: 0 1px rgb(0 0 0 / 0.05);
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  /* ... */
}
```

This makes it easy to reference all of your design tokens in custom CSS or inline styles.
