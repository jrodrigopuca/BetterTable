
import { useTableContext } from '../context';
import { TableData } from '../types';
import { TableHeaderCell } from './TableHeaderCell';
import clsx from 'clsx';

function TableHeaderInner<T extends TableData>() {
  const {
    columns,
    selectable,
    selectionMode,
    rowActions,
    isAllSelected,
    isPartiallySelected,
    selectAll,
    deselectAll,
    locale,
    stickyHeader,
  } = useTableContext<T>();

  const visibleColumns = columns.filter((col) => !col.hidden);
  const hasActions = rowActions && rowActions.length > 0;

  const handleSelectAllChange = () => {
    if (isAllSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  };

  return (
    <thead className={clsx('bt-thead', stickyHeader && 'bt-sticky')}>
      <tr className="bt-tr">
        {selectable && (
          <th className="bt-th bt-checkbox-cell">
            {selectionMode === 'multiple' && (
              <input
                type="checkbox"
                className="bt-checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) {
                    el.indeterminate = isPartiallySelected;
                  }
                }}
                onChange={handleSelectAllChange}
                aria-label={isAllSelected ? locale.deselectAll : locale.selectAll}
              />
            )}
          </th>
        )}
        {visibleColumns.map((column) => (
          <TableHeaderCell key={column.id} column={column} />
        ))}
        {hasActions && (
          <th className="bt-th bt-actions-cell">{locale.actions}</th>
        )}
      </tr>
    </thead>
  );
}

export const TableHeader = TableHeaderInner;
