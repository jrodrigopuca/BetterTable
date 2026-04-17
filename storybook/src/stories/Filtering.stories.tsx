import type { Meta, StoryObj } from "@storybook/react";
import { BetterTable } from "better-table";
import { products, productColumns, type Product } from "../data";

const meta = {
  title: "BetterTable/Filtering",
  component: BetterTable,
  parameters: {
    docs: {
      description: {
        component:
          "BetterTable supports per-column filtering (string, number, boolean, date range) " +
          "and a global search bar. Filter UI can be `floating` (inline), `panel` (collapsible sidebar), or `both`.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BetterTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FloatingFilters: Story = {
  name: "Floating Filters (default)",
  args: {
    data: products,
    columns: productColumns,
    filterMode: "floating",
    searchable: true,
    pagination: false,
  },
};

export const FilterPanel: Story = {
  name: "Filter Panel",
  args: {
    data: products,
    columns: productColumns,
    filterMode: "panel",
    searchable: true,
    pagination: false,
  },
};

export const BothModes: Story = {
  name: "Both (floating + panel)",
  args: {
    data: products,
    columns: productColumns,
    filterMode: "both",
    searchable: true,
    pagination: false,
  },
};

export const SearchOnly: Story = {
  name: "Search Only (no column filters)",
  args: {
    data: products,
    columns: productColumns.map((c) => ({ ...c, filterable: false })) as typeof productColumns,
    searchable: true,
    searchColumns: ["name", "details.brand", "category"],
    pagination: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Use `searchColumns` to restrict which fields are searched. Here we search name, brand, and category.",
      },
    },
  },
};
