import React, { useCallback, KeyboardEvent } from 'react';
import { useTableContext } from '../context';
import { TableData, Column } from '../types';
import clsx from 'clsx';

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

    return (
      <button
        className={clsx('bt-sort-btn', isSorted && 'bt-active')}
        onClick={handleSortClick}
        aria-label={
          sortDirection === 'asc' ? locale.sortDesc : locale.sortAsc
        }
        type="button"
      >
        {isSorted ? (sortDirection === 'asc' ? '↑' : '↓') : '⇅'}
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
      className={clsx('bt-th', column.align && `bt-align-${column.align}`)}
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
