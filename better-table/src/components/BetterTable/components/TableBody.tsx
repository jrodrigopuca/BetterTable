import { useTableContext } from '../context';
import { TableData } from '../types';
import { TableRow } from './TableRow';

function TableBodyInner<T extends TableData>() {
  const { processedData, rowKey } = useTableContext<T>();

  const getRowKey = (row: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(row, index);
    }
    const keyValue = row[rowKey];
    return keyValue !== undefined ? String(keyValue) : String(index);
  };

  return (
    <tbody className="bt-tbody">
      {processedData.map((row, index) => (
        <TableRow key={getRowKey(row, index)} row={row} rowIndex={index} />
      ))}
    </tbody>
  );
}

// Export without memo to preserve generic type parameter
export const TableBody = TableBodyInner;
