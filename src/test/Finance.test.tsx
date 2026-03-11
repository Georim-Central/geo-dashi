import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Finance } from '../components/Finance';

describe('Finance workspace', () => {
  it('renders organizer finance history views and switches between them', async () => {
    const user = userEvent.setup();
    render(<Finance />);

    expect(screen.getByRole('heading', { name: /^finance$/i })).toBeInTheDocument();
    expect(screen.getByText(/available to withdraw/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /payout history/i })).toBeInTheDocument();
    expect(screen.getByText(/po-2026-0310/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /^transactions$/i }));
    expect(await screen.findByText(/order #5847239/i)).toBeInTheDocument();
    expect(screen.getByText(/recent transactions/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /withdrawal history/i }));
    expect(await screen.findByText(/wd-1029/i)).toBeInTheDocument();
    expect(screen.getAllByText(/view transfer details/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('tab', { name: /invoices & subscription/i }));
    expect(await screen.findByText(/inv-2026-03/i)).toBeInTheDocument();
    expect(screen.getAllByText(/pro organizer/i).length).toBeGreaterThan(0);
  });
});
