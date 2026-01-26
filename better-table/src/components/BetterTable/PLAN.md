# BetterTable v2 - Plan de Desarrollo

## Visión General

Crear un componente de tabla modular, tipado y extensible que forme parte de una biblioteca de componentes React. El componente debe ser independiente, reutilizable y seguir las mejores prácticas de diseño de APIs de componentes.

---

## Análisis del Componente Actual

### ✅ Fortalezas

| Característica | Descripción                                             |
| -------------- | ------------------------------------------------------- |
| Sorting        | Ordenamiento asc/desc por columna                       |
| Filtering      | Filtrado por texto, número y booleano                   |
| Pagination     | Paginación básica                                       |
| Actions        | Acciones personalizables con modales                    |
| Nested Data    | Soporte para rutas anidadas (`attributes.personal.rol`) |
| Custom Cells   | Renderizado personalizado con `cell()`                  |

### ❌ Limitaciones Identificadas

| Área          | Problema                                             |
| ------------- | ---------------------------------------------------- |
| Estado        | `filteredData` no se sincroniza cuando `data` cambia |
| Configuración | `itemsPerPage` hardcoded (10)                        |
| Filtrado      | Solo permite filtrar por UNA columna a la vez        |
| TypeScript    | `Data` es `[key: string]: any` - sin type safety     |
| Rendimiento   | Sin memoización de handlers, re-renders innecesarios |
| UX            | Sin estados de loading, empty, error                 |
| Accesibilidad | Sin atributos ARIA ni navegación por teclado         |
| Estilos       | CSS global puede colisionar, sin theming             |

---

## Arquitectura Propuesta

### Estructura de Archivos

```
BetterTable/
├── index.ts                      # Exports públicos de la biblioteca
├── types.ts                      # Tipos e interfaces TypeScript
│
├── hooks/
│   ├── index.ts                  # Re-exports de hooks
│   ├── useTableSort.ts           # Lógica de ordenamiento
│   ├── useTableFilter.ts         # Lógica de filtrado por columna
│   ├── useTableSearch.ts         # Búsqueda global
│   ├── useTablePagination.ts     # Lógica de paginación
│   └── useTableSelection.ts      # Selección de filas
│
├── context/
│   └── TableContext.tsx          # Estado compartido entre subcomponentes
│
├── components/
│   ├── Table.tsx                 # Componente principal (orquestador)
│   ├── TableToolbar.tsx          # Búsqueda global + acciones globales
│   ├── TableHeader.tsx           # Cabecera con sorting
│   ├── TableHeaderCell.tsx       # Celda de cabecera individual
│   ├── TableBody.tsx             # Cuerpo de la tabla
│   ├── TableRow.tsx              # Fila individual
│   ├── TableCell.tsx             # Celda con render condicional
│   ├── TablePagination.tsx       # Controles de paginación
│   ├── TableEmpty.tsx            # Estado vacío
│   ├── TableLoading.tsx          # Estado de carga
│   └── TableActions.tsx          # Acciones de fila
│
├── styles/
│   ├── variables.css             # Variables CSS para theming
│   ├── table.module.css          # Estilos principales (CSS Modules)
│   ├── toolbar.module.css        # Estilos del toolbar
│   ├── pagination.module.css     # Estilos de paginación
│   └── modal.module.css          # Estilos del modal
│
└── utils/
    ├── getValueFromPath.ts       # Acceso a propiedades anidadas
    ├── filterData.ts             # Utilidades de filtrado
    └── sortData.ts               # Utilidades de ordenamiento
```

---

## Sistema de Tipos

### Tipos Genéricos con Type Safety

