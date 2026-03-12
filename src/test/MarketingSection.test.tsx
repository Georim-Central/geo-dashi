import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MarketingSection } from '../components/event-management/MarketingSection';

describe('MarketingSection workflow', () => {
  it('renders campaign history and supports scheduling a targeted campaign', async () => {
    const user = userEvent.setup();
    render(<MarketingSection />);

    const historySection = screen.getByRole('heading', { name: /campaign history/i }).closest('section');
    expect(historySection).not.toBeNull();
    expect(screen.queryByRole('heading', { name: /audience targeting/i })).not.toBeInTheDocument();
    expect(screen.getAllByText(/vip upgrade push/i).length).toBeGreaterThan(0);

    await user.click(within(historySection as HTMLElement).getByRole('button', { name: /^draft$/i }));
    expect(screen.getByText(/no campaign history matches this filter/i)).toBeInTheDocument();
    await user.click(within(historySection as HTMLElement).getByRole('button', { name: /^all$/i }));

    await user.click(screen.getByRole('button', { name: /new campaign/i }));
    const campaignDialog = await screen.findByRole('dialog', { name: /create campaign/i });

    await user.type(within(campaignDialog).getByLabelText(/campaign name/i), 'Waitlist recovery text');
    await user.selectOptions(within(campaignDialog).getByLabelText(/campaign status/i), 'scheduled');
    fireEvent.change(within(campaignDialog).getByLabelText(/send time/i), {
      target: { value: '2026-03-20T18:30' },
    });
    await user.type(
      within(campaignDialog).getByLabelText(/objective/i),
      'Recover waitlist demand before the final release.'
    );
    await user.click(within(campaignDialog).getByLabelText(/waitlist/i));
    await user.type(within(campaignDialog).getByLabelText(/subject line/i), 'Waitlist is reopening for one more send');
    await user.type(within(campaignDialog).getByLabelText(/message/i), 'Tickets are back. Claim your spot before 8 PM.');
    await user.click(within(campaignDialog).getByRole('button', { name: /schedule campaign/i }));

    expect(screen.getByText(/^3$/)).toBeInTheDocument();
    expect(screen.getAllByText(/scheduled/i).length).toBeGreaterThan(0);
  });
});
