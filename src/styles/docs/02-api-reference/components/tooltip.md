---
title: Tooltip
description: The tooltip component — 12-position hover tooltip with arrow, anchor positioning, animated entry/exit via @starting-style, and anchored container queries for arrow flip on overflow. Shares the --popper-* variable system and fallback engine with Popover.
related:
  title: Related
  description: Uses anchor positioning, fallbacks, and container queries. Shares infrastructure with Popover.
  links:
    - css-utils/anchor-positioning/association
    - css-utils/anchor-positioning/positioning
    - css-utils/anchor-positioning/fallback
    - css-utils/anchor-positioning/container-queries
    - css-utils/transitions-and-animations/starting-style
    - css-utils/api-reference/components/popover
---

The `tooltip` system displays a positioned tooltip with an arrow on hover, with 12 position variants, animated entry/exit, and automatic arrow flip when the tooltip overflows the viewport.

## Chrome-first: interest invoker tooltips

On Chrome, prefer **interest invokers** (`interestfor` + `popover="hint"`) for tooltips instead of the CSS-hover `tooltip` utility. Interest tooltips get proper top-layer stacking, light-dismiss, Esc handling, and `interest-delay` timing for free — no `:hover` bookkeeping:

```html
<button interestfor="my-tooltip" class="btn">Hover me</button>
<div id="my-tooltip" popover="hint" class="popover popover-top popover-animated">
  <p class="px-2 py-1 text-sm">Tooltip text</p>
</div>
```

Interest invokers are **Chrome-only** (not in Firefox/Safari) — keep using the `tooltip` utility below as the cross-browser fallback. The `interest:*` variant mentioned further down is unrelated: it is a project-defined hover/focus variant, not the HTML `interestfor` feature.

