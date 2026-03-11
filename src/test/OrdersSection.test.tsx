import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OrdersSection } from '../components/event-management/OrdersSection';

describe('OrdersSection organizer actions', () => {
  it('supports attendee drill-in, details modal, mark paid, refund, notes, resend confirmation, and export states', async () => {
    const user = userEvent.setup();
    render(<OrdersSection />);

    expect(screen.getByRole('heading', { name: /attendee detail/i })).toBeInTheDocument();
    expect(screen.getAllByText(/sarah johnson/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /actions for order 5847239/i }));
    await user.click(screen.getByRole('menuitem', { name: /more details/i }));

    expect(await screen.findByRole('heading', { name: /attendee & order details/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ATT-3901')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^close$/i }));

    await user.click(screen.getByRole('button', { name: /actions for order 5847237/i }));
    await user.click(screen.getByRole('menuitem', { name: /mark paid/i }));

    expect(await screen.findByText(/order #5847237 marked as paid/i)).toBeInTheDocument();
    expect(screen.getAllByText(/completed/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /actions for order 5847238/i }));
    await user.click(screen.getByRole('menuitem', { name: /resend confirmation/i }));
    expect(await screen.findByText(/confirmation resent for order #5847238/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /actions for order 5847236/i }));
    await user.click(screen.getByRole('menuitem', { name: /edit notes/i }));

    const notesDialog = await screen.findByRole('dialog', { name: /edit organizer notes/i });
    const notesEditor = within(notesDialog).getByLabelText(/^notes$/i);
    await user.clear(notesEditor);
    await user.type(notesEditor, 'VIP host has been notified about group arrival.');
    await user.click(screen.getByRole('button', { name: /save notes/i }));

    expect(await screen.findByText(/notes saved for order #5847236/i)).toBeInTheDocument();
    expect(screen.getByText(/vip host has been notified about group arrival/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /actions for order 5847238/i }));
    await user.click(screen.getByRole('menuitem', { name: /view attendee/i }));
    expect(await screen.findByText(/attendee panel opened for michael chen/i)).toBeInTheDocument();
    expect(screen.getAllByText(/michael chen/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /actions for order 5847238/i }));
    await user.click(screen.getByRole('menuitem', { name: /refund order/i }));
    expect(await screen.findByRole('heading', { name: /refund order/i })).toBeInTheDocument();
    await user.clear(screen.getByLabelText(/refund reason/i));
    await user.type(screen.getByLabelText(/refund reason/i), 'Customer could not attend.');
    await user.click(screen.getByRole('button', { name: /confirm refund/i }));

    expect(await screen.findByText(/refund issued for order #5847238/i)).toBeInTheDocument();
    expect(screen.getAllByText(/refunded/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /export csv/i }));
    expect(await screen.findByRole('button', { name: /preparing csv/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /csv ready/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/order export is ready/i)).toBeInTheDocument();
  });
});
