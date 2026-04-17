# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-04-16

### Added

- **Column Resizing**: Drag-to-resize columns with configurable min/max widths. Resize handles appear on header cell edges. Content truncates with ellipsis when columns shrink.
  - New props: `resizable` (global and per-column), `minWidth`, `maxWidth` on Column
  - New hook: `useColumnResize`
- **Virtualization**: Built-in row virtualization (zero dependencies) for large datasets. Auto-enables when `pagination={false}` and dataset exceeds 500 rows.
  - New props: `virtualize`, `rowHeight`, `virtualBuffer`
  - New hook: `useVirtualization`
  - New component: `TableVirtualBody`
- **Expandable Rows**: Expand rows to show detail content. Supports controlled/uncontrolled modes and accordion mode (one row at a time).
  - New prop: `expandable` (`ExpandableConfig`)
  - New hook: `useExpandableRows`
  - New component: `TableExpandedRow`
  - New type: `ExpandableConfig`
- **Server-Side Data Mode**: Delegate sorting, filtering, and pagination to your API. The table fires callbacks without processing data client-side.
  - New props: `manualSorting`, `manualFiltering`, `manualPagination`
  - New callbacks: `onSortChange`, `onSearchChange`, `onFilterChange`
- **Sticky Headers**: Headers stay visible when scrolling long tables.
  - New prop: `stickyHeader`
- **Accessibility Enhancements**: `aria-live` region for screen reader announcements on search/filter/selection changes. Focus trap in modals (WCAG 2.4.3).
  - New hook: `useFocusTrap`
- **`"use client"` directive** in entry point for Next.js App Router compatibility
- **CI/CD**: GitHub Actions workflows for tests (Node 20/22 matrix) and Storybook deployment to GitHub Pages
- **Storybook**: Interactive documentation with 11 story files covering all features. Deployed to GitHub Pages.
- 37 new tests (column-resize: 9, virtualization: 8, server-side: 8, expandable-rows: 9, sticky-header: 3) — total: 150 tests

### Changed

- **Context Split**: Monolithic `TableContext` split into 6 focused contexts (`TableDataContext`, `TableSortContext`, `TableFilterContext`, `TableSelectionContext`, `TablePaginationContext`, `TableUIContext`). Reduces unnecessary re-renders. Backwards-compatible facade maintained.

### Fixed

- Column content overflow on resize — cells now use `overflow: hidden; text-overflow: ellipsis`
- Flex container headers properly support ellipsis via `min-width: 0`
- Special cells (checkbox, expand, actions) excluded from overflow clipping

## [1.2.0] - 2026-02-21

### Added

- **Multi-Sort**: Support for sorting by multiple columns simultaneously with an intuitive 3-state cycle per column (unsorted → asc → desc → unsorted). No modifier key required — each click on a column header accumulates naturally. Priority badges are shown when more than one column is active.
  - New props: `multiSort`, `multiSortState`, `onMultiSortChange`
  - New type: `MultiSortState` (`SortState[]`)
- **Column Visibility Toggle**: Interactive dropdown in the toolbar to show/hide columns at runtime. Includes a "Show all" button to restore all columns.
  - New props: `columnVisibility`, `hiddenColumns`, `onColumnVisibilityChange`
  - New hook: `useColumnVisibility`
  - New component: `ColumnVisibilityToggle`
- New locale keys: `columns`, `showAllColumns`, `hideColumn`, `sortPriority`, `clearSort`
- 8 new tests (multi-sort: 5, column-visibility: 3) — total: 113 tests across 21 test files

### Fixed

- Unused imports in `date-filter.test.tsx` (`within`, `vi`) that caused TypeScript warnings
- Unused `rowIndex` parameter in `TableActionOverflow` now properly prefixed with `_`

### Changed

- `SortState.column` renamed to `SortState.columnId` for consistency
- `SortState.direction` no longer allows `null` — unsorted state is represented by `columnId: null`
- `handleSort` signature simplified from `(columnId: string, addToMultiSort: boolean)` to `(columnId: string)`

## [1.1.0] - 2026-02-15

### Added

- **Responsive Card Layout**: Automatic card view on mobile (`<640px`) with conditional rendering (only the active layout is in the DOM)
- **Filter Panel**: Collapsible panel in toolbar with per-column filters, date range filtering, and badge counter
- **i18n System**: Locale presets (`en`, `es`, `pt`) with ~25 translatable strings. Accepts string preset or partial `TableLocale` object for overrides
- **Action Overflow Menu**: `maxVisibleActions` prop to group excess row actions into a `⋮` dropdown (rendered via portal)
- **Search Debounce**: Configurable `searchDebounceMs` prop (default: 300ms) with instant clear
- **CSS Isolation**: Element-level resets using `:where()` selectors to prevent external style leakage. Portal isolation for overflow menus
- **Toolbar Responsive**: Collapsible search, icon-only action buttons on mobile
- Hook `useMediaQuery` for SSR-safe viewport detection
- Components: `TableCard`, `TableCards`, `TableFilterPanel`, `TableFloatingFilter`, `TableActionOverflow`
- 16 responsive/cards tests, 5 debounce tests, date filter tests, accessibility tests

### Fixed

- Modal `onClose` callback now properly closes the modal from custom content
- Search now matches by `accessor` (not just `id`) in `searchColumns`
- Quick jumper pagination input synced as controlled component
- Dual DOM rendering eliminated (table + cards no longer both exist in DOM)

## [1.0.1] - 2026-02-01

### Fixed

- Updated test queries from `role="table"` to `role="grid"` for interactive tables
- Fixed `getByText()` conflicts with `getAllByText()` / `queryByText()`
- Added CSS style classes (`striped`, `bordered`, `hoverable`) to `.bt-container`
- Added `waitFor()` for async filter assertions

## [1.0.0] - 2026-01-15

### Added

- Initial release of BetterTable
- Declarative column definitions with TypeScript generics
- Single-column sorting with 3-state cycle
- Per-column filtering (string, number, boolean)
- Global search across configurable columns
- Row selection (single/multiple) with select-all and indeterminate state
- Row actions (callback, modal, link) with conditional visibility
- Global actions with optional selection requirement
- Pagination with page size changer and quick jumper
- Custom cell/header renderers
- Nested data access via dot notation (`accessor: "address.city"`)
- Loading and empty states
- CSS variables for theming (`--bt-*`)
- Full TypeScript support with generics
