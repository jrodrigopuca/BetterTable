import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BetterTable } from "../index";
import type { RowAction } from "../types";
import { fewUsers, userColumns } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Action Overflow Menu", () => {
	const mockView = vi.fn();
	const mockEdit = vi.fn();
	const mockClone = vi.fn();
	const mockArchive = vi.fn();
	const mockDelete = vi.fn();

	const manyActions: RowAction<User>[] = [
		{ id: "view", label: "Ver", icon: "👁️", mode: "callback", onClick: mockView },
		{ id: "edit", label: "Editar", icon: "✏️", mode: "callback", onClick: mockEdit },
		{ id: "clone", label: "Clonar", icon: "📋", mode: "callback", onClick: mockClone },
		{ id: "archive", label: "Archivar", icon: "📦", mode: "callback", onClick: mockArchive },
		{ id: "delete", label: "Eliminar", icon: "🗑️", mode: "callback", onClick: mockDelete, variant: "danger" },
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("muestra botón overflow (⋯) cuando hay más acciones que maxVisibleActions", () => {
		render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={manyActions}
				maxVisibleActions={3}
			/>
		);

		const overflowButtons = screen.getAllByRole("button", { name: /more actions/i });
		expect(overflowButtons.length).toBeGreaterThan(0);
	});

	it("muestra solo maxVisibleActions-1 botones inline + el trigger ⋯", () => {
		const { container } = render(
			<BetterTable<User>
				data={fewUsers.slice(0, 1)}
				columns={userColumns}
				rowKey="id"
				rowActions={manyActions}
				maxVisibleActions={3}
			/>
		);

		// maxVisibleActions=3, so 2 inline + 1 overflow trigger = 3 buttons total
		const actionsWrapper = container.querySelector(".bt-actions-wrapper");
		const inlineButtons = actionsWrapper!.querySelectorAll(":scope > .bt-action-btn");
		expect(inlineButtons.length).toBe(2); // 2 inline icon-only

		const overflowTrigger = actionsWrapper!.querySelector(".bt-overflow-trigger");
		expect(overflowTrigger).toBeInTheDocument();
	});

	it("no muestra overflow cuando acciones <= maxVisibleActions", () => {
		const fewActions: RowAction<User>[] = [
			{ id: "edit", label: "Editar", icon: "✏️", mode: "callback", onClick: mockEdit },
			{ id: "delete", label: "Eliminar", icon: "🗑️", mode: "callback", onClick: mockDelete },
		];

		const { container } = render(
			<BetterTable<User>
				data={fewUsers.slice(0, 1)}
				columns={userColumns}
				rowKey="id"
				rowActions={fewActions}
				maxVisibleActions={3}
			/>
		);

		const overflowTrigger = container.querySelector(".bt-overflow-trigger");
		expect(overflowTrigger).not.toBeInTheDocument();
	});

	it("abre el menú dropdown al hacer click en ⋯", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={fewUsers.slice(0, 1)}
				columns={userColumns}
				rowKey="id"
				rowActions={manyActions}
				maxVisibleActions={3}
			/>
		);

		const overflowBtn = screen.getAllByRole("button", { name: /more actions/i })[0];
		await user.click(overflowBtn);

		const menu = document.querySelector(".bt-overflow-menu");
		expect(menu).toBeInTheDocument();
	});

	it("muestra icono + label en los items del dropdown", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={fewUsers.slice(0, 1)}
				columns={userColumns}
				rowKey="id"
				rowActions={manyActions}
				maxVisibleActions={3}
			/>
		);

		const overflowBtn = screen.getAllByRole("button", { name: /more actions/i })[0];
		await user.click(overflowBtn);

		// overflow should contain the last 3 actions (clone, archive, delete)
		const menuItems = document.querySelectorAll(".bt-overflow-item");
		expect(menuItems.length).toBe(3);

		// Each item should have icon + label
		const labels = Array.from(menuItems).map(
			(item) => item.querySelector(".bt-overflow-item-label")?.textContent
		);
		expect(labels).toContain("Clonar");
		expect(labels).toContain("Archivar");
		expect(labels).toContain("Eliminar");
	});

	it("ejecuta la acción al hacer click en un item del dropdown", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={fewUsers.slice(0, 1)}
				columns={userColumns}
				rowKey="id"
				rowActions={manyActions}
				maxVisibleActions={3}
			/>
		);

		const overflowBtn = screen.getAllByRole("button", { name: /more actions/i })[0];
		await user.click(overflowBtn);

		const cloneItem = document.querySelector(".bt-overflow-item");
		await user.click(cloneItem!);

		expect(mockClone).toHaveBeenCalledWith(fewUsers[0], 0);
	});

	it("cierra el menú después de hacer click en una acción", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={fewUsers.slice(0, 1)}
				columns={userColumns}
				rowKey="id"
				rowActions={manyActions}
				maxVisibleActions={3}
			/>
		);

		const overflowBtn = screen.getAllByRole("button", { name: /more actions/i })[0];
		await user.click(overflowBtn);

		const cloneItem = document.querySelector(".bt-overflow-item");
		await user.click(cloneItem!);

		const menu = document.querySelector(".bt-overflow-menu");
		expect(menu).not.toBeInTheDocument();
	});

	it("coloca acciones danger al final con separador", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={fewUsers.slice(0, 1)}
				columns={userColumns}
				rowKey="id"
				rowActions={manyActions}
				maxVisibleActions={3}
			/>
		);

		const overflowBtn = screen.getAllByRole("button", { name: /more actions/i })[0];
		await user.click(overflowBtn);

		// Should have a separator before danger items
		const separator = document.querySelector(".bt-overflow-separator");
		expect(separator).toBeInTheDocument();

		// Danger item should have the danger class
		const dangerItem = document.querySelector(".bt-overflow-item-danger");
		expect(dangerItem).toBeInTheDocument();
		expect(dangerItem!.querySelector(".bt-overflow-item-label")!.textContent).toBe("Eliminar");
	});

	it("usa icono por defecto 📦 cuando la acción no tiene icono", () => {
		const actionsWithoutIcon: RowAction<User>[] = [
			{ id: "custom", label: "Custom", mode: "callback", onClick: vi.fn() },
		];

		const { container } = render(
			<BetterTable<User>
				data={fewUsers.slice(0, 1)}
				columns={userColumns}
				rowKey="id"
				rowActions={actionsWithoutIcon}
			/>
		);

		const iconSpan = container.querySelector(".bt-action-icon");
		expect(iconSpan).toBeInTheDocument();
		expect(iconSpan!.textContent).toBe("📦");
	});

	it("renderiza acciones inline como icon-only con title tooltip", () => {
		const { container } = render(
			<BetterTable<User>
				data={fewUsers.slice(0, 1)}
				columns={userColumns}
				rowKey="id"
				rowActions={manyActions}
				maxVisibleActions={3}
			/>
		);

		const inlineBtn = container.querySelector(".bt-action-icon-only");
		expect(inlineBtn).toBeInTheDocument();
		expect(inlineBtn!.getAttribute("title")).toBeTruthy();
		expect(inlineBtn!.getAttribute("aria-label")).toBeTruthy();
	});

	it("cierra el menú al hacer click fuera", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={fewUsers.slice(0, 1)}
				columns={userColumns}
				rowKey="id"
				rowActions={manyActions}
				maxVisibleActions={3}
			/>
		);

		const overflowBtn = screen.getAllByRole("button", { name: /more actions/i })[0];
		await user.click(overflowBtn);

		expect(document.querySelector(".bt-overflow-menu")).toBeInTheDocument();

		// Click outside
		await user.click(document.body);

		expect(document.querySelector(".bt-overflow-menu")).not.toBeInTheDocument();
	});
});
