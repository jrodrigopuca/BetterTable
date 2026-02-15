# Problemas Conocidos (Known Issues)

Lista de problemas conocidos, limitaciones y workarounds en BetterTable.

## 🐛 Bugs Conocidos

### 1. Tests Fallando con Testing Library Matchers

**Estado:** 🔴 Activo

**Descripción:**
7 tests están fallando debido a problemas con los matchers de `@testing-library/jest-dom` en Vitest.

**Tests Afectados:**

- `aplica estilos personalizados correctamente`
- `muestra contador de elementos seleccionados`
- `filtra por número en columna numérica`
- `busca en todas las columnas configuradas`
- `ordena por columna al hacer click en header`
- `accede a propiedades anidadas con dot notation`
- `tiene atributos ARIA correctos`

**Causa:**
Configuración incompleta de TypeScript types para los matchers de jest-dom en Vitest.

**Workaround:**

```typescript
// Los tests funcionan en runtime, solo fallan en TypeScript
// Los matchers como toBeInTheDocument() funcionan correctamente
```

**Solución Planeada:**

- [ ] Actualizar configuración de vitest
- [ ] Añadir types correctos a tsconfig.json
- [ ] Verificar compatibilidad con @testing-library/jest-dom v6.6.3

**Referencias:**

- Issue: Configuración TypeScript/Vitest
- Archivo: `tsconfig.json`, `vitest.config.ts`

---

### 2. Rendimiento con Grandes Datasets (>10,000 filas)

**Estado:** 🟡 Limitación Conocida

**Descripción:**
La tabla puede experimentar lag al renderizar más de 10,000 filas sin virtualización.

**Impacto:**

- Renderizado inicial lento (>2s)
- Scroll no fluido
- Alto uso de memoria

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
```

**Solución Planeada:**

- [ ] Implementar virtualización (react-window o react-virtual)
- [ ] Lazy rendering de filas
- [ ] Infinite scroll como alternativa a paginación

**Estimación:** v1.2.0

---

### 3. Filtrado de Columnas Tipo Date

**Estado:** 🟡 Feature Incompleta

**Descripción:**
Las columnas tipo `date` no tienen un filtro especializado, se tratan como strings.

**Comportamiento Actual:**

```typescript
{
  id: 'createdAt',
  accessor: 'createdAt',
  type: 'date',  // ← Solo afecta display, no filtrado
  filterable: true  // ← Input de texto genérico
}
```

**Workaround:**

```typescript
// Usar filtrado custom en el componente padre
const [filteredData, setFilteredData] = useState(data);

// Filtrar antes de pasar a BetterTable
<BetterTable data={filteredData} columns={columns} />
```

**Solución Planeada:**

- [ ] DatePicker para filtrado de fechas
- [ ] Range selector (desde/hasta)
- [ ] Presets (hoy, esta semana, este mes)

**Estimación:** v1.3.0

---

### 4. Exportación de Datos

**Estado:** 🔴 No Implementada

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

**Descripción:**
Filtrado, búsqueda y ordenamiento son siempre client-side.

**Impacto:**
No es ideal para datasets que viven en el servidor (ej: APIs con paginación).

**Workaround Actual:**

```typescript
// Manejar en componente padre
const [data, setData] = useState([]);
const [page, setPage] = useState(1);

useEffect(() => {
  fetch(`/api/users?page=${page}&sort=${sortState}`)
    .then(res => res.json())
    .then(setData);
}, [page, sortState]);

<BetterTable
  data={data}
  pagination={{
    page,
    onPageChange: setPage,
    totalItems: serverTotalCount  // ← No implementado aún
  }}
/>
```

**Solución Planeada:**

- [ ] Prop `serverSide: boolean`
- [ ] Callbacks: `onServerFilter`, `onServerSort`, `onServerSearch`
- [ ] Loading states automáticos

**Estimación:** v2.0.0 (Breaking change)

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

**Descripción:**
La tabla no es completamente responsive en móviles pequeños.

**Problemas:**

- Overflow horizontal sin feedback visual
- Acciones difíciles de clickear
- Filtros ocupan mucho espacio

**Workaround:**

```css
/* Wrapper con scroll */
.table-wrapper {
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;
}

/* Columnas prioritarias visibles */
@media (max-width: 768px) {
	.bt-td:not(.priority-column) {
		display: none;
	}
}
```

**Solución Planeada:**

- [ ] Card view en móviles
- [ ] Prioridad de columnas
- [ ] Sticky first column
- [ ] Bottom sheet para filtros

**Estimación:** v1.7.0

---

## 🔧 Problemas de Configuración

### 1. TypeScript Strict Mode

**Descripción:**
Algunos tipos pueden causar errores en strict mode extremo.

**Ejemplo:**

```typescript
// Error en tsconfig con strictNullChecks
const value = getValueFromPath(row, "nested.path");
// value puede ser undefined, requiere null check
```

**Solución:**

```typescript
// Siempre verificar undefined
const value = getValueFromPath(row, "nested.path");
if (value !== undefined) {
	// Usar value
}
```

---

### 2. CSS Conflicts

**Descripción:**
Estilos globales pueden interferir con estilos de BetterTable.

**Conflictos Comunes:**

```css
/* Puede romper layout */
* {
	box-sizing: content-box !important;
}

/* Puede afectar tipografía */
table {
	font-size: 20px;
}
```

**Solución:**

```css
/* Aumentar especificidad */
.bt-container .bt-table {
	font-size: 14px !important;
}
```

**Mejor Práctica:**

```typescript
// Usar CSS Modules o Styled Components
import styles from './MyTable.module.css';

<div className={styles.wrapper}>
  <BetterTable ... />
</div>
```

---

## 🚧 Roadmap de Fixes

### v1.0.2 (Patch - Próximo)

- [x] Actualizar dependencias
- [ ] Fix tests de TypeScript
- [ ] Documentación mejorada
- [ ] Performance: evitar re-renders innecesarios

### v1.1.0 (Minor)

- [ ] Date filtering
- [ ] Column hiding/showing
- [ ] Export básico (CSV)
- [ ] Mobile improvements

### v1.2.0 (Minor)

- [ ] Virtualización
- [ ] Column resizing
- [ ] Advanced filtering

### v2.0.0 (Major)

- [ ] Server-side operations
- [ ] Breaking changes necesarios
- [ ] Reescritura de arquitectura si necesario

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
