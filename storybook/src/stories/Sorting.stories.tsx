import type { Meta, StoryObj } from "@storybook/react";
import { BetterTable } from "better-table";
import { products, productColumns } from "../data";

const meta = {
  title: "BetterTable/Sorting",
  component: BetterTable,
  parameters: {
    docs: {
      description: {
        component:
          "Columns with `sortable: true` get a clickable sort toggle. " +
          "Enable `multiSort` to sort by multiple columns simultaneously (click order = priority).",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BetterTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSort: Story = {
  name: "Single Column Sort",
  args: {
    data: products,
    columns: productColumns,
    pagination: false,
  },
};

export const MultiSort: Story = {
  name: "Multi-Column Sort",
  args: {
    data: products,
    columns: productColumns,
    multiSort: true,
    pagination: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Click multiple column headers to sort by priority. A badge shows the sort order.",
      },
    },
  },
};
