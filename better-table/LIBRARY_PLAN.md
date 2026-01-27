# Plan: Convertir BetterTable en React Component Library

## Objetivo

Transformar el proyecto actual en una biblioteca de componentes React publicable en npm, con soporte completo de TypeScript, tree-shaking, y documentación interactiva.

---

## Fase 1: Reestructuración del Proyecto

### 1.1 Nueva Estructura de Carpetas

```
better-table/
├── src/
│   ├── components/
│   │   └── BetterTable/
│   │       ├── components/        # Sub-componentes
│   │       ├── hooks/             # Hooks exportables
│   │       ├── context/           # Context providers
│   │       ├── utils/             # Utilidades internas
│   │       ├── styles/            # CSS
│   │       ├── types.ts           # Tipos TypeScript
│   │       └── index.ts           # Exports públicos
│   └── index.ts                   # Entry point principal
├── demo/                          # App de demostración (separada)
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── vite.config.ts
├── dist/                          # Build output
├── docs/                          # Documentación con Storybook
├── package.json
├── tsconfig.json
├── tsconfig.build.json            # Config para build de library
├── vite.config.ts                 # Config para library build
└── README.md
```

### 1.2 Separar Demo de Library

- Mover `App.tsx`, `index.html`, `main.tsx` a carpeta `demo/`
- El source principal (`src/`) solo contendrá el código de la biblioteca
- Demo será una app separada que consume la library localmente

---

## Fase 2: Configuración de Build

### 2.1 Vite Library Mode

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BetterTable',
      formats: ['es', 'cjs'],
      fileName: (format) => `better-table.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        preserveModules: true,        // Tree-shaking
        preserveModulesRoot: 'src',
      },
    },
    sourcemap: true,
    minify: 'esbuild',
  },
});
```

### 2.2 TypeScript Config para Build

```json
// tsconfig.build.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": false,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["**/*.test.ts", "**/*.test.tsx", "demo", "node_modules"]
}
```

### 2.3 Package.json para Library

```json
{
  "name": "@juandev/better-table",
  "version": "1.0.0",
  "description": "A modern, flexible, and fully typed React data table component",
  "author": "Juan",
  "license": "MIT",
  "type": "module",
  "main": "./dist/better-table.cjs.js",
  "module": "./dist/better-table.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/better-table.es.js"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/better-table.cjs.js"
      }
    },
    "./styles.css": "./dist/styles.css"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "sideEffects": [
    "**/*.css"
  ],
  "keywords": [
    "react",
    "table",
    "data-table",
    "datagrid",
    "typescript",
    "sorting",
    "filtering",
    "pagination"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/juandev/better-table.git"
  },
  "bugs": {
    "url": "https://github.com/juandev/better-table/issues"
  },
  "homepage": "https://github.com/juandev/better-table#readme",
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "vite-plugin-dts": "^4.0.0",
    "vitest": "^2.0.0"
  },
  "scripts": {
    "dev": "vite --config demo/vite.config.ts",
    "build": "tsc -p tsconfig.build.json && vite build",
    "build:types": "tsc -p tsconfig.build.json --emitDeclarationOnly",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint src --ext .ts,.tsx",
    "prepublishOnly": "npm run build",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

---

## Fase 3: CSS y Estilos

### 3.1 Estrategia de Estilos

**Opción A: CSS puro (Recomendado para libraries)**
- Un archivo CSS con todas las variables
- El usuario importa: `import '@juandev/better-table/styles.css'`
- Fácil de sobrescribir con CSS Variables

**Opción B: CSS-in-JS (Opcional)**
- Usar emotion/styled-components
- Estilos embebidos, no requiere import de CSS
- Mayor bundle size

### 3.2 Exportar CSS

```typescript
// vite.config.ts - agregar plugin para CSS
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// O mantener CSS separado y documentar el import
```

### 3.3 CSS Variables Customizables

```css
/* Variables con prefijo para evitar colisiones */
:root {
  --bt-primary: #3b82f6;
  --bt-font-family: inherit;  /* Hereda del proyecto padre */
  /* ... */
}
```

---

## Fase 4: Exports Públicos

### 4.1 Entry Point Principal

```typescript
// src/index.ts

