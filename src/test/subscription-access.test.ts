import {
  canOpenNotificationWorkflow,
  filterNotificationsByTier,
  getAllowedEventManagementTabs,
  getAllowedNotificationFeedFilters,
  getAllowedNotificationSummaryCards,
  isViewAllowed,
} from '@/lib/subscription-access';
import { OrganizerNotification } from '@/types/notifications';

const notificationFixtures: OrganizerNotification[] = [
  {
    id: 'milestone-general',
    title: 'Organizer digest available',
    message: 'Review today’s organizer digest.',
    timeLabel: '42m ago',
    category: 'milestone',
    priority: 'low',
    read: false,
  },
  {
    id: 'milestone-settings',
    title: 'Preferences updated',
    message: 'Notification preferences changed.',
    timeLabel: '1h ago',
    category: 'milestone',
    priority: 'low',
    read: false,
    target: {
      kind: 'settings',
      section: 'notifications',
    },
  },
  {
    id: 'milestone-checkin',
    title: 'Check-in readiness',
    message: 'Prepare your check-in workflow.',
    timeLabel: '2h ago',
    category: 'milestone',
    priority: 'medium',
    read: true,
    target: {
      kind: 'event-tab',
      eventId: 'evt-1',
      tab: 'checked-in',
    },
  },
  {
    id: 'finance-payout',
    title: 'Payout ready',
    message: 'Review your next payout.',
    timeLabel: '5m ago',
    category: 'finance',
    priority: 'high',
    read: false,
    target: {
      kind: 'view',
      view: 'finance',
    },
  },
  {
    id: 'team-invite',
    title: 'Invite pending',
    message: 'A team invite still needs approval.',
    timeLabel: '12m ago',
    category: 'team',
    priority: 'medium',
    read: false,
    target: {
      kind: 'view',
      view: 'team',
    },
  },
];

describe('subscription access gating', () => {
  it('keeps create event free and exposes tier-matched notification controls', () => {
    expect(isViewAllowed('free', 'create-event')).toBe(true);
    expect(isViewAllowed('free', 'event-management')).toBe(true);
    expect(getAllowedEventManagementTabs('free')).toEqual(['details']);
    expect(getAllowedEventManagementTabs('premium')).toEqual([
      'details',
      'ticketing',
      'orders',
      'checked-in',
      'marketing',
      'reports',
      'settings',
    ]);
    expect(getAllowedEventManagementTabs('business')).toEqual([
      'details',
      'ticketing',
      'orders',
      'checked-in',
      'marketing',
      'reports',
      'settings',
    ]);

    expect(getAllowedNotificationFeedFilters('free').map((filter) => filter.id)).toEqual([
      'all',
      'unread',
    ]);
    expect(getAllowedNotificationSummaryCards('free')).toEqual(['unread', 'urgent', 'today']);

    expect(getAllowedNotificationFeedFilters('premium').map((filter) => filter.id)).toEqual([
      'all',
      'unread',
      'order',
      'ticket',
      'marketing',
      'finance',
    ]);
    expect(getAllowedNotificationSummaryCards('premium')).toEqual([
      'unread',
      'urgent',
      'finance',
      'today',
    ]);

    expect(getAllowedNotificationFeedFilters('business').map((filter) => filter.id)).toEqual([
      'all',
      'unread',
      'order',
      'ticket',
      'marketing',
      'finance',
      'team',
    ]);
  });

  it('filters notifications by both tiered category access and workflow target access', () => {
    expect(filterNotificationsByTier('free', notificationFixtures).map((notification) => notification.id)).toEqual([
      'milestone-general',
      'milestone-settings',
    ]);

    expect(filterNotificationsByTier('premium', notificationFixtures).map((notification) => notification.id)).toEqual([
      'milestone-general',
      'milestone-settings',
      'milestone-checkin',
      'finance-payout',
    ]);

    expect(filterNotificationsByTier('business', notificationFixtures).map((notification) => notification.id)).toEqual([
      'milestone-general',
      'milestone-settings',
      'milestone-checkin',
      'finance-payout',
      'team-invite',
    ]);

    expect(canOpenNotificationWorkflow('free', notificationFixtures[0])).toBe(false);
    expect(canOpenNotificationWorkflow('free', notificationFixtures[1])).toBe(true);
    expect(canOpenNotificationWorkflow('premium', notificationFixtures[3])).toBe(true);
    expect(canOpenNotificationWorkflow('premium', notificationFixtures[4])).toBe(false);
    expect(canOpenNotificationWorkflow('business', notificationFixtures[4])).toBe(true);
  });
});
