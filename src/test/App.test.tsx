import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { EventManagement } from '../components/EventManagement';
import { SUBSCRIPTION_STORAGE_KEY } from '../lib/subscription-access';

function renderAppWithTier(tier: 'free' | 'premium' | 'business' = 'free') {
  window.localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, tier);
  return render(<App />);
}

function scrollShellDown() {
  const pageScrollRoot = document.querySelector('[data-page-scroll-root]') as HTMLElement | null;
  const topbarFrame = document.querySelector('.app-shell__topbar-frame') as HTMLElement | null;

  expect(pageScrollRoot).not.toBeNull();
  expect(topbarFrame).not.toBeNull();

  const scrollTo = vi.fn();
  Object.defineProperty(pageScrollRoot!, 'scrollTo', {
    value: scrollTo,
    configurable: true,
  });
  Object.defineProperty(pageScrollRoot!, 'scrollTop', {
    value: 420,
    writable: true,
    configurable: true,
  });

  fireEvent.scroll(pageScrollRoot!, { target: { scrollTop: 420 } });

  expect(topbarFrame!).toHaveAttribute('data-shell-scrolled', 'true');

  return { pageScrollRoot: pageScrollRoot!, topbarFrame: topbarFrame!, scrollTo };
}

describe('App core flows', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('navigates from home to event creation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^create event$/i }));

    expect(
      await screen.findByRole('heading', { name: /create new event/i }, { timeout: 5000 })
    ).toBeInTheDocument();
  }, 10000);

  it('opens the events page from the primary sidebar', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^events$/i }));

    expect(await screen.findByRole('heading', { name: /^events$/i })).toBeInTheDocument();
    expect(screen.getByText(/^total events$/i)).toBeInTheDocument();
    expect(screen.getByText(/^total attendees$/i)).toBeInTheDocument();
    expect(screen.getByText(/^total revenue$/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^published$/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /your events/i })).toBeInTheDocument();
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
    const { topbarFrame, scrollTo } = scrollShellDown();

    await user.click(screen.getByRole('button', { name: /open profile menu/i }));

    const profileMenu = await screen.findByRole('dialog', { name: /profile menu/i });
    await user.click(within(profileMenu).getByRole('button', { name: /account settings/i }));

    expect(await screen.findByRole('heading', { name: /^settings$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^profile$/i, selected: true })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /your profile/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(topbarFrame).toHaveAttribute('data-shell-scrolled', 'false');
    });
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
  }, 10000);

  it('opens the notification center from the bell and routes into linked organizer workflows', async () => {
    const user = userEvent.setup();
    renderAppWithTier('premium');

    await user.click(screen.getByRole('button', { name: /open notifications/i }));
    await user.click(await screen.findByRole('button', { name: /view all notifications/i }));

    expect(await screen.findByRole('heading', { name: /notification center/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /activity feed/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /open orders/i }));

    expect(await screen.findByRole('heading', { name: /summer music festival 2026/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /orders & registration/i })).toBeInTheDocument();
  });

  it('keeps top-bar and notification-center activity limited to free-tier notifications', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /open notifications/i }));
    const notificationPanel = await screen.findByRole('dialog', { name: /notifications/i });

    expect(within(notificationPanel).getByText(/^milestone$/i)).toBeInTheDocument();
    expect(within(notificationPanel).queryByText(/^order$/i)).not.toBeInTheDocument();
    expect(within(notificationPanel).queryByText(/^finance$/i)).not.toBeInTheDocument();
    expect(within(notificationPanel).queryByText(/^team$/i)).not.toBeInTheDocument();

    await user.click(within(notificationPanel).getByRole('button', { name: /view all notifications/i }));

    expect(await screen.findByRole('heading', { name: /notification center/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /all activity/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^unread$/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^orders$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^finance$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^team$/i })).not.toBeInTheDocument();
  });

  it('reveals premium and business notification filters only at the matching tiers', async () => {
    const premiumUser = userEvent.setup();
    const premiumView = renderAppWithTier('premium');

    await premiumUser.click(screen.getByRole('button', { name: /open notifications/i }));
    await premiumUser.click(await screen.findByRole('button', { name: /view all notifications/i }));

    const premiumFeed = screen.getByRole('heading', { name: /activity feed/i }).closest('section');
    expect(premiumFeed).not.toBeNull();

    expect(await within(premiumFeed!).findByRole('button', { name: /^orders$/i })).toBeInTheDocument();
    expect(within(premiumFeed!).getByRole('button', { name: /^tickets$/i })).toBeInTheDocument();
    expect(within(premiumFeed!).getByRole('button', { name: /^marketing$/i })).toBeInTheDocument();
    expect(within(premiumFeed!).getByRole('button', { name: /^finance$/i })).toBeInTheDocument();
    expect(within(premiumFeed!).queryByRole('button', { name: /^team$/i })).not.toBeInTheDocument();

    premiumView.unmount();

    const businessUser = userEvent.setup();
    window.localStorage.clear();
    renderAppWithTier('business');

    await businessUser.click(screen.getByRole('button', { name: /open notifications/i }));
    await businessUser.click(await screen.findByRole('button', { name: /view all notifications/i }));

    const businessFeed = screen.getByRole('heading', { name: /activity feed/i }).closest('section');
    expect(businessFeed).not.toBeNull();
    expect(await within(businessFeed!).findByRole('button', { name: /^team$/i })).toBeInTheDocument();
  }, 15000);

  it('navigates from global search results into organizer event operations', async () => {
    const user = userEvent.setup();
    renderAppWithTier('premium');

    await user.type(screen.getByLabelText(/search events, orders, attendees, and team/i), '5847239');
    await user.click(await screen.findByRole('button', { name: /order #5847239/i }));

    expect(await screen.findByRole('heading', { name: /summer music festival 2026/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /orders & registration/i })).toBeInTheDocument();
  });

  it('duplicates events from Home and updates lifecycle in event management', async () => {
    const user = userEvent.setup();
    renderAppWithTier('premium');

    await user.click(screen.getByRole('button', { name: /^events$/i }));
    await user.click(await screen.findByRole('button', { name: /quick actions for tech conference 2026/i }));
    await user.click(screen.getByRole('button', { name: /duplicate tech conference 2026/i }));

    expect(await screen.findByText(/tech conference 2026 copy/i)).toBeInTheDocument();

    await user.click(screen.getAllByText(/summer music festival 2026/i)[0]);
    const lifecycleSelect = await screen.findByRole('combobox', { name: /lifecycle status/i });
    await user.selectOptions(lifecycleSelect, 'archived');

    expect(await screen.findByText(/event status updated to archived/i)).toBeInTheDocument();
    expect(screen.getAllByText(/archived/i).length).toBeGreaterThan(0);
  });

  it('lets free users open an event row into the details workspace only', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^events$/i }));
    await user.click(await screen.findByText(/summer music festival 2026/i));

    expect(await screen.findByRole('heading', { name: /summer music festival 2026/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^event details$/i, selected: true })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /^ticketing$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /^orders$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /preview event/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^duplicate$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: /lifecycle status/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /publish/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/event video url/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^summary$/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/full description/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit details/i })).toBeInTheDocument();
  });

  it('lets free users open an event from the quick action menu', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^events$/i }));
    await user.click(await screen.findByRole('button', { name: /quick actions for tech conference 2026/i }));
    await user.click(await screen.findByRole('button', { name: /open tech conference 2026/i }));

    expect(await screen.findByRole('heading', { name: /tech conference 2026/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^event details$/i, selected: true })).toBeInTheDocument();
  });

  it('keeps the global primary sidebar visible without adding a dedicated back action when an event is open', async () => {
    const user = userEvent.setup();
    renderAppWithTier('premium');

    await user.click(screen.getByRole('button', { name: /^events$/i }));
    await user.click(await screen.findByRole('heading', { name: /summer music festival 2026/i }));

    const sidebarNav = screen.getByRole('navigation', { name: /^primary$/i });

    expect(within(sidebarNav).queryByRole('button', { name: /back to organization/i })).not.toBeInTheDocument();
    expect(within(sidebarNav).getByRole('button', { name: /^home$/i })).toBeInTheDocument();
    expect(within(sidebarNav).getByRole('button', { name: /^events$/i })).toBeInTheDocument();
    expect(within(sidebarNav).getByRole('button', { name: /^analytics$/i })).toBeInTheDocument();
    expect(within(sidebarNav).getByRole('button', { name: /^finance$/i })).toBeInTheDocument();
    expect(within(sidebarNav).getByRole('button', { name: /^notification center$/i })).toBeInTheDocument();
    expect(within(sidebarNav).getByRole('button', { name: /^settings$/i })).toBeInTheDocument();
    expect(within(sidebarNav).getByRole('button', { name: /^events$/i })).toHaveAttribute('aria-current', 'page');
  });

  it('opens the settings workspace from the sidebar and switches sections with the top tabs', async () => {
    const user = userEvent.setup();
    render(<App />);
    const { topbarFrame, scrollTo } = scrollShellDown();

    await user.click(screen.getByRole('button', { name: /^settings$/i }));

    expect(await screen.findByRole('heading', { name: /^settings$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^profile$/i, selected: true })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /your profile/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(topbarFrame).toHaveAttribute('data-shell-scrolled', 'false');
    });
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });

    await user.click(screen.getByRole('tab', { name: /^payments$/i }));

    expect(screen.getByRole('tab', { name: /^payments$/i, selected: true })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /payout preferences/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /recent transactions/i })).toBeInTheDocument();
  });

  it('opens the team management workspace with permissions and invite tracking', async () => {
    const user = userEvent.setup();
    renderAppWithTier('business');

    await user.click(screen.getByRole('button', { name: /^team$/i }));

    expect(await screen.findByRole('heading', { name: /team management/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /pending invites/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /on-site tools/i })).toBeInTheDocument();
  });

  it('renders the finance page with payment summary above finance activity', async () => {
    const user = userEvent.setup();
    renderAppWithTier('premium');

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

    expect(await screen.findByRole('heading', { name: /^settings$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^payments$/i, selected: true })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /choose how to pay/i })).toBeInTheDocument();
  }, 10000);

  it('routes Home support buttons into live organizer workflows', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /open notifications/i }));
    await user.click(await screen.findByRole('button', { name: /view all notifications/i }));

    expect(await screen.findByRole('heading', { name: /notification center/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /activity feed/i })).toBeInTheDocument();
  });

  it('updates profile details, avatar, and email actions from the profile settings page', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('tab', { name: /^profile$/i }));

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
    await user.click(await screen.findByRole('tab', { name: /^security$/i }));

    expect(await screen.findByRole('heading', { name: /^settings$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^security$/i, selected: true })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /password & access/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your current password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/create a strong new password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/re-enter your new password/i)).toBeInTheDocument();
  });

  it('updates the password from the security settings page when the form is valid', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('tab', { name: /^security$/i }));

    await user.type(await screen.findByPlaceholderText(/enter your current password/i), 'OldPassword#1');
    await user.type(screen.getByPlaceholderText(/create a strong new password/i), 'NewPassword#2');
    await user.type(screen.getByPlaceholderText(/re-enter your new password/i), 'NewPassword#2');
    await user.click(screen.getByRole('button', { name: /update password/i }));

    expect(await screen.findByText(/password updated\. all active sessions remain protected\./i)).toBeInTheDocument();
  }, 10000);

  it('renders the payment method selector in settings payments', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('tab', { name: /^payments$/i }));

    expect(await screen.findByRole('heading', { name: /^settings$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^payments$/i, selected: true })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /choose how to pay/i })).toBeInTheDocument();
    expect(screen.getAllByText(/visa \*\*\*\* 0912/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/recent transactions/i)).toBeInTheDocument();
  });

  it('shows the subscriptions settings section and updates the active tier', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('tab', { name: /^subscriptions$/i }));

    expect(await screen.findByRole('heading', { name: /^settings$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^subscriptions$/i, selected: true })).toBeInTheDocument();
    const premiumTierButton = screen
      .getAllByRole('button')
      .find((button) => within(button).queryByText(/^Premium$/i));

    expect(premiumTierButton).toBeDefined();
    expect(premiumTierButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(premiumTierButton!);

    expect(premiumTierButton).toHaveAttribute('aria-pressed', 'true');
    expect(window.localStorage.getItem(SUBSCRIPTION_STORAGE_KEY)).toBe('premium');
  });

  it('adds and selects a new payment method from settings payments', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('tab', { name: /^payments$/i }));

    await user.click(screen.getByRole('button', { name: /add new method/i }));
    fireEvent.change(await screen.findByLabelText(/payment method label/i), { target: { value: 'Visa **** 2222' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Travel card for settlement backup' } });
    fireEvent.change(screen.getByRole('combobox', { name: /provider/i }), { target: { value: 'wallet' } });
    await user.click(screen.getByRole('button', { name: /add method/i }));

    expect(await screen.findByText(/visa \*\*\*\* 2222 added and selected for future billing actions/i)).toBeInTheDocument();
    expect(screen.getAllByText(/visa \*\*\*\* 2222/i).length).toBeGreaterThan(0);
  }, 10000);

  it('renders the notifications settings page with alert controls', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('tab', { name: /^notifications$/i }));

    expect(await screen.findByRole('heading', { name: /^settings$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^notifications$/i, selected: true })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /delivery channels/i })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: /email notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /quiet hours/i })).toBeInTheDocument();
  });

  it('defaults to free and hides premium and business navigation surfaces', () => {
    render(<App />);

    expect(screen.queryByRole('button', { name: /^analytics$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^finance$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^team$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /platform activity/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /team collaboration/i })).not.toBeInTheDocument();
  });

  it('removes analytics access when the active tier is lowered from subscriptions', async () => {
    const user = userEvent.setup();
    renderAppWithTier('premium');

    await user.click(screen.getByRole('button', { name: /^analytics$/i }));
    expect(await screen.findByText(/revenue attribution/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^settings$/i }));
    await user.click(await screen.findByRole('tab', { name: /^subscriptions$/i }));
    await user.click(screen.getByRole('button', { name: /^free core organizer and event-details workspace/i }));

    expect(await screen.findByRole('heading', { name: /^settings$/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^subscriptions$/i, selected: true })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^analytics$/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^home$/i }));
    expect(await screen.findByRole('heading', { name: /welcome john/i })).toBeInTheDocument();
  });
});
