export type AppView =
  | 'dashboard'
  | 'create-event'
  | 'event-management'
  | 'analytics'
  | 'team'
  | 'finance'
  | 'notification-center'
  | 'settings'
  | 'help';

export type SettingsSection =
  | 'profile'
  | 'security'
  | 'payments'
  | 'notifications';

export type EventManagementTab =
  | 'details'
  | 'ticketing'
  | 'orders'
  | 'checked-in'
  | 'marketing'
  | 'reports'
  | 'settings';

export type GlobalSearchResultType = 'event' | 'order' | 'attendee' | 'team';

export type GlobalSearchResult = {
  id: string;
  type: GlobalSearchResultType;
  label: string;
  meta: string;
  eventId?: string;
};