See the [Popover](/docs/css-utils/api-reference/components/popover#interest-invokers) docs for the full interest feature set (delays, `:interest-source`/`:interest-target`, events, feature detection).

## Architecture

Tooltip and [Popover](/docs/css-utils/api-reference/components/popover) share the same positioning engine. Both use the `--popper-*` custom property namespace and a single `popper-anchored.css` static file for `@container anchored()` queries.

| Layer                          | File                                       | Purpose                                                                                                        |
| ------------------------------ | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| **Component CSS**              | `components/tooltip.css`                   | Utility definitions, position variants, show/hide logic, animations                                            |
| **Shared fallbacks + queries** | `public/static/styles/popper-anchored.css` | Named `@position-try` options and `@container anchored()` queries (shared with Popover, bypasses LightningCSS) |

> **Static CSS note**: `@container anchored()` is served as a separate file loaded via `<link>` in the document head. LightningCSS doesn't support the `anchored()` function yet (Baseline 2026), so it must bypass the PostCSS build pipeline.

### Custom variant hooks

Two Tailwind custom variants give developers clean extension points without touching component internals:

| Variant            | Activation                                                                  | Use with                                                                                 |
| ------------------ | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `interest:*`       | `:is(:hover, :focus-visible, :has(:focus-visible), [aria-expanded="true"])` | Tooltip show/hide state — use `interest:underline` on the trigger                        |
| `group-interest:*` | Parent element matches `interest`                                           | Style children when tooltip is active — use `group-interest:scale-110` on a sibling icon |

Defined in `globals.css`:

```css
@custom-variant interest (&:is(:hover, :focus-visible, :has(:focus-visible), [aria-expanded="true"]));
```

---

## Structure

```html
<div class="tooltip tooltip-top tooltip-animated">
  <!-- Trigger element (any content) -->
  <button class="btn">Hover me</button>

  <!-- Tooltip content + arrow -->
  <div class="tooltip-content tooltip-arrow">
    <p class="px-2 py-1 text-sm">Tooltip text</p>
  </div>
</div>
```

The arrow is created via `::after` on the `.tooltip-arrow` element. When the tooltip overflows, anchored container queries rotate and reposition the arrow to point at the anchor from the new direction.

---

## `tooltip-*` — Color setter

Sets `--tooltip-color` from any theme color, with optional alpha modifier. Defaults to `--color-neutral` if not set.

| Class             | `--tooltip-color`      |
| ----------------- | ---------------------- |
| `tooltip-primary` | primary color          |
| `tooltip-info`    | info color             |
| (none)            | `var(--color-neutral)` |

---

## `tooltip` — Base container

Sets up the anchor association, color contrast, and show/hide behavior on hover.

```html
<div class="tooltip tooltip-top">
  <button class="btn">Hover me</button>
  <div class="tooltip-content tooltip-arrow">
    <p>Tooltip text</p>
  </div>
</div>
```

### Defaults

| Property          | Default                                               |
| ----------------- | ----------------------------------------------------- |
| `--tooltip-color` | `var(--color-neutral)`                                |
| `--tooltip-fg`    | `var(--color-contrast, var(--color-neutral-content))` |

### Show/hide

When hovered, focused, or `[aria-expanded="true"]`, the `.tooltip-content` becomes `display: block`. The tooltip only appears if `.tooltip-content` is **not empty** (`:has(.tooltip-content:not(:empty))`).

---

## `tooltip-arrow`

Adds the arrow via `::after` pseudo-element. The arrow is a fixed-position element anchored to the same anchor as the content. Uses an SVG mask for the arrow shape and inherits `--tooltip-color` as its background.

```css
@utility tooltip-arrow {
  &:is(.tooltip-content:not(:empty))::after { ... }
}
```

Apply to the `.tooltip-content` element alongside any position variant.

---

## Position variants

All 12 variants use `position-area` for placement and `@position-try` fallbacks for overflow handling. The arrow uses `justify-self: anchor-center` (top/bottom) or `align-self: anchor-center` (left/right) to stay centered on the anchor.

### Top variants

| Utility             | `position-area`  | Arrow points |
| ------------------- | ---------------- | ------------ |
| `tooltip-top`       | `top span-all`   | Down (0deg)  |
| `tooltip-top-start` | `top span-right` | Down (0deg)  |
| `tooltip-top-end`   | `top span-left`  | Down (0deg)  |

```html
<div class="tooltip tooltip-top">
  <button class="btn">Top</button>
  <div class="tooltip-content tooltip-arrow"><p>Above</p></div>
</div>
```

### Bottom variants

| Utility                | `position-area`     | Arrow points |
| ---------------------- | ------------------- | ------------ |
| `tooltip-bottom`       | `bottom span-all`   | Up (180deg)  |
| `tooltip-bottom-start` | `bottom span-right` | Up (180deg)  |
| `tooltip-bottom-end`   | `bottom span-left`  | Up (180deg)  |

### Left variants

| Utility              | `position-area`    | Arrow points   |
| -------------------- | ------------------ | -------------- |
| `tooltip-left`       | `span-all left`    | Right (270deg) |
| `tooltip-left-start` | `span-bottom left` | Right (270deg) |
| `tooltip-left-end`   | `span-top left`    | Right (270deg) |

### Right variants

| Utility               | `position-area`     | Arrow points |
| --------------------- | ------------------- | ------------ |
| `tooltip-right`       | `span-all right`    | Left (90deg) |
| `tooltip-right-start` | `span-bottom right` | Left (90deg) |
| `tooltip-right-end`   | `span-top right`    | Left (90deg) |

---

## `tooltip-animated`

Adds spring-based entry/exit animations. The tooltip scales up from 75% with `var(--ease-spring-heavy)` on hover, and scales back down with `var(--ease-overshoot-in)` on exit.

```html
<div class="tooltip tooltip-top tooltip-animated">...</div>
```

---

## `tooltip-interactive`

By default, tooltip content has `pointer-events: none` — you can't interact with anything inside it. `tooltip-interactive` flips this to `pointer-events: auto` and switches from `display` to `visibility` for show/hide, so the tooltip doesn't disappear when you move the cursor from the trigger onto the tooltip itself.

```html
<div class="tooltip-interactive tooltip tooltip-top">
  <button>Trigger</button>
  <div class="tooltip-content tooltip-arrow">
    <button class="btn btn-xs">Click me</button>
  </div>
</div>
```

### How it works

| Property             | Default tooltip              | With `tooltip-interactive`                |
| -------------------- | ---------------------------- | ----------------------------------------- |
| Show/hide mechanism  | `display: none` ↔ `block`    | `visibility: hidden` ↔ `visible`          |
| Pointer events       | `pointer-events: none`       | `pointer-events: auto`                    |
| Display preservation | `display: block` (hardcoded) | `[display:unset]` (preserves inline type) |
| Specificity          | Normal                       | `:where()` wrapper — (0,0,0)              |

The key difference: by using `visibility` instead of `display`, the tooltip stays in the layout (invisible but present), so hovering over the gap between trigger and content doesn't collapse it. The `transition-delay: 150ms` on hide gives you time to move the cursor onto the tooltip without it vanishing.

### Hover card pattern

The most common use case — a rich popover with links, buttons, or images that appears on hover:

```html
<div class="tooltip-interactive tooltip tooltip-bottom tooltip-animated tooltip-base-100">
  <button type="button" class="avatar">
    <div>
      <img src="user.jpg" alt="User" />
    </div>
  </button>

  <div class="tooltip-content tooltip-arrow">
    <div class="card w-64 border border-base-300 card-xs">
      <div class="card-body">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <div class="h-10 w-10">
              <img src="user.jpg" alt="User" />
            </div>
          </div>
          <div>
            <p class="font-bold">Jane Doe</p>
            <p class="text-xs opacity-60">@janedoe</p>
          </div>
        </div>
        <p class="text-sm">Frontend developer. Open source enthusiast.</p>
        <div class="card-action justify-center">
          <button type="button" class="btn btn-xs btn-primary">Follow</button>
          <button type="button" class="btn btn-ghost btn-xs">View profile</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Delay tuning

The default 150ms hide delay works for most cases. To adjust it, override the transition/animation delay on the specific tooltip:

```css
/* Faster dismiss */
.tooltip-fast-dismiss > .tooltip-content {
  transition-delay: 50ms !important;
  animation-delay: 50ms !important;
}

/* Slower — more forgiving for large hover cards */
.tooltip-slow-dismiss > .tooltip-content {
  transition-delay: 300ms !important;
  animation-delay: 300ms !important;
}
```

> **Good to know**: Combine `tooltip-interactive` with `tooltip-animated` for hover cards. Without `tooltip-interactive`, the card disappears the moment you try to click a button inside it.

---

## `tooltip-offset-*`

Controls the distance between the tooltip and the anchor. Uses the spacing scale. Default offset is `0.25rem`.

```html
<div class="tooltip tooltip-top tooltip-offset-4">...</div>
<!-- 4 spacing units = 1rem gap -->
```

Negative offset variant available: `-tooltip-offset-*`.

---

## `tooltip-anchor-*`

Customizes the anchor name used for positioning. Default is `--tooltip-anchor`. Managed via `@property` for type safety and inheritance.

```html
<div class="tooltip tooltip-anchor-[--my-anchor]">...</div>
```
