import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BetterTable } from "../index";
import { mockUsers, userColumns } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Estados de carga", () => {
	it("muestra indicador de carga", () => {
		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				loading
			/>
		);

		expect(screen.getByText(/loading/i)).toBeInTheDocument();
	});

	it("usa componente de carga personalizado", () => {
		const CustomLoader = () => <div data-testid="custom-loader">Mi loader...</div>;

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				loading
				loadingComponent={<CustomLoader />}
			/>
		);

		expect(screen.getByTestId("custom-loader")).toBeInTheDocument();
	});
});
