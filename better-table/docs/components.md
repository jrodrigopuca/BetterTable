# Componentes de BetterTable

Documentación detallada de todos los componentes, hooks y utilidades.

## 📦 Componentes UI

### BetterTable (Componente Principal)

**Ubicación:** `src/components/BetterTable/components/Table.tsx`

El componente raíz que orquesta toda la funcionalidad de la tabla.

**Tipo:** Composite Component (combina múltiples subcomponentes)

#### Props Principales

| Prop            | Tipo                                | Default | Requerido | Descripción                      |
| --------------- | ----------------------------------- | ------- | --------- | -------------------------------- |
| `data`          | `T[]`                               | -       | Sí        | Array de datos a mostrar         |
| `columns`       | `Column<T>[]`                       | -       | Sí        | Configuración de columnas        |
| `rowKey`        | `keyof T \| (row, index) => string` | `'id'`  | No        | Key único para identificar filas |
| `rowActions`    | `RowAction<T>[]`                    | `[]`    | No        | Acciones disponibles por fila    |
| `globalActions` | `GlobalAction<T>[]`                 | `[]`    | No        | Acciones globales en toolbar     |

#### Props de Configuración

| Prop            | Tipo                        | Default      | Requerido | Descripción                  |
| --------------- | --------------------------- | ------------ | --------- | ---------------------------- |
| `pagination`    | `PaginationConfig \| false` | `false`      | No        | Configuración de paginación  |
| `searchable`    | `boolean`                   | `false`      | No        | Mostrar barra de búsqueda    |
| `selectable`    | `boolean`                   | `false`      | No        | Habilitar selección de filas |
| `selectionMode` | `'single' \| 'multiple'`    | `'multiple'` | No        | Modo de selección            |

#### Props de Personalización

| Prop               | Tipo                             | Default         | Requerido | Descripción                         |
| ------------------ | -------------------------------- | --------------- | --------- | ----------------------------------- |
| `loading`          | `boolean`                        | `false`         | No        | Estado de carga                     |
| `loadingComponent` | `ReactNode`                      | Spinner         | No        | Componente de loading personalizado |
| `emptyComponent`   | `ReactNode`                      | Default message | No        | Componente de estado vacío          |
| `locale`           | `TableLocale`                    | Spanish         | No        | Textos personalizados (i18n)        |
| `classNames`       | `TableClassNames`                | -               | No        | Clases CSS personalizadas           |
| `bordered`         | `boolean`                        | `false`         | No        | Mostrar bordes                      |
| `striped`          | `boolean`                        | `false`         | No        | Filas con rayas alternas            |
| `hoverable`        | `boolean`                        | `true`          | No        | Hover en filas                      |
| `size`             | `'small' \| 'medium' \| 'large'` | `'medium'`      | No        | Tamaño de la tabla                  |
| `stickyHeader`     | `boolean`                        | `false`         | No        | Header fijo al hacer scroll         |
| `maxHeight`        | `string \| number`               | -               | No        | Altura máxima (activa scroll)       |

#### Callbacks

| Evento              | Payload                            | Descripción            |
| ------------------- | ---------------------------------- | ---------------------- |
| `onSort`            | `SortState`                        | Cambio de ordenamiento |
| `onFilter`          | `FilterState`                      | Cambio de filtros      |
| `onSearch`          | `string`                           | Cambio de búsqueda     |
| `onSelectionChange` | `T[]`                              | Cambio de selección    |
| `onRowClick`        | `(row: T, index: number)`          | Click en fila          |
| `onRowDoubleClick`  | `(row: T, index: number)`          | Doble click en fila    |
| `onPageChange`      | `(page: number, pageSize: number)` | Cambio de página       |

Ver [types.ts](../src/components/BetterTable/types.ts) para definición completa de tipos.

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

### Column (Configuración de Columna)

Define la configuración de cada columna de la tabla.

#### Props

| Prop         | Tipo                                                      | Default    | Requerido | Descripción                                     |
| ------------ | --------------------------------------------------------- | ---------- | --------- | ----------------------------------------------- |
| `id`         | `string`                                                  | -          | Sí        | Identificador único de la columna               |
| `accessor`   | `keyof T \| string`                                       | -          | Sí        | Key para acceder al dato (soporta dot notation) |
| `header`     | `string`                                                  | -          | Sí        | Texto visible en el header                      |
| `type`       | `'string' \| 'number' \| 'boolean' \| 'date' \| 'custom'` | `'string'` | No        | Tipo de dato para filtrado                      |
| `cell`       | `(value, row, rowIndex) => ReactNode`                     | -          | No        | Render personalizado de celda                   |
| `headerCell` | `(column) => ReactNode`                                   | -          | No        | Render personalizado de header                  |
| `sortable`   | `boolean`                                                 | `true`     | No        | ¿Columna ordenable?                             |
| `filterable` | `boolean`                                                 | `true`     | No        | ¿Columna filtrable?                             |
| `width`      | `string \| number`                                        | `'auto'`   | No        | Ancho de columna                                |
| `align`      | `'left' \| 'center' \| 'right'`                           | `'left'`   | No        | Alineación del contenido                        |
| `hidden`     | `boolean`                                                 | `false`    | No        | Columna oculta                                  |

