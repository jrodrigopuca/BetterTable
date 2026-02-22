import { useState, useCallback, useMemo } from "react";
import { SortState, MultiSortState, TableData } from "../types";
import { sortData, multiSortData } from "../utils/sortData";

interface UseTableSortOptions<T extends TableData> {
	data: T[];
	initialSort?: SortState;
	controlledSort?: SortState;
	onSortChange?: (sort: SortState) => void;
	/** Enable multi-sort (Shift+Click) */
	multiSort?: boolean;
	/** Controlled multi-sort state */
	controlledMultiSort?: MultiSortState;
	/** Callback when multi-sort changes */
	onMultiSortChange?: (sorts: MultiSortState) => void;
}

interface UseTableSortReturn<T extends TableData> {
	sortedData: T[];
	sortState: SortState;
	handleSort: (columnId: string) => void;
	clearSort: () => void;
	/** Multi-sort state (array of sort states in priority order) */
	multiSortState: MultiSortState;
	/** Whether multi-sort is enabled */
	isMultiSort: boolean;
}

export function useTableSort<T extends TableData>({
	data,
	initialSort,
	controlledSort,
	onSortChange,
	multiSort = false,
	controlledMultiSort,
	onMultiSortChange,
}: UseTableSortOptions<T>): UseTableSortReturn<T> {
	const [internalSort, setInternalSort] = useState<SortState>(
		initialSort ?? { columnId: null, direction: "asc" },
	);
	const [internalMultiSort, setInternalMultiSort] = useState<MultiSortState>(
		[],
	);

	// Usar estado controlado si está disponible
	const sortState = controlledSort ?? internalSort;
	const multiSortState = controlledMultiSort ?? internalMultiSort;

	const handleSort = useCallback(
		(columnId: string) => {
			if (multiSort) {
				// Multi-sort: 3-state cycle per column (unsorted → asc → desc → unsorted)
				const existingIndex = multiSortState.findIndex(
					(s) => s.columnId === columnId,
				);
				let newMultiSort: MultiSortState;

				if (existingIndex >= 0) {
					const existing = multiSortState[existingIndex];
					if (existing.direction === "asc") {
						// asc → desc
						newMultiSort = [...multiSortState];
						newMultiSort[existingIndex] = {
							columnId,
							direction: "desc",
						};
					} else {
						// desc → remove (unsorted)
						newMultiSort = multiSortState.filter((_, i) => i !== existingIndex);
					}
				} else {
					// unsorted → asc
					newMultiSort = [...multiSortState, { columnId, direction: "asc" }];
				}

				if (!controlledMultiSort) {
					setInternalMultiSort(newMultiSort);
				}
				onMultiSortChange?.(newMultiSort);

				// Sync single sort state with primary sort
				const primary = newMultiSort[0];
				const newSortState: SortState = primary
					? { columnId: primary.columnId, direction: primary.direction }
					: { columnId: null, direction: "asc" };
				if (!controlledSort) {
					setInternalSort(newSortState);
				}
				onSortChange?.(newSortState);
			} else {
				// Single sort: 3-state cycle (unsorted → asc → desc → unsorted)
				let newState: SortState;
				if (sortState.columnId !== columnId) {
					// Different column → start asc
					newState = { columnId, direction: "asc" };
				} else if (sortState.direction === "asc") {
					// asc → desc
					newState = { columnId, direction: "desc" };
				} else {
					// desc → unsorted
					newState = { columnId: null, direction: "asc" };
				}

				if (!controlledSort) {
					setInternalSort(newState);
				}
				onSortChange?.(newState);
			}
		},
		[
			sortState,
			multiSortState,
			controlledSort,
			controlledMultiSort,
			onSortChange,
			onMultiSortChange,
			multiSort,
		],
	);

	const clearSort = useCallback(() => {
		const newState: SortState = { columnId: null, direction: "asc" };
		if (!controlledSort) {
			setInternalSort(newState);
		}
		onSortChange?.(newState);

		if (multiSort) {
			if (!controlledMultiSort) {
				setInternalMultiSort([]);
			}
			onMultiSortChange?.([]);
		}
	}, [
		controlledSort,
		controlledMultiSort,
		onSortChange,
		onMultiSortChange,
		multiSort,
	]);

	const sortedData = useMemo(() => {
		// Use multi-sort if there are multiple sort states
		if (multiSort && multiSortState.length > 0) {
			return multiSortData(data, multiSortState);
		}
		// Fallback to single sort
		if (!sortState.columnId) return data;
		return sortData(data, sortState.columnId, sortState.direction);
	}, [data, sortState, multiSortState, multiSort]);

	return {
		sortedData,
		sortState,
		handleSort,
		clearSort,
		multiSortState,
		isMultiSort: multiSort,
	};
}
