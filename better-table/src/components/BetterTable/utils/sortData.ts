import { TableData } from "../types";
import { getValueFromPath } from "./getValueFromPath";

/**
 * Ordena un array de datos por una columna específica
 * @param data - Array de datos a ordenar
 * @param columnId - ID/accessor de la columna
 * @param direction - Dirección del ordenamiento
 * @returns Array ordenado (nueva referencia)
 */
export function sortData<T extends TableData>(
	data: T[],
	columnId: string,
	direction: "asc" | "desc",
): T[] {
	return [...data].sort((a, b) => {
		const valueA = getValueFromPath(a as Record<string, unknown>, columnId);
		const valueB = getValueFromPath(b as Record<string, unknown>, columnId);

		// Manejar valores nulos/undefined
		if (valueA === null || valueA === undefined) {
			return direction === "asc" ? 1 : -1;
		}
		if (valueB === null || valueB === undefined) {
			return direction === "asc" ? -1 : 1;
		}

		// Comparar según tipo
		if (typeof valueA === "string" && typeof valueB === "string") {
			const comparison = valueA.localeCompare(valueB, undefined, {
				sensitivity: "base",
				numeric: true,
			});
			return direction === "asc" ? comparison : -comparison;
		}

		if (typeof valueA === "number" && typeof valueB === "number") {
			return direction === "asc" ? valueA - valueB : valueB - valueA;
		}

		if (typeof valueA === "boolean" && typeof valueB === "boolean") {
			const comparison = valueA === valueB ? 0 : valueA ? -1 : 1;
			return direction === "asc" ? comparison : -comparison;
		}

		if (valueA instanceof Date && valueB instanceof Date) {
			const comparison = valueA.getTime() - valueB.getTime();
			return direction === "asc" ? comparison : -comparison;
		}

		// Fallback: convertir a string y comparar
		const strA = String(valueA);
		const strB = String(valueB);
		const comparison = strA.localeCompare(strB);
		return direction === "asc" ? comparison : -comparison;
	});
}
