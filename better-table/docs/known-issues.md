# Problemas Conocidos (Known Issues)

Lista de problemas conocidos, limitaciones y workarounds en BetterTable.

## 📋 Resumen de Issues

| Issue                              | Severidad | Workaround                   | Estado                    | Versión |
| ---------------------------------- | --------- | ---------------------------- | ------------------------- | ------- |
| Tests con Testing Library Matchers | 🟢 Low    | -                            | ✅ Resuelto               | v1.0.0  |
| Mobile Responsiveness              | 🟡 Medium | -                            | ✅ Resuelto               | v1.1.0  |
| TypeScript Strict Mode             | 🟢 Low    | -                            | ✅ Resuelto               | v1.1.0  |
| Modal onClose no funciona          | 🔴 High   | -                            | ✅ Resuelto               | v1.1.1  |
| DOM duplicado (table + cards)      | 🟡 Medium | -                            | ✅ Resuelto               | v1.1.1  |
| Search debounce no implementado    | 🟡 Medium | -                            | ✅ Resuelto               | v1.1.1  |
| Search no matchea por accessor     | 🟡 Medium | -                            | ✅ Resuelto               | v1.1.1  |
| Card actions overflow en móvil     | 🟡 Medium | -                            | ✅ Resuelto               | v1.1.1  |
| Toolbar no responsive en móvil     | 🟡 Medium | -                            | ✅ Resuelto               | v1.1.1  |
| Quick Jumper desincronizado        | 🟢 Low    | -                            | ✅ Resuelto               | v1.1.1  |
| Filtrado de columnas tipo Date     | 🟡 Medium | -                            | ✅ Resuelto               | v1.1.1  |
| i18n hardcoded strings             | 🟡 Medium | -                            | ✅ Resuelto               | v1.1.1  |
| Rendimiento con >10,000 filas      | 🟡 Medium | Usar paginación reducida     | Limitación                | v1.2.0  |
| CSS Conflicts (style leakage)      | 🟡 Medium | -                            | ✅ Resuelto               | v1.1.1  |
| Keyboard Navigation                | 🟢 Low    | Mouse/touch                  | Parcial                   | v1.3.0  |
| Exportación de datos               | 🟡 Medium | Implementar con globalAction | No implementada           | v1.4.0  |
| Server-Side Operations             | 🟡 Medium | Usar callbacks controlados   | Parcialmente implementada | v2.0.0  |
| Column Resizing                    | 🟢 Low    | CSS width fijo               | No implementada           | v2.0.0  |
| Virtual Scrolling                  | 🟡 Medium | Paginación                   | No implementada           | v2.0.0  |

**Niveles de Severidad:**

- 🔴 **High:** Causa crashes, pérdida de datos o problemas de seguridad
- 🟡 **Medium:** Degrada la experiencia pero tiene workaround
- 🟢 **Low:** Inconveniente menor, problemas cosméticos

---

## �🐛 Bugs Conocidos

### 1. Tests Fallando con Testing Library Matchers

**Estado:** ✅ RESUELTO

**Descripción:**
7 tests estaban fallando debido a problemas con los matchers de `@testing-library/jest-dom` en Vitest y queries incorrectas para ARIA roles.

**Tests Afectados:**

- `aplica estilos personalizados correctamente` ✅
- `muestra contador de elementos seleccionados` ✅
- `filtra por número en columna numérica` ✅
- `busca en todas las columnas configuradas` ✅
- `ordena por columna al hacer click en header` ✅
- `accede a propiedades anidadas con dot notation` ✅
- `tiene atributos ARIA correctos` ✅

**Causa Raíz:**

1. Tests buscaban `role="table"` pero el componente usa correctamente `role="grid"` para tablas interactivas
2. Tests usaban `getByText()` donde había múltiples elementos con el mismo texto
3. Estilos CSS (`striped`, `bordered`, `hoverable`) no se aplicaban al contenedor

**Solución Implementada:**

- ✅ Actualizado queries de `getByRole("table")` → `getByRole("grid")`
- ✅ Cambiado `getByText()` → `getAllByText()` o `queryByText()` donde apropiado
- ✅ Agregado clases CSS de estilos al contenedor `.bt-container`
- ✅ Mejorado búsqueda de elementos usando `rows.some()` para verificar contenido
- ✅ Agregado `waitFor()` para filtros que necesitan tiempo de procesamiento

