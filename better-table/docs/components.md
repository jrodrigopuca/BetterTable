# Componentes de BetterTable

Documentación detallada de todos los componentes, hooks y utilidades.

## 📦 Componentes UI

### BetterTable (Componente Principal)

**Ubicación:** `src/components/BetterTable/components/Table.tsx`

El componente raíz que orquesta toda la funcionalidad de la tabla.

#### Props

```typescript
interface BetterTableProps<T extends TableData> {
	// Datos
	data: T[];
	columns: Column<T>[];
	rowKey?: keyof T | ((row: T, index: number) => string);

	// Comportamiento
	sortable?: boolean;
	filterable?: boolean;
	searchable?: boolean;
	selectable?: boolean;
	selectionMode?: "single" | "multiple";

	// Paginación
	pagination?: boolean | PaginationConfig;

	// Acciones
	rowActions?: RowAction<T>[];
	globalActions?: GlobalAction<T>[];

	// Callbacks
	onSort?: (state: SortState) => void;
	onFilter?: (filters: FilterState) => void;
	onSearch?: (value: string) => void;
	onSelectionChange?: (selectedRows: T[]) => void;
	onRowClick?: (row: T, index: number) => void;
	onRowDoubleClick?: (row: T, index: number) => void;

	// UI
	loading?: boolean;
	loadingComponent?: ReactNode;
	emptyComponent?: ReactNode;
	locale?: Partial<TableLocale>;
	classNames?: Partial<TableClassNames>;
	size?: "small" | "medium" | "large";
	bordered?: boolean;
	striped?: boolean;
	hoverable?: boolean;
}
```

#### Ejemplo de Uso

```typescript
<BetterTable
  data={users}
  columns={columns}
  rowKey="id"
  searchable
  pagination={{ pageSize: 10 }}
  rowActions={[
    {
      id: 'edit',
      label: 'Editar',
      mode: 'callback',
      onClick: (row) => handleEdit(row)
    }
  ]}
/>
```

---

### TableHeader

**Ubicación:** `src/components/BetterTable/components/TableHeader.tsx`

Renderiza el header de la tabla con capacidades de ordenamiento y filtrado.

#### Responsabilidades

- Renderizar headers de columnas
- Mostrar indicadores de ordenamiento
- Renderizar inputs de filtrado
- Manejar eventos de click para ordenamiento

#### Estructura

```tsx
<thead className="bt-thead">
	<tr>
		{columns.map((column) => (
			<TableHeaderCell key={column.id} column={column} />
		))}
	</tr>
</thead>
```

---

### TableHeaderCell

**Ubicación:** `src/components/BetterTable/components/TableHeaderCell.tsx`

Celda individual del header con controles de ordenamiento y filtrado.

#### Features

- Botones de ordenamiento (↑↓)
- Input de filtro integrado
- Soporte para render personalizado
- Indicadores visuales de estado activo

#### Estados

- **Idle**: Sin ordenamiento
- **Ascending**: Ordenamiento ascendente (↑)
- **Descending**: Ordenamiento descendente (↓)

---

### TableBody

**Ubicación:** `src/components/BetterTable/components/TableBody.tsx`

Renderiza el cuerpo de la tabla con todas las filas de datos.

#### Responsabilidades

- Renderizar filas de datos
- Manejar estados vacíos
- Manejar estados de carga
- Aplicar estilos condicionales (hover, striped)

#### Flujo

```
Datos → Procesamiento → Paginación → Renderizado
                                    ↓
                            [TableRow * N]
```

---

### TableRow

**Ubicación:** `src/components/BetterTable/components/TableRow.tsx`

Fila individual de la tabla.

#### Features

- Checkbox de selección (si aplicable)
- Celdas de datos
- Acciones de fila
- Eventos click/doubleClick
- Estilos condicionales (selected, hover)

#### Props

```typescript
interface TableRowProps<T> {
	row: T;
	rowIndex: number;
	columns: Column<T>[];
	rowActions?: RowAction<T>[];
	selectable: boolean;
	isSelected: boolean;
}
```

---

### TableCell

**Ubicación:** `src/components/BetterTable/components/TableCell.tsx`

Celda individual de datos.

#### Responsabilidades

- Renderizar valor de la celda
- Aplicar formato según tipo de dato
- Ejecutar custom renderer si existe
- Manejar valores nulos/undefined

#### Tipos de Renderizado

