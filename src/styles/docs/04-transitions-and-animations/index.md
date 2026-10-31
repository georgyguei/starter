---
title: Transitions & Animations
description: Reference for CSS transition and animation features — @starting-style for entry/exit transitions, View Transitions for page-level animations, and scroll-driven animations with scroll() and view().
related:
  title: Start Here
  description: Learn each feature in detail.
  links:
    - css-utils/transitions-and-animations/starting-style
    - css-utils/transitions-and-animations/view-transitions
    - css-utils/transitions-and-animations/view-transition-utilities
    - css-utils/transitions-and-animations/scroll-driven
    - css-utils/transitions-and-animations/view-timeline
    - css-utils/transitions-and-animations/scroll-timeline
    - css-utils/transitions-and-animations/sibling-functions
---

This section covers three CSS features for creating smooth, performant transitions and animations — from element-level entry/exit effects to full page transitions and scroll-linked motion.

## How the docs are organized

| Section                                                                                           | What it covers                                                                                                                     | Support                                       |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [@starting-style](/docs/css-utils/transitions-and-animations/starting-style)                      | Entry/exit transitions for popovers, dialogs, and DOM changes                                                                      | Baseline 2024                                 |
| [View Transitions](/docs/css-utils/transitions-and-animations/view-transitions)                   | Cross-document page transitions with `@view-transition` and `::view-transition-*` pseudo-elements                                  | Baseline 2025                                 |
| [View Transition Utilities](/docs/css-utils/transitions-and-animations/view-transition-utilities) | `vt-name-*` / `vt-class-*` snapshot-group helpers — pseudo-element rules written unscoped, keyed to the assigned name              | Baseline 2025 (at-rule: Limited availability) |
| [Scroll-Driven Animations](/docs/css-utils/transitions-and-animations/scroll-driven)              | `scroll()` and `view()` progress timelines linked to scroll position                                                               | Limited availability                          |
| [View Timeline Utilities](/docs/css-utils/transitions-and-animations/view-timeline)               | `view-reveal` one-class enter/exit animations built on `view()`, with custom keyframes, axis and inset modifiers                   | Limited availability                          |
| [Scroll Timeline Utilities](/docs/css-utils/transitions-and-animations/scroll-timeline)           | `scroll-scrub` one-class scroll-scrubbed animations built on `scroll()`, with custom keyframes, scroller, axis and range modifiers | Limited availability                          |
| [Sibling Functions](/docs/css-utils/transitions-and-animations/sibling-functions)                 | `sibling-count()` and `sibling-index()` for position-aware calculations and staggered animations                                   | Baseline 2026                                 |

## Quick reference

| Feature                          | Purpose                                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `@starting-style`                | Defines starting property values for elements that have no previous state (first render, `display: none` → visible) |
| `@view-transition`               | Opts documents into cross-document view transitions (`navigation: auto`)                                            |
| `::view-transition`              | Root overlay element for all view transition snapshots                                                              |
| `::view-transition-group()`      | Single view transition snapshot group                                                                               |
| `::view-transition-image-pair()` | Container holding old and new view state snapshots                                                                  |
| `::view-transition-old()`        | Static snapshot of the "old" view state (before transition)                                                         |
| `::view-transition-new()`        | Live representation of the "new" view state (after transition)                                                      |
| `scroll()`                       | Creates an anonymous scroll progress timeline from a scroller's scrollbar                                           |
| `view()`                         | Creates an anonymous view progress timeline based on element visibility in the scrollport                           |
| `sibling-count()`                | Returns total number of sibling elements — for equal-width layouts, quantity-based styling                          |
| `sibling-index()`                | Returns 1-based position among siblings — for staggered animations, progressive sizing                              |

## When to use each

| Need                                                          | Use                                                                |
| ------------------------------------------------------------- | ------------------------------------------------------------------ |
| Animate a popover/tooltip appearing                           | `@starting-style` + `transition`                                   |
| Animate elements added/removed from DOM                       | `@starting-style` + `transition` with `display` + `allow-discrete` |
| Smooth page-to-page navigation                                | `@view-transition` + `::view-transition-*` keyframes               |
| Morph one element across pages with one class                 | `vt-name-[my-element]` on both pages                               |
| Animate an element as the user scrolls                        | `scroll()` or `view()` with `animation-timeline`                   |
| Reveal content as it scrolls into view                        | `view()` with inset adjustments                                    |
| Reveal on enter AND hide on exit with one class               | `view-reveal` / `view-reveal-fade` utilities                       |
| Scrub an element's animation across a scroller's scroll range | `scroll-scrub` / `scroll-scrub-fade` utilities                     |
| Reading progress bar that fills as the page scrolls           | `scroll-scrub-grow` + `scroll-scroller-root`                       |
| Staggered list item entrance animations                       | `delay-stagger-*` (built on `sibling-index()`)                     |
| Equal-width columns that adapt to item count                  | `w-even` (built on `sibling-count()`)                              |
