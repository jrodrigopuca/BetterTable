# BetterTable v2

Una tabla de datos moderna, flexible y completamente tipada para React.

## Características

- ✅ **TypeScript First**: Tipado genérico completo para datos y columnas
- ✅ **Selección Inteligente**: Se infiere automáticamente cuando es necesaria
- ✅ **Filtrado Múltiple**: Por columna y búsqueda global
- ✅ **Ordenamiento**: Ascendente, descendente o sin orden
- ✅ **Paginación**: Cliente o servidor
- ✅ **Acciones de Fila**: Callbacks, modales o links
- ✅ **Acciones Globales**: Con o sin requerimiento de selección
- ✅ **Dot Notation**: Acceso a datos anidados (`user.profile.name`)
- ✅ **Celdas Personalizadas**: Renderizado custom completo
- ✅ **Temas**: CSS Variables para personalización
- ✅ **Accesibilidad**: ARIA labels y navegación por teclado

## Instalación

```bash
npm install better-table
```

## Uso Básico

```tsx
import { BetterTable } from "better-table";
import type { Column } from "better-table";

interface User {
	[key: string]: unknown; // Requerido para satisfacer TableData
	id: number;
	name: string;
	email: string;
}

const columns: Column<User>[] = [
	{ id: "name", accessor: "name", header: "Nombre" },
	{ id: "email", accessor: "email", header: "Email" },
];

const data: User[] = [
	{ id: 1, name: "Juan", email: "juan@example.com" },
	{ id: 2, name: "María", email: "maria@example.com" },
];

function App() {
	return <BetterTable<User> data={data} columns={columns} rowKey="id" />;
}
```

## Casos de Uso

### 1. Tabla Simple con Pocos Elementos

Ideal para mostrar datos sin complejidad adicional.

```tsx
<BetterTable<User> data={users} columns={columns} rowKey="id" />
```

### 2. Tabla con Paginación

Para conjuntos de datos grandes.

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

### 3. Tabla con Búsqueda Global

Busca en múltiples columnas simultáneamente.

```tsx
<BetterTable<User>
	data={users}
	columns={columns}
	rowKey="id"
	searchable
	searchColumns={["name", "email"]} // Opcional: limitar búsqueda a ciertas columnas
/>
```

### 4. Tabla con Filtros por Columna

Filtrado individual en cada columna.

```tsx
const columns: Column<User>[] = [
	{ id: "name", accessor: "name", header: "Nombre", filterable: true },
	{
		id: "age",
		accessor: "age",
		header: "Edad",
		type: "number",
		filterable: true,
	},
	{
		id: "isActive",
		accessor: "isActive",
		header: "Activo",
		type: "boolean",
		filterable: true,
	},
];

<BetterTable<User> data={users} columns={columns} rowKey="id" />;
```

### 5. Tabla con Ordenamiento

Habilita ordenamiento en columnas específicas.

```tsx
const columns: Column<User>[] = [
	{ id: "name", accessor: "name", header: "Nombre", sortable: true },
	{
		id: "age",
		accessor: "age",
		header: "Edad",
		type: "number",
		sortable: true,
	},
	{
		id: "createdAt",
		accessor: "createdAt",
		header: "Fecha",
		type: "date",
		sortable: true,
	},
];

<BetterTable<User> data={users} columns={columns} rowKey="id" />;
```

### 6. Tabla con Selección Múltiple y Acciones

**Importante**: La selección se infiere automáticamente si:

- Hay alguna `globalAction` con `requiresSelection: true`
- Se proporciona `onSelectionChange`

