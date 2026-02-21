import { TableData, Column, FilterState, DateFilterRange } from "../types";
import { getValueFromPath } from "./getValueFromPath";

/**
 * Normaliza un valor a Date para comparación
 */
function toDate(value: unknown): Date | null {
	if (value instanceof Date) return value;
	if (typeof value === 'string' || typeof value === 'number') {
		const d = new Date(value);
		return isNaN(d.getTime()) ? null : d;
	}
	return null;
}

/**
 * Filtra un array de datos basado en múltiples filtros de columna
 * @param data - Array de datos a filtrar
 * @param filters - Estado de filtros por columna
 * @param columns - Configuración de columnas
 * @returns Array filtrado (nueva referencia)
 */
export function filterData<T extends TableData>(
	data: T[],
	filters: FilterState,
	columns: Column<T>[],
): T[] {
	const activeFilters = Object.entries(filters).filter(
		([, value]) => value !== null && value !== undefined && value !== "",
	);

	if (activeFilters.length === 0) {
		return data;
	}

	return data.filter((row) => {
		return activeFilters.every(([columnId, filterValue]) => {
			const column = columns.find((col) => col.id === columnId);
			if (!column) return true;

			const cellValue = getValueFromPath(
				row as Record<string, unknown>,
				String(column.accessor),
			);

			if (cellValue === null || cellValue === undefined) {
				return false;
			}

			const columnType = column.type ?? "string";

			switch (columnType) {
				case "boolean":
					return cellValue === filterValue;

				case "number":
					return String(cellValue) === String(filterValue);

				case "date": {
					const cellDate = toDate(cellValue);
					if (!cellDate) return false;

					// Date range filter { from?, to? }
					if (filterValue && typeof filterValue === 'object' && ('from' in filterValue || 'to' in filterValue)) {
						const range = filterValue as DateFilterRange;
						if (range.from) {
							const fromDate = toDate(range.from);
							if (fromDate && cellDate < fromDate) return false;
						}
						if (range.to) {
							const toDateVal = toDate(range.to);
							if (toDateVal) {
								// Include the entire "to" day
								const endOfDay = new Date(toDateVal);
								endOfDay.setHours(23, 59, 59, 999);
								if (cellDate > endOfDay) return false;
							}
						}
						return true;
					}

					// Legacy: single date value comparison
					const filterDate = toDate(filterValue);
					if (filterDate) {
						return cellDate.toDateString() === filterDate.toDateString();
					}
					return String(cellValue).includes(String(filterValue));
				}

				case "string":
				default:
					return String(cellValue)
						.toLowerCase()
						.includes(String(filterValue).toLowerCase());
			}
		});
	});
}

/**
 * Realiza una búsqueda global en los datos
 * @param data - Array de datos
 * @param searchValue - Valor a buscar
 * @param columns - Columnas en las que buscar
 * @param searchColumnIds - IDs de columnas específicas (opcional)
 * @returns Array filtrado
 */
export function searchData<T extends TableData>(
	data: T[],
	searchValue: string,
	columns: Column<T>[],
	searchColumnIds?: string[],
): T[] {
	if (!searchValue.trim()) {
		return data;
	}

	const searchLower = searchValue.toLowerCase().trim();
	const columnsToSearch = searchColumnIds
		? columns.filter(
				(col) =>
					searchColumnIds.includes(col.id) ||
					searchColumnIds.includes(String(col.accessor)),
			)
		: columns.filter((col) => col.type !== "custom");

	return data.filter((row) =>
		columnsToSearch.some((col) => {
			const value = getValueFromPath(
				row as Record<string, unknown>,
				String(col.accessor),
			);
			if (value === null || value === undefined) return false;
			return String(value).toLowerCase().includes(searchLower);
		}),
	);
}
