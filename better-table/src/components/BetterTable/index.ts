// BetterTable v2 - Public API

// Main Component
export { BetterTable, default } from './components';

// Types - Re-export from types.ts
export { defaultLocale } from './types';
export type {
  BetterTableProps,
  Column,
  RowAction,
  GlobalAction,
  PaginationConfig,
  SortState,
  FilterState,
  TableClassNames,
  TableLocale,
  TableData,
} from './types';

// Hooks (for advanced usage)
export { useTableSort } from './hooks/useTableSort';
export { useTableFilter } from './hooks/useTableFilter';
export { useTablePagination } from './hooks/useTablePagination';
export { useTableSelection } from './hooks/useTableSelection';
export { useTableSearch } from './hooks/useTableSearch';

// Context (for custom sub-components)
export { useTableContext, TableProvider } from './context';
export type { TableContextValue } from './context';

// Utilities
export { getValueFromPath } from './utils/getValueFromPath';
export { sortData } from './utils/sortData';
export { filterData, searchData } from './utils/filterData';
