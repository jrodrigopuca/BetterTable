# better-table

[![npm version](https://img.shields.io/npm/v/better-table.svg)](https://www.npmjs.com/package/better-table)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B-61dafb.svg)](https://reactjs.org/)
[![Tests](https://img.shields.io/badge/Tests-150%20passing-brightgreen.svg)](#)

A modern, flexible, and fully typed data table component for React. Zero dependencies beyond React (only `clsx` for class merging).

## ✨ Features

- 🎯 **TypeScript First** — Full generic typing for data and columns
- 📱 **Responsive** — Table on desktop, cards on mobile
- 🔍 **Search & Filter** — Global search with debounce + floating filters / filter panel / both
- ↕️ **Sorting** — Single & multi-sort with 3-state cycle
- 👁️ **Column Visibility** — Show/hide columns at runtime
- 🔄 **Column Resizing** — Drag-to-resize with min/max constraints
- 📂 **Expandable Rows** — Detail rows with controlled/uncontrolled + accordion mode
- ⚡ **Virtualization** — Built-in row virtualization for large datasets (zero deps)
- 🌐 **Server-Side Mode** — Delegate sorting, filtering, pagination to your API
- 📌 **Sticky Headers** — Headers stay visible on scroll
- 📄 **Pagination** — Client-side or server-side with page size changer
- ✅ **Selection** — Single or multiple with global/row actions
- 🎬 **Row Actions** — Callbacks, modals, links + overflow menu
- 🌍 **i18n** — Preset locales (EN/ES/PT) + custom overrides
- ♿ **Accessible** — ARIA labels, `aria-live` announcements, focus trap in modals
- 🎨 **Themeable** — CSS variables, custom renderers, class overrides
- 📍 **Dot Notation** — Access nested data (`user.profile.name`)
- 📦 **Lightweight** — ~8KB gzipped (JS) + ~3KB (CSS)

## 📦 Installation

```bash
npm install better-table
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
	{ id: "name", accessor: "name", header: "Name", sortable: true },
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

### Sorting & Column Visibility

```tsx
<BetterTable<User>
	data={users}
	columns={columns}
	rowKey="id"
	multiSort
	columnVisibility
/>
```

### Search, Pagination & Actions

```tsx
<BetterTable<User>
	data={users}
	columns={columns}
	rowKey="id"
	searchable
	searchDebounceMs={300}
	pagination={{ pageSize: 10, showSizeChanger: true }}
	rowActions={[
		{ id: "edit", label: "Edit", icon: "✏️", mode: "callback", onClick: (row) => handleEdit(row) },
		{ id: "delete", label: "Delete", mode: "callback", variant: "danger", onClick: (row) => handleDelete(row) },
	]}
	globalActions={[
		{ id: "export", label: "Export", onClick: (selected, all) => exportData(all) },
	]}
	selectionMode="multiple"
/>
```

### Column Resizing

```tsx
const columns: Column<User>[] = [
	{ id: "name", accessor: "name", header: "Name", resizable: true, minWidth: 100 },
	{ id: "email", accessor: "email", header: "Email", resizable: true, minWidth: 150, maxWidth: 400 },
];

<BetterTable<User> data={users} columns={columns} rowKey="id" resizable />
```

### Expandable Rows

```tsx
<BetterTable<User>
	data={users}
	columns={columns}
	rowKey="id"
	expandable={{
		render: (row) => (
			<div>
				<h4>Details for {row.name}</h4>
				<p>Email: {row.email}</p>
			</div>
		),
		accordion: true, // Only one row expanded at a time
	}}
/>
```

### Server-Side Data

```tsx
const [page, setPage] = useState(1);
const [sort, setSort] = useState<SortState>({ columnId: null, direction: "asc" });
const { data, total, loading } = useServerData({ page, sort });

<BetterTable<User>
	data={data}
	columns={columns}
	rowKey="id"
	loading={loading}
	manualPagination
	manualSorting
	pagination={{ pageSize: 10, totalItems: total }}
	onPageChange={(newPage) => setPage(newPage)}
	onSortChange={(newSort) => setSort(newSort)}
/>
```

### Virtualization (Large Datasets)

```tsx
// Auto-enables when pagination={false} and dataset > 500 rows
<BetterTable<User>
	data={largeDataset} // 10K+ rows
	columns={columns}
	rowKey="id"
	pagination={false}
	stickyHeader
/>

// Or explicitly control it
<BetterTable<User>
	data={largeDataset}
	columns={columns}
	rowKey="id"
	virtualize
	rowHeight={48}
	virtualBuffer={10}
/>
```

### Filter Modes

```tsx
// Floating filters inline in header (default)
<BetterTable data={data} columns={columns} />

// Collapsible filter panel
<BetterTable data={data} columns={columns} filterMode="panel" />

// Both: floating filters + panel toggle
<BetterTable data={data} columns={columns} filterMode="both" />
```

### Internationalization

```tsx
// Spanish preset
<BetterTable data={data} columns={columns} locale="es" />

// Custom overrides
<BetterTable data={data} columns={columns} locale={{ noData: "Nothing here", search: "Find..." }} />
```

## 🎨 Theming

BetterTable uses CSS Variables for customization:

```css
:root {
	--bt-primary-color: #3b82f6;
	--bt-primary-hover: #2563eb;
	--bt-danger-color: #ef4444;
	--bt-bg-color: #ffffff;
	--bt-header-bg: #f8fafc;
	--bt-row-hover: #f1f5f9;
	--bt-row-selected: #eff6ff;
	--bt-text-color: #1e293b;
	--bt-border-color: #e2e8f0;
	--bt-border-radius: 8px;
	--bt-cell-padding: 12px 16px;
}
```

### Dark Mode

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

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `T[]` | required | Array of data to display |
| `columns` | `Column<T>[]` | required | Column definitions |
| `rowKey` | `keyof T \| (row: T, index: number) => string` | `'id'` | Unique identifier for each row |
| **Search & Filter** | | | |
| `searchable` | `boolean` | `false` | Enable global search |
| `searchColumns` | `string[]` | all columns | Columns to search in |
| `searchDebounceMs` | `number` | `300` | Search debounce delay |
| `filterMode` | `'floating' \| 'panel' \| 'both'` | `'floating'` | Filter display mode |
| **Sorting** | | | |
| `multiSort` | `boolean` | `false` | Enable multi-column sorting |
| `sort` | `SortState` | - | Controlled sort state |
| `onSortChange` | `(sort: SortState) => void` | - | Sort change handler |
| **Pagination** | | | |
| `pagination` | `PaginationConfig \| false` | `{ pageSize: 10 }` | Pagination settings |
| `onPageChange` | `(page, size) => void` | - | Page change handler |
| **Selection** | | | |
| `selectionMode` | `'single' \| 'multiple'` | - | Selection mode |
| `onSelectionChange` | `(selected: T[]) => void` | - | Selection change handler |
| **Actions** | | | |
| `rowActions` | `RowAction<T>[]` | - | Per-row actions |
| `globalActions` | `GlobalAction<T>[]` | - | Global toolbar actions |
| `maxVisibleActions` | `number` | `3` | Actions before overflow menu |
| **Column Features** | | | |
| `resizable` | `boolean` | `false` | Enable column resizing globally |
| `columnVisibility` | `boolean` | `false` | Show column visibility toggle |
| **Expandable Rows** | | | |
| `expandable` | `ExpandableConfig<T>` | - | Expandable row configuration |
| **Virtualization** | | | |
| `virtualize` | `boolean` | auto | Enable row virtualization |
| `rowHeight` | `number` | `48` | Fixed row height (px) |
| `virtualBuffer` | `number` | `5` | Buffer rows above/below viewport |
| **Server-Side Mode** | | | |
| `manualSorting` | `boolean` | `false` | Skip client-side sorting |
| `manualFiltering` | `boolean` | `false` | Skip client-side filtering |
| `manualPagination` | `boolean` | `false` | Skip client-side pagination |
| **Appearance** | | | |
| `stickyHeader` | `boolean` | `false` | Sticky table header |
| `striped` | `boolean` | `false` | Striped rows |
| `bordered` | `boolean` | `false` | Bordered cells |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Table density |
| `locale` | `'en' \| 'es' \| 'pt' \| TableLocale` | `'en'` | Locale preset or custom strings |
| `loading` | `boolean` | `false` | Show loading state |
| `className` | `string` | - | Additional CSS class |
| `classNames` | `TableClassNames` | - | Per-element class overrides |

### Column Definition

| Prop | Type | Description |
| --- | --- | --- |
| `id` | `string` | Unique column identifier |
| `accessor` | `string` | Data accessor (supports dot notation) |
| `header` | `string \| ReactNode` | Column header content |
| `type` | `'string' \| 'number' \| 'boolean' \| 'date'` | Data type for filtering/sorting |
| `sortable` | `boolean` | Enable sorting |
| `filterable` | `boolean` | Enable column filter |
| `resizable` | `boolean` | Enable column resizing |
| `minWidth` | `number` | Minimum width when resizing (px) |
| `maxWidth` | `number` | Maximum width when resizing (px) |
| `cell` | `(value, row, index) => ReactNode` | Custom cell renderer |
| `width` | `string \| number` | Column width |
| `align` | `'left' \| 'center' \| 'right'` | Text alignment |

## 🛠️ Development

```bash
git clone https://github.com/jrodrigopuca/BetterTable.git
cd BetterTable/better-table

npm install
npm run dev          # Run demo app
npm run test         # Run tests (watch mode)
npm run test:run     # Run tests (single run)
npm run lint         # Type check
npm run build        # Build library
```

### Storybook

```bash
cd storybook
npm install
npm run storybook    # Dev server on port 6006
```

## 📁 Project Structure

```
BetterTable/
├── better-table/              # Library source
│   ├── src/
│   │   ├── components/
│   │   │   └── BetterTable/
│   │   │       ├── components/    # Table sub-components
│   │   │       ├── context/       # 6 focused React contexts
│   │   │       ├── hooks/         # Custom hooks
│   │   │       ├── styles/        # CSS styles
│   │   │       ├── utils/         # Helper functions
│   │   │       └── types.ts       # TypeScript definitions
│   │   └── index.ts               # Library entry point ("use client")
│   ├── demo/                      # Demo application
│   └── dist/                      # Built library
├── storybook/                     # Storybook (separate project)
├── .github/workflows/             # CI/CD (tests + Storybook deploy)
└── README.md
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
