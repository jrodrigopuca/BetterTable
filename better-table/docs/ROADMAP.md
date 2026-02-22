# BetterTable - Roadmap de Mejoras

> Documento de mejoras propuestas basadas en casos de uso reales (demo de inventario).

---

## 🎯 Alta Prioridad

### 1. Edición Inline

**Problema**: Actualmente hay que abrir un modal para editar cualquier valor.

**Solución**: Permitir edición directa en la celda con doble click o tecla Enter.

```tsx
const columns: Column<Product>[] = [
	{
		id: "price",
		accessor: "price",
		header: "Precio",
		editable: true,
		onEdit: (row, newValue) => updateProduct(row.id, { price: newValue }),
		// Opcional: validación
		validate: (value) => value > 0 || "El precio debe ser positivo",
	},
];
```

**Componentes a crear**:

- `EditableCell.tsx` - Celda con modo edición
- Hook `useInlineEdit` - Lógica de edición

**Estimación**: 4-6 horas

---

### 2. Confirmación Integrada

**Problema**: Se usa `confirm()` nativo del browser, que es feo y no personalizable.

**Solución**: Sistema de confirmación integrado en acciones.

```tsx
const rowActions: RowAction<Product>[] = [
	{
		id: "delete",
		label: "Eliminar",
		icon: "🗑️",
		mode: "callback",
		variant: "danger",
		// Nueva prop
		confirm: {
			title: "¿Eliminar producto?",
			message: (row) => `Se eliminará "${row.name}" permanentemente.`,
			confirmLabel: "Eliminar",
			cancelLabel: "Cancelar",
			variant: "danger",
		},
		onClick: (row) => deleteProduct(row.id),
	},
];
```

**Componentes a crear**:

- `ConfirmDialog.tsx` - Modal de confirmación reutilizable

**Estimación**: 2-3 horas

---

### 3. Formatters Built-in

**Problema**: El usuario debe formatear manualmente valores comunes (moneda, fechas, etc.).

**Solución**: Tipos de columna con formateo automático.

```tsx
const columns: Column<Product>[] = [
	{
		id: "price",
		accessor: "price",
		header: "Precio",
		type: "currency",
		typeOptions: {
			locale: "es-MX",
			currency: "MXN",
			minimumFractionDigits: 2,
		},
	},
	{
		id: "createdAt",
		accessor: "createdAt",
		header: "Fecha",
		type: "date",
		typeOptions: {
			format: "DD/MM/YYYY",
			// o usar Intl
			locale: "es-MX",
			dateStyle: "medium",
		},
	},
	{
		id: "size",
		accessor: "fileSize",
		header: "Tamaño",
		type: "bytes", // Formatea a KB, MB, GB automáticamente
	},
];
```

**Formatters a implementar**:

- `currency` - Formato de moneda
- `date` - Formato de fecha
- `datetime` - Fecha y hora
- `number` - Números con separadores
- `percent` - Porcentajes
- `bytes` - Tamaño de archivos

**Archivos a crear**:

- `utils/formatters.ts` - Funciones de formateo
- Extender `types.ts` con nuevos tipos

**Estimación**: 3-4 horas

---

### 4. Status Badges / Tags

**Problema**: Mostrar estados visualmente requiere código custom en cada proyecto.

**Solución**: Sistema de badges integrado.

```tsx
const columns: Column<Product>[] = [
	{
		id: "stock",
		accessor: "stock",
		header: "Stock",
		type: "status",
		statusConfig: {
			// Por valor exacto
			0: { label: "Sin stock", color: "red", icon: "⛔" },
			// Por rango (evaluado en orden)
			ranges: [
				{ max: 10, label: "Bajo", color: "yellow", icon: "⚠️" },
				{ min: 10, label: "OK", color: "green", icon: "✅" },
			],
		},
	},
	{
		id: "status",
		accessor: "status",
		header: "Estado",
		type: "badge",
		badgeConfig: {
			active: { label: "Activo", color: "green" },
			pending: { label: "Pendiente", color: "yellow" },
			inactive: { label: "Inactivo", color: "gray" },
		},
	},
];
```

**Componentes a crear**:

- `StatusBadge.tsx` - Componente de badge
- CSS para badges con colores predefinidos

**Estimación**: 2-3 horas

---

## 🔧 Funcionalidad Avanzada

### 5. Column Visibility Toggle — ✅ IMPLEMENTADO

**Problema**: En móvil o con muchas columnas, el usuario no puede elegir qué ver.

**Solución**: Botón para mostrar/ocultar columnas.

```tsx
<BetterTable
	data={products}
	columns={columns}
	columnVisibility // Habilita dropdown de visibilidad en toolbar
	hiddenColumns={["sku", "createdAt"]} // Ocultas por defecto
	onColumnVisibilityChange={(hidden) => setHidden(hidden)}
/>
```

**UI**: Dropdown multiselect en toolbar con checkbox por columna y botón "Show all".

**Implementado en:** v1.2.0

---

### 6. Bulk Edit (Edición Masiva)

**Problema**: Para cambiar el mismo valor en múltiples filas hay que hacerlo una por una.

**Solución**: Acción global para editar seleccionados.

