---
title: Join
description: The join component — groups items (buttons, inputs, badges) with merged borders and automatic corner radius on the first and last item.
related:
  title: Related Components
  description: Commonly used with these components.
  links:
    - css-utils/api-reference/components/btn
    - css-utils/api-reference/components/card
---

The `join` component groups sibling elements into a single visual unit — like a button group, input group, or badge cluster. Borders between items are merged (no double borders), and corner radius is automatically applied only to the first and last item.

## How it works

The parent `.join` sets `--join-ss`, `--join-se`, `--join-es`, `--join-ee` (start/end corners) on its child **slots** via `:nth-child()` selectors. These custom properties inherit down to `.join-item` elements, which apply them as `border-*-*-radius`. Negative margins between slots merge adjacent borders.

```
┌──────┬──────┬──────┐
│ btn  │ btn  │ btn  │   ← first gets left radius, last gets right radius
└──────┴──────┴──────┘   ← middle items are flat, borders merged
```

### Slot detection

A "slot" is any direct child that either **is** a `.join-item` or **contains** one (`:has(.join-item)`). This means wrapped items (e.g., a tooltip wrapping a button) still participate correctly.

---

## `join` — Base container

```html
<div class="join">
  <button class="btn join-item">1</button>
  <button class="btn btn-active join-item">2</button>
  <button class="btn join-item">3</button>
</div>
```

### Defaults

| Property        | Default   |
| --------------- | --------- |
| `--join-radius` | `0.25rem` |
| `--join-border` | `1px`     |

### Usage with inputs

```html
<div class="join">
  <input class="input join-item" placeholder="Search..." />
  <button class="btn join-item btn-primary">Go</button>
</div>
```

---

## `join-vertical`

Stacks items vertically instead of horizontally. Adjusts corner radius to top/bottom instead of left/right:

```html
<div class="join join-vertical">
  <button class="btn join-item">Top</button>
  <button class="btn join-item">Middle</button>
  <button class="btn join-item">Bottom</button>
</div>
```

---

## `join-item`

Marks an element as a join participant. Its border-radius is controlled by the parent `.join` via inherited custom properties.

```html
<button class="btn join-item">...</button>
<input class="input join-item" />
<span class="badge join-item">...</span>
```

> **Disabled items**: A disabled `.join-item` keeps its own left border instead of collapsing it, so it remains visually distinct.

---

## `join-rounded-*`

Sets `--join-radius` from the `--radius-*` theme scale or an arbitrary value. Apply to the `.join` parent:

```html
<div class="join join-rounded-lg">
  <button class="btn join-item">1</button>
  <button class="btn join-item">2</button>
</div>

<div class="join join-rounded-[0.5rem]">...</div>
```

| Class                 | Radius     |
| --------------------- | ---------- |
| `join-rounded-xs`     | `0.125rem` |
| `join-rounded-md`     | `0.375rem` |
| `join-rounded-lg`     | `0.5rem`   |
| `join-rounded-[1rem]` | `1rem`     |

---

## Wrapped items (with `:has()`)

If a join item is wrapped in another element (e.g., a tooltip), the `:has(.join-item)` selector still detects it:

```html
<div class="join">
  <button class="btn join-item">1</button>

  <!-- Tooltip wrapping a button — still detected as a slot -->
  <div class="tooltip" data-tip="Settings">
    <button class="btn join-item">⚙</button>
  </div>

  <button class="btn join-item">3</button>
</div>
```

> **How it works**: The slot selector `> :where(.join-item, :has(.join-item))` matches the wrapper `<div>`, and the `--join-*` custom properties inherit through it down to the nested `.join-item`.
