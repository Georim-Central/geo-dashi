import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Analytics } from '../components/Analytics';

describe('Analytics advanced views', () => {
  it('renders attribution and event comparison views for organization analytics', async () => {
    const user = userEvent.setup();
    render(<Analytics selectedEventId={null} selectedEventName={null} />);

    expect(screen.getByRole('heading', { name: /revenue attribution/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /event comparison/i })).toBeInTheDocument();
    expect(screen.getByText(/paid social/i)).toBeInTheDocument();
    expect(screen.getByText(/\$42,300/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^conversion$/i }));

    expect(screen.getByText(/8\.9%/)).toBeInTheDocument();
    expect(screen.getByText(/cross-event benchmark/i)).toBeInTheDocument();
  });

  it('renders conversion and attribution views for an event analytics page', () => {
    render(<Analytics selectedEventId="event-42" selectedEventName="Summer Music Festival 2026" />);

    expect(screen.getByRole('heading', { name: /conversion funnel/i })).toBeInTheDocument();
    expect(screen.getByText(/6\.8% overall conversion/i)).toBeInTheDocument();
    expect(screen.getByText(/instagram ads/i)).toBeInTheDocument();
    expect(screen.getByText(/checkout starts/i)).toBeInTheDocument();
  });
});
