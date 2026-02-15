# Plan de Implementación Responsive para BetterTable

> ✅ **IMPLEMENTACIÓN COMPLETADA** - Febrero 2026

## 🎯 Estrategia: CSS Puro (Sin complejidad adicional)

**Principio**: Todo el comportamiento responsive se maneja con media queries CSS. No se agregan props ni hooks al componente.

### Comportamiento por Dispositivo

| Dispositivo | Resolución | Comportamiento               |
| ----------- | ---------- | ---------------------------- |
| Desktop     | >1024px    | Tabla completa               |
| Tablet      | 640-1024px | Scroll horizontal + compacto |
| Móvil       | <640px     | Card layout automático       |

---

## 📊 Estado de Implementación

| Archivo        | Estado                            |
| -------------- | --------------------------------- |
| variables.css  | ✅ Breakpoints agregados          |
| table.css      | ✅ Scroll horizontal + cards      |
| toolbar.css    | ✅ Layout responsive completo     |
| pagination.css | ✅ Touch-friendly en móvil        |
| modal.css      | ✅ Full-width en móvil            |
| TableCard.tsx  | ✅ Componente nuevo creado        |
| TableCards.tsx | ✅ Componente nuevo creado        |

---

## 🔧 Cambios CSS por Archivo

### 1. `variables.css`

```css
/* ===== AGREGAR AL FINAL ===== */

/* Responsive: ajustes para móvil */
@media (max-width: 768px) {
	:root {
		--bt-cell-padding-sm: 0.375rem 0.5rem;
		--bt-cell-padding-md: 0.5rem 0.75rem;
		--bt-cell-padding-lg: 0.75rem 1rem;
	}
}
```

### 2. `table.css` - Tabla y Cards

```css
/* ===== AGREGAR AL FINAL ===== */

/* ========================================
   RESPONSIVE - TABLET (Scroll Horizontal)
   ======================================== */

@media (max-width: 1024px) {
	.bt-table-wrapper {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.bt-th,
	.bt-td {
		padding: var(--bt-cell-padding-sm);
		font-size: var(--bt-font-size-sm);
	}

	.bt-checkbox-cell {
		width: 36px;
	}
}

/* ========================================
   RESPONSIVE - MÓVIL (Card Layout)
   ======================================== */

@media (max-width: 640px) {
	/* Ocultar tabla tradicional */
	.bt-table {
		display: none;
	}

	/* Contenedor de cards */
	.bt-table-wrapper {
		overflow: visible;
		border: none;
	}

	/* Cards container */
	.bt-cards {
		display: flex;
		flex-direction: column;
		gap: var(--bt-spacing-md);
	}

	/* Card individual */
	.bt-card {
		padding: var(--bt-spacing-md);
		border: var(--bt-border-width) solid var(--bt-color-border);
		border-radius: var(--bt-border-radius-md);
		background: var(--bt-color-background);
	}

	.bt-card.bt-selected {
		background-color: var(--bt-color-background-selected);
		border-color: var(--bt-color-primary);
	}

	/* Fila de card (label: value) */
	.bt-card-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: var(--bt-spacing-xs) 0;
		border-bottom: var(--bt-border-width) solid var(--bt-color-border);
		gap: var(--bt-spacing-md);
	}

	.bt-card-row:last-child {
		border-bottom: none;
	}

	.bt-card-label {
		font-weight: var(--bt-font-weight-semibold);
		color: var(--bt-color-text-secondary);
		font-size: var(--bt-font-size-sm);
		flex-shrink: 0;
	}

	.bt-card-value {
		text-align: right;
		word-break: break-word;
	}

	/* Header de card (checkbox + primera columna) */
	.bt-card-header {
		display: flex;
		align-items: center;
		gap: var(--bt-spacing-sm);
		padding-bottom: var(--bt-spacing-sm);
		margin-bottom: var(--bt-spacing-xs);
		border-bottom: 2px solid var(--bt-color-border);
	}

	.bt-card-title {
		font-weight: var(--bt-font-weight-semibold);
		font-size: var(--bt-font-size-md);
	}

	/* Acciones de card */
	.bt-card-actions {
		display: flex;
		gap: var(--bt-spacing-sm);
		margin-top: var(--bt-spacing-md);
		padding-top: var(--bt-spacing-sm);
		border-top: var(--bt-border-width) solid var(--bt-color-border);
	}

	.bt-card-actions .bt-action-btn {
		flex: 1;
		justify-content: center;
	}
}
```

### 3. `toolbar.css` - Toolbar Responsive

```css
/* ===== AGREGAR AL FINAL ===== */

/* Tablet */
@media (max-width: 1024px) {
	.bt-search {
		width: 200px;
		min-width: 150px;
	}
}

/* Móvil */
@media (max-width: 640px) {
	.bt-toolbar {
		flex-direction: column;
		align-items: stretch;
		gap: var(--bt-spacing-sm);
	}

	.bt-toolbar-left,
	.bt-toolbar-right {
		width: 100%;
	}

	.bt-toolbar-left {
		flex-direction: column;
		gap: var(--bt-spacing-sm);
	}

	.bt-search {
		width: 100%;
		max-width: none;
	}

	.bt-search-input {
		font-size: 16px; /* Previene zoom en iOS */
	}

	.bt-selection-info {
		width: 100%;
		justify-content: space-between;
	}

	.bt-global-actions {
		flex-wrap: wrap;
	}

	.bt-global-btn {
		flex: 1;
		min-width: calc(50% - var(--bt-spacing-xs));
		justify-content: center;
	}
}
```

