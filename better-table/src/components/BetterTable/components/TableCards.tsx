import { useTableContext } from '../context';
import { TableData } from '../types';
import { TableCard } from './TableCard';

function TableCardsInner<T extends TableData>() {
  const { processedData, rowKey } = useTableContext<T>();

  const getRowKey = (row: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(row, index);
    }
    const keyValue = row[rowKey];
    return keyValue !== undefined ? String(keyValue) : String(index);
  };

  return (
    <div className="bt-cards">
      {processedData.map((row, index) => (
        <TableCard key={getRowKey(row, index)} row={row} rowIndex={index} />
      ))}
    </div>
  );
}

export const TableCards = TableCardsInner;
