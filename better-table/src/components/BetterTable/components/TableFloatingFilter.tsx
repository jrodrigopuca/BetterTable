import React, { useCallback, useMemo } from 'react';
import { TableData, Column, DateFilterRange } from '../types';
import { useTableContext } from '../context';
import clsx from 'clsx';

/**
 * Compact filter icon (funnel) used as visual cue inside floating inputs.
 * Rendered as an inline SVG so it inherits currentColor.
 */
const FilterIcon = () => (
  <svg
    className="bt-ff-icon"
    width="12"
    height="12"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1.5 2h13L9.5 8.5V14l-3-1.5V8.5z" />
  </svg>
);

/**
 * Floating filter row rendered inside <thead> — one input per filterable column.
 * Reads and writes to the same filterValues state as the FilterPanel.
 */
function TableFloatingFilterInner<T extends TableData>() {
  const {
    visibleColumns,
    filters,
    setFilter,
    selectable,
    selectionMode,
    rowActions,
    locale,
    stickyHeader,
  } = useTableContext<T>();

  const hasActions = rowActions && rowActions.length > 0;

  // Only render if at least one column is filterable
  const hasFilterable = visibleColumns.some(
    (col) => col.filterable !== false && col.type !== 'custom'
  );
  if (!hasFilterable) return null;

  return (
    <tr className={clsx('bt-tr', 'bt-floating-filter-row', stickyHeader && 'bt-sticky-filter')}>
      {/* Checkbox column spacer */}
      {selectable && selectionMode === 'multiple' && (
        <th className="bt-th bt-floating-filter-cell bt-checkbox-cell" />
      )}
      {selectable && selectionMode === 'single' && (
        <th className="bt-th bt-floating-filter-cell bt-checkbox-cell" />
      )}

      {/* One filter cell per visible column */}
      {visibleColumns.map((column) => (
        <th
          key={column.id}
          className={clsx(
            'bt-th',
            'bt-floating-filter-cell',
            column.align && `bt-align-${column.align}`
          )}
          style={{ width: column.width }}
        >
          {column.filterable !== false && column.type !== 'custom' ? (
            <FloatingInput
              column={column}
              value={filters[column.id]}
              setFilter={setFilter}
              locale={locale}
            />
          ) : null}
        </th>
      ))}

      {/* Actions column spacer */}
      {hasActions && (
        <th className="bt-th bt-floating-filter-cell bt-actions-cell" />
      )}
    </tr>
  );
}

/* ──────────────────────────────────────────────
   Individual floating filter input
   ────────────────────────────────────────────── */

interface FloatingInputProps<T extends TableData> {
  column: Column<T>;
  value: string | number | boolean | DateFilterRange | null | undefined;
  setFilter: (
    columnId: string,
    value: string | number | boolean | DateFilterRange | null
  ) => void;
  locale: ReturnType<typeof useTableContext>['locale'];
}

function FloatingInputInner<T extends TableData>({
  column,
  value,
  setFilter,
  locale,
}: FloatingInputProps<T>) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const v = e.target.value;
      if (column.type === 'boolean') {
        if (v === '') {
          setFilter(column.id, null);
        } else {
          setFilter(column.id, v === 'true');
        }
      } else {
        setFilter(column.id, v || null);
      }
    },
    [column.id, column.type, setFilter]
  );

  const handleDateChange = useCallback(
    (field: 'from' | 'to', v: string) => {
      const current = (value as DateFilterRange) ?? {};
      const newRange: DateFilterRange = { ...current, [field]: v || undefined };
      setFilter(column.id, newRange);
    },
    [column.id, value, setFilter]
  );

  const fieldId = `bt-ff-${column.id}`;

  /** Whether this filter has an active (non-empty) value */
  const isActive = useMemo(() => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'object') {
      const dr = value as DateFilterRange;
      return !!(dr.from || dr.to);
    }
    return value !== '';
  }, [value]);

  if (column.type === 'boolean') {
    return (
      <div className={clsx('bt-ff-wrapper', isActive && 'bt-ff-active')}>
        <FilterIcon />
        <select
          id={fieldId}
          name={fieldId}
          className="bt-floating-filter-select"
          value={value === null || value === undefined ? '' : String(value)}
          onChange={handleChange}
          aria-label={`${locale.filterBy} ${column.header}`}
        >
          <option value="">—</option>
          <option value="true">✅</option>
          <option value="false">❌</option>
        </select>
      </div>
    );
  }

  if (column.type === 'date') {
    const dateRange = (value as DateFilterRange) ?? {};
    return (
      <div className={clsx('bt-floating-filter-dates', isActive && 'bt-ff-active')}>
        <input
          id={`${fieldId}-from`}
          name={`${fieldId}-from`}
          type="date"
          className="bt-floating-filter-input"
          value={dateRange.from ?? ''}
          onChange={(e) => handleDateChange('from', e.target.value)}
          aria-label={`${locale.dateFrom} ${column.header}`}
          title={locale.dateFrom}
        />
        <span className="bt-ff-date-sep">–</span>
        <input
          id={`${fieldId}-to`}
          name={`${fieldId}-to`}
          type="date"
          className="bt-floating-filter-input"
          value={dateRange.to ?? ''}
          onChange={(e) => handleDateChange('to', e.target.value)}
          aria-label={`${locale.dateTo} ${column.header}`}
          title={locale.dateTo}
        />
      </div>
    );
  }

  return (
    <div className={clsx('bt-ff-wrapper', isActive && 'bt-ff-active')}>
      <FilterIcon />
      <input
        id={fieldId}
        name={fieldId}
        type={column.type === 'number' ? 'number' : 'text'}
        className="bt-floating-filter-input"
        placeholder="..."
        value={value !== null && value !== undefined ? String(value) : ''}
        onChange={handleChange}
        aria-label={`${locale.filterBy} ${column.header}`}
      />
    </div>
  );
}

const FloatingInput = React.memo(FloatingInputInner) as typeof FloatingInputInner;

export const TableFloatingFilter = React.memo(
  TableFloatingFilterInner
) as unknown as typeof TableFloatingFilterInner;
