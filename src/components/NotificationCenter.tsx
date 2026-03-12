import { useMemo, useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Megaphone,
  Receipt,
  ShieldCheck,
  Ticket,
  Users,
  ArrowUpRight,
} from 'lucide-react';

import { OrganizerNotification } from '@/types/notifications';

type NotificationCenterProps = {
  notifications: OrganizerNotification[];
  onMarkAllRead: () => void;
  onToggleRead: (notificationId: string) => void;
  onArchive: (notificationId: string) => void;
  onOpenNotification: (notification: OrganizerNotification) => void;
  onOpenPreferences: () => void;
};

type FeedFilter = 'all' | 'unread' | 'order' | 'ticket' | 'marketing' | 'finance' | 'team';

const feedFilters: Array<{ id: FeedFilter; label: string }> = [
  { id: 'all', label: 'All activity' },
  { id: 'unread', label: 'Unread' },
  { id: 'order', label: 'Orders' },
  { id: 'ticket', label: 'Tickets' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'finance', label: 'Finance' },
  { id: 'team', label: 'Team' },
];

const getCategoryIcon = (category: OrganizerNotification['category']) => {
  if (category === 'order') return Receipt;
  if (category === 'ticket') return Ticket;
  if (category === 'marketing') return Megaphone;
  if (category === 'finance') return ShieldCheck;
  if (category === 'team') return Users;
  return Bell;
};

// Audit: accent colors used only for small semantic dots, not large surfaces.
// Icon tiles use neutral bg — reduces color noise per "neutral palette dominates" rule.
const getCategoryDotColor = (category: OrganizerNotification['category']) => {
  if (category === 'order') return 'bg-emerald-500';
  if (category === 'ticket') return 'bg-blue-500';
  if (category === 'marketing') return 'bg-violet-500';
  if (category === 'finance') return 'bg-amber-500';
  if (category === 'team') return 'bg-sky-500';
  return 'bg-rose-500';
};

const getPriorityLabel = (priority: OrganizerNotification['priority']) => {
  if (priority === 'high') return 'text-rose-600';
  if (priority === 'medium') return 'text-amber-600';
  return 'text-gray-400';
};

