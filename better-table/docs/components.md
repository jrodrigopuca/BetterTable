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
| `multiSort`     | `boolean`                   | `false`      | No        | Habilitar multi-sort (ciclo de 3 estados por columna) |
| `columnVisibility` | `boolean`                | `false`      | No        | Mostrar toggle de visibilidad de columnas en toolbar |

#### Props de Personalización

| Prop               | Tipo                             | Default         | Requerido | Descripción                         |
| ------------------ | -------------------------------- | --------------- | --------- | ----------------------------------- |
| `loading`          | `boolean`                        | `false`         | No        | Estado de carga                     |
| `loadingComponent` | `ReactNode`                      | Spinner         | No        | Componente de loading personalizado |
| `emptyComponent`   | `ReactNode`                      | Default message | No        | Componente de estado vacío          |
| `locale`           | `LocaleKey \| TableLocale`       | `'en'`          | No        | Locale preset or custom overrides   |
| `classNames`       | `TableClassNames`                | -               | No        | Clases CSS personalizadas           |
| `bordered`         | `boolean`                        | `false`         | No        | Mostrar bordes                      |
| `striped`          | `boolean`                        | `false`         | No        | Filas con rayas alternas            |
| `hoverable`        | `boolean`                        | `true`          | No        | Hover en filas                      |
| `size`             | `'small' \| 'medium' \| 'large'` | `'medium'`      | No        | Tamaño de la tabla                  |
| `stickyHeader`     | `boolean`                        | `false`         | No        | Header fijo al hacer scroll         |
| `maxHeight`        | `string \| number`               | -               | No        | Altura máxima (activa scroll)       |

#### Props de Búsqueda y Filtrado

| Prop               | Tipo                              | Default      | Requerido | Descripción                                        |
| ------------------ | --------------------------------- | ------------ | --------- | -------------------------------------------------- |
| `filterMode`       | `'floating' \| 'panel' \| 'both'` | `'floating'` | No        | Modo de filtrado: inline en header, panel, o ambos |
| `searchDebounceMs` | `number`                          | `300`        | No        | Delay de debounce para búsqueda (ms)               |
| `searchColumns`    | `string[]`                        | todas        | No        | Columnas a buscar (por accessor o id)              |

#### Props de Acciones

| Prop                | Tipo     | Default | Requerido | Descripción                            |
| ------------------- | -------- | ------- | --------- | -------------------------------------- |
| `maxVisibleActions` | `number` | `3`     | No        | Acciones inline antes del overflow (⋯) |

#### Callbacks

| Evento                     | Payload                            | Descripción                      |
| -------------------------- | ---------------------------------- | -------------------------------- |
| `onSortChange`             | `SortState`                        | Cambio de ordenamiento           |
| `onMultiSortChange`        | `MultiSortState`                   | Cambio de multi-sort             |
| `onFilterChange`           | `FilterState`                      | Cambio de filtros                |
| `onSearchChange`           | `string`                           | Cambio de búsqueda               |
| `onSelectionChange`        | `T[]`                              | Cambio de selección              |
| `onColumnVisibilityChange` | `string[]`                         | Cambio de columnas ocultas       |
| `onRowClick`               | `(row: T, index: number)`          | Click en fila                    |
| `onRowDoubleClick`         | `(row: T, index: number)`          | Doble click en fila              |
| `onPageChange`             | `(page: number, pageSize: number)` | Cambio de página                 |

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

Celda individual del header con controles de ordenamiento.

#### Features

- Botones de ordenamiento (↑↓) con ciclo de 3 estados
- Soporte para render personalizado (`headerCell`)
- Indicadores visuales de estado activo
- Badge de prioridad en multi-sort (muestra número de orden)

#### Estados

- **Idle**: Sin ordenamiento — icono con opacidad reducida
- **Ascending**: Ordenamiento ascendente (↑) — icono activo
- **Descending**: Ordenamiento descendente (↓) — icono activo

#### Comportamiento de Sort

**Single sort** (default):
- Click 1: Ordena ascendente
- Click 2: Ordena descendente
- Click 3: Quita ordenamiento (vuelve al estado original)
- Click en otra columna: Reemplaza el sort