```typescript
// types.ts

import { ReactNode, CSSProperties } from "react";

/**
 * Tipo base para los datos de la tabla
 * Permite extensión con tipos específicos del usuario
 */
export type TableData = Record<string, unknown>;

/**
 * Configuración de columna con tipado genérico
 */
export interface Column<T extends TableData = TableData> {
	/** Identificador único de la columna */
	id: string;
	/** Key para acceder al dato (soporta dot notation: 'user.profile.name') */
	accessor: keyof T | string;
	/** Texto visible en el header */
	header: string;
	/** Tipo de dato para filtrado y renderizado */
	type?: "string" | "number" | "boolean" | "date" | "custom";
	/** Render personalizado de celda */
	cell?: (value: unknown, row: T, rowIndex: number) => ReactNode;
	/** Render personalizado de header */
	headerCell?: (column: Column<T>) => ReactNode;
	/** ¿Columna ordenable? */
	sortable?: boolean;
	/** ¿Columna filtrable? */
	filterable?: boolean;
	/** Ancho de columna */
	width?: string | number;
	/** Alineación del contenido */
	align?: "left" | "center" | "right";
	/** Columna oculta */
	hidden?: boolean;
}

/**
 * Acción de fila individual
 */
export interface RowAction<T extends TableData = TableData> {
	/** Identificador único */
	id: string;
	/** Etiqueta de la acción */
	label: string;
	/** Icono (string, emoji, o componente) */
	icon?: ReactNode;
	/** Modo de ejecución */
	mode: "callback" | "modal" | "link";
	/** Callback cuando mode='callback' */
	onClick?: (row: T, rowIndex: number) => void;
	/** Componente para modal cuando mode='modal' */
	modalContent?: React.ComponentType<{ data: T; onClose: () => void }>;
	/** URL cuando mode='link' */
	href?: string | ((row: T) => string);
	/** ¿Mostrar acción condicionalmente? */
	visible?: (row: T) => boolean;
	/** ¿Deshabilitar acción condicionalmente? */
	disabled?: (row: T) => boolean;
	/** Variante visual */
	variant?: "default" | "primary" | "danger" | "ghost";
}

/**
 * Acción global (toolbar)
 */
export interface GlobalAction<T extends TableData = TableData> {
	/** Identificador único */
	id: string;
	/** Etiqueta del botón */
	label: string;
	/** Icono */
	icon?: ReactNode;
	/** Callback de ejecución */
	onClick: (selectedRows: T[], allData: T[]) => void;
	/** ¿Requiere selección de filas? */
	requiresSelection?: boolean;
	/** Variante visual */
	variant?: "default" | "primary" | "danger";
}

/**
 * Configuración de paginación
 */
export interface PaginationConfig {
	/** Página actual (controlado) */
	page?: number;
	/** Items por página */
	pageSize?: number;
	/** Opciones de tamaño de página */
	pageSizeOptions?: number[];
	/** Total de items (para paginación del servidor) */
	totalItems?: number;
	/** Mostrar selector de tamaño de página */
	showSizeChanger?: boolean;
	/** Mostrar salto a página */
	showQuickJumper?: boolean;
}

/**
 * Estado de ordenamiento
 */
export interface SortState {
	columnId: string | null;
	direction: "asc" | "desc";
}

/**
 * Estado de filtros
 */
export interface FilterState {
	[columnId: string]: string | number | boolean | null;
}

/**
 * Personalización de estilos
 */
export interface TableStyles {
	/** Clase CSS del contenedor */
	container?: string;
	/** Clase CSS de la tabla */
	table?: string;
	/** Clase CSS del header */
	header?: string;
	/** Clase CSS del body */
	body?: string;
	/** Clase CSS de filas */
	row?: string;
	/** Clase CSS de celdas */
	cell?: string;
	/** Clase CSS de la paginación */
	pagination?: string;
	/** Clase CSS del toolbar */
	toolbar?: string;
}

/**
 * Textos personalizables (i18n)
 */
export interface TableLocale {
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
	selectAll?: string;
	deselectAll?: string;
}

/**
 * Props principales del componente BetterTable
 */
export interface BetterTableProps<T extends TableData = TableData> {
	// === Datos ===
	/** Array de datos a mostrar */
	data: T[];
	/** Configuración de columnas */
	columns: Column<T>[];
	/** Key único para identificar filas (default: 'id') */
	rowKey?: keyof T | ((row: T, index: number) => string);

	// === Acciones ===
	/** Acciones por fila */
	rowActions?: RowAction<T>[];
	/** Acciones globales (toolbar) */
	globalActions?: GlobalAction<T>[];

	// === Paginación ===
	/** Configuración de paginación (false para desactivar) */
	pagination?: PaginationConfig | false;
	/** Callback de cambio de página */
	onPageChange?: (page: number, pageSize: number) => void;

	// === Ordenamiento ===
	/** Estado de ordenamiento (controlado) */
	sort?: SortState;
	/** Callback de cambio de ordenamiento */
	onSortChange?: (sort: SortState) => void;

	// === Filtrado ===
	/** Estado de filtros (controlado) */
	filters?: FilterState;
	/** Callback de cambio de filtros */
	onFilterChange?: (filters: FilterState) => void;

	// === Búsqueda Global ===
	/** Mostrar barra de búsqueda */
	searchable?: boolean;
	/** Valor de búsqueda (controlado) */
	searchValue?: string;
	/** Callback de cambio de búsqueda */
	onSearchChange?: (value: string) => void;
	/** Columnas en las que buscar (default: todas) */
	searchColumns?: string[];

	// === Selección ===
	/** Habilitar selección de filas */
	selectable?: boolean;
	/** Filas seleccionadas (controlado) */
	selectedRows?: T[];
	/** Callback de cambio de selección */
	onSelectionChange?: (selectedRows: T[]) => void;
	/** Modo de selección */
	selectionMode?: "single" | "multiple";

	// === Estados ===
	/** Estado de carga */
	loading?: boolean;
	/** Componente de loading personalizado */
	loadingComponent?: ReactNode;
	/** Componente de estado vacío personalizado */
	emptyComponent?: ReactNode;

	// === Personalización ===
	/** Clases CSS personalizadas */
	classNames?: TableStyles;
	/** Estilos inline personalizados */
	styles?: {
		container?: CSSProperties;
		table?: CSSProperties;
		header?: CSSProperties;
		body?: CSSProperties;
		row?: CSSProperties;
		cell?: CSSProperties;
	};
	/** Textos personalizados */
	locale?: TableLocale;

	// === Características ===
	/** Header fijo al hacer scroll */
	stickyHeader?: boolean;
	/** Altura máxima (activa scroll interno) */
	maxHeight?: string | number;
	/** Mostrar bordes */
	bordered?: boolean;
	/** Filas con rayas alternas */
	striped?: boolean;
	/** Hover en filas */
	hoverable?: boolean;
	/** Tamaño de la tabla */
	size?: "small" | "medium" | "large";

	// === Callbacks ===
	/** Callback al hacer click en una fila */
	onRowClick?: (row: T, rowIndex: number) => void;
	/** Callback al hacer doble click en una fila */
	onRowDoubleClick?: (row: T, rowIndex: number) => void;

	// === Accesibilidad ===
	/** Descripción de la tabla para screen readers */
	ariaLabel?: string;
	/** ID del elemento que describe la tabla */
	ariaDescribedBy?: string;
}
```

