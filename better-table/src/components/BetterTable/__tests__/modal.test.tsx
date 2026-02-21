import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { BetterTable } from "../index";
import type { RowAction } from "../types";
import { fewUsers, userColumns } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Modal onClose", () => {
	it("cierra el modal al llamar onClose desde el contenido", async () => {
		const user = userEvent.setup();

		const rowActions: RowAction<User>[] = [
			{
				id: "edit",
				label: "Editar",
				icon: "✏️",
				mode: "modal",
				modalContent: ({ data, onClose }: { data: User; onClose: () => void }) => (
					<div>
						<p>Editando: {data.name}</p>
						<button onClick={onClose}>Cerrar desde contenido</button>
					</div>
				),
			},
		];

		render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

		const editButtons = screen.getAllByRole("button", { name: /editar/i });
		await user.click(editButtons[0]);

		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByText(/Editando: Juan García/)).toBeInTheDocument();

		const closeButton = screen.getByText("Cerrar desde contenido");
		await user.click(closeButton);

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("cierra el modal con el botón X", async () => {
		const user = userEvent.setup();

		const rowActions: RowAction<User>[] = [
			{
				id: "view",
				label: "Ver",
				mode: "modal",
				modalContent: ({ data }: { data: User; onClose: () => void }) => (
					<p>Detalles de {data.name}</p>
				),
			},
		];

		render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				rowActions={rowActions}
			/>
		);

		const viewButtons = screen.getAllByRole("button", { name: /ver/i });
		await user.click(viewButtons[0]);

		expect(screen.getByRole("dialog")).toBeInTheDocument();

		const closeX = screen.getByLabelText("Close modal");
		await user.click(closeX);

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});
});
