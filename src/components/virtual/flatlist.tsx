"use client";

import { type VirtualItem, useVirtualizer } from "@tanstack/react-virtual";
import {
  type ComponentPropsWithoutRef,
  type JSX,
  type ReactNode,
  type Ref,
  type UIEvent,
  memo,
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

import { cn } from "@repo/utils/classes";

/**--------------------------------------------------------------------------------
 * FlatList — a React Native-style virtualized list built on
 * @tanstack/react-virtual.
 *
 * Renders only the items visible in the scroll container (plus overscan),
 * keeping the DOM small for very large lists.
 *
 * Item sizes are measured dynamically by default — every mounted row is
 * observed with a ResizeObserver (border-box size), so rows of any height
 * work out of the box and re-measure automatically when their content
 * changes. `estimateSize` is only the initial guess used before the first
 * measurement.
 *
 * Re-renders are minimized with `directDomUpdates`: the virtualizer writes
 * item positions and the container size straight to the DOM while scrolling,
 * so React only re-renders when the visible range changes or scrolling
 * starts/stops — not on every scroll frame.
 *
 * Programmatic actions (`scrollToIndex`, `scrollToOffset`, …) are exposed
 * through the imperative handle returned via `ref`.
 * --------------------------------------------------------------------------------*/

/** Info passed to `renderItem`. */
export interface FlatListInfo<T> {
  /** The data item for this row. */
  item: T;
  /** The index of this row in `data`. */
  index: number;
  /** Extra data passed to the FlatList, for re-rendering when it changes. */
  extraData?: unknown;
}

/** Info passed to `ItemSeparatorComponent` when it is a render function. */
export interface FlatListSeparatorInfo<T> extends FlatListInfo<T> {
  /** The item rendered before the separator. */
  leadingItem: T;
  /** The item rendered after the separator. */
  trailingItem: T;
  leadingIndex: number;
  trailingIndex: number;
}

/** Options for programmatic scroll actions (all FlatListHandle actions). */
export interface FlatListScrollOptions {
  /**
   * A value of 0 places the item at the start edge (top/left), 1 places its
   * end edge at the end of the viewport (bottom/right), and 0.5 centers it.
   * Any value between 0 and 1 interpolates. Default 0.
   *
   * Used by `scrollToIndex` — the position of the item within the viewport.
   * `scrollToOffset`, `scrollToStart` and `scrollToEnd` have no item
   * reference, so `viewPosition` has no effect there; only `viewOffset`
   * shifts those targets.
   */
  viewPosition?: number;
  /**
   * Fixed number of pixels offset from the final target position.
   * Positive pushes the target further from the start edge.
   * Applies to every scroll action.
   */
  viewOffset?: number;
  behavior?: ScrollBehavior;
}

/**
 * Imperative handle exposed through `ref`.
 *
 * ```tsx
 * const listRef = useRef<FlatListHandle>(null);
 * <FlatList ref={listRef} … />
 * listRef.current?.scrollToIndex(500, { viewPosition: 0.5, behavior: "smooth" });
 * ```
 */
export interface FlatListHandle {
  /** Scrolls so the item at `index` is visible. */
  scrollToIndex: (index: number, options?: FlatListScrollOptions) => void;
  /** Scrolls to an absolute pixel offset. */
  scrollToOffset: (offset: number, options?: FlatListScrollOptions) => void;
  /** Scrolls to the top (start of the list). */
  scrollToStart: (options?: FlatListScrollOptions) => void;
  /** Scrolls to the bottom (end of the list). */
  scrollToEnd: (options?: FlatListScrollOptions) => void;
  /** Re-measures all mounted items (use after content size changes). */
  measure: () => void;
  /** The currently mounted virtual items. */
  getVirtualItems: () => VirtualItem[];
  /** The scroll container element. */
  readonly element: HTMLDivElement | null;
}

export interface FlatListProps<T> extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** Ref to the imperative handle (`FlatListHandle`) for programmatic actions. */
  ref?: Ref<FlatListHandle>;
  /** The data to render. */
  data: readonly T[];
  /** Renders one item. Receives `{ item, index }`. */
  renderItem: (info: FlatListInfo<T>) => ReactNode;
  /** Stable unique key per item. Defaults to the index. */
  keyExtractor?: (item: T, index: number) => string;
  /** Extra data for re-rendering when it changes. */
  extraData?: unknown;
  /** Rendered above the virtualized items, scrolls with the list. */
  ListHeaderComponent?: ReactNode;
  /** Rendered below the virtualized items, scrolls with the list. */
  ListFooterComponent?: ReactNode;
  /** Rendered when `data` is empty. */
  ListEmptyComponent?: ReactNode;
  /** Rendered between items (skipped after the last item). Element or render function. */
  ItemSeparatorComponent?: ReactNode | ((info: FlatListSeparatorInfo<T>) => ReactNode);
  /** Lay the list out horizontally instead of vertically. */
  horizontal?: boolean;
  /**
   * Start the list scrolled so the item at this index sits at the start
   * edge (like React Native's `initialScrollIndex`). Applied once on
   * mount, before the first paint — items around the index are rendered
   * immediately, so there is no blank flash. The position is computed from
   * `estimateSize` and settles once the items are measured.
   */
  initialScrollIndex?: number;
  /**
   * Initial item size estimate in px, used before the first measurement.
   * Items are measured dynamically (ResizeObserver, border-box size) by
   * default, so this only affects the first paint and scroll estimation.
   * Number or per-index function.
   */
  estimateSize?: number | ((index: number) => number);
  /** Number of extra items rendered beyond the viewport. Default 5. */
  overscan?: number;
  /**
   * Spacing in px between items. Unlike CSS gap, this is accounted for in
   * each item's position and the total size — works with virtualized
   * absolute positioning. Default 0.
   */
  gap?: number;
  /**
   * Space in px before the first item — the container's start offset.
   * Included in positions and total size. Default 0.
   */
  paddingStart?: number;
  /** Space in px after the last item — the container's end offset. Default 0. */
  paddingEnd?: number;
  /**
   * Insets used only for scroll alignment (like CSS scroll-padding):
   * `scrollToIndex(0, { align: "start" })` stops at
   * `paddingStart + scrollPaddingStart`. Does not affect layout.
   */
  scrollPaddingStart?: number;
  scrollPaddingEnd?: number;
  /**
   * Skip React re-renders for scroll-only updates — the virtualizer writes
   * item positions and the container size directly to the DOM and React only
   * re-renders when the visible range or scrolling state changes.
   * Enabled by default for performance; only disable if you style item
   * position yourself.
   */
  directDomUpdates?: boolean;
  /**
   * How `directDomUpdates` positions item elements.
   * - `"position"` (default): writes `top`/`left` — no transform, so no
   *   containing block or stacking context is created. Required for items
   *   that host CSS anchor positioning or `position: fixed` descendants
   *   (tooltips, popovers).
   * - `"transform"`: writes `translate3d` — compositor-only movement,
   *   smoother on long lists, but breaks anchor positioning and fixed
   *   descendants inside items.
   */
  directDomUpdatesMode?: "position" | "transform";
  /** Fired once per scroll operation (via `scrollend`) when the scroll nears the end.
   * Re-arms after scrolling away, and re-fires when new data arrives while the list
   * still fits the viewport. */
  onEndReached?: (info: { distanceFromEnd: number }) => void;
  /**
   * How close to the end (in multiples of the visible viewport length) before
   * `onEndReached` fires. React Native default is `0.5`.
   */
  onEndReachedThreshold?: number;
}

