import { useState, useCallback, useMemo } from "react";
import { FilterState, TableData, Column, DateFilterRange } from "../types";
import { filterData } from "../utils/filterData";

interface UseTableFilterOptions<T extends TableData> {
	data: T[];
	columns: Column<T>[];
	initialFilters?: FilterState;
	controlledFilters?: FilterState;
	onFilterChange?: (filters: FilterState) => void;
}

interface UseTableFilterReturn<T extends TableData> {
	filteredData: T[];
	filters: FilterState;
	setFilter: (
		columnId: string,
		value: string | number | boolean | DateFilterRange | null,
	) => void;
	clearFilters: () => void;
	clearFilter: (columnId: string) => void;
}

export function useTableFilter<T extends TableData>({
	data,
	columns,
	initialFilters,
	controlledFilters,
	onFilterChange,
}: UseTableFilterOptions<T>): UseTableFilterReturn<T> {
	const [internalFilters, setInternalFilters] = useState<FilterState>(
		initialFilters ?? {},
	);

	// Usar estado controlado si está disponible
	const filters = controlledFilters ?? internalFilters;

	const setFilter = useCallback(
		(
			columnId: string,
			value: string | number | boolean | DateFilterRange | null,
		) => {
			const newFilters = { ...filters };

			// For date ranges, remove if both from and to are empty
			if (value !== null && typeof value === "object" && "from" in value) {
				const range = value as DateFilterRange;
				if (!range.from && !range.to) {
					delete newFilters[columnId];
				} else {
					newFilters[columnId] = value;
				}
			} else if (value === null || value === undefined || value === "") {
				delete newFilters[columnId];
			} else {
				newFilters[columnId] = value;
			}

			if (!controlledFilters) {
				setInternalFilters(newFilters);
			}
			onFilterChange?.(newFilters);
		},
		[filters, controlledFilters, onFilterChange],
	);

	const clearFilter = useCallback(
		(columnId: string) => {
			const newFilters = { ...filters };
			delete newFilters[columnId];

			if (!controlledFilters) {
				setInternalFilters(newFilters);
			}
			onFilterChange?.(newFilters);
		},
		[filters, controlledFilters, onFilterChange],
	);

	const clearFilters = useCallback(() => {
		if (!controlledFilters) {
			setInternalFilters({});
		}
		onFilterChange?.({});
	}, [controlledFilters, onFilterChange]);

	const filteredData = useMemo(() => {
		return filterData(data, filters, columns);
	}, [data, filters, columns]);

	return { filteredData, filters, setFilter, clearFilters, clearFilter };
}
