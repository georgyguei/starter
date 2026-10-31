---
title: Components
description: API reference for component-level UI primitives — one file per component.
---

Component utilities are **full UI primitives** built with `@utility` and `@layer components` nesting. Unlike shortcuts or compositions, they handle state (hover, active, disabled, checked), provide multiple variant categories, and are designed to be combined together on a single element.

| Component | File | Utilities |
|---|---|---|| [Alert](/docs/css-utils/api-reference/components/alert) | `components/alert.css` | `alert`, `alert-*`, `alert-soft`, `alert-outline`, `alert-vertical`, `alert-horizontal` |
| [Avatar](/docs/css-utils/api-reference/components/avatar) | `components/avatar.css` | `avatar`, `avatar-group`, `avatar-fallback` |
| [Badge](/docs/css-utils/api-reference/components/badge) | `components/badge.css` | `badge`, `badge-*`, `badge-plain`, `badge-outline`, `badge-soft`, `badge-xs`–`badge-xl` |
| [Breadcrumbs](/docs/css-utils/api-reference/components/breadcrumbs) | `components/breadcrumbs.css` | `breadcrumbs`, `breadcrumbs-chevron`, `breadcrumbs-slash`, `breadcrumbs-dot`, `breadcrumbs-pipe` |
| [Button](/docs/css-utils/api-reference/components/btn) | `components/btn.css` | `btn`, `btn-*`, `btn-active`, `btn-plain`, `btn-link`, `btn-ghost`, `btn-outline`, `btn-soft`, `btn-square`, `btn-circle`, `btn-xs`–`btn-xl` |
| [Card](/docs/css-utils/api-reference/components/card) | `components/card.css` | `card`, `card-body`, `card-title`, `card-overlay`, `card-action`, `card-xs`–`card-lg` |
| [Carousel](/docs/css-utils/api-reference/components/carousel) | `components/carousel.css` | `carousel`, `carousel-vertical`, `carousel-horizontal`, `carousel-item`, `carousel-start`/`center`/`end`, `carousel-page`, `carousel-buttons`, `carousel-markers`, `carousel-columns`, `carousel-column-item`, `carousel-column-markers` |
| [Checkbox](/docs/css-utils/api-reference/components/checkbox) | `components/checkbox.css` | `checkbox`, `checkbox-*`, `checkbox-xs`–`checkbox-xl` |
| [Collapse](/docs/css-utils/api-reference/components/collapse) | `components/collapse.css` | `collapse`, `collapse-arrow`, `collapse-plus`, `collapse-title`, `collapse-content`, `collapse-trigger` |
| [Dialog](/docs/css-utils/api-reference/components/dialog) | `components/dialog.css` | `dialog`, `dialog-*`, `dialog-modal`, `dialog-animated`, `dialog-top`, `dialog-center`, `dialog-bottom`, `dialog-cover`, `dialog-full`, `dialog-offset-*` |
| [Divider](/docs/css-utils/api-reference/components/divider) | `components/divider.css` | `divider`, `divider-*`, `divider-horizontal`, `divider-start`, `divider-end` |
| [Expandable](/docs/css-utils/api-reference/components/expandable) | `components/expandable.css` | `expandable` |
| [FAB](/docs/css-utils/api-reference/components/fab) | `components/fab.css` | `fab`, `fab-close`, `fab-main-action`, `fab-flower` |
| [Field](/docs/css-utils/api-reference/components/field) | `components/field.css` | `field`, `field-legend` |
| [Float](/docs/css-utils/api-reference/components/float) | `components/float.css` | `float-top-start`, `float-top-center`, `float-top-end`, `float-middle-start`, `float-middle-center`, `float-middle-end`, `float-bottom-start`, `float-bottom-center`, `float-bottom-end` |
| [Drawer](/docs/css-utils/api-reference/components/drawer) | `components/drawer.css` | `drawer`, `drawer-*`, `drawer-modal`, `drawer-animated`, `drawer-top`, `drawer-bottom`, `drawer-left`, `drawer-right`, `drawer-offset-*` |
| [Icon](/docs/css-utils/api-reference/components/icon) | `components/icon.css` | `icon` |
| [Input](/docs/css-utils/api-reference/components/input) | `components/input.css` | `input`, `input-*`, `input-ghost`, `input-soft`, `input-flushed`, `input-no-spin`, `input-xs`–`input-xl`, `input-square` |
| [Join](/docs/css-utils/api-reference/components/join) | `components/join.css` | `join`, `join-vertical`, `join-item`, `join-rounded-*` |
| [Kbd](/docs/css-utils/api-reference/components/kbd) | `components/kbd.css` | `kbd`, `kbd-xs`–`kbd-xl` |
| [List](/docs/css-utils/api-reference/components/list) | `components/list.css` | `list`, `list-row`, `list-col-grow`, `list-col-wrap` |
| [Link](/docs/css-utils/api-reference/components/link) | `components/link.css` | `link`, `link-box`, `link-overlay` |
| [Loading](/docs/css-utils/api-reference/components/loading) | `components/loading.css` | `loading`, `loading-spinner`, `loading-dots`, `loading-ring`, `loading-ball`, `loading-bars`, `loading-infinity`, `loading-pulse`, `loading-ripple`, `loading-square`, `loading-clock`, `loading-orbit`, `loading-gradient`, `loading-dots-horizontal`, `loading-grid`, `loading-xs`–`loading-xl` |
| [Mask](/docs/css-utils/api-reference/components/mask) | `components/mask.css` | `mask`, `mask-half-1`, `mask-half-2`, `mask-squircle`, `mask-circle`, `mask-diamond`, `mask-triangle`, `mask-pentagon`, `mask-hexagon`, `mask-hexagon-2`, `mask-decagon`, `mask-star`, `mask-star-2`, `mask-heart` |
| [Menu](/docs/css-utils/api-reference/components/menu) | `components/menu.css` | `menu`, `menu-*`, `menu-active`, `menu-title`, `menu-horizontal`, `menu-vertical` |
| [Popover](/docs/css-utils/api-reference/components/popover) | `components/popover.css` | `popover`, `popover-*`, `popover-top`/`bottom`/`left`/`right` (+start/end), `popover-arrow`, `popover-modal`, `popover-animated`, `popover-offset-*`, interest invokers (`interestfor` + `popover="hint"`), `interest-delay-*`/`interest-delay-start-*`/`interest-delay-end-*` |
| [Progress](/docs/css-utils/api-reference/components/progress) | `components/progress.css` | `progress`, `progress-radial`, `progress-radial-filled`, `progress-xs`–`progress-xl`, `progress-size-*`, `progress-thickness-*`, `progress-duration-*`, `progress-color-*`, `progress-track-*`, `progress-fill-*` |
| [Stack](/docs/css-utils/api-reference/components/stack) | `components/stack.css` | `stack`, `stack-top`, `stack-bottom`, `stack-start`, `stack-end` |
| [Stat](/docs/css-utils/api-reference/components/stat) | `components/stat.css` | `stat`, `stat-title`, `stat-value`, `stat-desc` |
| [Status](/docs/css-utils/api-reference/components/status) | `components/status.css` | `status`, `status-*`, `status-gloss`, `status-ring`, `status-xs`–`status-lg` |
| [Swap](/docs/css-utils/api-reference/components/swap) | `components/swap.css` | `swap`, `swap-fade`, `swap-rotate`, `swap-flip`, `swap-slide` |
| [Tabs](/docs/css-utils/api-reference/components/tab) | `components/tab.css` | `tabs`, `tab`, `tab-*`, `tab-content`, `tab-indicator`, `tabs-anchor-*`, `tabs-flushed`, `tabs-box`, `tabs-lift`, `tabs-vertical`, `tabs-reverse` |
| [Tooltip](/docs/css-utils/api-reference/components/tooltip) | `components/tooltip.css` | `tooltip`, `tooltip-*`, `tooltip-top`/`bottom`/`left`/`right` (+start/end), `tooltip-arrow`, `tooltip-content`, `tooltip-animated`, `tooltip-interactive`, `tooltip-offset-*`, `tooltip-anchor-*` (Chrome-first path: interest invokers) |
| [Toggle](/docs/css-utils/api-reference/components/toggle) | `components/toggle.css` | `toggle`, `toggle-*`, `toggle-outline`, `toggle-soft`, `toggle-xs`–`toggle-xl` |
| [Validator](/docs/css-utils/api-reference/components/validator) | `components/validator.css` | `validator`, `validator-hint` |
