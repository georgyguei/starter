# Component Style Guide

## Masonry Gallery

A pure-CSS masonry layout using `column-count`. Ideal for Pinterest-style image galleries, article grids, and any content with natural height variation.

---

### Masonry (`column-count`)

**File:** `masonry.css`

Items flow **top-to-bottom, then left-to-right** (newspaper column order).  
No fixed height required. Works in all modern browsers.

| Utility                        | Purpose                                                      |
| ------------------------------ | ------------------------------------------------------------ |
| `masonry`                      | Base container — responsive columns with default gap         |
| `masonry-cols-{1-6}`           | Explicit column count                                        |
| `masonry-cols-gap-{0,2,4,6,8}` | Gap between columns and rows (0, 0.5rem, 1rem, 1.5rem, 2rem) |
| `masonry-item`                 | Applied to each child — prevents splitting across columns    |

**Example (Pinterest-style gallery):**

```html
<div class="masonry masonry-cols-3 masonry-cols-gap-4">
  <div class="masonry-item">
    <img src="photo.jpg" alt="…" />
    <h3>Title</h3>
    <p>Description</p>
  </div>
  <div class="masonry-item">
    <img src="photo2.jpg" alt="…" />
  </div>
  <!-- … -->
</div>
```

> **Tip:** Images with natural aspect ratios (e.g. `400/500` vs `400/280`) create the staggered Pinterest effect automatically — no JavaScript required.

---

## Expandable

A self-sufficient expand/collapse panel that animates its own height via `grid-template-rows`. Requires JavaScript for the open/close toggle — use the `Expandable` client component.

### CSS Utilities

**File:** `expandable.css`

Unlike `collapse` (which delegates the row animation to a parent grid), `expandable` is self-contained — it IS the grid. This makes it usable anywhere without a coordinating parent.

| Utility           | Purpose                                                     |
| ----------------- | ----------------------------------------------------------- |
| `expandable`      | Collapsed state — `grid-template-rows: 0fr`, content hidden |
| `expandable-open` | Expanded state — `grid-template-rows: 1fr`, content visible |

**Transition details:**

| Property             | Duration | Easing                         | Notes                                                       |
| -------------------- | -------- | ------------------------------ | ----------------------------------------------------------- |
| `grid-template-rows` | 400ms    | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth height animation                                     |
| `content-visibility` | 400ms    | same + `allow-discrete`        | Discrete flip at ~50% — prevents instant vanish on collapse |

### React Component

**File:** `components/expandable.tsx`

```tsx
import { Expandable } from "@/components/expandable";

<Expandable title="Click to expand" defaultOpen={false}>
  <p>Content revealed on expand. Can contain any React nodes — text, images, links, nested components.</p>
  <p className="mt-2">Multiple paragraphs, rich content — all works.</p>
</Expandable>;
```

**Props:**

| Prop          | Type                      | Default  | Purpose               |
| ------------- | ------------------------- | -------- | --------------------- |
| `title`       | `ReactNode`               | required | Clickable header text |
| `children`    | `ReactNode`               | required | Collapsible content   |
| `defaultOpen` | `boolean`                 | `false`  | Start expanded        |
| `onToggle`    | `(open: boolean) => void` | —        | Change callback       |
| `className`   | `string`                  | `""`     | Outer wrapper classes |

### Pure HTML (no JS — checkbox hack)

If you don't want a client component, use the existing `collapse` + `collapse-trigger` checkbox pattern instead:

```html
<div class="collapse rounded-md border border-base-300 bg-base-100">
  <label class="collapse-title cursor-pointer font-display">
    <input type="checkbox" class="collapse-trigger" />
    Toggle content
  </label>
  <div class="collapse-content px-4 pb-4 text-sm">
    <p>Pure HTML — no JavaScript required.</p>
  </div>
</div>
```

---

## Validator

A pure-CSS form validation system. The `validator` utility detects validity states on form elements and automatically reveals a sibling `validator-hint` with a smooth expand animation. No JavaScript required for native validation — works with the browser's built-in constraint validation API (`:user-valid` / `:user-invalid`).

### CSS Utilities

**File:** `validator.css`

| Utility          | Purpose                                                                        |
| ---------------- | ------------------------------------------------------------------------------ |
| `validator`      | Attach to any form element — monitors validity and sets `--input-color`        |
| `validator-hint` | Sibling after `.validator` — collapsed error message, auto-revealed on invalid |

### How it works

```
┌─────────────────────────────────────────────────┐
│  .validator                                     │
│  ├─ :user-valid / :has(:user-valid)             │
│  │  → --input-color: success (green)            │
│  │                                              │
│  ├─ :user-invalid / :has(:user-invalid)         │
│  │  / [aria-invalid] / :has([aria-invalid])     │
│  │  → --input-color: error (red)                │
│  │  → & ~ .validator-hint { reveal }  ◄──────── │
│  └──────────────────────────────────────────────│
│                                                  │
│  .validator-hint  (sibling AFTER .validator)     │
│  ├─ Default:  grid-template-rows: 0fr  (hidden) │
│  └─ Triggered: grid-template-rows: 1fr  (shown) │
└─────────────────────────────────────────────────┘
```

### Two detection paths

| Path                       | Selector                                     | Trigger                                                                            |
| -------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Native validation**      | `:user-valid` / `:user-invalid`              | Browser fires after user interaction + form submission or `checkValidity()`        |
| **Manual / server errors** | `[aria-invalid]:not([aria-invalid="false"])` | Developer sets `aria-invalid="true"` programmatically (e.g. server returns errors) |
| **Descendant**             | `:has(:user-valid)` / `:has(:user-invalid)`  | Child input is valid/invalid (use on wrapper like `.field`)                        |

### The `--input-color` custom property

Both valid and invalid branches set `--input-color` on every interactive state — resting, `:focus`, `:checked`, `[aria-checked="true"]`, and `:focus-within`. This ensures the color persists regardless of how the user interacts with the input.

```css
&,
&:focus,
&:checked,
&[aria-checked="true"],
&:focus-within {
  --input-color: var(--color-error);
}
```

### Transition details (validator-hint)

| Property             | Duration | Easing                         | Notes                                              |
| -------------------- | -------- | ------------------------------ | -------------------------------------------------- |
| `grid-template-rows` | 400ms    | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth height expansion from 0fr → 1fr             |
| `content-visibility` | 400ms    | same + `allow-discrete`        | Discrete flip at ~50% — defer hide during collapse |

### Example

```html
<!-- The form field -->
<label class="validator field">
  <span class="label-text">Email</span>
  <input type="email" required placeholder="you@example.com" />
</label>

<!-- Sibling AFTER .validator — auto-revealed on invalid -->
<div class="validator-hint">
  <span>Please enter a valid email address.</span>
</div>
```

> **Note:** `.validator-hint` must be a **following sibling** of `.validator` (`& ~ .validator-hint`). Wrap both in a `<div>` if you need them nested inside a flex/grid container.