---

## Hooks Personalizados

### useTableSort

```typescript
// hooks/useTableSort.ts

import { useState, useCallback, useMemo } from "react";
import { SortState, TableData } from "../types";
import { sortData } from "../utils/sortData";

interface UseTableSortOptions<T extends TableData> {
	data: T[];
	initialSort?: SortState;
	onSortChange?: (sort: SortState) => void;
}

interface UseTableSortReturn<T extends TableData> {
	sortedData: T[];
	sortState: SortState;
	handleSort: (columnId: string) => void;
	clearSort: () => void;
}

export function useTableSort<T extends TableData>({
	data,
	initialSort,
	onSortChange,
}: UseTableSortOptions<T>): UseTableSortReturn<T> {
	const [sortState, setSortState] = useState<SortState>(
		initialSort ?? { columnId: null, direction: "asc" },
	);

	const handleSort = useCallback(
		(columnId: string) => {
			setSortState((prev) => {
				const newState: SortState = {
					columnId,
					direction:
						prev.columnId === columnId && prev.direction === "asc"
							? "desc"
							: "asc",
				};
				onSortChange?.(newState);
				return newState;
			});
		},
		[onSortChange],
	);

	const clearSort = useCallback(() => {
		const newState = { columnId: null, direction: "asc" as const };
		setSortState(newState);
		onSortChange?.(newState);
	}, [onSortChange]);

	const sortedData = useMemo(() => {
		if (!sortState.columnId) return data;
		return sortData(data, sortState.columnId, sortState.direction);
	}, [data, sortState]);

	return { sortedData, sortState, handleSort, clearSort };
}
```

### useTableFilter

