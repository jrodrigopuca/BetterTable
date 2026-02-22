# BetterTable — Investigación UI/UX de Tablas

> Análisis comparativo de las principales librerías de tablas React del mercado.
> Fecha: Julio 2025

---

## 📚 Librerías Analizadas

| Librería | Tipo | Licencia | Ecosistema |
|---|---|---|---|
| **TanStack Table** | Headless (solo lógica) | MIT | Framework-agnostic |
| **AG Grid** | Componente completo | Community (MIT) + Enterprise | React, Angular, Vue |
| **Ant Design Table** | Componente completo | MIT | Ant Design ecosystem |
| **MUI X DataGrid** | Componente completo | Community (MIT) + Pro/Premium | Material UI ecosystem |
| **shadcn/ui Data Table** | Guía + componentes copiables | MIT | TanStack Table + Radix UI |
| **BetterTable** (nosotros) | Componente completo | MIT | Standalone, React |

---

## 🔍 Hallazgos Clave por Librería

### 1. TanStack Table (Headless)

**Filosofía**: No renderiza nada — provee hooks de lógica pura. El dev construye el UI.

**Features completas**:
- Column Ordering, Pinning, Sizing, Visibility
- Column & Global Filtering, Fuzzy Filtering
- Column/Global Faceting
- Grouping, Expanding
- Pagination, Row Pinning, Row Selection
- Sorting, Virtualization
- Custom Features API

**Aciertos**:
- ✅ **Máxima flexibilidad**: Cada tabla puede verse y comportarse completamente diferente
- ✅ **Tree-shaking**: Solo importas los plugins que necesitas
- ✅ **TypeScript-first**: Tipos genéricos excelentes (`ColumnDef<TData, TValue>`)
- ✅ **Framework-agnostic**: React, Vue, Solid, Svelte

**Tradeoff**:
- ❌ Requiere escribir MUCHO boilerplate para una tabla básica
- ❌ No incluye UI — cada proyecto reinventa el CSS

**Lo que aprendemos**: Su API de `ColumnDef` con `accessorKey` + `header` + `cell` es un estándar de facto. BetterTable ya sigue un patrón similar con `id` + `accessor` + `header` + `cell`.

---

### 2. AG Grid (Gold Standard Enterprise)

**Filosofía**: "Baterías incluidas" — la tabla más completa del mercado.

**Features Community** (gratis):
- Sorting (default enabled), Column Resizing (drag), Cell Components
- Filtering (5 built-in + floating filters), Editing (7 cell editors)
- Row Selection, Pagination
- Value Formatters, Value Getters
- Theming system (Quartz, Alpine, Balham + Theme Builder)
- Cell/Row styling con `cellClassRules` y `rowClassRules`

**Features Enterprise** (licencia):
- Integrated Charts, Row Grouping + Aggregation
- Pivoting, Tree Data
- Tool Panels (columnas, filtros) como side panels
- Clipboard, Export (CSV, Excel)

**Aciertos**:
- ✅ **Auto-inferencia de tipos**: Detecta tipo de dato automáticamente para filtros y editores
- ✅ **Modular**: Sistema de módulos que minimiza bundle (`AllCommunityModule` o imports selectivos)
- ✅ **Floating Filters**: Filtros embebidos en el header — acceso inmediato sin dropdown
- ✅ **Theme Builder visual**: Editor WYSIWYG para crear temas custom
- ✅ **Figma Design System**: Kit oficial para diseñadores

**Lo que aprendemos**:
1. **Floating Filters** es un patrón UX superior. BetterTable usa Filter Panel (colapsable), lo cual está bien pero los floating filters dan acceso más rápido.
2. **Auto-detección de tipo de dato** para elegir el editor/filtro correcto — BetterTable requiere `type` manual.
3. **Value Formatters** como concepto separado de `cell` renderer — permite formatear sin customizar todo el JSX.

---

### 3. Ant Design Table

**Filosofía**: Componente opinado con API declarativa. Máxima funcionalidad con mínima config.

