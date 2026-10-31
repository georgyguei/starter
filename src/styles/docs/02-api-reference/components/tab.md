---
title: Tabs
description: The tabs component system — tab navigation with radio-based or aria-based selection, animated indicator via CSS anchor positioning, and content panels.
related:
  title: Related
  description: Uses CSS anchor positioning for the indicator.
  links:
    - css-utils/anchor-positioning
    - css-utils/api-reference/components/btn
---

The `tabs` system provides tab navigation with an animated indicator that moves between tabs using CSS anchor positioning. Supports radio inputs, `<label>` wrappers, and ARIA attributes for selection state.

## Utilities at a glance

| Utility         | Purpose                                                    |
| --------------- | ---------------------------------------------------------- |
| `tab-*`         | Sets `--tab-color` from theme colors (with alpha modifier) |
| `tabs`          | Base flex container with `anchor-scope`                    |
| `tab`           | Individual tab — radio, label, or ARIA-based               |
| `tab-content`   | Content panel shown when its preceding tab is active       |
| `tab-indicator` | Animated indicator using CSS anchor positioning            |
| `tabs-anchor-*` | Custom anchor name for the indicator (`@property` managed) |
| `tabs-flushed`  | Thin underline indicator variant                           |
| `tabs-box`      | Boxed indicator — fills tab background                     |
| `tabs-lift`     | Lifted tab style with curved bottom corners and borders    |
| `tabs-vertical` | Vertical tab layout (tabs on left, content on right)       |
| `tabs-reverse`  | Flips tab order (end → start) and/or content position      |

## Structure

```
<div class="tabs">
  <!-- Tabs -->
  <input type="radio" name="tabs" class="tab" aria-label="Tab 1" checked />
  <div class="tab-content">Content 1</div>

  <input type="radio" name="tabs" class="tab" aria-label="Tab 2" />
  <div class="tab-content">Content 2</div>

  <!-- Animated indicator -->
  <div class="tab-indicator"></div>
</div>
```

---

## `tab-*` — Color setter

Sets `--tab-color` from any theme color, with optional alpha modifier. Same pattern as `btn-*`:

```css
@utility tab-* {
  --tab-color: --alpha(--value(--color-*, [*]) / --modifier(...) * 1%);
}
@utility tab-* {
  --tab-color: --value(--color-*, [*]);
}
```

| Class          | `--tab-color`   |
| -------------- | --------------- |
| `tab-primary`  | primary color   |
| `tab-error/50` | 50% alpha error |

---

## `tabs` — Base container

Sets up a flex container with `anchor-scope` to scope the indicator's anchor positioning.

```html
<div class="tabs">...</div>
```

### Defaults

| Property         | Default |
| ---------------- | ------- |
| `--tab-duration` | `400ms` |
| `--tab-height`   | `40px`  |

---

## `tab` — Individual tab

A tab can be an `<input type="radio">` or a `<label>` wrapping a hidden input. Multiple selection states are supported.

### Selection states (any of these activate the tab)

| State                                             | Example                        |
| ------------------------------------------------- | ------------------------------ |
| `:checked`                                        | Radio input is checked         |
| `label:has(:checked)`                             | Label wrapping a checked input |
| `.tab-active`                                     | Explicit active class          |
| `[aria-selected="true"]`                          | ARIA attribute                 |
| `[aria-current="true"]` / `[aria-current="page"]` | ARIA current                   |

When active, the tab becomes the anchor for the indicator via `anchor-name: var(--tab-indicator-anchor)`.

### Active vs inactive

| State    | Text color                       |
| -------- | -------------------------------- |
| Active   | Full current color               |
| Inactive | 50% opacity mix of current color |

### Usage

```html
<!-- Radio-based -->
<input type="radio" name="my-tabs" class="tab" aria-label="Tab 1" checked />

<!-- Label-based -->
<label class="tab">
  <input type="radio" name="my-tabs" />
  Tab 1
</label>

<!-- ARIA-based -->
<button class="tab-active tab" role="tab" aria-selected="true">Tab 1</button>
```

---

## `tab-content`

A content panel that's `display: none` by default and shown when its **preceding sibling** tab is active.

```html
<input type="radio" name="tabs" class="tab" aria-label="Tab 1" checked />
<div class="tab-content">
  <p>Content for Tab 1</p>
</div>
```

| Property              | Default            |
| --------------------- | ------------------ |
| `--tabcontent-radius` | `var(--radius-md)` |
| `--tabcontent-order`  | `1`                |

