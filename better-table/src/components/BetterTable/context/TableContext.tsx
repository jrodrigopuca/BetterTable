import { createContext, useContext, ReactNode } from 'react';
import {
  TableData,
  Column,
  SortState,
  MultiSortState,
  FilterState,
  TableLocale,
  TableClassNames,
  RowAction,
  GlobalAction,
  defaultLocale,
} from '../types';

export interface TableContextValue<T extends TableData = TableData> {
  // Data
  data: T[];
  processedData: T[];
  columns: Column<T>[];
  visibleColumns: Column<T>[];
  rowKey: keyof T | ((row: T, index: number) => string);

  // Actions
  rowActions?: RowAction<T>[];
  globalActions?: GlobalAction<T>[];
  maxVisibleActions: number;

  // Sort
  sortState: SortState;
  handleSort: (columnId: string) => void;
  multiSortState: MultiSortState;
  isMultiSort: boolean;
  clearSort: () => void;

  // Column Visibility
  columnVisibilityEnabled: boolean;
  hiddenColumnIds: Set<string>;
  toggleColumn: (columnId: string) => void;
  showAllColumns: () => void;
  isColumnVisible: (columnId: string) => boolean;

  // Filter
  filters: FilterState;
  setFilter: (columnId: string, value: string | number | boolean | import('../types').DateFilterRange | null) => void;
  clearFilter: (columnId: string) => void;
  clearFilters: () => void;

  // Search
  searchValue: string;
  handleSearch: (value: string) => void;
  clearSearch: () => void;
  searchable: boolean;

  // Selection
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

  // Pagination
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

  // UI State
  loading: boolean;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;

  // Styling
  locale: TableLocale;
  classNames: TableClassNames;
  size: 'small' | 'medium' | 'large';
  bordered: boolean;
  striped: boolean;
  hoverable: boolean;
  stickyHeader: boolean;

  // Callbacks
  onRowClick?: (row: T, rowIndex: number) => void;
  onRowDoubleClick?: (row: T, rowIndex: number) => void;

  // Filter panel
  filterPanelOpen: boolean;
  toggleFilterPanel: () => void;
  hasFilterableColumns: boolean;
  filterMode: 'floating' | 'panel' | 'both';

  // Modal
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  modalContent: ReactNode | null;
  isModalOpen: boolean;
}

const TableContext = createContext<TableContextValue | null>(null);

export function useTableContext<T extends TableData>(): TableContextValue<T> {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context as TableContextValue<T>;
}

interface TableProviderProps<T extends TableData> {
  value: TableContextValue<T>;
  children: ReactNode;
}

export function TableProvider<T extends TableData>({
  value,
  children,
}: TableProviderProps<T>) {
  return (
    <TableContext.Provider value={value as TableContextValue}>
      {children}
    </TableContext.Provider>
  );
}

// Default context values para evitar undefined
export const defaultTableContext: Partial<TableContextValue> = {
  sortState: { columnId: null, direction: 'asc' },
  multiSortState: [],
  isMultiSort: false,
  filters: {},
  searchValue: '',
  selectedRows: [],
  isAllSelected: false,
  isPartiallySelected: false,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  totalItems: 0,
  hasNextPage: false,
  hasPrevPage: false,
  startIndex: 0,
  endIndex: 0,
  loading: false,
  locale: defaultLocale,
  classNames: {},
  size: 'medium',
  bordered: false,
  striped: false,
  hoverable: true,
  columnVisibilityEnabled: false,
  stickyHeader: false,
  selectable: false,
  selectionMode: 'multiple',
  searchable: false,
  paginationEnabled: true,
  pageSizeOptions: [10, 20, 50, 100],
  showSizeChanger: false,
  isModalOpen: false,
  modalContent: null,
  filterPanelOpen: false,
  hasFilterableColumns: false,
};
