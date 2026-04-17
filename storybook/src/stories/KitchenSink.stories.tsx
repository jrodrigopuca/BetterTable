import type { Meta, StoryObj } from "@storybook/react";
import { BetterTable } from "better-table";
import { products, productColumns, productRowActions, productGlobalActions, type Product } from "../data";

const meta = {
  title: "BetterTable/Kitchen Sink",
  component: BetterTable,
  parameters: {
    docs: {
      description: {
        component: "All features enabled at once — sorting, filtering, pagination, selection, " +
          "actions, column visibility, resizable columns, expandable rows, and more.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BetterTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullFeatured: Story = {
  name: "Full Featured",
  args: {
    data: products,
    columns: productColumns,
    rowActions: productRowActions,
    globalActions: productGlobalActions,
    pagination: { pageSize: 5, showSizeChanger: true, pageSizeOptions: [5, 10, 20] },
    expandable: {
      render: (row: Product) => (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "8px 0" }}>
          <div><strong>SKU:</strong> {row.details?.sku ?? "N/A"}</div>
          <div><strong>Brand:</strong> {row.details?.brand ?? "N/A"}</div>
          <div><strong>Stock:</strong> {row.stock} units</div>
        </div>
      ),
    },
    searchable: true,
    searchColumns: ["name", "details.brand", "category"],
    selectionMode: "multiple",
    multiSort: true,
    columnVisibility: true,
    filterMode: "floating",
    resizable: true,
    striped: true,
    hoverable: true,
    bordered: true,
    stickyHeader: true,
    maxHeight: 500,
    size: "medium",
    ariaLabel: "Full featured product table",
  },
};
