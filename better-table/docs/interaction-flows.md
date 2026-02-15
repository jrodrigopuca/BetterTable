# Flujos de Interacción de BetterTable

Diagramas de secuencia y explicación detallada de las interacciones entre componentes.

## 🔄 Flujo General de Renderizado

```mermaid
sequenceDiagram
    participant User
    participant BetterTable
    participant TableProvider
    participant Hooks
    participant Components

    User->>BetterTable: Props (data, columns)
    BetterTable->>TableProvider: Inicializar Context
    TableProvider->>Hooks: Procesar datos
    Hooks->>Hooks: Filter → Search → Sort
    Hooks->>TableProvider: Datos procesados
    TableProvider->>Components: Proveer state
    Components->>User: Render UI
```

---

## 📊 1. Ordenamiento de Columnas

### Flujo de Interacción

```mermaid
sequenceDiagram
    participant User
    participant TableHeaderCell
    participant useTableSort
    participant TableBody

    User->>TableHeaderCell: Click en header
    TableHeaderCell->>useTableSort: handleSort(columnId)

    alt Primera vez
        useTableSort->>useTableSort: Set direction='asc'
    else Segunda vez
        useTableSort->>useTableSort: Set direction='desc'
    else Tercera vez
        useTableSort->>useTableSort: Set direction=null
    end

    useTableSort->>useTableSort: sortData()
    useTableSort->>TableBody: Datos ordenados
    TableBody->>User: Muestra datos ordenados
    TableHeaderCell->>User: Muestra indicador (↑↓)
```

### Código Relevante

```typescript
// En TableHeaderCell
const handleHeaderClick = () => {
	if (column.sortable) {
		handleSort(column.id);
	}
};

// En useTableSort
const handleSort = (columnId: string) => {
	setSortState((prev) => {
		if (prev.column === columnId) {
			// Ciclo: asc → desc → null
			const nextDirection =
				prev.direction === "asc"
					? "desc"
					: prev.direction === "desc"
						? null
						: "asc";

			return {
				column: nextDirection ? columnId : null,
				direction: nextDirection,
			};
		}
		return { column: columnId, direction: "asc" };
	});
};
```

### Estados del Ordenamiento

1. **No ordenado**: `{ column: null, direction: null }`
2. **Ascendente**: `{ column: 'name', direction: 'asc' }` → Icono ↑
3. **Descendente**: `{ column: 'name', direction: 'desc' }` → Icono ↓

---

## 🔍 2. Filtrado por Columna

### Flujo de Interacción

```mermaid
sequenceDiagram
    participant User
    participant TableHeaderCell
    participant useTableFilter
    participant TableBody

    User->>TableHeaderCell: Escribe en input de filtro
    TableHeaderCell->>useTableFilter: setFilter(columnId, value)
    useTableFilter->>useTableFilter: filterData()

    loop Por cada filtro activo
        useTableFilter->>useTableFilter: Aplicar filtro
    end

    useTableFilter->>TableBody: Datos filtrados
    TableBody->>User: Muestra resultados
```

### Tipos de Filtro

#### String (texto)

```typescript
// Input: <input type="text" />
// Lógica: case-insensitive contains
value.toString().toLowerCase().includes(filter.toLowerCase());
```

#### Number

```typescript
// Input: <input type="number" />
// Lógica: exact match
value === Number(filter);
```

#### Boolean

```typescript
// Input: <select>
// Opciones: true | false | all
value === (filter === "true");
```

### Múltiples Filtros

Los filtros se aplican con lógica AND:

```
Row visible = Filter1 AND Filter2 AND Filter3
```

---

## 🔎 3. Búsqueda Global

### Flujo de Interacción

```mermaid
sequenceDiagram
    participant User
    participant TableToolbar
    participant useTableSearch
    participant TableBody

    User->>TableToolbar: Escribe en búsqueda
    TableToolbar->>useTableSearch: handleSearch(value)
    useTableSearch->>useTableSearch: searchData()

    loop Por cada columna searchable
        useTableSearch->>useTableSearch: Buscar en columna
    end

    useTableSearch->>TableBody: Datos con match
    TableBody->>User: Muestra resultados
```

