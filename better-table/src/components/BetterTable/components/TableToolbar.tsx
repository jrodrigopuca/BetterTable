import React, { useCallback } from 'react';
import { useTableContext } from '../context';
import { TableData } from '../types';
import clsx from 'clsx';

function TableToolbarInner<T extends TableData>() {
  const {
    searchable,
    searchValue,
    handleSearch,
    clearSearch,
    globalActions,
    selectedRows,
    selectedCount,
    deselectAll,
    data,
    locale,
    classNames,
    selectable,
  } = useTableContext<T>();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleSearch(e.target.value);
    },
    [handleSearch]
  );

  const hasToolbar =
    searchable || (globalActions && globalActions.length > 0) || (selectable && selectedCount > 0);

  if (!hasToolbar) {
    return null;
  }

  return (
    <div className={`bt-toolbar ${classNames.toolbar || ''}`}>
      <div className="bt-toolbar-left">
        {searchable && (
          <div className="bt-search">
            <span className="bt-search-icon">🔍</span>
            <input
              type="text"
              className="bt-search-input"
              placeholder={locale.searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              aria-label={locale.search}
            />
            {searchValue && (
              <button
                className="bt-search-clear"
                onClick={clearSearch}
                aria-label="Clear search"
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {selectable && selectedCount > 0 && (
          <div className="bt-selection-info">
            <span>
              {selectedCount} {locale.selected}
            </span>
            <button
              className="bt-selection-clear"
              onClick={deselectAll}
              type="button"
            >
              {locale.deselectAll}
            </button>
          </div>
        )}
      </div>

      {globalActions && globalActions.length > 0 && (
        <div className="bt-toolbar-right">
          <div className="bt-global-actions">
            {globalActions.map((action) => {
              const isDisabled =
                action.requiresSelection && selectedRows.length === 0;

              return (
                <button
                  key={action.id}
                  className={clsx(
                    'bt-global-btn',
                    action.variant && `bt-variant-${action.variant}`
                  )}
                  onClick={() => action.onClick(selectedRows, data)}
                  disabled={isDisabled}
                  title={action.label}
                  type="button"
                >
                  {action.icon && (
                    <span className="bt-global-icon">{action.icon}</span>
                  )}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export const TableToolbar = TableToolbarInner;