```tsx
const globalActions: GlobalAction<Product>[] = [
	{
		id: "bulkEdit",
		label: "Editar seleccionados",
		icon: "✏️",
		requiresSelection: true,
		mode: "modal",
		modalContent: BulkEditModal, // Componente custom
		onSubmit: (selected, changes) => {
			// changes = { category: "Electronics", isAvailable: true }
			return bulkUpdateProducts(
				selected.map((p) => p.id),
				changes,
			);
		},
	},
];
```

**Estimación**: 4-5 horas

---

### 7. Row Drag & Drop

**Problema**: No se puede reordenar filas manualmente.

**Solución**: Drag and drop con handle.

```tsx
<BetterTable
	data={products}
	columns={columns}
	draggable={{
		enabled: true,
		handle: true, // Mostrar handle de drag
		onReorder: (newOrder) => saveOrder(newOrder),
	}}
/>
```

**Dependencias**: Considerar `@dnd-kit/core` o implementación nativa.

**Estimación**: 6-8 horas

---

### 8. Column Resize

**Problema**: Columnas tienen ancho fijo o automático, no ajustable por usuario.

**Solución**: Permitir resize arrastrando borde de header.

```tsx
<BetterTable
	data={products}
	columns={columns}
	resizable={{
		enabled: true,
		minWidth: 100,
		persist: "localStorage",
	}}
/>
```

**Estimación**: 4-5 horas

---

## 📊 Mejoras de UX

### 9. Toast/Notifications Integradas

**Problema**: Feedback de acciones depende de implementación externa.

**Solución**: Sistema de notificaciones ligero incluido.

```tsx
<BetterTable
	data={products}
	columns={columns}
	notifications={{
		enabled: true,
		position: "bottom-right",
		messages: {
			onDelete: "Producto eliminado",
			onAdd: "Producto agregado",
			onEdit: "Cambios guardados",
		},
	}}
/>
```

**Componentes a crear**:

- `Toast.tsx` - Componente de notificación
- `ToastContainer.tsx` - Contenedor con posicionamiento
- Hook `useToast` - API para mostrar toasts

**Estimación**: 3-4 horas

---

### 10. Empty States Contextuales

**Problema**: Un solo mensaje para todos los estados vacíos.

**Solución**: Estados vacíos diferenciados.

```tsx
<BetterTable
	data={products}
	columns={columns}
	emptyStates={{
		noData: {
			icon: "📦",
			title: "Sin productos",
			description: "Agrega tu primer producto",
			action: { label: "Agregar", onClick: openAddModal },
		},
		noResults: {
			icon: "🔍",
			title: "Sin resultados",
			description: "Intenta con otros términos de búsqueda",
			action: { label: "Limpiar filtros", onClick: clearFilters },
		},
		error: {
			icon: "⚠️",
			title: "Error al cargar",
			description: "No se pudieron cargar los datos",
			action: { label: "Reintentar", onClick: reload },
		},
	}}
/>
```

**Estimación**: 2-3 horas

---

### 11. Skeleton Loading

**Problema**: Loading spinner genérico no muestra estructura.

**Solución**: Skeleton que imita la estructura de la tabla.

```tsx
<BetterTable
	data={products}
	columns={columns}
	loading={isLoading}
	loadingMode="skeleton" // "spinner" | "skeleton" | "overlay"
	skeletonRows={5} // Número de filas skeleton
/>
```

**Componentes a crear**:

- `TableSkeleton.tsx` - Rows con animación skeleton

**Estimación**: 2 horas

---

### 12. Keyboard Navigation Mejorada

**Problema**: Navegación con teclado limitada.

**Solución**: Atajos de teclado completos.

| Tecla    | Acción                                 |
| -------- | -------------------------------------- |
| `↑/↓`    | Navegar entre filas                    |
| `Enter`  | Seleccionar/abrir fila                 |
| `Space`  | Toggle checkbox                        |
| `Escape` | Deseleccionar todo                     |
| `/`      | Enfocar búsqueda                       |
| `Delete` | Eliminar seleccionados (si hay acción) |
| `Ctrl+A` | Seleccionar todo                       |

```tsx
<BetterTable
	data={products}
	columns={columns}
	keyboard={{
		enabled: true,
		deleteKey: true, // Delete activa acción de eliminar
		shortcuts: {
			selectAll: "ctrl+a",
			search: "/",
		},
	}}
/>
```

**Estimación**: 4-5 horas

---

## 📋 Priorización Sugerida

### Fase 1 - Quick Wins (1-2 semanas)

1. ✅ Confirmación integrada
2. ✅ Formatters built-in
3. ✅ Status badges
4. ✅ Empty states contextuales

### Fase 2 - Funcionalidad Core (2-3 semanas)

5. ✅ Edición inline
6. ✅ Column visibility toggle
7. ✅ Skeleton loading
8. ✅ Toast notifications

### Fase 3 - Avanzado (3-4 semanas)

9. ✅ Bulk edit
10. ✅ Keyboard navigation mejorada
11. ✅ Column resize
12. ✅ Row drag & drop

---

## 🔗 Referencias

- [TanStack Table](https://tanstack.com/table) - Inspiración para features avanzados
- [Ant Design Table](https://ant.design/components/table) - Patrones de UX
- [Material UI DataGrid](https://mui.com/x/react-data-grid/) - Edición inline
- [dnd-kit](https://dndkit.com/) - Drag and drop

---

_Última actualización: Febrero 2026_
