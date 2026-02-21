import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BetterTable } from "../index";
import { fewUsers, userColumns, withinTable } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Tabla básica con pocos elementos", () => {
	it("renderiza correctamente una tabla con pocos datos", () => {
		const { container } = render(<BetterTable<User> data={fewUsers} columns={userColumns} rowKey="id" />);

		const table = withinTable(container);
		expect(table.getByText("Nombre")).toBeInTheDocument();
		expect(table.getByText("Email")).toBeInTheDocument();
		expect(table.getByText("Edad")).toBeInTheDocument();
		expect(table.getByText("Juan García")).toBeInTheDocument();
		expect(table.getByText("María López")).toBeInTheDocument();
		expect(table.getByText("juan@example.com")).toBeInTheDocument();
	});

	it("no muestra paginación cuando hay pocos elementos", () => {
		render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				pagination={{ pageSize: 10 }}
			/>
		);

		const pagination = screen.queryByRole("navigation");
		if (pagination) {
			expect(screen.queryByText("2", { selector: "button" })).not.toBeInTheDocument();
		}
	});

	it("muestra mensaje de tabla vacía cuando no hay datos", () => {
		render(
			<BetterTable<User>
				data={[]}
				columns={userColumns}
				rowKey="id"
				locale={{ noData: "No hay datos disponibles" }}
			/>
		);

		expect(screen.getByText("No hay datos disponibles")).toBeInTheDocument();
	});

	it("aplica estilos personalizados correctamente", () => {
		render(
			<BetterTable<User>
				data={fewUsers}
				columns={userColumns}
				rowKey="id"
				striped
				bordered
				hoverable
				size="small"
			/>
		);

		const table = screen.getByRole("grid");
		expect(table.closest(".bt-container")).toHaveClass("bt-striped", "bt-bordered", "bt-hoverable", "bt-size-small");
	});
});
