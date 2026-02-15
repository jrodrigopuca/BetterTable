# better-table

A modern, flexible, and fully typed data table component for React.

## 📚 Documentation

- **[Getting Started](https://github.com/jrodrigopuca/BetterTable#readme)** - Installation and basic usage
- **[Architecture](./docs/architecture.md)** - Design patterns and technical decisions
- **[Components](./docs/components.md)** - Detailed API reference
- **[Interaction Flows](./docs/interaction-flows.md)** - Sequence diagrams and component interactions
- **[Known Issues](./docs/known-issues.md)** - Known bugs and limitations

## 🚀 Quick Start

```bash
npm install better-table
```

```typescript
import { BetterTable } from 'better-table';
import 'better-table/styles.css';

const MyTable = () => {
  const data = [
    { id: 1, name: 'Juan', email: 'juan@example.com' },
    { id: 2, name: 'María', email: 'maria@example.com' }
  ];

  const columns = [
    { id: 'name', accessor: 'name', header: 'Name' },
    { id: 'email', accessor: 'email', header: 'Email' }
  ];

  return <BetterTable data={data} columns={columns} />;
};
```

For full documentation, see the [main README](https://github.com/jrodrigopuca/BetterTable#readme).
