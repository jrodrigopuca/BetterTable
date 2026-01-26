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
    filters,
    setFilter,
    locale,
  } = useTableContext<T>();

  const isSorted = sortState.columnId === column.id;
  const sortDirection = isSorted ? sortState.direction : null;

  const handleSortClick = useCallback(() => {
    if (column.sortable !== false) {
      handleSort(column.id);
    }
  }, [column.id, column.sortable, handleSort]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      if (column.type === 'boolean') {
        if (value === '') {
          setFilter(column.id, null);
        } else {
          setFilter(column.id, value === 'true');
        }
      } else {
        setFilter(column.id, value || null);
      }
    },
    [column.id, column.type, setFilter]
  );

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

  const renderFilterInput = () => {
    if (column.filterable === false || column.type === 'custom') {
      return null;
    }

    const filterValue = filters[column.id];

    if (column.type === 'boolean') {
      return (
        <select
          className="bt-filter-select"
          value={filterValue === null || filterValue === undefined ? '' : String(filterValue)}
          onChange={handleFilterChange}
          aria-label={`${locale.filterBy} ${column.header}`}
        >
          <option value="">-</option>
          <option value="true">✅</option>
          <option value="false">❌</option>
        </select>
      );
    }

    return (
      <input
        type={column.type === 'number' ? 'number' : 'text'}
        className="bt-filter-input"
        placeholder={`${locale.filterBy}...`}
        value={filterValue !== null && filterValue !== undefined ? String(filterValue) : ''}
        onChange={handleFilterChange}
        aria-label={`${locale.filterBy} ${column.header}`}
      />
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
        {column.filterable !== false && renderFilterInput()}
      </div>
    </th>
  );
}

export const TableHeaderCell = React.memo(
  TableHeaderCellInner
) as typeof TableHeaderCellInner;
