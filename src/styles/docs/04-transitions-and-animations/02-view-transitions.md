---
title: View Transitions
description: Create smooth animated transitions between pages using @view-transition and the ::view-transition-* pseudo-element family.
related:
  title: Related
  description: Entry/exit animations for individual elements.
  links:
    - css-utils/transitions-and-animations/starting-style
    - css-utils/transitions-and-animations/scroll-driven
---

The **View Transitions API** enables animated transitions between two states of a document — most commonly between two pages in a multi-page app (MPA). It creates a snapshot overlay where old and new view states are captured as pseudo-elements you can animate.

> **Baseline 2025**. Available across all modern browsers since October 2025.

## The view transition pseudo-element tree

During a view transition, the browser constructs this pseudo-element tree:

```
::view-transition                    ← root overlay (fixed, covers viewport)
└── ::view-transition-group(name)    ← one per named snapshot group
    └── ::view-transition-image-pair(name)
        ├── ::view-transition-old(name)   ← static snapshot (before)
        └── ::view-transition-new(name)   ← live representation (after)
```

## `@view-transition` at-rule

Opts the current and destination documents into a **cross-document** view transition. Both documents must be on the **same origin**.

### Syntax

```css
@view-transition {
  navigation: auto | none;
  types: none | <custom-ident>+;
}
```

### Descriptors

| Descriptor   | Value             | Description                                                                                                                                       |
| ------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `navigation` | `auto`            | Enable view transitions for same-origin navigations (`traverse`, `push`, `replace`). For `push`/`replace`, the navigation must be user-initiated. |
| `navigation` | `none`            | Disable view transitions.                                                                                                                         |
| `types`      | `<custom-ident>+` | Space-separated type names to set on the active view transition.                                                                                  |
| `types`      | `none`            | No types set (default).                                                                                                                           |

### Basic cross-document example

```css
/* In both the source and destination page CSS */
@view-transition {
  navigation: auto;
}

/* Animate old page out (slide up) */
@keyframes move-out {
  from {
    transform: translateY(0%);
  }
  to {
    transform: translateY(-100%);
  }
}

/* Animate new page in (slide up from bottom) */
@keyframes move-in {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0%);
  }
}

::view-transition-old(root) {
  animation: 0.4s ease-in both move-out;
}

::view-transition-new(root) {
  animation: 0.4s ease-in both move-in;
}
```

### Using transition types

```css
@view-transition {
  navigation: auto;
  types: slide;
}
```

Types can be used to apply different animations based on the navigation context.

> **Ready-made utilities**: The project ships one-class snapshot-group helpers (`vt-name-*`, `vt-class-*`) plus a default crossfade and type-gated presets — see [View Transition Utilities](/docs/css-utils/transitions-and-animations/view-transition-utilities).

---

## `::view-transition`

The **root** of the view transition overlay tree. Sits on top of all page content.

```css
/* UA default */
:root::view-transition {
  position: fixed;
  inset: 0;
}
```

Use it for global overlay styles (e.g., a dimming background):

```css
::view-transition {
  background-color: rgb(0 0 0 / 25%);
}
```

---

## `::view-transition-group()`

Represents a **single snapshot group**. It animates `width`, `height`, and `transform` from the old state's size/position to the new state's.

### Selector parameters

| Parameter              | Matches                                                            |
| ---------------------- | ------------------------------------------------------------------ |
| `*`                    | All groups                                                         |
| `root`                 | The default root group (elements without a `view-transition-name`) |
| `<pt-name-selector>`   | The `view-transition-name` value                                   |
| `.<pt-class-selector>` | The `view-transition-class` value                                  |

```css
::view-transition-group(embed-container) {
  animation-duration: 0.3s;
  animation-timing-function: ease;
  z-index: 1;
}
```

---

## `::view-transition-image-pair()`

Container holding both `::view-transition-old()` and `::view-transition-new()`. Has `isolation: isolate` during transitions so blend modes don't leak.

```css
::view-transition-image-pair(root) {
  isolation: auto;
}
```

---

## `::view-transition-old()`

A **static snapshot** of the element **before** the transition. A replaced element — use `object-fit` and `object-position` to manipulate it.

```css
::view-transition-old(root) {
  animation: 0.4s ease-in both fade-out;
}

@keyframes fade-out {
  to {
    opacity: 0;
  }
}
```

---

## `::view-transition-new()`

A **live representation** of the element **after** the transition. Also a replaced element.

```css
::view-transition-new(root) {
  animation: 0.4s ease-in both fade-in;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}
```

### Named element example

```css
figcaption {
  view-transition-name: figure-caption;
}

::view-transition-old(figure-caption) {
  animation: 0.25s linear both shrink-x;
}

::view-transition-new(figure-caption) {
  animation: 0.25s 0.25s linear both grow-x;
}

@keyframes shrink-x {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

@keyframes grow-x {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
```

> **Important**: Each `view-transition-name` must be **unique** on the page. If two elements share the same name, the transition will be skipped.
