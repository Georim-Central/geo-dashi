import { AppView, EventManagementTab, SettingsSection } from '@/types/navigation';

export type NotificationCategory = 'order' | 'ticket' | 'milestone' | 'marketing' | 'finance' | 'team';
export type NotificationPriority = 'high' | 'medium' | 'low';

export type NotificationTarget =
  | {
      kind: 'view';
      view: AppView;
    }
  | {
      kind: 'event-tab';
      eventId: string;
      tab: EventManagementTab;
    }
  | {
      kind: 'settings';
      section: SettingsSection;
    };

export type OrganizerNotification = {
  id: string;
  title: string;
  message: string;
  timeLabel: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  read: boolean;
  eventLabel?: string;
  ctaLabel?: string;
  detail?: string;
  target?: NotificationTarget;
};
