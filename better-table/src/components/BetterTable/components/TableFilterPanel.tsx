import React, { useCallback } from 'react';
import { TableData, Column, DateFilterRange } from '../types';
import { useTableContext } from '../context';
import clsx from 'clsx';

interface TableFilterPanelProps {
  open: boolean;
}

function TableFilterPanelInner<T extends TableData>({
  open,
}: TableFilterPanelProps) {
  const { columns, filters, setFilter, clearFilter, clearFilters, locale } =
    useTableContext<T>();

  const filterableColumns = columns.filter(
    (col) => col.filterable !== false && col.type !== 'custom' && !col.hidden
  );

  if (!open || filterableColumns.length === 0) {
    return null;
  }

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className="bt-filter-panel" role="region" aria-label={locale.filterBy}>
      <div className="bt-filter-panel-grid">
        {filterableColumns.map((column) => (
          <FilterField
            key={column.id}
            column={column}
            value={filters[column.id]}
            setFilter={setFilter}
            clearFilter={clearFilter}
            locale={locale}
          />
        ))}
      </div>

      {activeFilterCount > 0 && (
        <div className="bt-filter-panel-footer">
          <button
            className="bt-filter-panel-clear"
            onClick={clearFilters}
            type="button"
          >
            {locale.clearFilters}
          </button>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Individual filter field
   ────────────────────────────────────────────── */

interface FilterFieldProps<T extends TableData> {
  column: Column<T>;
  value: string | number | boolean | DateFilterRange | null | undefined;
  setFilter: (
    columnId: string,
    value: string | number | boolean | DateFilterRange | null
  ) => void;
  clearFilter: (columnId: string) => void;
  locale: ReturnType<typeof useTableContext>['locale'];
}

function FilterFieldInner<T extends TableData>({
  column,
  value,
  setFilter,
  locale,
}: FilterFieldProps<T>) {
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

  const hasValue =
    value !== null && value !== undefined && value !== '';

  // For date: check if at least one field is set
  const isDateActive =
    hasValue &&
    typeof value === 'object' &&
    ('from' in value || 'to' in value) &&
    Boolean((value as DateFilterRange).from || (value as DateFilterRange).to);

  const isActive = column.type === 'date' ? isDateActive : hasValue;

  const renderInput = () => {
    if (column.type === 'boolean') {
      return (
        <select
          className="bt-filter-select"
          value={
            value === null || value === undefined ? '' : String(value)
          }
          onChange={handleChange}
          aria-label={`${locale.filterBy} ${column.header}`}
        >
          <option value="">—</option>
          <option value="true">✅</option>
          <option value="false">❌</option>
        </select>
      );
    }

    if (column.type === 'date') {
      const dateRange = (value as DateFilterRange) ?? {};
      return (
        <div className="bt-filter-field-dates">
          <input
            type="date"
            className="bt-filter-input"
            value={dateRange.from ?? ''}
            onChange={(e) => handleDateChange('from', e.target.value)}
            aria-label={`${locale.dateFrom} ${column.header}`}
            placeholder={locale.dateFrom}
          />
          <span className="bt-filter-field-separator">–</span>
          <input
            type="date"
            className="bt-filter-input"
            value={dateRange.to ?? ''}
            onChange={(e) => handleDateChange('to', e.target.value)}
            aria-label={`${locale.dateTo} ${column.header}`}
            placeholder={locale.dateTo}
          />
        </div>
      );
    }

    return (
      <input
        type={column.type === 'number' ? 'number' : 'text'}
        className="bt-filter-input"
        placeholder={`${locale.filterBy}...`}
        value={
          value !== null && value !== undefined ? String(value) : ''
        }
        onChange={handleChange}
        aria-label={`${locale.filterBy} ${column.header}`}
      />
    );
  };

  return (
    <div className={clsx('bt-filter-field', isActive && 'bt-filter-field-active')}>
      <label className="bt-filter-field-label">{column.header}</label>
      {renderInput()}
    </div>
  );
}

const FilterField = React.memo(FilterFieldInner) as typeof FilterFieldInner;

export const TableFilterPanel = React.memo(
  TableFilterPanelInner
) as typeof TableFilterPanelInner;
