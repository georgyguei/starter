---
title: Creating Utilities
description: A step-by-step guide to adding new custom CSS utility classes to the web2 app.
---

## Before you start

Make sure you've read the [Getting Started](/docs/css-utils/guides/getting-started) guide to understand the basic anatomy of a utility.

## Step 1: Choose a CSS property

Pick the CSS property you want to expose as a utility. For example, `scroll-behavior`.

## Step 2: Define the utility

Open `src/styles/globals.css` and add your utility at the top of the file:

```css
@utility scroll-behavior-* {
  scroll-behavior: --value("auto", "smooth");
}
```

> **Good to know**: Always use the `--value()` function with an explicit allow-list. This prevents invalid CSS values from reaching production and acts as built-in documentation.

## Step 3: Use it in your components

```tsx
<html className="scroll-behavior-smooth">
```

## Step 4: Document it

Add an entry to the [API Reference](/docs/css-utils/api-reference) so other developers can discover and use your utility.

## Naming conventions

| Pattern      | Example            | Use case                                 |
| ------------ | ------------------ | ---------------------------------------- |
| `*-*` suffix | `text-rendering-*` | Utility accepts a value from a known set |
| Static name  | (not yet used)     | Utility with no value parameter          |

## Best practices

1. **Always use `--value()`** with an explicit allow-list — never with bare `*`.
2. **Keep utilities in `globals.css`** at the top before `@layer` blocks.
3. **Group related utilities** together (e.g., all typography utilities in one section).
4. **Document every new utility** in the API reference.
