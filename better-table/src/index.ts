/**
 * @juanb/better-table
 * A modern, flexible, and fully typed React data table component
 *
 * @packageDocumentation
 */

// Main Component
export { BetterTable } from "./components/BetterTable";

// Types
export { defaultLocale } from "./components/BetterTable/types";
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
} from "./components/BetterTable/types";

// Hooks (for advanced usage)
export { useTableSort } from "./components/BetterTable/hooks/useTableSort";
export { useTableFilter } from "./components/BetterTable/hooks/useTableFilter";
export { useTablePagination } from "./components/BetterTable/hooks/useTablePagination";
export { useTableSelection } from "./components/BetterTable/hooks/useTableSelection";
export { useTableSearch } from "./components/BetterTable/hooks/useTableSearch";

// Context (for custom sub-components)
export {
	useTableContext,
	TableProvider,
} from "./components/BetterTable/context";
export type { TableContextValue } from "./components/BetterTable/context";

// Utilities
export { getValueFromPath } from "./components/BetterTable/utils/getValueFromPath";
export { sortData } from "./components/BetterTable/utils/sortData";
export {
	filterData,
	searchData,
} from "./components/BetterTable/utils/filterData";

// Styles - users should import separately:
// import '@juanb/better-table/styles.css'
