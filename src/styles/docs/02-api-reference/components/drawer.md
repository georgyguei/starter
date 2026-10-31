---
title: Drawer
description: The drawer component — edge-sliding panels (top/bottom/left/right) with modal behavior, animated entry/exit via @starting-style, and color theming. Designed for <dialog popover> elements.
related:
  title: Related
  description: Works with these components and features.
  links:
    - css-utils/api-reference/components/dialog
    - css-utils/api-reference/components/card
    - css-utils/api-reference/compositions
    - css-utils/transitions-and-animations/starting-style
---

The `drawer` system styles elements as edge-sliding panels. Works with both `<dialog>` and the Popover API.

Two common patterns:

```html
<!-- With <dialog> + showModal(): built-in focus trapping, backdrop -->
<dialog class="drawer drawer-bottom drawer-animated">...</dialog>

<!-- With <dialog popover="auto">: light-dismiss + focus trapping + drawer-modal for background blocking -->
<dialog popover="auto" class="drawer-modal drawer drawer-bottom drawer-animated">...</dialog>
```

> **`<dialog popover="auto">`** gives you light-dismiss (click outside to close) plus the `<dialog>` element's built-in focus trapping. Combine with `drawer-modal` to prevent background clicks/links/hovers.

---

## `drawer-*` — Color setter

Sets `--drawer-color` from any theme color, with optional alpha modifier. Same pattern as `dialog-*`.

| Class             | `--drawer-color` |
| ----------------- | ---------------- |
| `drawer-primary`  | primary color    |
| `drawer-error/50` | 50% alpha error  |

---

## `drawer` — Base styles

```html
<dialog popover="auto" class="drawer">...</dialog>
```

### Defaults

| Property            | Default                               |
| ------------------- | ------------------------------------- |
| `--drawer-bg`       | `var(--drawer-color, transparent)`    |
| `--drawer-fg`       | `var(--color-contrast, currentColor)` |
| `--drawer-duration` | `700ms`                               |
| `::backdrop`        | `oklch(0% 0 0 / 0.2)`                 |

### Opening

```html
<button commandfor="my-drawer" command="show-popover">Open</button>
<dialog id="my-drawer" popover="auto" class="drawer">...</dialog>
```

---

## `drawer-modal`

Prevents interaction with background content. Same behavior as `dialog-modal` — use with `popover="auto"` for light-dismiss that blocks background clicks/links/hovers.

```html
<dialog popover="auto" class="drawer-modal drawer">...</dialog>
```

---

## `drawer-animated`

Spring-based entry/exit animations. Slides in from the edge direction, slides out in reverse.

```html
<dialog popover="auto" class="drawer drawer-animated">...</dialog>
```

---

## Position variants

### `drawer-top`

Slides down from the top, full viewport width:

```html
<dialog popover="auto" class="drawer drawer-top drawer-animated">...</dialog>
```

| Property          | Value                                        |
| ----------------- | -------------------------------------------- |
| `--drawer-origin` | `top center`                                 |
| `--drawer-w`      | `100dvw`                                     |
| `--drawer-top`    | `var(--drawer-offset, 0rem)`                 |
| Animation         | `starting:-translate-y-2 starting:opacity-0` |

### `drawer-bottom`

Slides up from the bottom, full viewport width (bottom sheet pattern):

```html
<dialog popover="auto" class="drawer drawer-bottom drawer-animated">...</dialog>
```

### `drawer-left`

Slides in from the left, full viewport height:

```html
<dialog popover="auto" class="drawer drawer-left drawer-animated">...</dialog>
```

| Property          | Value                                        |
| ----------------- | -------------------------------------------- |
| `--drawer-origin` | `0` (left edge)                              |
| `--drawer-h`      | `100dvh`                                     |
| Animation         | `starting:-translate-x-2 starting:opacity-0` |

### `drawer-right`

Slides in from the right, full viewport height:

```html
<dialog popover="auto" class="drawer drawer-right drawer-animated">...</dialog>
```

---

## `drawer-offset-*`

Controls the distance from the edge. Same pattern as `dialog-offset-*`:

```html
<dialog popover="auto" class="drawer drawer-bottom drawer-offset-4">...</dialog>
```

---

## Full example

```html
<button class="btn btn-primary" commandfor="demo-drawer" command="show-popover">Open Drawer</button>

<dialog id="demo-drawer" popover="auto" class="drawer-modal drawer drawer-bottom scroll-lock drawer-animated drawer-info">
  <div class="card h-[calc(100vh-2rem)]">
    <div class="card-body">
      <h2 class="card-title">Drawer</h2>
      <p>Click outside or press Escape to close.</p>
      <div class="card-action justify-end">
        <button class="btn btn-primary" commandfor="demo-drawer" command="hide-popover">Close</button>
      </div>
    </div>
  </div>
</dialog>
```

> **Tip**: Combine with `scroll-lock` to lock page scroll. Use `card h-[calc(100vh-2rem)]` to give the drawer a fixed height with breathing room.
