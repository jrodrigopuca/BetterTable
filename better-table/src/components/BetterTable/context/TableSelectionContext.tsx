import { createContext, useContext } from 'react';
import { TableData } from '../types';

export interface TableSelectionContextValue<T extends TableData = TableData> {
  selectedRows: T[];
  isSelected: (row: T, index: number) => boolean;
  toggleRow: (row: T, index: number) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  selectedCount: number;
  selectable: boolean;
  selectionMode: 'single' | 'multiple';
}

const TableSelectionContext = createContext<TableSelectionContextValue | null>(null);

export function useTableSelectionContext<T extends TableData>(): TableSelectionContextValue<T> {
  const context = useContext(TableSelectionContext);
  if (!context) {
    throw new Error('useTableSelectionContext must be used within a TableProvider');
  }
  return context as TableSelectionContextValue<T>;
}

export const TableSelectionProvider = TableSelectionContext.Provider;
