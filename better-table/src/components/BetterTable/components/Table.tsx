import { useMemo, useState, useCallback, ReactNode } from 'react';
import {
  BetterTableProps,
  TableData,
  defaultLocale,
  PaginationConfig,
} from '../types';
import { TableProvider, TableContextValue } from '../context';
import { useTableSort } from '../hooks/useTableSort';
import { useTableFilter } from '../hooks/useTableFilter';
import { useTablePagination } from '../hooks/useTablePagination';
import { useTableSelection } from '../hooks/useTableSelection';
import { useTableSearch } from '../hooks/useTableSearch';
import {
  TableHeader,
  TableBody,
  TablePagination,
  TableToolbar,
  TableEmpty,
  TableLoadingOverlay,
  TableModal,
} from '../components';
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

    // Pagination
    pagination = { pageSize: 10 },
    onPageChange,

    // Sort
    sort: controlledSort,
    onSortChange,

    // Filter
    filters: controlledFilters,
    onFilterChange,

    // Search
    searchable = false,
    searchValue: controlledSearchValue,
    onSearchChange,
    searchColumns,

    // Selection - now auto-inferred if not explicitly set
    selectable: selectableProp,
    selectedRows: controlledSelectedRows,
    onSelectionChange,
    selectionMode = 'multiple',

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

    // Accessibility
    ariaLabel,
    ariaDescribedBy,
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
    () => ({ ...defaultLocale, ...userLocale }),
    [userLocale]
  );

  // Modal state
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

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
  });

  // Filter hook
  const {
    filteredData,
    filters,
    setFilter,
    clearFilters,
  } = useTableFilter({
    data: searchedData,
    columns,
    controlledFilters,
    onFilterChange,
  });

  // Sort hook
  const { sortedData, sortState, handleSort } = useTableSort({
    data: filteredData,
    controlledSort,
    onSortChange,
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
  });

  // Build context value
  const contextValue: TableContextValue<T> = useMemo(
    () => ({
      // Data
      data,
      processedData: paginatedData,
      columns,
      rowKey,

      // Actions
      rowActions,
      globalActions,

      // Sort
      sortState,
      handleSort,

      // Filter
      filters,
      setFilter,
      clearFilters,

      // Search
      searchValue,
      handleSearch,
      clearSearch,
      searchable,

      // Selection
      selectedRows,
      isSelected,
      toggleRow,
      selectAll,
      deselectAll,
      isAllSelected,
      isPartiallySelected,
      selectable,
      selectionMode,
      selectedCount,

      // Pagination
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

      // UI State
      loading,
      loadingComponent,
      emptyComponent,

      // Styling
      locale,
      classNames,
      size,
      bordered,
      striped,
      hoverable,
      stickyHeader,

      // Callbacks
      onRowClick,
      onRowDoubleClick,

      // Modal
      openModal,
      closeModal,
      modalContent,
      isModalOpen,
    }),
    [
      data,
      paginatedData,
      columns,
      rowKey,
      rowActions,
      globalActions,
      sortState,
      handleSort,
      filters,
      setFilter,
      clearFilters,
      searchValue,
      handleSearch,
      clearSearch,
      searchable,
      selectedRows,
      isSelected,
      toggleRow,
      selectAll,
      deselectAll,
      isAllSelected,
      isPartiallySelected,
      selectable,
      selectionMode,
      selectedCount,
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
      pagination,
      paginationConfig,
      loading,
      loadingComponent,
      emptyComponent,
      locale,
      classNames,
      size,
      bordered,
      striped,
      hoverable,
      stickyHeader,
      onRowClick,
      onRowDoubleClick,
      openModal,
      closeModal,
      modalContent,
      isModalOpen,
    ]
  );

  const hasData = paginatedData.length > 0;

  return (
    <TableProvider value={contextValue}>
      <div
        className={clsx(
          'bt-container',
          `bt-size-${size}`,
          loading && 'bt-container-loading',
          classNames.container
        )}
        style={styles.container}
      >
        <TableToolbar />

        <div
          className={clsx('bt-table-wrapper', bordered && 'bt-bordered')}
          style={{ maxHeight }}
        >
          <table
            className={clsx('bt-table', classNames.table)}
            style={styles.table}
            role="grid"
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-busy={loading}
          >
            <TableHeader />
            {hasData ? <TableBody /> : <TableEmpty />}
          </table>

          <TableLoadingOverlay show={loading && hasData} />
        </div>

        {pagination !== false && <TablePagination />}

        <TableModal />
      </div>
    </TableProvider>
  );
}

// Export the generic component directly to preserve type parameters
export const BetterTable = BetterTableInner;
export default BetterTable;
