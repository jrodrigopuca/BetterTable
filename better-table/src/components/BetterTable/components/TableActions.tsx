import React, { useCallback } from 'react';
import { useTableContext } from '../context';
import { TableData, RowAction } from '../types';
import clsx from 'clsx';

interface TableActionsProps<T extends TableData> {
  row: T;
  rowIndex: number;
}

function TableActionsInner<T extends TableData>({
  row,
  rowIndex,
}: TableActionsProps<T>) {
  const { rowActions, openModal } = useTableContext<T>();

  const handleActionClick = useCallback(
    (action: RowAction<T>) => {
      if (action.mode === 'callback' && action.onClick) {
        action.onClick(row, rowIndex);
      } else if (action.mode === 'modal' && action.modalContent) {
        const ModalContent = action.modalContent;
        openModal(
          <ModalContent
            data={row}
            onClose={() => {
              // Modal will be closed by the Table component
            }}
          />
        );
      } else if (action.mode === 'link' && action.href) {
        const url = typeof action.href === 'function' ? action.href(row) : action.href;
        window.open(url, '_blank');
      }
    },
    [row, rowIndex, openModal]
  );

  if (!rowActions || rowActions.length === 0) {
    return null;
  }

  return (
    <td className="bt-td bt-actions-cell">
      <div className="bt-actions-wrapper">
        {rowActions.map((action) => {
          // Check visibility
          if (action.visible && !action.visible(row)) {
            return null;
          }

          const isDisabled = action.disabled ? action.disabled(row) : false;

          // Render as link if mode is 'link'
          if (action.mode === 'link' && action.href) {
            const url =
              typeof action.href === 'function' ? action.href(row) : action.href;
            return (
              <a
                key={action.id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  'bt-action-btn',
                  action.variant && `bt-variant-${action.variant}`
                )}
                aria-label={action.label}
              >
                {action.icon && <span className="bt-action-icon">{action.icon}</span>}
              </a>
            );
          }

          return (
            <button
              key={action.id}
              className={clsx(
                'bt-action-btn',
                action.variant && `bt-variant-${action.variant}`
              )}
              onClick={() => handleActionClick(action)}
              disabled={isDisabled}
              aria-label={action.label}
              title={action.label}
              type="button"
            >
              {action.icon && <span className="bt-action-icon">{action.icon}</span>}
            </button>
          );
        })}
      </div>
    </td>
  );
}

export const TableActions = React.memo(
  TableActionsInner
) as typeof TableActionsInner;
