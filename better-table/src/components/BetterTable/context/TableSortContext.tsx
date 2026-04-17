import { createContext, useContext } from 'react';
import { SortState, MultiSortState } from '../types';

export interface TableSortContextValue {
  sortState: SortState;
  handleSort: (columnId: string) => void;
  multiSortState: MultiSortState;
  isMultiSort: boolean;
  clearSort: () => void;
}

const TableSortContext = createContext<TableSortContextValue | null>(null);

export function useTableSortContext(): TableSortContextValue {
  const context = useContext(TableSortContext);
  if (!context) {
    throw new Error('useTableSortContext must be used within a TableProvider');
  }
  return context;
}

export const TableSortProvider = TableSortContext.Provider;