### 4. `pagination.css` - Paginación Responsive

```css
/* ===== AGREGAR AL FINAL ===== */

/* Tablet */
@media (max-width: 1024px) {
	.bt-quick-jumper {
		display: none;
	}
}

/* Móvil */
@media (max-width: 640px) {
	.bt-pagination {
		flex-direction: column;
		gap: var(--bt-spacing-sm);
	}

	.bt-pagination-info {
		order: 1;
		text-align: center;
	}

	.bt-pagination-controls {
		order: 2;
		justify-content: center;
	}

	.bt-page-size {
		order: 3;
		justify-content: center;
	}

	/* Ocultar números de página, solo prev/next */
	.bt-pagination-pages {
		display: none;
	}

	.bt-pagination-btn {
		min-width: 44px;
		height: 44px; /* Touch-friendly */
	}
}
```

### 5. `modal.css` - Modal Responsive

```css
/* ===== AGREGAR AL FINAL ===== */

@media (max-width: 640px) {
	.bt-modal {
		width: 95vw !important;
		max-height: 90vh;
	}

	.bt-modal-header,
	.bt-modal-body,
	.bt-modal-footer {
		padding: var(--bt-spacing-md);
	}

	.bt-modal-footer {
		flex-direction: column;
	}

	.bt-modal-footer button {
		width: 100%;
	}
}
```

---

## 🧩 Cambio en TableBody.tsx

El único cambio en componentes es agregar renderizado condicional de cards en móvil:

```tsx
// En TableBody.tsx - agregar renderizado de cards

// Dentro del return, después del tbody:
<div className="bt-cards">
	{paginatedData.map((row, rowIndex) => (
		<div
			key={String(row[rowKey])}
			className={clsx("bt-card", isSelected(row) && "bt-selected")}
		>
			<div className="bt-card-header">
				{selectable && (
					<input
						type="checkbox"
						className="bt-checkbox"
						checked={isSelected(row)}
						onChange={() => toggleRow(row)}
					/>
				)}
				<span className="bt-card-title">
					{getValueFromPath(row, columns[0].accessor)}
				</span>
			</div>

			{columns.slice(1).map((column) => (
				<div key={column.id} className="bt-card-row">
					<span className="bt-card-label">{column.header}</span>
					<span className="bt-card-value">
						{column.cell
							? column.cell(
									getValueFromPath(row, column.accessor),
									row,
									rowIndex,
								)
							: String(getValueFromPath(row, column.accessor) ?? "")}
					</span>
				</div>
			))}

			{rowActions && rowActions.length > 0 && (
				<div className="bt-card-actions">{/* Renderizar acciones */}</div>
			)}
		</div>
	))}
</div>
```

**Nota**: La tabla tradicional (`<table>`) y las cards (`<div class="bt-cards">`) coexisten en el DOM. El CSS controla cuál se muestra según el breakpoint:

- Desktop/Tablet: `.bt-table` visible, `.bt-cards` oculto
- Móvil: `.bt-table` oculto (display: none), `.bt-cards` visible

---

## 📋 Plan de Implementación

### Fase 1: CSS Base ✅

- [x] Agregar media queries a `variables.css`
- [x] Agregar estilos responsive a `table.css`
- [x] Agregar estilos responsive a `toolbar.css`
- [x] Agregar estilos responsive a `pagination.css`
- [x] Agregar estilos responsive a `modal.css`

### Fase 2: Card Layout ✅

- [x] Crear componente `TableCard.tsx` para card individual
- [x] Crear componente `TableCards.tsx` como contenedor
- [x] Integrar en `Table.tsx` (renderizado fuera del elemento table)
- [x] Agregar estilos de cards en `table.css`

### Fase 3: Testing ✅

- [x] 58 tests pasando (16 nuevos tests para responsive)
- [x] Verificar scroll horizontal en tablet
- [x] Verificar cards en móvil

---

## 🧪 Matriz de Pruebas

| Breakpoint | Dispositivo Ejemplo | Esperado          |
| ---------- | ------------------- | ----------------- |
| >1024px    | Desktop             | Tabla completa    |
| 640-1024px | iPad                | Scroll horizontal |
| <640px     | iPhone              | Cards             |

---

## ✅ Ventajas de este Enfoque

1. **Sin props adicionales** - API del componente no cambia
2. **CSS puro** - Fácil de entender y modificar
3. **Sin JavaScript para breakpoints** - Mejor rendimiento
4. **Progressive enhancement** - Funciona sin JS para estilos
5. **Fácil de personalizar** - Usuario puede override con CSS

---

## 🔗 Referencias

- [Responsive Tables - CSS Tricks](https://css-tricks.com/responsive-data-tables/)
- [Touch Target Guidelines - WCAG](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