**Multi-sort** (`multiSort={true}`):
- Cada click en una columna nueva la agrega al array de sort
- Clicks subsecuentes en la misma columna ciclan: asc → desc → remove
- Se muestra un badge numérico de prioridad cuando hay >1 columna ordenada
- No requiere tecla modificadora (Shift/Ctrl)

---

### TableFilterPanel

**Ubicación:** `src/components/BetterTable/components/TableFilterPanel.tsx`

Panel colapsable de filtros para todas las columnas filtrables.

#### Features

- Se activa desde un botón "Filter by" en el toolbar
- Grid layout responsive (1 columna en móvil, multi-columna en desktop)
- Inputs de texto/número para columnas string/number
- Select para columnas booleanas
- Date range (desde/hasta) para columnas tipo `date`
- Badge con conteo de filtros activos
- Botón "Clear filters" cuando hay filtros activos

#### Estructura

```
┌─────────────────────────────────────────────┐
│ [▼ Filter by (2)]                           │  ← Toolbar toggle
├─────────────────────────────────────────────┤
│ Name          │ Age           │ Active      │
│ [__________]  │ [__________]  │ [▼ —     ]  │  ← Filter Panel
│                                             │
│ Date                                        │
│ [From ____] – [To ____]                     │
│                                             │
│                        [Clear filters]      │
└─────────────────────────────────────────────┘
```

---

### TableFloatingFilter

**Ubicación:** `src/components/BetterTable/components/TableFloatingFilter.tsx`

Fila de filtros inline dentro de `<thead>`, renderizada debajo del header (patrón "Floating Filters" de AG Grid).

#### Features

- Se renderiza por defecto (`filterMode="floating"`) o combinado (`filterMode="both"`)
- Input de texto/número para columnas string/number
- Select para columnas booleanas (—/✅/❌)
- Date range (desde/hasta) para columnas tipo `date`
- Comparte el mismo estado de filtros que el FilterPanel (`filters` / `setFilter`)
- Se oculta si ninguna columna es filtrable
- Soporte sticky (se queda fijo con el header al hacer scroll)
- Tamaños compactos según `size` prop (small/medium/large)
- Accesibilidad: `aria-label` e `id` únicos por input (`bt-ff-{colId}`)

#### Estructura

```
┌─────────────────────────────────────────────────┐
│  Nombre ↑↓   │  Email       │  Edad ↑↓  │ ···  │  ← Header row
│ [__________] │              │ [_______] │ [▼—]  │  ← Floating filter row
├──────────────┼──────────────┼───────────┼───────┤
│  Juan García │  juan@...    │  28       │  ✅   │
│  María López │  maria@...   │  35       │  ✅   │
└─────────────────────────────────────────────────┘
```

#### filterMode Comparison

| Valor        | Floating row | Panel toggle | Panel expandible |
| ------------ | ------------ | ------------ | ---------------- |
| `'floating'` | ✅           | ❌           | ❌               |
| `'panel'`    | ❌           | ✅           | ✅               |
| `'both'`     | ✅           | ✅           | ✅               |

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

Barra de herramientas superior con búsqueda, filtros y acciones globales.

#### Features

- Búsqueda global con debounce y botón clear
- Botón toggle para Filter Panel (con badge de filtros activos)
- Botones de acción global
- Contador de selección + botón deselect
- Responsive: búsqueda colapsable, acciones icon-only en móvil

#### Layout Desktop

```
┌───────────────────────────────────────────────────────────┐
│ [▼ Filter by] [🔍 Search...  ✕] [Action1] [Action2] 3 sel│
└───────────────────────────────────────────────────────────┘
```

#### Layout Mobile

```
┌──────────────────────┐
│ [▼] [🔍] [📥] [🗑️]   │
└──────────────────────┘
```

---

### TableActions

**Ubicación:** `src/components/BetterTable/components/TableActions.tsx`

Columna de acciones para cada fila.

#### Features

- Botones de acción inline (icon-only con tooltip)
- Overflow menu (⋯) cuando las acciones exceden `maxVisibleActions`
- Acciones `danger` se separan al final del dropdown con separador
- Tooltips con labels
- Estados disabled / visibilidad condicional

#### Estructura con Overflow

