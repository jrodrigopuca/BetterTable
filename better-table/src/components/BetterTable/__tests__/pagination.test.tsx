import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { BetterTable } from "../index";
import { manyUsers, userColumns, withinTable } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Paginación", () => {
	it("pagina correctamente con muchos elementos", () => {
		render(
			<BetterTable<User>
				data={manyUsers}
				columns={userColumns}
				rowKey="id"
				pagination={{ pageSize: 10 }}
			/>
		);

		const rows = screen.getAllByRole("row");
		expect(rows.length).toBe(11); // 1 header + 10 data rows
	});

	it("navega entre páginas", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={manyUsers}
				columns={userColumns}
				rowKey="id"
				pagination={{ pageSize: 10 }}
			/>
		);

		const nextButton = screen.getByRole("button", { name: /siguiente|next|›/i });
		await user.click(nextButton);

		const table = withinTable(container);
		expect(table.getByText("User 11")).toBeInTheDocument();
		expect(table.queryByText("User 1")).not.toBeInTheDocument();
	});

	it("cambia tamaño de página", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={manyUsers}
				columns={userColumns}
				rowKey="id"
				pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: [10, 20, 50] }}
			/>
		);

		const sizeSelect = screen.getByRole("combobox", { name: /por página|page size/i });
		if (sizeSelect) {
			await user.selectOptions(sizeSelect, "20");

			const rows = screen.getAllByRole("row");
			expect(rows.length).toBe(21); // 1 header + 20 data rows
		}
	});

	it("muestra información de página actual", () => {
		render(
			<BetterTable<User>
				data={manyUsers}
				columns={userColumns}
				rowKey="id"
				pagination={{ pageSize: 10 }}
			/>
		);

		expect(screen.getByText(/1.*10.*50|página.*1/i)).toBeInTheDocument();
	});
});
