import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BetterTable } from "../index";
import { mockUsers, userColumns } from "./helpers/test-data";
import type { User } from "./helpers/test-data";

/** Helper to get sort buttons inside the table header only */
function getSortButtons(container: HTMLElement) {
	const thead = container.querySelector(".bt-thead");
	return thead ? Array.from(thead.querySelectorAll(".bt-sort-btn")) as HTMLButtonElement[] : [];
}

describe("BetterTable - Multi-Sort", () => {
	it("adds columns to multi-sort by clicking different columns", async () => {
		const user = userEvent.setup();
		const onMultiSortChange = vi.fn();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				multiSort
				onMultiSortChange={onMultiSortChange}
				pagination={false}
				filterMode="panel"
			/>
		);

		const sortButtons = getSortButtons(container);

		// Click name → adds name asc
		await user.click(sortButtons[0]);
		expect(onMultiSortChange).toHaveBeenLastCalledWith([
			{ columnId: "name", direction: "asc" },
		]);

		// Click age → adds age asc as secondary sort
		await user.click(sortButtons[2]);
		expect(onMultiSortChange).toHaveBeenLastCalledWith([
			{ columnId: "name", direction: "asc" },
			{ columnId: "age", direction: "asc" },
		]);

		// Should show priority badges (1, 2)
		const badges = container.querySelectorAll(".bt-sort-priority");
		expect(badges.length).toBe(2);
		expect(badges[0]).toHaveTextContent("1");
		expect(badges[1]).toHaveTextContent("2");
	});

	it("cycles through asc → desc → unsorted per column", async () => {
		const user = userEvent.setup();
		const onMultiSortChange = vi.fn();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				multiSort
				onMultiSortChange={onMultiSortChange}
				pagination={false}
				filterMode="panel"
			/>
		);

		const sortButtons = getSortButtons(container);

		// Click name → add name asc
		await user.click(sortButtons[0]);
		expect(onMultiSortChange).toHaveBeenLastCalledWith([
			{ columnId: "name", direction: "asc" },
		]);

		// Click name again → toggle to desc
		await user.click(sortButtons[0]);
		expect(onMultiSortChange).toHaveBeenLastCalledWith([
			{ columnId: "name", direction: "desc" },
		]);

		// Click name a third time → remove (unsorted)
		await user.click(sortButtons[0]);
		expect(onMultiSortChange).toHaveBeenLastCalledWith([]);
	});

	it("removes column from multi-sort after cycling through asc/desc", async () => {
		const user = userEvent.setup();
		const onMultiSortChange = vi.fn();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				multiSort
				onMultiSortChange={onMultiSortChange}
				pagination={false}
				filterMode="panel"
			/>
		);

		const sortButtons = getSortButtons(container);

		// Sort by name asc
		await user.click(sortButtons[0]);

		// Add age asc
		await user.click(sortButtons[2]);
		expect(container.querySelectorAll(".bt-sort-priority").length).toBe(2);

		// Click age again → toggle to desc
		await user.click(sortButtons[2]);
		expect(onMultiSortChange).toHaveBeenLastCalledWith([
			{ columnId: "name", direction: "asc" },
			{ columnId: "age", direction: "desc" },
		]);

		// Click age again → remove it
		await user.click(sortButtons[2]);
		expect(onMultiSortChange).toHaveBeenLastCalledWith([
			{ columnId: "name", direction: "asc" },
		]);

		// Only one sort remaining — no badges shown (need >1 for badges)
		expect(container.querySelectorAll(".bt-sort-priority").length).toBe(0);
	});

	it("calls onMultiSortChange callback on each click", async () => {
		const user = userEvent.setup();
		const onMultiSortChange = vi.fn();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				multiSort
				onMultiSortChange={onMultiSortChange}
				pagination={false}
				filterMode="panel"
			/>
		);

		const sortButtons = getSortButtons(container);

		// Click name → adds name asc
		await user.click(sortButtons[0]);
		expect(onMultiSortChange).toHaveBeenCalledWith([
			{ columnId: "name", direction: "asc" },
		]);

		// Click age → adds age asc
		await user.click(sortButtons[2]);
		expect(onMultiSortChange).toHaveBeenCalledWith([
			{ columnId: "name", direction: "asc" },
			{ columnId: "age", direction: "asc" },
		]);
	});

	it("does not show priority badges when multiSort is disabled", async () => {
		const user = userEvent.setup();

		const { container } = render(
			<BetterTable<User>
				data={mockUsers}
				columns={userColumns}
				rowKey="id"
				pagination={false}
				filterMode="panel"
			/>
		);

		const sortButtons = getSortButtons(container);
		await user.click(sortButtons[0]);

		expect(container.querySelectorAll(".bt-sort-priority").length).toBe(0);
	});
});
