import { useState, useCallback, useRef, useEffect } from 'react';
import { Column, TableData } from '../types';

const DEFAULT_MIN_WIDTH = 50;

interface UseColumnResizeOptions<T extends TableData> {
  columns: Column<T>[];
  enabled: boolean;
  minWidth?: number;
  maxWidth?: number;
  onColumnResize?: (columnId: string, width: number) => void;
  tableRef: React.RefObject<HTMLTableElement | null>;
}

interface UseColumnResizeReturn {
  /** Current column widths (only populated for resized columns) */
  columnWidths: Record<string, number>;
  /** Whether a resize is currently in progress */
  isResizing: boolean;
  /** Start resizing a column */
  startResize: (columnId: string, startX: number) => void;
  /** Get effective width for a column (resized width or initial width) */
  getColumnWidth: (columnId: string) => number | undefined;
  /** Reset all column widths to initial */
  resetColumnWidths: () => void;
}

export function useColumnResize<T extends TableData>({
  columns,
  enabled,
  minWidth = DEFAULT_MIN_WIDTH,
  maxWidth,
  onColumnResize,
  tableRef,
}: UseColumnResizeOptions<T>): UseColumnResizeReturn {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [isResizing, setIsResizing] = useState(false);

  const resizeState = useRef<{
    columnId: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  const getInitialWidth = useCallback(
    (columnId: string): number => {
      if (!tableRef.current) return 150;
      const th = tableRef.current.querySelector(`th[data-column-id="${columnId}"]`);
      return th ? th.getBoundingClientRect().width : 150;
    },
    [tableRef]
  );

  const startResize = useCallback(
    (columnId: string, startX: number) => {
      if (!enabled) return;

      const startWidth = columnWidths[columnId] ?? getInitialWidth(columnId);
      resizeState.current = { columnId, startX, startWidth };
      setIsResizing(true);
    },
    [enabled, columnWidths, getInitialWidth]
  );

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeState.current) return;
      e.preventDefault();

      const { columnId, startX, startWidth } = resizeState.current;
      const diff = e.clientX - startX;
      let newWidth = Math.max(startWidth + diff, minWidth);
      if (maxWidth !== undefined) {
        newWidth = Math.min(newWidth, maxWidth);
      }

      // Per-column constraints
      const col = columns.find((c) => c.id === columnId);
      if (col) {
        const colMin = col.minWidth ?? minWidth;
        const colMax = col.maxWidth ?? maxWidth;
        newWidth = Math.max(newWidth, colMin);
        if (colMax !== undefined) {
          newWidth = Math.min(newWidth, colMax);
        }
      }

      setColumnWidths((prev) => ({ ...prev, [columnId]: newWidth }));
    };

    const handleMouseUp = () => {
      if (resizeState.current) {
        const { columnId } = resizeState.current;
        const width = columnWidths[columnId];
        if (width !== undefined && onColumnResize) {
          onColumnResize(columnId, width);
        }
      }
      resizeState.current = null;
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Prevent text selection during resize
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizing, columnWidths, columns, minWidth, maxWidth, onColumnResize]);

  const getColumnWidth = useCallback(
    (columnId: string): number | undefined => {
      return columnWidths[columnId];
    },
    [columnWidths]
  );

  const resetColumnWidths = useCallback(() => {
    setColumnWidths({});
  }, []);

  return {
    columnWidths,
    isResizing,
    startResize,
    getColumnWidth,
    resetColumnWidths,
  };
}
