---
title: Alert
description: The alert component — a flexible notification banner with color theming, soft/outline variants, and horizontal/vertical layout modes.
related:
  title: Related
  description: Combine with these components.
  links:
    - css-utils/api-reference/components/card
    - css-utils/api-reference/components/input
---

The `alert` component is a notification banner for status messages, warnings, and confirmations. It uses CSS Grid for layout, with auto-columns that expand when a second child is present.

## `alert-*` — Color setter

Sets `--alert-color` from any theme color.

| Class           | Effect                             |
| --------------- | ---------------------------------- |
| `alert-info`    | Info color fill                    |
| `alert-success` | Success color fill                 |
| `alert-warning` | Warning color fill                 |
| `alert-error`   | Error color fill                   |
| (none)          | `var(--color-base-200)` background |

---

## `alert` — Base styles

```html
<div class="alert">
  <span>Something happened!</span>
</div>
```

### Defaults

| Property      | Default                                     |
| ------------- | ------------------------------------------- |
| Layout        | `grid-flow-col grid-cols-[auto]`            |
| Gap           | `1rem`                                      |
| Padding       | `12px 16px`                                 |
| Border radius | `rounded-lg`                                |
| Font size     | `0.875rem`                                  |
| `--alert-bg`  | `var(--alert-color, var(--color-base-200))` |
| `--alert-fg`  | Auto-contrast via `color-contrast`          |

### Grid expansion

When the alert contains two children, the grid expands to `grid-cols-[auto_minmax(auto,1fr)]` — the first child (typically an icon) gets `auto` width, the second fills the remaining space.

```html
<div class="alert">
  <svg class="icon size-5">...</svg>
  <span>Message with an icon</span>
</div>
```

### Depth shadow

The base alert includes an inset highlight (`0 3px 0 -2px`) and a bottom shadow (`0 4px 3px -2px`) controlled by `--depth`, giving it a subtle raised appearance.

---

## Variants

### `alert-soft`

Low-contrast tinted background at 8% opacity. No shadow.

```html
<div class="alert alert-soft alert-info">Soft info alert</div>
```

- `--alert-bg` → `color-mix(in oklab, currentColor 8%, var(--color-base-100))`
- `--alert-border-color` → 10% tint of currentColor
- `--alert-shadow` → none
- Noise/fx disabled

### `alert-outline`

Transparent background with a colored border. No shadow.

```html
<div class="alert alert-outline alert-warning">Outline warning</div>
```

- `--alert-bg` → transparent
- `--alert-border` → `currentColor`
- `--alert-shadow` → none
- Noise/fx disabled

---

## Layout modes

### `alert-horizontal` (default)

Horizontal flow with items in a row. First child auto-width, second fills remaining space.

```html
<div class="alert alert-info">
  <svg>...</svg>
  <span>Horizontal layout</span>
</div>
```

### `alert-vertical`

Stacks items vertically with centered text and content. Both children stack in a single column.

```html
<div class="alert alert-vertical alert-success">
  <svg class="icon size-8">...</svg>
  <span>Vertical layout — great for centered confirmations</span>
</div>
```

---

## Usage patterns

### Status alerts

```html
<div class="alert alert-success">
  <svg class="icon size-5">...</svg>
  <span>Changes saved successfully</span>
</div>

<div class="alert alert-soft alert-error">
  <svg class="icon size-5">...</svg>
  <span>Something went wrong. Please try again.</span>
</div>
```

### Dismissible alert

```html
<div class="alert alert-outline alert-warning">
  <svg class="icon size-5">...</svg>
  <span>Your session expires in 5 minutes</span>
  <button class="btn ml-auto btn-square btn-ghost btn-sm">✕</button>
</div>
```
