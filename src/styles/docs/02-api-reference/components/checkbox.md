---
title: Checkbox
description: The checkbox component — styled checkboxes with animated checkmark, indeterminate state, color theming, and five size variants.
related:
  title: Related
  description: Combine with these components.
  links:
    - css-utils/api-reference/components/btn
    - css-utils/api-reference/components/input
    - css-utils/api-reference/components/validator
---

The `checkbox` component styles native `<input type="checkbox">` elements with a custom animated checkmark via `:before` + `clip-path`, indeterminate state support, and color theming.

## `checkbox-*` — Color setter

Sets `--input-color` from any theme color, with optional alpha modifier.

| Class              | `--input-color`                                                   |
| ------------------ | ----------------------------------------------------------------- |
| `checkbox-primary` | primary color (checked fill + border)                             |
| `checkbox-error`   | error color                                                       |
| (none)             | `color-mix(in oklab, var(--color-base-content) 20%, transparent)` |

---

## `checkbox` — Base styles

```html
<input type="checkbox" class="checkbox" checked />
```

### Defaults

| Property               | Default                                          |
| ---------------------- | ------------------------------------------------ |
| `--input-size`         | `calc(var(--size-selector, 0.25rem) * 6)` (24px) |
| `--input-padding`      | `0.25rem`                                        |
| `--input-border-width` | `var(--border, 1px)`                             |

### How the checkmark works

The `:before` pseudo-element uses an animated `clip-path` polygon. When unchecked, the path hides the checkmark. When checked, the path reveals it with a rotation and opacity transition:

| State         | `clip-path`                                                           |
| ------------- | --------------------------------------------------------------------- |
| Unchecked     | `polygon(20% 100%, ...)` — hides the check shape                      |
| Checked       | `polygon(20% 100%, ..., 50% 0%, 70% 0%, ...)` — reveals the checkmark |
| Indeterminate | Horizontal dash                                                       |

---

## States

### Checked

```html
<input type="checkbox" class="checkbox checkbox-primary" checked />
```

Background fills with `--input-color`, checkmark animates in.

### Indeterminate

```html
<input type="checkbox" class="checkbox" id="parent" />
```

Set via JavaScript: `checkbox.indeterminate = true`. Displays a horizontal dash instead of a checkmark — useful for "select all" checkboxes where some children are selected.

### Disabled

```html
<input type="checkbox" class="checkbox" disabled /> <input type="checkbox" class="checkbox" checked disabled />
```

Reduced opacity (20%), `cursor: not-allowed`. Checked disabled state gets slightly higher opacity (40%).

### Focus-visible

```html
<input type="checkbox" class="checkbox checkbox-primary" />
```

Shows a 2px outline in `--input-color` when focused via keyboard navigation.

---

## Size variants

| Utility       | Size           |
| ------------- | -------------- |
| `checkbox-xs` | 16px           |
| `checkbox-sm` | 20px           |
| `checkbox-md` | 24px (default) |
| `checkbox-lg` | 28px           |
| `checkbox-xl` | 32px           |

```html
<input type="checkbox" class="checkbox checkbox-sm" /> <input type="checkbox" class="checkbox checkbox-lg checkbox-primary" checked />
```

---

## Usage patterns

### With label

```html
<label class="flex cursor-pointer items-center gap-2">
  <input type="checkbox" class="checkbox checkbox-primary" />
  <span>Accept terms</span>
</label>
```

### Select all (indeterminate)

```html
<label class="flex cursor-pointer items-center gap-2">
  <input type="checkbox" class="checkbox" id="select-all" />
  <span>Select all</span>
</label>

<div class="ml-6 space-y-1">
  <label class="flex cursor-pointer items-center gap-2">
    <input type="checkbox" class="checkbox checkbox-sm" />
    <span>Item 1</span>
  </label>
  <label class="flex cursor-pointer items-center gap-2">
    <input type="checkbox" class="checkbox checkbox-sm" />
    <span>Item 2</span>
  </label>
</div>
```

```js
// Set indeterminate when some (not all) children are checked
document.getElementById("select-all").indeterminate = true;
```

> **Accessibility**: The checkbox supports `forced-colors: active` and `print` media queries, falling back to a text-based checkmark (`✔︎`) when custom rendering isn't available.