```tsx
const globalActions: GlobalAction<User>[] = [
	{
		id: "export",
		label: "Exportar Todo",
		icon: "📥",
		onClick: (selected, allData) => {
			// `selected` son las filas seleccionadas
			// `allData` es toda la data
			exportToCSV(allData);
		},
	},
	{
		id: "deleteSelected",
		label: "Eliminar Seleccionados",
		icon: "🗑️",
		variant: "danger",
		requiresSelection: true, // Esto activa selección automáticamente
		onClick: (selected) => {
			deleteUsers(selected);
		},
	},
];

<BetterTable<User>
	data={users}
	columns={columns}
	rowKey="id"
	globalActions={globalActions}
	selectionMode="multiple" // 'single' o 'multiple'
	onSelectionChange={(selected) => console.log("Selected:", selected)}
/>;
```

### 7. Tabla con Acciones de Fila

Acciones individuales por cada fila.

```tsx
const rowActions: RowAction<User>[] = [
	{
		id: "view",
		label: "Ver",
		icon: "👁️",
		mode: "modal",
		modalContent: ({ data, onClose }) => (
			<div>
				<h3>{data.name}</h3>
				<p>{data.email}</p>
				<button onClick={onClose}>Cerrar</button>
			</div>
		),
	},
	{
		id: "edit",
		label: "Editar",
		icon: "✏️",
		mode: "callback",
		onClick: (user, index) => {
			openEditModal(user);
		},
	},
	{
		id: "delete",
		label: "Eliminar",
		icon: "🗑️",
		mode: "callback",
		variant: "danger",
		visible: (user) => user.role !== "admin", // Solo visible para no-admins
		onClick: (user) => {
			deleteUser(user.id);
		},
	},
	{
		id: "profile",
		label: "Ver Perfil",
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

### 8. Acceso a Datos Anidados

Usa dot notation para acceder a propiedades anidadas.

```tsx
interface User {
	[key: string]: unknown;
	id: number;
	name: string;
	department: {
		name: string;
		floor: number;
		manager: {
			name: string;
		};
	};
}

const columns: Column<User>[] = [
	{ id: "name", accessor: "name", header: "Nombre" },
	{ id: "dept", accessor: "department.name", header: "Departamento" },
	{ id: "floor", accessor: "department.floor", header: "Piso" },
	{ id: "manager", accessor: "department.manager.name", header: "Gerente" },
];
```

### 9. Celdas Personalizadas

Renderiza cualquier componente React en las celdas.

```tsx
const columns: Column<User>[] = [
	{ id: "name", accessor: "name", header: "Nombre" },
	{
		id: "avatar",
		accessor: "imageUrl",
		header: "Avatar",
		cell: (value, row) => (
			<img
				src={String(value)}
				alt={row.name}
				className="avatar"
				width={32}
				height={32}
			/>
		),
	},
	{
		id: "status",
		accessor: "isActive",
		header: "Estado",
		cell: (value) => (
			<span className={`badge ${value ? "badge-success" : "badge-error"}`}>
				{value ? "Activo" : "Inactivo"}
			</span>
		),
	},
	{
		id: "tags",
		accessor: "tags",
		header: "Etiquetas",
		cell: (value) => (
			<div className="tags">
				{(value as string[]).map((tag) => (
					<span key={tag} className="tag">
						{tag}
					</span>
				))}
			</div>
		),
	},
];
```

### 10. Estado de Carga

Muestra un indicador mientras se cargan los datos.

```tsx
const [loading, setLoading] = useState(true);
const [data, setData] = useState<User[]>([]);

useEffect(() => {
	fetchUsers().then((users) => {
		setData(users);
		setLoading(false);
	});
}, []);

<BetterTable<User>
	data={data}
	columns={columns}
	rowKey="id"
	loading={loading}
	loadingComponent={<MyCustomSpinner />} // Opcional
/>;
```

### 11. Tabla Vacía Personalizada

Personaliza el mensaje cuando no hay datos.

```tsx
<BetterTable<User>
	data={[]}
	columns={columns}
	rowKey="id"
	emptyComponent={
		<div className="empty-state">
			<img src="/empty.svg" alt="Sin datos" />
			<h3>No hay usuarios</h3>
			<p>Comienza agregando tu primer usuario.</p>
			<button onClick={handleAddUser}>Agregar Usuario</button>
		</div>
	}
