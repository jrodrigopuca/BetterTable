import { useState, useEffect, useCallback, useMemo, RefObject } from 'react';

interface UseVirtualizationOptions {
  /** Ref to the scrollable container */
  containerRef: RefObject<HTMLElement | null>;
  /** Total number of items */
  itemCount: number;
  /** Fixed height per row in pixels */
  rowHeight: number;
  /** Extra rows to render above/below the viewport */
  buffer: number;
  /** Whether virtualization is active */
  enabled: boolean;
}

interface UseVirtualizationResult {
  /** Total height of the virtualized content (px) */
  totalHeight: number;
  /** Index of the first row to render */
  startIndex: number;
  /** Index of the last row to render (exclusive) */
  endIndex: number;
  /** Top offset for the first rendered row (px) */
  offsetTop: number;
}

export function useVirtualization({
  containerRef,
  itemCount,
  rowHeight,
  buffer,
  enabled,
}: UseVirtualizationOptions): UseVirtualizationResult {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Observe scroll position
  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    // Initial measurement
    setContainerHeight(container.clientHeight);
    setScrollTop(container.scrollTop);

    container.addEventListener('scroll', handleScroll, { passive: true });

    // Observe container resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [containerRef, enabled]);

  // Reset scroll when data changes (e.g., after filter/sort)
  const resetScroll = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [containerRef]);

  useEffect(() => {
    if (enabled) {
      resetScroll();
    }
  }, [itemCount, enabled, resetScroll]);

  return useMemo(() => {
    if (!enabled || itemCount === 0) {
      return {
        totalHeight: 0,
        startIndex: 0,
        endIndex: itemCount,
        offsetTop: 0,
      };
    }

    const totalHeight = itemCount * rowHeight;

    // Calculate visible range
    const visibleStart = Math.floor(scrollTop / rowHeight);
    const visibleCount = Math.ceil(containerHeight / rowHeight);

    // Apply buffer
    const startIndex = Math.max(0, visibleStart - buffer);
    const endIndex = Math.min(itemCount, visibleStart + visibleCount + buffer);

    const offsetTop = startIndex * rowHeight;

    return { totalHeight, startIndex, endIndex, offsetTop };
  }, [enabled, itemCount, rowHeight, scrollTop, containerHeight, buffer]);
}
