---
title: Toggle
description: The toggle component — an animated toggle switch with sliding thumb, icon support, color theming, and five size variants.
related:
  title: Related
  description: Combine with these components.
  links:
    - css-utils/api-reference/components/checkbox
    - css-utils/api-reference/components/input
    - css-utils/api-reference/components/field
---

The `toggle` component is a checkbox-based toggle switch with an animated sliding thumb using `grid-template-columns` transition and optional on/off icons with crossfade rotation.

## `toggle-*` — Color setter

Sets `--input-color` from any theme color.

| Class            | `--input-color`              |
| ---------------- | ---------------------------- |
| `toggle-primary` | primary color (checked fill) |
| `toggle-error`   | error color                  |
| (none)           | `var(--color-base-content)`  |

---

## `toggle` — Base styles

```html
<input type="checkbox" class="toggle" />
```

### Defaults

| Property       | Default                                  |
| -------------- | ---------------------------------------- |
| `--input-size` | `calc(var(--spacing) * 6)` (24px height) |
| Width          | `calc(var(--input-size) * 2 - borders)`  |

### States

| State             | Behavior                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| **Unchecked**     | Gray thumb on the left, `grid-template-columns: 0fr 1fr 1fr`             |
| **Checked**       | Colored track + thumb slides right, `grid-template-columns: 1fr 1fr 0fr` |
| **Indeterminate** | Thumb centered, `grid-template-columns: 0.5fr 1fr 0.5fr`                 |
| **Disabled**      | `opacity: 30%`, bordered thumb, `cursor: not-allowed`                    |
| **Focus-visible** | 2px outline in current color                                             |

---

## With icons

Toggle supports two child elements that crossfade and rotate when the state changes. First child = unchecked icon, second child = checked icon:

```html
<label class="toggle">
  <input type="checkbox" />
  <!-- Unchecked icon -->
  <svg class="icon">...</svg>
  <!-- Checked icon -->
  <svg class="icon">...</svg>
</label>
```

When checked, the first icon fades out with a 15deg rotation and the second fades in from −15deg.

> **Label wrapper required**: Icons must be children of the toggle. Use a `<label>` wrapper when the toggle contains icons.

---

## Size variants

| Utility     | Height         |
| ----------- | -------------- |
| `toggle-xs` | 16px           |
| `toggle-sm` | 20px           |
| `toggle-md` | 24px (default) |
| `toggle-lg` | 28px           |
| `toggle-xl` | 32px           |

```html
<input type="checkbox" class="toggle toggle-sm" /> <input type="checkbox" class="toggle toggle-lg toggle-primary" checked />
```

---

## Variants

### `toggle-outline`

Transparent background when checked — only the border and thumb are colored, while the track stays clear.

```html
<input type="checkbox" class="toggle toggle-outline toggle-primary" />
```

When checked:

- `--toggle-bg` → transparent
- `--input-border-color` → `currentColor`
- `--toggle-fg` → `--input-color` (thumb becomes the accent color)

### `toggle-soft`

Low-contrast, soft background variant. The track uses a tinted background at 10% opacity of the input color, and the border is similarly subdued.

```html
<input type="checkbox" class="toggle toggle-soft toggle-primary" />
```

- `--toggle-bg` → `color-mix(in oklab, var(--input-color) 10%, var(--color-base-100))`
- `--input-border-color` → 10% tint of input color

---

## Usage patterns

### Simple on/off

```html
<input type="checkbox" class="toggle toggle-primary" />
```

### With label

```html
<label class="flex cursor-pointer items-center gap-3">
  <input type="checkbox" class="toggle toggle-primary" />
  <span>Enable notifications</span>
</label>
```

### Indeterminate (via JavaScript)

```html
<input type="checkbox" class="toggle" id="parent-toggle" />
```

```js
document.getElementById("parent-toggle").indeterminate = true;
```
