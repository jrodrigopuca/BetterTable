import React, { useCallback, KeyboardEvent } from 'react';
import { useTableSortContext, useTableUI } from '../context';
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
  const { sortState, handleSort, multiSortState, isMultiSort } = useTableSortContext();
  const { locale, resizable, startResize, getColumnWidth } = useTableUI<T>();

  // Determine if THIS column is resizable
  const isResizable = column.resizable !== undefined ? column.resizable : resizable;

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      startResize(column.id, e.clientX);
    },
    [column.id, startResize]
  );

  const isSorted = sortState.columnId === column.id;

  // For multi-sort, check if this column is in the multi-sort array
  const multiSortIndex = isMultiSort
    ? multiSortState.findIndex((s) => s.columnId === column.id)
    : -1;
  const isInMultiSort = multiSortIndex >= 0;
  const multiSortDirection = isInMultiSort
    ? multiSortState[multiSortIndex].direction
    : null;
  const showMultiSortBadge = isMultiSort && multiSortState.length > 1 && isInMultiSort;

  // Determine effective sort state for this column
  const effectivelySorted = isMultiSort ? isInMultiSort : isSorted;
  const effectiveDirection = isMultiSort
    ? multiSortDirection
    : isSorted
      ? sortState.direction
      : null;

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

    const Icon = effectivelySorted
      ? effectiveDirection === 'asc'
        ? SortAscIcon
        : SortDescIcon
      : SortIdleIcon;

    return (
      <button
        className={clsx('bt-sort-btn', effectivelySorted && 'bt-active')}
        onClick={handleSortClick}
        aria-label={
          effectiveDirection === 'asc' ? locale.sortDesc : locale.sortAsc
        }
        type="button"
      >
        <Icon />
        {showMultiSortBadge && (
          <span className="bt-sort-priority" aria-label={`${locale.sortPriority} ${multiSortIndex + 1}`}>
            {multiSortIndex + 1}
          </span>
        )}
      </button>
    );
  };

  // Custom header cell render
  if (column.headerCell) {
    const resizedWidth = getColumnWidth(column.id);
    return (
      <th
        className={clsx('bt-th', column.align && `bt-align-${column.align}`, isResizable && 'bt-th-resizable')}
        style={{ width: resizedWidth ?? column.width }}
        data-column-id={column.id}
      >
        {column.headerCell(column)}
        {isResizable && (
          <div
            className="bt-resize-handle"
            onMouseDown={handleResizeMouseDown}
            role="separator"
            aria-orientation="vertical"
            aria-label={`Resize ${column.header}`}
          />
        )}
      </th>
    );
  }

  return (
    <th
      className={clsx('bt-th', column.align && `bt-align-${column.align}`, effectivelySorted && 'bt-sorted', isResizable && 'bt-th-resizable')}
      style={{ width: getColumnWidth(column.id) ?? column.width }}
      data-column-id={column.id}
      role="columnheader"
      aria-sort={
        effectivelySorted
          ? effectiveDirection === 'asc'
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
      {isResizable && (
        <div
          className="bt-resize-handle"
          onMouseDown={handleResizeMouseDown}
          role="separator"
          aria-orientation="vertical"
          aria-label={`Resize ${column.header}`}
        />
      )}
    </th>
  );
}

export const TableHeaderCell = React.memo(
  TableHeaderCellInner
) as typeof TableHeaderCellInner;
