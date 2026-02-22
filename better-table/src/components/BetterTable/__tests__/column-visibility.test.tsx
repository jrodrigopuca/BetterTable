import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BetterTable } from "../index";
import { mockUsers, userColumns } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Column Visibility Toggle", () => {
	it("renders column visibility button when columnVisibility is true", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				columnVisibility
				locale="es"
			/>
		);

		const columnsBtn = screen.getByLabelText(/columnas/i);
		expect(columnsBtn).toBeInTheDocument();
	});

	it("does not render column visibility button when columnVisibility is false", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				locale="es"
			/>
		);

		expect(screen.queryByLabelText(/columnas/i)).not.toBeInTheDocument();
	});

	it("opens dropdown showing all columns when clicked", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				columnVisibility
				locale="es"
			/>
		);

		const columnsBtn = screen.getByLabelText(/columnas/i);
		await user.click(columnsBtn);

		// All non-custom columns should appear as menu items
		expect(screen.getByRole("menuitemcheckbox", { name: /nombre/i })).toBeInTheDocument();
		expect(screen.getByRole("menuitemcheckbox", { name: /email/i })).toBeInTheDocument();
		expect(screen.getByRole("menuitemcheckbox", { name: /edad/i })).toBeInTheDocument();
		expect(screen.getByRole("menuitemcheckbox", { name: /activo/i })).toBeInTheDocument();
		expect(screen.getByRole("menuitemcheckbox", { name: /rol/i })).toBeInTheDocument();
	});

	it("hides a column when toggled off", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				columnVisibility
				locale="es"
				pagination={false}
			/>
		);

		// Email column should be visible initially
		const headersBefore = container.querySelectorAll(".bt-th .bt-th-title");
		const headerTextsBefore = Array.from(headersBefore).map((h) => h.textContent);
		expect(headerTextsBefore).toContain("Email");

		// Open dropdown and hide Email
		const columnsBtn = screen.getByLabelText(/columnas/i);
		await user.click(columnsBtn);

		const emailItem = screen.getByRole("menuitemcheckbox", { name: /email/i });
		await user.click(emailItem);

		// Email header should no longer be visible
		const headersAfter = container.querySelectorAll(".bt-th .bt-th-title");
		const headerTextsAfter = Array.from(headersAfter).map((h) => h.textContent);
		expect(headerTextsAfter).not.toContain("Email");
	});

	it("shows hidden column when toggled back on", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				columnVisibility
				locale="es"
				pagination={false}
			/>
		);

		const columnsBtn = screen.getByLabelText(/columnas/i);

		// Hide Email
		await user.click(columnsBtn);
		const emailItem = screen.getByRole("menuitemcheckbox", { name: /email/i });
		await user.click(emailItem);

		// Email header should be hidden
		const headersHidden = container.querySelectorAll(".bt-th .bt-th-title");
		const headerTextsHidden = Array.from(headersHidden).map((h) => h.textContent);
		expect(headerTextsHidden).not.toContain("Email");

		// Show Email again (the dropdown item is still visible since it's a toggle)
		const emailItemHidden = screen.getByRole("menuitemcheckbox", { name: /email/i });
		await user.click(emailItemHidden);

		// Email header should be visible again
		const headersVisible = container.querySelectorAll(".bt-th .bt-th-title");
		const headerTextsVisible = Array.from(headersVisible).map((h) => h.textContent);
		expect(headerTextsVisible).toContain("Email");
	});

	it("shows 'Mostrar todas' button when columns are hidden", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				columnVisibility
				locale="es"
			/>
		);

		const columnsBtn = screen.getByLabelText(/columnas/i);
		await user.click(columnsBtn);

		// No "Mostrar todas" button initially (no hidden columns)
		expect(screen.queryByText(/mostrar todas/i)).not.toBeInTheDocument();

		// Hide a column
		const emailItem = screen.getByRole("menuitemcheckbox", { name: /email/i });
		await user.click(emailItem);

		// "Mostrar todas" should appear in the dropdown (still open)
		expect(screen.getByText(/mostrar todas/i)).toBeInTheDocument();
	});

	it("shows badge count of hidden columns", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				columnVisibility
				locale="es"
			/>
		);

		const columnsBtn = screen.getByLabelText(/columnas/i);

		// No badge initially
		expect(container.querySelector(".bt-column-visibility-badge")).not.toBeInTheDocument();

		// Hide two columns
		await user.click(columnsBtn);
		await user.click(screen.getByRole("menuitemcheckbox", { name: /email/i }));
		await user.click(screen.getByRole("menuitemcheckbox", { name: /edad/i }));

		// Badge should show "2"
		const badge = container.querySelector(".bt-column-visibility-badge");
		expect(badge).toBeInTheDocument();
		expect(badge).toHaveTextContent("2");
	});

	it("calls onColumnVisibilityChange callback", async () => {
		const user = userEvent.setup();
		const onColumnVisibilityChange = vi.fn();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				columnVisibility
				locale="es"
				onColumnVisibilityChange={onColumnVisibilityChange}
			/>
		);

		const columnsBtn = screen.getByLabelText(/columnas/i);
		await user.click(columnsBtn);

		const emailItem = screen.getByRole("menuitemcheckbox", { name: /email/i });
		await user.click(emailItem);

		expect(onColumnVisibilityChange).toHaveBeenCalledWith(["email"]);
	});

	it("closes dropdown on Escape key", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				columnVisibility
				locale="es"
			/>
		);

		const columnsBtn = screen.getByLabelText(/columnas/i);
		await user.click(columnsBtn);

		// Menu should be open
		expect(screen.getByRole("menu")).toBeInTheDocument();

		// Press Escape
		await user.keyboard("{Escape}");

		// Menu should be closed
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	it("respects initially hidden columns from column config", () => {
		const columnsWithHidden = [
			...userColumns.slice(0, 2),
			{ ...userColumns[2], hidden: true }, // Age hidden
			...userColumns.slice(3),
		];

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={columnsWithHidden}
				rowKey="id"
				columnVisibility
				locale="es"
				pagination={false}
			/>
		);

		// Age header should not be visible
		const headers = container.querySelectorAll(".bt-th .bt-th-title");
		const headerTexts = Array.from(headers).map((h) => h.textContent);
		expect(headerTexts).not.toContain("Edad");

		// Badge should show "1"
		const badge = container.querySelector(".bt-column-visibility-badge");
		expect(badge).toHaveTextContent("1");
	});
});
