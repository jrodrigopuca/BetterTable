import { within } from "@testing-library/react";
import type { Column } from "../../types";

// ============================================================================
// Test Data Types
// ============================================================================

export interface User {
	[key: string]: unknown;
	id: number;
	name: string;
	email: string;
	age?: number;
	isActive?: boolean;
	role?: string;
	department?: {
		name: string;
		floor: number;
	};
}

// ============================================================================
// Test Data
// ============================================================================

export const mockUsers: User[] = [
	{
		id: 1,
		name: "Juan García",
		email: "juan@example.com",
		age: 28,
		isActive: true,
		role: "admin",
		department: { name: "Engineering", floor: 3 },
	},
	{
		id: 2,
		name: "María López",
		email: "maria@example.com",
		age: 35,
		isActive: true,
		role: "user",
		department: { name: "Marketing", floor: 2 },
	},
	{
		id: 3,
		name: "Carlos Ruiz",
		email: "carlos@example.com",
		age: 42,
		isActive: false,
		role: "user",
		department: { name: "Sales", floor: 1 },
	},
	{
		id: 4,
		name: "Ana Martín",
		email: "ana@example.com",
		age: 29,
		isActive: true,
		role: "admin",
		department: { name: "Engineering", floor: 3 },
	},
	{
		id: 5,
		name: "Pedro Sánchez",
		email: "pedro@example.com",
		age: 31,
		isActive: false,
		role: "user",
		department: { name: "HR", floor: 4 },
	},
];

export const fewUsers: User[] = mockUsers.slice(0, 2);

export const manyUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
	id: i + 1,
	name: `User ${i + 1}`,
	email: `user${i + 1}@example.com`,
	age: 20 + (i % 40),
	isActive: i % 2 === 0,
	role: i % 3 === 0 ? "admin" : "user",
}));

// ============================================================================
// Column Definitions
// ============================================================================

export const userColumns: Column<User>[] = [
	{
		id: "name",
		accessor: "name",
		header: "Nombre",
		sortable: true,
		filterable: true,
	},
	{ id: "email", accessor: "email", header: "Email", sortable: true },
	{
		id: "age",
		accessor: "age",
		header: "Edad",
		type: "number",
		sortable: true,
		filterable: true,
	},
	{
		id: "isActive",
		accessor: "isActive",
		header: "Activo",
		type: "boolean",
		filterable: true,
	},
	{ id: "role", accessor: "role", header: "Rol", filterable: true },
];

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Helper para obtener el elemento de la tabla tradicional (no cards)
 * Útil porque ahora ambos (tabla y cards) renderizan los datos
 */
export const getTable = (container: HTMLElement) => {
	return container.querySelector(".bt-table") as HTMLElement;
};

/**
 * Helper para buscar dentro de la tabla tradicional
 */
export const withinTable = (container: HTMLElement) => {
	const table = getTable(container);
	return within(table);
};
