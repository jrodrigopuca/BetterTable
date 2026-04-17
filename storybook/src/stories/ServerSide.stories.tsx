import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BetterTable } from "better-table";
import type { SortState, FilterState } from "better-table";
import { products, productColumns } from "../data";

const meta = {
  title: "BetterTable/Server-Side Mode",
  component: BetterTable,
  parameters: {
    docs: {
      description: {
        component:
          "Use `manualSorting`, `manualFiltering`, and `manualPagination` to skip client-side processing. " +
          "The table passes through data as-is and fires callbacks so you can fetch from your API. " +
          "Combine with `pagination.totalItems` for server-side pagination.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BetterTable>;

export default meta;
type Story = StoryObj<typeof meta>;

function ServerSideDemo() {
  const [sort, setSort] = useState<SortState>({ columnId: null, direction: "asc" });
  const [filters, setFilters] = useState<FilterState>({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  return (
    <div>
      <div style={{ marginBottom: 16, padding: 12, background: "#f5f5f5", borderRadius: 8, fontSize: 13, fontFamily: "monospace" }}>
        <div><strong>sort:</strong> {JSON.stringify(sort)}</div>
        <div><strong>filters:</strong> {JSON.stringify(filters)}</div>
        <div><strong>search:</strong> &quot;{search}&quot;</div>
        <div><strong>page:</strong> {page}</div>
      </div>

      <BetterTable
        data={products.slice(0, 5)}
        columns={productColumns}
        manualSorting
        manualFiltering
        manualPagination
        sort={sort}
        onSortChange={setSort}
        filters={filters}
        onFilterChange={setFilters}
        searchable
        searchValue={search}
        onSearchChange={setSearch}
        pagination={{ pageSize: 5, totalItems: products.length, page }}
        onPageChange={(p) => setPage(p)}
        filterMode="floating"
      />
    </div>
  );
}

export const ServerSide: Story = {
  name: "Server-Side Demo",
  render: () => <ServerSideDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "All sorting, filtering, search, and pagination are delegated to the server. " +
          "The debug panel above shows the state that would be sent to your API.",
      },
    },
  },
};