### Comportamiento

```typescript
// Busca en todas las columnas donde searchable !== false
columns
	.filter((col) => col.searchable !== false)
	.some((col) => {
		const value = getValueFromPath(row, col.accessor);
		return value?.toString().toLowerCase().includes(search.toLowerCase());
	});
```

### Búsqueda vs Filtrado

| Feature | Búsqueda Global    | Filtrado          |
| ------- | ------------------ | ----------------- |
| Scope   | Múltiples columnas | Una columna       |
| UI      | Input único        | Input por columna |
| Lógica  | OR entre columnas  | AND entre filtros |
| Case    | Insensitive        | Depende del tipo  |

---

## ✅ 4. Selección de Filas

### Flujo de Interacción (Modo Multiple)

```mermaid
sequenceDiagram
    participant User
    participant TableRow
    participant useTableSelection
    participant TableToolbar

    User->>TableRow: Click checkbox
    TableRow->>useTableSelection: toggleRow(row)
    useTableSelection->>useTableSelection: Actualizar selectedRows[]
    useTableSelection->>TableRow: isSelected = true
    useTableSelection->>TableToolbar: selectedCount actualizado
    TableToolbar->>User: Muestra "3 seleccionados"
```

### Seleccionar Todas

```mermaid
sequenceDiagram
    participant User
    participant TableHeader
    participant useTableSelection
    participant TableBody

    User->>TableHeader: Click "Seleccionar todo"
    TableHeader->>useTableSelection: selectAll()
    useTableSelection->>useTableSelection: selectedRows = allData
    useTableSelection->>TableBody: Todas las rows isSelected=true
    TableBody->>User: Muestra todas seleccionadas
```

### Estados del Checkbox Principal

```typescript
// Ninguno seleccionado
isAllSelected = false;
isPartiallySelected = false;
// → Checkbox: ☐

// Algunos seleccionados
isAllSelected = false;
isPartiallySelected = true;
// → Checkbox: ◫ (indeterminate)

// Todos seleccionados
isAllSelected = true;
isPartiallySelected = false;
// → Checkbox: ☑
```

---

## 🎬 5. Acciones de Fila

### Modo: Callback

```mermaid
sequenceDiagram
    participant User
    participant TableActions
    participant RowAction
    participant ParentComponent

    User->>TableActions: Click "Editar"
    TableActions->>RowAction: onClick(row, index)
    RowAction->>ParentComponent: Ejecuta callback
    ParentComponent->>User: Acción completada
```

### Modo: Modal

```mermaid
sequenceDiagram
    participant User
    participant TableActions
    participant TableModal
    participant ModalContent

    User->>TableActions: Click "Ver detalles"
    TableActions->>TableModal: Abrir modal
    TableModal->>ModalContent: Render con data=row
    ModalContent->>User: Muestra contenido
    User->>TableModal: Click cerrar
    TableModal->>TableActions: onClose()
    TableActions->>User: Modal cerrado
```

### Modo: Link

```mermaid
sequenceDiagram
    participant User
    participant TableActions
    participant Browser

    User->>TableActions: Click "Ver perfil"
    TableActions->>Browser: Navigate to href
    Browser->>User: Nueva página
```

---

## 🌐 6. Acciones Globales

### Con Selección Requerida

```mermaid
sequenceDiagram
    participant User
    participant TableToolbar
    participant GlobalAction
    participant useTableSelection
    participant ParentComponent

    User->>TableToolbar: Click "Eliminar seleccionados"

    alt No hay selección
        TableToolbar->>User: Botón disabled
    else Hay selección
        TableToolbar->>GlobalAction: onClick(selectedRows)
        GlobalAction->>ParentComponent: Procesa acción
        ParentComponent->>useTableSelection: deselectAll()
        useTableSelection->>User: Limpia selección
    end
```

