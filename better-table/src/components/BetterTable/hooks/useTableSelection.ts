import { useState, useCallback, useMemo } from 'react';
import { TableData } from '../types';

interface UseTableSelectionOptions<T extends TableData> {
  data: T[];
  rowKey: keyof T | ((row: T, index: number) => string);
  mode?: 'single' | 'multiple';
  initialSelection?: T[];
  controlledSelection?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
}

interface UseTableSelectionReturn<T extends TableData> {
  selectedRows: T[];
  isSelected: (row: T, index: number) => boolean;
  toggleRow: (row: T, index: number) => void;
  selectRow: (row: T, index: number) => void;
  deselectRow: (row: T, index: number) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  selectedCount: number;
}

export function useTableSelection<T extends TableData>({
  data,
  rowKey,
  mode = 'multiple',
  initialSelection,
  controlledSelection,
  onSelectionChange,
}: UseTableSelectionOptions<T>): UseTableSelectionReturn<T> {
  const [internalSelection, setInternalSelection] = useState<T[]>(
    initialSelection ?? []
  );

  // Usar estado controlado si está disponible
  const selectedRows = controlledSelection ?? internalSelection;

  const getRowKey = useCallback(
    (row: T, index: number): string => {
      if (typeof rowKey === 'function') {
        return rowKey(row, index);
      }
      return String(row[rowKey]);
    },
    [rowKey]
  );

  const selectedKeys = useMemo(() => {
    return new Set(selectedRows.map((row, idx) => getRowKey(row, idx)));
  }, [selectedRows, getRowKey]);

  const isSelected = useCallback(
    (row: T, index: number): boolean => {
      const key = getRowKey(row, index);
      return selectedKeys.has(key);
    },
    [getRowKey, selectedKeys]
  );

  const updateSelection = useCallback(
    (newSelection: T[]) => {
      if (!controlledSelection) {
        setInternalSelection(newSelection);
      }
      onSelectionChange?.(newSelection);
    },
    [controlledSelection, onSelectionChange]
  );

  const toggleRow = useCallback(
    (row: T, index: number) => {
      const key = getRowKey(row, index);
      let newSelection: T[];

      if (mode === 'single') {
        newSelection = selectedKeys.has(key) ? [] : [row];
      } else {
        if (selectedKeys.has(key)) {
          newSelection = selectedRows.filter(
            (r, i) => getRowKey(r, i) !== key
          );
        } else {
          newSelection = [...selectedRows, row];
        }
      }

      updateSelection(newSelection);
    },
    [mode, selectedKeys, selectedRows, getRowKey, updateSelection]
  );

  const selectRow = useCallback(
    (row: T, index: number) => {
      if (!isSelected(row, index)) {
        const newSelection =
          mode === 'single' ? [row] : [...selectedRows, row];
        updateSelection(newSelection);
      }
    },
    [isSelected, mode, selectedRows, updateSelection]
  );

  const deselectRow = useCallback(
    (row: T, index: number) => {
      const key = getRowKey(row, index);
      const newSelection = selectedRows.filter(
        (r, i) => getRowKey(r, i) !== key
      );
      updateSelection(newSelection);
    },
    [selectedRows, getRowKey, updateSelection]
  );

  const selectAll = useCallback(() => {
    if (mode === 'multiple') {
      updateSelection([...data]);
    }
  }, [data, mode, updateSelection]);

  const deselectAll = useCallback(() => {
    updateSelection([]);
  }, [updateSelection]);

  const isAllSelected =
    data.length > 0 && selectedRows.length === data.length;
  const isPartiallySelected =
    selectedRows.length > 0 && selectedRows.length < data.length;

  return {
    selectedRows,
    isSelected,
    toggleRow,
    selectRow,
    deselectRow,
    selectAll,
    deselectAll,
    isAllSelected,
    isPartiallySelected,
    selectedCount: selectedRows.length,
  };
}