**Features** (todas gratis MIT):
- Filter menu por columna (con `filterMode: 'menu' | 'tree'`)
- Filter search dentro del dropdown de filtros
- Multiple Sorters con prioridad configurable
- Custom filter panels (`filterDropdown`)
- Controlled filters/sorters (via `filteredValue`, `sortOrder`)
- Selection (checkbox/radio) con `preserveSelectedRowKeys`
- Expandable Rows (nested content)
- Tree Data (jerarquía padre/hijo)
- Fixed Header / Fixed Columns (sticky)
- Column Grouping (multi-level headers)
- **Editable Cells y Editable Rows**
- **Drag Sorting** (filas y columnas, via dnd-kit)
- Ellipsis con tooltip custom
- Custom Empty States
- **Summary rows** (footer con totales)
- Virtual List (performance)
- **Responsive columns** (breakpoints por columna)
- Pagination placement (top/bottom, start/center/end)
- Hidden Columns (prop `hidden`)
- Column Span / Row Span
- Nested Tables
- 3 tamaños (large, middle, small)
- Bordered / Title / Footer
- `classNames` y `styles` por semantic DOM element
- **Design Tokens** extensivos (30+ tokens de colores, paddings, fonts)
- TypeScript genérico (`Table<User>`)
- i18n via `locale` prop

**Aciertos**:
- ✅ **API declarativa exhaustiva**: Una tabla completa se configura solo con props, no hooks
- ✅ **Filter modes**: `menu` (dropdown) vs `tree` (jerárquico) — flexible
- ✅ **`filterSearch`**: Buscar dentro de las opciones del filtro
- ✅ **Responsive columns con breakpoints**: `responsive: ['xxl', 'xl']` oculta en pantallas pequeñas
- ✅ **Summary rows**: Calcular totales/promedios en un footer fijo
- ✅ **Semantic DOM customization**: `classNames` y `styles` mapeados a partes semánticas (root, header.row, body.cell, etc.)
- ✅ **onChange unificado**: Un solo callback para pagination + filters + sorter + acción
- ✅ **`shouldCellUpdate`**: Optimización de re-renders por celda
- ✅ **Expand row by click**: No solo con ícono, click en toda la fila

**Lo que aprendemos**:
1. **Summary Rows** — BetterTable no tiene. Útil para tablas financieras/inventario.
2. **Responsive Columns por breakpoint** — BetterTable usa card view < 640px. Ant permite granularidad por columna.
3. **`onChange` unificado** — BetterTable tiene `onPageChange`, `onSortChange`, `onFilterChange` separados. Tener un callback unificado simplifica server-side.
4. **Semantic classNames/styles** — BetterTable ya tiene `TableClassNames` pero Ant va más granular (header.row, header.cell, body.row, body.cell...).
5. **Hidden columns con prop simple** — BetterTable ya tiene `hidden` en Column. ✅ Ya implementado.

---

### 4. MUI X DataGrid

**Filosofía**: Extensión de Material UI. Tres tiers: Community → Pro → Premium.

**Features Community** (MIT):
- Inline Editing (double-click o Enter)
- Column Grouping (multi-level headers)
- Save and Restore State
- **Quick Filter** (búsqueda multi-campo)
- **Column Visibility** (toggle dropdown)
- Column Virtualization

**Features Pro** (licencia):
- **Master-Detail** (expandable child panels)
- Lazy Loading
- Row Reordering (DnD)
- **Column Pinning** (left/right)
- Row Pinning (top/bottom)
- Row Virtualization
- Tree Data
- **Header Filters** (filtros en el header)

**Features Premium** (licencia):
- Row Grouping + Aggregation + Summary Rows
- Excel Export
- Cell Selection (drag to select)
- **Clipboard Paste** (copy/paste desde Excel)
- **Pivoting**
- Charts Integration
- **AI Assistant** (natural language → grid operations)

**Aciertos**:
- ✅ **Quick Filter**: Input único que busca en múltiples columnas — BetterTable tiene `searchable` similar
- ✅ **Column Visibility toggle**: Dropdown en toolbar para show/hide columnas
- ✅ **Save/Restore State**: Guardar configuración (filtros, sort, visibilidad) y restaurar
- ✅ **3 tiers claros**: Free → Pro → Premium con features bien delineadas
- ✅ **Clipboard Paste**: Pegar datos desde Excel directamente en la grid — innovador
- ✅ **AI Assistant**: Lenguaje natural para manipular la tabla

