---
title: Status
description: The status component — a colored dot indicator with optional gloss effect, ring, and four sizes. Use for online/offline badges, activity indicators, and status pills.
related:
  title: Related
  description: Use with these components.
  links:
    - css-utils/api-reference/components/avatar
    - css-utils/api-reference/components/badge
---

The `status` component is a small colored dot indicator. Apply a color utility for the fill, add `status-gloss` for a 3D shine, and `status-ring` to separate it from the background.

## Quick reference

| Utility                 | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `status`                | Base — colored dot, `aspect-square`, `rounded-lg`    |
| `status-*`              | Color setter (e.g. `status-success`, `status-error`) |
| `status-gloss`          | Radial gradient shine + drop shadow                  |
| `status-ring`           | Ring offset from background color                    |
| `status-xs`–`status-lg` | Size variants (8px–16px)                             |

---

## `status` — Base

```html
<span class="status status-success"></span>
```

| Property | Default                                   |
| -------- | ----------------------------------------- |
| Size     | `--status-size`: 8px (`xs`)               |
| Shape    | `aspect-square`, `rounded-lg`             |
| Color    | `var(--status-color)` or 20% base-content |
| Display  | `inline-block`                            |

---

## `status-*` — Color setter

Sets `--status-color` from any theme color.

```html
<span class="status status-success"></span>
<span class="status status-error"></span>
<span class="status status-warning"></span>
<span class="status status-info"></span>
```

---

## Sizes

| Utility     | Size | Use case                 |
| ----------- | ---- | ------------------------ |
| `status-xs` | 8px  | Tiny badges, inline text |
| `status-sm` | 10px | Avatar indicators        |
| `status-md` | 12px | Card status              |
| `status-lg` | 16px | Standalone indicators    |

```html
<span class="status status-lg status-success"></span>
```

---

## Variants

### `status-gloss`

Adds a radial gradient shine (light catch at top-left) and a subtle drop shadow.

```html
<span class="status status-gloss status-success"></span>
```

- `background-image`: radial gradient at 35% 30%
- `box-shadow`: drop shadow using `currentColor`

### `status-ring`

Adds a ring offset from the background color — creates visual separation from the surface behind it.

```html
<span class="status status-ring status-success"></span>
```

- `box-shadow`: `0 0 0 0.09375rem var(--color-bg)`

---

## Usage patterns

### Avatar status indicator

```html
<div class="avatar size-12">
  <div>
    <img class="mask mask-squircle" src="user.jpg" alt="User" />
    <div class="float-bottom-end mr-2 mb-2">
      <span class="status status-ring status-sm status-success"></span>
    </div>
  </div>
</div>
```

### Online/offline list

```html
<div class="flex items-center gap-2">
  <span class="status status-success status-xs"></span>
  <span>Online</span>
</div>
<div class="flex items-center gap-2">
  <span class="status status-error status-xs"></span>
  <span>Offline</span>
</div>
```

### Glossy badge

```html
<span class="status status-gloss status-lg status-primary status-ring"></span>
```
