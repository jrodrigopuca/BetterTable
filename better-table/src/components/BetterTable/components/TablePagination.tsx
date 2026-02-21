import React, { useMemo, useCallback } from 'react';
import { useTableContext } from '../context';

export function TablePagination() {
  const {
    page,
    pageSize,
    totalPages,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
    paginationEnabled,
    pageSizeOptions,
    showSizeChanger,
    locale,
    classNames,
  } = useTableContext();

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      changePageSize(Number(e.target.value));
    },
    [changePageSize]
  );

  const handleQuickJump = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const value = parseInt((e.target as HTMLInputElement).value, 10);
        if (!isNaN(value) && value >= 1 && value <= totalPages) {
          goToPage(value);
        }
      }
    },
    [goToPage, totalPages]
  );

  // Generate page numbers to show
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push('ellipsis');
      }

      // Pages around current
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [page, totalPages]);

  if (!paginationEnabled) {
    return null;
  }

  return (
    <div className={`bt-pagination ${classNames.pagination || ''}`}>
      <div className="bt-pagination-info">
        {totalItems > 0
          ? `${startIndex}-${endIndex} ${locale.of} ${totalItems} ${locale.items}`
          : `0 ${locale.items}`}
      </div>

      <div className="bt-pagination-controls">
        {showSizeChanger && (
          <div className="bt-page-size">
            <label className="bt-page-size-label" htmlFor="bt-page-size">{locale.rowsPerPage}:</label>
            <select
              id="bt-page-size"
              name="bt-page-size"
              className="bt-page-size-select"
              value={pageSize}
              onChange={handlePageSizeChange}
              aria-label={locale.rowsPerPage}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          className="bt-pagination-btn"
          onClick={prevPage}
          disabled={!hasPrevPage}
          aria-label={locale.previousPage}
          type="button"
        >
          ←
        </button>

        <div className="bt-pagination-pages">
          {pageNumbers.map((pageNum, idx) => {
            if (pageNum === 'ellipsis') {
              return (
                <span key={`ellipsis-${idx}`} className="bt-pagination-ellipsis">
                  ...
                </span>
              );
            }
            return (
              <button
                key={pageNum}
                className={`bt-pagination-btn ${page === pageNum ? 'bt-active' : ''}`}
                onClick={() => goToPage(pageNum)}
                aria-label={`${locale.page} ${pageNum}`}
                aria-current={page === pageNum ? 'page' : undefined}
                type="button"
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          className="bt-pagination-btn"
          onClick={nextPage}
          disabled={!hasNextPage}
          aria-label={locale.nextPage}
          type="button"
        >
          →
        </button>

        <div className="bt-quick-jumper">
          <label className="bt-quick-jumper-label" htmlFor="bt-quick-jumper">{locale.page}:</label>
          <input
            id="bt-quick-jumper"
            name="bt-quick-jumper"
            key={page}
            type="number"
            className="bt-quick-jumper-input"
            min={1}
            max={totalPages}
            defaultValue={page}
            onKeyDown={handleQuickJump}
            aria-label={locale.jumpToPage}
          />
        </div>
      </div>
    </div>
  );
}
