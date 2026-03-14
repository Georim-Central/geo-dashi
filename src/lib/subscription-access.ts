import {
  AppView,
  EventManagementTab,
  GlobalSearchResult,
  GlobalSearchResultType,
  SettingsSection,
  SubscriptionTier,
} from '@/types/navigation';
import {
  NotificationCategory,
  NotificationFeedFilter,
  NotificationSummaryCard,
  OrganizerNotification,
} from '@/types/notifications';

export const SUBSCRIPTION_STORAGE_KEY = 'georim.active-subscription-tier';

export const subscriptionTierOrder: SubscriptionTier[] = ['free', 'premium', 'business'];

export const subscriptionTierDetails: Record<
  SubscriptionTier,
  {
    label: string;
    subtitle: string;
    description: string;
  }
> = {
  free: {
    label: 'Free',
    subtitle: 'Core organizer and event-details workspace',
    description: 'Create events, open event details, manage your account, and use the core workspace.',
  },
  premium: {
    label: 'Premium',
    subtitle: 'Unlock advanced event operations, analytics, and finance',
    description: 'Adds premium event tabs, analytics, finance, and richer home insights.',
  },
  business: {
    label: 'Business / Enterprise',
    subtitle: 'Unlock team management on top of Premium',
    description: 'Adds the full team workspace and business-level collaboration controls.',
  },
};

const tierRank: Record<SubscriptionTier, number> = {
  free: 0,
  premium: 1,
  business: 2,
};

const viewTierRequirements: Record<AppView, SubscriptionTier> = {
  home: 'free',
  events: 'free',
  'create-event': 'free',
  'event-management': 'free',
  analytics: 'premium',
  team: 'business',
  finance: 'premium',
  'notification-center': 'free',
  settings: 'free',
};

const eventTabTierRequirements: Record<EventManagementTab, SubscriptionTier> = {
  details: 'free',
  ticketing: 'premium',
  orders: 'premium',
  'checked-in': 'premium',
  marketing: 'premium',
  reports: 'premium',
  settings: 'premium',
};

const settingsSectionTierRequirements: Record<SettingsSection, SubscriptionTier> = {
  profile: 'free',
  security: 'free',
  payments: 'free',
  notifications: 'free',
  subscriptions: 'free',
};

const searchResultTierRequirements: Record<GlobalSearchResultType, SubscriptionTier> = {
  event: 'premium',
  order: 'premium',
  attendee: 'premium',
  team: 'business',
};

const notificationCategoryTierRequirements: Record<NotificationCategory, SubscriptionTier> = {
  milestone: 'free',
  order: 'premium',
  ticket: 'premium',
  marketing: 'premium',
  finance: 'premium',
  team: 'business',
};

const notificationFeedFilterCategoryMap: Record<
  Exclude<NotificationFeedFilter, 'all' | 'unread'>,
  NotificationCategory
> = {
  order: 'order',
  ticket: 'ticket',
  marketing: 'marketing',
  finance: 'finance',
  team: 'team',
};

const notificationSummaryCardTierRequirements: Record<NotificationSummaryCard, SubscriptionTier> = {
  unread: 'free',
  urgent: 'free',
  finance: 'premium',
  today: 'free',
};

export const notificationFeedFilterDetails: Array<{ id: NotificationFeedFilter; label: string }> = [
  { id: 'all', label: 'All activity' },
  { id: 'unread', label: 'Unread' },
  { id: 'order', label: 'Orders' },
  { id: 'ticket', label: 'Tickets' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'finance', label: 'Finance' },
  { id: 'team', label: 'Team' },
];

export const notificationSummaryCardDetails: Record<
  NotificationSummaryCard,
  {
    label: string;
    sub: string;
  }
> = {
  unread: {
    label: 'Unread',
    sub: 'Awaiting review',
  },
  urgent: {
    label: 'Urgent',
    sub: 'High-priority alerts',
  },
  finance: {
    label: 'Finance',
    sub: 'Payout & billing notices',
  },
  today: {
    label: 'Today',
    sub: 'Activity last few hours',
  },
};

export type HomeFeature =
  | 'platform-activity'
  | 'team-collaboration'
  | 'team-collaboration-actions'
  | 'event-open-entry';

const homeFeatureTierRequirements: Record<HomeFeature, SubscriptionTier> = {
  'platform-activity': 'premium',
  'team-collaboration': 'premium',
  'team-collaboration-actions': 'business',
  'event-open-entry': 'free',
};

export function isTierAtLeast(activeTier: SubscriptionTier, requiredTier: SubscriptionTier) {
  return tierRank[activeTier] >= tierRank[requiredTier];
}

export function isViewAllowed(activeTier: SubscriptionTier, view: AppView) {
  return isTierAtLeast(activeTier, viewTierRequirements[view]);
}

export function isEventTabAllowed(activeTier: SubscriptionTier, tab: EventManagementTab) {
  return isTierAtLeast(activeTier, eventTabTierRequirements[tab]);
}

export function isSettingsSectionAllowed(activeTier: SubscriptionTier, section: SettingsSection) {
  return isTierAtLeast(activeTier, settingsSectionTierRequirements[section]);
}

export function isHomeFeatureAllowed(activeTier: SubscriptionTier, feature: HomeFeature) {
  return isTierAtLeast(activeTier, homeFeatureTierRequirements[feature]);
}

