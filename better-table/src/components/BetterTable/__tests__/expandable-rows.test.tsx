import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { BetterTable } from '../components/Table';
import { mockUsers, userColumns, type User } from './helpers/test-data';

describe('Expandable Rows', () => {
  const expandable = {
    render: (row: User) => (
      <div data-testid={`expanded-${row.id}`}>
        Details for {row.name}: {row.email}
      </div>
    ),
  };

  it('renders expand toggle buttons when expandable is configured', () => {
    render(
      <BetterTable
        data={mockUsers}
        columns={userColumns}
        expandable={expandable}
        pagination={false}
      />
    );

    const buttons = screen.getAllByRole('button', { name: /expand row/i });
    expect(buttons).toHaveLength(mockUsers.length);
  });

  it('does not render expand buttons when expandable is not configured', () => {
    render(
      <BetterTable
        data={mockUsers}
        columns={userColumns}
        pagination={false}
      />
    );

    const buttons = screen.queryAllByRole('button', { name: /expand row/i });
    expect(buttons).toHaveLength(0);
  });

  it('expands a row when toggle button is clicked', () => {
    render(
      <BetterTable
        data={mockUsers}
        columns={userColumns}
        expandable={expandable}
        pagination={false}
      />
    );

    const buttons = screen.getAllByRole('button', { name: /expand row/i });
    fireEvent.click(buttons[0]);

    expect(screen.getByTestId('expanded-1')).toBeInTheDocument();
    expect(screen.getByText(/Details for Juan García/)).toBeInTheDocument();
  });

  it('collapses a row when toggle button is clicked again', () => {
    render(
      <BetterTable
        data={mockUsers}
        columns={userColumns}
        expandable={expandable}
        pagination={false}
      />
    );

    const buttons = screen.getAllByRole('button', { name: /expand row/i });
    fireEvent.click(buttons[0]);
    expect(screen.getByTestId('expanded-1')).toBeInTheDocument();

    // Click again to collapse — button now says "Collapse row"
    const collapseBtn = screen.getByRole('button', { name: /collapse row/i });
    fireEvent.click(collapseBtn);
    expect(screen.queryByTestId('expanded-1')).not.toBeInTheDocument();
  });

  it('allows multiple rows expanded simultaneously by default', () => {
    render(
      <BetterTable
        data={mockUsers}
        columns={userColumns}
        expandable={expandable}
        pagination={false}
      />
    );

    const buttons = screen.getAllByRole('button', { name: /expand row/i });
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);

    expect(screen.getByTestId('expanded-1')).toBeInTheDocument();
    expect(screen.getByTestId('expanded-2')).toBeInTheDocument();
  });

  it('accordion mode only allows one row expanded at a time', () => {
    render(
      <BetterTable
        data={mockUsers}
        columns={userColumns}
        expandable={{ ...expandable, accordion: true }}
        pagination={false}
      />
    );

    const buttons = screen.getAllByRole('button', { name: /expand row/i });
    fireEvent.click(buttons[0]);
    expect(screen.getByTestId('expanded-1')).toBeInTheDocument();

    fireEvent.click(buttons[1]);
    expect(screen.queryByTestId('expanded-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('expanded-2')).toBeInTheDocument();
  });

  it('supports controlled mode with expandedRows and onExpandChange', () => {
    const onExpandChange = vi.fn();

    const { rerender } = render(
      <BetterTable
        data={mockUsers}
        columns={userColumns}
        expandable={expandable}
        expandedRows={[]}
        onExpandChange={onExpandChange}
        pagination={false}
      />
    );

    // No rows expanded initially
    expect(screen.queryByTestId('expanded-1')).not.toBeInTheDocument();

    // Click expand
    const buttons = screen.getAllByRole('button', { name: /expand row/i });
    fireEvent.click(buttons[0]);

    // Callback fired with the new expanded keys
    expect(onExpandChange).toHaveBeenCalledWith(['1']);

    // Since controlled, content shouldn't appear until parent updates
    expect(screen.queryByTestId('expanded-1')).not.toBeInTheDocument();

    // Parent updates expandedRows
    rerender(
      <BetterTable
        data={mockUsers}
        columns={userColumns}
        expandable={expandable}
        expandedRows={['1']}
        onExpandChange={onExpandChange}
        pagination={false}
      />
    );

    expect(screen.getByTestId('expanded-1')).toBeInTheDocument();
  });

  it('expanded content spans the full width of the table', () => {
    render(
      <BetterTable
        data={mockUsers}
        columns={userColumns}
        expandable={expandable}
        pagination={false}
      />
    );

    const buttons = screen.getAllByRole('button', { name: /expand row/i });
    fireEvent.click(buttons[0]);

    const expandedCell = screen.getByTestId('expanded-1').closest('td');
    // expand col + 5 visible columns = 6
    expect(expandedCell).toHaveAttribute('colspan', '6');
  });

  it('sets aria-expanded on the toggle button', () => {
    render(
      <BetterTable
        data={mockUsers}
        columns={userColumns}
        expandable={expandable}
        pagination={false}
      />
    );

    const buttons = screen.getAllByRole('button', { name: /expand row/i });
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(buttons[0]);

    const collapseBtn = screen.getByRole('button', { name: /collapse row/i });
    expect(collapseBtn).toHaveAttribute('aria-expanded', 'true');
  });
});