```typescript
// hooks/useTableFilter.ts

import { useState, useCallback, useMemo } from "react";
import { FilterState, TableData, Column } from "../types";
import { filterData } from "../utils/filterData";

interface UseTableFilterOptions<T extends TableData> {
	data: T[];
	columns: Column<T>[];
	initialFilters?: FilterState;
	onFilterChange?: (filters: FilterState) => void;
}

export function useTableFilter<T extends TableData>({
	data,
	columns,
	initialFilters,
	onFilterChange,
}: UseTableFilterOptions<T>) {
	const [filters, setFilters] = useState<FilterState>(initialFilters ?? {});

	const setFilter = useCallback(
		(columnId: string, value: string | number | boolean | null) => {
			setFilters((prev) => {
				const newFilters = { ...prev, [columnId]: value };
				onFilterChange?.(newFilters);
				return newFilters;
			});
		},
		[onFilterChange],
	);

	const clearFilters = useCallback(() => {
		setFilters({});
		onFilterChange?.({});
	}, [onFilterChange]);

	const filteredData = useMemo(() => {
		return filterData(data, filters, columns);
	}, [data, filters, columns]);

	return { filteredData, filters, setFilter, clearFilters };
}
```

### useTablePagination

```typescript
// hooks/useTablePagination.ts

import { useState, useCallback, useMemo } from "react";
import { PaginationConfig, TableData } from "../types";

interface UseTablePaginationOptions<T extends TableData> {
	data: T[];
	config?: PaginationConfig | false;
	onPageChange?: (page: number, pageSize: number) => void;
}

export function useTablePagination<T extends TableData>({
	data,
	config,
	onPageChange,
}: UseTablePaginationOptions<T>) {
	const enabled = config !== false;
	const initialPage =
		config && typeof config === "object" ? (config.page ?? 1) : 1;
	const initialPageSize =
		config && typeof config === "object" ? (config.pageSize ?? 10) : 10;

	const [page, setPage] = useState(initialPage);
	const [pageSize, setPageSize] = useState(initialPageSize);

	const totalItems =
		config && typeof config === "object" && config.totalItems
			? config.totalItems
			: data.length;

	const totalPages = Math.ceil(totalItems / pageSize);

	const goToPage = useCallback(
		(newPage: number) => {
			const validPage = Math.max(1, Math.min(newPage, totalPages));
			setPage(validPage);
			onPageChange?.(validPage, pageSize);
		},
		[totalPages, pageSize, onPageChange],
	);

	const changePageSize = useCallback(
		(newSize: number) => {
			setPageSize(newSize);
			setPage(1);
			onPageChange?.(1, newSize);
		},
		[onPageChange],
	);

	const paginatedData = useMemo(() => {
		if (!enabled) return data;
		const start = (page - 1) * pageSize;
		return data.slice(start, start + pageSize);
	}, [data, page, pageSize, enabled]);

	return {
		paginatedData,
		page,
		pageSize,
		totalPages,
		totalItems,
		goToPage,
		changePageSize,
		hasNextPage: page < totalPages,
		hasPrevPage: page > 1,
	};
}
```

### useTableSelection

```typescript
// hooks/useTableSelection.ts

import { useState, useCallback } from "react";
import { TableData } from "../types";

interface UseTableSelectionOptions<T extends TableData> {
	data: T[];
	rowKey: keyof T | ((row: T, index: number) => string);
	mode?: "single" | "multiple";
	initialSelection?: T[];
	onSelectionChange?: (selectedRows: T[]) => void;
}

export function useTableSelection<T extends TableData>({
	data,
	rowKey,
	mode = "multiple",
	initialSelection,
	onSelectionChange,
}: UseTableSelectionOptions<T>) {
	const [selectedRows, setSelectedRows] = useState<T[]>(initialSelection ?? []);

	const getRowKey = useCallback(
		(row: T, index: number): string => {
			if (typeof rowKey === "function") return rowKey(row, index);
			return String(row[rowKey]);
		},
		[rowKey],
	);

	const isSelected = useCallback(
		(row: T, index: number): boolean => {
			const key = getRowKey(row, index);
			return selectedRows.some((r, i) => getRowKey(r, i) === key);
		},
		[selectedRows, getRowKey],
	);

	const toggleRow = useCallback(
		(row: T, index: number) => {
			setSelectedRows((prev) => {
				let newSelection: T[];

				if (mode === "single") {
					newSelection = isSelected(row, index) ? [] : [row];
				} else {
					newSelection = isSelected(row, index)
						? prev.filter((r, i) => getRowKey(r, i) !== getRowKey(row, index))
						: [...prev, row];
				}

				onSelectionChange?.(newSelection);
				return newSelection;
			});
		},
		[mode, isSelected, getRowKey, onSelectionChange],
	);

	const selectAll = useCallback(() => {
		setSelectedRows(data);
		onSelectionChange?.(data);
	}, [data, onSelectionChange]);

	const deselectAll = useCallback(() => {
		setSelectedRows([]);
		onSelectionChange?.([]);
	}, [onSelectionChange]);

	const isAllSelected = selectedRows.length === data.length && data.length > 0;
	const isPartiallySelected =
		selectedRows.length > 0 && selectedRows.length < data.length;

	return {
		selectedRows,
		isSelected,
		toggleRow,
		selectAll,
		deselectAll,
		isAllSelected,
		isPartiallySelected,
	};
}
```