**Lo que aprendemos**:
1. **Save/Restore State** — Poder serializar y guardar el estado de la tabla (filtros, sort, page, column visibility) en localStorage o backend. BetterTable no tiene esto.
2. **Column Visibility como feature de primer nivel** — No solo `hidden: true` en config, sino un dropdown interactivo en runtime.
3. **Clipboard integration** — Copy/paste bidireccional con Excel es un game-changer para apps de datos.

---

### 5. shadcn/ui Data Table

**Filosofía**: No es una librería, es una **guía** + componentes copiables. "Build your own."

**Approach**:
- Usa TanStack Table para lógica
- Componentes `<Table>` de shadcn como base visual
- Guía paso a paso: Basic → Row Actions → Pagination → Sorting → Filtering → Visibility → Selection
- Componentes reusables: `DataTableColumnHeader`, `DataTablePagination`, `DataTableViewOptions`
- Soporte RTL built-in

**Aciertos**:
- ✅ **Educativo**: Muestra exactamente cómo construir cada feature paso a paso
- ✅ **Composable**: No un componente monolítico — piezas que se ensamblan
- ✅ **Row Actions con Dropdown**: Patrón de "⋯" → DropdownMenu limpio
- ✅ **Column Header reusable**: Sorting + hiding en un solo componente de header
- ✅ **RTL support**: Ejemplo completo en árabe

**Lo que aprendemos**:
1. **El patrón "Copy & Paste"** funciona para devs que quieren control total. BetterTable ofrece lo opuesto: zero-config declarativo. Ambos enfoques son válidos pero para audiencias diferentes.
2. **Row Actions como Dropdown siempre** — shadcn usa DropdownMenu como patrón primario. BetterTable alterna entre botones inline + overflow menu, lo cual da más visibilidad.
3. **RTL como feature documentada** — BetterTable no tiene soporte RTL.

---

## 📊 Matriz Comparativa de Features

| Feature | BetterTable | TanStack | AG Grid | Ant Design | MUI DataGrid | shadcn/ui |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Zero-config** | ✅ | ❌ | ⚡ | ⚡ | ⚡ | ❌ |
| **TypeScript Generics** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Sorting** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Multi-sort** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Column Filters** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Global Search** | ✅ | ✅ | ✅ | ❌¹ | ✅ | ✅ |
| **Date Range Filter** | ✅ | ❌² | ✅ | ❌² | ✅ | ❌² |
| **Pagination** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Row Selection** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Row Actions** | ✅ | ❌³ | ❌³ | ✅ | ❌³ | ✅ |
| **Global Actions** | ✅ | ❌³ | ❌³ | ✅ | ❌³ | ❌³ |
| **Modal Integration** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Card View (Responsive)** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **i18n Presets** | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| **CSS Isolation** | ✅ | N/A | ✅ | ✅ | ✅ | N/A |
| **Inline Editing** | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Column Visibility Toggle** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Column Pinning** | ❌ | ✅ | ✅ | ✅ | ✅(Pro) | ❌ |
| **Column Resize** | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Row DnD** | ❌ | ✅ | ❌³ | ✅ | ✅(Pro) | ❌ |
| **Expandable Rows** | ❌ | ✅ | ✅ | ✅ | ✅(Pro) | ❌ |
| **Tree Data** | ❌ | ✅ | ✅(E) | ✅ | ✅(Pro) | ❌ |
| **Virtualization** | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Summary/Aggregation** | ❌ | ❌ | ✅(E) | ✅ | ✅(P) | ❌ |
| **Export (CSV/Excel)** | ❌ | ❌ | ✅(E) | ❌ | ✅(P) | ❌ |
| **Sticky Header** | ✅ | ❌³ | ✅ | ✅ | ✅ | ❌ |
| **Floating Filters** | ❌ | ❌ | ✅ | ❌ | ✅(Pro) | ❌ |
| **Custom Theming** | ✅⁵ | N/A | ✅ | ✅ | ✅ | ✅ |
| **RTL Support** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |

