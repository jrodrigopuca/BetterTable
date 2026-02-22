import { useState, useCallback, useMemo } from "react";
import { Column, TableData } from "../types";

interface UseColumnVisibilityOptions<T extends TableData> {
	columns: Column<T>[];
	/** Controlled hidden column IDs */
	controlledHiddenColumns?: string[];
	/** Callback when visibility changes */
	onColumnVisibilityChange?: (hiddenColumns: string[]) => void;
}

interface UseColumnVisibilityReturn<T extends TableData> {
	/** Columns filtered by visibility */
	visibleColumns: Column<T>[];
	/** Set of hidden column IDs */
	hiddenColumnIds: Set<string>;
	/** Toggle a column's visibility */
	toggleColumn: (columnId: string) => void;
	/** Show all columns */
	showAllColumns: () => void;
	/** Check if a column is visible */
	isColumnVisible: (columnId: string) => boolean;
	/** Array of hidden column IDs (for serialization) */
	hiddenColumns: string[];
}

export function useColumnVisibility<T extends TableData>({
	columns,
	controlledHiddenColumns,
	onColumnVisibilityChange,
}: UseColumnVisibilityOptions<T>): UseColumnVisibilityReturn<T> {
	// Internal state: hidden column IDs derived from columns with hidden: true + user toggles
	const [internalHidden, setInternalHidden] = useState<string[]>(() =>
		columns.filter((col) => col.hidden).map((col) => col.id),
	);

	const hiddenColumns = controlledHiddenColumns ?? internalHidden;
	const hiddenColumnIds = useMemo(
		() => new Set(hiddenColumns),
		[hiddenColumns],
	);

	const toggleColumn = useCallback(
		(columnId: string) => {
			const newHidden = hiddenColumnIds.has(columnId)
				? hiddenColumns.filter((id) => id !== columnId)
				: [...hiddenColumns, columnId];

			if (!controlledHiddenColumns) {
				setInternalHidden(newHidden);
			}
			onColumnVisibilityChange?.(newHidden);
		},
		[
			hiddenColumns,
			hiddenColumnIds,
			controlledHiddenColumns,
			onColumnVisibilityChange,
		],
	);

	const showAllColumns = useCallback(() => {
		if (!controlledHiddenColumns) {
			setInternalHidden([]);
		}
		onColumnVisibilityChange?.([]);
	}, [controlledHiddenColumns, onColumnVisibilityChange]);

	const isColumnVisible = useCallback(
		(columnId: string) => !hiddenColumnIds.has(columnId),
		[hiddenColumnIds],
	);

	const visibleColumns = useMemo(
		() => columns.filter((col) => !hiddenColumnIds.has(col.id)),
		[columns, hiddenColumnIds],
	);

	return {
		visibleColumns,
		hiddenColumnIds,
		toggleColumn,
		showAllColumns,
		isColumnVisible,
		hiddenColumns,
	};
}
