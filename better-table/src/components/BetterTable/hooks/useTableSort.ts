import { useState, useCallback, useMemo } from "react";
import { SortState, TableData } from "../types";
import { sortData } from "../utils/sortData";

interface UseTableSortOptions<T extends TableData> {
	data: T[];
	initialSort?: SortState;
	controlledSort?: SortState;
	onSortChange?: (sort: SortState) => void;
}

interface UseTableSortReturn<T extends TableData> {
	sortedData: T[];
	sortState: SortState;
	handleSort: (columnId: string) => void;
	clearSort: () => void;
}

export function useTableSort<T extends TableData>({
	data,
	initialSort,
	controlledSort,
	onSortChange,
}: UseTableSortOptions<T>): UseTableSortReturn<T> {
	const [internalSort, setInternalSort] = useState<SortState>(
		initialSort ?? { columnId: null, direction: "asc" },
	);

	// Usar estado controlado si está disponible
	const sortState = controlledSort ?? internalSort;

	const handleSort = useCallback(
		(columnId: string) => {
			const newState: SortState = {
				columnId,
				direction:
					sortState.columnId === columnId && sortState.direction === "asc"
						? "desc"
						: "asc",
			};

			if (!controlledSort) {
				setInternalSort(newState);
			}
			onSortChange?.(newState);
		},
		[sortState, controlledSort, onSortChange],
	);

	const clearSort = useCallback(() => {
		const newState: SortState = { columnId: null, direction: "asc" };
		if (!controlledSort) {
			setInternalSort(newState);
		}
		onSortChange?.(newState);
	}, [controlledSort, onSortChange]);

	const sortedData = useMemo(() => {
		if (!sortState.columnId) return data;
		return sortData(data, sortState.columnId, sortState.direction);
	}, [data, sortState]);

	return { sortedData, sortState, handleSort, clearSort };
}
