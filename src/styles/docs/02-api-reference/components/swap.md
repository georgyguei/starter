---
title: Swap
description: The swap component — a multi-state toggle using hidden radio inputs to cycle between content elements, with fade, rotate, flip, and slide animation variants.
related:
  title: Related
  description: Combine with these components.
  links:
    - css-utils/api-reference/components/btn
    - css-utils/api-reference/components/icon
---

The `swap` component cycles between content states using hidden `<input type="radio">` elements. Only the content after the checked radio is visible — the rest are hidden. Supports N states with automatic wrap-around from last back to first.

## Structure

Each radio is followed by exactly one content element. All radios share the same `name`:

```html
<!-- 2-state -->
<div class="swap swap-fade">
  <input type="radio" name="theme" checked />
  <span>🌙</span>
  <input type="radio" name="theme" />
  <span>☀️</span>
</div>

<!-- 3-state -->
<div class="swap swap-rotate">
  <input type="radio" name="size" checked />
  <span>S</span>
  <input type="radio" name="size" />
  <span>M</span>
  <input type="radio" name="size" />
  <span>L</span>
</div>
```

---

## `swap` — Base container

Sets up the grid layout, hides all content by default, and reveals the element immediately after the checked input via `input:checked + *`.

```css
@utility swap {
  @layer components.l1.l2.l3 {
    @apply relative grid place-content-center align-middle;
  }
}
```

### How it works

| Rule                                                      | Effect                                         |
| --------------------------------------------------------- | ---------------------------------------------- |
| `&> :not(input)`                                          | All content hidden via `visibility: hidden`    |
| `&>input:checked+*`                                       | Content after checked input becomes visible    |
| `&>input:checked { z-index: 0; pointer-events: none; }`   | Checked input disabled from interaction        |
| `&>input:checked+*+input { z-index: 10; }`                | Next input becomes the click target            |
| `&:has(input:last-of-type:checked) > input:first-of-type` | Wrap-around: last checked → first input active |

---

## Animation variants

Each variant handles its own visual transition on top of the base visibility toggling. All use a default duration of 700ms with `var(--ease)`.

### `swap-fade`

Fades with a slight scale. The inactive state scales down to 95% and fades to `opacity: 0`.

```html
<div class="swap swap-fade">
  <input type="radio" name="mode" checked />
  <span>🌙</span>
  <input type="radio" name="mode" />
  <span>☀️</span>
</div>
```

### `swap-rotate`

Rotates elements 45deg when inactive, snapping to 0deg when active.

```html
<div class="swap swap-rotate">...</div>
```

### `swap-flip`

3D card flip effect. Inactive elements rotate 180deg on the Y axis. Parent needs `perspective: 20rem` and children have `backface-visibility: hidden`.

```html
<div class="swap swap-flip">...</div>
```

### `swap-slide`

Slides elements 50% downward when inactive, snapping to original position when active.

```html
<div class="swap swap-slide">...</div>
```
