import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { BetterTable } from "../index";
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

const columns: Column<Event>[] = [
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

/**
 * Helper: opens the filter panel by clicking the "Filtrar por" toggle button.
 */
async function openFilterPanel(user: ReturnType<typeof userEvent.setup>) {
	const toggleBtn = screen.getByRole("button", { name: /filter by/i });
	await user.click(toggleBtn);
}

describe("BetterTable - Filtrado de fechas", () => {
	it("renderiza dos inputs date (desde/hasta) para columnas tipo date", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<Event>
				data={events}
				columns={columns}
				rowKey="id"
				filterMode="panel"
			/>
		);

		await openFilterPanel(user);

		const fromInput = screen.getByLabelText(/from fecha/i);
		const toInput = screen.getByLabelText(/to fecha/i);

		expect(fromInput).toBeInTheDocument();
		expect(toInput).toBeInTheDocument();
		expect(fromInput).toHaveAttribute("type", "date");
		expect(toInput).toHaveAttribute("type", "date");
	});

	it("filtra por fecha 'desde'", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<Event>
				data={events}
				columns={columns}
				rowKey="id"
				filterMode="panel"
				searchDebounceMs={0}
			/>
		);

		await openFilterPanel(user);

		const fromInput = screen.getByLabelText(/from fecha/i);
		await user.clear(fromInput);
		await user.type(fromInput, "2025-06-01");

		// Only events from June onwards should show
		const rows = screen.getAllByRole("row");
		// Header + 3 data rows (C=Jun, D=Sep, E=Dec)
		expect(rows.length).toBe(4);
		expect(screen.getByText("Evento C")).toBeInTheDocument();
		expect(screen.getByText("Evento D")).toBeInTheDocument();
		expect(screen.getByText("Evento E")).toBeInTheDocument();
		expect(screen.queryByText("Evento A")).not.toBeInTheDocument();
		expect(screen.queryByText("Evento B")).not.toBeInTheDocument();
	});

	it("filtra por fecha 'hasta'", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<Event>
				data={events}
				columns={columns}
				rowKey="id"
				filterMode="panel"
				searchDebounceMs={0}
			/>
		);

		await openFilterPanel(user);

		const toInput = screen.getByLabelText(/to fecha/i);
		await user.clear(toInput);
		await user.type(toInput, "2025-03-31");

		// Only events until March should show
		const rows = screen.getAllByRole("row");
		// Header + 2 data rows (A=Jan, B=Mar)
		expect(rows.length).toBe(3);
		expect(screen.getByText("Evento A")).toBeInTheDocument();
		expect(screen.getByText("Evento B")).toBeInTheDocument();
		expect(screen.queryByText("Evento C")).not.toBeInTheDocument();
	});

	it("filtra por rango de fechas (desde + hasta)", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<Event>
				data={events}
				columns={columns}
				rowKey="id"
				filterMode="panel"
				searchDebounceMs={0}
			/>
		);

		await openFilterPanel(user);

		const fromInput = screen.getByLabelText(/from fecha/i);
		const toInput = screen.getByLabelText(/to fecha/i);

		await user.clear(fromInput);
		await user.type(fromInput, "2025-03-01");
		await user.clear(toInput);
		await user.type(toInput, "2025-09-30");

		// Events B (Mar), C (Jun), D (Sep) should show
		const rows = screen.getAllByRole("row");
		expect(rows.length).toBe(4);
		expect(screen.getByText("Evento B")).toBeInTheDocument();
		expect(screen.getByText("Evento C")).toBeInTheDocument();
		expect(screen.getByText("Evento D")).toBeInTheDocument();
		expect(screen.queryByText("Evento A")).not.toBeInTheDocument();
		expect(screen.queryByText("Evento E")).not.toBeInTheDocument();
	});

	it("muestra todos los datos cuando se limpian los filtros de fecha", async () => {
		const user = userEvent.setup();

		render(
			<BetterTable<Event>
				data={events}
				columns={columns}
				rowKey="id"
				filterMode="panel"
				searchDebounceMs={0}
			/>
		);

		await openFilterPanel(user);

		const fromInput = screen.getByLabelText(/from fecha/i);

		// Apply filter
		await user.clear(fromInput);
		await user.type(fromInput, "2025-12-01");

		// Only E should show
		expect(screen.getAllByRole("row").length).toBe(2);

		// Clear filter
		await user.clear(fromInput);

		// All events should return
		expect(screen.getAllByRole("row").length).toBe(6);
	});
});