> ¹ Ant no tiene búsqueda global built-in, pero sí `filterSearch` por columna  
> ² Requiere implementación custom  
> ³ Se implementa manualmente, no es feature built-in  
> ⁴ Soporta `hidden` en Column config, pero no toggle interactivo en runtime  
> ⁵ CSS Variables (`--bt-*`)  

---

## 🏆 Lo que BetterTable Hace Mejor

### 1. Verdadero Zero-Config
```tsx
<BetterTable data={data} columns={columns} />
```
Una línea y funciona. TanStack requiere ~80 líneas para lo mismo. AG Grid necesita provider + módulos. shadcn/ui requiere copiar componentes y ensamblarlos.

### 2. Row Actions Declarativas
```tsx
rowActions={[
  { id: 'edit', label: 'Editar', mode: 'modal', modalContent: EditForm },
  { id: 'delete', label: 'Borrar', mode: 'callback', variant: 'danger', onClick: del }
]}
```
Ninguna otra librería tiene un sistema declarativo de acciones con modos (callback, modal, link), visibilidad condicional, y overflow automático. Es nuestra feature más diferenciadora.

### 3. Card View Responsivo Automático
En <640px, BetterTable automáticamente muestra tarjetas en lugar de tabla. Ninguna otra librería ofrece esto built-in.

### 4. Modal Integration
Acciones que abren modales con `mode: 'modal'` y `modalContent` — con portal, scroll lock, y escape handling. Otras librerías delegan esto completamente al dev.

### 5. i18n con Presets + Override
```tsx
locale="es" // Preset completo
// o
locale={{ ...locales.es, noData: "Vacío" }} // Preset + override parcial
```
Sistema elegante con 3 presets (en/es/pt) y override granular.

---

## ⚠️ Gaps Principales (Oportunidades)

### Prioridad Alta (Features estándar que usuarios esperan)

| # | Feature | Quién lo tiene | Impacto | Esfuerzo |
|---|---|---|---|---|
| 1 | **Column Visibility Toggle** | Todos menos shadcn | Alto — feature esperada | ✅ Implementado |
| 2 | **Inline Editing** | AG Grid, Ant, MUI | Alto — caso de uso común | 4-6h |
| 3 | **Multi-Sort** | Todos | Medio — power users | ✅ Implementado |
| 4 | **Expandable Rows** | Todos menos shadcn | Alto — detalle sin navegar | 4-5h |
| 5 | **Export CSV** | AG Grid, MUI | Medio — feature esperada | 2-3h |

### Prioridad Media (Diferenciadores para v2)

| # | Feature | Quién lo tiene | Impacto |
|---|---|---|---|
| 6 | **Summary/Footer Rows** | Ant, AG Grid, MUI | Tablas financieras |
| 7 | **Column Resize** | TanStack, AG Grid, MUI | UX de datasets grandes |
| 8 | **Column Pinning** | TanStack, AG Grid, MUI, Ant | Tablas anchas |
| 9 | **Virtualization** | TanStack, AG Grid, Ant, MUI | Performance >1000 rows |
| 10 | **Save/Restore State** | MUI | Persistencia de preferencias |

### Prioridad Baja (Nice-to-have)

| # | Feature | Notas |
|---|---|---|
| 11 | RTL Support | Importante para mercados árabes/hebreos |
| 12 | Tree Data | Uso nicho, alta complejidad |
| 13 | Row DnD | Útil pero no estándar |
| 14 | Clipboard integration | Game-changer pero complejo |

---

## 💡 Patrones UX que Deberíamos Adoptar

### 1. Floating Filters (de AG Grid)
Filtros embebidos directamente en la fila de headers, debajo del título de columna. Eliminan el paso extra de abrir un dropdown/panel.

```
┌─────────────┬──────────┬──────────────┐
│ Nombre ▲    │ Precio   │ Categoría    │
│ [________]  │ [__-__]  │ [Todas ▼]    │  ← Floating filters
├─────────────┼──────────┼──────────────┤
│ Widget A    │ $29.99   │ Hardware     │
```

