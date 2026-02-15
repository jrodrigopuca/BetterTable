# BetterTable - Documentación Técnica

Documentación completa de la arquitectura, componentes y flujos de interacción del proyecto BetterTable.

## 📚 Contenido

### [1. Arquitectura](./architecture.md)

Descripción de la arquitectura general del proyecto, patrones de diseño utilizados y decisiones técnicas.

### [2. Componentes](./components.md)

Documentación detallada de todos los componentes, hooks y utilidades del proyecto.

### [3. Flujos de Interacción](./interaction-flows.md)

Diagramas de secuencia y explicación de las interacciones entre componentes.

### [4. Problemas Conocidos](./known-issues.md)

Lista de problemas conocidos, limitaciones y soluciones temporales.

### [5. Guía de Desarrollo](./development.md)

Guía completa para desarrolladores: setup, convenciones, testing y cómo contribuir.

### [6. Responsive (Plan e Implementación)](./RESPONSIVE_PLAN.md)

Documentación de la estrategia responsive: breakpoints, card layout para móvil y CSS media queries.

### [7. Roadmap de Mejoras](./ROADMAP.md)

Ideas y planes para futuras mejoras: edición inline, formatters, badges, drag & drop, y más.

## 🚀 Inicio Rápido

Para comprender el proyecto:

1. Lee primero la [Arquitectura](./architecture.md) para entender la estructura general
2. Revisa [Componentes](./components.md) para conocer cada pieza del sistema
3. Consulta [Flujos de Interacción](./interaction-flows.md) para entender cómo funcionan las características
4. Verifica [Problemas Conocidos](./known-issues.md) antes de reportar bugs
5. Si quieres contribuir, lee la [Guía de Desarrollo](./development.md)

## 📦 Estructura del Proyecto

```
better-table/
├── src/
│   ├── components/
│   │   └── BetterTable/
│   │       ├── components/      # Componentes UI
│   │       ├── context/         # Context API
│   │       ├── hooks/           # Custom Hooks
│   │       ├── utils/           # Utilidades
│   │       ├── styles/          # Estilos CSS
│   │       └── types.ts         # Definiciones TypeScript
│   ├── index.ts                 # Punto de entrada principal
│   └── styles.ts                # Exportación de estilos
├── demo/                        # Aplicación demo
├── docs/                        # Documentación técnica
└── dist/                        # Archivos compilados
```

## 🛠️ Tecnologías

- **React 19** - Framework principal
- **TypeScript 5.9** - Tipado estático
- **Vite 7** - Build tool
- **Vitest 4** - Testing framework
- **CSS Modules** - Estilos encapsulados

## 📝 Convenciones

### Nomenclatura

- **Componentes**: PascalCase (ej: `TableHeader`)
- **Hooks**: camelCase con prefijo `use` (ej: `useTableSort`)
- **Utilidades**: camelCase (ej: `getValueFromPath`)
- **Tipos**: PascalCase (ej: `TableData`)

### Organización de Código

- Un componente por archivo
- Exportaciones nominales preferidas sobre default
- Props interface siempre definida
- Tests co-localizados con componentes

## 🤝 Contribución

Al trabajar en el proyecto:

1. Mantén la documentación actualizada
2. Añade tests para nuevas funcionalidades
3. Sigue los patrones establecidos
4. Actualiza `known-issues.md` si encuentras bugs
