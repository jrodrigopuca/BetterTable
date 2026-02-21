# Guía de Desarrollo

Guía para desarrolladores que quieran contribuir o extender BetterTable.

## 🛠️ Setup del Entorno de Desarrollo

### Prerrequisitos

- **Node.js**: >= 20.19.0 o >= 22.12.0
- **npm**: >= 8.0.0
- **Git**: Para control de versiones

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/jrodrigopuca/BetterTable.git
cd BetterTable/better-table

# Instalar dependencias
npm install

# Ejecutar demo en desarrollo
npm run dev

# En otra terminal, ejecutar tests en watch mode
npm run test
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Demo app con hot reload (http://localhost:5173)

# Building
npm run build            # Build de producción (dist/)
npm run build:types      # Solo generar tipos TypeScript

# Testing
npm run test             # Tests en watch mode
npm run test:run         # Tests una vez
npm run test:coverage    # Tests con coverage report

# Linting
npm run lint             # TypeScript type checking

# Publishing
npm run prepublishOnly   # Se ejecuta automáticamente antes de publish
```

---

## 📁 Estructura de Archivos

```
better-table/
├── src/
│   ├── components/
│   │   └── BetterTable/
│   │       ├── components/          # Componentes UI
│   │       │   ├── Table.tsx        # Componente principal
│   │       │   ├── TableHeader.tsx
│   │       │   ├── TableBody.tsx
│   │       │   ├── TableRow.tsx
│   │       │   ├── TableCell.tsx
│   │       │   ├── TableHeaderCell.tsx
│   │       │   ├── TableFilterPanel.tsx  # Panel colapsable de filtros
│   │       │   ├── TablePagination.tsx
│   │       │   ├── TableToolbar.tsx
│   │       │   ├── TableActions.tsx
│   │       │   ├── TableModal.tsx
│   │       │   ├── TableLoading.tsx
│   │       │   ├── TableEmpty.tsx
│   │       │   ├── TableCards.tsx    # Vista cards (mobile)
│   │       │   ├── TableCard.tsx     # Card individual
│   │       │   └── index.ts
│   │       │
│   │       ├── context/             # State management
│   │       │   ├── TableContext.tsx
│   │       │   └── index.ts
│   │       │
│   │       ├── hooks/               # Custom hooks
│   │       │   ├── useTableSort.ts
│   │       │   ├── useTableFilter.ts
│   │       │   ├── useTableSearch.ts
│   │       │   ├── useTableSelection.ts
│   │       │   ├── useTablePagination.ts
│   │       │   └── index.ts
│   │       │
│   │       ├── utils/               # Utilidades
│   │       │   ├── sortData.ts
│   │       │   ├── filterData.ts
│   │       │   ├── getValueFromPath.ts
│   │       │   └── index.ts
│   │       │
│   │       ├── styles/              # CSS
│   │       │   ├── variables.css    # CSS variables
│   │       │   ├── table.css        # Tabla + filter panel
│   │       │   ├── toolbar.css      # Toolbar + filter toggle
│   │       │   ├── pagination.css
│   │       │   ├── modal.css
│   │       │   └── index.css        # Import all
│   │       │
│   │       ├── __tests__/           # Tests (18 archivos, 87 tests)
│   │       │   ├── helpers/
│   │       │   │   └── test-data.ts
│   │       │   ├── rendering.test.tsx
│   │       │   ├── sorting.test.tsx
│   │       │   ├── filtering.test.tsx
│   │       │   ├── date-filter.test.tsx
│   │       │   ├── search.test.tsx
│   │       │   ├── search-debounce.test.tsx
│   │       │   ├── pagination.test.tsx
│   │       │   ├── selection.test.tsx
│   │       │   ├── row-actions.test.tsx
│   │       │   ├── action-overflow.test.tsx
│   │       │   ├── modal.test.tsx
│   │       │   ├── loading.test.tsx
│   │       │   ├── custom-rendering.test.tsx
│   │       │   ├── nested-data.test.tsx
│   │       │   ├── callbacks.test.tsx
│   │       │   ├── accessibility.test.tsx
│   │       │   ├── responsive-cards.test.tsx
│   │       │   └── toolbar-responsive.test.tsx
│   │       │
│   │       ├── types.ts             # TypeScript types + locales
│   │       ├── index.ts             # Public exports
│   │       ├── PLAN.md
│   │       └── README.md
│   │
│   ├── index.ts                     # Entry point
│   ├── styles.ts                    # CSS export
│   ├── setupTests.ts                # Vitest setup
│   └── vitest.d.ts                  # Vitest types
│
├── demo/                            # Demo application
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── vite.config.ts
│
├── docs/                            # Documentation
│   ├── README.md
│   ├── architecture.md
│   ├── components.md
│   ├── development.md
│   ├── interaction-flows.md
│   ├── known-issues.md
│   ├── RESPONSIVE_PLAN.md
│   └── ROADMAP.md
│
├── dist/                            # Build output (gitignored)
│
├── package.json
├── tsconfig.json                    # TypeScript config
├── tsconfig.build.json              # Build config
├── vite.config.ts                   # Vite config (lib)
├── vitest.config.ts                 # Vitest config
├── LICENSE
└── README.md
```

---

## 🎨 Convenciones de Código

### TypeScript

#### Tipos e Interfaces

```typescript
// ✅ Usar PascalCase para tipos/interfaces
interface UserData extends TableData {
	id: number;
	name: string;
}

// ✅ Usar type para unions/intersections
type SortDirection = "asc" | "desc" | null;

// ✅ Exportar tipos con la definición
export interface Column<T> {
	/* ... */
}

// ❌ Evitar any
const value: any = getData(); // ❌
const value: unknown = getData(); // ✅
```

#### Genéricos

```typescript
// ✅ Usar T para tipo de dato de la tabla
function MyComponent<T extends TableData>(props: Props<T>) {
	// ...
}

// ✅ Constraint con extends
interface Props<T extends TableData = TableData> {
	data: T[];
}
```

#### Props

```typescript
// ✅ Definir interface para props
interface TableRowProps<T extends TableData> {
	row: T;
	index: number;
	columns: Column<T>[];
}

// ✅ Usar destructuring
function TableRow<T extends TableData>({
	row,
	index,
	columns,
}: TableRowProps<T>) {
	// ...
}
```

### React

#### Componentes Funcionales

```typescript
// ✅ Arrow function con tipado explícito
export const TableRow = <T extends TableData>({
  row,
  index
}: TableRowProps<T>): JSX.Element => {
  return <tr>...</tr>;
};

// ✅ O function declaration
export function TableRow<T extends TableData>(
  props: TableRowProps<T>
) {
  return <tr>...</tr>;
}
```

#### Hooks

```typescript
// ✅ Tipado explícito en useState
const [data, setData] = useState<User[]>([]);

// ✅ Dependencies completas en useEffect
useEffect(() => {
	// ...
}, [dependency1, dependency2]);

// ✅ useMemo para cálculos costosos
const sortedData = useMemo(() => {
	return sortData(data, sortState);
}, [data, sortState]);

// ✅ useCallback para funciones
const handleClick = useCallback((id: string) => {
	// ...
}, []);
```

#### Event Handlers

```typescript
// ✅ Tipado de eventos
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
	event.preventDefault();
	// ...
};

