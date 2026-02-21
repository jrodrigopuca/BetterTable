import { useTableContext } from '../context';

/* Inline SVG empty-box illustration */
function EmptyIcon() {
  return (
    <svg className="bt-empty-svg" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="12" y="18" width="40" height="32" rx="3" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d="M12 28H52" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <path d="M24 38H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M28 44H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.25" />
      <circle cx="32" cy="12" r="4" stroke="currentColor" strokeWidth="2" opacity="0.2" />
    </svg>
  );
}

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
            <div className="bt-empty-icon"><EmptyIcon /></div>
            <div className="bt-empty-text">{locale.noData}</div>
          </div>
        </td>
      </tr>
    </tbody>
  );
}
