"use client";

/**
 * better-table
 * A modern, flexible, and fully typed React data table component
 *
 * @packageDocumentation
 */

// Main Component
export { BetterTable } from "./components/BetterTable";

// Types
export { defaultLocale, locales } from "./components/BetterTable/types";
export type {
	BetterTableProps,
	Column,
	RowAction,
	GlobalAction,
	PaginationConfig,
	SortState,
	MultiSortState,
	FilterState,
	DateFilterRange,
	TableClassNames,
	TableLocale,
	TableData,
	LocaleKey,
} from "./components/BetterTable/types";

// Hooks (for advanced usage)
export { useTableSort } from "./components/BetterTable/hooks/useTableSort";
export { useTableFilter } from "./components/BetterTable/hooks/useTableFilter";
export { useTablePagination } from "./components/BetterTable/hooks/useTablePagination";
export { useTableSelection } from "./components/BetterTable/hooks/useTableSelection";
export { useTableSearch } from "./components/BetterTable/hooks/useTableSearch";
export { useColumnVisibility } from "./components/BetterTable/hooks/useColumnVisibility";

// Context (for custom sub-components)
export {
	TableProvider,
	useTableData,
	useTableSortContext,
	useTableFilterContext,
	useTableSelectionContext,
	useTablePaginationContext,
	useTableUI,
} from "./components/BetterTable/context";
export type {
	TableProviderProps,
	TableDataContextValue,
	TableSortContextValue,
	TableFilterContextValue,
	TableSelectionContextValue,
	TablePaginationContextValue,
	TableUIContextValue,
} from "./components/BetterTable/context";

// Utilities
export { getValueFromPath } from "./components/BetterTable/utils/getValueFromPath";
export { sortData } from "./components/BetterTable/utils/sortData";
export {
	filterData,
	searchData,
} from "./components/BetterTable/utils/filterData";

// Styles - users should import separately:
// import 'better-table/styles.css'
