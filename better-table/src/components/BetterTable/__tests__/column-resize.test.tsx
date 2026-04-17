import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BetterTable } from '../components/Table';
import { mockUsers, userColumns } from './helpers/test-data';
import type { User } from './helpers/test-data';
import type { Column } from '../types';

describe('Column Resizing', () => {
  it('does not render resize handles when resizable is false (default)', () => {
    const { container } = render(
      <BetterTable data={mockUsers} columns={userColumns} />
    );

    const handles = container.querySelectorAll('.bt-resize-handle');
    expect(handles.length).toBe(0);
  });

  it('renders resize handles on each column header when resizable is true', () => {
    const { container } = render(
      <BetterTable data={mockUsers} columns={userColumns} resizable />
    );

    const handles = container.querySelectorAll('.bt-resize-handle');
    expect(handles.length).toBe(userColumns.length);
  });

  it('applies table-layout: fixed class when resizable', () => {
    const { container } = render(
      <BetterTable data={mockUsers} columns={userColumns} resizable />
    );

    const table = container.querySelector('.bt-table');
    expect(table?.classList.contains('bt-table-resizable')).toBe(true);
  });

  it('renders colgroup with col elements when resizable', () => {
    const { container } = render(
      <BetterTable data={mockUsers} columns={userColumns} resizable />
    );

    const colgroup = container.querySelector('colgroup');
    expect(colgroup).not.toBeNull();
    const cols = colgroup!.querySelectorAll('col');
    // 5 columns (no selection, no row actions)
    expect(cols.length).toBe(userColumns.length);
  });

  it('renders extra col for selection checkbox when selectable', () => {
    const { container } = render(
      <BetterTable
        data={mockUsers}
        columns={userColumns}
        resizable
        selectable
        selectionMode="multiple"
      />
    );

    const cols = container.querySelectorAll('colgroup col');
    // 1 checkbox col + 5 data cols
    expect(cols.length).toBe(userColumns.length + 1);
  });

  it('respects per-column resizable=false to hide handle on specific column', () => {
    const columnsWithNonResizable: Column<User>[] = userColumns.map((col, i) =>
      i === 0 ? { ...col, resizable: false } : col
    );

    const { container } = render(
      <BetterTable
        data={mockUsers}
        columns={columnsWithNonResizable}
        resizable
      />
    );

    const handles = container.querySelectorAll('.bt-resize-handle');
    // All columns except the first one
    expect(handles.length).toBe(userColumns.length - 1);
  });

  it('adds data-column-id attribute to th elements when resizable', () => {
    const { container } = render(
      <BetterTable data={mockUsers} columns={userColumns} resizable />
    );

    const ths = container.querySelectorAll('.bt-th[data-column-id]');
    expect(ths.length).toBe(userColumns.length);
    expect(ths[0].getAttribute('data-column-id')).toBe('name');
  });

  it('resize handles have correct aria attributes', () => {
    const { container } = render(
      <BetterTable data={mockUsers} columns={userColumns} resizable />
    );

    const handle = container.querySelector('.bt-resize-handle');
    expect(handle?.getAttribute('role')).toBe('separator');
    expect(handle?.getAttribute('aria-orientation')).toBe('vertical');
    expect(handle?.getAttribute('aria-label')).toContain('Resize');
  });

  it('fires onColumnResize callback after drag completes', () => {
    const onResize = vi.fn();
    const { container } = render(
      <BetterTable
        data={mockUsers}
        columns={userColumns}
        resizable
        onColumnResize={onResize}
      />
    );

    const handle = container.querySelector('.bt-resize-handle')!;

    // Simulate drag: mousedown on handle, mousemove, mouseup
    fireEvent.mouseDown(handle, { clientX: 100 });

    // Move 50px to the right
    fireEvent.mouseMove(document, { clientX: 150 });
    fireEvent.mouseUp(document);

    // onColumnResize should have been called
    expect(onResize).toHaveBeenCalledWith('name', expect.any(Number));
  });
});
