import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { BetterTable } from "../index";
import { mockUsers, userColumns, withinTable } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Búsqueda global", () => {
	it("busca en todas las columnas configuradas", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				searchable
				searchDebounceMs={0}
				searchColumns={["name", "email"]}
			/>
		);

		const searchInput = screen.getByPlaceholderText(/buscar/i);
		await user.type(searchInput, "Juan");

		const rows = screen.getAllByRole("row");
		expect(rows.length).toBeGreaterThan(1);
		expect(rows.some(row => row.textContent?.includes("Juan García"))).toBe(true);
		expect(screen.queryByText("María López")).not.toBeInTheDocument();
	});

	it("busca por email", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				searchable
				searchDebounceMs={0}
				searchColumns={["name", "email"]}
			/>
		);

		const searchInput = screen.getByPlaceholderText(/buscar/i);
		await user.type(searchInput, "Maria");

		const rows = screen.getAllByRole("row");
		expect(rows.length).toBeGreaterThan(1);
		expect(rows.some(row => row.textContent?.includes("María López"))).toBe(true);
		expect(screen.queryByText("Juan García")).not.toBeInTheDocument();
	});

	it("limpia búsqueda con el botón de limpiar", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				searchable
				searchDebounceMs={0}
			/>
		);

		const searchInput = screen.getByPlaceholderText(/buscar/i);
		await user.type(searchInput, "Juan");

		const clearButton = screen.getByRole("button", { name: /clear search/i });
		await user.click(clearButton);

		const table = withinTable(container);
		expect(table.getByText("Juan García")).toBeInTheDocument();
		expect(table.getByText("María López")).toBeInTheDocument();
	});
});
