import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BetterTable } from "../index";
import type { RowAction } from "../types";
import { mockUsers, userColumns } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Acciones de fila", () => {
	const mockEdit = vi.fn();
	const mockDelete = vi.fn();

	const rowActions: RowAction<User>[] = [
		{
			id: "edit",
			label: "Editar",
			icon: "✏️",
			mode: "callback",
			onClick: mockEdit,
		},
		{
			id: "delete",
			label: "Eliminar",
			icon: "🗑️",
			mode: "callback",
			variant: "danger",
			onClick: mockDelete,
			visible: (user) => user.role !== "admin",
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renderiza botones de acción en cada fila", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		const editButtons = screen.getAllByRole("button", { name: /editar/i });
		expect(editButtons.length).toBe(mockUsers.length);
	});

	it("ejecuta acción onClick con los datos de la fila", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		const editButtons = screen.getAllByRole("button", { name: /editar/i });
		await user.click(editButtons[0]);

		expect(mockEdit).toHaveBeenCalledWith(mockUsers[0], 0);
	});

	it("oculta acción condicionalmente según visible()", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		const deleteButtons = screen.getAllByRole("button", { name: /eliminar/i });
		const adminCount = mockUsers.filter((u) => u.role === "admin").length;
		const expectedDeleteButtons = mockUsers.length - adminCount;

		expect(deleteButtons.length).toBe(expectedDeleteButtons);
	});
});
