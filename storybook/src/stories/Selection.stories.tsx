import type { Meta, StoryObj } from "@storybook/react";
import { BetterTable } from "better-table";
import { products, productColumns, productRowActions, productGlobalActions } from "../data";

const meta = {
  title: "BetterTable/Selection & Actions",
  component: BetterTable,
  parameters: {
    docs: {
      description: {
        component:
          "Row selection with checkbox UI. Supports `single` and `multiple` modes. " +
          "Row actions appear per-row, global actions in the toolbar. " +
          "Selection is auto-inferred when `globalActions` have `requiresSelection: true`.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BetterTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultipleSelection: Story = {
  name: "Multiple Selection",
  args: {
    data: products,
    columns: productColumns,
    selectable: true,
    selectionMode: "multiple",
    pagination: false,
  },
};

export const SingleSelection: Story = {
  name: "Single Selection",
  args: {
    data: products,
    columns: productColumns,
    selectable: true,
    selectionMode: "single",
    pagination: false,
  },
};

export const RowActions: Story = {
  name: "Row Actions",
  args: {
    data: products,
    columns: productColumns,
    rowActions: productRowActions,
    pagination: { pageSize: 5 },
  },
};

export const GlobalActions: Story = {
  name: "Global Actions + Selection",
  args: {
    data: products,
    columns: productColumns,
    rowActions: productRowActions,
    globalActions: productGlobalActions,
    selectionMode: "multiple",
    pagination: { pageSize: 5 },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Selection is auto-enabled because `globalActions` includes an action with `requiresSelection: true`. " +
          "No need to set `selectable` explicitly.",
      },
    },
  },
};
