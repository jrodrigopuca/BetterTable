import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BetterTable } from "../index";
import { mockUsers, userColumns, withinTable } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Callbacks de interacción", () => {
	it("ejecuta onRowClick al hacer click en fila", async () => {
		const user = userEvent.setup();
		const mockRowClick = vi.fn();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				onRowClick={mockRowClick}
			/>
		);

		const table = withinTable(container);
		const firstRowCell = table.getByText("Juan García");
		await user.click(firstRowCell);

		expect(mockRowClick).toHaveBeenCalledWith(mockUsers[0], 0);
	});

	it("ejecuta onRowDoubleClick al hacer doble click", async () => {
		const user = userEvent.setup();
		const mockDoubleClick = vi.fn();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				onRowDoubleClick={mockDoubleClick}
			/>
		);

		const table = withinTable(container);
		const firstRowCell = table.getByText("Juan García");
		await user.dblClick(firstRowCell);

		expect(mockDoubleClick).toHaveBeenCalledWith(mockUsers[0], 0);
	});
});
