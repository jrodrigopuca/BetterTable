import { createContext, useContext } from 'react';
import { FilterState, DateFilterRange } from '../types';

export interface TableFilterContextValue {
  filters: FilterState;
  setFilter: (columnId: string, value: string | number | boolean | DateFilterRange | null) => void;
  clearFilter: (columnId: string) => void;
  clearFilters: () => void;
  searchValue: string;
  handleSearch: (value: string) => void;
  clearSearch: () => void;
  searchable: boolean;
  filterPanelOpen: boolean;
  toggleFilterPanel: () => void;
  hasFilterableColumns: boolean;
  filterMode: 'floating' | 'panel' | 'both';
}

const TableFilterContext = createContext<TableFilterContextValue | null>(null);

export function useTableFilterContext(): TableFilterContextValue {
  const context = useContext(TableFilterContext);
  if (!context) {
    throw new Error('useTableFilterContext must be used within a TableProvider');
  }
  return context;
}

export const TableFilterProvider = TableFilterContext.Provider;
