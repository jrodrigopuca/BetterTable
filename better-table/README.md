# better-table

A modern, flexible, and fully typed data table component for React.

## ✨ Features

- 🔍 **Search & Filter** — Global search with debounce + Filter Panel with per-column controls
- 📊 **Sorting** — Multi-type sorting (string, number, date, boolean)
- ✅ **Selection** — Single or multiple row selection with global actions
- 📱 **Responsive** — Card layout for mobile, collapsible toolbar
- 🎬 **Row Actions** — Callbacks, modals, links + overflow menu
- 📄 **Pagination** — Configurable page sizes, quick jumper
- 🌐 **i18n** — Preset locales (EN/ES/PT) + custom overrides
- 🎨 **Customizable** — CSS variables, custom renderers, class overrides
- 💪 **TypeScript** — Full type safety with generics

## 📚 Documentation

| Document                                         | Description                                  |
| ------------------------------------------------ | -------------------------------------------- |
| [Architecture](./docs/architecture.md)           | Design patterns and technical decisions      |
| [Components](./docs/components.md)               | Detailed API reference for all components    |
| [Interaction Flows](./docs/interaction-flows.md) | Sequence diagrams and component interactions |
| [Known Issues](./docs/known-issues.md)           | Known bugs, limitations and workarounds      |
| [Development](./docs/development.md)             | Contributing guide and local setup           |
| [Roadmap](./docs/ROADMAP.md)                     | Future improvements and features             |

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
		{ id: "name", accessor: "name", header: "Name" },
		{ id: "email", accessor: "email", header: "Email" },
		{ id: "active", accessor: "active", header: "Status", type: "boolean" },
	];

	return <BetterTable data={data} columns={columns} />;
};
```

### With Search, Pagination & Actions

```tsx
<BetterTable
	data={users}
	columns={columns}
	rowKey="id"
	searchable
	searchDebounceMs={300}
	selectable
	pagination={{ pageSize: 10, showSizeChanger: true }}
	rowActions={[
		{
			id: "edit",
			label: "Edit",
			icon: "✏️",
			mode: "callback",
			onClick: (row) => handleEdit(row),
		},
		{
			id: "delete",
			label: "Delete",
			mode: "callback",
			variant: "danger",
			onClick: (row) => handleDelete(row),
		},
	]}
	globalActions={[
		{
			id: "export",
			label: "Export",
			onClick: (selected, all) => exportData(all),
		},
	]}
	maxVisibleActions={3}
	onSelectionChange={(selected) => console.log("Selected:", selected)}
/>
```

### Custom Cell Rendering

```tsx
const columns = [
	{ id: "name", accessor: "name", header: "Name" },
	{
		id: "status",
		accessor: "active",
		header: "Status",
		cell: (value) => (
			<span className={value ? "badge-success" : "badge-danger"}>
				{value ? "✅ Active" : "❌ Inactive"}
			</span>
		),
	},
	{
		id: "profile",
		accessor: "user.profile.avatar", // Dot notation for nested data
		header: "Avatar",
		cell: (value) => <img src={value} alt="avatar" />,
	},
];
```

### Internationalization (i18n)

BetterTable defaults to English. Choose a preset locale or provide custom overrides:

```tsx
// Spanish preset
<BetterTable data={data} columns={columns} locale="es" />

// Portuguese preset
<BetterTable data={data} columns={columns} locale="pt" />

// Custom overrides (merged over English defaults)
<BetterTable
	data={data}
	columns={columns}
	locale={{ noData: "Nothing to show", search: "Find" }}
/>
```

Available presets: `en` (default), `es`, `pt`. You can also import them directly:

```tsx
import { locales, defaultLocale } from "better-table";
// locales.en, locales.es, locales.pt
```

````

## 🎨 Customization

### CSS Variables

```css
:root {
	--bt-primary-color: #3b82f6;
	--bt-border-color: #e5e7eb;
	--bt-hover-bg: #f3f4f6;
	--bt-selected-bg: #dbeafe;
	--bt-font-size-medium: 14px;
}
````

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

| Prop                | Type                        | Default | Description                        |
| ------------------- | --------------------------- | ------- | ---------------------------------- |
| `data`              | `T[]`                       | -       | Array of data to display           |
| `columns`           | `Column<T>[]`               | -       | Column configuration               |
| `rowKey`            | `keyof T \| Function`       | `'id'`  | Unique key for rows                |
| `searchable`        | `boolean`                   | `false` | Enable search toolbar              |
| `searchDebounceMs`  | `number`                    | `300`   | Search debounce delay (ms)         |
| `searchColumns`     | `string[]`                  | all     | Columns to search (by accessor)    |
| `selectable`        | `boolean`                   | auto    | Enable row selection               |
| `pagination`        | `PaginationConfig \| false` | `false` | Pagination settings                |
| `rowActions`        | `RowAction<T>[]`            | `[]`    | Per-row actions                    |
| `globalActions`     | `GlobalAction<T>[]`         | `[]`    | Global toolbar actions             |
| `maxVisibleActions` | `number`                    | `3`     | Inline actions before overflow (⋯) |
| `locale`            | `LocaleKey \| TableLocale`  | `'en'`  | Locale preset or custom strings    |
| `loading`           | `boolean`                   | `false` | Loading state                      |

## 📄 License

MIT
