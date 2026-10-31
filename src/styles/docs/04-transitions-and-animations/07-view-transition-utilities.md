---
title: View Transition Utilities
description: One-class view transition helpers — vt-name-* / vt-class-* assign snapshot groups; the pseudo-element animations are written as unscoped rules keyed to the exact name or class you assigned. No pre-built animations.
related:
  title: Related
  description: The raw feature and other animation features.
  links:
    - css-utils/transitions-and-animations/view-transitions
    - css-utils/transitions-and-animations/starting-style
    - css-utils/transitions-and-animations/sibling-functions
---

The view transition utilities (`styles/utilities/view-transitions.css`) make the View Transitions API a one-class affair: assign snapshot groups with `vt-name-*` / `vt-class-*`, and get a cross-document page transition out of the box.

> **⚠️ Availability split**: the `::view-transition-*` pseudo-elements and the `view-transition-name`/`view-transition-class` properties are Baseline 2025 (Chrome/Edge 109+, Firefox 144+, Safari 18+). The `@view-transition` at-rule used for **cross-document** transitions is _not_ in Firefox — Chrome/Edge 126+, Safari 18.2+ only. Unsupported browsers simply navigate normally.

## What the file ships

1. **Cross-document opt-in** — `@view-transition { navigation: auto; }`, so same-origin page navigations transition automatically (document-level, not a class).
2. **Snapshot group utilities** — `vt-name-*` and `vt-class-*` on any element.
3. **No pre-built animations** — the pseudo-element rules are written in your own CSS, keyed to the exact name or class assigned above.

## Snapshot groups: `vt-name-*` / `vt-class-*`

Give an element a transition name so the browser captures it as its own snapshot group that **morphs** between pages:

```html
<header class="vt-name-[site-header]">…</header>
```

```html
<article class="vt-name-[card-1]">…</article>
<article class="vt-name-none">…</article>
<!-- opt back out -->
```

| Class             | Property                      | Notes                                                         |
| ----------------- | ----------------------------- | ------------------------------------------------------------- |
| `vt-name-[hero]`  | `view-transition-name: hero`  | Custom name — the same name must exist on both pages to morph |
| `vt-name-none`    | `view-transition-name: none`  | Exclude an element from the snapshot tree                     |
| `vt-class-[card]` | `view-transition-class: card` | Tag multiple groups to animate them together                  |
| `vt-class-none`   | `view-transition-class: none` | Clear tags                                                    |

`view-transition-name` must be **unique** per page — if the same name appears twice, the transition is skipped. Use `vt-class-*` when many elements should share the same animation (see [View transition types](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using_types)).

Names combine with any other utility — the snapshot is captured with whatever layout/styles the element already has:

```html
<header class="sticky top-0 z-10 vt-name-[site-header]">…</header>
```

## Animating the transition

Animations are written as **unscoped** pseudo-element rules. To make the transition work, the selector must target the **exact** `view-transition-name` you assigned with `vt-name-*`:

```html
<article class="vt-name-[feature-card]">…</article>
```

```css
::view-transition-old(feature-card) {
  animation: 0.4s ease-in both fade-out;
}
::view-transition-new(feature-card) {
  animation: 0.4s ease-out both fade-in;
}
```

Mismatched selectors — including class-prefixed compounds such as `vt-old-[feature-card]:animate-[…]` — never apply to named groups: during a cross-document transition the named-group pseudo-elements originate from the frozen snapshot, and Chrome only matches rules whose selector is the bare pseudo-element. (Compound selectors work only for the `root` group because `<html>` is a live element.)

Share one animation across many groups by keying the rules to a `view-transition-class` assigned with `vt-class-*`:

```html
<article class="vt-class-[card]">…</article>
<aside class="vt-class-[card]">…</aside>
```

```css
::view-transition-old(.card) {
  animation: 0.3s ease-in both fade-out;
}
```

### Define the keyframes once, anywhere

```css
@theme {
  --animate-fade-out: fade-out 0.4s ease-in both;
  --animate-fade-in: fade-in 0.4s ease-out both;

  @keyframes fade-out {
    to {
      opacity: 0;
    }
  }
  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }
}
```

With `@theme`, Tailwind ships the keyframes only when their `--animate-*` variable is used. The pseudo rules can also `@apply` a generated animation utility:

```css
::view-transition-old(vt-card) {
  @apply animate-fade-out;
}
::view-transition-new(vt-card) {
  @apply animate-fade-in;
}
```

## Default behavior & fallbacks

| Condition                                                    | Behavior                                                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| No pseudo rules written                                      | Snapshots swap instantly — only the group **morph** (size/position) animates; no pre-built fades |
| Browser without `@view-transition` (Firefox, older browsers) | Navigations happen without a transition                                                          |
| `prefers-reduced-motion: reduce`                             | Snapshot animations disabled — instant swap                                                      |

## Example: morphing card between two pages

Page A:

```html
<article class="vt-name-[feature-card]">
  <h2>Feature</h2>
  <p>Short summary…</p>
</article>
```

Page B:

```html
<article class="vt-name-[feature-card]">
  <h2>Feature</h2>
  <p>Full details, more content…</p>
</article>
```

Navigating A → B morphs the card: the group animates size and position from the old layout to the new one, while the snapshots crossfade through the `::view-transition-old(feature-card)` / `::view-transition-new(feature-card)` rules keyed to the assigned name.