// Componente principal
export { BetterTable } from './components/BetterTable';
export { default } from './components/BetterTable';

// Tipos
export type {
  BetterTableProps,
  Column,
  RowAction,
  GlobalAction,
  PaginationConfig,
  SortState,
  FilterState,
  TableClassNames,
  TableLocale,
  TableData,
} from './components/BetterTable/types';

// Hooks (para uso avanzado)
export {
  useTableSort,
  useTableFilter,
  useTablePagination,
  useTableSelection,
  useTableSearch,
} from './components/BetterTable/hooks';

// Context (para sub-componentes custom)
export {
  useTableContext,
  TableProvider,
} from './components/BetterTable/context';
export type { TableContextValue } from './components/BetterTable/context';

// Utilidades
export { getValueFromPath } from './components/BetterTable/utils';

// Constantes
export { defaultLocale } from './components/BetterTable/types';
```

---

## Fase 5: Testing

### 5.1 Configuración de Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['demo/**', 'docs/**'],
    },
  },
});
```

### 5.2 Tests a Implementar

- [ ] Unit tests para hooks
- [ ] Unit tests para utilities
- [ ] Integration tests para componentes
- [ ] Snapshot tests para renderizado
- [ ] Accessibility tests con @testing-library

---

## Fase 6: Documentación

### 6.1 Storybook

```bash
npx storybook@latest init
```

**Stories a crear:**
- `BetterTable.stories.tsx` - Casos de uso principales
- `Filtering.stories.tsx` - Ejemplos de filtrado
- `Sorting.stories.tsx` - Ejemplos de ordenamiento
- `Selection.stories.tsx` - Ejemplos de selección
- `CustomCells.stories.tsx` - Renderizado personalizado
- `Actions.stories.tsx` - Acciones de fila y globales
- `Theming.stories.tsx` - Personalización de estilos

### 6.2 Documentación en Código

- JSDoc en todas las interfaces y funciones públicas
- README.md completo con ejemplos
- CHANGELOG.md para versiones
- CONTRIBUTING.md para contribuciones

---

## Fase 7: CI/CD y Publicación

### 7.1 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test:run
      - run: npm run build

  publish:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 7.2 Semantic Versioning

- Usar conventional commits
- Configurar semantic-release o release-it

---

## Fase 8: Checklist Pre-Publicación

### 8.1 Calidad

- [ ] Todos los tests pasan
- [ ] Coverage > 80%
- [ ] Sin errores de TypeScript
- [ ] Sin errores de ESLint
- [ ] Bundle size optimizado (< 50KB gzipped)

### 8.2 Documentación

- [ ] README.md completo
- [ ] API Reference documentada
- [ ] Ejemplos de código
- [ ] Storybook deployado
- [ ] CHANGELOG actualizado

### 8.3 Package

- [ ] `package.json` con todos los campos
- [ ] Tipos correctamente exportados
- [ ] CSS exportado
- [ ] `files` field correcto
- [ ] `peerDependencies` definidos

### 8.4 Compatibilidad

- [ ] Funciona con React 18+
- [ ] Funciona con React 19
- [ ] Tree-shaking funcional
- [ ] SSR compatible (Next.js)

---

## Orden de Implementación Recomendado

1. **Semana 1**: Fase 1 + Fase 2 (Reestructurar y configurar build)
2. **Semana 2**: Fase 3 + Fase 4 (CSS y exports)
3. **Semana 3**: Fase 5 (Testing completo)
4. **Semana 4**: Fase 6 (Documentación y Storybook)
5. **Semana 5**: Fase 7 + Fase 8 (CI/CD y publicación)

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev              # Demo local
npm run storybook        # Documentación interactiva

# Build
npm run build            # Build de producción
npm run build:types      # Solo tipos

# Testing
npm test                 # Watch mode
npm run test:run         # Single run
npm run test:coverage    # Con coverage

# Publicación
npm version patch/minor/major
npm publish --access public
```

---

## Dependencias Adicionales Necesarias

```bash
# Build
npm install -D vite-plugin-dts

# Testing
npm install -D vitest @vitest/coverage-v8 jsdom

# Storybook
npx storybook@latest init

# Linting
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser

# (Opcional) CSS-in-JS
npm install @emotion/react @emotion/styled
```
