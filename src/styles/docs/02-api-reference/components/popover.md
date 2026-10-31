---
title: Popover
description: The popover component — 12-position anchored popover with arrow, modal background blocking, animated entry/exit via @starting-style, and anchored container queries for arrow flip. Includes interest invoker support (interestfor + popover="hint"). Shares the --popper-* variable system with Tooltip.
related:
  title: Related
  description: Uses anchor positioning, fallbacks, and container queries. Shares infrastructure with Tooltip.
  links:
    - css-utils/anchor-positioning/association
    - css-utils/anchor-positioning/positioning
    - css-utils/anchor-positioning/fallback
    - css-utils/anchor-positioning/container-queries
    - css-utils/transitions-and-animations/starting-style
    - css-utils/api-reference/components/tooltip
---

The `popover` system styles elements using the [Popover API](https://developer.mozilla.org/docs/Web/API/Popover_API) with 12 position variants, an arrow, modal background blocking, animated entry/exit, and automatic arrow flip on overflow.

## Architecture

Popover and [Tooltip](/docs/css-utils/api-reference/components/tooltip) share the same positioning engine. Both use the `--popper-*` custom property namespace and a single `popper-anchored.css` static file.

| Layer                          | File                                       | Purpose                                                                                                        |
| ------------------------------ | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| **Component CSS**              | `components/popover.css`                   | Utility definitions, position variants, animations                                                             |
| **Shared fallbacks + queries** | `public/static/styles/popper-anchored.css` | Named `@position-try` options and `@container anchored()` queries (shared with Tooltip, bypasses LightningCSS) |

### Open state

The popover uses a unified open-state selector that covers all scenarios:

```css
&: is([open], : popover-open, : open);
```

| Selector        | What it matches                                  |
| --------------- | ------------------------------------------------ |
| `[open]`        | Native `<dialog open>` attribute                 |
| `:popover-open` | Popover API open state                           |
| `:open`         | `<details open>` and future `:open` pseudo-class |

This mirrors Tailwind's built-in `open:*` variant, giving developers a single `open:bg-red-500` hook regardless of which API the element uses.

---

## `popover-*` — Color setter

Sets `--popover-color` from any theme color, with optional alpha modifier.

| Class             | `--popover-color` |
| ----------------- | ----------------- |
| `popover-primary` | primary color     |
| `popover-neutral` | neutral color     |
| `popover-info/50` | 50% alpha info    |

---

## `popover` — Base styles

Fixed-position container with anchor-size awareness and anchored container queries. Must be paired with an anchor element.

### Anchor association

**Without arrow** — implicit association works fine. The browser links the popover to its trigger via `popovertarget`/`id` or `commandfor`/`id`:

```html
<button commandfor="my-popover" command="toggle-popover">Toggle</button>
<div id="my-popover" popover="auto" class="popover popover-top">
  <p>Popover content</p>
</div>
```

**With arrow** — requires **explicit** `[position-anchor]` on the popover. The arrow uses `[position-anchor:inherit]` to share the same anchor, so the popover must declare one explicitly:

```html
<button class="btn [anchor-name:--my-popover]" commandfor="my-popover" command="toggle-popover">Toggle</button>

<div id="my-popover" popover="auto" class="popover popover-arrow popover-top [position-anchor:--my-popover]">
  <p>Popover content with arrow</p>
</div>
```

> **Important**: `popover-arrow` depends on `[position-anchor:inherit]`. Without an explicit `[position-anchor]` on the popover, the arrow has no anchor to inherit from and won't position correctly.

### Defaults

| Property       | Default                               |
| -------------- | ------------------------------------- |
| `--popover-bg` | `var(--popover-color, transparent)`   |
| `--popover-fg` | `var(--color-contrast, currentColor)` |

---

## `popover-modal`

Prevents interaction with background content while the popover is open. Use on elements that don't have native modal behavior (popovers, unlike `<dialog showModal()>`, don't block background interaction by default).

| Popover type       | Behavior with `popover-modal`                                                                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `popover="manual"` | All outside interaction blocked — equivalent to `dialog.showModal()`                                                                                                         |
| `popover="auto"`   | Blocks clicking outside links/buttons and hover interactions, but **light-dismiss still works** (clicking outside closes the popover without triggering background elements) |

```html
<div popover="auto" class="popover popover-modal">...</div>
```

---

## `popover-arrow`

Adds an arrow via `::after` pseudo-element. Inherits the anchor from its parent via `[position-anchor:inherit]`. The arrow appears with a delayed fade-in when the popover opens.

```html
<div popover="auto" class="popover popover-arrow popover-top">...</div>
```

Uses the same SVG mask and `--popper-tail-*` variables as Tooltip. Arrow direction is controlled by the position variant and animated container queries.

---

## `popover-animated`

