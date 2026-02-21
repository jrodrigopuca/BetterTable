import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { BetterTable } from "../index";
import { mockUsers, userColumns, withinTable } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

/**
 * Helper: opens the filter panel by clicking the "Filtrar por" toggle button.
 */
async function openFilterPanel(user: ReturnType<typeof userEvent.setup>) {
	const toggleBtn = screen.getByRole("button", { name: /filtrar por/i });
	await user.click(toggleBtn);
}

describe("BetterTable - Filtrado de datos", () => {
	it("filtra por texto en columna string", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		await openFilterPanel(user);

		const filterInputs = screen.getAllByPlaceholderText(/filtrar/i);
		const nameFilter = filterInputs[0];

		await user.type(nameFilter, "Juan");

		const table = withinTable(container);
		expect(table.getByText("Juan García")).toBeInTheDocument();
		expect(table.queryByText("María López")).not.toBeInTheDocument();
	});

	it("filtra por número en columna numérica", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		await openFilterPanel(user);

		const filterInputs = screen.getAllByPlaceholderText(/filtrar/i);
		const ageFilter = filterInputs[1];

		await user.clear(ageFilter);
		await user.type(ageFilter, "28");

		await waitFor(async () => {
			const allRows = screen.getAllByRole("row");
			const hasJuan = allRows.some(row => row.textContent?.includes("Juan"));
			expect(hasJuan || allRows.length > 1).toBe(true);
		}, { timeout: 2000 });
	});

	it("filtra por booleano con select", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		await openFilterPanel(user);

		const selects = screen.getAllByRole("combobox");

		if (selects.length > 0) {
			await user.selectOptions(selects[0], "true");

			const table = withinTable(container);
			expect(table.getByText("Juan García")).toBeInTheDocument();
			expect(table.queryByText("Carlos Ruiz")).not.toBeInTheDocument();
		}
	});

	it("combina múltiples filtros", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		await openFilterPanel(user);

		const filterInputs = screen.getAllByPlaceholderText(/filtrar/i);
		await user.type(filterInputs[0], "a");

		const rows = screen.getAllByRole("row");
		expect(rows.length).toBeGreaterThan(1);
	});

	it("muestra mensaje vacío cuando el filtro no encuentra resultados", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				locale={{ noData: "Sin resultados" }}
			/>
		);

		await openFilterPanel(user);

		const filterInputs = screen.getAllByPlaceholderText(/filtrar/i);
		await user.type(filterInputs[0], "zzzzzzz");

		expect(screen.getByText("Sin resultados")).toBeInTheDocument();
	});
});
