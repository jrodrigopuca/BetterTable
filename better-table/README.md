# better-table

A modern, flexible, and fully typed data table component for React.

## ✨ Features

- 🔍 **Search & Filter** — Global search with debounce + floating filters / filter panel / both
- 📊 **Sorting** — Single & multi-sort with 3-state cycle (asc → desc → unsorted)
- 👁️ **Column Visibility** — Interactive toggle to show/hide columns at runtime
- 🔄 **Column Resizing** — Drag-to-resize with min/max width constraints
- 📂 **Expandable Rows** — Detail rows with controlled/uncontrolled + accordion mode
- ⚡ **Virtualization** — Built-in row virtualization for large datasets (zero deps)
- 🌐 **Server-Side Mode** — Delegate sorting, filtering, pagination to your API
- 📌 **Sticky Headers** — Headers stay visible when scrolling
- ✅ **Selection** — Single or multiple row selection with global actions
- 🎬 **Row Actions** — Callbacks, modals, links + overflow menu
- 📱 **Responsive** — Card layout for mobile, collapsible toolbar
- 📄 **Pagination** — Configurable page sizes, quick jumper
- 🌍 **i18n** — Preset locales (EN/ES/PT) + custom overrides
- 🎨 **Customizable** — CSS variables, custom renderers, class overrides
- ♿ **Accessible** — ARIA labels, `aria-live` announcements, focus trap in modals
- 💪 **TypeScript** — Full type safety with generics

## 📚 Documentation

| Document | Description |
| --- | --- |
| [Architecture](./docs/architecture.md) | Design patterns and technical decisions |
| [Components](./docs/components.md) | Detailed API reference for all components |
| [Interaction Flows](./docs/interaction-flows.md) | Sequence diagrams and component interactions |
| [Known Issues](./docs/known-issues.md) | Known bugs, limitations and workarounds |
| [Development](./docs/development.md) | Contributing guide and local setup |
| [Roadmap](./docs/ROADMAP.md) | Future improvements and features |
| [Changelog](./CHANGELOG.md) | Version history |

## 🚀 Quick Start

```bash
npm install better-table
```

### Basic Usage

```tsx
import { BetterTable } from "better-table";
import "better-table/styles.css";

const MyTable = () => {
	const data = [
		{ id: 1, name: "Juan", email: "juan@example.com", active: true },
		{ id: 2, name: "María", email: "maria@example.com", active: false },
	];

	const columns = [
		{ id: "name", accessor: "name", header: "Name", sortable: true },
		{ id: "email", accessor: "email", header: "Email" },
		{ id: "active", accessor: "active", header: "Status", type: "boolean" },
	];

	return <BetterTable data={data} columns={columns} rowKey="id" />;
};
```

### Column Resizing

```tsx
<BetterTable
	data={users}
	columns={[
		{ id: "name", accessor: "name", header: "Name", resizable: true, minWidth: 100 },
		{ id: "email", accessor: "email", header: "Email", resizable: true },
	]}
	rowKey="id"
	resizable
/>
```

### Expandable Rows

```tsx
<BetterTable
	data={users}
	columns={columns}
	rowKey="id"
	expandable={{
		render: (row) => <div>Details for {row.name}</div>,
		accordion: true,
	}}
/>
```

### Server-Side Data

```tsx
<BetterTable
	data={serverData}
	columns={columns}
	rowKey="id"
	manualPagination
	manualSorting
	pagination={{ pageSize: 10, totalItems: total }}
	onPageChange={(page, size) => fetchData({ page, size })}
	onSortChange={(sort) => fetchData({ sort })}
/>
```

### Virtualization

```tsx
// Auto-enables when pagination={false} and dataset > 500 rows
<BetterTable
	data={largeDataset}
	columns={columns}
	rowKey="id"
	pagination={false}
	stickyHeader
/>
```

### Multi-Sort & Column Visibility

```tsx
<BetterTable
	data={users}
	columns={columns}
	rowKey="id"
	multiSort
	columnVisibility
/>
```

### Filter Modes

```tsx
<BetterTable data={data} columns={columns} filterMode="floating" /> {/* default */}
<BetterTable data={data} columns={columns} filterMode="panel" />
<BetterTable data={data} columns={columns} filterMode="both" />
```

### Internationalization (i18n)

```tsx
<BetterTable data={data} columns={columns} locale="es" />
<BetterTable data={data} columns={columns} locale={{ noData: "Nothing to show" }} />
```

## 🎨 Customization

### CSS Variables

```css
:root {
	--bt-primary-color: #3b82f6;
	--bt-border-color: #e5e7eb;
	--bt-hover-bg: #f3f4f6;
	--bt-selected-bg: #dbeafe;
}
```

### Custom Class Names

```tsx
<BetterTable
	data={data}
	columns={columns}
	classNames={{
		container: "my-table-container",
		table: "my-table",
		row: "my-row",
		cell: "my-cell",
	}}
/>
```

## 📦 API Reference

See [Components Documentation](./docs/components.md) for complete API reference.

### Main Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `T[]` | - | Array of data to display |
| `columns` | `Column<T>[]` | - | Column configuration |
| `rowKey` | `keyof T \| Function` | `'id'` | Unique key for rows |
| `searchable` | `boolean` | `false` | Enable search toolbar |
| `searchDebounceMs` | `number` | `300` | Search debounce delay (ms) |
| `filterMode` | `'floating' \| 'panel' \| 'both'` | `'floating'` | Filter display mode |
| `multiSort` | `boolean` | `false` | Enable multi-column sorting |
| `columnVisibility` | `boolean` | `false` | Show column visibility toggle |
| `resizable` | `boolean` | `false` | Enable column resizing |
| `expandable` | `ExpandableConfig<T>` | - | Expandable row config |
| `virtualize` | `boolean` | auto | Enable row virtualization |
| `stickyHeader` | `boolean` | `false` | Sticky table header |
| `manualSorting` | `boolean` | `false` | Skip client-side sorting |
| `manualFiltering` | `boolean` | `false` | Skip client-side filtering |
| `manualPagination` | `boolean` | `false` | Skip client-side pagination |
| `pagination` | `PaginationConfig \| false` | `{ pageSize: 10 }` | Pagination settings |
| `selectionMode` | `'single' \| 'multiple'` | - | Selection mode |
| `rowActions` | `RowAction<T>[]` | `[]` | Per-row actions |
| `globalActions` | `GlobalAction<T>[]` | `[]` | Global toolbar actions |
| `locale` | `LocaleKey \| TableLocale` | `'en'` | Locale preset or custom strings |
| `loading` | `boolean` | `false` | Loading state |

## 📄 License

Apache-2.0