// ✅ Naming: handle* para definición, on* para props
interface Props {
	onRowClick?: (row: User) => void; // Prop
}

function Component({ onRowClick }: Props) {
	const handleRowClick = () => {
		// Handler interno
		onRowClick?.(row);
	};
}
```

### CSS

#### Naming Convention

```css
/* BEM-like con prefijo bt- (BetterTable) */
.bt-container {
} /* Block */
.bt-container--loading {
} /* Block modifier */
.bt-table {
} /* Element */
.bt-table__header {
} /* Element */
.bt-table__header--sorted {
} /* Element modifier */

/* Estados con is- */
.bt-row.is-selected {
}
.bt-button.is-disabled {
}

/* Tamaños */
.bt-table--small {
}
.bt-table--medium {
}
.bt-table--large {
}
```

#### Variables CSS

```css
/* Usar variables para valores reutilizables */
:root {
	--bt-primary-color: #1890ff;
	--bt-border-color: #d9d9d9;
	--bt-border-radius: 4px;
	--bt-spacing-xs: 4px;
	--bt-spacing-sm: 8px;
	--bt-spacing-md: 16px;
	--bt-spacing-lg: 24px;
}

/* Usar en estilos */
.bt-table {
	border: 1px solid var(--bt-border-color);
	border-radius: var(--bt-border-radius);
	padding: var(--bt-spacing-md);
}
```

---

## 🧪 Testing

### Estructura de Tests

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BetterTable } from './index';

describe('BetterTable', () => {
  // Setup común
  const mockData = [
    { id: 1, name: 'Juan' },
    { id: 2, name: 'María' }
  ];

  const mockColumns = [
    { id: 'name', accessor: 'name', header: 'Nombre' }
  ];

  describe('Renderizado básico', () => {
    it('renderiza la tabla con datos', () => {
      render(<BetterTable data={mockData} columns={mockColumns} />);

      expect(screen.getByText('Juan')).toBeInTheDocument();
      expect(screen.getByText('María')).toBeInTheDocument();
    });
  });

  describe('Interacciones', () => {
    it('ordena al hacer click en header', async () => {
      const user = userEvent.setup();
      render(<BetterTable data={mockData} columns={mockColumns} />);

      const header = screen.getByRole('columnheader', { name: /nombre/i });
      await user.click(header);

      // Verificar ordenamiento
      expect(screen.getByText('Juan')).toBeInTheDocument();
    });
  });
});
```

