import type { Meta, StoryObj } from "@storybook/react";
import { BetterTable } from "better-table";
import { products, productColumns, type Product } from "../data";

const meta = {
  title: "BetterTable/Expandable Rows",
  component: BetterTable,
  parameters: {
    docs: {
      description: {
        component:
          "Expandable rows show additional detail content below each row when toggled. " +
          "Supports multiple expanded rows (default) or accordion mode (only one at a time). " +
          "Fully controlled mode available with `expandedRows` + `onExpandChange`.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BetterTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "Expandable Rows",
  args: {
    data: products,
    columns: productColumns.slice(0, 4),
    expandable: {
      render: (row: Product) => (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "8px 0" }}>
          <div><strong>SKU:</strong> {row.details?.sku ?? "N/A"}</div>
          <div><strong>Brand:</strong> {row.details?.brand ?? "N/A"}</div>
          <div><strong>Stock:</strong> {row.stock} units</div>
          <div><strong>Added:</strong> {row.addedDate}</div>
        </div>
      ),
    },
    pagination: false,
  },
};

export const Accordion: Story = {
  name: "Accordion Mode",
  args: {
    data: products,
    columns: productColumns.slice(0, 4),
    expandable: {
      render: (row: Product) => (
        <div style={{ padding: "8px 0" }}>
          <p style={{ margin: 0 }}>
            <strong>{row.name}</strong> — {row.category} · ${row.price.toLocaleString()} · {row.stock} in stock
          </p>
        </div>
      ),
      accordion: true,
    },
    pagination: false,
  },
  parameters: {
    docs: {
      description: {
        story: "With `accordion: true`, only one row can be expanded at a time.",
      },
    },
  },
};
