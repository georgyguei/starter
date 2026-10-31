---
title: CSS Anchor Positioning
description: Reference for the CSS Anchor Positioning module — tether elements together, position them relative to anchors, handle overflow with fallbacks, and conditionally hide positioned elements.
related:
  title: Start Here
  description: Learn how to associate, position, size, and manage anchor-positioned elements.
  links:
    - css-utils/anchor-positioning/association
    - css-utils/anchor-positioning/positioning
    - css-utils/anchor-positioning/sizing
    - css-utils/anchor-positioning/fallback
    - css-utils/anchor-positioning/visibility
    - css-utils/anchor-positioning/container-queries
    - css-utils/anchor-positioning/guide
---

The **CSS Anchor Positioning** module lets you tether elements together declaratively. Define an element as an **anchor**, then position and size a **positioned element** relative to it — all in CSS, no JavaScript required.

> **Browser support**: Baseline 2026. Available across all modern browsers since January 2026.

## How the docs are organized

| Section                                                                            | What it covers                                                                                       |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [Association](/docs/css-utils/anchor-positioning/association)                      | `anchor-name`, `position-anchor`, `anchor-scope` — defining and linking anchors                      |
| [Positioning](/docs/css-utils/anchor-positioning/positioning)                      | `position-area`, `anchor()`, `anchor-center` — placing elements relative to anchors                  |
| [Sizing](/docs/css-utils/anchor-positioning/sizing)                                | `anchor-size()` — sizing elements based on anchor dimensions                                         |
| [Fallback Options](/docs/css-utils/anchor-positioning/fallback)                    | `position-try`, `@position-try`, `position-try-order` — handling overflow                            |
| [Visibility](/docs/css-utils/anchor-positioning/visibility)                        | `position-visibility` — conditionally hiding elements                                                |
| [Anchored Container Queries](/docs/css-utils/anchor-positioning/container-queries) | `container-type: anchored` + `@container anchored(fallback: ...)` — styling based on active fallback |
| [Practical Guide](/docs/css-utils/anchor-positioning/guide)                        | End-to-end tutorial tying all concepts together                                                      |

## Quick reference

| Property / Function      | Purpose                                                                        |
| ------------------------ | ------------------------------------------------------------------------------ |
| `anchor-name`            | Gives an element one or more anchor names                                      |
| `position-anchor`        | Associates a positioned element with an anchor                                 |
| `anchor-scope`           | Limits anchor name visibility to a subtree                                     |
| `position-area`          | Places element on a 3×3 grid relative to the anchor                            |
| `anchor()`               | Returns a length based on an anchor's side position (used in inset properties) |
| `anchor-size()`          | Returns a length based on an anchor's dimensions (used in sizing properties)   |
| `anchor-center`          | Centers a positioned element on its anchor (alignment value)                   |
| `position-try`           | Shorthand for `position-try-order` + `position-try-fallbacks`                  |
| `position-try-fallbacks` | List of alternative positions to try when overflow occurs                      |
| `position-try-order`     | Criteria for choosing which fallback to apply first                            |
| `@position-try`          | At-rule defining a custom fallback position                                    |
| `position-visibility`    | Conditionally hides anchor-positioned elements                                 |

## The three requirements for anchor positioning

To position an element relative to an anchor, you need **three things**:

1. **Association** — Link the positioned element to an anchor (`anchor-name` + `position-anchor`)
2. **Position** — Make the element absolutely or fixed positioned (`position: absolute` or `position: fixed`)
3. **Location** — Specify where relative to the anchor (`position-area`, `anchor()`, or `anchor-center`)
