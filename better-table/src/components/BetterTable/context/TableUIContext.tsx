import { createContext, useContext, ReactNode } from 'react';
import { TableData, TableLocale, TableClassNames, Column } from '../types';

export interface TableUIContextValue<T extends TableData = TableData> {
  locale: TableLocale;
  classNames: TableClassNames;
  size: 'small' | 'medium' | 'large';
  bordered: boolean;
  striped: boolean;
  hoverable: boolean;
  stickyHeader: boolean;
  loading: boolean;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  onRowClick?: (row: T, rowIndex: number) => void;
  onRowDoubleClick?: (row: T, rowIndex: number) => void;
  // Modal
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  modalContent: ReactNode | null;
  isModalOpen: boolean;
  // Column Visibility
  columnVisibilityEnabled: boolean;
  hiddenColumnIds: Set<string>;
  toggleColumn: (columnId: string) => void;
  showAllColumns: () => void;
  isColumnVisible: (columnId: string) => boolean;
  columns: Column<T>[];
}

const TableUIContext = createContext<TableUIContextValue | null>(null);

export function useTableUI<T extends TableData>(): TableUIContextValue<T> {
  const context = useContext(TableUIContext);
  if (!context) {
    throw new Error('useTableUI must be used within a TableProvider');
  }
  return context as TableUIContextValue<T>;
}

export const TableUIProvider = TableUIContext.Provider;
