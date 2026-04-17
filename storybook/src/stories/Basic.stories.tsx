import type { Meta, StoryObj } from "@storybook/react";
import { BetterTable } from "better-table";
import { products, productColumns, type Product } from "../data";

const meta = {
  title: "BetterTable/Basic",
  component: BetterTable,
  parameters: {
    docs: {
      description: {
        component:
          "BetterTable is a modern, flexible, and fully typed React data table component. " +
          "At its simplest, just pass `data` and `columns`.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BetterTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Minimal: Story = {
  name: "Minimal",
  args: {
    data: products,
    columns: productColumns.slice(0, 4), // just name, brand, category, price
    pagination: false,
  },
};

export const WithPagination: Story = {
  name: "With Pagination",
  args: {
    data: products,
    columns: productColumns,
    pagination: { pageSize: 5, showSizeChanger: true, pageSizeOptions: [5, 10] },
  },
};

export const Striped: Story = {
  name: "Striped & Bordered",
  args: {
    data: products,
    columns: productColumns,
    striped: true,
    bordered: true,
    pagination: false,
  },
};

export const Sizes: Story = {
  name: "Size Variants",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {(["small", "medium", "large"] as const).map((size) => (
        <div key={size}>
          <h3 style={{ marginBottom: 8 }}>size=&quot;{size}&quot;</h3>
          <BetterTable<Product>
            data={products.slice(0, 3)}
            columns={productColumns.slice(0, 4)}
            size={size}
            pagination={false}
            bordered
          />
        </div>
      ))}
    </div>
  ),
};

export const Locales: Story = {
  name: "i18n (Spanish)",
  args: {
    data: products,
    columns: productColumns,
    locale: "es",
    searchable: true,
    pagination: { pageSize: 5, showSizeChanger: true },
  },
};

export const CustomEmptyState: Story = {
  name: "Custom Empty State",
  args: {
    data: [],
    columns: productColumns,
    emptyComponent: (
      <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
        <p style={{ fontSize: 48, margin: 0 }}>📭</p>
        <p>No products found. Try adjusting your filters.</p>
      </div>
    ),
    pagination: false,
  },
};

export const Loading: Story = {
  name: "Loading State",
  args: {
    data: products,
    columns: productColumns,
    loading: true,
    pagination: false,
  },
};
