# Contributing to better-table

Thanks for your interest in contributing! This guide covers everything you need to get started.

## Prerequisites

- **Node.js** 20 or higher
- **pnpm** 10 or higher — install with `npm install -g pnpm` or [other methods](https://pnpm.io/installation)

## Project Setup

```bash
# Clone the repository
git clone https://github.com/jrodrigopuca/BetterTable.git
cd BetterTable

# Install all dependencies (both packages)
pnpm install
```

This is a **pnpm workspace monorepo** with two packages:

| Package | Path | Description |
| --- | --- | --- |
| `better-table` | `better-table/` | The library (published to npm) |
| `better-table-storybook` | `storybook/` | Interactive documentation (deployed to GitHub Pages) |

## Development Workflow

### Common Commands (from repo root)

```bash
pnpm dev              # Run demo app
pnpm test             # Run tests (watch mode)
pnpm test:run         # Run tests (single run)
pnpm lint             # Type check (tsc --noEmit)
pnpm build            # Build library
pnpm storybook        # Storybook dev server (port 6006)
pnpm build-storybook  # Storybook production build
```

### Package-specific Commands

You can also run commands directly in a specific package:

```bash
# Run tests with coverage
pnpm --filter better-table test:coverage

# Build storybook only
pnpm --filter better-table-storybook build-storybook
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/my-feature
# or
git checkout -b fix/my-bugfix
```

### 2. Write Code

The library source lives in `better-table/src/components/BetterTable/`:

```
better-table/src/components/BetterTable/
├── components/    # Table sub-components (TableRow, TableHeader, etc.)
├── context/       # 6 focused React contexts
├── hooks/         # Custom hooks (useTableSort, useColumnResize, etc.)
├── styles/        # CSS styles
├── utils/         # Helper functions
├── types.ts       # All TypeScript types and interfaces
└── __tests__/     # Tests
```

The public API is exported from `better-table/src/index.ts`.

### 3. Write Tests

- Tests use **Vitest** + **Testing Library**
- Test files go in `better-table/src/components/BetterTable/__tests__/`
- Name format: `feature-name.test.tsx`

```bash
# Run tests in watch mode while developing
pnpm test

# Run all tests once
pnpm test:run
```

### 4. Verify Everything Passes

Before submitting, make sure:

```bash
pnpm lint       # No type errors
pnpm test:run   # All tests pass
pnpm build      # Library builds successfully
```

### 5. Submit a Pull Request

```bash
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

Then open a Pull Request on GitHub. CI will run type check, tests, and build automatically.

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
| --- | --- |
| `feat:` | New feature |
| `fix:` | Bug fix |
| `chore:` | Maintenance (deps, CI, config) |
| `docs:` | Documentation only |
| `test:` | Adding or updating tests |
| `refactor:` | Code change that doesn't add features or fix bugs |

## Adding a Storybook Story

If your feature is user-facing, add a story in `storybook/src/stories/`:

1. Create `FeatureName.stories.tsx`
2. Import shared test data from `storybook/src/data.tsx` (or add new data there)
3. Verify it renders: `pnpm storybook`

## Code Style Guidelines

- **TypeScript strict mode** — no `any`, no implicit types
- **CSS** — use CSS variables (`--bt-*`) for theming, BEM-like class names (`.bt-*`)
- **Components** — functional components only, no class components
- **Hooks** — custom hooks in `hooks/`, exported from `hooks/index.ts`
- **Types** — all public types in `types.ts`, exported from `src/index.ts`
- **Tests** — test behavior, not implementation. Use Testing Library queries.

---

## Publishing to npm (Maintainers Only)

### Prerequisites

1. **npm account** with publish access to the `better-table` package
2. Login: `npm login` → verify with `npm whoami`

### Publish Checklist

```bash
# 1. Make sure everything passes
pnpm lint
pnpm test:run
pnpm build

# 2. Verify what will be published
cd better-table
pnpm pack --dry-run
```

You should see only:

```
dist/
README.md
LICENSE
package.json
```

### Version Bump

Update the version in `better-table/package.json` following [semver](https://semver.org/):

| Change | Version bump | Example |
| --- | --- | --- |
| Bug fixes (backwards-compatible) | `patch` | 1.3.0 → 1.3.1 |
| New features (backwards-compatible) | `minor` | 1.3.0 → 1.4.0 |
| Breaking changes | `major` | 1.3.0 → 2.0.0 |

Also update `CHANGELOG.md` with the new version entry.

### Publish

```bash
cd better-table
pnpm publish
```

For scoped packages:

```bash
pnpm publish --access public
```

### Post-Publish Verification

```bash
# Check it's live
npm info better-table

# Test in a fresh project
mkdir /tmp/test-bt && cd /tmp/test-bt
npm init -y
npm install better-table
```

### Troubleshooting

| Error | Solution |
| --- | --- |
| "You do not have permission to publish" | Package name taken — use a scope `@user/better-table` |
| "402 Payment Required" | Add `--access public` for scoped packages |
| "This package requires 2FA" | Enable 2FA on npm or use an automation token |

### Useful npm Commands

```bash
npm whoami                                    # Current user
npm info better-table                         # Package info
npm deprecate better-table@1.0.0 "message"    # Deprecate version
npm unpublish better-table@1.0.0              # Remove version (within 72h)
```

---

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](./LICENSE).