/>
```

### 12. Paginación Controlada (Servidor)

Para paginación del lado del servidor.

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
		totalItems: total, // Indica paginación de servidor
		showSizeChanger: true,
	}}
	onPageChange={(newPage, newPageSize) => {
		setPage(newPage);
		setPageSize(newPageSize);
	}}
/>;
```

### 13. Ordenamiento Controlado

Para ordenamiento del lado del servidor.

```tsx
const [sort, setSort] = useState<SortState | null>(null);

<BetterTable<User>
	data={data}
	columns={columns}
	rowKey="id"
	sort={sort}
	onSortChange={(newSort) => {
		setSort(newSort);
		fetchSortedData(newSort);
	}}
/>;
```

### 14. Estilos y Variantes

Personaliza la apariencia de la tabla.

```tsx
<BetterTable<User>
	data={users}
	columns={columns}
	rowKey="id"
	// Variantes
	striped // Filas alternadas
	bordered // Bordes visibles
	hoverable // Hover en filas
	stickyHeader // Header fijo
	// Tamaño
	size="small" // 'small' | 'medium' | 'large'
	// Altura máxima (activa scroll)
	maxHeight="400px"
	// Clases personalizadas
	classNames={{
		container: "my-table-container",
		table: "my-table",
		header: "my-header",
		row: "my-row",
		cell: "my-cell",
	}}
	// Estilos inline
	styles={{
		container: { margin: "20px" },
		table: { minWidth: "800px" },
	}}
/>
```

### 15. Callbacks de Interacción

```tsx
<BetterTable<User>
	data={users}
	columns={columns}
	rowKey="id"
	onRowClick={(user, index) => {
		console.log("Clicked:", user.name);
	}}
	onRowDoubleClick={(user, index) => {
		openEditModal(user);
	}}
/>
```

### 16. Localización

Personaliza todos los textos de la tabla.

```tsx
<BetterTable<User>
	data={users}
	columns={columns}
	rowKey="id"
	locale={{
		// Búsqueda
		search: "Buscar",
		searchPlaceholder: "Buscar...",

		// Filtros
		filterPlaceholder: "Filtrar...",
		filterAll: "Todos",
		filterTrue: "Sí",
		filterFalse: "No",
		clearFilter: "Limpiar filtro",

		// Selección
		selectAll: "Seleccionar todo",
		deselectAll: "Deseleccionar todo",
		selected: "seleccionado(s)",

		// Paginación
		page: "Página",
		of: "de",
		itemsPerPage: "Items por página",
		firstPage: "Primera página",
		previousPage: "Anterior",
		nextPage: "Siguiente",
		lastPage: "Última página",

		// Estados
		loading: "Cargando...",
		empty: "No hay datos",

		// Acciones
		actions: "Acciones",
	}}
/>
```

## API Reference

### BetterTableProps<T>

