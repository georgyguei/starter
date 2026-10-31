---
title: Badge
description: The badge component — a compact inline label for counts, statuses, and metadata. Supports color theming, five sizes, plain sizing, and outline/soft variants.
related:
  title: Related
  description: Combine with these components.
  links:
    - css-utils/api-reference/components/btn
    - css-utils/api-reference/components/avatar
---

The `badge` component is a small inline pill for displaying counts, status labels, or metadata. It uses `color-contrast` for accessible foreground/background pairing.

## `badge-*` — Color setter

Sets `--badge-color` from any theme color, with an optional alpha modifier.

| Class              | Effect                             |
| ------------------ | ---------------------------------- |
| `badge-primary`    | Primary color fill                 |
| `badge-secondary`  | Secondary color fill               |
| `badge-error`      | Error color fill                   |
| `badge-primary/50` | 50% alpha mix of primary           |
| (none)             | `var(--color-base-300)` background |

---

## `badge` — Base styles

```html
<span class="badge">New</span>
```

### Defaults

| Property       | Default                                     |
| -------------- | ------------------------------------------- |
| `--badge-size` | `calc(var(--spacing) * 6)` (24px)           |
| `--badge-fs`   | `0.875rem`                                  |
| `--badge-bg`   | `var(--badge-color, var(--color-base-300))` |
| `--badge-fg`   | Auto-contrast via `color-contrast`          |
| `--badge-p`    | `0.6em` (horizontal padding)                |
| Border         | Transparent (`#0000`)                       |
| Shape          | `rounded-full` (pill)                       |

---

## Size variants

| Utility    | Height | Font size  | Padding |
| ---------- | ------ | ---------- | ------- |
| `badge-xs` | 16px   | `0.625rem` | `0.4em` |
| `badge-sm` | 20px   | `0.75rem`  | `0.5em` |
| `badge-md` | 24px   | `0.875rem` | `0.6em` |
| `badge-lg` | 28px   | `1rem`     | `0.7em` |
| `badge-xl` | 32px   | `1.125rem` | `0.8em` |

```html
<span class="badge badge-sm">Small</span> <span class="badge badge-lg badge-primary">Large + Primary</span>
```

---

## Variants

### `badge-plain`

Resets the badge's fixed dimensions and font size, and reduces its horizontal padding to `0.125rem`. It keeps the base inline-flex pill layout, background, and badge-color behavior; this is a compact sizing reset, not a transparent/text-only variant.

```html
<span class="badge badge-plain">Plain sizing</span>
```

- `--badge-size` → `auto`
- `--badge-fs` → `inherit`
- `--badge-p` → `0.125rem`
- Other base styles, including pill shape and fill, remain active

### `badge-outline`

Transparent background with a colored border and text. No background noise/texture.

```html
<span class="badge badge-outline badge-primary">Outline</span>
```

- `--badge-bg` → transparent
- `--badge-fg` → `var(--badge-color)`
- `--badge-border-color` → `currentColor`
- Noise/fx disabled

### `badge-soft`

Low-contrast tinted background at 8% opacity of the badge color.

```html
<span class="badge badge-soft badge-secondary">Soft</span>
```

- `--badge-bg` → 8% mix of `--badge-color` and `var(--color-base-100)`
- `--badge-border-color` → 10% mix of `--badge-color` and `var(--color-base-100)`
- Noise/fx disabled

---

## Usage patterns

### Status badge

```html
<span class="badge badge-soft badge-success">Active</span>
<span class="badge badge-soft badge-error">Failed</span>
<span class="badge badge-soft badge-warning">Pending</span>
```

### Count badge

```html
<span class="badge">3</span> <span class="badge badge-sm badge-primary">99+</span>
```

### With icon

```html
<span class="badge gap-1.5 badge-outline">
  <svg class="icon size-3">...</svg>
  Verified
</span>
```
