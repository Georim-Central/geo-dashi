import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { EventManagement } from '../components/EventManagement';

describe('App core flows', () => {
  it('navigates from dashboard to event creation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole('button', { name: /create event/i }));

    expect(await screen.findByRole('heading', { name: /create new event/i })).toBeInTheDocument();
  });

  it('creates private link and activates waitlist in event settings', async () => {
    const user = userEvent.setup();
    const { container } = render(<EventManagement eventId="evt-1" />);

    await user.click(await screen.findByRole('tab', { name: /^settings$/i }));

    const visibilitySelect = await screen.findByRole('combobox', { name: /event visibility/i });
    await user.selectOptions(visibilitySelect, 'Private');

    const privateLinkInput = await screen.findByDisplayValue(/https:\/\/georim\.app\/private\//i);
    expect(privateLinkInput).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument();

    const allCheckboxes = container.querySelectorAll('input[type="checkbox"]');
    const waitlistCheckbox = allCheckboxes[allCheckboxes.length - 1] as HTMLInputElement;
    await user.click(waitlistCheckbox);

    const waitlistStatus = await screen.findByText(/waitlist is active/i);
    expect(waitlistStatus).toBeInTheDocument();
    expect(waitlistStatus.className).toContain('text-[#7626c6]');

    await user.click(screen.getByRole('button', { name: /configure/i }));

    expect(await screen.findByRole('heading', { name: /configure cancellation policy/i })).toBeInTheDocument();
    const policyInput = screen.getByPlaceholderText(/type your full cancellation and refund policy here/i);
    await user.type(policyInput, 'Full refund available up to 14 days before event start.');
    await user.click(screen.getByRole('button', { name: /save policy/i }));

    expect(await screen.findByText(/cancellation policy updated/i)).toBeInTheDocument();
    expect(screen.getByText(/full refund available up to 14 days before event start/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^edit$/i })).toBeInTheDocument();
  });

  it('shows the signed-in user in the top bar without exposing a profile page route', () => {
    render(<App />);

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /^profile$/i })).not.toBeInTheDocument();
  });

  it('opens profile settings from the top-right account identity control', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /open profile settings/i }));

    expect(await screen.findByRole('heading', { name: /^profile$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /your profile/i })).toBeInTheDocument();
  }, 10000);

  it('opens help center from sidebar help', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^help$/i }));

    expect(await screen.findByRole('heading', { name: /help center/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /faqs/i })).toBeInTheDocument();
  });

  it('opens the notification center from the bell and routes into linked organizer workflows', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /open notifications/i }));
    await user.click(await screen.findByRole('button', { name: /view all notifications/i }));

    expect(await screen.findByRole('heading', { name: /notification center/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /activity feed/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /open orders/i }));

    expect(await screen.findByRole('heading', { name: /summer music festival 2026/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /orders & registration/i })).toBeInTheDocument();
  });

  it('navigates from global search results into organizer event operations', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/search events, orders, attendees, and team/i), '5847239');
    await user.click(await screen.findByRole('button', { name: /order #5847239/i }));

    expect(await screen.findByRole('heading', { name: /summer music festival 2026/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /orders & registration/i })).toBeInTheDocument();
  });

  it('duplicates events from the dashboard and updates lifecycle in event management', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /quick actions for tech conference 2026/i }));
    await user.click(screen.getByRole('button', { name: /duplicate tech conference 2026/i }));

    expect(await screen.findByText(/tech conference 2026 copy/i)).toBeInTheDocument();

    await user.click(screen.getAllByText(/summer music festival 2026/i)[0]);
    const lifecycleSelect = await screen.findByRole('combobox', { name: /lifecycle status/i });
    await user.selectOptions(lifecycleSelect, 'archived');

    expect(await screen.findByText(/event status updated to archived/i)).toBeInTheDocument();
    expect(screen.getAllByText(/archived/i).length).toBeGreaterThan(0);
  });

  it('opens the organization settings profile page from the sidebar', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('button', { name: /^profile$/i }));

    expect(await screen.findByRole('heading', { name: /^profile$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /your profile/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /account options/i })).toBeInTheDocument();
  });

  it('opens the team management workspace with permissions and invite tracking', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^team$/i }));

    expect(await screen.findByRole('heading', { name: /team management/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /pending invites/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /on-site tools/i })).toBeInTheDocument();
  });

  it('renders the finance page with payment summary above finance activity', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^finance$/i }));

    expect(await screen.findByRole('heading', { name: /^finance$/i }, { timeout: 10000 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /payment summary/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /finance activity/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /payout schedule/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /finance controls/i })).toBeInTheDocument();
    expect(screen.getByText(/^jan$/i)).toBeInTheDocument();
    expect(screen.getByText(/available balance/i)).toBeInTheDocument();

    const paymentSummaryHeading = screen.getByRole('heading', { name: /payment summary/i });
    const financeActivityHeading = screen.getByRole('heading', { name: /finance activity/i });
    expect(paymentSummaryHeading.compareDocumentPosition(financeActivityHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    await user.click(screen.getAllByRole('button', { name: /^edit$/i })[0]);

    expect(await screen.findByRole('heading', { name: /^payments$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /choose how to pay/i })).toBeInTheDocument();
  }, 10000);

  it('routes dashboard support buttons into live organizer workflows', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /add member/i }));
    expect(await screen.findByRole('dialog', { name: /invite team member/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    await user.click(screen.getByRole('button', { name: /^dashboard$/i }));
    await user.click(screen.getByRole('button', { name: /view all activity/i }));

    expect(await screen.findByRole('heading', { name: /notification center/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /activity feed/i })).toBeInTheDocument();
  });

  it('updates profile details, avatar, and email actions from the profile settings page', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('button', { name: /^profile$/i }));

    await user.click(screen.getByRole('button', { name: /^edit$/i }));
    const nameInput = await screen.findByDisplayValue(/maksudur rahman/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Cyril Kups');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(await screen.findByText(/cyril kups/i)).toBeInTheDocument();

    const avatarFile = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText(/profile image uploader/i), avatarFile);

    await waitFor(() => {
      expect(screen.getByAltText(/cyril kups profile/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /email actions for maksud\.design7@gmail\.com/i }));
    await user.click(screen.getByRole('menuitem', { name: /edit email/i }));
    const emailInput = await screen.findByDisplayValue(/maksud\.design7@gmail\.com/i);
    await user.clear(emailInput);
    await user.type(emailInput, 'team@georim.com');
    await user.click(screen.getByRole('button', { name: /save email/i }));

    expect(await screen.findByText(/team@georim\.com/i)).toBeInTheDocument();
  });

  it('renders the security settings page with password fields', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('button', { name: /^security$/i }));

    expect(await screen.findByRole('heading', { name: /^security$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /password & access/i })).toBeInTheDocument();
    expect(screen.getByText(/previous password/i)).toBeInTheDocument();
    expect(screen.getByText(/current password/i)).toBeInTheDocument();
    expect(screen.getByText(/confirm password/i)).toBeInTheDocument();
  });

  it('updates the password from the security settings page when the form is valid', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('button', { name: /^security$/i }));

    await user.type(await screen.findByPlaceholderText(/enter your previous password/i), 'OldPassword#1');
    await user.type(screen.getByPlaceholderText(/create a new secure password/i), 'NewPassword#2');
    await user.type(screen.getByPlaceholderText(/re-enter your new password/i), 'NewPassword#2');
    await user.click(screen.getByRole('button', { name: /update password/i }));

    expect(await screen.findByText(/password updated and active sessions remain protected/i)).toBeInTheDocument();
  }, 10000);

  it('renders the payment method selector in settings payments', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('button', { name: /^payments$/i }));

    expect(await screen.findByRole('heading', { name: /^payments$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /choose how to pay/i })).toBeInTheDocument();
    expect(screen.getAllByText(/visa \*\*\*\* 0912/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/recent transactions/i)).toBeInTheDocument();
  });

  it('adds and selects a new payment method from settings payments', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('button', { name: /^payments$/i }));

    await user.click(screen.getByRole('button', { name: /add new method/i }));
    fireEvent.change(await screen.findByLabelText(/payment method label/i), { target: { value: 'Visa **** 2222' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Travel card for settlement backup' } });
    fireEvent.change(screen.getByRole('combobox', { name: /provider/i }), { target: { value: 'wallet' } });
    await user.click(screen.getByRole('button', { name: /add method/i }));

    expect(await screen.findByText(/visa \*\*\*\* 2222 added and selected for future billing actions/i)).toBeInTheDocument();
    expect(screen.getAllByText(/visa \*\*\*\* 2222/i).length).toBeGreaterThan(0);
  }, 10000);

  it('renders the pricing table in premium subscriptions', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('button', { name: /premium subscriptions/i }));

    expect(await screen.findByRole('heading', { name: /premium subscriptions/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /choose your plan/i })).toBeInTheDocument();
    expect(screen.getAllByText(/professional/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('radiogroup', { name: /billing cycle/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /monthlypay month to month/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /yearlysave 20% annually/i })).toBeInTheDocument();
  });

  it('selects a premium plan and opens the settings assistant dialog', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('button', { name: /premium subscriptions/i }));

    await user.click(screen.getByRole('button', { name: /get started/i }));
    expect(await screen.findByText(/starter plan selected with monthly billing/i)).toBeInTheDocument();
    expect(screen.getByText(/pending: starter \(monthly\)/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /open settings assistant/i }));
    expect(await screen.findByRole('dialog', { name: /premium subscriptions assistant/i })).toBeInTheDocument();
    expect(screen.getByText(/compare monthly and yearly billing before switching plans/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close assistant/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /premium subscriptions assistant/i })).not.toBeInTheDocument();
    });
  }, 10000);

  it('renders the notifications settings page with alert controls', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('button', { name: /^notifications$/i }));

    expect(await screen.findByRole('heading', { name: /^notifications$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /delivery channels/i })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: /email notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /quiet hours/i })).toBeInTheDocument();
  });
});
