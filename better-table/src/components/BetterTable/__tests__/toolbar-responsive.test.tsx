import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BetterTable } from "../index";
import type { GlobalAction } from "../types";
import { mockUsers, userColumns } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

/**
 * Sets matchMedia to simulate mobile viewport (max-width: 640px).
 * Returns a cleanup function that restores the original mock.
 */
function setMobile() {
	const original = window.matchMedia;
	window.matchMedia = vi.fn().mockImplementation((query: string) => ({
		matches: query.includes("max-width"),
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn(),
	}));
	return () => {
		window.matchMedia = original;
	};
}

describe("BetterTable - Toolbar Responsive (mobile)", () => {
	let cleanup: () => void;

	const globalActions: GlobalAction<User>[] = [
		{
			id: "export",
			label: "Exportar datos",
			icon: "📥",
			onClick: vi.fn(),
		},
		{
			id: "delete",
			label: "Eliminar seleccionados",
			icon: "🗑️",
			variant: "danger",
			requiresSelection: true,
			onClick: vi.fn(),
		},
	];

	beforeEach(() => {
		cleanup = setMobile();
	});

	afterEach(() => {
		cleanup();
	});

	it("muestra botón de búsqueda colapsado en móvil", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				searchable
			/>
		);

		// Should show search toggle button, not the input
		const toggleBtn = screen.getByRole("button", { name: /buscar/i });
		expect(toggleBtn).toBeInTheDocument();

		// Search input should NOT be visible initially
		expect(screen.queryByPlaceholderText(/buscar/i)).not.toBeInTheDocument();
	});

	it("expande búsqueda al hacer click en el icono", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				searchable
			/>
		);

		const toggleBtn = screen.getByRole("button", { name: /buscar/i });
		await user.click(toggleBtn);

		// Now the search input should be visible
		const searchInput = screen.getByPlaceholderText(/buscar/i);
		expect(searchInput).toBeInTheDocument();
	});

	it("colapsa búsqueda al hacer click en el botón cerrar", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				searchable
			/>
		);

		// Expand search
		const toggleBtn = screen.getByRole("button", { name: /buscar/i });
		await user.click(toggleBtn);

		// Should show close button
		const closeBtn = screen.getByRole("button", { name: /close search/i });
		await user.click(closeBtn);

		// Search input gone, toggle button back
		expect(screen.queryByPlaceholderText(/buscar/i)).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: /buscar/i })).toBeInTheDocument();
	});

	it("muestra acciones globales como icon-only en móvil", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				globalActions={globalActions}
			/>
		);

		// Buttons should exist with title/aria-label
		const exportBtn = screen.getByRole("button", { name: "Exportar datos" });
		expect(exportBtn).toBeInTheDocument();

		// Label text should NOT be visible (only icon rendered)
		expect(exportBtn.textContent).toBe("📥");
	});

	it("acorta texto de selección a 'sel.' en móvil", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				selectable
				globalActions={globalActions}
			/>
		);

		// Select first row
		const checkboxes = screen.getAllByRole("checkbox");
		await user.click(checkboxes[1]); // first data row checkbox

		// Should show abbreviated text
		expect(screen.getByText(/1 sel\./)).toBeInTheDocument();
	});

	it("muestra botón ✕ para deseleccionar en móvil", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				selectable
				globalActions={globalActions}
			/>
		);

		// Select first row
		const checkboxes = screen.getAllByRole("checkbox");
		await user.click(checkboxes[1]);

		// Deselect button should be ✕, not full text
		const clearBtn = screen.getByText("✕");
		expect(clearBtn).toBeInTheDocument();
	});
});
