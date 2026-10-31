---
title: Input
description: The input component — styled form inputs with color theming, style variants (ghost, soft, flushed), size variants, and built-in invalid/disabled state handling.
related:
  title: Related
  description: Combine with these components.
  links:
    - css-utils/api-reference/components/btn
    - css-utils/api-reference/components/validator
    - css-utils/api-reference/components/join
---

The `input` component styles native `<input>` elements with consistent sizing, borders, focus rings, and state handling. Works on the input directly or as a wrapper for nested inputs.

## `input-*` — Color setter

Sets `--input-color` from any theme color, with optional alpha modifier.

| Class           | `--input-color`                                                   |
| --------------- | ----------------------------------------------------------------- |
| `input-primary` | primary color (border + focus ring)                               |
| `input-error`   | error color                                                       |
| (none)          | `color-mix(in oklab, var(--color-base-content) 20%, transparent)` |

---

## `input` — Base styles

```html
<input class="input" placeholder="Type here..." />
```

### Defaults

| Property               | Default                            |
| ---------------------- | ---------------------------------- |
| `--input-size`         | `calc(var(--spacing) * 10)` (40px) |
| `--input-border-width` | `var(--border, 1px)`               |
| `--input-padding`      | `0.75rem`                          |
| Width                  | `clamp(3rem, 20rem, 100%)`         |

### States

| State                                            | Behavior                                                  |
| ------------------------------------------------ | --------------------------------------------------------- |
| **Focus**                                        | 2px box-shadow in `--input-color`                         |
| **Invalid** (`[data-invalid]`, `[aria-invalid]`) | Sets `--input-color` to `--color-error`                   |
| **Disabled**                                     | Gray background, reduced opacity, `cursor: not-allowed`   |
| **iOS**                                          | Increases font-size to 1rem on focus to prevent page zoom |

### Wrapper pattern

For inputs with leading/trailing content (icons, buttons), use `input` as a wrapper:

```html
<label class="input">
  <span class="icon"><svg>...</svg></span>
  <input placeholder="Search..." />
</label>
```

Nested `<input>` elements inherit the wrapper's sizing and have transparent backgrounds.

### Textarea

`input` on a `<textarea>` automatically gets `height: auto` — the fixed `--input-size` height is cleared so the textarea grows with content.

```html
<textarea class="input" placeholder="Write something..." rows="3"></textarea>
```

> Size variants (`input-sm`, `input-md`, etc.) still apply padding and font-size, but height always defaults to `auto`.

---

## Style variants

| Utility         | Look                                                     |
| --------------- | -------------------------------------------------------- |
| `input-ghost`   | Transparent background, no border                        |
| `input-soft`    | Tinted background matching `--input-color` at 8% opacity |
| `input-flushed` | Bottom border only, no background, no radius             |

```html
<input class="input input-ghost" placeholder="Ghost" />
<input class="input input-soft input-primary" placeholder="Soft primary" />
<input class="input input-flushed" placeholder="Flushed" />
```

---

## Size variants

| Utility    | Font size | Height         |
| ---------- | --------- | -------------- |
| `input-xs` | 0.6875rem | 24px           |
| `input-sm` | 0.75rem   | 32px           |
| `input-md` | 0.875rem  | 40px (default) |
| `input-lg` | 1.125rem  | 48px           |
| `input-xl` | 1.375rem  | 56px           |

```html
<input class="input input-sm" placeholder="Small" /> <input class="input input-lg" placeholder="Large" />
```

### `input-square`

Square aspect ratio — height and width both equal `--input-size`. Useful for icon-only inputs, color pickers, or PIN code fields:

```html
<!-- Color picker -->
<input class="input input-sm input-square" type="color" />

<!-- PIN code digits -->
<div class="join">
  <input class="input input-sm input-square join-item text-center" type="number" maxlength="1" />
  <input class="input input-sm input-square join-item text-center" type="number" maxlength="1" />
  <input class="input input-sm input-square join-item text-center" type="number" maxlength="1" />
  <input class="input input-sm input-square join-item text-center" type="number" maxlength="1" />
</div>
```

---

## `input-no-spin`

Removes the number input spinner arrows (WebKit + Firefox):

```html
<input class="input input-no-spin" type="number" />
```

---

## Full example

```html
<div>
  <label class="validator input">
    <span class="icon"><svg>...</svg></span>
    <input type="email" placeholder="Email" required />
  </label>
  <div class="validator-hint">
    <span>Please enter a valid email.</span>
  </div>
</div>
```
