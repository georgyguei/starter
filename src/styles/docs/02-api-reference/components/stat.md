---
title: Stat
description: The stat component — a KPI display with title, value, and description for dashboards and data cards.
related:
  title: Related
  description: Use in layouts with these components.
  links:
    - css-utils/api-reference/components/card
    - css-utils/api-reference/components/divider
---

The `stat` component displays a key performance indicator — a label, a large value, and an optional description.

## Quick reference

| Utility      | Purpose                                               |
| ------------ | ----------------------------------------------------- |
| `stat`       | Wrapper — `flex-col`, `rounded-md`, `p-4`             |
| `stat-title` | Muted label — `text-xs`, 60% opacity                  |
| `stat-value` | Large value — `font-extrabold text-2xl`, tabular nums |
| `stat-desc`  | Description — `text-xs`, 60% opacity                  |

---

## `stat` — Wrapper

```html
<dl class="stat">
  <dt class="stat-title">Total Downloads</dt>
  <dd class="stat-value">31.2K</dd>
  <span class="stat-desc">↗︎ 12% from last month</span>
</dl>
```

> Use `<dl>` for the wrapper, `<dt>` for the title, and `<dd>` for the value. The description uses `<span>` since it's supplementary, not part of the key-value pair.

---

## `stat-title`

Muted, small label. Use `<dt>` for semantic key-value pairing.

```html
<dt class="stat-title">
  <svg class="icon size-3">...</svg>
  Revenue
</dt>
```

| Property  | Value                              |
| --------- | ---------------------------------- |
| Display   | `inline-flex`                      |
| Font size | `text-xs`                          |
| Color     | `var(--color-base-content)` at 60% |

---

## `stat-value`

Large, bold number. Use `<dd>` for semantic key-value pairing.

```html
<dd class="stat-value">$12,450</dd>
<dd class="stat-value text-success">+24%</dd>
```

| Property | Value               |
| -------- | ------------------- |
| Weight   | `font-extrabold`    |
| Size     | `text-2xl`          |
| Numbers  | `proportional-nums` |
| Tracking | `tracking-tight`    |

---

## `stat-desc`

Small descriptive text below the value. Use `<span>` — it's supplementary, not part of the `<dl>` pair.

```html
<span class="stat-desc">↗︎ 400 (22%) more than last week</span>
```

---

## Usage patterns

### Stats grid

```html
<div class="grid grid-cols-3">
  <dl class="stat">
    <dt class="stat-title">Users</dt>
    <dd class="stat-value">4,200</dd>
    <span class="stat-desc">↗︎ 8% this month</span>
  </dl>
  <dl class="stat">
    <dt class="stat-title">Revenue</dt>
    <dd class="stat-value">$12.4K</dd>
    <span class="stat-desc">↘︎ 3% this month</span>
  </dl>
  <dl class="stat">
    <dt class="stat-title">Orders</dt>
    <dd class="stat-value">1,024</dd>
    <span class="stat-desc">↗︎ 12% this month</span>
  </dl>
</div>
```

### Inside a card

```html
<div class="card bg-base-200">
  <div class="card-body">
    <dl class="stat">
      <dd class="stat-value">89.5%</dd>
      <dt class="stat-title">Uptime</dt>
      <span class="stat-desc">Last 30 days</span>
    </dl>
  </div>
</div>
```