### Sin Selección Requerida

```mermaid
sequenceDiagram
    participant User
    participant TableToolbar
    participant GlobalAction
    participant ParentComponent

    User->>TableToolbar: Click "Exportar todo"
    TableToolbar->>GlobalAction: onClick([], allData)
    GlobalAction->>ParentComponent: Exportar datos
    ParentComponent->>User: Descarga archivo
```

---

## 📄 7. Paginación

### Cambio de Página

```mermaid
sequenceDiagram
    participant User
    participant TablePagination
    participant useTablePagination
    participant TableBody

    User->>TablePagination: Click "Siguiente"
    TablePagination->>useTablePagination: nextPage()
    useTablePagination->>useTablePagination: page = page + 1
    useTablePagination->>useTablePagination: Calcular slice
    useTablePagination->>TableBody: paginatedData
    TableBody->>User: Muestra página 2
```

### Cambio de Tamaño

```mermaid
sequenceDiagram
    participant User
    participant TablePagination
    participant useTablePagination
    participant TableBody

    User->>TablePagination: Selecciona "50 por página"
    TablePagination->>useTablePagination: changePageSize(50)
    useTablePagination->>useTablePagination: pageSize = 50
    useTablePagination->>useTablePagination: page = 1 (reset)
    useTablePagination->>TableBody: paginatedData (50 items)
    TableBody->>User: Muestra más filas
```

### Cálculo de Slice

```typescript
const startIndex = (page - 1) * pageSize;
const endIndex = startIndex + pageSize;
const paginatedData = data.slice(startIndex, endIndex);
```

---

## 🔄 8. Pipeline Completo de Datos

### Procesamiento en Cascada

```mermaid
graph TD
    A[Props: data] --> B[useTableFilter]
    B --> C[Datos filtrados]
    C --> D[useTableSearch]
    D --> E[Datos buscados]
    E --> F[useTableSort]
    F --> G[Datos ordenados]
    G --> H[useTablePagination]
    H --> I[Datos página actual]
    I --> J[TableBody]
    J --> K[Render]
```

### Ejemplo Numérico

```
Original:           100 items
↓ Filtrado:         70 items  (30 no cumplen filtros)
↓ Búsqueda:         50 items  (20 no match búsqueda)
↓ Ordenamiento:     50 items  (mismo conjunto, reordenado)
↓ Paginación:       10 items  (página 1 de 5)
↓ Render:           10 rows visible
```

---

## 🎨 9. Actualización de Props

### Props Controladas

```mermaid
sequenceDiagram
    participant Parent
    participant BetterTable
    participant useTableSort

    Parent->>BetterTable: sortState prop actualizada
    BetterTable->>useTableSort: Nuevo sortState
    useTableSort->>useTableSort: Apply sort
    useTableSort->>Parent: onSort callback
    Parent->>Parent: Actualiza state
```

### Pattern: Controlado vs No Controlado

#### No Controlado (Internal State)

```typescript
<BetterTable
  data={data}
  columns={columns}
  // Estado interno
/>
```

#### Controlado (External State)

```typescript
const [sortState, setSortState] = useState(null);

<BetterTable
  data={data}
  columns={columns}
  sortState={sortState}
  onSort={setSortState}
/>
```

---

## 🧩 10. Context Flow

### Propagación de Estado

```mermaid
graph TD
    A[TableProvider] --> B[useTableContext]
    B --> C[TableHeader]
    B --> D[TableBody]
    B --> E[TablePagination]
    B --> F[TableToolbar]

    C --> G[handleSort]
    D --> H[isSelected]
    E --> I[goToPage]
    F --> J[handleSearch]

    G --> A
    H --> A
    I --> A
    J --> A
```

### Evitando Re-renders

