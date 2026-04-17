import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BetterTable } from '../components/Table';
import { mockUsers, userColumns } from './helpers/test-data';

describe('Sticky headers', () => {
  it('does not apply sticky class by default', () => {
    const { container } = render(
      <BetterTable data={mockUsers} columns={userColumns} />
    );

    const thead = container.querySelector('.bt-thead');
    expect(thead?.classList.contains('bt-sticky')).toBe(false);
  });

  it('applies sticky class when stickyHeader is true', () => {
    const { container } = render(
      <BetterTable data={mockUsers} columns={userColumns} stickyHeader />
    );

    const thead = container.querySelector('.bt-thead');
    expect(thead?.classList.contains('bt-sticky')).toBe(true);
  });

  it('works together with maxHeight to create scrollable container', () => {
    const { container } = render(
      <BetterTable
        data={mockUsers}
        columns={userColumns}
        stickyHeader
        maxHeight="300px"
      />
    );

    const wrapper = container.querySelector('.bt-table-wrapper') as HTMLElement;
    expect(wrapper.style.maxHeight).toBe('300px');

    const thead = container.querySelector('.bt-thead');
    expect(thead?.classList.contains('bt-sticky')).toBe(true);
  });
});
