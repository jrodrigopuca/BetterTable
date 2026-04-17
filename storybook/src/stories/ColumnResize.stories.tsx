import type { Meta, StoryObj } from "@storybook/react";
import { BetterTable } from "better-table";
import { products, productColumns } from "../data";

const meta = {
  title: "BetterTable/Column Resize",
  component: BetterTable,
  parameters: {
    docs: {
      description: {
        component:
          "Enable `resizable` to allow users to drag column borders to resize. " +
          "Supports per-column `minWidth`, `maxWidth`, and `resizable` overrides. " +
          "Uses `table-layout: fixed` with `overflow: hidden` and text ellipsis for clean truncation.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BetterTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Resizable: Story = {
  name: "Resizable Columns",
  args: {
    data: products,
    columns: productColumns,
    resizable: true,
    bordered: true,
    pagination: false,
  },
};

export const WithConstraints: Story = {
  name: "Min/Max Width Constraints",
  args: {
    data: products,
    columns: productColumns.map((col) =>
      col.id === "name" ? { ...col, minWidth: 200, maxWidth: 400 } : col
    ) as typeof productColumns,
    resizable: true,
    bordered: true,
    minColumnWidth: 80,
    pagination: false,
  },
  parameters: {
    docs: {
      description: {
        story: "The 'Product' column has `minWidth: 200` and `maxWidth: 400`. Global minimum is 80px.",
      },
    },
  },
};
