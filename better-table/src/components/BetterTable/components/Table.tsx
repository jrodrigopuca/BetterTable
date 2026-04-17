import { useMemo, useState, useCallback, useRef, ReactNode } from 'react';
import {
  BetterTableProps,
  TableData,
  defaultLocale,
  locales,
  PaginationConfig,
} from '../types';
import {
  TableProvider,
  TableDataContextValue,
  TableSortContextValue,
  TableFilterContextValue,
  TableSelectionContextValue,
  TablePaginationContextValue,
  TableUIContextValue,
} from '../context';
import { useTableSort } from '../hooks/useTableSort';
import { useTableFilter } from '../hooks/useTableFilter';
import { useTablePagination } from '../hooks/useTablePagination';
import { useTableSelection } from '../hooks/useTableSelection';
import { useTableSearch } from '../hooks/useTableSearch';
import { useColumnVisibility } from '../hooks/useColumnVisibility';
import { useColumnResize } from '../hooks/useColumnResize';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useVirtualization } from '../hooks/useVirtualization';
import { useExpandableRows } from '../hooks/useExpandableRows';
import {
  TableHeader,
  TableBody,
  TablePagination,
  TableToolbar,
  TableEmpty,
  TableLoadingOverlay,
  TableModal,
  TableFilterPanel,
} from '../components';
import { TableCards } from './TableCards';
import { TableVirtualBody } from './TableVirtualBody';
import {
  VIRTUALIZATION_THRESHOLD,
  DEFAULT_ROW_HEIGHT,
  DEFAULT_VIRTUAL_BUFFER,
} from '../constants';
import '../styles/index.css';
import clsx from 'clsx';

