---
title: Getting Started
description: Learn the fundamentals of creating custom CSS utility classes with Tailwind CSS v4's @utility directive.
---

## Overview

The web2 app uses [Tailwind CSS v4](https://tailwindcss.com/docs) with its native `@utility` directive to define custom utility classes. This guide walks you through the basics.

> **Prerequisite**: New to Tailwind v4 directives like `@utility`, `@theme`, or `@custom-variant`? Start with [Core Concepts](/docs/css-utils/guides/core-concepts) first.

## Where utilities are defined

All custom utilities live in a single file:

```
src/styles/globals.css
```

They are placed at the top of the file, before any `@layer` blocks, so they participate in Tailwind's `utilities` layer by default.

## Anatomy of a utility

A custom utility follows this pattern:

```css
@utility <name> {
  <property>: --value(<allowed-values>);
}
```

- **`<name>`** — The utility class name. Use `-*` suffix for utilities that accept a value (e.g., `text-rendering-*`).
- **`--value()`** — A Tailwind v4 function that restricts accepted values to a known set. This ensures only valid CSS values can be passed.

### Example: `text-rendering-*`

```css
@utility text-rendering-* {
  text-rendering: --value("auto", "optimizeSpeed", "optimizeLegibility", "geometricPrecision");
}
```

This generates classes like:

| Class                               | CSS Output                           |
| ----------------------------------- | ------------------------------------ |
| `text-rendering-auto`               | `text-rendering: auto`               |
| `text-rendering-optimizeSpeed`      | `text-rendering: optimizeSpeed`      |
| `text-rendering-optimizeLegibility` | `text-rendering: optimizeLegibility` |
| `text-rendering-geometricPrecision` | `text-rendering: geometricPrecision` |

## Using a utility in JSX

Once defined, use the utility like any other Tailwind class:

```tsx
<html className="text-rendering-optimizeLegibility touch-action-manipulation">
```

## Next steps

- [Creating Utilities](/docs/css-utils/guides/creating-utilities) — Learn how to add your own.
- [API Reference](/docs/css-utils/api-reference) — Browse all available utilities.
