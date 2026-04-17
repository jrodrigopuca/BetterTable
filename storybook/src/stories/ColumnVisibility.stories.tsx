import type { Meta, StoryObj } from "@storybook/react";
import { BetterTable } from "better-table";
import { products, productColumns, productRowActions, productGlobalActions } from "../data";

const meta = {
  title: "BetterTable/Column Visibility",
  component: BetterTable,
  parameters: {
    docs: {
      description: {
        component:
          "Enable `columnVisibility` to show a dropdown in the toolbar where users can toggle column visibility.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BetterTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColumnVisibility: Story = {
  name: "Column Visibility Toggle",
  args: {
    data: products,
    columns: productColumns,
    columnVisibility: true,
    searchable: true,
    pagination: false,
  },
};
