import { ReactNode } from 'react';
import { TableData } from '../types';
import { TableDataContextValue, TableDataProvider } from './TableDataContext';
import { TableSortContextValue, TableSortProvider } from './TableSortContext';
import { TableFilterContextValue, TableFilterProvider } from './TableFilterContext';
import { TableSelectionContextValue, TableSelectionProvider } from './TableSelectionContext';
import { TablePaginationContextValue, TablePaginationProvider } from './TablePaginationContext';
import { TableUIContextValue, TableUIProvider } from './TableUIContext';

export interface TableProviderProps<T extends TableData = TableData> {
  data: TableDataContextValue<T>;
  sort: TableSortContextValue;
  filter: TableFilterContextValue;
  selection: TableSelectionContextValue<T>;
  pagination: TablePaginationContextValue;
  ui: TableUIContextValue<T>;
  children: ReactNode;
}

export function TableProvider<T extends TableData>({
  data,
  sort,
  filter,
  selection,
  pagination,
  ui,
  children,
}: TableProviderProps<T>) {
  return (
    <TableDataProvider value={data as TableDataContextValue}>
      <TableSortProvider value={sort}>
        <TableFilterProvider value={filter}>
          <TableSelectionProvider value={selection as TableSelectionContextValue}>
            <TablePaginationProvider value={pagination}>
              <TableUIProvider value={ui as TableUIContextValue}>
                {children}
              </TableUIProvider>
            </TablePaginationProvider>
          </TableSelectionProvider>
        </TableFilterProvider>
      </TableSortProvider>
    </TableDataProvider>
  );
}