export function isSearchResultAllowed(activeTier: SubscriptionTier, result: GlobalSearchResult) {
  return isTierAtLeast(activeTier, searchResultTierRequirements[result.type]);
}

export function isNotificationCategoryAllowed(
  activeTier: SubscriptionTier,
  category: NotificationCategory
) {
  return isTierAtLeast(activeTier, notificationCategoryTierRequirements[category]);
}

export function isNotificationFeedFilterAllowed(
  activeTier: SubscriptionTier,
  filter: NotificationFeedFilter
) {
  if (filter === 'all' || filter === 'unread') {
    return true;
  }

  return isNotificationCategoryAllowed(activeTier, notificationFeedFilterCategoryMap[filter]);
}

export function getAllowedNotificationFeedFilters(activeTier: SubscriptionTier) {
  return notificationFeedFilterDetails.filter((filter) =>
    isNotificationFeedFilterAllowed(activeTier, filter.id)
  );
}

export function isNotificationSummaryCardAllowed(
  activeTier: SubscriptionTier,
  card: NotificationSummaryCard
) {
  return isTierAtLeast(activeTier, notificationSummaryCardTierRequirements[card]);
}

export function getAllowedNotificationSummaryCards(activeTier: SubscriptionTier) {
  return (Object.keys(notificationSummaryCardTierRequirements) as NotificationSummaryCard[]).filter((card) =>
    isNotificationSummaryCardAllowed(activeTier, card)
  );
}

export function filterSearchResultsByTier(activeTier: SubscriptionTier, results: GlobalSearchResult[]) {
  return results.filter((result) => isSearchResultAllowed(activeTier, result));
}

export function isNotificationAllowed(activeTier: SubscriptionTier, notification: OrganizerNotification) {
  if (!isNotificationCategoryAllowed(activeTier, notification.category)) {
    return false;
  }

  const target = notification.target;

  if (!target) {
    return true;
  }

  if (target.kind === 'view') {
    return isViewAllowed(activeTier, target.view);
  }

  if (target.kind === 'settings') {
    return isSettingsSectionAllowed(activeTier, target.section);
  }

  return isViewAllowed(activeTier, 'event-management') && isEventTabAllowed(activeTier, target.tab);
}

export function filterNotificationsByTier(activeTier: SubscriptionTier, notifications: OrganizerNotification[]) {
  return notifications.filter((notification) => isNotificationAllowed(activeTier, notification));
}

export function canOpenNotificationWorkflow(
  activeTier: SubscriptionTier,
  notification: OrganizerNotification
) {
  return Boolean(notification.target) && isNotificationAllowed(activeTier, notification);
}

export function getAllowedEventManagementTabs(activeTier: SubscriptionTier) {
  return (Object.keys(eventTabTierRequirements) as EventManagementTab[]).filter((tab) =>
    isEventTabAllowed(activeTier, tab)
  );
}

export function getAllowedSettingsSections(activeTier: SubscriptionTier) {
  return (Object.keys(settingsSectionTierRequirements) as SettingsSection[]).filter((section) =>
    isSettingsSectionAllowed(activeTier, section)
  );
}

export function getFirstAllowedEventManagementTab(activeTier: SubscriptionTier) {
  return getAllowedEventManagementTabs(activeTier)[0] ?? null;
}

export function getFirstAllowedSettingsSection(activeTier: SubscriptionTier) {
  return getAllowedSettingsSections(activeTier)[0] ?? 'profile';
}

export function getStoredSubscriptionTier() {
  if (typeof window === 'undefined') {
    return 'free' as SubscriptionTier;
  }

  const storedTier = window.localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);

  if (storedTier === 'free' || storedTier === 'premium' || storedTier === 'business') {
    return storedTier;
  }

  return 'free' as SubscriptionTier;
}

export type TierRouteState = {
  contextMode: 'organization' | 'event';
  currentView: AppView;
  eventManagementTab: EventManagementTab;
  settingsSection: SettingsSection;
};

export function resolveSafeRouteForTier(
  activeTier: SubscriptionTier,
  routeState: TierRouteState
): TierRouteState {
  const safeSettingsSection = isSettingsSectionAllowed(activeTier, routeState.settingsSection)
    ? routeState.settingsSection
    : getFirstAllowedSettingsSection(activeTier);

  if (!isViewAllowed(activeTier, routeState.currentView)) {
    return {
      contextMode: 'organization',
      currentView: 'home',
      eventManagementTab: routeState.eventManagementTab,
      settingsSection: safeSettingsSection,
    };
  }

  if (routeState.currentView === 'settings') {
    return {
      ...routeState,
      contextMode: 'organization',
      settingsSection: safeSettingsSection,
    };
  }

  if (routeState.currentView === 'event-management') {
    const safeEventManagementTab = isEventTabAllowed(activeTier, routeState.eventManagementTab)
      ? routeState.eventManagementTab
      : getFirstAllowedEventManagementTab(activeTier);

    if (!safeEventManagementTab) {
      return {
        contextMode: 'organization',
        currentView: 'home',
        eventManagementTab: routeState.eventManagementTab,
        settingsSection: safeSettingsSection,
      };
    }

    return {
      ...routeState,
      contextMode: 'event',
      eventManagementTab: safeEventManagementTab,
      settingsSection: safeSettingsSection,
    };
  }

  return {
    ...routeState,
    contextMode: 'organization',
    settingsSection: safeSettingsSection,
  };
}
