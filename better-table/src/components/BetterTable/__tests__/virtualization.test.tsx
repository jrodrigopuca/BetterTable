import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BetterTable } from '../components/Table';
import { userColumns } from './helpers/test-data';
import type { User } from './helpers/test-data';
import { VIRTUALIZATION_THRESHOLD } from '../constants';

// Generate a large dataset for virtualization tests
function generateUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: 20 + (i % 40),
    isActive: i % 2 === 0,
    role: i % 3 === 0 ? 'admin' : 'user',
  }));
}

describe('Virtualization', () => {
  it('renders all rows normally when pagination is enabled (no virtualization)', () => {
    const data = generateUsers(20);
    const { container } = render(
      <BetterTable
        data={data}
        columns={userColumns}
        pagination={{ pageSize: 20 }}
      />
    );

    const rows = container.querySelectorAll('.bt-tbody .bt-tr');
    expect(rows.length).toBe(20);
  });

  it('renders all rows when pagination is off and dataset is below threshold', () => {
    const data = generateUsers(100);
    const { container } = render(
      <BetterTable
        data={data}
        columns={userColumns}
        pagination={false}
      />
    );

    const rows = container.querySelectorAll('.bt-tbody .bt-tr');
    expect(rows.length).toBe(100);
  });

  it('auto-enables virtualization when pagination is off and dataset exceeds threshold', () => {
    const data = generateUsers(VIRTUALIZATION_THRESHOLD + 100);
    const { container } = render(
      <BetterTable
        data={data}
        columns={userColumns}
        pagination={false}
      />
    );

    // Should render FEWER rows than total (virtualized)
    const rows = container.querySelectorAll('.bt-tbody .bt-tr');
    expect(rows.length).toBeLessThan(data.length);
    expect(rows.length).toBeGreaterThan(0);
  });

  it('adds aria-rowcount when virtualization is active', () => {
    const data = generateUsers(VIRTUALIZATION_THRESHOLD + 100);
    const { container } = render(
      <BetterTable
        data={data}
        columns={userColumns}
        pagination={false}
      />
    );

    const table = container.querySelector('[role="grid"]');
    expect(table?.getAttribute('aria-rowcount')).toBe(String(data.length));
  });

  it('does NOT virtualize when pagination is enabled even with large dataset', () => {
    const data = generateUsers(VIRTUALIZATION_THRESHOLD + 100);
    const { container } = render(
      <BetterTable
        data={data}
        columns={userColumns}
        pagination={{ pageSize: 50 }}
      />
    );

    // With pagination at 50, should show exactly 50 rows (first page)
    const rows = container.querySelectorAll('.bt-tbody .bt-tr');
    expect(rows.length).toBe(50);
  });

  it('respects virtualize={true} to force virtualization on smaller datasets', () => {
    const data = generateUsers(100);
    const { container } = render(
      <BetterTable
        data={data}
        columns={userColumns}
        pagination={false}
        virtualize={true}
        rowHeight={48}
      />
    );

    // With forced virtualization, should render fewer than 100 rows
    const rows = container.querySelectorAll('.bt-tbody .bt-tr');
    expect(rows.length).toBeLessThan(100);
  });

  it('respects virtualize={false} to disable auto-virtualization on large datasets', () => {
    const data = generateUsers(VIRTUALIZATION_THRESHOLD + 100);
    const { container } = render(
      <BetterTable
        data={data}
        columns={userColumns}
        pagination={false}
        virtualize={false}
      />
    );

    // Should render ALL rows since virtualization is explicitly disabled
    const rows = container.querySelectorAll('.bt-tbody .bt-tr');
    expect(rows.length).toBe(data.length);
  });

  it('renders spacer rows for virtual scroll area', () => {
    const data = generateUsers(VIRTUALIZATION_THRESHOLD + 100);
    const { container } = render(
      <BetterTable
        data={data}
        columns={userColumns}
        pagination={false}
      />
    );

    // Should have spacer rows with aria-hidden
    const spacers = container.querySelectorAll('tr[aria-hidden="true"]');
    expect(spacers.length).toBeGreaterThan(0);
  });
});
