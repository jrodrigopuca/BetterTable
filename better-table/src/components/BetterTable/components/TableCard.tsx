import React, { useCallback, KeyboardEvent, ReactNode } from 'react';
import { useTableContext } from '../context';
import { TableData, RowAction } from '../types';
import { getValueFromPath } from '../utils';
import clsx from 'clsx';

interface TableCardProps<T extends TableData> {
  row: T;
  rowIndex: number;
}

function TableCardInner<T extends TableData>({ row, rowIndex }: TableCardProps<T>) {
  const {
    columns,
    selectable,
    rowActions,
    isSelected,
    toggleRow,
    hoverable,
    onRowClick,
    openModal,
    closeModal,
  } = useTableContext<T>();

  const visibleColumns = columns.filter((col) => !col.hidden);
  const hasActions = rowActions && rowActions.length > 0;
  const selected = selectable && isSelected(row, rowIndex);

  // Primera columna como título
  const titleColumn = visibleColumns[0];
  const otherColumns = visibleColumns.slice(1);

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
          {rowActions!.map((action) => {
            if (action.visible && !action.visible(row)) {
              return null;
            }

            const isDisabled = action.disabled ? action.disabled(row) : false;

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
                  onClick={(e) => e.stopPropagation()}
                >
                  {action.icon && <span className="bt-action-icon">{action.icon}</span>}
                  <span>{action.label}</span>
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(action);
                }}
                disabled={isDisabled}
                type="button"
              >
                {action.icon && <span className="bt-action-icon">{action.icon}</span>}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const TableCard = React.memo(TableCardInner) as typeof TableCardInner;
