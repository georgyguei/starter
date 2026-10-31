---
title: Field
description: The field component — a minimal form field layout wrapper with a legend label for grouping inputs, labels, and hints.
related:
  title: Related
  description: Combine with form components.
  links:
    - css-utils/api-reference/components/input
    - css-utils/api-reference/components/checkbox
    - css-utils/api-reference/components/validator
---

The `field` component provides a consistent vertical layout for form fields — a grid container with a legend label and auto-sized rows for inputs, hints, and error messages.

## `field`

A CSS Grid container that stacks children vertically with consistent spacing.

```css
@utility field {
  @layer components.l1.l2.l3 {
    @apply grid auto-rows-max grid-cols-[1fr] gap-1.5 py-1 text-xs;
  }
}
```

### Usage

```html
<fieldset class="field">
  <legend class="field-legend">Email</legend>
  <input class="input" type="email" placeholder="you@example.com" />
  <p class="opacity-60">We'll never share your email.</p>
</fieldset>
```

---

## `field-legend`

A bold label with icon support, positioned with negative bottom margin to sit close to the field below.

```css
@utility field-legend {
  @layer components.l1.l2.l3 {
    @apply -mb-1 flex w-fit items-center gap-2 py-2 font-semibold;
  }
}
```

### Usage

```html
<div class="field">
  <span class="field-legend">
    <svg class="icon">...</svg>
    Password
  </span>
  <input class="input" type="password" />
</div>
```

---

## Bordered fieldset

When `field` is applied to a `<fieldset>` that contains a `<legend>`, the border, padding, and legend gap are applied automatically:

```html
<fieldset class="field">
  <legend class="field-legend">Email</legend>
  <input class="input" type="email" placeholder="you@example.com" />
  <p class="opacity-60">We'll never share your email.</p>
</fieldset>
```

> **Tip**: Customize the border color via the standard border utilities if needed.

---

## Full example

```html
<div class="validator">
  <div class="field">
    <label for="email" class="field-legend">Email</label>
    <input class="input input-primary" type="email" id="email" required placeholder="you@example.com" />
    <p class="text-xs opacity-60">We'll never share your email with anyone else.</p>
  </div>
</div>
<div class="validator-hint">
  <span>Please enter a valid email address.</span>
</div>
```
