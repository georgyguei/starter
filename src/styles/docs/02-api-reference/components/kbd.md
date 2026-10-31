---
title: Kbd
description: The kbd component — a keyboard key visual for documenting shortcuts and key combinations.
related:
  title: Related
  description: Use alongside these components.
  links:
    - css-utils/api-reference/components/btn
    - css-utils/api-reference/components/badge
---

The `kbd` component renders a keyboard key visual. It uses a traditional CSS class (not `@utility`) with five size variants.

> **Not a utility**: Unlike most components, `kbd` uses plain CSS class selectors (`.kbd`, `.kbd-xs`, etc.) rather than `@utility`. This means they don't participate in Tailwind's utility layer — but they work identically in practice.

## `.kbd` — Base styles

```html
<kbd class="kbd">⌘</kbd> <span class="kbd">Ctrl</span>
```

### Defaults

| Property   | Default                                                 |
| ---------- | ------------------------------------------------------- |
| `--size`   | `calc(var(--spacing) * 6)` (24px)                       |
| Background | `var(--color-base-200)`                                 |
| Border     | Semi-transparent base-content (20%) with a `border-b-2` |
| Shape      | `rounded-lg`                                            |
| Font size  | `0.875rem`                                              |

---

## Size variants

| Class     | Height | Font size  |
| --------- | ------ | ---------- |
| `.kbd-xs` | 16px   | `text-2xs` |
| `.kbd-sm` | 20px   | `text-xs`  |
| `.kbd-md` | 24px   | `text-sm`  |
| `.kbd-lg` | 28px   | `text-md`  |
| `.kbd-xl` | 32px   | `text-lg`  |

```html
<kbd class="kbd kbd-sm">⌘</kbd> <kbd class="kbd kbd-lg">Ctrl</kbd>
```

---

## Usage patterns

### Key combination

```html
<kbd class="kbd">⌘</kbd> + <kbd class="kbd">K</kbd>
```

### Inline with text

```html
<p>Press <kbd class="kbd kbd-sm">Enter</kbd> to submit.</p>
```

### In a shortcut hint

```html
<span class="flex items-center gap-1 text-xs text-base-content/60">
  <kbd class="kbd kbd-xs">⌘</kbd>
  <kbd class="kbd kbd-xs">S</kbd>
</span>
```
