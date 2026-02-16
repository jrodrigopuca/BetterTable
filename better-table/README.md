# better-table

A modern, flexible, and fully typed data table component for React.

## ✨ Features

- 🔍 **Search & Filter** - Global search and per-column filtering
- 📊 **Sorting** - Multi-type sorting (string, number, date, boolean)
- ✅ **Selection** - Single or multiple row selection
- 📱 **Responsive** - Card layout for mobile devices
- 🎬 **Row Actions** - Callbacks, modals, and links
- 📄 **Pagination** - Configurable page sizes
- 🎨 **Customizable** - CSS variables and custom renderers
- 💪 **TypeScript** - Full type safety with generics

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
		{ id: "name", accessor: "name", header: "Nombre" },
		{ id: "email", accessor: "email", header: "Email" },
		{ id: "active", accessor: "active", header: "Estado", type: "boolean" },
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
	selectable
	pagination={{ pageSize: 10, showSizeChanger: true }}
	rowActions={[
		{
			id: "edit",
			label: "Editar",
			icon: "✏️",
			mode: "callback",
			onClick: (row) => handleEdit(row),
		},
		{
			id: "delete",
			label: "Eliminar",
			mode: "callback",
			variant: "danger",
			onClick: (row) => handleDelete(row),
		},
	]}
	globalActions={[
		{
			id: "export",
			label: "Exportar",
			onClick: (selected, all) => exportData(all),
		},
	]}
	onSelectionChange={(selected) => console.log("Selected:", selected)}
/>
```

### Custom Cell Rendering

```tsx
const columns = [
	{ id: "name", accessor: "name", header: "Nombre" },
	{
		id: "status",
		accessor: "active",
		header: "Estado",
		cell: (value) => (
			<span className={value ? "badge-success" : "badge-danger"}>
				{value ? "✅ Activo" : "❌ Inactivo"}
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

| Prop         | Type                        | Description              |
| ------------ | --------------------------- | ------------------------ |
| `data`       | `T[]`                       | Array of data to display |
| `columns`    | `Column<T>[]`               | Column configuration     |
| `rowKey`     | `keyof T \| Function`       | Unique key for rows      |
| `searchable` | `boolean`                   | Enable search toolbar    |
| `selectable` | `boolean`                   | Enable row selection     |
| `pagination` | `PaginationConfig \| false` | Pagination settings      |
| `rowActions` | `RowAction<T>[]`            | Per-row actions          |
| `loading`    | `boolean`                   | Loading state            |

## 📄 License

MIT
