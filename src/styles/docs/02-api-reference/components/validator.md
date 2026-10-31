---
title: Validator
description: The validator component — applies success/error colors to form inputs based on :user-valid/:user-invalid and shows animated error hints.
related:
  title: Related Components
  description: Commonly used with these.
  links:
    - css-utils/api-reference/components/btn
    - css-utils/api-reference/components/join
---

The `validator` component brings native HTML form validation to life — applying success/error colors via `--input-color` and revealing animated error messages when a field is invalid.

---

## `validator`

Detects `:user-valid` and `:user-invalid` pseudo-classes (which activate after the user has interacted with the field and then left it) and sets `--input-color` to the success or error color accordingly. Works on the input itself or a wrapper via `:has()`.

### How it works

| State   | `--input-color`        | Trigger                                                                 |
| ------- | ---------------------- | ----------------------------------------------------------------------- |
| Valid   | `var(--color-success)` | `:user-valid` on the element or a descendant                            |
| Invalid | `var(--color-error)`   | `:user-invalid`, `[aria-invalid="true"]` on the element or a descendant |

When invalid, it also reveals the adjacent `.validator-hint` sibling.

### Usage

```html
<!-- On the input directly -->
<input class="validator input" type="email" required />

<!-- On a wrapper (for custom inputs) -->
<label class="validator">
  <input type="email" required />
</label>
```

> **Note**: `:user-valid` / `:user-invalid` only apply after the user has **blurred** the field — they won't show errors while the user is still typing.

---

## `validator-hint`

An error message that's hidden by default and slides open when the associated `validator` detects an invalid state. Uses `grid-template-rows` animation for a smooth height transition.

### How it works

| State              | Behavior                                                 |
| ------------------ | -------------------------------------------------------- |
| Hidden (default)   | `grid-template-rows: 0fr`, `content-visibility: hidden`  |
| Revealed (invalid) | `grid-template-rows: 1fr`, `content-visibility: visible` |

The transition animates between the two grid states with `allow-discrete` for `content-visibility`.

### Usage

Must be placed **immediately after** a `.validator` element as an adjacent sibling:

```html
<label>
  Email
  <input class="validator input" type="email" required />
  <div class="validator-hint">
    <span>Please enter a valid email address.</span>
  </div>
</label>
```

> **Important**: The hint must be the **next sibling** (`+ .validator-hint`) of the validator element. Wrap the message text in a child element (e.g., `<span>`) to prevent overflow during the animation.

---

## Full example

```html
<form>
  <label class="mb-4 block">
    <span class="text-sm font-medium">Email</span>
    <input class="validator input w-full" type="email" required placeholder="you@example.com" />
    <div class="validator-hint">
      <span>Please enter a valid email address.</span>
    </div>
  </label>

  <label class="mb-4 block">
    <span class="text-sm font-medium">Password</span>
    <input class="validator input w-full" type="password" required minlength="8" />
    <div class="validator-hint">
      <span>Password must be at least 8 characters.</span>
    </div>
  </label>

  <button class="btn btn-primary" type="submit">Submit</button>
</form>
```
