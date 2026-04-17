import React from 'react';
import { useTableData } from '../context';
import { TableData } from '../types';
import { TableRow } from './TableRow';
import { TableExpandedRow } from './TableExpandedRow';

function TableBodyInner<T extends TableData>() {
  const { processedData, rowKey, expandableEnabled, isExpanded } = useTableData<T>();

  const getRowKey = (row: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(row, index);
    }
    const keyValue = row[rowKey];
    return keyValue !== undefined ? String(keyValue) : String(index);
  };

  return (
    <tbody className="bt-tbody">
      {processedData.map((row, index) => {
        const key = getRowKey(row, index);
        const expanded = expandableEnabled && isExpanded(key);
        return (
          <React.Fragment key={key}>
            <TableRow row={row} rowIndex={index} rowKey={key} />
            {expanded && (
              <TableExpandedRow row={row} rowIndex={index} />
            )}
          </React.Fragment>
        );
      })}
    </tbody>
  );
}

// Export without memo to preserve generic type parameter
export const TableBody = TableBodyInner;
