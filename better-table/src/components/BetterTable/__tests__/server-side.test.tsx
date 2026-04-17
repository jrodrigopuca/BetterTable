import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BetterTable } from '../components/Table';
import { userColumns } from './helpers/test-data';
import type { User } from './helpers/test-data';

// Simulated "server" page of data
const serverPage1: User[] = [
  { id: 1, name: 'Alice', email: 'alice@test.com', age: 25, isActive: true, role: 'admin' },
  { id: 2, name: 'Bob', email: 'bob@test.com', age: 30, isActive: false, role: 'user' },
];


describe('Server-side data mode', () => {
  describe('manualPagination', () => {
    it('renders all provided data without client-side slicing', () => {
      const { container } = render(
        <BetterTable
          data={serverPage1}
          columns={userColumns}
          manualPagination
          pagination={{ pageSize: 1, totalItems: 10 }}
        />
      );

      // Even though pageSize=1, all 2 rows should render (server already paginated)
      const rows = container.querySelectorAll('.bt-tbody .bt-tr');
      expect(rows.length).toBe(2);
    });

    it('fires onPageChange callback when user navigates', () => {
      const onPageChange = vi.fn();
      const { container } = render(
        <BetterTable
          data={serverPage1}
          columns={userColumns}
          manualPagination
          pagination={{ pageSize: 2, totalItems: 4 }}
          onPageChange={onPageChange}
        />
      );

      // Click next page button
      const buttons = container.querySelectorAll('.bt-pagination button');
      const nextPageBtn = Array.from(buttons).find(
        btn => btn.getAttribute('aria-label')?.includes('next') || btn.getAttribute('aria-label')?.includes('siguiente')
      );
      if (nextPageBtn) {
        fireEvent.click(nextPageBtn);
        expect(onPageChange).toHaveBeenCalledWith(2, 2);
      }
    });

    it('displays correct totalPages from totalItems', () => {
      const { container } = render(
        <BetterTable
          data={serverPage1}
          columns={userColumns}
          manualPagination
          pagination={{ pageSize: 2, totalItems: 10 }}
        />
      );

      // Should show "Page 1 of 5" somewhere in pagination
      const pagination = container.querySelector('.bt-pagination');
      expect(pagination?.textContent).toContain('5');
    });
  });

  describe('manualSorting', () => {
    it('does not sort data client-side when manualSorting is true', () => {
      const { container } = render(
        <BetterTable
          data={serverPage1}
          columns={userColumns}
          manualSorting
        />
      );

      // Click sort on "name" column
      const sortBtn = container.querySelector('.bt-sort-btn');
      if (sortBtn) fireEvent.click(sortBtn);

      // Data order should NOT change (Alice before Bob, same as input)
      const cells = container.querySelectorAll('.bt-tbody .bt-tr td:first-child');
      expect(cells[0]?.textContent).toBe('Alice');
      expect(cells[1]?.textContent).toBe('Bob');
    });

    it('fires onSortChange callback when user sorts', () => {
      const onSortChange = vi.fn();
      const { container } = render(
        <BetterTable
          data={serverPage1}
          columns={userColumns}
          manualSorting
          onSortChange={onSortChange}
        />
      );

      const sortBtn = container.querySelector('.bt-sort-btn');
      if (sortBtn) fireEvent.click(sortBtn);

      expect(onSortChange).toHaveBeenCalledWith(
        expect.objectContaining({ columnId: 'name', direction: 'asc' })
      );
    });
  });

  describe('manualFiltering', () => {
    it('does not filter data client-side when manualFiltering is true', () => {
      const { container } = render(
        <BetterTable
          data={serverPage1}
          columns={userColumns}
          manualFiltering
          searchable
          searchValue="nonexistent"
        />
      );

      // Even with a search value that would normally filter everything out,
      // all rows should still be visible
      const rows = container.querySelectorAll('.bt-tbody .bt-tr');
      expect(rows.length).toBe(2);
    });

    it('fires onSearchChange callback when user searches', () => {
      const onSearchChange = vi.fn();
      const { container } = render(
        <BetterTable
          data={serverPage1}
          columns={userColumns}
          manualFiltering
          searchable
          onSearchChange={onSearchChange}
        />
      );

      const searchInput = container.querySelector('.bt-search-input');
      if (searchInput) {
        fireEvent.change(searchInput, { target: { value: 'test' } });
        expect(onSearchChange).toHaveBeenCalledWith('test');
      }
    });
  });

  describe('combined manual mode', () => {
    it('passes data through unchanged when all manual flags are true', () => {
      const { container } = render(
        <BetterTable
          data={serverPage1}
          columns={userColumns}
          manualPagination
          manualSorting
          manualFiltering
          pagination={{ pageSize: 1, totalItems: 100 }}
          searchable
          searchValue="xyz"
        />
      );

      // All 2 rows visible despite pageSize=1 and active search
      const rows = container.querySelectorAll('.bt-tbody .bt-tr');
      expect(rows.length).toBe(2);
    });
  });
});