| Prop                | Tipo                                           | Default            | Descripción                         |
| ------------------- | ---------------------------------------------- | ------------------ | ----------------------------------- |
| `data`              | `T[]`                                          | **requerido**      | Array de datos                      |
| `columns`           | `Column<T>[]`                                  | **requerido**      | Configuración de columnas           |
| `rowKey`            | `keyof T \| (row: T, index: number) => string` | `'id'`             | Identificador único de fila         |
| `rowActions`        | `RowAction<T>[]`                               | -                  | Acciones por fila                   |
| `globalActions`     | `GlobalAction<T>[]`                            | -                  | Acciones globales                   |
| `pagination`        | `PaginationConfig \| false`                    | `{ pageSize: 10 }` | Configuración de paginación         |
| `onPageChange`      | `(page: number, pageSize: number) => void`     | -                  | Callback cambio de página           |
| `sort`              | `SortState \| null`                            | -                  | Estado de ordenamiento (controlado) |
| `onSortChange`      | `(sort: SortState \| null) => void`            | -                  | Callback cambio de orden            |
| `filters`           | `FilterState`                                  | -                  | Estado de filtros (controlado)      |
| `onFilterChange`    | `(filters: FilterState) => void`               | -                  | Callback cambio de filtros          |
| `searchable`        | `boolean`                                      | `false`            | Habilitar búsqueda global           |
| `searchValue`       | `string`                                       | -                  | Valor de búsqueda (controlado)      |
| `onSearchChange`    | `(value: string) => void`                      | -                  | Callback cambio de búsqueda         |
| `searchColumns`     | `string[]`                                     | -                  | Columnas para búsqueda              |
| `selectable`        | `boolean`                                      | auto-inferido      | Habilitar selección                 |
| `selectedRows`      | `T[]`                                          | -                  | Filas seleccionadas (controlado)    |
| `onSelectionChange` | `(selected: T[]) => void`                      | -                  | Callback cambio de selección        |
| `selectionMode`     | `'single' \| 'multiple'`                       | `'multiple'`       | Modo de selección                   |
| `loading`           | `boolean`                                      | `false`            | Estado de carga                     |
| `loadingComponent`  | `ReactNode`                                    | -                  | Componente de carga custom          |
| `emptyComponent`    | `ReactNode`                                    | -                  | Componente vacío custom             |
| `striped`           | `boolean`                                      | `false`            | Filas alternadas                    |
| `bordered`          | `boolean`                                      | `false`            | Bordes visibles                     |
| `hoverable`         | `boolean`                                      | `true`             | Hover en filas                      |
| `stickyHeader`      | `boolean`                                      | `false`            | Header fijo                         |
| `size`              | `'small' \| 'medium' \| 'large'`               | `'medium'`         | Tamaño                              |
| `maxHeight`         | `string`                                       | -                  | Altura máxima                       |
| `classNames`        | `TableClassNames`                              | -                  | Clases CSS custom                   |
| `styles`            | `TableStyles`                                  | -                  | Estilos inline                      |
| `locale`            | `Partial<TableLocale>`                         | -                  | Textos localizados                  |
| `onRowClick`        | `(row: T, index: number) => void`              | -                  | Click en fila                       |
| `onRowDoubleClick`  | `(row: T, index: number) => void`              | -                  | Doble click en fila                 |
| `ariaLabel`         | `string`                                       | -                  | Label ARIA                          |
| `ariaDescribedBy`   | `string`                                       | -                  | Described by ARIA                   |

### Column<T>

| Prop         | Tipo                                                      | Default       | Descripción                          |
| ------------ | --------------------------------------------------------- | ------------- | ------------------------------------ |
| `id`         | `string`                                                  | **requerido** | Identificador único                  |
| `accessor`   | `keyof T \| string`                                       | **requerido** | Key de acceso (soporta dot notation) |
| `header`     | `string`                                                  | **requerido** | Texto del header                     |
| `type`       | `'string' \| 'number' \| 'boolean' \| 'date' \| 'custom'` | `'string'`    | Tipo de dato                         |
| `cell`       | `(value, row, index) => ReactNode`                        | -             | Render custom                        |
| `headerCell` | `(column) => ReactNode`                                   | -             | Header custom                        |
| `sortable`   | `boolean`                                                 | `false`       | Permitir ordenar                     |
| `filterable` | `boolean`                                                 | `false`       | Permitir filtrar                     |
| `width`      | `string \| number`                                        | -             | Ancho de columna                     |
| `align`      | `'left' \| 'center' \| 'right'`                           | `'left'`      | Alineación                           |
| `hidden`     | `boolean`                                                 | `false`       | Ocultar columna                      |

### RowAction<T>