```typescript
// ✅ Bueno: useMemo para valores derivados
const processedData = useMemo(() => {
	let result = data;
	result = filterData(result, filters, columns);
	result = searchData(result, searchValue, columns);
	result = sortData(result, sortState.column, sortState.direction, columns);
	return result;
}, [data, filters, searchValue, sortState, columns]);

// ✅ Bueno: useCallback para funciones
const handleSort = useCallback((columnId: string) => {
	// ...
}, []);
```

---

## ⚡ 11. Eventos de Usuario

### Click en Fila

```mermaid
sequenceDiagram
    participant User
    participant TableRow
    participant BetterTable
    participant Parent

    User->>TableRow: Click en row
    TableRow->>BetterTable: onRowClick check

    alt onRowClick existe
        BetterTable->>Parent: onRowClick(row, index)
        Parent->>Parent: Maneja click
    end
```

### Double Click en Fila

Similar al click, pero con debounce para evitar conflicto:

```typescript
// Timer para distinguir click vs doubleClick
let clickTimer: NodeJS.Timeout;

const handleClick = () => {
	clickTimer = setTimeout(() => {
		onRowClick?.(row, index);
	}, 200);
};

const handleDoubleClick = () => {
	clearTimeout(clickTimer);
	onRowDoubleClick?.(row, index);
};
```

---

## 🔄 12. Ciclo de Vida Completo

### Mount

```mermaid
sequenceDiagram
    participant React
    participant BetterTable
    participant Hooks
    participant Components

    React->>BetterTable: Mount
    BetterTable->>Hooks: Inicializar state
    Hooks->>Hooks: Procesar data inicial
    Hooks->>Components: Render inicial
    Components->>React: Commit render
```

### Update (Props Change)

```mermaid
sequenceDiagram
    participant Parent
    participant BetterTable
    participant Hooks
    participant Components

    Parent->>BetterTable: Nuevas props
    BetterTable->>Hooks: Re-ejecutar con nuevas props
    Hooks->>Hooks: Re-procesar data
    Hooks->>Components: Re-render
    Components->>Parent: UI actualizada
```

### Unmount

```mermaid
sequenceDiagram
    participant React
    participant BetterTable
    participant Hooks

    React->>BetterTable: Unmount
    BetterTable->>Hooks: Cleanup
    Hooks->>Hooks: Clear timers/listeners
    Hooks->>React: Unmounted
```

---

## 📊 Resumen de Interacciones

| Acción del Usuario | Componentes Involucrados | Hooks Usados       | Resultado           |
| ------------------ | ------------------------ | ------------------ | ------------------- |
| Click en header    | TableHeaderCell          | useTableSort       | Datos ordenados     |
| Filtrar columna    | TableHeaderCell          | useTableFilter     | Datos filtrados     |
| Buscar             | TableToolbar             | useTableSearch     | Datos buscados      |
| Seleccionar fila   | TableRow                 | useTableSelection  | Fila seleccionada   |
| Seleccionar todo   | TableHeader              | useTableSelection  | Todas seleccionadas |
| Acción de fila     | TableActions             | -                  | Callback/Modal/Link |
| Acción global      | TableToolbar             | -                  | Procesa selección   |
| Cambiar página     | TablePagination          | useTablePagination | Nueva página        |
| Cambiar pageSize   | TablePagination          | useTablePagination | Más/menos filas     |

---

## 🎯 Best Practices para Interacciones

### 1. Evitar Conflictos

- Click vs DoubleClick: Usar debounce
- Selección vs Acción: Checkbox separado de row click
- Filter vs Sort: Independientes, se acumulan

### 2. Feedback Visual

- Loading states durante procesamiento
- Indicadores activos (selected, sorted, filtered)
- Disabled states cuando no aplicable
- Tooltips para claridad

### 3. Performance

- Memoizar funciones con useCallback
- Memoizar valores derivados con useMemo
- Virtualización para grandes datasets (futuro)
- Debounce en búsqueda/filtrado

### 4. Accesibilidad

- Keyboard navigation
- ARIA labels
- Focus management
- Screen reader support