export function NotificationCenter({
  notifications,
  onMarkAllRead,
  onToggleRead,
  onArchive,
  onOpenNotification,
  onOpenPreferences,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(
    notifications[0]?.id ?? null
  );

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.category === filter);
  }, [filter, notifications]);

  useEffect(() => {
    if (filteredNotifications.some((n) => n.id === selectedNotificationId)) return;
    setSelectedNotificationId(filteredNotifications[0]?.id ?? null);
  }, [filteredNotifications, selectedNotificationId]);

  useEffect(() => {
    if (!selectedNotificationId && notifications.length > 0) {
      setSelectedNotificationId(notifications[0].id);
    }
  }, [notifications, selectedNotificationId]);

  const selectedNotification =
    filteredNotifications.find((n) => n.id === selectedNotificationId) ??
    notifications.find((n) => n.id === selectedNotificationId) ??
    null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const urgentCount = notifications.filter((n) => n.priority === 'high').length;
  const financeCount = notifications.filter((n) => n.category === 'finance').length;
  const todayCount = notifications.filter((n) =>
    ['5m ago', '12m ago', '18m ago', '42m ago', '1h ago', '2h ago'].includes(n.timeLabel)
  ).length;

  return (
    <div className="ui-page motion-page">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">

        {/* Page header — 32px title, subtitle, actions */}
        <div className="ui-page-header motion-row">
          <div>
            <h1 className="ui-page-title">Notification Center</h1>
            <p className="ui-page-subtitle">
              Review alerts, operational activity, and workflow updates across all your events.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onOpenPreferences}
              className="ui-button ui-button--outline ui-button--size-sm"
            >
              Preferences
            </button>
            <button
              type="button"
              onClick={onMarkAllRead}
              className="ui-button ui-button--default ui-button--size-sm"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          </div>
        </div>

        {/* Metric strip — gap-6 (24px) per card gap rule */}
        <div className="grid grid-cols-4 gap-6 motion-stagger">
          {[
            { label: 'Unread',  value: unreadCount,  sub: 'Awaiting review' },
            { label: 'Urgent',  value: urgentCount,  sub: 'High-priority alerts' },
            { label: 'Finance', value: financeCount, sub: 'Payout & billing notices' },
            { label: 'Today',   value: todayCount,   sub: 'Activity last few hours' },
          ].map((stat) => (
            /* Card: 28px radius, 24px padding, gray-200 border — per card system rules */
            <div key={stat.label} className="rounded-[28px] border border-gray-200 bg-white p-6">
              <p className="ui-meta-text mb-3">{stat.label}</p>
              <p className="text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</p>
              <p className="mt-2 text-xs text-gray-500">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Feed + Detail — gap-6 (24px) between cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 motion-row">

          {/* Activity Feed */}
          <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white">

            {/* Card header — py-6 (24px) per card padding rule */}
            <div className="border-b border-gray-100 px-6 py-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="ui-card-title">Activity Feed</h2>
                {unreadCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 px-1.5 text-[10px] font-semibold leading-none text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              {/* Filters — 8px gap (text spacing) */}
              <div className="flex flex-wrap gap-2">
                {feedFilters.map((feedFilter) => (
                  <button
                    key={feedFilter.id}
                    type="button"
                    onClick={() => setFilter(feedFilter.id)}
                    className={`ui-chip ${filter === feedFilter.id ? 'is-active' : ''}`}
                  >
                    {feedFilter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feed rows */}
            <div className="py-2">
              {filteredNotifications.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <Bell className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-4 text-sm font-medium text-gray-900">No notifications here</p>
                  <p className="mt-2 text-xs text-gray-500">Try a different filter.</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const Icon = getCategoryIcon(notification.category);
                  const isSelected = selectedNotificationId === notification.id;

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => {
                        setSelectedNotificationId(notification.id);
                        if (!notification.read) onToggleRead(notification.id);
                      }}
                      className="w-full px-3 py-1 text-left focus-visible:outline-none"
                    >
                      {/* Apple-style inset rounded selection — floats inside the card like Apple Mail */}
                      <div className={`rounded-[20px] px-4 py-3 transition-colors duration-[150ms] ${
                        isSelected
                          ? 'bg-violet-50 ring-1 ring-violet-200/60'
                          : 'hover:bg-gray-50'
                      }`}>
                      <div className="flex items-start gap-3">

                        {/* Unread dot — optically aligned to first line of text */}
                        <div className="flex w-4 flex-shrink-0 items-start justify-center pt-[9px]">
                          <span className={`h-1.5 w-1.5 rounded-full ${!notification.read ? 'bg-violet-500' : 'bg-transparent'}`} />
                        </div>

                        {/* Icon tile — neutral bg, single gray color per audit (no per-category accent surfaces) */}
                        <div className="flex-shrink-0 rounded-xl bg-gray-100 p-2 text-gray-500">
                          <Icon className="h-3.5 w-3.5" />
                        </div>

                        {/* Content — body 14px, metadata 12px per typography rules */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm leading-5 ${notification.read ? 'font-medium text-gray-600' : 'font-semibold text-gray-900'}`}>
                              {notification.title}
                            </p>
                            <span className="flex-shrink-0 text-xs text-gray-400">{notification.timeLabel}</span>
                          </div>
                          <p className="mt-1 overflow-hidden text-xs leading-5 text-gray-500 line-clamp-2">
                            {notification.message}
                          </p>
                          {/* Metadata row — 12px medium, 8px gap (text spacing rule) */}
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`flex items-center gap-1 text-[11px] font-medium ${getPriorityLabel(notification.priority)}`}>
                              <span className={`h-1 w-1 rounded-full ${getCategoryDotColor(notification.category)}`} />
                              {notification.category}
                            </span>
                            {notification.eventLabel && (
                              <>
                                <span className="text-gray-200">·</span>
                                <span className="truncate text-[11px] text-gray-400">{notification.eventLabel}</span>
                              </>
                            )}
                          </div>
                        </div>

                      </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          {/* Detail Review */}
          <aside className="overflow-hidden rounded-[28px] border border-gray-200 bg-white">

            {/* Card header — py-6 (24px) consistent with feed header */}
            <div className="border-b border-gray-100 px-6 py-6">
              <h2 className="ui-card-title">Detail Review</h2>
              <p className="mt-2 text-xs text-gray-500">
                Select an alert to inspect and act on it.
              </p>
            </div>

            {selectedNotification ? (
              /* p-6 (24px) card padding, space-y-4 (16px) subcard gap — per spacing rules */
              <div className="p-6 space-y-4">

                {/* Alert summary subcard — 22px radius, p-4 (16px) per subcard rules */}
                <div className="rounded-[22px] border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`h-2 w-2 rounded-full ${getCategoryDotColor(selectedNotification.category)}`} />
                    <span className="text-xs font-medium capitalize text-gray-500">
                      {selectedNotification.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                    {selectedNotification.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {selectedNotification.message}
                  </p>
                </div>

                {/* Metadata list subcard — 22px radius, 16px padding, hairline dividers */}
                <div className="overflow-hidden rounded-[22px] border border-gray-200 divide-y divide-gray-100">
                  {[
                    { label: 'Priority', value: selectedNotification.priority },
                    { label: 'Received', value: selectedNotification.timeLabel },
                    { label: 'Event',    value: selectedNotification.eventLabel || 'Organization level' },
                    { label: 'Action',   value: selectedNotification.detail || 'Open the linked workspace to continue.' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-4 px-4 py-3">
                      <span className="w-16 flex-shrink-0 text-xs font-medium text-gray-400">
                        {row.label}
                      </span>
                      <span className="text-xs text-gray-700 capitalize leading-5">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Action buttons — 8px gap (text spacing) */}
                <div className="flex flex-wrap gap-2">
                  {selectedNotification.target && (
                    <button
                      type="button"
                      onClick={() => onOpenNotification(selectedNotification)}
                      className="ui-button ui-button--default ui-button--size-sm"
                    >
                      {selectedNotification.ctaLabel || 'Open workflow'}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onToggleRead(selectedNotification.id)}
                    className="ui-button ui-button--outline ui-button--size-sm"
                  >
                    {selectedNotification.read ? 'Mark unread' : 'Mark read'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onArchive(selectedNotification.id)}
                    className="ui-button ui-button--ghost ui-button--size-sm"
                  >
                    Archive
                  </button>
                </div>

              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <Bell className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-4 text-sm font-medium text-gray-900">Nothing selected</p>
                <p className="mt-2 text-xs text-gray-500">
                  Pick an alert from the feed to review it here.
                </p>
              </div>
            )}

          </aside>

        </div>
      </div>
    </div>
  );
}