Spring-based entry/exit animations via `@starting-style`. The popover scales in from 75% with `var(--ease-spring-heavy)` and scales out with `var(--ease-overshoot-in)`. The arrow fades in after a configurable delay.

```html
<div popover="auto" class="popover popover-top popover-animated">...</div>
```

### How it works

| Phase       | Behavior                                                              |
| ----------- | --------------------------------------------------------------------- |
| **Opening** | Scales from `starting:scale-75 starting:opacity-0` over 1550ms spring |
| **Closing** | Reverses over 650ms with `allow-discrete` for `display`/`overlay`     |
| **Arrow**   | Fades in after `var(--popover-duration, 1550ms)` delay                |

---

## Interest invokers

The Popover API also ships a hover/focus companion: **interest invokers**. An `interestfor` attribute on the trigger shows a popover when the user "shows interest" (hover, focus, or long-press) — with no JavaScript. Ideal for tooltips.

> **⚠️ Chrome-only**: interest invokers are not supported in Firefox or Safari. Use them as a Chrome enhancement — the CSS-only [Tooltip](/docs/css-utils/api-reference/components/tooltip) utility remains the cross-browser fallback.

### Markup

```html
<button interestfor="my-tooltip" class="btn">Hover me</button>
<div id="my-tooltip" popover="hint" class="popover popover-top popover-animated">
  <p class="px-2 py-1 text-sm">Tooltip text</p>
</div>
```

Requirements: the invoker must be an `<a>`, `<button>`, `<area>`, or SVG `<a>` carrying `interestfor="<target-id>"`; the target needs an `id` and a `popover` attribute. Several invokers may reference the same target.

### Use `popover="hint"` for interest targets

Interest targets should use the **`hint`** state rather than `auto`:

| State    | Light-dismiss (outside click / Esc) | Closes other popovers                   | Focus               | Use for                             |
| -------- | ----------------------------------- | --------------------------------------- | ------------------- | ----------------------------------- |
| `auto`   | Yes                                 | Yes — closes other `auto` popovers      | Invoker keeps focus | Menus, dialogs, activation popovers |
| `hint`   | Yes                                 | Only other `hint` popovers (hint stack) | Never takes focus   | Tooltips, previews                  |
| `manual` | No                                  | No                                      | —                   | Fully JS-controlled popovers        |

With `hint` the tooltip stays visible when an `auto` popover opens from the same trigger, never steals focus or the top-layer slot, and still light-dismisses on outside click and Esc.

> `popover="hint"` itself is Chrome 151+ / Safari Technology Preview — but since interest invokers are Chrome-only anyway, the pairing is safe.

### Combining interest + activation on one trigger

A single button can be both an interest invoker and an activation invoker:

```html
<button interestfor="my-tooltip" commandfor="my-menu" command="toggle-popover">⚓︎</button>

<div id="my-tooltip" popover="hint" class="popover popover-right popover-animated">Tooltip</div>

<div id="my-menu" popover="auto" class="popover popover-bottom popover-animated">…menu…</div>
```

The tooltip **must** be `hint` here — if both were `auto`, opening one would close the other and you'd never see both at once.

Behavior verified in Chrome 150:

| Interaction                                          | Tooltip (`hint`) | Menu (`auto`)                                                          |
| ---------------------------------------------------- | ---------------- | ---------------------------------------------------------------------- |
| Hover / `Tab`-focus the button                       | Opens            | Closed                                                                 |
| Click the button (no interest shown)                 | —                | Toggles                                                                |
| Click the button **while hovering** (interest shown) | Stays open       | Does **not** toggle — the click is consumed by the open interest state |
| `Enter` while focused (interest shown)               | Closes           | Toggles                                                                |
| Click outside                                        | Light-dismisses  | Light-dismisses                                                        |
| `Esc`                                                | Closes           | Closes                                                                 |

> **⚠️ Chrome 150 quirk**: with a real pointer, clicking the invoker while its `hint` target is open does **not** toggle the `commandfor` popover — the MDN example shows both open, but on current Chrome the pointer click is swallowed by the interest state. Keyboard activation (`Enter` while focused) works and toggles normally. Keep this in mind when combining both on one control; a future Chrome update should align the pointer path with the MDN example.

### Interest CSS

| Feature                                       | Applies to                       | Example                                                               |
| --------------------------------------------- | -------------------------------- | --------------------------------------------------------------------- |
| `interest-delay: <start> <end>`               | Invoker                          | `interest-delay: 0.1s 0.2s` — 0.1s before showing, 0.2s before hiding |
| `interest-delay-start` / `interest-delay-end` | Invoker                          | Individual longhands                                                  |
| `:interest-source`                            | Invoker, while interest is shown | `button:interest-source { … }`                                        |
| `:interest-target`                            | Target, while interest is shown  | `#my-tooltip:interest-target { … }`                                   |

