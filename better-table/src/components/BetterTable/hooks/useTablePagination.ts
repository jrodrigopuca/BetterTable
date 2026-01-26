import { useState, useCallback, useMemo } from "react";
import { PaginationConfig, TableData } from "../types";

interface UseTablePaginationOptions<T extends TableData> {
	data: T[];
	config?: PaginationConfig | false;
	onPageChange?: (page: number, pageSize: number) => void;
}

interface UseTablePaginationReturn<T extends TableData> {
	paginatedData: T[];
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
}

export function useTablePagination<T extends TableData>({
	data,
	config,
	onPageChange,
}: UseTablePaginationOptions<T>): UseTablePaginationReturn<T> {
	const enabled = config !== false;

	const initialPage =
		config && typeof config === "object" ? (config.page ?? 1) : 1;
	const initialPageSize =
		config && typeof config === "object" ? (config.pageSize ?? 10) : 10;
	const serverTotalItems =
		config && typeof config === "object" ? config.totalItems : undefined;

	const [page, setPage] = useState(initialPage);
	const [pageSize, setPageSize] = useState(initialPageSize);

	const totalItems = serverTotalItems ?? data.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

	const goToPage = useCallback(
		(newPage: number) => {
			const validPage = Math.max(1, Math.min(newPage, totalPages));
			setPage(validPage);
			onPageChange?.(validPage, pageSize);
		},
		[totalPages, pageSize, onPageChange],
	);

	const nextPage = useCallback(() => {
		if (page < totalPages) {
			goToPage(page + 1);
		}
	}, [page, totalPages, goToPage]);

	const prevPage = useCallback(() => {
		if (page > 1) {
			goToPage(page - 1);
		}
	}, [page, goToPage]);

	const changePageSize = useCallback(
		(newSize: number) => {
			setPageSize(newSize);
			setPage(1);
			onPageChange?.(1, newSize);
		},
		[onPageChange],
	);

	const paginatedData = useMemo(() => {
		if (!enabled || serverTotalItems !== undefined) {
			// Si hay paginación del servidor, devolver datos tal cual
			return data;
		}
		const start = (page - 1) * pageSize;
		return data.slice(start, start + pageSize);
	}, [data, page, pageSize, enabled, serverTotalItems]);

	const startIndex = (page - 1) * pageSize + 1;
	const endIndex = Math.min(page * pageSize, totalItems);

	return {
		paginatedData,
		page,
		pageSize,
		totalPages,
		totalItems,
		goToPage,
		nextPage,
		prevPage,
		changePageSize,
		hasNextPage: page < totalPages,
		hasPrevPage: page > 1,
		startIndex,
		endIndex,
	};
}