### useTableSearch

```typescript
// hooks/useTableSearch.ts

import { useState, useCallback, useMemo } from "react";
import { TableData, Column } from "../types";
import { getValueFromPath } from "../utils/getValueFromPath";

interface UseTableSearchOptions<T extends TableData> {
	data: T[];
	columns: Column<T>[];
	searchColumns?: string[];
	initialValue?: string;
	onSearchChange?: (value: string) => void;
}

export function useTableSearch<T extends TableData>({
	data,
	columns,
	searchColumns,
	initialValue,
	onSearchChange,
}: UseTableSearchOptions<T>) {
	const [searchValue, setSearchValue] = useState(initialValue ?? "");

	const handleSearch = useCallback(
		(value: string) => {
			setSearchValue(value);
			onSearchChange?.(value);
		},
		[onSearchChange],
	);

	const clearSearch = useCallback(() => {
		setSearchValue("");
		onSearchChange?.("");
	}, [onSearchChange]);

	const searchedData = useMemo(() => {
		if (!searchValue.trim()) return data;

		const searchLower = searchValue.toLowerCase();
		const columnsToSearch = searchColumns
			? columns.filter((col) => searchColumns.includes(col.id))
			: columns.filter((col) => col.type !== "custom");

		return data.filter((row) =>
			columnsToSearch.some((col) => {
				const value = getValueFromPath(row, String(col.accessor));
				if (value == null) return false;
				return String(value).toLowerCase().includes(searchLower);
			}),
		);
	}, [data, searchValue, columns, searchColumns]);

	return { searchedData, searchValue, handleSearch, clearSearch };
}
```

---

## Contexto de Tabla

```typescript
// context/TableContext.tsx

import { createContext, useContext, ReactNode } from 'react';
import { TableData, Column, SortState, FilterState, TableLocale, TableStyles } from '../types';

interface TableContextValue<T extends TableData = TableData> {
  // Data
  data: T[];
  columns: Column<T>[];

  // Sort
  sortState: SortState;
  handleSort: (columnId: string) => void;

  // Filter
  filters: FilterState;
  setFilter: (columnId: string, value: unknown) => void;
  clearFilters: () => void;

  // Selection
  selectedRows: T[];
  isSelected: (row: T, index: number) => boolean;
  toggleRow: (row: T, index: number) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isAllSelected: boolean;
  isPartiallySelected: boolean;

  // Pagination
  page: number;
  pageSize: number;
  totalPages: number;
  goToPage: (page: number) => void;

  // UI
  loading: boolean;
  locale: TableLocale;
  classNames: TableStyles;
}

const TableContext = createContext<TableContextValue | null>(null);

export function useTableContext<T extends TableData>() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context as TableContextValue<T>;
}

interface TableProviderProps<T extends TableData> {
  value: TableContextValue<T>;
  children: ReactNode;
}

export function TableProvider<T extends TableData>({
  value,
  children,
}: TableProviderProps<T>) {
  return (
    <TableContext.Provider value={value as TableContextValue}>
      {children}
    </TableContext.Provider>
  );
}
```

---

## Variables CSS para Theming

