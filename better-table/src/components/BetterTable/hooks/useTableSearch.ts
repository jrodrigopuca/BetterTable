import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { TableData, Column } from "../types";
import { searchData } from "../utils/filterData";

interface UseTableSearchOptions<T extends TableData> {
	data: T[];
	columns: Column<T>[];
	searchColumns?: string[];
	initialValue?: string;
	controlledValue?: string;
	onSearchChange?: (value: string) => void;
	debounceMs?: number;
}

interface UseTableSearchReturn<T extends TableData> {
	searchedData: T[];
	searchValue: string;
	handleSearch: (value: string) => void;
	clearSearch: () => void;
}

export function useTableSearch<T extends TableData>({
	data,
	columns,
	searchColumns,
	initialValue,
	controlledValue,
	onSearchChange,
	debounceMs = 0,
}: UseTableSearchOptions<T>): UseTableSearchReturn<T> {
	const [internalValue, setInternalValue] = useState(initialValue ?? "");
	const [debouncedValue, setDebouncedValue] = useState(initialValue ?? "");
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Usar valor controlado si está disponible
	const searchValue = controlledValue ?? internalValue;

	// Debounce: update debouncedValue after delay
	useEffect(() => {
		if (debounceMs <= 0) {
			setDebouncedValue(searchValue);
			return;
		}

		timerRef.current = setTimeout(() => {
			setDebouncedValue(searchValue);
		}, debounceMs);

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [searchValue, debounceMs]);

	const handleSearch = useCallback(
		(value: string) => {
			if (controlledValue === undefined) {
				setInternalValue(value);
			}
			onSearchChange?.(value);
		},
		[controlledValue, onSearchChange],
	);

	const clearSearch = useCallback(() => {
		if (controlledValue === undefined) {
			setInternalValue("");
		}
		// Clear immediately, bypass debounce
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		setDebouncedValue("");
		onSearchChange?.("");
	}, [controlledValue, onSearchChange]);

	const searchedData = useMemo(() => {
		return searchData(data, debouncedValue, columns, searchColumns);
	}, [data, debouncedValue, columns, searchColumns]);

	return { searchedData, searchValue, handleSearch, clearSearch };
}