> **Important**: `tab-content` must be the **immediate next sibling** (`+ .tab-content`) of the tab that controls it.

---

## `tab-indicator`

An absolutely-positioned element that moves between active tabs using CSS anchor positioning. Uses `position-anchor`, `anchor()`, and `anchor-size()` to track the active tab's position and dimensions. Transitions smoothly with a spring easing curve.

```html
<div class="tab-indicator"></div>
```

### How it works

The indicator is:

- `position: fixed` with `position-anchor: var(--tab-indicator-anchor)`
- `top: anchor(top)` / `left: anchor(left)` — follows the active tab
- `width: anchor-size(width)` / `height: anchor-size(height)` — matches the active tab's size
- Animated with `1550ms var(--ease-spring-soft)` spring transition

### Customizing the anchor name

By default, the anchor name is `--tab-indicator-anchor`. Change it with `tabs-anchor-*`:

```html
<div class="tabs tabs-anchor-[--my-anchor]">...</div>
```

This is managed via a `@property` rule so it can be typed and inherited.

---

## `tabs-flushed`

A variant that replaces the full indicator with a thin underline (3px height, 80% width of the tab). Useful for minimal tab designs.

```html
<div class="tabs tabs-flushed">
  <input type="radio" name="tabs" class="tab" aria-label="Tab 1" checked />
  <input type="radio" name="tabs" class="tab" aria-label="Tab 2" />
  <div class="tab-indicator"></div>
</div>
```

### With `tabs-reverse`

Flips the indicator to the top edge instead of bottom:

```html
<div class="tabs tabs-flushed tabs-reverse">...</div>
```

### Vertical tabs with flushed indicator

```html
<div class="tabs tabs-flushed tabs-vertical">...</div>
```

---

## `tabs-lift`

A lifted tab style where the active tab has curved bottom corners and a border, visually connecting it to the content panel below. Uses `radial-gradient` corners and border stitching for a seamless look:

```html
<div class="tabs-lift tabs">
  <input type="radio" name="tabs" class="tab" aria-label="Tab 1" checked />
  <input type="radio" name="tabs" class="tab" aria-label="Tab 2" />
  <div class="tab-indicator"></div>
</div>
```

### Defaults

| Property             | Default                 |
| -------------------- | ----------------------- |
| `--tab-border-width` | `var(--border, 1px)`    |
| `--tab-border-color` | `var(--color-base-300)` |

### With `tabs-reverse`

Lifts the tab from the bottom edge instead of the top:

```html
<div class="tabs-lift tabs tabs-reverse">...</div>
```

### Vertical lift

```html
<div class="tabs-lift tabs tabs-vertical">...</div>
```

---

## `tabs-box`

A boxed variant where the indicator fills the tab's background, providing a solid highlight behind the active tab text:

```html
<div class="tabs tabs-box">
  <input type="radio" name="tabs" class="tab" aria-label="Tab 1" checked />
  <input type="radio" name="tabs" class="tab" aria-label="Tab 2" />
  <div class="tab-indicator"></div>
</div>
```

---

## `tabs-vertical`

Stacks tabs vertically on the left with content panels on the right. Uses CSS Grid (`grid-template-columns: auto 1fr`) for layout:

```html
<div class="tabs tabs-vertical">
  <input type="radio" name="tabs" class="tab" aria-label="Tab 1" checked />
  <div class="tab-content">Content 1</div>

  <input type="radio" name="tabs" class="tab" aria-label="Tab 2" />
  <div class="tab-content">Content 2</div>

  <div class="tab-indicator"></div>
</div>
```

Compatible with `tabs-flushed`, `tabs-lift`, and `tabs-reverse`.

---

## `tabs-reverse`

Reverses the visual order of tabs and/or the content panel position:

- **Horizontal**: tabs align to the end (right in LTR), content panel appears above tabs
- **Vertical**: tabs move to the right column, content moves to the left

```html
<div class="tabs tabs-reverse">...</div>
<div class="tabs tabs-flushed tabs-reverse">...</div>
<div class="tabs tabs-vertical tabs-reverse">...</div>
```

---

## Full example (flushed)

```html
<div class="tabs tabs-flushed">
  <input type="radio" name="demo" class="tab" aria-label="Account" checked />
  <div class="tab-content p-4">
    <p>Account settings content.</p>
  </div>

  <input type="radio" name="demo" class="tab" aria-label="Password" />
  <div class="tab-content p-4">
    <p>Password change form.</p>
  </div>

  <div class="tab-indicator"></div>
</div>
```