#### Ejemplo

```typescript
const columns: Column<User>[] = [
	{ id: "name", accessor: "name", header: "Nombre", sortable: true },
	{ id: "email", accessor: "profile.email", header: "Email" }, // dot notation
	{
		id: "status",
		accessor: "active",
		header: "Estado",
		type: "boolean",
		cell: (value) => (value ? "✅ Activo" : "❌ Inactivo"),
	},
];
```

---

### RowAction (Acción de Fila)

Define acciones disponibles para cada fila.

#### Props

| Prop           | Tipo                                            | Default       | Requerido          | Descripción                         |
| -------------- | ----------------------------------------------- | ------------- | ------------------ | ----------------------------------- |
| `id`           | `string`                                        | -             | Sí                 | Identificador único                 |
| `label`        | `string`                                        | -             | Sí                 | Etiqueta de la acción               |
| `icon`         | `ReactNode`                                     | -             | No                 | Icono (string, emoji, o componente) |
| `mode`         | `'callback' \| 'modal' \| 'link'`               | -             | Sí                 | Modo de ejecución                   |
| `onClick`      | `(row, rowIndex) => void`                       | -             | Si mode='callback' | Callback de acción                  |
| `modalContent` | `React.ComponentType`                           | -             | Si mode='modal'    | Componente para modal               |
| `href`         | `string \| (row) => string`                     | -             | Si mode='link'     | URL de destino                      |
| `visible`      | `(row) => boolean`                              | `() => true`  | No                 | Visibilidad condicional             |
| `disabled`     | `(row) => boolean`                              | `() => false` | No                 | Deshabilitar condicionalmente       |
| `variant`      | `'default' \| 'primary' \| 'danger' \| 'ghost'` | `'default'`   | No                 | Variante visual                     |

#### Ejemplo con Modos

```typescript
const rowActions: RowAction<User>[] = [
	// Modo callback
	{
		id: "edit",
		label: "Editar",
		icon: "✏️",
		mode: "callback",
		onClick: (row) => console.log("Edit", row),
	},
	// Modo modal
	{
		id: "details",
		label: "Ver detalles",
		mode: "modal",
		modalContent: UserDetailsModal,
	},
	// Modo link
	{
		id: "profile",
		label: "Ver perfil",
		mode: "link",
		href: (row) => `/users/${row.id}`,
	},
	// Con visibilidad condicional
	{
		id: "delete",
		label: "Eliminar",
		mode: "callback",
		variant: "danger",
		onClick: (row) => handleDelete(row),
		visible: (row) => row.canDelete,
		disabled: (row) => row.isProtected,
	},
];
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

### TableCards (Responsive)

**Ubicación:** `src/components/BetterTable/components/TableCards.tsx`

Contenedor de cards para vista responsive en móvil (<640px).

#### Responsabilidades

- Renderizar lista de cards cuando la tabla está en modo móvil
- Mapear datos procesados a componentes TableCard
- Mantener consistencia con tabla (selección, acciones)

#### Estructura

```tsx
<div className="bt-cards">
  {processedData.map(row => (
    <TableCard key={row.id} row={row} ... />
  ))}
</div>
```

**Nota**: Las cards se renderizan fuera del elemento `<table>` para mantener HTML válido. CSS media queries controlan la visibilidad.

---

### TableCard (Responsive)

**Ubicación:** `src/components/BetterTable/components/TableCard.tsx`

Card individual para vista responsive en móvil.

#### Responsabilidades

- Mostrar datos de una fila en formato card
- Primera columna como título/header
- Columnas restantes como pares label-value
- Checkbox de selección (si es selectable)
- Acciones de fila
- Eventos click/doubleClick

#### Estructura

```
┌─────────────────────────────┐
│ ☐ Título (primera columna)  │ ← Header
├─────────────────────────────┤
│ Email:      john@test.com   │
│ Edad:       28              │ ← Card rows
│ Activo:     ✅              │
├─────────────────────────────┤
│ [Editar] [Eliminar]         │ ← Acciones
└─────────────────────────────┘
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