### Best Practices de Testing

#### 1. Usar Testing Library Queries

```typescript
// ✅ Preferir queries accesibles
screen.getByRole("button", { name: /submit/i });
screen.getByLabelText(/email/i);
screen.getByText(/loading/i);

// ❌ Evitar queries frágiles
screen.getByTestId("submit-button");
screen.getByClassName("btn-primary");
```

#### 2. User Events vs FireEvent

```typescript
// ✅ Usar userEvent (simula interacción real)
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();
await user.click(button);
await user.type(input, "text");

// ❌ Evitar fireEvent (bajo nivel)
fireEvent.click(button);
```

#### 3. Async Testing

```typescript
// ✅ Usar waitFor para aserciones asíncronas
await waitFor(() => {
	expect(screen.getByText("Loaded")).toBeInTheDocument();
});

// ✅ Usar findBy para esperar elementos
const element = await screen.findByText("Loaded");
```

#### 4. Mocks

```typescript
// ✅ Mock de callbacks
const onRowClick = vi.fn();
render(<BetterTable onRowClick={onRowClick} />);

await user.click(row);
expect(onRowClick).toHaveBeenCalledWith(mockRow, 0);

// ✅ Mock de módulos
vi.mock('./utils/sortData', () => ({
  sortData: vi.fn((data) => data)
}));
```

### Ejecutar Tests

```bash
# Watch mode (desarrollo)
npm run test

# Una vez (CI)
npm run test:run

# Con coverage
npm run test:coverage

# Coverage en navegador
npm run test:coverage
open coverage/index.html
```

---

## 🔨 Añadir Nueva Funcionalidad

### Checklist

1. **Diseño**
   - [ ] Definir API (props, types, behavior)
   - [ ] Documentar en `docs/components.md`
   - [ ] Crear issue en GitHub

2. **Implementación**
   - [ ] Implementar lógica (hook o utility)
   - [ ] Crear/modificar componente UI
   - [ ] Añadir estilos CSS
   - [ ] Exportar en `index.ts`

3. **Testing**
   - [ ] Unit tests para lógica
   - [ ] Integration tests para componente
   - [ ] Test cobertura >80%

4. **Documentación**
   - [ ] Actualizar `docs/components.md`
   - [ ] Añadir ejemplo en demo app
   - [ ] Actualizar README si necesario

5. **Review**
   - [ ] Ejecutar `npm run lint`
   - [ ] Ejecutar `npm run test:run`
   - [ ] Ejecutar `npm run build`
   - [ ] Verificar demo funciona

### Ejemplo: Añadir Column Hiding

#### 1. Definir Tipos

```typescript
// src/components/BetterTable/types.ts
export interface Column<T> {
	// ... existing props
	hidden?: boolean; // ← Nueva prop
}

export interface TableClassNames {
	// ... existing
	hiddenColumn?: string; // ← Nueva clase
}
```

#### 2. Crear Hook (si es necesario)

