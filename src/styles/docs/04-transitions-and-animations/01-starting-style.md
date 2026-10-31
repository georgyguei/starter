---
title: "@starting-style"
description: Define starting values for CSS transitions on elements that have no previous state — first render, display changes, popovers, dialogs, and DOM additions.
related:
  title: Related
  description: Combine with other transition features.
  links:
    - css-utils/transitions-and-animations/view-transitions
    - css-utils/transitions-and-animations/scroll-driven
---

The `@starting-style` at-rule defines the **starting property values** for an element that you want to transition **from** when it first appears. Without it, CSS transitions don't fire on an element's initial render or when `display` changes from `none`.

> **Baseline 2024**. Available across all modern browsers since August 2024.

## Why `@starting-style` is needed

CSS transitions require a **previous state** to transition from. Elements appearing for the first time (first render, `display: none` → visible, added to DOM) have no previous state — so transitions are **skipped by default**. `@starting-style` provides that missing "from" state.

> **Note**: `@starting-style` is only relevant to **CSS transitions**. CSS animations don't need it — they run from their first keyframe automatically.

## Two syntax forms

### Standalone block

Contains one or more rulesets with starting declarations:

```css
@starting-style {
  [popover]:popover-open {
    opacity: 0;
    transform: scaleX(0);
  }
}
```

### Nested inside a ruleset

Contains declarations for elements already selected by the parent ruleset:

```css
[popover]:popover-open {
  opacity: 1;
  transform: scaleX(1);

  @starting-style {
    opacity: 0;
    transform: scaleX(0);
  }
}
```

> **Important**: `@starting-style` and the "original rule" have the **same specificity**. Always place `@starting-style` **after** the original rule, otherwise the original styles will override the starting styles.

## The three style states

When using `@starting-style`, an element goes through three states:

| Phase           | State                                      | Styles from                                    |
| --------------- | ------------------------------------------ | ---------------------------------------------- |
| 1. Starting     | First rendered / `display: none` → visible | `@starting-style`                              |
| 2. Transitioned | After entry animation completes            | Original rule (`.open`, `:popover-open`, etc.) |
| 3. Default      | After removal of the visible class         | Default ruleset                                |

Once an element has been visible in the DOM, it **no longer uses** `@starting-style` — subsequent transitions go between the **transitioned** state and the **default** state, not back through starting styles.

## Basic usage

### Transition on first render

```css
#target {
  transition: background-color 1.5s;
  background-color: green;
}

@starting-style {
  #target {
    background-color: transparent;
  }
}
```

The element transitions from `transparent` → `green` only on its **first** render.

### Transition on `display` change

```css
#target {
  transition-property: opacity, display;
  transition-duration: 0.5s;
  display: block;
  opacity: 1;

  @starting-style {
    opacity: 0;
  }
}

#target.hidden {
  display: none;
  opacity: 0;
}
```

> **Key detail**: `display` is in the transition list. Since `display` is a discrete property, `transition-behavior: allow-discrete` (set via the shorthand) is required for it to animate.

## Animating a popover

This is the most common use case. A popover transitions from hidden to visible:

```css
/* Ending state (open popover) */
[popover]:popover-open {
  opacity: 1;
  transform: scaleX(1);
}

/* Default hidden state + exit animation target */
[popover] {
  opacity: 0;
  transform: scaleX(0);

  transition:
    opacity 0.7s,
    transform 0.7s,
    overlay 0.7s allow-discrete,
    display 0.7s allow-discrete;
}

/* Starting state — must come AFTER [popover]:popover-open */
@starting-style {
  [popover]:popover-open {
    opacity: 0;
    transform: scaleX(0);
  }
}

/* Backdrop transition */
[popover]::backdrop {
  background-color: transparent;
  transition:
    display 0.7s allow-discrete,
    overlay 0.7s allow-discrete,
    background-color 0.7s;
}

[popover]:popover-open::backdrop {
  background-color: rgb(0 0 0 / 25%);
}

@starting-style {
  [popover]:popover-open::backdrop {
    background-color: transparent;
  }
}
```

**Why `overlay` and `display` in the transition?**

- **`display`**: Ensures the element stays visible (`display: block`) during both entry and exit animations. Without it, the exit animation is invisible.
- **`overlay`**: Defers removal from the top layer until the animation ends, preventing a jarring disappearance.
- Both need `allow-discrete` since they're discrete properties.

> **Note**: Because popovers toggle `display: none` ↔ `display: block` each time they're shown, `@starting-style` is used **every time** the entry transition occurs.

## Animating DOM addition and removal

```css
div {
  opacity: 1;
  scale: 1 1;
  transition:
    opacity 0.7s,
    scale 0.7s,
    display 0.7s allow-discrete;
}

@starting-style {
  div {
    opacity: 0;
    scale: 1 0;
  }
}

.fade-out {
  opacity: 0;
  display: none;
  scale: 1 0;
}
```

When a `<div>` is appended to the DOM: `opacity: 0 → 1`, `scale: 1 0 → 1 1`.  
When the `.fade-out` class is added: reverses the animation, then `display: none` hides it.
