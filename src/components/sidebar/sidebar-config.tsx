import { ComponentType } from 'react';
import {
  BarChart3,
  Bell,
  Calendar,
  DollarSign,
  Home,
  Settings,
  Users,
} from 'lucide-react';

import {
  isViewAllowed,
} from '@/lib/subscription-access';
import { AppView, EventManagementTab, SettingsSection, SubscriptionTier } from '@/types/navigation';

type SidebarIcon = ComponentType<{ className?: string }>;

export type SidebarNavAction =
  | {
      kind: 'view';
      view: AppView;
    }
  | {
      kind: 'settings-section';
      section: SettingsSection;
    }
  | {
      kind: 'event-tab';
      tab: EventManagementTab;
    }
  | {
      kind: 'callback';
      onSelect: () => void;
    };

export type SidebarNavLeafItem = {
  id: string;
  label: string;
  icon: SidebarIcon;
  action: SidebarNavAction;
  description?: string;
  accent?: 'default' | 'danger';
};

export type SidebarNavItem = SidebarNavLeafItem;

export type SidebarNavGroup = {
  id: string;
  label?: string;
  items: SidebarNavItem[];
};

interface OrganizationNavigationConfig {
  activeTier: SubscriptionTier;
}

export function createOrganizationSidebarGroups({
  activeTier,
}: OrganizationNavigationConfig): SidebarNavGroup[] {
  const organizationItems: SidebarNavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: { kind: 'view', view: 'home' },
    },
    {
      id: 'events',
      label: 'Events',
      icon: Calendar,
      action: { kind: 'view', view: 'events' },
    },
  ];

  if (isViewAllowed(activeTier, 'analytics')) {
    organizationItems.push({
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      action: { kind: 'view', view: 'analytics' },
    });
  }

  if (isViewAllowed(activeTier, 'team')) {
    organizationItems.push({
      id: 'team',
      label: 'Team',
      icon: Users,
      action: { kind: 'view', view: 'team' },
    });
  }

  if (isViewAllowed(activeTier, 'finance')) {
    organizationItems.push({
      id: 'finance',
      label: 'Finance',
      icon: DollarSign,
      action: { kind: 'view', view: 'finance' },
    });
  }

  return [
    {
      id: 'organization',
      label: 'Organization',
      items: organizationItems,
    },
    {
      id: 'workspace',
      label: 'Workspace',
      items: [
        {
          id: 'notification-center',
          label: 'Notification Center',
          icon: Bell,
          action: { kind: 'view', view: 'notification-center' },
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          action: { kind: 'view', view: 'settings' },
        },
      ],
    },
  ];
}
