---
title: Core Concepts
description: A reference for the custom functions and directives Tailwind CSS v4 exposes — the building blocks behind every CSS utility in this project.
related:
  title: Next Steps
  description: Learn how to put these concepts into practice.
  links:
    - css-utils/guides/getting-started
    - css-utils/guides/creating-utilities
---

Before creating CSS utilities, it helps to understand the Tailwind CSS v4 primitives they're built on. This page is a reference for every custom function and directive Tailwind exposes to your CSS.

## Directives

Directives are custom Tailwind-specific [at-rules](https://developer.mozilla.org/docs/Web/CSS/At-rule) you can use in your CSS that offer special functionality for Tailwind CSS projects.

### `@import`

Use the `@import` directive to inline import CSS files, including Tailwind itself:

```css
@import "tailwindcss";
```

### `@theme`

Use the `@theme` directive to define your project's custom design tokens — fonts, colors, breakpoints, and more:

```css
@theme {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 120rem;
  --color-avocado-100: oklch(0.99 0 0);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
  /* ... */
}
```

> **Good to know**: Design tokens defined with `@theme` are available as CSS variables and can be referenced anywhere in your stylesheets.

#### `@theme` options

The `@theme` directive accepts modifiers that control how theme values are emitted:

| Modifier           | Behavior                                                                              |
| ------------------ | ------------------------------------------------------------------------------------- |
| `@theme default`   | Allow values to be overridden by JS configs and plugins. Enables `var(…)` resolution. |
| `@theme inline`    | Inline values directly into generated utilities instead of using `var(…)`.            |
| `@theme reference` | Don't emit CSS variables — use values for utility generation only.                    |
| `@theme static`    | Always emit variables into the CSS output, even if not referenced by any utility.     |

```css
/* Allow JS config overrides */
@theme default {
  --color-primary: var(--color-blue-500);
}

/* Inline value directly (avoids variable resolution issues) */
@theme inline {
  --font-sans: var(--font-inter);
}

/* Reference-only — no CSS variable emitted */
@theme reference {
  --token-internal: 42;
}

/* Always emit, regardless of usage */
@theme static {
  --color-brand: oklch(0.62 0.19 260.13);
}
```

> **Deep dive**: For a complete reference on theme variable namespaces, custom tokens, overriding defaults, and sharing themes across projects, see the [Theme Variables](/docs/css-utils/guides/theme-variables) guide.

### `@source`

Use the `@source` directive to explicitly specify source files that aren't picked up by Tailwind's automatic content detection:

```css
@source "../node_modules/@my-company/ui-lib";
```

This is useful when utility classes live in dependencies outside your project's content paths.

### `@utility`

Use the `@utility` directive to register custom utilities that work with variants like `hover:`, `focus:`, and `lg:`:

```css
@utility tab-4 {
  tab-size: 4;
}
```

This is the primary directive used to build the custom utilities documented in our [API Reference](/docs/css-utils/api-reference).

### `@variant`

Use the `@variant` directive to apply a Tailwind variant to styles in your CSS:

```css
.my-element {
  background: white;

  @variant dark {
    background: black;
  }
}
```

### `@custom-variant`

Use the `@custom-variant` directive to register a custom variant in your project.

**Shorthand syntax** (when nesting isn't required):

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

This lets you write utilities like `theme-midnight:bg-black` and `theme-midnight:text-white` in your markup.

**Long-form syntax** (with `@slot` for more complex selectors):

```css
@custom-variant theme-midnight {
  &:where([data-theme="midnight"] *) {
    @slot;
  }
}
```

```html
<html data-theme="midnight">
  <button class="theme-midnight:bg-black ..."></button>
</html>
```

**Nested rules** (for variants that depend on media queries and pseudo-classes together):

```css
@custom-variant any-hover {
  @media (any-hover: hover) {
    &:hover {
      @slot;
    }
  }
}
```

> **Good to know**: The web2 app already defines three custom variants — `light`, `dark`, and `interest` — in `src/styles/globals.css`.

### `@apply`

Use the `@apply` directive to inline any existing utility classes into your own custom CSS:

```css
.select2-dropdown {
  @apply rounded-b-lg shadow-md;
}
```

This is useful when you need to write custom CSS (e.g., to override styles in a third-party library) but still want to use your design tokens and the same syntax you're used to in your HTML.

### `@reference`

If you need to use `@apply` or `@variant` inside a `<style>` block of a Vue or Svelte component, or within CSS Modules, you must import your theme variables, custom utilities, and custom variants so they're available in that context.

To do this **without duplicating any CSS in your output**, use the `@reference` directive to import your main stylesheet for reference only:

```css
/* my.module.css */
@reference "../../globals.css";

h1 {
  @apply text-2xl font-bold text-red-500;
}
```

### Subpath Imports

When using the CLI, Vite, or PostCSS, the directives `@import`, `@reference`, `@plugin`, and `@config` all support [subpath imports](https://nodejs.org/api/packages.html#subpath-imports), which work similarly to bundler and TypeScript path aliases:

```json title="package.json"
{
  "imports": {
    "#app.css": "./src/css/app.css"
  }
}
```

```css
@reference "#app.css";

h1 {
  @apply text-2xl font-bold text-red-500;
}
```

## Functions

Tailwind provides the following build-time functions for working with colors and the spacing scale.

### `--alpha()`

Use the `--alpha()` function to adjust the opacity of a color:

```css
/* Input CSS */
.my-element {
  color: --alpha(var(--color-lime-300) / 50%);
}

/* Compiled CSS */
.my-element {
  color: color-mix(in oklab, var(--color-lime-300) 50%, transparent);
}
```

### `--spacing()`

Use the `--spacing()` function to generate a spacing value based on your theme:

```css
/* Input CSS */
.my-element {
  margin: --spacing(4);
}

/* Compiled CSS */
.my-element {
  margin: calc(var(--spacing) * 4);
}
```

This can also be useful in arbitrary values, especially in combination with `calc()`:

```html
<div class="py-[calc(--spacing(4)-1px)]">
  <!-- ... -->
</div>
```

## Compatibility

The following directives and functions exist solely for compatibility with Tailwind CSS v3.x.

The `@config` and `@plugin` directives may be used alongside `@theme`, `@utility`, and other CSS-driven features. This enables incremental migration of your theme, custom configuration, utilities, variants, and presets to CSS. Things defined in CSS will be merged where possible and otherwise take precedence over those defined in configs, presets, and plugins.

### `@config`

Use the `@config` directive to load a legacy JavaScript-based configuration file:

```css
@config "../../tailwind.config.js";
```

> **Note**: The `corePlugins`, `safelist`, and `separator` options from the JavaScript-based config are **not supported** in v4. To safelist utilities in v4, use `@source inline()`.

### `@plugin`

Use the `@plugin` directive to load a legacy JavaScript-based plugin:

```css
@plugin "@tailwindcss/typography";
```

The `@plugin` directive accepts either a package name or a local path.

### `theme()`

Use the `theme()` function to access your Tailwind theme values using dot notation:

```css
.my-element {
  margin: theme(spacing.12);
}
```

> **Deprecated**: This function is deprecated in v4. Use CSS theme variables instead.
