# better-table

[![npm version](https://img.shields.io/npm/v/better-table.svg)](https://www.npmjs.com/package/better-table)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B-61dafb.svg)](https://reactjs.org/)

A modern, flexible, and fully typed data table component for React.

## ✨ Features

- 🎯 **TypeScript First** - Full generic typing for data and columns
- 🔍 **Smart Selection** - Auto-inferred when needed based on actions
- 🔎 **Multiple Filtering** - Per-column and global search
- ↕️ **Sorting** - Ascending, descending, or unsorted
- 📄 **Pagination** - Client-side or server-side
- ⚡ **Row Actions** - Callbacks, modals, or links
- 🌐 **Global Actions** - With or without selection requirement
- 📍 **Dot Notation** - Access nested data (`user.profile.name`)
- 🎨 **Custom Cells** - Full custom rendering support
- 🎭 **Theming** - CSS Variables for easy customization
- ♿ **Accessibility** - ARIA labels and keyboard navigation
- 📦 **Lightweight** - ~8KB gzipped (JS) + ~3KB (CSS)

## 📦 Installation

```bash
npm install better-table
```

```bash
yarn add better-table
```

```bash
pnpm add better-table
```

## 🚀 Quick Start

```tsx
import { BetterTable } from "better-table";
import "better-table/styles.css";
import type { Column } from "better-table";

interface User {
	[key: string]: unknown;
	id: number;
	name: string;
	email: string;
}

const columns: Column<User>[] = [
	{ id: "name", accessor: "name", header: "Name" },
	{ id: "email", accessor: "email", header: "Email" },
];

const data: User[] = [
	{ id: 1, name: "John", email: "john@example.com" },
	{ id: 2, name: "Jane", email: "jane@example.com" },
];

function App() {
	return <BetterTable<User> data={data} columns={columns} rowKey="id" />;
}
```

## 📖 Examples

### With Pagination

```tsx
<BetterTable<User>
	data={users}
	columns={columns}
	rowKey="id"
	pagination={{
		pageSize: 10,
		showSizeChanger: true,
		pageSizeOptions: [10, 20, 50, 100],
	}}
/>
```

### With Global Search

```tsx
<BetterTable<User>
	data={users}
	columns={columns}
	rowKey="id"
	searchable
	searchColumns={["name", "email"]}
/>
```

### With Sorting

```tsx
const columns: Column<User>[] = [
	{ id: "name", accessor: "name", header: "Name", sortable: true },
	{ id: "age", accessor: "age", header: "Age", type: "number", sortable: true },
];

<BetterTable<User> data={users} columns={columns} rowKey="id" />;
```

### With Selection and Actions

```tsx
const globalActions: GlobalAction<User>[] = [
	{
		id: "export",
		label: "Export All",
		icon: "📥",
		onClick: (selected, allData) => exportToCSV(allData),
	},
	{
		id: "delete",
		label: "Delete Selected",
		icon: "🗑️",
		variant: "danger",
		requiresSelection: true,
		onClick: (selected) => deleteUsers(selected),
	},
];

<BetterTable<User>
	data={users}
	columns={columns}
	rowKey="id"
	globalActions={globalActions}
	selectionMode="multiple"
/>;
```

### With Row Actions

```tsx
const rowActions: RowAction<User>[] = [
	{
		id: "view",
		label: "View",
		icon: "👁️",
		mode: "modal",
		modalContent: ({ data, onClose }) => (
			<div>
				<h3>{data.name}</h3>
				<button onClick={onClose}>Close</button>
			</div>
		),
	},
	{
		id: "edit",
		label: "Edit",
		icon: "✏️",
		mode: "callback",
		onClick: (user) => openEditModal(user),
	},
	{
		id: "profile",
		label: "Profile",
		mode: "link",
		href: (user) => `/users/${user.id}`,
	},
];

<BetterTable<User>
	data={users}
	columns={columns}
	rowKey="id"
	rowActions={rowActions}
/>;
```

### With Custom Cell Rendering

```tsx
const columns: Column<User>[] = [
	{ id: "name", accessor: "name", header: "Name" },
	{
		id: "avatar",
		accessor: "imageUrl",
		header: "Avatar",
		cell: (value, row) => (
			<img src={String(value)} alt={row.name} width={32} height={32} />
		),
	},
	{
		id: "status",
		accessor: "isActive",
		header: "Status",
		cell: (value) => (
			<span className={value ? "badge-success" : "badge-error"}>
				{value ? "Active" : "Inactive"}
			</span>
		),
	},
];
```

### With Nested Data (Dot Notation)

```tsx
interface User {
	[key: string]: unknown;
	id: number;
	name: string;
	department: {
		name: string;
		manager: { name: string };
	};
}

const columns: Column<User>[] = [
	{ id: "name", accessor: "name", header: "Name" },
	{ id: "dept", accessor: "department.name", header: "Department" },
	{ id: "manager", accessor: "department.manager.name", header: "Manager" },
];
```

### Server-Side Pagination

```tsx
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const { data, total, loading } = useServerData(page, pageSize);

<BetterTable<User>
	data={data}
	columns={columns}
	rowKey="id"
	loading={loading}
	pagination={{
		page,
		pageSize,
		totalItems: total,
		showSizeChanger: true,
	}}
	onPageChange={(newPage, newPageSize) => {
		setPage(newPage);
		setPageSize(newPageSize);
	}}
/>;
```

## 🎨 Theming

BetterTable uses CSS Variables for easy customization:

```css
:root {
	/* Colors */
	--bt-primary-color: #3b82f6;
	--bt-primary-hover: #2563eb;
	--bt-danger-color: #ef4444;
	--bt-success-color: #22c55e;

	/* Background */
	--bt-bg-color: #ffffff;
	--bt-header-bg: #f8fafc;
	--bt-row-hover: #f1f5f9;
	--bt-row-selected: #eff6ff;

	/* Text */
	--bt-text-color: #1e293b;
	--bt-text-secondary: #64748b;

	/* Border */
	--bt-border-color: #e2e8f0;
	--bt-border-radius: 8px;

	/* Spacing */
	--bt-cell-padding: 12px 16px;
	--bt-spacing-sm: 8px;
	--bt-spacing-md: 16px;
}
```

### Dark Mode Example

```css
[data-theme="dark"] {
	--bt-bg-color: #1e1e1e;
	--bt-header-bg: #2d2d2d;
	--bt-row-hover: #333333;
	--bt-text-color: #e0e0e0;
	--bt-border-color: #404040;
}
```

## 📚 API Reference

### BetterTable Props

| Prop                | Type                        | Default     | Description                    |
| ------------------- | --------------------------- | ----------- | ------------------------------ |
| `data`              | `T[]`                       | required    | Array of data to display       |
| `columns`           | `Column<T>[]`               | required    | Column definitions             |
| `rowKey`            | `keyof T`                   | required    | Unique identifier for each row |
| `pagination`        | `PaginationConfig`          | -           | Pagination settings            |
| `searchable`        | `boolean`                   | `false`     | Enable global search           |
| `searchColumns`     | `string[]`                  | all columns | Columns to search in           |
| `loading`           | `boolean`                   | `false`     | Show loading state             |
| `loadingComponent`  | `ReactNode`                 | -           | Custom loading component       |
| `emptyComponent`    | `ReactNode`                 | -           | Custom empty state             |
| `selectionMode`     | `'single' \| 'multiple'`    | -           | Selection mode                 |
| `rowActions`        | `RowAction<T>[]`            | -           | Actions for each row           |
| `globalActions`     | `GlobalAction<T>[]`         | -           | Global table actions           |
| `sort`              | `SortState`                 | -           | Controlled sort state          |
| `onSortChange`      | `(sort: SortState) => void` | -           | Sort change handler            |
| `onPageChange`      | `(page, size) => void`      | -           | Page change handler            |
| `onSelectionChange` | `(selected: T[]) => void`   | -           | Selection change handler       |
| `styles`            | `TableStyles`               | -           | Custom inline styles           |
| `className`         | `string`                    | -           | Additional CSS class           |

### Column Definition

| Prop         | Type                                          | Description                           |
| ------------ | --------------------------------------------- | ------------------------------------- |
| `id`         | `string`                                      | Unique column identifier              |
| `accessor`   | `string`                                      | Data accessor (supports dot notation) |
| `header`     | `string \| ReactNode`                         | Column header content                 |
| `type`       | `'string' \| 'number' \| 'boolean' \| 'date'` | Data type for filtering/sorting       |
| `sortable`   | `boolean`                                     | Enable sorting                        |
| `filterable` | `boolean`                                     | Enable column filter                  |
| `cell`       | `(value, row, index) => ReactNode`            | Custom cell renderer                  |
| `width`      | `string \| number`                            | Column width                          |
| `align`      | `'left' \| 'center' \| 'right'`               | Text alignment                        |

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/jrodrigopuca/BetterTable.git
cd BetterTable/better-table

# Install dependencies
npm install

# Run demo app
npm run dev

# Run tests
npm run test

# Build library
npm run build
```

## 📁 Project Structure

```
better-table/
├── src/
│   ├── components/
│   │   └── BetterTable/
│   │       ├── types/           # TypeScript definitions
│   │       ├── hooks/           # Custom React hooks
│   │       ├── context/         # React Context
│   │       ├── utils/           # Helper functions
│   │       ├── styles/          # CSS styles
│   │       └── components/      # Sub-components
│   ├── index.ts                 # Library entry point
│   └── styles.ts                # CSS entry point
├── demo/                        # Demo application
├── dist/                        # Built library
└── package.json
```

## 📄 License

Apache License 2.0 © [Juan Rodrigo Puca](https://github.com/jrodrigopuca)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔗 Links

- [GitHub Repository](https://github.com/jrodrigopuca/BetterTable)
- [NPM Package](https://www.npmjs.com/package/better-table)
- [Issue Tracker](https://github.com/jrodrigopuca/BetterTable/issues)
