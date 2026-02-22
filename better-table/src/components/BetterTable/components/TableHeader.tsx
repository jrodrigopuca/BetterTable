
import { useTableContext } from '../context';
import { TableData } from '../types';
import { TableHeaderCell } from './TableHeaderCell';
import { TableFloatingFilter } from './TableFloatingFilter';
import clsx from 'clsx';

function TableHeaderInner<T extends TableData>() {
  const {
    visibleColumns,
    selectable,
    selectionMode,
    rowActions,
    isAllSelected,
    isPartiallySelected,
    selectAll,
    deselectAll,
    locale,
    stickyHeader,
    filterMode,
  } = useTableContext<T>();

  const hasActions = rowActions && rowActions.length > 0;

  const showFloatingFilter = filterMode === 'floating' || filterMode === 'both';

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
                id="bt-select-all"
                name="bt-select-all"
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
      {showFloatingFilter && <TableFloatingFilter />}
    </thead>
  );
}

export const TableHeader = TableHeaderInner;
