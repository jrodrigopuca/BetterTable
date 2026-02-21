import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BetterTable } from "../index";
import { mockUsers, userColumns } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

describe("BetterTable - Search Debounce", () => {
	beforeEach(() => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("no filtra inmediatamente cuando debounceMs > 0", async () => {
		const user = userEvent.setup({
			advanceTimers: vi.advanceTimersByTime,
		});

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				searchable
				searchDebounceMs={300}
			/>
		);

		const searchInput = screen.getByPlaceholderText(/buscar/i);
		await user.type(searchInput, "Juan");

		// Input value updates immediately
		expect(searchInput).toHaveValue("Juan");

		// But data is NOT filtered yet (all rows still present)
		expect(screen.getByText("María López")).toBeInTheDocument();
		expect(screen.getByText("Carlos Ruiz")).toBeInTheDocument();
	});

	it("filtra después de que pasa el tiempo de debounce", async () => {
		const user = userEvent.setup({
			advanceTimers: vi.advanceTimersByTime,
		});

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				searchable
				searchDebounceMs={300}
			/>
		);

		const searchInput = screen.getByPlaceholderText(/buscar/i);
		await user.type(searchInput, "Juan");

		// Advance past the debounce
		act(() => {
			vi.advanceTimersByTime(350);
		});

		// Now the data should be filtered
		await waitFor(() => {
			expect(screen.queryByText("María López")).not.toBeInTheDocument();
		});
		expect(screen.getByText("Juan García")).toBeInTheDocument();
	});

	it("resetea el timer con cada keystroke (solo filtra al final)", async () => {
		const user = userEvent.setup({
			advanceTimers: vi.advanceTimersByTime,
		});

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				searchable
				searchDebounceMs={300}
			/>
		);

		const searchInput = screen.getByPlaceholderText(/buscar/i);

		// Type "J" then wait 200ms (less than debounce)
		await user.type(searchInput, "J");
		act(() => {
			vi.advanceTimersByTime(200);
		});

		// All data still present (debounce hasn't fired)
		expect(screen.getByText("María López")).toBeInTheDocument();

		// Type "uan" — this resets the timer
		await user.type(searchInput, "uan");
		act(() => {
			vi.advanceTimersByTime(200);
		});

		// Still hasn't fired (200ms since last keystroke < 300ms)
		expect(screen.getByText("María López")).toBeInTheDocument();

		// Advance remaining time
		act(() => {
			vi.advanceTimersByTime(150);
		});

		// Now it fires
		await waitFor(() => {
			expect(screen.queryByText("María López")).not.toBeInTheDocument();
		});
		expect(screen.getByText("Juan García")).toBeInTheDocument();
	});

	it("clearSearch limpia inmediatamente sin esperar debounce", async () => {
		const user = userEvent.setup({
			advanceTimers: vi.advanceTimersByTime,
		});

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				searchable
				searchDebounceMs={300}
			/>
		);

		const searchInput = screen.getByPlaceholderText(/buscar/i);
		await user.type(searchInput, "Juan");

		// Let debounce fire so data is filtered
		act(() => {
			vi.advanceTimersByTime(350);
		});

		await waitFor(() => {
			expect(screen.queryByText("María López")).not.toBeInTheDocument();
		});

		// Click clear button
		const clearButton = screen.getByRole("button", { name: /clear search/i });
		await user.click(clearButton);

		// Data should be restored IMMEDIATELY, no debounce wait
		expect(screen.getByText("María López")).toBeInTheDocument();
		expect(screen.getByText("Juan García")).toBeInTheDocument();
	});

	it("filtra inmediatamente cuando searchDebounceMs={0}", async () => {
		const user = userEvent.setup({
			advanceTimers: vi.advanceTimersByTime,
		});

		render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				searchable
				searchDebounceMs={0}
			/>
		);

		const searchInput = screen.getByPlaceholderText(/buscar/i);
		await user.type(searchInput, "Juan");

		// With debounce=0, filtering is immediate
		expect(screen.queryByText("María López")).not.toBeInTheDocument();
		expect(screen.getByText("Juan García")).toBeInTheDocument();
	});
});
