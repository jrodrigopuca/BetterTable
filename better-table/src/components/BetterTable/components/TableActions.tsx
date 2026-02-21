import React, { useCallback, useMemo } from 'react';
import { useTableContext } from '../context';
import { TableData, RowAction } from '../types';
import { TableActionOverflow } from './TableActionOverflow';
import clsx from 'clsx';

/** Default icon for actions that don't define one */
const DEFAULT_ACTION_ICON = '📦';

interface TableActionsProps<T extends TableData> {
  row: T;
  rowIndex: number;
}

function TableActionsInner<T extends TableData>({
  row,
  rowIndex,
}: TableActionsProps<T>) {
  const { rowActions, openModal, closeModal, maxVisibleActions } = useTableContext<T>();

  const handleActionClick = useCallback(
    (action: RowAction<T>) => {
      if (action.mode === 'callback' && action.onClick) {
        action.onClick(row, rowIndex);
      } else if (action.mode === 'modal' && action.modalContent) {
        const ModalContent = action.modalContent;
        openModal(
          <ModalContent
            data={row}
            onClose={closeModal}
          />
        );
      } else if (action.mode === 'link' && action.href) {
        const url = typeof action.href === 'function' ? action.href(row) : action.href;
        window.open(url, '_blank');
      }
    },
    [row, rowIndex, openModal, closeModal]
  );

  // Split visible actions into inline vs overflow
  const { inlineActions, overflowActions } = useMemo(() => {
    if (!rowActions) return { inlineActions: [], overflowActions: [] };

    const visible = rowActions.filter(
      (a) => !a.visible || a.visible(row)
    );

    if (visible.length <= maxVisibleActions) {
      return { inlineActions: visible, overflowActions: [] };
    }

    // Reserve one slot for the ⋯ trigger
    const inlineSlots = maxVisibleActions - 1;
    return {
      inlineActions: visible.slice(0, inlineSlots),
      overflowActions: visible.slice(inlineSlots),
    };
  }, [rowActions, maxVisibleActions, row]);

  if (!rowActions || rowActions.length === 0) {
    return null;
  }

  return (
    <td className="bt-td bt-actions-cell">
      <div className="bt-actions-wrapper">
        {inlineActions.map((action) => {
          const isDisabled = action.disabled ? action.disabled(row) : false;
          const icon = action.icon ?? DEFAULT_ACTION_ICON;

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
                  'bt-action-btn bt-action-icon-only',
                  action.variant && `bt-variant-${action.variant}`
                )}
                aria-label={action.label}
                title={action.label}
              >
                <span className="bt-action-icon">{icon}</span>
              </a>
            );
          }

          return (
            <button
              key={action.id}
              className={clsx(
                'bt-action-btn bt-action-icon-only',
                action.variant && `bt-variant-${action.variant}`
              )}
              onClick={() => handleActionClick(action)}
              disabled={isDisabled}
              aria-label={action.label}
              title={action.label}
              type="button"
            >
              <span className="bt-action-icon">{icon}</span>
            </button>
          );
        })}

        {overflowActions.length > 0 && (
          <TableActionOverflow
            actions={overflowActions}
            row={row}
            rowIndex={rowIndex}
            onActionClick={handleActionClick}
            direction="down"
          />
        )}
      </div>
    </td>
  );
}

export const TableActions = React.memo(
  TableActionsInner
) as typeof TableActionsInner;
