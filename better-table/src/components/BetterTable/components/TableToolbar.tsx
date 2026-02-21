import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useTableContext } from '../context';
import { useMediaQuery } from '../hooks/useMediaQuery';
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

  const isMobile = useMediaQuery('(max-width: 640px)');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleSearch(e.target.value);
    },
    [handleSearch]
  );

  const toggleSearch = useCallback(() => {
    setSearchExpanded((prev) => {
      if (!prev) {
        // Focus input after expanding
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else {
        // Clear search when collapsing
        if (searchValue) clearSearch();
      }
      return !prev;
    });
  }, [searchValue, clearSearch]);

  // Keep search expanded if there's a value
  useEffect(() => {
    if (searchValue && !searchExpanded) {
      setSearchExpanded(true);
    }
  }, [searchValue, searchExpanded]);

  const hasToolbar =
    searchable || (globalActions && globalActions.length > 0) || (selectable && selectedCount > 0);

  if (!hasToolbar) {
    return null;
  }

  // On mobile, collapse search to icon button
  const showCollapsedSearch = isMobile && searchable && !searchExpanded;
  const showExpandedSearch = searchable && (!isMobile || searchExpanded);

  return (
    <div className={clsx('bt-toolbar', classNames.toolbar)}>
      <div className="bt-toolbar-left">
        {showCollapsedSearch && (
          <button
            className="bt-search-toggle"
            onClick={toggleSearch}
            aria-label={locale.search}
            title={locale.search}
            type="button"
          >
            🔍
          </button>
        )}

        {showExpandedSearch && (
          <div className={clsx('bt-search', isMobile && 'bt-search-mobile')}>
            <span className="bt-search-icon">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              className="bt-search-input"
              placeholder={locale.searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              aria-label={locale.search}
            />
            {(searchValue || isMobile) && (
              <button
                className="bt-search-clear"
                onClick={isMobile ? toggleSearch : clearSearch}
                aria-label={isMobile && !searchValue ? 'Close search' : 'Clear search'}
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {selectable && selectedCount > 0 && (
          <div className="bt-selection-info">
            <span className="bt-selection-count">
              {selectedCount} {isMobile ? 'sel.' : locale.selected}
            </span>
            <button
              className="bt-selection-clear"
              onClick={deselectAll}
              type="button"
            >
              {isMobile ? '✕' : locale.deselectAll}
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
                    action.variant && `bt-variant-${action.variant}`,
                    isMobile && 'bt-global-btn-mobile'
                  )}
                  onClick={() => action.onClick(selectedRows, data)}
                  disabled={isDisabled}
                  title={action.label}
                  aria-label={action.label}
                  type="button"
                >
                  {action.icon && (
                    <span className="bt-global-icon">{action.icon}</span>
                  )}
                  {!isMobile && <span>{action.label}</span>}
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
