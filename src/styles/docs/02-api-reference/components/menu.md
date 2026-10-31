---
title: Menu
description: The menu component — a vertical or horizontal list of interactive items with hover/active states, dividers, titles, and disabled items.
related:
  title: Related
  description: Combine with these components.
  links:
    - css-utils/api-reference/components/btn
    - css-utils/api-reference/components/collapse
---

The `menu` component is a structured list of interactive items — links, buttons, radio groups, or `<details>` elements. It uses `color-contrast` on `--menu-color` for accessible theming and supports nested sub-menus with ruled dividers.

## `menu-*` — Color setter

Sets `--menu-color` from any theme color. Defaults to `var(--color-neutral)` when no color is specified.

| Class            | Effect                       |
| ---------------- | ---------------------------- |
| `menu-primary`   | Primary background           |
| `menu-secondary` | Secondary background         |
| `menu-neutral`   | Neutral background (default) |
| (none)           | `var(--color-neutral)`       |

---

## `menu` — Base styles

```html
<ul class="menu">
  <li><a>Item 1</a></li>
  <li><a>Item 2</a></li>
  <li><a>Item 3</a></li>
</ul>
```

### Defaults

| Property    | Default                                   |
| ----------- | ----------------------------------------- |
| Layout      | `inline-flex flex-col`                    |
| Padding     | `0.5rem`                                  |
| Font size   | `0.875rem`                                |
| `--menu-bg` | `var(--menu-color, var(--color-neutral))` |
| `--menu-fg` | `var(--color-neutral-content)`            |

### Item styling

Items (`<a>`, `<button>`, `<summary>`) are styled as a grid row:

- `grid-flow-col` with `auto-cols-[minmax(auto,max-content)_auto_max-content]`
- `rounded-md` with `p-(--menu-padding, 0.375rem 0.75rem)`
- Semi-bold, select-none, cursor-pointer
- Inactive items have transparent background; active/hover items get `--menu-bg` fill + shadow

### Nested sub-menus

```html
<ul class="menu">
  <li>
    <details>
      <summary>Parent</summary>
      <ul>
        <li><a>Child 1</a></li>
        <li><a>Child 2</a></li>
      </ul>
    </details>
  </li>
</ul>
```

Sub-menus (`li ul`) get a left indent (`ms-4 ps-2`) with a thin ruled line (`::before` pseudo, 1px wide at 10% opacity).

### Dividers

Empty `<li>` elements render as horizontal rules:

```html
<ul class="menu">
  <li><a>Above</a></li>
  <li></li>
  <!-- divider -->
  <li><a>Below</a></li>
</ul>
```

### Disabled items

Items with `disabled`, `[disabled]`, or `[aria-disabled="true"]` — or `<li>` elements with class `menu-disabled` — become `pointer-events-none` with muted foreground (20% opacity).

---

## `menu-active`

Forces the active/hover appearance on an item — background fill, shadow, and noise.

```html
<ul class="menu">
  <li><a class="menu-active">Currently selected</a></li>
  <li><a>Other item</a></li>
</ul>
```

---

## `menu-title`

A non-interactive section header — muted, bold, with extra padding.

```html
<ul class="menu">
  <li class="menu-title">Section One</li>
  <li><a>Item</a></li>
</ul>
```

| Property  | Value                                                     |
| --------- | --------------------------------------------------------- |
| Color     | `var(--color-base-content)` at 40% opacity                |
| Weight    | `bold`                                                    |
| Font size | `0.875rem`                                                |
| Padding   | `0.75rem 0.5rem` (configurable via `--menutitle-padding`) |

---

## Layout modes

### `menu-vertical` (default)

Items stack vertically.

```html
<ul class="menu menu-vertical">
  ...
</ul>
```

### `menu-horizontal`

Items flow in a row — useful for nav bars and tab strips.

```html
<ul class="menu menu-horizontal">
  <li><a>Home</a></li>
  <li><a>About</a></li>
  <li><a>Contact</a></li>
</ul>
```

---

## Usage patterns

### Radio group menu

```html
<ul class="menu">
  <li>
    <label>
      <input type="radio" name="sort" checked />
      Newest first
    </label>
  </li>
  <li>
    <label>
      <input type="radio" name="sort" />
      Oldest first
    </label>
  </li>
</ul>
```

### Dropdown menu (popover + menu)

Combine `popover` and `menu` for a dropdown. Radio inputs give you native keyboard navigation; customize any `<li>` with a color utility like `menu-error`.

```html
<button type="button" commandfor="menu-1" command="show-popover" class="btn w-2xs">Open menu</button>
<div class="popover popover-bottom-start w-anchor popover-animated" id="menu-1" popover="auto">
  <ul class="menu w-full rounded-lg border border-base-300 bg-base-100">
    <li>
      <label>
        <input type="radio" name="menu-1" value="edit" />
        Edit
      </label>
    </li>
    <li>
      <label>
        <input type="radio" name="menu-1" value="duplicate" />
        Duplicate
      </label>
    </li>
    <li></li>
    <li class="menu-error not-interest:text-error">
      <label>
        <input type="radio" name="menu-1" value="delete" />
        Delete
      </label>
    </li>
  </ul>
</div>
```

> **Radio vs button**: Radio inputs give you native keyboard navigation (arrow keys, Enter to select) but don't auto-close the popover. Use a `click` + `keydown` listener with `hidePopover()` deferred via `requestAnimationFrame` to avoid the Enter key re-opening the popover via the `commandfor` button. Button items close automatically but require custom keyboard handling.
>
> ```ts
> const handleMenuChange = (event: MouseEvent | KeyboardEvent) => {
>   const input = event.target as HTMLInputElement;
>   if (event.detail === 1 || (event instanceof KeyboardEvent && (event.key === " " || event.key === "Enter"))) {
>     event.preventDefault();
>     // dispatch event or call handler with input.value as key
>     console.log("Menu item selected:", input.value);
>     // Defer so the key event fully resolves before focus moves to the button
>     requestAnimationFrame(() => {
>       document.getElementById("menu-1")?.hidePopover();
>     });
>   }
> };
>
> const menuItems = document.querySelectorAll('input[type="radio"][name="menu-1"]');
> for (const item of menuItems) {
>   item.addEventListener("click", handleMenuChange);
>   item.addEventListener("keydown", handleMenuChange);
> }
> ```
