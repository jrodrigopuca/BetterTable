import React, { useCallback, useMemo, KeyboardEvent, ReactNode } from 'react';
import { useTableContext } from '../context';
import { TableData, RowAction } from '../types';
import { getValueFromPath } from '../utils';
import { TableActionOverflow } from './TableActionOverflow';
import clsx from 'clsx';

/** Default icon for actions that don't define one */
const DEFAULT_ACTION_ICON = '📦';

interface TableCardProps<T extends TableData> {
  row: T;
  rowIndex: number;
}

function TableCardInner<T extends TableData>({ row, rowIndex }: TableCardProps<T>) {
  const {
    visibleColumns,
    selectable,
    rowActions,
    maxVisibleActions,
    isSelected,
    toggleRow,
    hoverable,
    onRowClick,
    openModal,
    closeModal,
  } = useTableContext<T>();

  const hasActions = rowActions && rowActions.length > 0;
  const selected = selectable && isSelected(row, rowIndex);

  // Primera columna como título
  const titleColumn = visibleColumns[0];
  const otherColumns = visibleColumns.slice(1);

  // Split visible actions into inline vs overflow
  const { inlineActions, overflowActions } = useMemo(() => {
    if (!rowActions) return { inlineActions: [], overflowActions: [] };

    const visible = rowActions.filter(
      (a) => !a.visible || a.visible(row)
    );

    if (visible.length <= maxVisibleActions) {
      return { inlineActions: visible, overflowActions: [] };
    }

    const inlineSlots = maxVisibleActions - 1;
    return {
      inlineActions: visible.slice(0, inlineSlots),
      overflowActions: visible.slice(inlineSlots),
    };
  }, [rowActions, maxVisibleActions, row]);

  const handleCheckboxChange = useCallback(() => {
    toggleRow(row, rowIndex);
  }, [row, rowIndex, toggleRow]);

  const handleCardClick = useCallback(() => {
    onRowClick?.(row, rowIndex);
  }, [row, rowIndex, onRowClick]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' && onRowClick) {
        handleCardClick();
      }
    },
    [handleCardClick, onRowClick]
  );

  const handleActionClick = useCallback(
    (action: RowAction<T>) => {
      if (action.mode === 'callback' && action.onClick) {
        action.onClick(row, rowIndex);
      } else if (action.mode === 'modal' && action.modalContent) {
        const ModalContent = action.modalContent;
        openModal(<ModalContent data={row} onClose={closeModal} />);
      } else if (action.mode === 'link' && action.href) {
        const url = typeof action.href === 'function' ? action.href(row) : action.href;
        window.open(url, '_blank');
      }
    },
    [row, rowIndex, openModal, closeModal]
  );

  // Renderizar valor de celda
  const renderCellValue = (column: typeof visibleColumns[0], value: unknown): ReactNode => {
    if (column.cell) {
      return column.cell(value, row, rowIndex) as ReactNode;
    }

    if (value === null || value === undefined) {
      return <span className="bt-card-value-empty">—</span>;
    }

    switch (column.type) {
      case 'boolean':
        return value ? '✅' : '❌';
      case 'date':
        if (value instanceof Date) {
          return value.toLocaleDateString();
        }
        const date = new Date(String(value));
        return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
      default:
        return String(value);
    }
  };

  const titleValue = titleColumn
    ? getValueFromPath(row as Record<string, unknown>, String(titleColumn.accessor))
    : '';

  return (
    <div
      className={clsx(
        'bt-card',
        hoverable && 'bt-hoverable',
        selected && 'bt-selected',
        onRowClick && 'bt-clickable'
      )}
      onClick={onRowClick ? handleCardClick : undefined}
      onKeyDown={onRowClick ? handleKeyDown : undefined}
      tabIndex={onRowClick ? 0 : undefined}
      role={onRowClick ? 'button' : undefined}
      aria-selected={selectable ? selected : undefined}
    >
      {/* Header con checkbox y título */}
      <div className="bt-card-header">
        {selectable && (
          <input
            id={`bt-card-select-${rowIndex}`}
            name={`bt-card-select-${rowIndex}`}
            type="checkbox"
            className="bt-checkbox"
            checked={selected}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select row ${rowIndex + 1}`}
          />
        )}
        <span className="bt-card-title">
          {titleColumn 
            ? (renderCellValue(titleColumn, titleValue) as React.ReactNode)
            : `Item ${rowIndex + 1}`}
        </span>
      </div>

      {/* Otras columnas */}
      {otherColumns.map((column) => {
        const value = getValueFromPath(
          row as Record<string, unknown>,
          String(column.accessor)
        );
        const cellContent = renderCellValue(column, value);

        return (
          <div key={column.id} className="bt-card-row">
            <span className="bt-card-label">{column.header}</span>
            <span className="bt-card-value">{cellContent as React.ReactNode}</span>
          </div>
        );
      })}

      {/* Acciones */}
      {hasActions && (
        <div className="bt-card-actions">
          {inlineActions.map((action) => {
            const isDisabled = action.disabled ? action.disabled(row) : false;
            const icon = action.icon ?? DEFAULT_ACTION_ICON;

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
                  onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(action);
                }}
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
              direction="up"
            />
          )}
        </div>
      )}
    </div>
  );
}

export const TableCard = React.memo(TableCardInner) as typeof TableCardInner;