**Recomendación**: Agregar prop `floatingFilter: true` a la columna como alternativa al Filter Panel.

### 2. onChange Unificado (de Ant Design)
Un solo callback que recibe pagination + filters + sorter + action type:

```tsx
onChange={(pagination, filters, sorter, extra) => {
  // extra.action: 'paginate' | 'sort' | 'filter'
  fetchServerData({ pagination, filters, sorter });
}}
```

**Recomendación**: Agregar `onChange` unificado manteniendo los callbacks individuales.

### 3. Column Header Interactivo (de shadcn/ui)
Click en header: ordena. Dropdown en header: sort asc/desc, hide column, pin column.

```
┌──────────────────┐
│ Email        ▲ ⋮ │ ← Click ordena, ⋮ abre menú
├──────────────────┤   ┌─────────────────┐
│                  │   │ Asc             │
│                  │   │ Desc            │
│                  │   │ ─────────────── │
│                  │   │ Ocultar columna │
│                  │   └─────────────────┘
```

### 4. Auto-detect Column Type (de AG Grid)
Inferir el tipo de columna (`string`, `number`, `date`, `boolean`) desde los datos, para elegir automáticamente el filtro y formatter apropiado.

```tsx
// Hoy: requiere type manual
{ id: 'price', accessor: 'price', type: 'number' }
// Propuesto: inferir automáticamente
{ id: 'price', accessor: 'price' } // detecta que son números
```

### 5. Semantic classNames Granulares (de Ant Design)
Permit customizar cada parte semántica de la tabla:

```tsx
classNames={{
  header: { wrapper: 'my-header', row: 'my-header-row', cell: 'my-header-cell' },
  body: { wrapper: 'my-body', row: 'my-body-row', cell: 'my-body-cell' },
  footer: 'my-footer',
  pagination: { root: 'my-pagination', item: 'my-page-item' }
}}
```

---

## 🎯 Recomendaciones para el Roadmap

### v1.2 — "Feature Parity" (✅ Completado parcialmente)

| Feature | Justificación | Estado |
|---|---|---|
| Column Visibility Toggle | Todas las librerías lo tienen, es esperado | ✅ Implementado |
| Multi-Sort | Standard en tablas modernas | ✅ Implementado |
| Export CSV | Muy solicitado, bajo esfuerzo | Pendiente |
| `onChange` unificado | Simplifica server-side drastically | Pendiente |

### v1.3 — "Power User"

| Feature | Justificación |
|---|---|
| Inline Editing | Top requested feature en todas las librerías |
| Expandable Rows | Útil para master-detail sin navegación |
| Column Resize | Esperado en datasets amplios |
| Summary Rows | Diferenciador para apps financieras |

### v2.0 — "Enterprise Ready"

| Feature | Justificación |
|---|---|
| Virtualization | Necesario para >1000 rows |
| Column Pinning | Tablas anchas |
| Save/Restore State | Persistencia |
| Keyboard Navigation completa | Accesibilidad enterprise |

---

## 📝 Conclusión

BetterTable ocupa un nicho único entre las librerías analizadas: **declarativo y zero-config como Ant Design, pero más ligero y con features únicas** (Card View, Row Actions declarativas, Modal integration).

Nuestras ventajas competitivas principales son:
1. **Menor friction**: De 0 a tabla funcional en 1 línea
2. **Row Actions como sistema**: Ningún competidor tiene esto built-in
3. **Responsive cards**: Feature única en el mercado
4. **Bundle size competitivo**: ~50KB JS + ~25KB CSS vs AG Grid (>200KB)

Los gaps más críticos a cerrar son **Inline Editing** (la feature más demandada), **Expandable Rows** (detalle sin navegar), y **Export CSV** (feature esperada). Los gaps de **Column Visibility Toggle** y **Multi-Sort** ya fueron cerrados en v1.2.

La filosofía de BetterTable debe mantenerse: **declarativo > imperativo, convention over configuration, y zero-config como default**.

---

_Investigación realizada: Julio 2025_  
_Fuentes: Documentación oficial de TanStack Table, AG Grid, Ant Design, MUI X DataGrid, shadcn/ui_