1. **Default**: Muestra el valor como string
2. **Boolean**: Renderiza ✅/❌
3. **Date**: Formatea fecha
4. **Custom**: Ejecuta función `cell()`

---

### TablePagination

**Ubicación:** `src/components/BetterTable/components/TablePagination.tsx`

Controles de paginación.

#### Features

- Navegación prev/next
- Selector de página
- Selector de tamaño de página
- Jump to page
- Información de rango (1-10 de 100)

#### Estructura

```
[<] [1] [2] [3] [...] [10] [>]  |  Mostrar: [10▼]  |  Ir a: [__]
```

---

### TableToolbar

**Ubicación:** `src/components/BetterTable/components/TableToolbar.tsx`

Barra de herramientas superior con búsqueda y acciones globales.

#### Features

- Búsqueda global
- Botones de acción global
- Contador de selección
- Botón clear selection

#### Layout

```
┌─────────────────────────────────────────────┐
│ [🔍 Buscar...] [Acción1] [Acción2] (3 sel.) │
└─────────────────────────────────────────────┘
```

---

### TableActions

**Ubicación:** `src/components/BetterTable/components/TableActions.tsx`

Columna de acciones para cada fila.

#### Features

- Botones de acción por fila
- Tooltips
- Estados disabled
- Visibilidad condicional

---

### TableModal

**Ubicación:** `src/components/BetterTable/components/TableModal.tsx`

Modal genérico para acciones de fila.

#### Features

- Overlay
- Contenido dinámico
- Botón cerrar
- Click outside to close
- Escape key support

---

### TableLoading

**Ubicación:** `src/components/BetterTable/components/TableLoading.tsx`

Estado de carga.

#### Default

Spinner + texto "Cargando..."

#### Customizable

Puede reemplazarse con `loadingComponent` prop.

---

### TableEmpty

**Ubicación:** `src/components/BetterTable/components/TableEmpty.tsx`

Estado vacío cuando no hay datos.

#### Default

Icono + texto "No hay datos disponibles"

#### Customizable

Puede reemplazarse con `emptyComponent` prop.

---

## 🪝 Hooks

### useTableSort

**Ubicación:** `src/components/BetterTable/hooks/useTableSort.ts`

Hook para ordenamiento de datos.

#### API

```typescript
const {
	sortState, // { column: string, direction: 'asc' | 'desc' | null }
	sortedData, // Datos ordenados
	handleSort, // (columnId: string) => void
} = useTableSort(data, columns);
```

#### Comportamiento

- Click 1: Ordenar ascendente
- Click 2: Ordenar descendente
- Click 3: Quitar ordenamiento

#### Algoritmo

Usa `sortData()` utility con comparaciones type-safe.

---

### useTableFilter

**Ubicación:** `src/components/BetterTable/hooks/useTableFilter.ts`

Hook para filtrado por columna.

#### API

```typescript
const {
	filters, // { [columnId]: value }
	filteredData, // Datos filtrados
	setFilter, // (columnId, value) => void
	clearFilters, // () => void
} = useTableFilter(data, columns);
```

#### Tipos de Filtro

- **String**: Contains (case-insensitive)
- **Number**: Exact match o comparación
- **Boolean**: Select dropdown
- **Date**: Range (futuro)

---

### useTableSearch

**Ubicación:** `src/components/BetterTable/hooks/useTableSearch.ts`

Hook para búsqueda global.

#### API

```typescript
const {
	searchValue, // string
	searchedData, // Datos filtrados
	handleSearch, // (value: string) => void
	clearSearch, // () => void
} = useTableSearch(data, columns);
```

#### Comportamiento

Busca en todas las columnas searchables (opta-in).

---

### useTableSelection

**Ubicación:** `src/components/BetterTable/hooks/useTableSelection.ts`

Hook para selección de filas.

#### API

```typescript
const {
	selectedRows, // T[]
	isSelected, // (row, index) => boolean
	toggleRow, // (row, index) => void
	selectAll, // () => void
	deselectAll, // () => void
	isAllSelected, // boolean
	isPartiallySelected, // boolean
	selectedCount, // number
} = useTableSelection(data, rowKey, mode);
```

#### Modos

- **single**: Solo una fila a la vez
- **multiple**: Múltiples filas con checkbox

---

### useTablePagination

**Ubicación:** `src/components/BetterTable/hooks/useTablePagination.ts`

Hook para paginación.

#### API

