import { createContext, useContext, ReactNode } from 'react';
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
  // Expandable rows
  expandableRender?: (row: T, rowIndex: number) => ReactNode;
  isExpanded: (rowKey: string) => boolean;
  toggleExpand: (rowKey: string) => void;
  expandableEnabled: boolean;
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
