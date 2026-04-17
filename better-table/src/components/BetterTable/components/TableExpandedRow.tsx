import { useTableData, useTableSelectionContext } from '../context';
import { TableData } from '../types';

interface TableExpandedRowProps<T extends TableData> {
  row: T;
  rowIndex: number;
}

function TableExpandedRowInner<T extends TableData>({ row, rowIndex }: TableExpandedRowProps<T>) {
  const { visibleColumns, rowActions, expandableRender } = useTableData<T>();
  const { selectable } = useTableSelectionContext<T>();

  if (!expandableRender) return null;

  // Calculate colspan: expand cell + selectable checkbox + visible columns + actions
  const hasActions = rowActions && rowActions.length > 0;
  const colspan = 1 + (selectable ? 1 : 0) + visibleColumns.length + (hasActions ? 1 : 0);

  return (
    <tr className="bt-tr bt-expanded-row" role="row">
      <td className="bt-td bt-expanded-content" colSpan={colspan}>
        {expandableRender(row, rowIndex)}
      </td>
    </tr>
  );
}

export const TableExpandedRow = TableExpandedRowInner;
