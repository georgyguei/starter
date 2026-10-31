---
title: Mask
description: The mask component — clips images and elements into geometric shapes using CSS mask-image with inline SVG data URIs.
related:
  title: Related
  description: Use with these components.
  links:
    - css-utils/api-reference/components/avatar
    - css-utils/api-reference/components/card
---

The `mask` component uses CSS `mask-image` to clip `<img>` or other elements into geometric shapes. Apply `mask` + a shape utility to any element.

## Quick reference

| Utility          | Shape                                                                               |
| ---------------- | ----------------------------------------------------------------------------------- |
| `mask`           | Base — sets `mask-size: contain`, `mask-repeat: no-repeat`, `mask-position: center` |
| `mask-half-1`    | Left half                                                                           |
| `mask-half-2`    | Right half                                                                          |
| `mask-squircle`  | Squircle                                                                            |
| `mask-circle`    | Circle                                                                              |
| `mask-diamond`   | Diamond                                                                             |
| `mask-triangle`  | Triangle (upward)                                                                   |
| `mask-pentagon`  | Pentagon                                                                            |
| `mask-hexagon`   | Hexagon (vertical)                                                                  |
| `mask-hexagon-2` | Hexagon (horizontal)                                                                |
| `mask-decagon`   | Decagon                                                                             |
| `mask-star`      | 5-point star                                                                        |
| `mask-star-2`    | 4-point star                                                                        |
| `mask-heart`     | Heart                                                                               |

---

## `mask` — Base

Required on any masked element. Sets the mask to `contain` + `center` + `no-repeat`.

```html
<img class="mask mask-squircle" src="avatar.jpg" />
```

---

## Half masks

Split an image into two halves. Useful for two-tone effects or split avatars.

```html
<img class="mask mask-half-1" src="avatar.jpg" /> <img class="mask mask-half-2" src="avatar.jpg" />
```

| Utility       | Visible half | RTL support      |
| ------------- | ------------ | ---------------- |
| `mask-half-1` | Left         | `rtl:mask-right` |
| `mask-half-2` | Right        | `rtl:mask-left`  |

---

## Shape reference

### `mask-squircle`

```
 ╭─────╮
 │     │
 │     │
 ╰─────╯
```

```html
<img class="mask mask-squircle" src="avatar.jpg" />
```

### `mask-circle`

```html
<img class="mask mask-circle" src="avatar.jpg" />
```

### `mask-diamond`

```html
<img class="mask mask-diamond" src="avatar.jpg" />
```

### `mask-triangle`

```html
<img class="mask mask-triangle" src="avatar.jpg" />
```

### `mask-pentagon`

```html
<img class="mask mask-pentagon" src="avatar.jpg" />
```

### `mask-hexagon` / `mask-hexagon-2`

```html
<img class="mask mask-hexagon" src="avatar.jpg" /> <img class="mask mask-hexagon-2" src="avatar.jpg" />
```

### `mask-decagon`

```html
<img class="mask mask-decagon" src="avatar.jpg" />
```

### `mask-star` / `mask-star-2`

```html
<img class="mask mask-star" src="avatar.jpg" /> <img class="mask mask-star-2" src="avatar.jpg" />
```

### `mask-heart`

```html
<img class="mask mask-heart" src="avatar.jpg" />
```

---

## Styling masked elements

The mask only clips — you still control size, borders, and shadows:

```html
<img class="mask size-24 mask-hexagon shadow-lg" src="avatar.jpg" /> <img class="mask size-16 mask-star outline outline-2 outline-primary" src="avatar.jpg" />
```
