---
title: View Timeline Utilities
description: One-class enter/exit animations built on view() — view-reveal animates an element in when it enters the viewport and back out when it leaves, with optional custom keyframes, axis and inset modifiers.
related:
  title: Related
  description: The raw CSS function and other animation features.
  links:
    - css-utils/transitions-and-animations/scroll-driven
    - css-utils/transitions-and-animations/scroll-timeline
    - css-utils/transitions-and-animations/sibling-functions
    - css-utils/transitions-and-animations/starting-style
---

The `view-reveal` utilities wrap the CSS [`view()`](/docs/css-utils/transitions-and-animations/scroll-driven#view-function) function into a single class that animates an element **in when it enters** the viewport and **back out when it leaves** — scroll-driven, no JavaScript.

> **⚠️ Limited availability**: `view()` is not yet Baseline — Chrome/Edge 115+, Safari 26, Firefox Nightly. See [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/view#browser_compatibility). In unsupported browsers the content simply renders fully visible (a `@supports` fallback disables the animation).

## Quick start

```html
<div class="view-reveal">…</div>
```

The element is hidden below the fold, rises and fades in as it scrolls into view, stays visible while in view, and fades back out when it leaves.

## How it works

One **single** scroll-driven animation runs across the whole view-progress timeline — from the moment the element first touches the scrollport until it has fully left it:

```css
@keyframes rise-view {
  0% {
    opacity: 0;
    transform: translateY(2rem);
  } /* below the fold */
  12% {
    opacity: 1;
    transform: translateY(0);
  } /* finished entering */
  88% {
    opacity: 1;
    transform: translateY(0);
  } /* still in view      */
  100% {
    opacity: 0;
    transform: translateY(-2rem);
  } /* finished exiting   */
}
```

| Phase              | Timeline progress | Result                                 |
| ------------------ | ----------------- | -------------------------------------- |
| Below the viewport | negative          | Held at the 0% keyframe — **hidden**   |
| Entering           | 0% → ~12%         | Animates to visible                    |
| In view            | ~12% → ~88%       | Held visible                           |
| Exiting            | ~88% → 100%       | Animates back to hidden                |
| Above the viewport | > 100%            | Held at the 100% keyframe — **hidden** |

Two details make this reliable:

- **`animation-fill-mode: both` is essential.** View progress does _not_ clamp to `[0, 1]` — it is negative before the element enters and above 100% after it leaves. Without fill-mode the element would snap back to its base styles outside that range.
- **One animation, not two.** A single animation with edge keyframes avoids the backwards/forwards fill conflicts you get when composing separate enter and exit animations (two filling animations fight over the same property outside their ranges).

## Built-in effects

| Class              | Keyframes   | Effect                              |
| ------------------ | ----------- | ----------------------------------- |
| `view-reveal`      | `rise-view` | `translateY(2rem)` + fade (default) |
| `view-reveal-fade` | `fade-view` | Fade only                           |
| `view-reveal-zoom` | `zoom-view` | `scale(0.85)` + fade                |
| `view-reveal-blur` | `blur-view` | `blur(8px)` + fade                  |

All variants apply the same timeline machinery:

```css
animation-timeline: view(block);
animation-duration: auto; /* scroll timelines drive the duration */
animation-timing-function: linear;
animation-fill-mode: both;
```

## Custom animation

Keep the timeline machinery, use **your own keyframes** — pass the keyframe name as an arbitrary value:

```html
<div class="view-reveal-[my-keyframes]">…</div>
```

Any keyframes work. Pick the shape that matches the behavior you want:

| Keyframe shape                                                        | Combine with       | Result                                                                                                                 |
| --------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Full journey: `0% hidden → ~12% visible → ~88% visible → 100% hidden` | —                  | Animated on enter **and** on exit (symmetric, like the built-ins)                                                      |
| Plain `from`/`to`                                                     | `view-range-entry` | Reveal on enter — hidden below the fold, animates in while entering, stays visible afterwards                          |
| Plain `from`/`to`                                                     | —                  | A full-passage crossfade — the keyframes map over the entire view travel, and the element stays visible after it exits |

```css
/* Symmetric enter + exit (journey shape) */
@keyframes flip-in {
  0% {
    opacity: 0;
    transform: rotateX(90deg);
  }
  12% {
    opacity: 1;
    transform: rotateX(0deg);
  }
  88% {
    opacity: 1;
    transform: rotateX(0deg);
  }
  100% {
    opacity: 0;
    transform: rotateX(-90deg);
  }
}

/* Reveal on enter only (any two-keyframe animation) */
@keyframes my-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

```html
<div class="view-reveal-[flip-in]">Symmetric</div>
<div class="view-reveal-[my-fade] view-range-entry">Reveal on enter</div>
```

> **Why the journey shape is special**: with `fill-mode: both`, the element is held at the first keyframe below the fold and at the last keyframe after it exits. With plain `from`/`to` keyframes the last keyframe is the _visible_ state — so the element stays visible after exiting (no exit animation). That's perfectly fine when you only want an entrance effect; add `view-range-entry` so the animation runs while entering instead of across the whole view travel.

## Timeline modifiers

Modifiers override the timeline — combine them **after** the base class.

### Axis

```html
<div class="view-reveal view-axis-x">…</div>
```

| Class              | Timeline       | Tracks               |
| ------------------ | -------------- | -------------------- |
| `view-axis-block`  | `view(block)`  | Block axis (default) |
| `view-axis-inline` | `view(inline)` | Inline axis          |
| `view-axis-x`      | `view(x)`      | Horizontal scrollbar |
| `view-axis-y`      | `view(y)`      | Vertical scrollbar   |

> If the chosen axis has no scrollbar, the timeline is **inactive** — the animation never runs.

### Insets

```html
<div class="view-reveal view-inset-[20%_10%]">…</div>
```

Insets adjust when the element is considered "in view": the first value insets the scrollport's **start** edge, the second (optional) insets the **end** edge. Positive values shrink the view box, negative values extend it.

| Class                  | Timeline              | Meaning                                |
| ---------------------- | --------------------- | -------------------------------------- |
| `view-inset-[20%]`     | `view(block 20%)`     | Start 20% into the scrollport          |
| `view-inset-[20%_10%]` | `view(block 20% 10%)` | Start at 20%, end at 10%               |
| `view-inset-[0_-10%]`  | `view(block 0 -10%)`  | Start at edge, end 10% beyond (outset) |

### Range

```html
<div class="view-reveal-[my-fade] view-range-entry">…</div>
```

| Class              | Range                 | Use with                                                                       |
| ------------------ | --------------------- | ------------------------------------------------------------------------------ |
| `view-range-entry` | `entry 0% entry 100%` | Plain `from`/`to` keyframes — the animation runs only while the element enters |

## Fallbacks

The utility ships two automatic fallbacks:

| Condition                                 | Behavior                                                                                                        |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Browser without `view()` (stable Firefox) | `@supports not (animation-timeline: view())` disables the animation — content renders statically, fully visible |
| `prefers-reduced-motion: reduce`          | Animation disabled — content fully visible                                                                      |

## Example: reveal cards

```html
<section class="h-96 overflow-y-auto">
  <div class="view-reveal">Card 1</div>
  <div class="view-reveal-fade">Card 2</div>
  <div class="view-reveal-zoom view-inset-[30%_20%]">Card 3</div>
  <div class="view-reveal-[flip-in]">Card 4</div>
</section>
```

Each card animates against **its nearest scroll container** — scrolling down reveals cards one by one, scrolling back up runs the animations in reverse.