| Prop           | Tipo                                            | Default       | Descripción                    |
| -------------- | ----------------------------------------------- | ------------- | ------------------------------ |
| `id`           | `string`                                        | **requerido** | Identificador único            |
| `label`        | `string`                                        | **requerido** | Etiqueta                       |
| `icon`         | `ReactNode`                                     | -             | Icono                          |
| `mode`         | `'callback' \| 'modal' \| 'link'`               | **requerido** | Modo de ejecución              |
| `onClick`      | `(row: T, index: number) => void`               | -             | Callback (mode='callback')     |
| `modalContent` | `React.ComponentType<{data: T, onClose}>`       | -             | Contenido modal (mode='modal') |
| `href`         | `string \| (row: T) => string`                  | -             | URL (mode='link')              |
| `visible`      | `(row: T) => boolean`                           | -             | Visibilidad condicional        |
| `disabled`     | `(row: T) => boolean`                           | -             | Deshabilitado condicional      |
| `variant`      | `'default' \| 'primary' \| 'danger' \| 'ghost'` | `'default'`   | Variante visual                |

### GlobalAction<T>

| Prop                | Tipo                                    | Default       | Descripción                  |
| ------------------- | --------------------------------------- | ------------- | ---------------------------- |
| `id`                | `string`                                | **requerido** | Identificador único          |
| `label`             | `string`                                | **requerido** | Etiqueta del botón           |
| `icon`              | `ReactNode`                             | -             | Icono                        |
| `onClick`           | `(selected: T[], allData: T[]) => void` | **requerido** | Callback                     |
| `requiresSelection` | `boolean`                               | `false`       | Requiere filas seleccionadas |
| `variant`           | `'default' \| 'primary' \| 'danger'`    | `'default'`   | Variante visual              |

## Personalización de Estilos

### CSS Variables

```css
:root {
	/* Colores */
	--bt-color-primary: #3b82f6;
	--bt-color-primary-hover: #2563eb;
	--bt-color-primary-light: #dbeafe;
	--bt-color-danger: #ef4444;
	--bt-color-danger-hover: #dc2626;
	--bt-color-success: #22c55e;
	--bt-color-warning: #f59e0b;

	/* Texto */
	--bt-color-text: #1f2937;
	--bt-color-text-secondary: #6b7280;
	--bt-color-text-disabled: #9ca3af;

	/* Fondos */
	--bt-color-background: #ffffff;
	--bt-color-background-hover: #f9fafb;
	--bt-color-background-alt: #f3f4f6;
	--bt-color-background-selected: #eff6ff;

	/* Bordes */
	--bt-color-border: #e5e7eb;
	--bt-color-border-hover: #d1d5db;
	--bt-border-width: 1px;
	--bt-border-radius-sm: 4px;
	--bt-border-radius-md: 6px;
	--bt-border-radius-lg: 8px;

	/* Espaciado */
	--bt-spacing-xs: 4px;
	--bt-spacing-sm: 8px;
	--bt-spacing-md: 12px;
	--bt-spacing-lg: 16px;
	--bt-spacing-xl: 24px;

	/* Tipografía */
	--bt-font-size-sm: 0.875rem;
	--bt-font-size-md: 1rem;
	--bt-font-size-lg: 1.125rem;
	--bt-font-weight-normal: 400;
	--bt-font-weight-medium: 500;
	--bt-font-weight-bold: 600;

	/* Transiciones */
	--bt-transition-fast: 150ms ease;
	--bt-transition-normal: 200ms ease;

	/* Sombras */
	--bt-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	--bt-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### Dark Mode

```css
[data-theme="dark"],
.dark {
	--bt-color-text: #f9fafb;
	--bt-color-text-secondary: #9ca3af;
	--bt-color-background: #1f2937;
	--bt-color-background-hover: #374151;
	--bt-color-background-alt: #111827;
	--bt-color-border: #374151;
}
```

## Hooks Exportados

Para uso avanzado, puedes usar los hooks internos:

```tsx
import {
	useTableSort,
	useTableFilter,
	useTablePagination,
	useTableSelection,
	useTableSearch,
} from "better-table";
```

## Licencia

MIT
