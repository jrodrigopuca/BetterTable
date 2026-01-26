import { useState, useCallback, useMemo } from 'react';
import { TableData, Column } from '../types';
import { searchData } from '../utils/filterData';

interface UseTableSearchOptions<T extends TableData> {
  data: T[];
  columns: Column<T>[];
  searchColumns?: string[];
  initialValue?: string;
  controlledValue?: string;
  onSearchChange?: (value: string) => void;
  debounceMs?: number;
}

interface UseTableSearchReturn<T extends TableData> {
  searchedData: T[];
  searchValue: string;
  handleSearch: (value: string) => void;
  clearSearch: () => void;
}

export function useTableSearch<T extends TableData>({
  data,
  columns,
  searchColumns,
  initialValue,
  controlledValue,
  onSearchChange,
}: UseTableSearchOptions<T>): UseTableSearchReturn<T> {
  const [internalValue, setInternalValue] = useState(initialValue ?? '');

  // Usar valor controlado si está disponible
  const searchValue = controlledValue ?? internalValue;

  const handleSearch = useCallback(
    (value: string) => {
      if (controlledValue === undefined) {
        setInternalValue(value);
      }
      onSearchChange?.(value);
    },
    [controlledValue, onSearchChange]
  );

  const clearSearch = useCallback(() => {
    if (controlledValue === undefined) {
      setInternalValue('');
    }
    onSearchChange?.('');
  }, [controlledValue, onSearchChange]);

  const searchedData = useMemo(() => {
    return searchData(data, searchValue, columns, searchColumns);
  }, [data, searchValue, columns, searchColumns]);

  return { searchedData, searchValue, handleSearch, clearSearch };
}
