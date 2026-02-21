import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { BetterTable } from "../index";
import { mockUsers, userColumns, withinTable } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Ordenamiento", () => {
	it("ordena por columna al hacer click en header", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		const sortButtons = screen.getAllByLabelText(/ordenar/i);
		const nameSortButton = sortButtons[0];
		await user.click(nameSortButton);

		const tbody = screen.getByRole("grid").querySelector("tbody");
		const rows = tbody?.querySelectorAll("tr") || [];
		expect(rows[0]).toHaveTextContent(/ana/i);
	});

	it("alterna entre ascendente, descendente y sin orden", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		const table = withinTable(container);
		const nameHeader = table.getByText("Nombre");

		// Primer click: ascendente
		await user.click(nameHeader);

		// Segundo click: descendente
		await user.click(nameHeader);

		// Tercer click: sin orden (vuelve al original)
		await user.click(nameHeader);
	});

	it("ordena números correctamente", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		const table = withinTable(container);
		const ageHeader = table.getByText("Edad");
		await user.click(ageHeader);

		const rows = table.getAllByRole("row");
		expect(rows[1]).toHaveTextContent("28");
	});
});
