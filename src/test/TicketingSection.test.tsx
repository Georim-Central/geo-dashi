import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TicketingSection } from '../components/event-management/TicketingSection';

describe('TicketingSection modal flows', () => {
  it('opens Add Ticket Type as a modal and removes inline form section', async () => {
    const user = userEvent.setup();
    const { container } = render(<TicketingSection />);

    expect(screen.queryByText('Add New Ticket Type')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add ticket type/i }));

    expect(screen.getByRole('heading', { name: /add ticket type/i })).toBeInTheDocument();
    expect(container.querySelector('.ticketing-modal-backdrop')).toBeInTheDocument();
  });

  it('opens Create Code form as a modal', async () => {
    const user = userEvent.setup();
    const { container } = render(<TicketingSection />);

    await user.click(screen.getByRole('button', { name: /create code/i }));

    expect(screen.getByRole('heading', { name: /create promo code/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/summer2026/i)).toBeInTheDocument();
    expect(container.querySelector('.ticketing-modal-backdrop')).toBeInTheDocument();
  });

  it('creates a promo code with validity window, usage limit, and discount rules', async () => {
    const user = userEvent.setup();
    render(<TicketingSection />);

    await user.click(screen.getByRole('button', { name: /create code/i }));
    const createCodeDialog = screen.getByRole('dialog', { name: /create promo code/i });

    await user.type(within(createCodeDialog).getByLabelText(/^promo code$/i), 'flash50');
    await user.selectOptions(within(createCodeDialog).getByLabelText(/code access/i), 'access');
    await user.selectOptions(within(createCodeDialog).getByLabelText(/discount type/i), 'fixed');
    fireEvent.change(within(createCodeDialog).getByLabelText(/discount value/i), { target: { value: '50' } });
    fireEvent.change(within(createCodeDialog).getByLabelText(/usage limit/i), { target: { value: '30' } });
    fireEvent.change(within(createCodeDialog).getByLabelText(/start date/i), { target: { value: '2026-06-01' } });
    fireEvent.change(within(createCodeDialog).getByLabelText(/end date/i), { target: { value: '2026-06-15' } });
    await user.selectOptions(within(createCodeDialog).getByLabelText(/applies to/i), 'VIP tickets only');

    await user.click(within(createCodeDialog).getByRole('button', { name: /create code/i }));

    const deletePromoButton = await screen.findByRole('button', { name: /delete promo code flash50/i });
    const promoRow = deletePromoButton.parentElement?.parentElement as HTMLElement;

    expect(promoRow.textContent).toContain('0 / 30 uses');
    expect(promoRow.textContent).toContain('VIP tickets only');
    expect(promoRow.textContent).toContain('Valid Jun 1 - Jun 15');
    expect(within(promoRow).getByText(/fixed/i)).toBeInTheDocument();
    expect(within(promoRow).getByText(/access code/i)).toBeInTheDocument();
  });
});