```
 Inline (2)     Overflow
[👁] [✏️] [⋯]  ┌──────────────────┐
                │ 📋 Clone          │
                │ 📦 Archive        │
                │ ─────────────── │
                │ 🗑️ Delete         │  ← danger
                └──────────────────┘
```

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

Spinner + texto "Loading..."

#### Customizable

Puede reemplazarse con `loadingComponent` prop.

---

### TableEmpty

**Ubicación:** `src/components/BetterTable/components/TableEmpty.tsx`

Estado vacío cuando no hay datos.

#### Default

Icono + texto "No data"

#### Customizable

Puede reemplazarse con `emptyComponent` prop.

---

## 🪝 Hooks

### useTableSort

**Ubicación:** `src/components/BetterTable/hooks/useTableSort.ts`

Hook para ordenamiento de datos. Soporta single-sort y multi-sort.

#### API

```typescript
const {
	sortState,      // { columnId: string | null, direction: 'asc' | 'desc' }
	sortedData,     // Datos ordenados
	handleSort,     // (columnId: string) => void
	clearSort,      // () => void
	multiSortState, // SortState[] — array de sorts en orden de prioridad
	isMultiSort,    // boolean — si multi-sort está habilitado
} = useTableSort({ data, multiSort, ... });
```

#### Comportamiento (Single Sort)

- Click 1: Ordenar ascendente
- Click 2: Ordenar descendente
- Click 3: Quitar ordenamiento
- Click en otra columna: Reemplaza

#### Comportamiento (Multi-Sort)

- Click en columna nueva: La agrega como asc al final del array
- Click en columna existente asc: Cambia a desc
- Click en columna existente desc: La remueve del array
- Cada columna mantiene su estado independiente
- Badge de prioridad visible cuando >1 columna activa

#### Algoritmo

Usa `sortData()` para single-sort y `multiSortData()` para multi-sort con comparaciones type-safe.

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
- **Boolean**: Select dropdown (✅/❌)
- **Date**: Range picker (desde/hasta)

---

### useTableSearch

**Ubicación:** `src/components/BetterTable/hooks/useTableSearch.ts`

Hook para búsqueda global.

#### API

```typescript
const {
	searchValue, // string (valor del input, inmediato)
	searchedData, // Datos filtrados (tras debounce)
	handleSearch, // (value: string) => void
	clearSearch, // () => void (inmediato, sin debounce)
} = useTableSearch(data, columns, { debounceMs: 300 });
```

#### Comportamiento

- Busca en todas las columnas searchables (matchea por `col.id` o `col.accessor`)
- El input responde al instante, el filtrado se aplica tras el debounce
- `clearSearch()` bypasea el debounce y limpia inmediatamente
- Configurable con `searchDebounceMs` prop (0 = instantáneo)

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
	columnId: string | null;
	direction: "asc" | "desc";
}
```

---

### MultiSortState

```typescript
type MultiSortState = SortState[];
```

Array de `SortState` en orden de prioridad. La primera entrada es el sort primario.

---

### FilterState

```typescript
type FilterState = Record<
	string,
	string | number | boolean | DateFilterRange | null
>;
```

---

### DateFilterRange

```typescript
interface DateFilterRange {
	from?: string; // ISO date string (YYYY-MM-DD)
	to?: string; // ISO date string (YYYY-MM-DD)
}
```

---

### TableLocale

```typescript
interface TableLocale {
	search?: string;
	searchPlaceholder?: string;
	noData?: string;
	loading?: string;
	page?: string;
	of?: string;
	items?: string;
	selected?: string;
	rowsPerPage?: string;
	actions?: string;
	sortAsc?: string;
	sortDesc?: string;
	filterBy?: string;
	clearFilters?: string;
	dateFrom?: string;
	dateTo?: string;
	selectAll?: string;
	deselectAll?: string;
	moreActions?: string;
	clearSearch?: string;
	closeModal?: string;
	previousPage?: string;
	nextPage?: string;
	jumpToPage?: string;
	details?: string;
	columns?: string;
	showAllColumns?: string;
	hideColumn?: string;
	sortPriority?: string;
	clearSort?: string;
}
```

All keys are optional. When using a preset (`'en'`, `'es'`, `'pt'`), all keys are filled. When passing a partial object, it is merged over the English defaults.

---

### LocaleKey

```typescript
type LocaleKey = "en" | "es" | "pt";
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
