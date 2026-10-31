---
title: Icon
description: The icon component — applied directly to SVG elements to inherit color and match surrounding text size.
---

The `icon` utility is applied directly to `<svg>` elements. It sizes to `1em` (matching the font size), inherits text color via `currentColor`, and aligns vertically with surrounding text.

## `icon`

```css
@utility icon {
  @layer components.l1.l2.l3 {
    @apply inline-block size-[1em] min-h-lh shrink-0 align-middle leading-[1em] text-current;
  }
}
```

### Usage

```html
<!-- Standalone icon -->
<svg class="icon">...</svg>

<!-- Inline with text -->
<button class="btn btn-primary">
  <svg class="icon">...</svg>
  Save
</button>

<!-- In a link -->
<a href="/settings" class="btn btn-ghost btn-sm">
  <svg class="icon">...</svg>
  Settings
</a>
```

> **Tip**: Since `icon` inherits `currentColor`, it automatically matches the parent's text color — no need to set a separate color class on the icon itself.
