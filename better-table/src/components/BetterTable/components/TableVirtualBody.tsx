import { useTableData } from '../context';
import { TableData } from '../types';
import { TableRow } from './TableRow';

interface TableVirtualBodyProps {
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetTop: number;
}

function TableVirtualBodyInner<T extends TableData>({
  startIndex,
  endIndex,
  totalHeight,
  offsetTop,
}: TableVirtualBodyProps) {
  const { processedData, rowKey } = useTableData<T>();

  const getRowKey = (row: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(row, index);
    }
    const keyValue = row[rowKey];
    return keyValue !== undefined ? String(keyValue) : String(index);
  };

  const visibleRows = processedData.slice(startIndex, endIndex);
  const bottomHeight = totalHeight - offsetTop - (visibleRows.length * (totalHeight / processedData.length));

  return (
    <tbody className="bt-tbody">
      {/* Spacer row for content above visible area */}
      {offsetTop > 0 && (
        <tr aria-hidden="true">
          <td style={{ height: offsetTop, padding: 0, border: 'none' }} />
        </tr>
      )}

      {/* Visible rows */}
      {visibleRows.map((row, i) => {
        const actualIndex = startIndex + i;
        return (
          <TableRow
            key={getRowKey(row, actualIndex)}
            row={row}
            rowIndex={actualIndex}
            rowKey={getRowKey(row, actualIndex)}
          />
        );
      })}

      {/* Spacer row for content below visible area */}
      {bottomHeight > 0 && (
        <tr aria-hidden="true">
          <td style={{ height: bottomHeight, padding: 0, border: 'none' }} />
        </tr>
      )}
    </tbody>
  );
}

export const TableVirtualBody = TableVirtualBodyInner;