function BetterTableInner<T extends TableData>(
  props: BetterTableProps<T>
): React.ReactElement {
  const {
    // Data
    data,
    columns,
    rowKey = 'id' as keyof T,

    // Actions
    rowActions,
    globalActions,
    maxVisibleActions = 3,

    // Pagination
    pagination = { pageSize: 10 },
    onPageChange,

    // Sort
    sort: controlledSort,
    onSortChange,
    multiSort = false,
    multiSortState: controlledMultiSort,
    onMultiSortChange,

    // Filter
    filters: controlledFilters,
    onFilterChange,
    filterMode = 'floating',

    // Search
    searchable = false,
    searchValue: controlledSearchValue,
    onSearchChange,
    searchColumns,
    searchDebounceMs = 300,

    // Server-Side / Manual Mode
    manualSorting = false,
    manualFiltering = false,
    manualPagination = false,

    // Selection - now auto-inferred if not explicitly set
    selectable: selectableProp,
    selectedRows: controlledSelectedRows,
    onSelectionChange,
    selectionMode = 'multiple',

    // Column Visibility
    columnVisibility = false,
    hiddenColumns: controlledHiddenColumns,
    onColumnVisibilityChange,

    // States
    loading = false,
    loadingComponent,
    emptyComponent,

    // Styling
    classNames = {},
    styles = {},
    locale: userLocale,
    stickyHeader = false,
    maxHeight,
    bordered = false,
    striped = false,
    hoverable = true,
    size = 'medium',

    // Callbacks
    onRowClick,
    onRowDoubleClick,

    // Column Resizing
    resizable = false,
    onColumnResize,
    minColumnWidth,
    maxColumnWidth,

    // Expandable Rows
    expandable,
    expandedRows: controlledExpandedRows,
    onExpandChange,

    // Accessibility
    ariaLabel,
    ariaDescribedBy,

    // Virtualization
    virtualize: virtualizeProp,
    rowHeight = DEFAULT_ROW_HEIGHT,
    virtualBuffer = DEFAULT_VIRTUAL_BUFFER,
  } = props;

  // Auto-infer selectable: show selection if there's a reason to select
  // - Explicitly set by user (selectableProp)
  // - Has globalAction with requiresSelection
  // - Has onSelectionChange callback
  const selectable = useMemo(() => {
    // If explicitly set, use that value
    if (selectableProp !== undefined) {
      return selectableProp;
    }
    // Auto-infer: true if there's a functional reason to select
    const hasSelectionAction = globalActions?.some(
      (action) => action.requiresSelection
    );
    const hasSelectionCallback = onSelectionChange !== undefined;
    return hasSelectionAction || hasSelectionCallback;
  }, [selectableProp, globalActions, onSelectionChange]);

  // Merge locale with defaults
  const locale = useMemo(
    () => {
      const base = typeof userLocale === 'string' ? locales[userLocale] : defaultLocale;
      const overrides = typeof userLocale === 'object' ? userLocale : {};
      return { ...base, ...overrides };
    },
    [userLocale]
  );

  // Modal state
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  // Filter panel state
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const toggleFilterPanel = useCallback(() => {
    setFilterPanelOpen((prev) => !prev);
  }, []);

  const hasFilterableColumns = useMemo(
    () => columns.some((col) => col.filterable !== false && col.type !== 'custom' && !col.hidden),
    [columns]
  );

  const openModal = useCallback((content: ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalContent(null);
  }, []);

  // Pagination config
  const paginationConfig: PaginationConfig | false = useMemo(() => {
    if (pagination === false) return false;
    return {
      pageSize: 10,
      pageSizeOptions: [10, 20, 50, 100],
      showSizeChanger: false,
      ...pagination,
    };
  }, [pagination]);

  // Search hook
  const {
    searchedData,
    searchValue,
    handleSearch,
    clearSearch,
  } = useTableSearch({
    data,
    columns,
    searchColumns,
    controlledValue: controlledSearchValue,
    onSearchChange,
    debounceMs: searchDebounceMs,
    manual: manualFiltering,
  });

  // Filter hook
  const {
    filteredData,
    filters,
    setFilter,
    clearFilter,
    clearFilters,
  } = useTableFilter({
    data: searchedData,
    columns,
    controlledFilters,
    onFilterChange,
    manual: manualFiltering,
  });

  // Sort hook
  const { sortedData, sortState, handleSort, clearSort, multiSortState, isMultiSort } = useTableSort({
    data: filteredData,
    controlledSort,
    onSortChange,
    multiSort,
    controlledMultiSort,
    onMultiSortChange,
    manual: manualSorting,
  });

  // Column visibility hook
  const {
    visibleColumns,
    hiddenColumnIds,
    toggleColumn,
    showAllColumns,
    isColumnVisible,
  } = useColumnVisibility({
    columns,
    controlledHiddenColumns,
    onColumnVisibilityChange,
  });

  // Selection hook
  const {
    selectedRows,
    isSelected,
    toggleRow,
    selectAll,
    deselectAll,
    isAllSelected,
    isPartiallySelected,
    selectedCount,
  } = useTableSelection({
    data: sortedData,
    rowKey,
    mode: selectionMode,
    controlledSelection: controlledSelectedRows,
    onSelectionChange,
  });

  // Pagination hook
  const {
    paginatedData,
    page,
    pageSize,
    totalPages,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
  } = useTablePagination({
    data: sortedData,
    config: paginationConfig,
    onPageChange,
    manual: manualPagination,
  });

  // Virtualization: auto-enable when no pagination and dataset exceeds threshold
  const isPaginationDisabled = pagination === false;
  const shouldVirtualize = useMemo(() => {
    // User explicitly controls it
    if (virtualizeProp !== undefined) return virtualizeProp;
    // Auto-enable only when pagination is off and dataset is large
    return isPaginationDisabled && sortedData.length > VIRTUALIZATION_THRESHOLD;
  }, [virtualizeProp, isPaginationDisabled, sortedData.length]);

  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  // Column resize hook
  const {
    columnWidths,
    isResizing,
    startResize,
    getColumnWidth,
  } = useColumnResize({
    columns: visibleColumns,
    enabled: resizable,
    minWidth: minColumnWidth,
    maxWidth: maxColumnWidth,
    onColumnResize,
    tableRef,
  });

  // Expandable rows hook
  const {
    isExpanded,
    toggleExpand,
  } = useExpandableRows({
    controlledExpandedRows,
    onExpandChange,
    accordion: expandable?.accordion,
  });

  // Data to render: when pagination is off, use sortedData directly
  const displayData = isPaginationDisabled ? sortedData : paginatedData;

  const { totalHeight, startIndex: virtualStartIndex, endIndex: virtualEndIndex, offsetTop } = useVirtualization({
    containerRef: tableWrapperRef,
    itemCount: displayData.length,
    rowHeight,
    buffer: virtualBuffer,
    enabled: shouldVirtualize,
  });

  // Build split context values
  const dataCtx: TableDataContextValue<T> = useMemo(
    () => ({
      data,
      processedData: displayData,
      columns,
      visibleColumns,
      rowKey,
      rowActions,
      globalActions,
      maxVisibleActions,
      expandableRender: expandable?.render,
      isExpanded,
      toggleExpand,
      expandableEnabled: expandable !== undefined,
    }),
    [data, displayData, columns, visibleColumns, rowKey, rowActions, globalActions, maxVisibleActions, expandable, isExpanded, toggleExpand]
  );

  const sortCtx: TableSortContextValue = useMemo(
    () => ({
      sortState,
      handleSort,
      multiSortState,
      isMultiSort,
      clearSort,
    }),
    [sortState, handleSort, multiSortState, isMultiSort, clearSort]
  );

  const filterCtx: TableFilterContextValue = useMemo(
    () => ({
      filters,
      setFilter,
      clearFilter,
      clearFilters,
      searchValue,
      handleSearch,
      clearSearch,
      searchable,
      filterPanelOpen,
      toggleFilterPanel,
      hasFilterableColumns,
      filterMode,
    }),
    [filters, setFilter, clearFilter, clearFilters, searchValue, handleSearch, clearSearch, searchable, filterPanelOpen, toggleFilterPanel, hasFilterableColumns, filterMode]
  );

  const selectionCtx: TableSelectionContextValue<T> = useMemo(
    () => ({
      selectedRows,
      isSelected,
      toggleRow,
      selectAll,
      deselectAll,
      isAllSelected,
      isPartiallySelected,
      selectedCount,
      selectable,
      selectionMode,
    }),
    [selectedRows, isSelected, toggleRow, selectAll, deselectAll, isAllSelected, isPartiallySelected, selectedCount, selectable, selectionMode]
  );

  const paginationCtx: TablePaginationContextValue = useMemo(
    () => ({
      page,
      pageSize,
      totalPages,
      totalItems,
      goToPage,
      nextPage,
      prevPage,
      changePageSize,
      hasNextPage,
      hasPrevPage,
      startIndex,
      endIndex,
      paginationEnabled: pagination !== false,
      pageSizeOptions:
        paginationConfig && typeof paginationConfig === 'object'
          ? paginationConfig.pageSizeOptions ?? [10, 20, 50, 100]
          : [10, 20, 50, 100],
      showSizeChanger:
        paginationConfig && typeof paginationConfig === 'object'
          ? paginationConfig.showSizeChanger ?? false
          : false,
    }),
    [page, pageSize, totalPages, totalItems, goToPage, nextPage, prevPage, changePageSize, hasNextPage, hasPrevPage, startIndex, endIndex, pagination, paginationConfig]
  );

  const uiCtx: TableUIContextValue<T> = useMemo(
    () => ({
      locale,
      classNames,
      size,
      bordered,
      striped,
      hoverable,
      stickyHeader,
      loading,
      loadingComponent,
      emptyComponent,
      onRowClick,
      onRowDoubleClick,
      openModal,
      closeModal,
      modalContent,
      isModalOpen,
      columnVisibilityEnabled: columnVisibility,
      hiddenColumnIds,
      toggleColumn,
      showAllColumns,
      isColumnVisible,
      columns,
      resizable,
      columnWidths,
      isResizing,
      startResize,
      getColumnWidth,
    }),
    [locale, classNames, size, bordered, striped, hoverable, stickyHeader, loading, loadingComponent, emptyComponent, onRowClick, onRowDoubleClick, openModal, closeModal, modalContent, isModalOpen, columnVisibility, hiddenColumnIds, toggleColumn, showAllColumns, isColumnVisible, columns, resizable, columnWidths, isResizing, startResize, getColumnWidth]
  );

  const hasData = displayData.length > 0;
  const isMobile = useMediaQuery('(max-width: 640px)');

  // Announcement for screen readers (aria-live region)
  const announcement = useMemo(() => {
    const parts: string[] = [];

    // Results count (only when search or filters are active)
    const hasActiveSearch = searchValue.length > 0;
    const hasActiveFilters = Object.keys(filters).length > 0;

    if (hasActiveSearch || hasActiveFilters) {
      if (sortedData.length === 0) {
        parts.push(locale.noResultsFound);
      } else {
        parts.push(locale.resultsFound.replace('{count}', String(sortedData.length)));
      }
    }

    // Selection count
    if (selectable && selectedCount > 0) {
      parts.push(locale.rowsSelected.replace('{count}', String(selectedCount)));
    }

    return parts.join('. ');
  }, [sortedData.length, searchValue, filters, selectable, selectedCount, locale]);

  return (
    <TableProvider data={dataCtx} sort={sortCtx} filter={filterCtx} selection={selectionCtx} pagination={paginationCtx} ui={uiCtx}>
      <div
        className={clsx(
          'bt-container',
          `bt-size-${size}`,
          striped && 'bt-striped',
          bordered && 'bt-bordered',
          hoverable && 'bt-hoverable',
          loading && 'bt-container-loading',
          classNames.container
        )}
        style={styles.container}
      >
        <TableToolbar />
        {(filterMode === 'panel' || filterMode === 'both') && (
          <TableFilterPanel open={filterPanelOpen} />
        )}

        <div
          ref={tableWrapperRef}
          className='bt-table-wrapper'
          style={{
            maxHeight,
            ...(shouldVirtualize && !maxHeight ? { maxHeight: '80vh', overflow: 'auto' } : {}),
          }}
        >
          {isMobile ? (
            /* Cards (móvil) */
            hasData && <TableCards />
          ) : (
            /* Tabla tradicional (desktop/tablet) */
            <table
              ref={tableRef}
              className={clsx('bt-table', resizable && 'bt-table-resizable', classNames.table)}
              style={styles.table}
              role="grid"
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
              aria-busy={loading}
              aria-rowcount={shouldVirtualize ? displayData.length : undefined}
            >
              {resizable && (
                <colgroup>
                  {expandable && <col style={{ width: 40 }} />}
                  {selectable && <col style={{ width: 40 }} />}
                  {visibleColumns.map((col) => {
                    const w = getColumnWidth(col.id);
                    return <col key={col.id} style={w !== undefined ? { width: w } : col.width !== undefined ? { width: col.width } : undefined} />;
                  })}
                  {rowActions && rowActions.length > 0 && <col />}
                </colgroup>
              )}
              <TableHeader />
              {hasData ? (
                shouldVirtualize ? (
                  <TableVirtualBody
                    startIndex={virtualStartIndex}
                    endIndex={virtualEndIndex}
                    totalHeight={totalHeight}
                    offsetTop={offsetTop}
                  />
                ) : (
                  <TableBody />
                )
              ) : (
                <TableEmpty />
              )}
            </table>
          )}

          <TableLoadingOverlay show={loading && hasData} />
        </div>

        {pagination !== false && <TablePagination />}

        <TableModal />

        {/* Screen reader announcements for dynamic content changes */}
        <div aria-live="polite" aria-atomic="true" className="bt-sr-only">
          {announcement}
        </div>
      </div>
    </TableProvider>
  );
}

// Export the generic component directly to preserve type parameters
export const BetterTable = BetterTableInner;
export default BetterTable;
