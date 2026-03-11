import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TeamManagement } from '../components/TeamManagement';

describe('TeamManagement permissions workspace', () => {
  it('tracks pending invites and updates member permissions with event access clarity', async () => {
    const user = userEvent.setup();
    render(<TeamManagement eventOptions={['Summer Music Festival 2026', 'Tech Conference 2026', 'Food & Wine Expo']} />);

    expect(screen.getByRole('heading', { name: /pending invites/i })).toBeInTheDocument();
    expect(screen.getByText(/alexandra@eventcompany\.com/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /invite team member/i }));
    const inviteDialog = await screen.findByRole('dialog', { name: /invite team member/i });

    await user.type(within(inviteDialog).getByLabelText(/email address/i), 'opslead@georim.com');
    await user.selectOptions(within(inviteDialog).getByLabelText(/permission preset/i), 'operations');
    await user.click(within(inviteDialog).getByRole('button', { name: /selected events/i }));
    await user.click(within(inviteDialog).getByLabelText(/tech conference 2026/i));
    await user.click(within(inviteDialog).getByRole('button', { name: /send invite/i }));

    expect(await screen.findByText(/invite created for opslead@georim\.com/i)).toBeInTheDocument();
    expect(screen.getAllByText(/opslead@georim\.com/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/tech conference 2026/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /resend invite for opslead@georim\.com/i }));
    expect(await screen.findByText(/invite resent with updated status tracking/i)).toBeInTheDocument();
    expect(screen.getAllByText(/sent/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /select mike johnson/i }));
    expect(screen.getByText(/summer music festival 2026, tech conference 2026/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /edit mike johnson/i }));
    const editDialog = await screen.findByRole('dialog', { name: /edit team member/i });

    await user.selectOptions(within(editDialog).getByLabelText(/permission preset/i), 'custom');
    const editTextboxes = within(editDialog).getAllByRole('textbox');
    await user.type(editTextboxes[2], 'Partnership Lead');
    await user.click(within(editDialog).getByRole('button', { name: /selected events/i }));
    await user.click(within(editDialog).getByLabelText(/food & wine expo/i));
    await user.click(within(editDialog).getByRole('button', { name: /save changes/i }));

    expect(await screen.findByText(/permissions updated for mike johnson/i)).toBeInTheDocument();
    expect(screen.getByText(/partnership lead/i)).toBeInTheDocument();
    expect(screen.getByText(/summer music festival 2026, tech conference 2026, food & wine expo/i)).toBeInTheDocument();
  });
});
