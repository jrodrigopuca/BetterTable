import { useState, useCallback, useMemo } from 'react';

export interface UseExpandableRowsOptions {
  /** Controlled expanded row keys */
  controlledExpandedRows?: string[];
  /** Callback when expanded rows change */
  onExpandChange?: (expandedRows: string[]) => void;
  /** Only allow one row expanded at a time */
  accordion?: boolean;
}

export interface UseExpandableRowsReturn {
  /** Set of currently expanded row keys */
  expandedRowKeys: Set<string>;
  /** Check if a row is expanded */
  isExpanded: (rowKey: string) => boolean;
  /** Toggle a row's expanded state */
  toggleExpand: (rowKey: string) => void;
  /** Collapse all rows */
  collapseAll: () => void;
}

export function useExpandableRows({
  controlledExpandedRows,
  onExpandChange,
  accordion = false,
}: UseExpandableRowsOptions): UseExpandableRowsReturn {
  const [internalExpanded, setInternalExpanded] = useState<string[]>([]);

  const isControlled = controlledExpandedRows !== undefined;
  const expandedArray = isControlled ? controlledExpandedRows : internalExpanded;

  const expandedRowKeys = useMemo(
    () => new Set(expandedArray),
    [expandedArray]
  );

  const updateExpanded = useCallback(
    (next: string[]) => {
      if (!isControlled) {
        setInternalExpanded(next);
      }
      onExpandChange?.(next);
    },
    [isControlled, onExpandChange]
  );

  const isExpanded = useCallback(
    (rowKey: string) => expandedRowKeys.has(rowKey),
    [expandedRowKeys]
  );

  const toggleExpand = useCallback(
    (rowKey: string) => {
      if (expandedRowKeys.has(rowKey)) {
        updateExpanded(expandedArray.filter((k) => k !== rowKey));
      } else if (accordion) {
        updateExpanded([rowKey]);
      } else {
        updateExpanded([...expandedArray, rowKey]);
      }
    },
    [expandedRowKeys, expandedArray, accordion, updateExpanded]
  );

  const collapseAll = useCallback(() => {
    updateExpanded([]);
  }, [updateExpanded]);

  return {
    expandedRowKeys,
    isExpanded,
    toggleExpand,
    collapseAll,
  };
}
