---
title: Dialog
description: The dialog component — modal and non-modal dialogs with position variants, animated entry/exit via @starting-style, and color theming.
related:
  title: Related
  description: Works with these components and features.
  links:
    - css-utils/api-reference/components/card
    - css-utils/api-reference/components/btn
    - css-utils/api-reference/compositions
    - css-utils/transitions-and-animations/starting-style
---

The `dialog` system styles the native `<dialog>` element with position variants, animated entry/exit using `@starting-style` and spring easing, modal backdrop behavior, and color theming.

---

## `dialog-*` — Color setter

Sets `--dialog-color` from any theme color, with optional alpha modifier.

| Class             | `--dialog-color` |
| ----------------- | ---------------- |
| `dialog-primary`  | primary color    |
| `dialog-error/50` | 50% alpha error  |

---

## `dialog` — Base styles

Converts the `<dialog>` to a fixed-position overlay with custom-property-driven positioning and colors. Automatically computes contrasting text via `color-contrast-(--dialog-color)`.

```html
<dialog class="dialog">
  <p>Dialog content</p>
</dialog>
```

### Defaults

| Property            | Default                               |
| ------------------- | ------------------------------------- |
| `--dialog-bg`       | `var(--dialog-color, transparent)`    |
| `--dialog-fg`       | `var(--color-contrast, currentColor)` |
| `--dialog-duration` | `700ms`                               |
| `::backdrop`        | `oklch(0% 0 0 / 0.2)`                 |

### Opening

Use the `commandfor` + `command="show-modal"` pattern, or `showModal()` in JS:

```html
<button commandfor="my-dialog" command="show-modal">Open</button>
<dialog id="my-dialog" class="dialog">...</dialog>
```

---

## `dialog-modal`

Prevents interaction with background content while the element is open. Not needed for `<dialog>` (which blocks outside interaction natively with `showModal()`). Use it on **popovers** that need modal-like behavior.

| Popover type       | Behavior with `dialog-modal`                                                                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `popover="manual"` | Same as `dialog.showModal()` — all outside interaction blocked                                                                                                                |
| `popover="auto"`   | Blocks clicking outside links/buttons and hover interactions, but still allows **light-dismiss** (clicking outside closes the popover without triggering background elements) |

```html
<!-- Manual popover acting as a modal -->
<div popover="manual" class="dialog-modal dialog">...</div>

<!-- Auto popover: blocks interaction, but clicking outside still closes it -->
<div popover="auto" class="dialog-modal dialog">...</div>
```

---

## `dialog-animated`

Adds spring-based entry/exit animations using `@starting-style`. The open animation uses `var(--ease-spring-heavy)` for a satisfying pop-in; the close animation uses `var(--ease-overshoot-in)`.

```html
<dialog class="dialog dialog-animated">...</dialog>
```

### How it works

| Phase       | Behavior                                                                          |
| ----------- | --------------------------------------------------------------------------------- |
| **Opening** | Scales/translates from starting style to final position over 1550ms spring        |
| **Open**    | Normal position, backdrop visible                                                 |
| **Closing** | Reverses to hidden state over 650ms with `allow-discrete` for `display`/`overlay` |

> Requires `transition-behavior: allow-discrete` and `@supports` guard. Falls back to no animation in unsupported browsers.

---

## Position variants

Each variant sets `--dialog-origin` (transform origin) and positions the dialog at a specific edge. All work with `dialog-animated`.

### `dialog-top`

Slides down from the top edge:

```html
<dialog class="dialog dialog-top dialog-animated">...</dialog>
```

| Property          | Value                                 |
| ----------------- | ------------------------------------- |
| `--dialog-origin` | `top center`                          |
| `--dialog-top`    | `var(--dialog-offset, 4rem)`          |
| Width             | `fit-content`, centered via `mx-auto` |

### `dialog-center`

Appears in the center of the viewport:

```html
<dialog class="dialog dialog-center dialog-animated">...</dialog>
```

### `dialog-bottom`

Slides up from the bottom edge (like a bottom sheet):

```html
<dialog class="dialog dialog-bottom dialog-animated">...</dialog>
```

| Property          | Value                        |
| ----------------- | ---------------------------- |
| `--dialog-origin` | `bottom center`              |
| `--dialog-bottom` | `var(--dialog-offset, 4rem)` |

---

## Size variants

### `dialog-cover`

Covers most of the viewport with a margin (default 2.5rem on all sides):

```html
<dialog class="dialog dialog-cover dialog-animated">...</dialog>
```

| Property          | Default                        |
| ----------------- | ------------------------------ |
| All insets        | `var(--dialog-offset, 2.5rem)` |
| `--dialog-origin` | `center`                       |

### `dialog-full`

Fills the entire viewport (insets default to `0rem`):

```html
<dialog class="dialog dialog-full dialog-animated">...</dialog>
```

---

## `dialog-offset-*` / `-dialog-offset-*`

Controls the distance from the edge for `dialog-top`, `dialog-bottom`, `dialog-cover`, and `dialog-full`. Uses the spacing scale.

```html
<!-- 8 spacing units from the top -->
<dialog class="dialog dialog-top dialog-offset-8">...</dialog>

<!-- Negative offset (pulls beyond edge) -->
<dialog class="dialog dialog-top -dialog-offset-4">...</dialog>
```

| Class                | Offset             |
| -------------------- | ------------------ |
| `dialog-offset-0`    | `0rem`             |
| `dialog-offset-4`    | `1rem`             |
| `dialog-offset-8`    | `2rem`             |
| `dialog-offset-16`   | `4rem`             |
| `dialog-offset-[32]` | `8rem` (arbitrary) |

---

## Full example

```html
<button class="btn btn-primary" commandfor="demo-dialog" command="show-modal">Open Dialog</button>

<dialog id="demo-dialog" class="dialog dialog-top scroll-lock dialog-animated dialog-blue-500">
  <div class="card">
    <div class="card-body">
      <h2 class="card-title">Confirm</h2>
      <p>Are you sure you want to continue?</p>
      <div class="card-action justify-end">
        <button class="btn btn-ghost" commandfor="demo-dialog" command="request-close">Cancel</button>
        <button class="btn btn-primary">Confirm</button>
      </div>
    </div>
  </div>
</dialog>
```

> **Tip**: Combine with `scroll-lock` to lock page scroll when the dialog is open. Wrap content in a `card` for structured padding and layout.
