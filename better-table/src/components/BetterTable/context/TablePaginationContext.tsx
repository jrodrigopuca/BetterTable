import { createContext, useContext } from 'react';

export interface TablePaginationContextValue {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
  paginationEnabled: boolean;
  pageSizeOptions: number[];
  showSizeChanger: boolean;
}

const TablePaginationContext = createContext<TablePaginationContextValue | null>(null);

export function useTablePaginationContext(): TablePaginationContextValue {
  const context = useContext(TablePaginationContext);
  if (!context) {
    throw new Error('useTablePaginationContext must be used within a TableProvider');
  }
  return context;
}

export const TablePaginationProvider = TablePaginationContext.Provider;
