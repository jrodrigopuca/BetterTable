import type { Meta, StoryObj } from "@storybook/react";
import { BetterTable } from "better-table";
import { generateEmployees, employeeColumns } from "../data";

const employees2k = generateEmployees(2000);

const meta = {
  title: "BetterTable/Virtualization",
  component: BetterTable,
  parameters: {
    docs: {
      description: {
        component:
          "When pagination is disabled and the dataset exceeds 500 rows, " +
          "virtualization auto-enables — only visible rows are rendered in the DOM. " +
          "Force it with `virtualize={true}` or disable with `virtualize={false}`.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BetterTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AutoVirtualized: Story = {
  name: "Auto-Virtualized (2,000 rows)",
  args: {
    data: employees2k,
    columns: employeeColumns,
    pagination: false,
    searchable: true,
    filterMode: "floating",
    striped: true,
    bordered: true,
    resizable: true,
    ariaLabel: "Virtualized employee table",
  },
};
