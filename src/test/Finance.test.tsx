import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../utils/reportExport', () => ({
  downloadReportPdf: vi.fn(),
}));

import { Finance } from '../components/Finance';
import { downloadReportPdf } from '../utils/reportExport';

describe('Finance exports', () => {
  it('exports the finance report to pdf from the header action', async () => {
    const user = userEvent.setup();
    render(<Finance />);

    await user.click(screen.getByRole('button', { name: /export report/i }));

    expect(downloadReportPdf).toHaveBeenCalledTimes(1);
    expect(downloadReportPdf).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: 'finance-report.pdf',
        title: 'Finance Report',
        sections: expect.arrayContaining([
          expect.objectContaining({ heading: 'Payment Summary' }),
          expect.objectContaining({ heading: 'Payout History' }),
          expect.objectContaining({ heading: 'Recent Transactions' }),
          expect.objectContaining({ heading: 'Withdrawal Requests' }),
          expect.objectContaining({ heading: 'Invoice History' }),
        ]),
      })
    );
  });

  it('submits a withdrawal request to admin from the finance header action', async () => {
    const user = userEvent.setup();
    render(<Finance />);

    await user.click(screen.getByRole('button', { name: /request withdrawal/i }));

    expect(await screen.findByRole('dialog', { name: /request withdrawal/i })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/withdrawal amount/i), '6200');
    await user.type(
      screen.getByLabelText(/request note/i),
      'Please review and approve this payout request for the next admin settlement run.'
    );
    await user.click(screen.getByRole('button', { name: /send to admin/i }));

    expect(await screen.findByText(/withdrawal request for \$6,200\.00 sent to admin for approval\./i)).toBeInTheDocument();
  });
});
