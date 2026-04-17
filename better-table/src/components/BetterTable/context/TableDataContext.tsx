import { createContext, useContext } from 'react';
import { TableData, Column, RowAction, GlobalAction } from '../types';

export interface TableDataContextValue<T extends TableData = TableData> {
  data: T[];
  processedData: T[];
  columns: Column<T>[];
  visibleColumns: Column<T>[];
  rowKey: keyof T | ((row: T, index: number) => string);
  rowActions?: RowAction<T>[];
  globalActions?: GlobalAction<T>[];
  maxVisibleActions: number;
}

const TableDataContext = createContext<TableDataContextValue | null>(null);

export function useTableData<T extends TableData>(): TableDataContextValue<T> {
  const context = useContext(TableDataContext);
  if (!context) {
    throw new Error('useTableData must be used within a TableProvider');
  }
  return context as TableDataContextValue<T>;
}

export const TableDataProvider = TableDataContext.Provider;
