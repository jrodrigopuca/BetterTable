import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BetterTable } from "../index";
import type { Column } from "../types";
import { mockUsers, withinTable } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Acceso a datos anidados", () => {
	const nestedColumns: Column<User>[] = [
		{ id: "name", accessor: "name", header: "Nombre" },
		{ id: "dept", accessor: "department.name", header: "Departamento" },
		{ id: "floor", accessor: "department.floor", header: "Piso", type: "number" },
	];

	it("accede a propiedades anidadas con dot notation", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={nestedColumns}
				rowKey="id"
			/>
		);

		expect(screen.getAllByText("Engineering").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Marketing").length).toBeGreaterThan(0);
		expect(screen.getAllByText("3").length).toBeGreaterThan(0);
	});

	it("maneja valores undefined en datos anidados", () => {
		const usersWithMissingData: User[] = [
			{ id: 1, name: "Test User", email: "test@test.com" },
		];

		const { container } = render(
			<BetterTable<User>
				data={usersWithMissingData}
				columns={nestedColumns}
				rowKey="id"
			/>
		);

		const table = withinTable(container);
		expect(table.getByText("Test User")).toBeInTheDocument();
	});
});
