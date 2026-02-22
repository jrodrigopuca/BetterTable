import React, { useCallback, KeyboardEvent } from 'react';
import { useTableContext } from '../context';
import { TableData } from '../types';
import { TableCell } from './TableCell';
import { TableActions } from './TableActions';
import clsx from 'clsx';

interface TableRowProps<T extends TableData> {
  row: T;
  rowIndex: number;
}

function TableRowInner<T extends TableData>({ row, rowIndex }: TableRowProps<T>) {
  const {
    visibleColumns,
    selectable,
    rowActions,
    isSelected,
    toggleRow,
    striped,
    hoverable,
    onRowClick,
    onRowDoubleClick,
  } = useTableContext<T>();

  const hasActions = rowActions && rowActions.length > 0;
  const selected = selectable && isSelected(row, rowIndex);
  const isClickable = Boolean(onRowClick);

  const handleRowClick = useCallback(() => {
    onRowClick?.(row, rowIndex);
  }, [row, rowIndex, onRowClick]);

  const handleRowDoubleClick = useCallback(() => {
    onRowDoubleClick?.(row, rowIndex);
  }, [row, rowIndex, onRowDoubleClick]);

  const handleCheckboxChange = useCallback(() => {
    toggleRow(row, rowIndex);
  }, [row, rowIndex, toggleRow]);

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
        isClickable && 'bt-clickable'
      )}
      onClick={isClickable ? handleRowClick : undefined}
      onDoubleClick={onRowDoubleClick ? handleRowDoubleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      aria-selected={selectable ? selected : undefined}
    >
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
