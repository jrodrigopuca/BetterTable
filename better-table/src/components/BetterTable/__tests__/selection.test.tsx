import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BetterTable } from "../index";
import type { GlobalAction } from "../types";
import { mockUsers, userColumns } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Selección múltiple para acciones", () => {
	const mockDeleteSelected = vi.fn();
	const mockExport = vi.fn();
	const mockSelectionChange = vi.fn();

	const globalActionsWithSelection: GlobalAction<User>[] = [
		{
			id: "export",
			label: "Exportar",
			icon: "📥",
			onClick: mockExport,
		},
		{
			id: "deleteSelected",
			label: "Eliminar seleccionados",
			icon: "🗑️",
			variant: "danger",
			requiresSelection: true,
			onClick: mockDeleteSelected,
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("infiere selectable automáticamente cuando hay globalAction con requiresSelection", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActionsWithSelection}
			/>
		);

		const checkboxes = screen.getAllByRole("checkbox");
		expect(checkboxes.length).toBeGreaterThan(0);
	});

	it("infiere selectable automáticamente cuando hay onSelectionChange", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				onSelectionChange={mockSelectionChange}
			/>
		);

		const checkboxes = screen.getAllByRole("checkbox");
		expect(checkboxes.length).toBeGreaterThan(0);
	});

	it("no muestra selección cuando selectable=false explícitamente", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				selectable={false}
				globalActions={globalActionsWithSelection}
			/>
		);

		const checkboxes = screen.queryAllByRole("checkbox");
		expect(checkboxes.length).toBe(0);
	});

	it("deshabilita botón que requiere selección cuando no hay filas seleccionadas", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActionsWithSelection}
			/>
		);

		const deleteButton = screen.getByRole("button", { name: /eliminar seleccionados/i });
		expect(deleteButton).toBeDisabled();

		const exportButton = screen.getByRole("button", { name: /exportar/i });
		expect(exportButton).not.toBeDisabled();
	});

	it("habilita botón cuando hay filas seleccionadas", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActionsWithSelection}
			/>
		);

		const checkboxes = screen.getAllByRole("checkbox");
		await user.click(checkboxes[1]); // El primero es "select all"

		const deleteButton = screen.getByRole("button", { name: /eliminar seleccionados/i });
		expect(deleteButton).not.toBeDisabled();
	});

	it("selecciona todas las filas con el checkbox de header", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActionsWithSelection}
				onSelectionChange={mockSelectionChange}
			/>
		);

		const checkboxes = screen.getAllByRole("checkbox");
		await user.click(checkboxes[0]); // Select all

		expect(mockSelectionChange).toHaveBeenCalledWith(mockUsers);
	});

	it("ejecuta acción con filas seleccionadas", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActionsWithSelection}
			/>
		);

		const checkboxes = screen.getAllByRole("checkbox");
		await user.click(checkboxes[1]); // Primera fila
		await user.click(checkboxes[2]); // Segunda fila

		const deleteButton = screen.getByRole("button", { name: /eliminar seleccionados/i });
		await user.click(deleteButton);

		expect(mockDeleteSelected).toHaveBeenCalledTimes(1);
		expect(mockDeleteSelected).toHaveBeenCalledWith(
			expect.arrayContaining([mockUsers[0], mockUsers[1]]),
			mockUsers
		);
	});

	it("muestra contador de elementos seleccionados", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActionsWithSelection}
			/>
		);

		const checkboxes = screen.getAllByRole("checkbox");
		await user.click(checkboxes[1]);
		await user.click(checkboxes[2]);
		await user.click(checkboxes[3]);

		expect(screen.getByText(/3 seleccionado/i)).toBeInTheDocument();
	});

	it("permite deseleccionar todo con el botón de limpiar", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActionsWithSelection}
				onSelectionChange={mockSelectionChange}
			/>
		);

		const checkboxes = screen.getAllByRole("checkbox");
		await user.click(checkboxes[0]); // Select all

		const clearButton = screen.getByText(/deseleccionar/i);
		await user.click(clearButton);

		expect(mockSelectionChange).toHaveBeenLastCalledWith([]);
	});
});