```typescript
// src/components/BetterTable/hooks/useColumnVisibility.ts
export function useColumnVisibility<T extends TableData>(columns: Column<T>[]) {
	const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(
		new Set(columns.filter((c) => c.hidden).map((c) => c.id)),
	);

	const toggleColumn = (columnId: string) => {
		setHiddenColumns((prev) => {
			const next = new Set(prev);
			if (next.has(columnId)) {
				next.delete(columnId);
			} else {
				next.add(columnId);
			}
			return next;
		});
	};

	const visibleColumns = columns.filter((c) => !hiddenColumns.has(c.id));

	return { visibleColumns, hiddenColumns, toggleColumn };
}
```

#### 3. Integrar en Componente

```typescript
// src/components/BetterTable/components/Table.tsx
export const BetterTable = <T extends TableData>(
  props: BetterTableProps<T>
) => {
  const { visibleColumns, toggleColumn } = useColumnVisibility(columns);

  return (
    <TableProvider>
      {/* Usar visibleColumns en lugar de columns */}
      <TableHeader columns={visibleColumns} />
      <TableBody columns={visibleColumns} />
    </TableProvider>
  );
};
```

#### 4. Añadir Tests

```typescript
// src/components/BetterTable/BetterTable.test.tsx
describe('Column Visibility', () => {
  it('oculta columnas con hidden=true', () => {
    const columns = [
      { id: 'name', accessor: 'name', header: 'Name' },
      { id: 'email', accessor: 'email', header: 'Email', hidden: true }
    ];

    render(<BetterTable data={data} columns={columns} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.queryByText('Email')).not.toBeInTheDocument();
  });
});
```

#### 5. Actualizar Documentación

```markdown
<!-- docs/components.md -->

### Column Visibility

Control visibility of columns.

#### Props

- `hidden?: boolean` - Hide column by default

#### Example

\`\`\`typescript
{
id: 'email',
accessor: 'email',
header: 'Email',
hidden: true // ← Hidden by default
}
\`\`\`
```

---

## 🚀 Publicación

### Pre-publish Checklist

- [ ] Tests passing: `npm run test:run`
- [ ] Build exitoso: `npm run build`
- [ ] Lint clean: `npm run lint`
- [ ] Documentación actualizada
- [ ] CHANGELOG.md actualizado
- [ ] Version bump en package.json

### Proceso de Publicación

```bash
# 1. Actualizar versión (patch, minor, o major)
npm version patch  # 1.0.1 → 1.0.2
npm version minor  # 1.0.1 → 1.1.0
npm version major  # 1.0.1 → 2.0.0

# 2. Esto ejecuta automáticamente prepublishOnly (build)

# 3. Publicar a npm
npm publish

# 4. Push con tags
git push origin main --tags

# 5. Crear GitHub Release
# Ve a GitHub → Releases → Draft new release
# Tag: v1.0.2
# Title: v1.0.2
# Description: (Copy from CHANGELOG)
```

### Versionado Semántico

- **Patch** (1.0.x): Bugfixes, sin cambios en API
- **Minor** (1.x.0): Nuevas features, backwards compatible
- **Major** (x.0.0): Breaking changes

---

## 🐛 Debugging

### Debug en Demo App

```typescript
// demo/src/App.tsx
<BetterTable
  data={data}
  columns={columns}
  onSort={(state) => {
    console.log('Sort state:', state);  // ← Debug
  }}
/>
```

### Debug en Tests

```typescript
// BetterTable.test.tsx
import { screen } from '@testing-library/react';

it('debug test', () => {
  render(<BetterTable data={data} columns={columns} />);

  // Ver DOM completo
  screen.debug();

  // Ver elemento específico
  screen.debug(screen.getByRole('table'));
});
```

### React DevTools

Instala [React DevTools](https://react.dev/learn/react-developer-tools) para:

- Inspeccionar component tree
- Ver props y state
- Profiler para performance

---

## 📚 Recursos

### Documentación Oficial

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)

### Guías Internas

- [Architecture](./architecture.md)
- [Components](./components.md)
- [Interaction Flows](./interaction-flows.md)
- [Known Issues](./known-issues.md)

### Herramientas

- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [Bundlephobia](https://bundlephobia.com/) - Package size analysis

---

## 💬 Obtener Ayuda

- **GitHub Issues**: Para bugs y feature requests
- **GitHub Discussions**: Para preguntas y discusiones
- **Email**: juan@example.com (maintainer)

---

## 🤝 Contribuir

Ver [CONTRIBUTING.md](../CONTRIBUTING.md) para guidelines completas.

¡Gracias por contribuir a BetterTable! 🎉
