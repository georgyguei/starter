---
title: Float
description: The float component — position elements outside a wrapper at any of 9 anchor points. Uses inset-based alignment (not transforms) for full anchor positioning compatibility.
related:
  title: Related
  description: Use with these positioning systems.
  links:
    - css-utils/anchor-positioning/overview
    - css-utils/api-reference/components/popover
    - css-utils/api-reference/components/tooltip
---

The `float` component positions an absolutely positioned element outside its relative wrapper at one of 9 points — 8 perimeter positions plus dead center. It uses `inset`-based alignment (`align-self`/`justify-self`) rather than transforms, making it fully compatible with CSS anchor positioning.

## Quick reference

```
        top-start    top-center    top-end
              ┌─────────────────────┐
              │                     │
              │                     │
 middle-start │    middle-center    │ middle-end
              │                     │
              │                     │
              └─────────────────────┘
     bottom-start  bottom-center  bottom-end
```

| Utility               | Position              |
| --------------------- | --------------------- |
| `float-top-start`     | Top-left outside      |
| `float-top-center`    | Top-center outside    |
| `float-top-end`       | Top-right outside     |
| `float-middle-start`  | Center-left outside   |
| `float-middle-center` | Dead center           |
| `float-middle-end`    | Center-right outside  |
| `float-bottom-start`  | Bottom-left outside   |
| `float-bottom-center` | Bottom-center outside |
| `float-bottom-end`    | Bottom-right outside  |

---

## How it works

Each utility sets:

1. `absolute` — removes from flow, positions relative to the wrapper
2. `inset: 0` — the alignment box spans the full wrapper
3. Negative insets (`-top-full`, `-left-full`, etc.) — pushes the element outside along the chosen side
4. `self-center justify-self-center` — centers the element along the perpendicular axis

For `float-middle-center`, all insets are `0` — the element sits exactly at the wrapper's center.

```html
<div class="relative h-40 w-40 bg-neutral">
  <div class="float-top-center h-5 w-5 bg-primary" />
</div>
```

> **Requires `relative` on the wrapper**. The float uses absolute positioning, so the wrapper must establish a containing block.

---

## Fine-tuning with margin

Margins move the float relative to its alignment position. A margin in the **opposite** direction of the float side pushes it back toward (or into) the wrapper.

| Float side | Push inward with | Effect                     |
| ---------- | ---------------- | -------------------------- |
| `top-*`    | `mb-*`           | Pulls down toward wrapper  |
| `bottom-*` | `mt-*`           | Pulls up toward wrapper    |
| `*-start`  | `mr-*`           | Pulls right toward wrapper |
| `*-end`    | `ml-*`           | Pulls left toward wrapper  |

**Example**: a 20px (`h-5 w-5`) badge outside the top edge, nudged to sit flush with the wrapper:

```html
<div class="relative h-40 w-40 bg-neutral">
  <!-- Pushed inside the wrapper by its own height -->
  <div class="float-top-center mt-5 h-5 w-5 bg-primary" />
</div>
```

**Example**: corner badge shifted 4px off the exact corner:

```html
<div class="relative h-40 w-40 bg-neutral">
  <div class="float-top-end mt-2 mr-2 h-5 w-5 bg-error" />
</div>
```

> `margin` gives full control without transforms — unlike `translate`, margins don't create a new stacking context and don't interfere with anchor positioning's `anchor()` / `anchor-size()` functions.

---

## Important

- **`overflow: hidden` on the wrapper clips the float**. Since floats sit outside the wrapper (except `middle-center`), any overflow clipping on the parent container hides them. Use `overflow: visible` (the default) on the wrapper.
- **Wrapper must be `relative`** (or any positioned context) for absolute positioning to work.
- All `middle-*` floats (except `middle-center`) sit to the **left or right** of the wrapper, not inside it.
