import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BetterTable } from "../index";
import type { RowAction } from "../types";
import { mockUsers, userColumns } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Accesibilidad", () => {
	it("tiene atributos ARIA correctos", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				ariaLabel="Tabla de usuarios"
				ariaDescribedBy="users-description"
			/>
		);

		const table = screen.getByRole("grid");
		expect(table).toHaveAttribute("aria-label", "Tabla de usuarios");
		expect(table).toHaveAttribute("aria-describedby", "users-description");
	});

	it("checkboxes tienen labels accesibles", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				selectable
			/>
		);

		const checkboxes = screen.getAllByRole("checkbox");
		checkboxes.forEach((checkbox) => {
			expect(checkbox).toHaveAccessibleName();
		});
	});

	it("botones de acción tienen labels accesibles", () => {
		const rowActions: RowAction<User>[] = [
			{ id: "edit", label: "Editar", mode: "callback", onClick: vi.fn() },
		];

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		const buttons = screen.getAllByRole("button", { name: /editar/i });
		buttons.forEach((button) => {
			expect(button).toHaveAccessibleName();
		});
	});
});