Utilities ship in `popover.css` for all three properties (applied on the invoker):

| Utility                      | CSS                                                     |
| ---------------------------- | ------------------------------------------------------- |
| `interest-delay-<ms>`        | `interest-delay: calc(<ms> * 1ms)` — both start and end |
| `interest-delay-start-<ms>`  | `interest-delay-start` only                             |
| `interest-delay-end-<ms>`    | `interest-delay-end` only                               |
| `interest-delay-[0.4s_0.2s]` | Full shorthand via arbitrary value (underscore = space) |

```html
<!-- Show after 400ms, hide 200ms after interest is lost -->
<button interestfor="my-tooltip" class="btn interest-delay-[0.4s_0.2s]">Hover me</button>
<div id="my-tooltip" popover="hint" class="popover popover-top">Tooltip</div>
```

The interest association also creates an **implicit anchor** between invoker and target, so all 12 `position-area`-based `popover-*` variants work without explicit `[anchor-name]`/`[position-anchor]` — though declaring them explicitly still works (and is required for `popover-arrow`, whose `::after` inherits the anchor).

> **Don't confuse with the `interest:*` Tailwind variant** — that is a project-defined class variant for `:is(:hover, :focus-visible, …)` styling. Interest invokers are the HTML `interestfor` feature.

### Events + feature detection

The target fires `interest` / `loseinterest` events; `event.source` is the invoker element. Detect support via the IDL property:

```ts
const supported = Object.hasOwn(HTMLButtonElement.prototype, "interestForElement");
```

React typings for `interestfor` ship with this project (`src/types/react-command-attributes.d.ts`).

---

## Matching anchor size

Use the general-purpose `w-anchor` / `h-anchor` utilities (from `utilities/default.css`) to match the popover's dimensions to its anchor:

```html
<!-- Match anchor width -->
<div popover class="popover popover-bottom w-anchor">...</div>

<!-- Min/max variants also available -->
<div popover class="popover popover-bottom max-h-anchor min-w-anchor">...</div>
```

Available utilities: `w-anchor`, `min-w-anchor`, `max-w-anchor`, `h-anchor`, `min-h-anchor`, `max-h-anchor`.

---

## Position variants

All 12 variants use `position-area` for placement and `@position-try` fallbacks for overflow handling. The arrow uses `justify-self: anchor-center` (top/bottom) or `align-self: anchor-center` (left/right) to stay centered on the anchor.

### Top variants

| Utility             | `position-area`  | Arrow points |
| ------------------- | ---------------- | ------------ |
| `popover-top`       | `top span-all`   | Down (0deg)  |
| `popover-top-start` | `top span-right` | Down (0deg)  |
| `popover-top-end`   | `top span-left`  | Down (0deg)  |

### Bottom variants

| Utility                | `position-area`     | Arrow points |
| ---------------------- | ------------------- | ------------ |
| `popover-bottom`       | `bottom span-all`   | Up (180deg)  |
| `popover-bottom-start` | `bottom span-right` | Up (180deg)  |
| `popover-bottom-end`   | `bottom span-left`  | Up (180deg)  |

### Left variants

| Utility              | `position-area`    | Arrow points   |
| -------------------- | ------------------ | -------------- |
| `popover-left`       | `span-all left`    | Right (270deg) |
| `popover-left-start` | `span-bottom left` | Right (270deg) |
| `popover-left-end`   | `span-top left`    | Right (270deg) |

### Right variants

| Utility               | `position-area`     | Arrow points |
| --------------------- | ------------------- | ------------ |
| `popover-right`       | `span-all right`    | Left (90deg) |
| `popover-right-start` | `span-bottom right` | Left (90deg) |
| `popover-right-end`   | `span-top right`    | Left (90deg) |

---

## `popover-offset-*`

Controls the distance from the anchor. Uses the spacing scale. Negative variant: `-popover-offset-*`.

---

## How the fallback system works

When a popover overflows the viewport, the browser tries the named `@position-try` fallback. For example, `popover-top` lists `--popper-flip-to-bottom` as its fallback — which moves the popover below the anchor.

Each fallback name encodes both the **original edge** and the **flip direction**. The anchored container query reads this name and adjusts the arrow:

```
popover-top → overflows top → --popper-flip-to-bottom applied
                                ↓
@container anchored(fallback:--popper-flip-to-bottom) {
  ::after {
    --popper-tail-deg: 180deg;          ← arrow now points up
    --popper-arrow-top: anchor(bottom); ← positioned at new edge
  }
}
```

This design avoids `:has()` chains, `:where()` gymnastics, or ancestor inspection — each fallback name is a complete self-describing signal.

> **Good to know**: The `@position-try` rules use `var(--popper-offset)` with fallbacks that resolve at compute time. Custom offsets set via `popover-offset-8` propagate through the fallback system correctly.
