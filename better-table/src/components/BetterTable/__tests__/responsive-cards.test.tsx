import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BetterTable } from "../index";
import type { Column, RowAction } from "../types";
import { mockUsers, fewUsers, userColumns } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Responsive Card Layout", () => {
	it("renderiza tanto tabla como cards en el DOM", () => {
		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		expect(container.querySelector(".bt-table")).toBeInTheDocument();
		expect(container.querySelector(".bt-cards")).toBeInTheDocument();
	});

	it("renderiza una card por cada fila de datos", () => {
		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		const cards = container.querySelectorAll(".bt-card");
		expect(cards.length).toBe(mockUsers.length);
	});

	it("muestra el título correcto en cada card (primera columna)", () => {
		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		const cardTitles = container.querySelectorAll(".bt-card-title");
		expect(cardTitles[0]).toHaveTextContent("Juan García");
		expect(cardTitles[1]).toHaveTextContent("María López");
	});

	it("muestra las demás columnas como filas label-value en cards", () => {
		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		const cardLabels = container.querySelectorAll(".bt-card-label");
		const labelTexts = Array.from(cardLabels).map(l => l.textContent);

		expect(labelTexts).toContain("Email");
		expect(labelTexts).toContain("Edad");
	});

	it("muestra checkbox en cards cuando es selectable", () => {
		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				selectable={true}
			/>
		);

		const cardCheckboxes = container.querySelectorAll(".bt-card .bt-checkbox");
		expect(cardCheckboxes.length).toBe(fewUsers.length);
	});

	it("no muestra checkbox en cards cuando no es selectable", () => {
		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				selectable={false}
			/>
		);

		const cardCheckboxes = container.querySelectorAll(".bt-card .bt-checkbox");
		expect(cardCheckboxes.length).toBe(0);
	});

	it("permite seleccionar una card", async () => {
		const user = userEvent.setup();
		const mockSelectionChange = vi.fn();

		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				selectable={true}
				onSelectionChange={mockSelectionChange}
			/>
		);

		const cardCheckboxes = container.querySelectorAll(".bt-card .bt-checkbox");
		await user.click(cardCheckboxes[0]);

		expect(mockSelectionChange).toHaveBeenCalled();
	});

	it("aplica clase bt-selected a cards seleccionadas", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				selectable={true}
			/>
		);

		const cardCheckboxes = container.querySelectorAll(".bt-card .bt-checkbox");
		await user.click(cardCheckboxes[0]);

		const cards = container.querySelectorAll(".bt-card");
		expect(cards[0]).toHaveClass("bt-selected");
		expect(cards[1]).not.toHaveClass("bt-selected");
	});

	it("muestra acciones de fila en cards", () => {
		const rowActions: RowAction<User>[] = [
			{ id: "edit", label: "Editar", icon: "✏️", mode: "callback", onClick: vi.fn() },
			{ id: "delete", label: "Eliminar", icon: "🗑️", mode: "callback", onClick: vi.fn(), variant: "danger" },
		];

		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		const cardActions = container.querySelectorAll(".bt-card-actions");
		expect(cardActions.length).toBe(fewUsers.length);

		const firstCardActions = cardActions[0].querySelectorAll(".bt-action-btn");
		expect(firstCardActions.length).toBe(2);
	});

	it("ejecuta acción de fila al hacer click en botón de card", async () => {
		const user = userEvent.setup();
		const mockEdit = vi.fn();

		const rowActions: RowAction<User>[] = [
			{ id: "edit", label: "Editar", icon: "✏️", mode: "callback", onClick: mockEdit },
		];

		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		const editButtons = container.querySelectorAll(".bt-card-actions .bt-action-btn");
		await user.click(editButtons[0]);

		expect(mockEdit).toHaveBeenCalledWith(fewUsers[0], 0);
	});

	it("no muestra cards cuando no hay datos", () => {
		const { container } = render(
			<BetterTable<User>
				data={[]}
				columns={userColumns}
				rowKey="id"
			/>
		);

		const cards = container.querySelectorAll(".bt-card");
		expect(cards.length).toBe(0);
	});

	it("maneja columnas ocultas correctamente en cards", () => {
		const columnsWithHidden: Column<User>[] = [
			{ id: "name", accessor: "name", header: "Nombre" },
			{ id: "email", accessor: "email", header: "Email", hidden: true },
			{ id: "age", accessor: "age", header: "Edad" },
		];

		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={columnsWithHidden}
				rowKey="id"
			/>
		);

		const cardLabels = container.querySelectorAll(".bt-card-label");
		const labelTexts = Array.from(cardLabels).map(l => l.textContent);

		expect(labelTexts).not.toContain("Email");
		expect(labelTexts).toContain("Edad");
	});

	it("renderiza valores booleanos correctamente en cards", () => {
		const columnsWithBoolean: Column<User>[] = [
			{ id: "name", accessor: "name", header: "Nombre" },
			{ id: "isActive", accessor: "isActive", header: "Activo", type: "boolean" },
		];

		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={columnsWithBoolean}
				rowKey="id"
			/>
		);

		const cardValues = container.querySelectorAll(".bt-card-value");
		const hasCheckmark = Array.from(cardValues).some(v => v.textContent?.includes("✅"));
		expect(hasCheckmark).toBe(true);
	});

	it("renderiza valores null como guión en cards", () => {
		const usersWithNull: User[] = [
			{ id: 1, name: "Test", email: "test@test.com", age: undefined },
		];

		const columnsWithAge: Column<User>[] = [
			{ id: "name", accessor: "name", header: "Nombre" },
			{ id: "age", accessor: "age", header: "Edad" },
		];

		const { container } = render(
			<BetterTable<User>
				data={usersWithNull}
				columns={columnsWithAge}
				rowKey="id"
			/>
		);

		const emptyValues = container.querySelectorAll(".bt-card-value-empty");
		expect(emptyValues.length).toBeGreaterThan(0);
	});

	it("aplica clase bt-hoverable a cards cuando hoverable=true", () => {
		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				hoverable={true}
			/>
		);

		const cards = container.querySelectorAll(".bt-card");
		cards.forEach(card => {
			expect(card).toHaveClass("bt-hoverable");
		});
	});

	it("permite click en card cuando onRowClick está definido", async () => {
		const user = userEvent.setup();
		const mockRowClick = vi.fn();

		const { container } = render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				onRowClick={mockRowClick}
			/>
		);

		const cards = container.querySelectorAll(".bt-card");
		await user.click(cards[0]);

		expect(mockRowClick).toHaveBeenCalledWith(fewUsers[0], 0);
	});
});
