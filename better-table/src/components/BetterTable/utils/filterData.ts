import { TableData, Column, FilterState } from "../types";
import { getValueFromPath } from "./getValueFromPath";

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

				case "date":
					// Comparación básica de fechas (mismo día)
					if (cellValue instanceof Date && filterValue) {
						const filterDate = new Date(String(filterValue));
						return cellValue.toDateString() === filterDate.toDateString();
					}
					return String(cellValue).includes(String(filterValue));

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
