import { useState, useRef, useEffect, useCallback } from 'react';
import { useTableContext } from '../context';
import { TableData } from '../types';
import clsx from 'clsx';

/* Inline SVG icons */
function ColumnsIcon() {
  return (
    <svg className="bt-columns-svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1.5" y="2" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="8.5" y="2" width="4" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TableColumnVisibilityInner<T extends TableData>() {
  const {
    columns,
    hiddenColumnIds,
    toggleColumn,
    showAllColumns,
    isColumnVisible,
    locale,
    columnVisibilityEnabled,
  } = useTableContext<T>();

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const hiddenCount = hiddenColumnIds.size;

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  if (!columnVisibilityEnabled) return null;

  // Only show toggleable columns (not custom type or columns that shouldn't be toggled)
  const toggleableColumns = columns.filter((col) => col.type !== 'custom');

  return (
    <div className="bt-column-visibility" ref={containerRef}>
      <button
        ref={buttonRef}
        className={clsx('bt-column-visibility-btn', open && 'bt-column-visibility-btn-active')}
        onClick={handleToggle}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={locale.columns}
        title={locale.columns}
        type="button"
      >
        <ColumnsIcon />
        <span className="bt-column-visibility-label">{locale.columns}</span>
        {hiddenCount > 0 && (
          <span className="bt-column-visibility-badge">{hiddenCount}</span>
        )}
      </button>

      {open && (
        <div className="bt-column-visibility-dropdown" role="menu">
          <div className="bt-column-visibility-header">
            <span className="bt-column-visibility-title">{locale.columns}</span>
            {hiddenCount > 0 && (
              <button
                className="bt-column-visibility-show-all"
                onClick={showAllColumns}
                type="button"
              >
                {locale.showAllColumns}
              </button>
            )}
          </div>
          <div className="bt-column-visibility-list">
            {toggleableColumns.map((column) => {
              const visible = isColumnVisible(column.id);
              return (
                <button
                  key={column.id}
                  className={clsx(
                    'bt-column-visibility-item',
                    !visible && 'bt-column-visibility-item-hidden'
                  )}
                  onClick={() => toggleColumn(column.id)}
                  role="menuitemcheckbox"
                  aria-checked={visible}
                  type="button"
                >
                  <span className={clsx('bt-column-visibility-check', visible && 'bt-column-visibility-check-active')}>
                    {visible && <CheckIcon />}
                  </span>
                  <span className="bt-column-visibility-item-label">{column.header}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export const TableColumnVisibility = TableColumnVisibilityInner;