**Resultado:**
🎉 **Todos los 58 tests ahora pasan correctamente** (42 originales + 16 tests de responsive/cards)

**Fecha de Resolución:** 15 de febrero, 2026

---

### 2. Modal onClose No Cierra el Modal

**Estado:** ✅ RESUELTO

**Descripción:**
Cuando una acción de fila usa `mode: 'modal'`, el callback `onClose` que recibe `modalContent` era un no-op. Los botones dentro del modal que llamaban `onClose()` no cerraban el modal.

**Solución Implementada:**

- `TableActions.tsx` y `TableCard.tsx` ahora pasan `closeModal` del contexto como `onClose`
- El callback `onClose()` cierra el modal correctamente desde el contenido modal
- Test de verificación agregado

**Fecha de Resolución:** Febrero 2026
}}
/>,
);

````

**Fecha de Resolución:** Febrero 2026

---

### 3. Rendimiento con Grandes Datasets (>10,000 filas)

**Estado:** 🟡 Limitación Conocida

**Descripción:**
La tabla puede experimentar lag al renderizar más de 10,000 filas sin virtualización.

**Impacto:**

- Renderizado inicial lento (>2s)
- Scroll no fluido
- Alto uso de memoria
- Agravado por ~~renderizado dual DOM (ver issue #4)~~ _(resuelto: ahora solo renderiza el layout activo)_

**Workaround:**

```typescript
// Usar paginación con pageSize reducido
<BetterTable
  data={largeDataset}
  pagination={{
    pageSize: 50,  // Mantener bajo para performance
    showSizeChanger: true
  }}
/>
````

**Solución Planeada:**

- [ ] Implementar virtualización (react-window o react-virtual)
- [ ] Lazy rendering de filas
- [ ] Infinite scroll como alternativa a paginación

**Estimación:** v1.2.0

---

### 4. Renderizado Dual de DOM (Table + Cards)

**Estado:** ✅ Resuelto

**Descripción:**
El diseño responsive renderizaba simultáneamente `<table>` (desktop) y `<TableCards>` (móvil) en el DOM. CSS ocultaba uno según el viewport, pero ambos existían en memoria.

**Solución Implementada:**

- Se creó el hook `useMediaQuery` (`hooks/useMediaQuery.ts`) que escucha `matchMedia` de forma SSR-safe
- `Table.tsx` ahora renderiza condicionalmente solo el layout activo (`isMobile ? <TableCards /> : <table>`)
- Se eliminaron las reglas CSS de `display: none` que togglaban entre tabla/cards
- Se agregó animación `@keyframes bt-fade-in` (150ms) para transiciones suaves entre layouts
- Mock global de `matchMedia` en `setupTests.ts` para compatibilidad con jsdom

**Resultado:**

- Cada fila se renderiza **una sola vez** (solo el layout visible)
- Renderers custom (`cell()`) se ejecutan una sola vez por fila
- DOM más liviano, menor consumo de memoria

---

### 5. Search Debounce Declarado pero No Implementado

**Estado:** ✅ RESUELTO

**Descripción:**
El hook `useTableSearch` aceptaba `debounceMs` en tipos pero no lo implementaba.

**Solución Implementada:**

- `useTableSearch` ahora mantiene un `debouncedValue` separado del `searchValue` usando `setTimeout`/`clearTimeout`
- El input responde al instante (sin lag), el filtrado se aplica tras el delay
- `clearSearch()` bypasea el debounce y limpia inmediatamente
- Nueva prop `searchDebounceMs` (default: 300ms), configurable con `searchDebounceMs={0}` para filtrado instantáneo
- 5 tests nuevos con fake timers verifican debounce, reset de timer, clear inmediato y modo sin debounce

**Fecha de Resolución:** 21 de febrero, 2026

---

### 5b. Search No Matchea por Accessor en searchColumns

**Estado:** ✅ RESUELTO

**Descripción:**
`searchData` solo comparaba `searchColumns` contra `col.id`, no contra `col.accessor`. Columnas con accessor anidado (ej: `accessor: "details.brand"`, `id: "brand"`) no se encontraban al pasar `searchColumns={["details.brand"]}`.

**Solución Implementada:**

- `searchData` en `filterData.ts` ahora matchea `searchColumnIds` contra **`col.id`** y **`col.accessor`**

**Fecha de Resolución:** 21 de febrero, 2026

---

### 6. Filtrado de Columnas Tipo Date

**Estado:** ✅ RESUELTO

**Descripción:**
Las columnas tipo `date` no tenían un filtro especializado.

**Solución Implementada:**

- `TableFilterPanel.tsx` renderiza dos inputs `type="date"` (desde/hasta) para columnas con `type: 'date'`
- `DateFilterRange` type: `{ from?: string; to?: string }`
- `filterData()` en `filterData.ts` soporta filtrado por rango de fechas
- 5 tests de verificación en `date-filter.test.tsx`

**Fecha de Resolución:** Febrero 2026

---

### 6b. Internationalization (i18n) Strings Hardcoded

**Estado:** ✅ RESUELTO

**Descripción:**
8 textos estaban hardcoded en componentes sin pasar por el sistema `locale`.

**Solución Implementada:**

- 7 nuevas keys agregadas al `TableLocale`: `moreActions`, `clearSearch`, `closeModal`, `previousPage`, `nextPage`, `jumpToPage`, `details`
- Todos los componentes usan `locale.*` en lugar de strings hardcoded
- Locales preconfigurados: `en` (default), `es`, `pt`
- Prop `locale` acepta `LocaleKey | TableLocale` (preset string o objeto de overrides)

**Fecha de Resolución:** Febrero 2026

---

### 7. Exportación de Datos

**Estado:** 🟡 No Implementada

**Descripción:**
No existe funcionalidad built-in para exportar datos a CSV, Excel o PDF.

**Workaround:**

```typescript
// Implementar manualmente con globalAction
{
  id: 'export',
  label: 'Exportar CSV',
  onClick: (selectedRows, allData) => {
    const csv = convertToCSV(allData);
    downloadFile(csv, 'export.csv');
  }
}
```

**Librerías Recomendadas:**

- `papaparse` para CSV
- `xlsx` para Excel
- `jspdf` + `jspdf-autotable` para PDF

**Solución Planeada:**

- [ ] Plugin de exportación
- [ ] Soporte CSV, Excel, JSON
- [ ] Configuración de columnas a exportar

**Estimación:** v1.4.0

---

## ⚠️ Limitaciones

### 1. Server-Side Operations

**Estado:** 🟡 Parcialmente Implementada

**Descripción:**
Filtrado, búsqueda y ordenamiento son por defecto client-side, pero ahora existen callbacks controlados que permiten server-side.

**Lo que YA funciona (v1.1.0):**

- `onPageChange` y `totalItems` en pagination (paginación server-side)
- `onSortChange` callback para ordenamiento controlado
- `onFilterChange` callback para filtros controlados
- `onSearchChange` callback para búsqueda controlada

**Ejemplo actual funcional:**

```typescript
<BetterTable
  data={serverData}
  pagination={{
    page,
    pageSize: 20,
    totalItems: serverTotalCount,  // ✅ Ahora funciona
    onPageChange: (page, pageSize) => fetchFromServer(page, pageSize),
  }}
  onSortChange={(sort) => fetchSorted(sort)}
  onFilterChange={(filters) => fetchFiltered(filters)}
  onSearchChange={(value) => fetchSearched(value)}
/>
```

**Lo que FALTA:**

- [ ] Prop `serverSide: boolean` dedicado para modo explícito
- [ ] Loading states automáticos durante fetch
- [ ] Manejo de errores de red integrado

**Estimación:** v2.0.0 (API dedicada completa)

---

### 2. Column Resizing

**Descripción:**
No se pueden redimensionar columnas arrastrando.

**Workaround:**

```typescript
// Usar prop width en columnas
{
  id: 'name',
  accessor: 'name',
  width: '200px'  // Fixed width
}
```

**Solución Planeada:**

- [ ] Drag handles en headers
- [ ] Guardar widths en localStorage
- [ ] Min/max width constraints

**Estimación:** v1.5.0

---

### 3. Column Reordering

**Descripción:**
No se puede cambiar el orden de columnas con drag & drop.

**Workaround:**

```typescript
// Reordenar columns array manualmente
const [columns, setColumns] = useState(initialColumns);

// Proveer UI custom para reordenar
<ColumnOrderSettings
  columns={columns}
  onChange={setColumns}
/>
```

**Solución Planeada:**

- [ ] Drag & drop en headers
- [ ] Persistencia de orden
- [ ] API: `onColumnReorder`

**Estimación:** v1.5.0

---

### 4. Nested Tables

**Descripción:**
No hay soporte para filas expandibles con sub-tablas.

**Caso de Uso:**

```
▼ Usuario 1
  → Pedido #1
  → Pedido #2
▶ Usuario 2
```

**Workaround:**

```typescript
// Implementar con custom cell
{
  cell: (value, row) => (
    <ExpandableRow row={row}>
      <BetterTable data={row.subItems} columns={subColumns} />
    </ExpandableRow>
  )
}
```

**Solución Planeada:**

- [ ] Prop `expandable`
- [ ] Prop `renderExpandedRow`
- [ ] Animaciones de expansión

**Estimación:** v1.6.0

---

### 5. Mobile Responsiveness

**Estado:** ✅ RESUELTO

**Descripción:**
La tabla no era responsive en móviles. Esto fue completamente implementado en v1.1.0.

**Solución Implementada (febrero 2026):**

- ✅ Card layout automático en móviles (<640px)
- ✅ Scroll horizontal compacto en tablets (640-1024px)
- ✅ Touch-friendly targets (44px min-height)
- ✅ Toolbar stacked en móviles
- ✅ Paginación simplificada en móviles
- ✅ Modal 95vw en móviles
- ✅ Prevención de zoom iOS (font-size: 16px en inputs)
- ✅ 16 tests nuevos para cards responsive
- ✅ Selección, acciones, columnas ocultas, booleanos y nulls en cards

**Componentes Nuevos:** `TableCard.tsx`, `TableCards.tsx`

**Detalle completo:** Ver `docs/RESPONSIVE_PLAN.md`

---

## 🔧 Problemas de Configuración

### 1. TypeScript Strict Mode

**Estado:** ✅ RESUELTO

**Descripción:**
Previamente algunos tipos causaban errores en strict mode. Ahora el proyecto compila limpiamente con `tsc --noEmit` y strict mode habilitado.

**Configuración actual en `tsconfig.json`:**

```jsonc
"strict": true,
"noUnusedLocals": true,
"noUnusedParameters": true,
"noFallthroughCasesInSwitch": true,
"noUncheckedSideEffectImports": true
```

**Detalles:**

- Tipo base `TableData = Record<string, unknown>` (no `any`)
- Todos los componentes son correctamente genéricos
- Cero errores de TypeScript en compilación

**Fecha de Resolución:** Febrero 2026

---

### 2. CSS Conflicts

**Estado:** ✅ RESUELTO

**Descripción:**
Estilos globales podían interferir con estilos de BetterTable (ej: `table { font-size: 20px }`, `* { box-sizing: content-box }`).

**Solución Implementada:**

El CSS ahora incluye un **bloque de aislamiento** (`CSS Isolation`) en `table.css` que:

- ✅ **Box-sizing reset**: `.bt-container, .bt-container *, ::before, ::after { box-sizing: border-box }` — previene `* { box-sizing: content-box }` de romper el layout
- ✅ **Typography baseline**: `.bt-container` establece `font-family`, `font-size`, `color`, `line-height` como base aislada
- ✅ **Element-level resets con `:where()`**: resetea `table`, `th`, `td`, `button`, `input`, `select`, `h2`, `a` con especificidad (0,1,0) — supera selectores de elemento externos sin pisar las reglas `.bt-*` propias
- ✅ **Portal isolation**: `.bt-overflow-menu` (portaled a `document.body`) incluye su propio baseline de tipografía, box-sizing y resets de elementos
- ✅ Navegadores soportados: Chrome 88+, Firefox 78+, Safari 14+, Edge 88+ (`:where()` support)

**Ejemplo — esto ya NO rompe BetterTable:**

```css
/* Externo: ya no afecta a BetterTable */
table {
	font-size: 20px;
	border-collapse: separate;
}
button {
	all: unset;
}
input {
	border: none;
}
* {
	box-sizing: content-box;
}
```

**Limitaciones restantes:**

- Reglas externas con `!important` seguirán ganando (ej: `* { box-sizing: content-box !important }`)
- Reglas con ID selectors (ej: `#app table { ... }`) pueden superar la especificidad

**Fecha de Resolución:** Febrero 2026

---

### 6. Quick Jumper de Paginación Desincronizado

**Estado:** ✅ RESUELTO

**Descripción:**
El input de "saltar a página" usaba `defaultValue` (uncontrolled) y no se actualizaba al navegar con los botones prev/next.

**Solución Implementada:**

- Cambiado a input controlado con `value={page}` + `onChange` handler
- Sincroniza correctamente con la página actual

**Fecha de Resolución:** Febrero 2026

---

## 🚧 Roadmap de Fixes

### v1.0.2 (Patch)

- [x] Actualizar dependencias
- [x] Fix tests de TypeScript
- [x] Mobile responsiveness (cards)
- [x] TypeScript strict mode
- [ ] Performance: evitar re-renders innecesarios

### v1.1.1 (Patch - Completado ✅)

- [x] 🔴 Fix modal `onClose` callback
- [x] Renderizado condicional table/cards (eliminar DOM dual)
- [x] Implementar debounce en búsqueda
- [x] Fix search matcheo por accessor
- [x] Card actions overflow (icon-only + dropdown)
- [x] Toolbar responsive en móvil (search colapsable, actions icon-only)
- [x] Refactor de tests (1 archivo → 18 archivos, 87 tests)
- [x] Quick jumper input controlado
- [x] Filter Panel (botón en toolbar + panel colapsable con filtros)
- [x] Date range filtering (desde/hasta para columnas date)
- [x] i18n: 7 nuevas locale keys para todos los textos del componente
- [x] Locale presets (EN/ES/PT) + prop `locale` acepta string o objeto
- [x] CSS Isolation: aislamiento de estilos con `:where()` element resets + box-sizing

### v1.2.0 (Minor - Próximo)

- [ ] Virtualización (react-window o @tanstack/virtual)
- [ ] Advanced filtering (Date picker)
- [ ] Keyboard navigation completa

### v1.3.0 (Minor)

- [ ] Column hiding/showing
- [ ] Column resizing
- [ ] Export básico (CSV)

### v2.0.0 (Major)

- [ ] Server-side operations (API dedicada)
- [ ] Breaking changes necesarios

---

## 📝 Reportar Nuevos Issues

Si encuentras un problema:

1. **Verificar** que no esté en esta lista
2. **Reproducir** en el demo o crear minimal example
3. **Reportar** en GitHub Issues con:
   - Descripción clara
   - Código de reproducción
   - Screenshots si aplicable
   - Versión de BetterTable
   - Versiones de React/TypeScript

### Template de Issue

````markdown
**Descripción del problema:**
[Descripción clara]

**Pasos para reproducir:**

1. ...
2. ...
3. ...

**Comportamiento esperado:**
[Qué debería pasar]

**Comportamiento actual:**
[Qué pasa realmente]

**Código de ejemplo:**

```typescript
// Tu código aquí
```
````

**Entorno:**

- BetterTable: v1.0.1
- React: v19.2.4
- TypeScript: v5.9.3
- Browser: Chrome 120

```

---

## 🤝 Contribuir Fixes

¿Quieres ayudar a resolver issues?

1. Fork el repositorio
2. Crea branch: `fix/issue-description`
3. Implementa fix con tests
4. Actualiza esta documentación
5. Crea Pull Request

**Prioridad de fixes:**
- 🔴 Critical bugs (bloquean uso)
- 🟡 Limitations (workarounds posibles)
- 🟢 Enhancements (nice to have)

---

## 📚 Referencias

- [GitHub Issues](https://github.com/jrodrigopuca/BetterTable/issues)
- [Changelog](../CHANGELOG.md)
- [Contribución](../CONTRIBUTING.md)
```
