import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { BetterTable } from "../index";
import { mockUsers, userColumns, withinTable } from "./helpers/test-data";
import type { User } from "./helpers/test-data";
import type { Column } from "../types";

interface Event {
	[key: string]: unknown;
	id: number;
	name: string;
	date: string;
}

const events: Event[] = [
	{ id: 1, name: "Evento A", date: "2025-01-15" },
	{ id: 2, name: "Evento B", date: "2025-03-22" },
	{ id: 3, name: "Evento C", date: "2025-06-10" },
	{ id: 4, name: "Evento D", date: "2025-09-05" },
	{ id: 5, name: "Evento E", date: "2025-12-31" },
];

const eventColumns: Column<Event>[] = [
	{ id: "name", accessor: "name", header: "Nombre" },
	{
		id: "date",
		accessor: "date",
		header: "Fecha",
		type: "date",
		filterable: true,
		sortable: true,
	},
];

describe("BetterTable - Floating Filters", () => {
	it("renders floating filter row by default (filterMode defaults to 'floating')", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		// Floating filter row should be in the DOM
		const filterRow = document.querySelector(".bt-floating-filter-row");
		expect(filterRow).not.toBeNull();

		// Filter panel toggle button should NOT be visible
		expect(screen.queryByRole("button", { name: /filter by/i })).not.toBeInTheDocument();
	});

	it("does NOT render floating filter row when filterMode='panel'", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				filterMode="panel"
			/>
		);

		// No floating filter row
		const container = document.querySelector(".bt-floating-filter-row");
		expect(container).toBeNull();

		// Panel toggle button IS visible
		expect(screen.getByRole("button", { name: /filter by/i })).toBeInTheDocument();
	});

	it("renders BOTH floating filters and panel toggle when filterMode='both'", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				filterMode="both"
			/>
		);

		// Floating filter row exists
		const filterRow = document.querySelector(".bt-floating-filter-row");
		expect(filterRow).not.toBeNull();

		// Panel toggle button also exists
		const toggleBtn = screen.getByRole("button", { name: /filter by/i });
		expect(toggleBtn).toBeInTheDocument();

		// Click the toggle to open the panel
		await user.click(toggleBtn);

		// Panel should now be visible
		const panel = document.querySelector(".bt-filter-panel");
		expect(panel).not.toBeNull();
	});

	it("filters text data via floating filter input", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		// Find the floating filter for "Nombre" column
		const nameInput = screen.getByLabelText(/filter by nombre/i);
		await user.type(nameInput, "Juan");

		const table = withinTable(container);
		expect(table.getByText("Juan García")).toBeInTheDocument();
		expect(table.queryByText("María López")).not.toBeInTheDocument();
	});

	it("filters boolean data via floating filter select", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		// Find the boolean select for "Activo" column
		const booleanSelect = screen.getByLabelText(/filter by activo/i);
		await user.selectOptions(booleanSelect, "false");

		const table = withinTable(container);
		// Only inactive users: Carlos Ruiz, Pedro Sánchez
		expect(table.getByText("Carlos Ruiz")).toBeInTheDocument();
		expect(table.getByText("Pedro Sánchez")).toBeInTheDocument();
		expect(table.queryByText("Juan García")).not.toBeInTheDocument();
	});

	it("renders date range inputs (from/to) for date columns", () => {
		render(
			<BetterTable<Event>
				data={events}
				columns={eventColumns}
				rowKey="id"
			/>
		);

		const fromInput = screen.getByLabelText(/from fecha/i);
		const toInput = screen.getByLabelText(/to fecha/i);

		expect(fromInput).toBeInTheDocument();
		expect(toInput).toBeInTheDocument();
		expect(fromInput).toHaveAttribute("type", "date");
		expect(toInput).toHaveAttribute("type", "date");
	});

	it("filters date data via floating filter date range", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<Event>
				data={events}
				columns={eventColumns}
				rowKey="id"
				searchDebounceMs={0}
			/>
		);

		const fromInput = screen.getByLabelText(/from fecha/i);
		await user.clear(fromInput);
		await user.type(fromInput, "2025-06-01");

		// Only events from June onwards: C, D, E
		expect(screen.getByText("Evento C")).toBeInTheDocument();
		expect(screen.getByText("Evento D")).toBeInTheDocument();
		expect(screen.getByText("Evento E")).toBeInTheDocument();
		expect(screen.queryByText("Evento A")).not.toBeInTheDocument();
		expect(screen.queryByText("Evento B")).not.toBeInTheDocument();
	});

	it("renders empty cells for non-filterable columns", () => {
		const columnsWithNonFilterable: Column<User>[] = [
			{ id: "name", accessor: "name", header: "Nombre", filterable: true },
			{ id: "email", accessor: "email", header: "Email", filterable: false },
			{ id: "age", accessor: "age", header: "Edad", type: "number", filterable: true },
		];

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={columnsWithNonFilterable}
				rowKey="id"
			/>
		);

		// Should have inputs for name and age but not email
		const nameInput = screen.getByLabelText(/filter by nombre/i);
		const ageInput = screen.getByLabelText(/filter by edad/i);
		expect(nameInput).toBeInTheDocument();
		expect(ageInput).toBeInTheDocument();

		// No filter for Email
		expect(screen.queryByLabelText(/filter by email/i)).not.toBeInTheDocument();
	});

	it("does not render floating filter row if no columns are filterable", () => {
		const nonFilterableColumns: Column<User>[] = [
			{ id: "name", accessor: "name", header: "Nombre", filterable: false },
			{ id: "email", accessor: "email", header: "Email", filterable: false },
		];

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={nonFilterableColumns}
				rowKey="id"
			/>
		);

		const filterRow = document.querySelector(".bt-floating-filter-row");
		expect(filterRow).toBeNull();
	});

	it("syncs floating filter with data when using filterMode='both'", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				filterMode="both"
			/>
		);

		// Type in the floating filter
		const nameInput = screen.getByLabelText(/filter by nombre/i);
		await user.type(nameInput, "Ana");

		const table = withinTable(container);
		expect(table.getByText("Ana Martín")).toBeInTheDocument();
		expect(table.queryByText("Juan García")).not.toBeInTheDocument();
	});

	it("has correct accessibility attributes", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
			/>
		);

		// Inputs should have aria-labels
		const nameInput = screen.getByLabelText(/filter by nombre/i);
		expect(nameInput).toHaveAttribute("aria-label");
		expect(nameInput).toHaveAttribute("id", "bt-ff-name");

		// Boolean select should have aria-label
		const boolSelect = screen.getByLabelText(/filter by activo/i);
		expect(boolSelect).toHaveAttribute("aria-label");
		expect(boolSelect).toHaveAttribute("id", "bt-ff-isActive");
	});
});
