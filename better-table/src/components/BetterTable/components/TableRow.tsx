import React, { useCallback, KeyboardEvent } from 'react';
import { useTableData, useTableSelectionContext, useTableUI } from '../context';
import { TableData } from '../types';
import { TableCell } from './TableCell';
import { TableActions } from './TableActions';
import clsx from 'clsx';

interface TableRowProps<T extends TableData> {
  row: T;
  rowIndex: number;
  rowKey: string;
}

function TableRowInner<T extends TableData>({ row, rowIndex, rowKey }: TableRowProps<T>) {
  const { visibleColumns, rowActions, expandableEnabled, isExpanded, toggleExpand } = useTableData<T>();
  const { selectable, isSelected, toggleRow } = useTableSelectionContext<T>();
  const { striped, hoverable, onRowClick, onRowDoubleClick, locale } = useTableUI<T>();

  const hasActions = rowActions && rowActions.length > 0;
  const selected = selectable && isSelected(row, rowIndex);
  const isClickable = Boolean(onRowClick);
  const expanded = expandableEnabled && isExpanded(rowKey);

  const handleRowClick = useCallback(() => {
    onRowClick?.(row, rowIndex);
  }, [row, rowIndex, onRowClick]);

  const handleRowDoubleClick = useCallback(() => {
    onRowDoubleClick?.(row, rowIndex);
  }, [row, rowIndex, onRowDoubleClick]);

  const handleCheckboxChange = useCallback(() => {
    toggleRow(row, rowIndex);
  }, [row, rowIndex, toggleRow]);

  const handleToggleExpand = useCallback(() => {
    toggleExpand(rowKey);
  }, [rowKey, toggleExpand]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && onRowClick) {
        handleRowClick();
      }
    },
    [handleRowClick, onRowClick]
  );

  return (
    <tr
      className={clsx(
        'bt-tr',
        striped && 'bt-striped',
        hoverable && 'bt-hoverable',
        selected && 'bt-selected',
        isClickable && 'bt-clickable',
        expanded && 'bt-expanded'
      )}
      onClick={isClickable ? handleRowClick : undefined}
      onDoubleClick={onRowDoubleClick ? handleRowDoubleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      aria-selected={selectable ? selected : undefined}
      aria-expanded={expandableEnabled ? expanded : undefined}
    >
      {expandableEnabled && (
        <td className="bt-td bt-expand-cell">
          <button
            type="button"
            className={clsx('bt-expand-button', expanded && 'bt-expand-button-expanded')}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleExpand();
            }}
            aria-label={expanded ? locale.collapseRow : locale.expandRow}
            aria-expanded={expanded}
          >
            <svg
              className="bt-expand-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </td>
      )}
      {selectable && (
        <td className="bt-td bt-checkbox-cell">
          <input
            id={`bt-row-select-${rowIndex}`}
            name={`bt-row-select-${rowIndex}`}
            type="checkbox"
            className="bt-checkbox"
            checked={selected}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select row ${rowIndex + 1}`}
          />
        </td>
      )}
      {visibleColumns.map((column) => (
        <TableCell
          key={column.id}
          row={row}
          column={column}
          rowIndex={rowIndex}
        />
      ))}
      {hasActions && <TableActions row={row} rowIndex={rowIndex} />}
    </tr>
  );
}

export const TableRow = React.memo(TableRowInner) as typeof TableRowInner;
