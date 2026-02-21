import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BetterTable } from "../index";
import type { Column } from "../types";
import { mockUsers, getTable } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Celdas personalizadas", () => {
	const customColumns: Column<User>[] = [
		{ id: "name", accessor: "name", header: "Nombre" },
		{
			id: "status",
			accessor: "isActive",
			header: "Estado",
			cell: (value) => (
				<span data-testid="status-badge" className={value ? "active" : "inactive"}>
					{value ? "✅ Activo" : "❌ Inactivo"}
				</span>
			),
		},
		{
			id: "email",
			accessor: "email",
			header: "Contacto",
			cell: (value, row) => (
				<a href={`mailto:${value}`} data-testid="email-link">
					{row.name} ({String(value)})
				</a>
			),
		},
	];

	it("renderiza componentes personalizados en celdas", () => {
		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={customColumns}
				rowKey="id"
			/>
		);

		const table = getTable(container);
		const statusBadges = within(table).getAllByTestId("status-badge");
		expect(statusBadges.length).toBe(mockUsers.length);
	});

	it("pasa value y row correctamente a la función cell", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={customColumns}
				rowKey="id"
			/>
		);

		const emailLinks = screen.getAllByTestId("email-link");
		expect(emailLinks[0]).toHaveTextContent("Juan García (juan@example.com)");
	});
});