```css
/* styles/variables.css */

:root {
	/* Colores primarios */
	--bt-color-primary: #3b82f6;
	--bt-color-primary-hover: #2563eb;
	--bt-color-primary-light: #eff6ff;

	/* Colores de estado */
	--bt-color-success: #22c55e;
	--bt-color-danger: #ef4444;
	--bt-color-warning: #f59e0b;
	--bt-color-info: #06b6d4;

	/* Colores neutrales */
	--bt-color-text: #1f2937;
	--bt-color-text-secondary: #6b7280;
	--bt-color-text-disabled: #9ca3af;
	--bt-color-border: #e5e7eb;
	--bt-color-border-hover: #d1d5db;
	--bt-color-background: #ffffff;
	--bt-color-background-hover: #f9fafb;
	--bt-color-background-striped: #f3f4f6;
	--bt-color-background-selected: #eff6ff;

	/* Espaciado */
	--bt-spacing-xs: 0.25rem;
	--bt-spacing-sm: 0.5rem;
	--bt-spacing-md: 0.75rem;
	--bt-spacing-lg: 1rem;
	--bt-spacing-xl: 1.5rem;

	/* Tipografía */
	--bt-font-family: system-ui, -apple-system, sans-serif;
	--bt-font-size-sm: 0.875rem;
	--bt-font-size-md: 1rem;
	--bt-font-size-lg: 1.125rem;
	--bt-font-weight-normal: 400;
	--bt-font-weight-medium: 500;
	--bt-font-weight-semibold: 600;

	/* Bordes */
	--bt-border-radius-sm: 0.25rem;
	--bt-border-radius-md: 0.375rem;
	--bt-border-radius-lg: 0.5rem;
	--bt-border-width: 1px;

	/* Sombras */
	--bt-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	--bt-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);

	/* Transiciones */
	--bt-transition-fast: 150ms ease;
	--bt-transition-normal: 200ms ease;

	/* Tamaños de tabla */
	--bt-cell-padding-sm: 0.5rem 0.75rem;
	--bt-cell-padding-md: 0.75rem 1rem;
	--bt-cell-padding-lg: 1rem 1.25rem;
}

/* Dark mode */
[data-theme="dark"] {
	--bt-color-text: #f9fafb;
	--bt-color-text-secondary: #9ca3af;
	--bt-color-border: #374151;
	--bt-color-background: #1f2937;
	--bt-color-background-hover: #374151;
	--bt-color-background-striped: #111827;
	--bt-color-background-selected: #1e3a5f;
}
```

---

## Fases de Implementación

### Fase 1: Fundamentos (Semana 1)

- [ ] Crear estructura de archivos
- [ ] Definir tipos en `types.ts`
- [ ] Implementar utilidades (`getValueFromPath`, `sortData`, `filterData`)
- [ ] Crear hooks básicos (`useTableSort`, `useTableFilter`, `useTablePagination`)
- [ ] Configurar variables CSS

### Fase 2: Componentes Core (Semana 2)

- [ ] Implementar `TableContext`
- [ ] Crear componente `Table.tsx` principal
- [ ] Implementar `TableHeader` y `TableHeaderCell`
- [ ] Implementar `TableBody`, `TableRow`, `TableCell`
- [ ] Implementar `TablePagination`
- [ ] Crear estados `TableEmpty` y `TableLoading`

### Fase 3: Características Avanzadas (Semana 3)

- [ ] Implementar `useTableSearch` y búsqueda global
- [ ] Implementar `useTableSelection` y checkboxes
- [ ] Crear `TableToolbar` con acciones globales
- [ ] Implementar `TableActions` con soporte modal/callback/link
- [ ] Agregar soporte para modo controlado/no controlado

### Fase 4: Polish y Documentación (Semana 4)

- [ ] Agregar atributos de accesibilidad (ARIA)
- [ ] Implementar navegación por teclado
- [ ] Crear estilos para todos los tamaños y variantes
- [ ] Agregar soporte para dark mode
- [ ] Escribir tests unitarios
- [ ] Documentar API y ejemplos de uso

---

## Ejemplo de Uso Final

