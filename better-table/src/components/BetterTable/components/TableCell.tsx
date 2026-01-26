import React from 'react';
import { TableData, Column } from '../types';
import { getValueFromPath } from '../utils';
import clsx from 'clsx';

interface TableCellProps<T extends TableData> {
  row: T;
  column: Column<T>;
  rowIndex: number;
}

function TableCellInner<T extends TableData>({
  row,
  column,
  rowIndex,
}: TableCellProps<T>) {
  const value = getValueFromPath(
    row as Record<string, unknown>,
    String(column.accessor)
  );

  const renderCellContent = () => {
    // Custom cell renderer
    if (column.cell) {
      return column.cell(value, row, rowIndex);
    }

    // Handle null/undefined
    if (value === null || value === undefined) {
      return <span className="bt-cell-empty">—</span>;
    }

    // Type-based rendering
    switch (column.type) {
      case 'boolean':
        return value ? '✅' : '❌';

      case 'date':
        if (value instanceof Date) {
          return value.toLocaleDateString();
        }
        // Try to parse string dates
        const date = new Date(String(value));
        return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();

      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;

      case 'string':
      default:
        return String(value);
    }
  };

  const content = renderCellContent();

  return (
    <td
      className={clsx('bt-td', column.align && `bt-align-${column.align}`)}
      style={{ width: column.width }}
    >
      {content as React.ReactNode}
    </td>
  );
}

export const TableCell = React.memo(TableCellInner) as typeof TableCellInner;
