---
title: Avatar
description: The avatar component — circular image container with group stacking, fallback text, and status indicator.
related:
  title: Related Components
  description: Commonly used with these.
  links:
    - css-utils/api-reference/components/btn
    - css-utils/api-reference/components/card
---

The `avatar` system provides a circular image container with support for groups (stacked with rings), a text fallback for missing images, and a status indicator.

---

## `avatar` — Base container

A grid-based container that stacks its children in the same cell. Images fill the container with `object-cover`.

```html
<div class="avatar">
  <div>
    <img src="user.jpg" alt="User" />
  </div>
</div>
```

> Wrap the `<img>` in a `<div>` to enforce `aspect-square` and proper sizing.

---

## `avatar-group`

Stacks multiple avatars horizontally with a ring between them for visual separation. Uses `--color-bg` (from `bg-*`) for the ring color.

```html
<div class="avatar-group">
  <div class="avatar">
    <div><img src="user1.jpg" /></div>
  </div>
  <div class="avatar">
    <div><img src="user2.jpg" /></div>
  </div>
  <div class="avatar">
    <div><img src="user3.jpg" /></div>
  </div>
</div>
```

---

## `avatar-fallback`

Centers text content when no image is available. Grid-based centering.

```html
<div class="avatar">
  <div class="avatar-fallback bg-primary text-contrast">
    <span>JD</span>
  </div>
</div>
```

---

## Status indicator (float + status)

Use `float-bottom-end` and `status` together for online/offline badges. Adjust with `mr-*`/`mb-*` margins to fine-tune position.

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

> The `float-bottom-end` sits at the bottom-right outside the wrapper. Negative margins (`mr-2 mb-2`) pull it back inside to sit at the corner of the avatar.

---

## Full example

```html
<!-- Single avatar with status -->
<div class="avatar size-12">
  <div>
    <img class="mask mask-squircle" src="user.jpg" alt="Jane Doe" />
    <div class="float-bottom-end mr-2 mb-2">
      <span class="status status-ring status-sm status-success"></span>
    </div>
  </div>
</div>

<!-- Initials fallback -->
<div class="avatar">
  <div class="avatar-fallback bg-primary text-contrast">
    <span class="font-bold">JD</span>
  </div>
</div>

<!-- Group -->
<div class="avatar-group">
  <div class="avatar">
    <div><img src="a.jpg" /></div>
  </div>
  <div class="avatar">
    <div><img src="b.jpg" /></div>
  </div>
  <div class="avatar avatar-fallback bg-neutral text-contrast">
    <span>+3</span>
  </div>
</div>
```
