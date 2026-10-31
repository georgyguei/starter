---
title: Anchor Visibility
description: Conditionally hide anchor-positioned elements using position-visibility.
related:
  title: Related
  description: Fallback options are often a better alternative to hiding.
  links:
    - css-utils/anchor-positioning/fallback
    - css-utils/anchor-positioning/positioning
---

The `position-visibility` property lets you **conditionally hide** an anchor-positioned element in specific situations — for example, when its anchor has scrolled offscreen or when the positioned element overflows the viewport.

> **Important**: In most cases, using [fallback options](/docs/css-utils/anchor-positioning/fallback) to reposition the element is preferable to hiding it. Use `position-visibility` only when hiding is the right UX choice.

## `position-visibility`

### Syntax

```css
position-visibility: always; /* Never hide (default-like behavior) */
position-visibility: anchors-valid; /* Hide if anchor reference is invalid */
position-visibility: anchors-visible; /* Hide if anchor is fully hidden */
position-visibility: no-overflow; /* Hide if element overflows */
```

### Values

| Value             | Behavior                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| `always`          | The positioned element is **always** displayed.                                                      |
| `anchors-valid`   | **Strongly hidden** if `position-anchor` doesn't point to a valid anchor element.                    |
| `anchors-visible` | **Strongly hidden** if the anchor is completely hidden (overflowed, covered, `display: none`, etc.). |
| `no-overflow`     | **Strongly hidden** if the positioned element starts to overflow its containing block or viewport.   |

> **Default**: `anchors-visible` is the default value in the specification (though browser implementations may vary).

### What "strongly hidden" means

When hidden via `position-visibility`, the element acts as if it (and all its descendants) has `visibility: hidden` — regardless of their actual `visibility` value. The element is not painted, not interactive, and takes up no space in layout.

### Usage

```css
.infobox {
  position: fixed;
  position-anchor: --my-anchor;
  position-area: top span-all;
  position-visibility: no-overflow;
}
```

### When to use each value

| Situation                                           | Use               |
| --------------------------------------------------- | ----------------- |
| Tooltip should vanish when its trigger scrolls away | `anchors-visible` |
| Element should never render if anchor doesn't exist | `anchors-valid`   |
| Element should disappear rather than overflow       | `no-overflow`     |
| Always show regardless of context                   | `always`          |

> **Note**: You cannot associate a positioned element with an anchor that is hidden (e.g., `display: none`, `visibility: hidden`, or `content-visibility: hidden` on a parent). The positioned element simply won't display.
