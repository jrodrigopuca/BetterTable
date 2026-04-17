import type { Meta, StoryObj } from "@storybook/react";
import { BetterTable } from "better-table";
import { products, productColumns } from "../data";

const meta = {
  title: "BetterTable/Sticky Header",
  component: BetterTable,
  parameters: {
    docs: {
      description: {
        component:
          "Enable `stickyHeader` with a `maxHeight` to keep the header visible while scrolling the table body.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BetterTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StickyHeader: Story = {
  name: "Sticky Header",
  args: {
    data: products,
    columns: productColumns,
    stickyHeader: true,
    maxHeight: 300,
    pagination: false,
    striped: true,
  },
};
