import { useTableContext } from '../context';

export function TableEmpty() {
  const { locale, emptyComponent, columns, selectable, rowActions } =
    useTableContext();

  const visibleColumns = columns.filter((col) => !col.hidden);
  const hasActions = rowActions && rowActions.length > 0;
  const colSpan = visibleColumns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0);

  if (emptyComponent) {
    return (
      <tbody className="bt-tbody">
        <tr className="bt-tr">
          <td className="bt-td" colSpan={colSpan}>
            {emptyComponent}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="bt-tbody">
      <tr className="bt-tr">
        <td className="bt-td" colSpan={colSpan}>
          <div className="bt-empty">
            <div className="bt-empty-icon">📭</div>
            <div className="bt-empty-text">{locale.noData}</div>
          </div>
        </td>
      </tr>
    </tbody>
  );
}