const defaultKeyExtractor = <T,>(_item: T, index: number) => String(index);

/** `useLayoutEffect` on the client, `useEffect` on the server (SSR-safe). */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**---------------------------------------------------------------------------------
 * FlatList Component
 * ---------------------------------------------------------------------------------*/
function FlatList<T>({
  data,
  renderItem,
  keyExtractor = defaultKeyExtractor,
  extraData,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  ItemSeparatorComponent,
  horizontal = false,
  initialScrollIndex,
  estimateSize = 48,
  overscan = 5,
  gap = 0,
  paddingStart = 0,
  paddingEnd = 0,
  scrollPaddingStart = 0,
  scrollPaddingEnd = 0,
  directDomUpdates = true,
  directDomUpdatesMode = "position",
  onEndReached,
  onEndReachedThreshold = 0.5,
  className,
  onScrollEnd,
  ref,
  ...remainingProps
}: FlatListProps<T>) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const firedLength = useRef(-1);
  const didInitialScroll = useRef(false);

  const estimateFn = typeof estimateSize === "function" ? estimateSize : () => estimateSize;

  /** Estimated content start of `index` (pure estimates — no measurements). */
  const estimatedStartOf = (index: number): number => {
    let start = paddingStart;
    for (let i = 0; i < index; i++) {
      start += estimateFn(i) + gap;
    }
    return start;
  };

  /** Clamped initial index, or `null` when not provided. */
  const initialIndex = initialScrollIndex != null ? Math.min(Math.max(initialScrollIndex, 0), Math.max(0, data.length - 1)) : null;

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => scrollRef.current,
    getItemKey: (index) => keyExtractor(data[index], index),
    estimateSize: estimateFn,
    // Seeds the virtualizer's internal scroll position so the FIRST render
    // already mounts the items around `initialScrollIndex` (no blank flash).
    // Note: the library does NOT write this offset to the DOM — see the
    // layout effect below.
    initialOffset: initialIndex != null && initialIndex > 0 ? estimatedStartOf(initialIndex) : undefined,
    overscan,
    horizontal,
    gap,
    paddingStart,
    paddingEnd,
    scrollPaddingStart,
    scrollPaddingEnd,
    directDomUpdates,
    directDomUpdatesMode,
  });

  /** Applies `initialScrollIndex` to the scroll element once, before paint. */
  useIsomorphicLayoutEffect(() => {
    if (didInitialScroll.current || initialIndex == null || initialIndex === 0) {
      return;
    }
    didInitialScroll.current = true;
    const element = scrollRef.current;
    if (!element) {
      return;
    }
    const offset = estimatedStartOf(initialIndex);
    const max = Math.max(0, horizontal ? element.scrollWidth - element.clientWidth : element.scrollHeight - element.clientHeight);
    element.scrollTo({
      [horizontal ? "left" : "top"]: Math.min(offset, max),
      behavior: "auto",
    });
  }, []);

  /** Imperative actions for programmatic control (React 19 ref-as-prop). */
  useImperativeHandle(ref, () => {
    // oxlint-disable-next-line no-shadow -- `estimateFn` is a stable identity, so it's safe to capture here.
    const estimateFn = typeof estimateSize === "function" ? estimateSize : () => estimateSize;

    /** Estimated content start coordinate of `index` (for unmeasured items). */
    const estimateStartFor = (index: number): number => {
      let start = paddingStart;
      for (let i = 0; i < index; i++) {
        const measured = virtualizer.measurementsCache[i];
        start += (measured ? measured.size : estimateFn(i)) + gap;
      }
      return start;
    };

    /**
     * Re-measures every mounted item in place.
     *
     * Deliberately NOT `virtualizer.measure()`: in virtual-core ≥ 3.17 that
     * clears the item-size cache, and React does not re-run refs on
     * unchanged nodes, so unchanged items stay stuck at their estimates.
     * `measureElement(node)` reads the live DOM size and only writes when
     * it actually differs.
     */
    const measureMounted = () => {
      const element = scrollRef.current;
      if (element) {
        element.querySelectorAll("[data-index]").forEach((node) => {
          virtualizer.measureElement(node);
        });
      }
    };

    /**
     * Shared pipeline for every scroll action:
     * 1. re-measure mounted items so targets are computed from settled
     *    sizes,
     * 2. resolve the action's target `start` coordinate and reference
     *    `size` (post-measure, viewport-aware),
     * 3. apply `viewPosition`/`viewOffset`,
     * 4. clamp to the scrollable range,
     * 5. scroll with `behavior`.
     */
    const scrollToResolved = (resolve: (viewport: number) => { start: number; size: number }, options?: FlatListScrollOptions) => {
      const { viewPosition = 0, viewOffset = 0, behavior } = options ?? {};
      // Refresh measurements so the target is computed from settled
      // sizes — dynamic lists otherwise drift while measuring.
      measureMounted();

      const element = scrollRef.current;
      if (!element) {
        return;
      }
      const viewport = horizontal ? element.clientWidth : element.clientHeight;

      const { start, size } = resolve(viewport);

      // The target's start edge lands at `viewPosition` along the
      // viewport (relative to `size` — the item for scrollToIndex, the
      // viewport itself for the other actions), shifted by `viewOffset` px.
      const visual = viewPosition * (viewport - size) + viewOffset;
      const target = start - visual;

      const maxOffset = virtualizer.getOffsetForAlignment(virtualizer.getTotalSize(), "end");
      virtualizer.scrollToOffset(Math.max(0, Math.min(target, maxOffset)), {
        align: "start",
        behavior,
      });
    };

    return {
      scrollToIndex: (index, options) => {
        scrollToResolved(() => {
          const measured = virtualizer.measurementsCache[index];
          return {
            start: measured ? measured.start : estimateStartFor(index),
            size: measured ? measured.size : estimateFn(index),
          };
        }, options);
      },
      scrollToOffset: (toOffset, options) => {
        scrollToResolved((viewport) => ({ start: toOffset, size: viewport }), options);
      },
      scrollToStart: (options) => {
        scrollToResolved((viewport) => ({ start: 0, size: viewport }), options);
      },
      scrollToEnd: (options) => {
        scrollToResolved(
          (viewport) => ({
            start: virtualizer.getOffsetForAlignment(virtualizer.getTotalSize(), "end"),
            size: viewport,
          }),
          options,
        );
      },
      measure: () => measureMounted(),
      getVirtualItems: () => virtualizer.getVirtualItems(),
      get element() {
        return scrollRef.current;
      },
    };
  }, [virtualizer, horizontal, gap, paddingStart, estimateSize]);

  const virtualItems = virtualizer.getVirtualItems();

  /** Computes the distance to the end and fires `onEndReached` at most once
   * per data length while within threshold. */
  const checkEndReached = () => {
    const element = scrollRef.current;
    if (element && onEndReached) {
      const viewportSize = horizontal ? element.clientWidth : element.clientHeight;
      const scrollSize = horizontal ? element.scrollWidth : element.scrollHeight;
      const scrollOffset = horizontal ? element.scrollLeft : element.scrollTop;
      const distanceFromEnd = scrollSize - scrollOffset - viewportSize;

      if (distanceFromEnd <= viewportSize * onEndReachedThreshold) {
        if (firedLength.current !== data.length) {
          firedLength.current = data.length;
          onEndReached({ distanceFromEnd });
        }
      } else {
        firedLength.current = -1; // re-arm after scrolling away from the end
      }
    }
  };

  /** `scrollend` fires once per scroll operation, after momentum settles. */
  const handleScrollEnd = (event: UIEvent<HTMLDivElement>) => {
    checkEndReached();
    onScrollEnd?.(event);
  };

  /** Effect event — stable identity, always reads the latest values. */
  const checkFitsViewport = useEffectEvent(() => {
    const element = scrollRef.current;
    if (element && onEndReached) {
      const scrollable = horizontal ? element.scrollWidth > element.clientWidth : element.scrollHeight > element.clientHeight;
      // Only the fits-viewport case needs the re-check — overflowing lists
      // are fully driven by `scrollend` above.
      if (!scrollable) {
        checkEndReached();
      }
    }
  });

  /** Runs only when the data length or orientation changes. */
  // biome-ignore lint/correctness/useExhaustiveDependencies: The effect intentionally only runs when the data length or orientation changes, not on every render.
  useEffect(() => {
    checkFitsViewport();
  }, [data.length, horizontal]);

  if (data.length === 0) {
    return (
      <div ref={scrollRef} className={cn(className)} onScrollEnd={handleScrollEnd} {...remainingProps}>
        {ListEmptyComponent}
      </div>
    );
  }

  return (
    <div ref={scrollRef} className={cn("overflow-auto", horizontal && "flex", className)} onScrollEnd={handleScrollEnd} {...remainingProps}>
      {ListHeaderComponent}

      {/* Size container — with directDomUpdates the virtualizer owns
          height/width and writes them straight to the DOM; otherwise React
          renders them. */}
      <ul
        ref={directDomUpdates ? virtualizer.containerRef : undefined}
        className="relative"
        style={{
          // The scroll element is a flex container in horizontal mode, and a
          // flex item shrinks by default — that would collapse the virtual
          // size (2400px → viewport width) and break the scrollable extent.
          // Keep this element rigid so its size is exactly the total size.
          flexShrink: 0,
          ...(directDomUpdates
            ? null
            : {
                height: horizontal ? "100%" : virtualizer.getTotalSize(),
                width: horizontal ? virtualizer.getTotalSize() : "100%",
              }),
        }}
      >
        {virtualItems.map((virtualItem) => {
          const item = data[virtualItem.index];
          const isLast = virtualItem.index === data.length - 1;

          return (
            <li
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: horizontal ? undefined : "100%",
                // Fill the cross axis in horizontal lists so full-height
                // content (e.g. carousel slides) sizes against the scroll
                // container.
                height: horizontal ? "100%" : undefined,
                // Main-axis position (transform): owned by the virtualizer in
                // directDomUpdates mode, rendered by React otherwise.
                ...(directDomUpdates
                  ? {}
                  : {
                      transform: horizontal ? `translateX(${virtualItem.start}px)` : `translateY(${virtualItem.start}px)`,
                    }),
              }}
            >
              {renderItem({ item, index: virtualItem.index, extraData })}

              {!isLast && ItemSeparatorComponent != null
                ? typeof ItemSeparatorComponent === "function"
                  ? (ItemSeparatorComponent as (info: FlatListSeparatorInfo<T>) => ReactNode)({
                      item,
                      index: virtualItem.index,
                      leadingItem: item,
                      trailingItem: data[virtualItem.index + 1],
                      leadingIndex: virtualItem.index,
                      trailingIndex: virtualItem.index + 1,
                    })
                  : ItemSeparatorComponent
                : null}
            </li>
          );
        })}
      </ul>

      {ListFooterComponent}
    </div>
  );
}

export default memo(FlatList) as <T>(props: FlatListProps<T>) => JSX.Element;
