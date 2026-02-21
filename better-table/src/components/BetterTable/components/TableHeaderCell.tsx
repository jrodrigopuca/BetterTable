import React, { useCallback, KeyboardEvent } from 'react';
import { useTableContext } from '../context';
import { TableData, Column } from '../types';
import clsx from 'clsx';

/* Inline SVG sort icons */
function SortIdleIcon() {
  return (
    <svg className="bt-sort-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7 2.5L10 5.5H4L7 2.5Z" fill="currentColor" opacity="0.4" />
      <path d="M7 11.5L4 8.5H10L7 11.5Z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function SortAscIcon() {
  return (
    <svg className="bt-sort-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7 2.5L10 5.5H4L7 2.5Z" fill="currentColor" />
      <path d="M7 11.5L4 8.5H10L7 11.5Z" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

function SortDescIcon() {
  return (
    <svg className="bt-sort-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7 2.5L10 5.5H4L7 2.5Z" fill="currentColor" opacity="0.2" />
      <path d="M7 11.5L4 8.5H10L7 11.5Z" fill="currentColor" />
    </svg>
  );
}

interface TableHeaderCellProps<T extends TableData> {
  column: Column<T>;
}

function TableHeaderCellInner<T extends TableData>({
  column,
}: TableHeaderCellProps<T>) {
  const {
    sortState,
    handleSort,
    locale,
  } = useTableContext<T>();

  const isSorted = sortState.columnId === column.id;
  const sortDirection = isSorted ? sortState.direction : null;

  const handleSortClick = useCallback(() => {
    if (column.sortable !== false) {
      handleSort(column.id);
    }
  }, [column.id, column.sortable, handleSort]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && column.sortable !== false) {
        handleSort(column.id);
      }
    },
    [column.id, column.sortable, handleSort]
  );

  const renderSortIcon = () => {
    if (column.sortable === false || column.type === 'custom') {
      return null;
    }

    const Icon = isSorted
      ? sortDirection === 'asc'
        ? SortAscIcon
        : SortDescIcon
      : SortIdleIcon;

    return (
      <button
        className={clsx('bt-sort-btn', isSorted && 'bt-active')}
        onClick={handleSortClick}
        aria-label={
          sortDirection === 'asc' ? locale.sortDesc : locale.sortAsc
        }
        type="button"
      >
        <Icon />
      </button>
    );
  };

  // Custom header cell render
  if (column.headerCell) {
    return (
      <th
        className={clsx('bt-th', column.align && `bt-align-${column.align}`)}
        style={{ width: column.width }}
      >
        {column.headerCell(column)}
      </th>
    );
  }

  return (
    <th
      className={clsx('bt-th', column.align && `bt-align-${column.align}`, isSorted && 'bt-sorted')}
      style={{ width: column.width }}
      role="columnheader"
      aria-sort={
        isSorted
          ? sortDirection === 'asc'
            ? 'ascending'
            : 'descending'
          : undefined
      }
      tabIndex={column.sortable !== false ? 0 : undefined}
      onKeyDown={column.sortable !== false ? handleKeyDown : undefined}
    >
      <div className="bt-th-content">
        <div className="bt-th-header">
          <span className="bt-th-title">{column.header}</span>
          {renderSortIcon()}
        </div>
      </div>
    </th>
  );
}

export const TableHeaderCell = React.memo(
  TableHeaderCellInner
) as typeof TableHeaderCellInner;
