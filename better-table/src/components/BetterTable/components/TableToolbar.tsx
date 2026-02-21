import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useTableContext } from '../context';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { TableData } from '../types';
import clsx from 'clsx';

/* Inline SVG icons */
function SearchIcon() {
  return (
    <svg className="bt-search-svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg className="bt-clear-svg" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="bt-check-svg" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="bt-filter-toggle-svg" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 2.5H11L7.5 6.5V10L4.5 9V6.5L1 2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

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
    filters,
    filterPanelOpen,
    toggleFilterPanel,
    hasFilterableColumns,
    filterMode,
  } = useTableContext<T>();

  const isMobile = useMediaQuery('(max-width: 640px)');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeFilterCount = Object.keys(filters).length;

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

  const showFilterPanelToggle = hasFilterableColumns && (filterMode === 'panel' || filterMode === 'both');

  const hasToolbar =
    searchable || showFilterPanelToggle || (globalActions && globalActions.length > 0) || (selectable && selectedCount > 0);

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
            <SearchIcon />
          </button>
        )}

        {showExpandedSearch && (
          <div className={clsx('bt-search', isMobile && 'bt-search-mobile')}>
            <span className="bt-search-icon"><SearchIcon /></span>
            <input
              id="bt-search"
              name="bt-search"
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
                aria-label={locale.clearSearch}
                type="button"
              >
                <ClearIcon />
              </button>
            )}
          </div>
        )}

        {showFilterPanelToggle && (
          <button
            className={clsx(
              'bt-filter-toggle',
              filterPanelOpen && 'bt-filter-toggle-active'
            )}
            onClick={toggleFilterPanel}
            aria-expanded={filterPanelOpen}
            aria-label={locale.filterBy}
            title={locale.filterBy}
            type="button"
          >
            <span className="bt-filter-toggle-icon"><FilterIcon /></span>
            {!isMobile && <span>{locale.filterBy}</span>}
            {activeFilterCount > 0 && (
              <span className="bt-filter-toggle-badge">{activeFilterCount}</span>
            )}
          </button>
        )}

        {selectable && selectedCount > 0 && (
          <div className="bt-selection-info">
            <CheckIcon />
            <span className="bt-selection-count">
              {selectedCount} {isMobile ? 'sel.' : locale.selected}
            </span>
            <button
              className="bt-selection-clear"
              onClick={deselectAll}
              type="button"
            >
              {isMobile ? <ClearIcon /> : locale.deselectAll}
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
