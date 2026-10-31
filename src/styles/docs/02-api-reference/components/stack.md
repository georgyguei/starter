---
title: Stack
description: The stack component — layered cards with a 5×5 CSS Grid, z-index stacking, and directional offsets for the top card.
related:
  title: Related
  description: Use with these components.
  links:
    - css-utils/api-reference/components/card
    - css-utils/api-reference/components/avatar
---

The `stack` component layers up to 3 child elements as overlapping cards using a 5×5 CSS Grid. **Always pair `stack` with a directional variant** — `stack` alone sets up the grid and z-index but doesn't offset the cards.

## Quick reference

| Utility        | Role                                                    |
| -------------- | ------------------------------------------------------- |
| `stack`        | **Required base** — 5×5 grid, z-index, opacity layering |
| `stack-top`    | Top card offset upward                                  |
| `stack-bottom` | Top card offset downward                                |
| `stack-start`  | Top card offset to start                                |
| `stack-end`    | Top card offset to end                                  |

> `stack` must always be paired with an offset: `stack stack-top`, `stack stack-bottom`, etc.

---

## `stack` — Required base + offset

Always pair `stack` with a directional variant.

```html
<div class="stack stack-bottom">
  <div class="card bg-primary p-4 text-primary-content">Top</div>
  <div class="card bg-primary p-4 text-primary-content">Middle</div>
  <div class="card bg-primary p-4 text-primary-content">Bottom</div>
</div>
```

### How it works

```
┌─────────────────────────┐
│  5×5 grid               │
│  ┌─┬─┬─┬─┬─┐            │
│  ├─┼─┼─┼─┼─┤  1st child │  ← z-3, 100% opacity, spans all
│  ├─┼─┼─┼─┼─┤  2nd child │  ← z-2, 90% opacity, spans center
│  ├─┼─┼─┼─┼─┤  3rd+      │  ← z-1, 70% opacity, spans center
│  └─┴─┴─┴─┴─┘            │
└─────────────────────────┘
```

| Child | z-index | Opacity | Default position     |
| ----- | ------- | ------- | -------------------- |
| 1st   | 3       | 100%    | Full grid (1/6, 1/6) |
| 2nd   | 2       | 90%     | Center (2/5, 2/5)    |
| 3rd+  | 1       | 70%     | Center (3/4, 3/4)    |

---

## Directional variants

The `stack-*` variants shift the top card while keeping the middle and bottom cards centered.

### `stack-top`

Top card shifts upward.

```html
<div class="stack stack-top">
  <div class="card">Top</div>
  <div class="card">Middle</div>
  <div class="card">Bottom</div>
</div>
```

### `stack-bottom`

Top card shifts downward.

```html
<div class="stack stack-bottom">...</div>
```

### `stack-start`

Top card shifts to the start (left in LTR, right in RTL).

```html
<div class="stack stack-start">...</div>
```

### `stack-end`

Top card shifts to the end.

```html
<div class="stack stack-end">...</div>
```

---

## Usage patterns

### Avatar group stack

```html
<div class="stack stack-bottom">
  <img class="mask mask-squircle" src="user1.jpg" />
  <img class="mask mask-squircle" src="user2.jpg" />
  <img class="mask mask-squircle" src="user3.jpg" />
</div>
```

### Card stack

```html
<div class="stack stack-bottom w-64">
  <div class="card bg-base-200 p-4 shadow-lg">Front card</div>
  <div class="shadow card bg-base-200 p-4"></div>
  <div class="shadow card bg-base-200 p-4"></div>
</div>
```