```typescript
const {
	page, // number
	pageSize, // number
	totalPages, // number
	paginatedData, // Datos de página actual
	goToPage, // (page: number) => void
	nextPage, // () => void
	prevPage, // () => void
	changePageSize, // (size: number) => void
	hasNextPage, // boolean
	hasPrevPage, // boolean
	startIndex, // number (1-based)
	endIndex, // number
} = useTablePagination(data, config);
```

---

## 🛠️ Utilidades

### getValueFromPath

**Ubicación:** `src/components/BetterTable/utils/getValueFromPath.ts`

Accede a propiedades anidadas usando dot notation.

#### Uso

```typescript
const value = getValueFromPath(
	{ user: { profile: { name: "Juan" } } },
	"user.profile.name",
);
// → 'Juan'
```

#### Features

- Soporte para arrays
- Manejo de undefined
- Type-safe con TypeScript

---

### sortData

**Ubicación:** `src/components/BetterTable/utils/sortData.ts`

Ordena array de datos por columna.

#### API

```typescript
const sorted = sortData(data, "columnId", "asc", columns);
```

#### Algoritmo

- Usa `getValueFromPath` para extraer valores
- Comparación type-aware (string vs number)
- Manejo de null/undefined

---

### filterData

**Ubicación:** `src/components/BetterTable/utils/filterData.ts`

Filtra datos por múltiples columnas.

#### API

```typescript
const filtered = filterData(data, { name: "juan", age: 25 }, columns);
```

---

### searchData

**Ubicación:** `src/components/BetterTable/utils/filterData.ts`

Búsqueda global en múltiples columnas.

#### API

```typescript
const searched = searchData(data, "search term", columns);
```

---

## 🎨 Tipos TypeScript

### TableData

```typescript
type TableData = Record<string, unknown>;
```

Tipo base extensible para datos de tabla.

---

### Column<T>

```typescript
interface Column<T extends TableData> {
	id: string;
	accessor: keyof T | string;
	header: string;
	type?: "string" | "number" | "boolean" | "date" | "custom";
	cell?: (value: unknown, row: T, index: number) => ReactNode;
	sortable?: boolean;
	filterable?: boolean;
	width?: string | number;
	align?: "left" | "center" | "right";
	hidden?: boolean;
}
```

---

### RowAction<T>

```typescript
interface RowAction<T extends TableData> {
	id: string;
	label: string;
	icon?: ReactNode;
	mode: "callback" | "modal" | "link";
	onClick?: (row: T, index: number) => void;
	modalContent?: ComponentType<{ data: T; onClose: () => void }>;
	href?: string | ((row: T) => string);
	visible?: (row: T) => boolean;
	disabled?: (row: T) => boolean;
	variant?: "default" | "primary" | "danger" | "ghost";
}
```

---

### GlobalAction<T>

```typescript
interface GlobalAction<T extends TableData> {
	id: string;
	label: string;
	icon?: ReactNode;
	onClick: (selectedRows: T[], allData: T[]) => void;
	requiresSelection?: boolean;
	variant?: "default" | "primary" | "danger";
}
```

---

### SortState

```typescript
interface SortState {
	column: string | null;
	direction: "asc" | "desc" | null;
}
```

---

### FilterState

```typescript
type FilterState = Record<string, string | number | boolean | null>;
```

---

## 🎯 Patrones de Uso Común

### 1. Tabla Básica

```typescript
<BetterTable
  data={users}
  columns={[
    { id: 'name', accessor: 'name', header: 'Nombre' },
    { id: 'email', accessor: 'email', header: 'Email' }
  ]}
/>
```

### 2. Con Acciones

```typescript
<BetterTable
  data={users}
  columns={columns}
  rowActions={[
    {
      id: 'edit',
      label: 'Editar',
      mode: 'callback',
      onClick: handleEdit
    }
  ]}
/>
```

### 3. Con Selección

```typescript
<BetterTable
  data={users}
  columns={columns}
  selectable
  globalActions={[
    {
      id: 'delete',
      label: 'Eliminar seleccionados',
      requiresSelection: true,
      onClick: handleBulkDelete
    }
  ]}
/>
```

### 4. Custom Cells

```typescript
const columns = [
  {
    id: 'status',
    accessor: 'status',
    header: 'Estado',
    cell: (value) => (
      <Badge color={value === 'active' ? 'green' : 'red'}>
        {value}
      </Badge>
    )
  }
];
```

### 5. Datos Anidados

```typescript
const columns = [
	{
		id: "userName",
		accessor: "user.profile.name", // Dot notation
		header: "Nombre de Usuario",
	},
];
```
