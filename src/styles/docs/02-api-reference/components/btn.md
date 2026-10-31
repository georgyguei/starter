---
title: Button (btn)
description: The btn component system — a full button primitive with color, style, shape, and size variants. Built with @utility and @layer components.
related:
  title: Dependencies
  description: Components build on composition and shortcut utilities.
  links:
    - css-utils/api-reference/compositions
    - css-utils/api-reference/animation
    - css-utils/guides/advanced-utilities
---

The `btn` system is a full button component built with `@utility` and `@layer components` nesting. It handles states (hover, active, disabled, checked), provides 5 style variants, 2 shape variants, and 5 sizes — all combinable on a single element.

## How it works

Follows the same custom property chain pattern as `bg-*` / `text-contrast`:

1. **`btn-{color}`** sets `--btn-color`
2. **`btn`** reads `--btn-color` to build the full appearance
3. **Variant utilities** override specific `--btn-*` properties to alter the look

All visual properties are custom-property-driven, so variants only change a few values rather than redefining every CSS rule.

```
<button class="btn btn-primary btn-lg btn-circle">
                ↑       ↑       ↑      ↑
                base    color   size   shape
```

---

## `btn-*` — Color setter

Sets `--btn-color` from any theme color or arbitrary value, with optional alpha modifier.

```css
@utility btn-* {
  --btn-color: --alpha(--value(--color-*, [*]) / --modifier(...) * 1%);
}
@utility btn-* {
  --btn-color: --value(--color-*, [*]);
}
```

| Class          | `--btn-color`                |
| -------------- | ---------------------------- |
| `btn-primary`  | `oklch(0.4501 0.24 277.03)`  |
| `btn-error/50` | 50% alpha mix of error color |

---

## `btn` — Base component

Sets all `--btn-*` custom properties and applies layout, typography, colors, borders, shadows, transitions, and interactive states.

### Defaults

| Property             | Default value                                      |
| -------------------- | -------------------------------------------------- |
| `--btn-bg`           | `var(--btn-color, var(--color-base-200))`          |
| `--btn-fg`           | `var(--color-contrast, var(--color-base-content))` |
| `--btn-border-color` | `color-mix(in oklab, var(--btn-bg), #000 5%)`      |
| `--btn-size`         | `calc(var(--spacing) * 10)` (40px)                 |
| `--btn-fs`           | `0.875rem`                                         |
| `--btn-p`            | `1rem`                                             |
| `--btn-rounded`      | `var(--radius-field, 0.25rem)`                     |

### Interactive states

| State                        | Behavior                                                    |
| ---------------------------- | ----------------------------------------------------------- |
| **Hover**                    | Darkens `--btn-bg` by 7% black                              |
| **Active**                   | Darkens `--btn-bg` by 5%, removes shadow, pushes down 1px   |
| **Focus-visible**            | 2px outline in button color                                 |
| **Disabled**                 | `opacity: 60%`, `cursor: not-allowed`, transparent border   |
| **Checked** (radio/checkbox) | Sets `--btn-color` to primary, applies primary-content text |

### Usage

```html
<button class="btn btn-primary">Button</button>
<button class="btn btn-error" disabled>Disabled</button>
<input type="checkbox" class="btn btn-primary" aria-label="Toggle" />
```

---

## Style variants

Each style variant overrides `--btn-bg`, `--btn-fg`, `--btn-border-color`, `--btn-shadow`, and related properties. Hover/active states continue to work.

| Utility       | Look                                 | Key override                                                            |
| ------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| `btn-plain`   | Transparent background, colored text | `--btn-bg: #0000`, `--btn-fg: var(--btn-color)`                         |
| `btn-link`    | Text-only, underlined on hover       | `--btn-bg: #0000`, `--btn-p: 0`, `--btn-size: auto`                     |
| `btn-ghost`   | Transparent until hover/active       | `--btn-bg: #0000` unless interacting                                    |
| `btn-outline` | Transparent fill, colored border     | `--btn-border-color: currentColor`                                      |
| `btn-soft`    | Tinted background, colored text      | `--btn-bg: color-mix(in oklab, currentColor 8%, var(--color-base-100))` |

### Usage

```html
<button class="btn btn-outline btn-primary">Outline</button>
<button class="btn btn-soft btn-error">Soft</button>
<a class="btn btn-link btn-primary">Link</a>
```

> **Disabled state**: Each variant handles its own disabled appearance — typically fading the foreground color.

---

## Shape variants

| Utility      | Effect                                                   |
| ------------ | -------------------------------------------------------- |
| `btn-square` | Removes horizontal padding, sets `width == height`       |
| `btn-circle` | Same as square + `border-radius: infinity` (fully round) |

```html
<button class="btn btn-square btn-primary">X</button> <button class="btn btn-circle btn-primary">✓</button>
```

---

## Size variants

| Utility  | Font size | Padding | Height         |
| -------- | --------- | ------- | -------------- |
| `btn-xs` | 0.6875rem | 0.5rem  | 24px           |
| `btn-sm` | 0.75rem   | 0.75rem | 32px           |
| `btn-md` | 0.875rem  | 1rem    | 40px (default) |
| `btn-lg` | 1.125rem  | 1.25rem | 48px           |
| `btn-xl` | 1.375rem  | 1.5rem  | 56px           |

```html
<button class="btn btn-sm btn-primary">Small</button> <button class="btn btn-lg btn-primary">Large</button>
```

---

## `btn-active`

Forces the active/pressed state. Useful for toggle buttons:

```html
<button class="btn btn-active btn-primary">Pressed</button>
```

---

## Combining variants

All variant categories can be freely combined:

```html
<!-- Large, circular, soft-style, primary-colored button -->
<button class="btn btn-circle btn-soft btn-lg btn-primary">+</button>

<!-- Small, outline, error-colored link-looking button -->
<a class="btn btn-outline btn-sm btn-error">Cancel</a>

<!-- Extra-small, ghost, plain-text button -->
<button class="btn btn-ghost btn-xs">...</button>
```

> **Order doesn't matter**: All variants operate via custom properties, so they compose regardless of class order.