```tsx
import {
	BetterTable,
	Column,
	RowAction,
	GlobalAction,
} from "@mylib/better-table";

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	isActive: boolean;
	createdAt: Date;
}

const columns: Column<User>[] = [
	{
		id: "name",
		accessor: "name",
		header: "Nombre",
		sortable: true,
		filterable: true,
	},
	{ id: "email", accessor: "email", header: "Email", sortable: true },
	{ id: "role", accessor: "role", header: "Rol", filterable: true },
	{
		id: "status",
		accessor: "isActive",
		header: "Estado",
		type: "boolean",
		cell: (value) => (
			<span className={value ? "badge-success" : "badge-inactive"}>
				{value ? "Activo" : "Inactivo"}
			</span>
		),
	},
	{
		id: "createdAt",
		accessor: "createdAt",
		header: "Fecha de Registro",
		type: "date",
		cell: (value) => new Date(value as Date).toLocaleDateString(),
	},
];

const rowActions: RowAction<User>[] = [
	{
		id: "edit",
		label: "Editar",
		icon: "✏️",
		mode: "modal",
		modalContent: EditUserModal,
	},
	{
		id: "delete",
		label: "Eliminar",
		icon: "🗑️",
		mode: "callback",
		variant: "danger",
		onClick: (user) => handleDelete(user.id),
	},
];

const globalActions: GlobalAction<User>[] = [
	{
		id: "export",
		label: "Exportar CSV",
		icon: "📥",
		onClick: (_, allData) => exportToCSV(allData),
	},
	{
		id: "bulkDelete",
		label: "Eliminar Seleccionados",
		icon: "🗑️",
		variant: "danger",
		requiresSelection: true,
		onClick: (selected) => handleBulkDelete(selected),
	},
];

function UsersTable() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	return (
		<BetterTable<User>
			data={users}
			columns={columns}
			rowKey="id"
			rowActions={rowActions}
			globalActions={globalActions}
			// Paginación
			pagination={{ pageSize: 20, showSizeChanger: true }}
			// Búsqueda
			searchable
			searchColumns={["name", "email"]}
			// Selección
			selectable
			selectionMode="multiple"
			onSelectionChange={(selected) => console.log("Selected:", selected)}
			// Estados
			loading={loading}
			emptyComponent={<EmptyState message="No hay usuarios" />}
			// Estilos
			striped
			hoverable
			bordered
			stickyHeader
			size="medium"
			// Callbacks
			onRowClick={(user) => console.log("Clicked:", user)}
			// Accesibilidad
			ariaLabel="Tabla de usuarios del sistema"
		/>
	);
}
```

---

## Consideraciones para Biblioteca

### Exports Públicos

```typescript
// index.ts

// Componente principal
export { default as BetterTable } from "./components/Table";

// Tipos
export type {
	BetterTableProps,
	Column,
	RowAction,
	GlobalAction,
	PaginationConfig,
	SortState,
	FilterState,
	TableStyles,
	TableLocale,
	TableData,
} from "./types";

// Hooks (para uso avanzado)
export { useTableSort } from "./hooks/useTableSort";
export { useTableFilter } from "./hooks/useTableFilter";
export { useTablePagination } from "./hooks/useTablePagination";
export { useTableSelection } from "./hooks/useTableSelection";
export { useTableSearch } from "./hooks/useTableSearch";

// Contexto (para componentes personalizados)
export { useTableContext, TableProvider } from "./context/TableContext";

// Utilidades
export { getValueFromPath } from "./utils/getValueFromPath";
```

### Package.json de la Biblioteca

```json
{
	"name": "@mylib/better-table",
	"version": "2.0.0",
	"main": "dist/index.js",
	"module": "dist/index.esm.js",
	"types": "dist/index.d.ts",
	"exports": {
		".": {
			"import": "./dist/index.esm.js",
			"require": "./dist/index.js",
			"types": "./dist/index.d.ts"
		},
		"./styles": "./dist/styles/index.css"
	},
	"sideEffects": ["*.css"],
	"peerDependencies": {
		"react": "^18.0.0 || ^19.0.0",
		"react-dom": "^18.0.0 || ^19.0.0"
	},
	"files": ["dist", "README.md"]
}
```

---

## Métricas de Éxito

| Métrica                   | Objetivo       |
| ------------------------- | -------------- |
| Bundle size               | < 15KB gzipped |
| Lighthouse Accessibility  | 100            |
| Test coverage             | > 90%          |
| TypeScript strict mode    | ✅             |
| Zero runtime dependencies | ✅             |
| Tree-shakeable            | ✅             |
