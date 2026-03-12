import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  CheckCheck,
  CircleAlert,
  Layers3,
  Mail,
  Megaphone,
  Receipt,
  ShieldCheck,
  Ticket,
  Users,
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

const getCategoryBadgeClass = (category: OrganizerNotification['category']) => {
  if (category === 'order') return 'bg-emerald-100 text-emerald-700';
  if (category === 'ticket') return 'bg-blue-100 text-blue-700';
  if (category === 'marketing') return 'bg-violet-100 text-violet-700';
  if (category === 'finance') return 'bg-amber-100 text-amber-700';
  if (category === 'team') return 'bg-sky-100 text-sky-700';
  return 'bg-rose-100 text-rose-700';
};

const getPriorityBadgeClass = (priority: OrganizerNotification['priority']) => {
  if (priority === 'high') return 'bg-rose-100 text-rose-700';
  if (priority === 'medium') return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-700';
};

function MetricCard({
  label,
  value,
  helper,
  tone,
}: {
  label: string;
  value: string;
  helper: string;
  tone: string;
}) {
  return (
    <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
      <div className={`mb-4 inline-flex rounded-2xl px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${tone}`}>
        {label}
      </div>
      <div className="text-3xl font-semibold tracking-tight text-gray-950">{value}</div>
      <p className="mt-2 text-sm text-gray-500">{helper}</p>
    </div>
  );
}

export function NotificationCenter({
  notifications,
  onMarkAllRead,
  onToggleRead,
  onArchive,
  onOpenNotification,
  onOpenPreferences,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(notifications[0]?.id ?? null);

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter((notification) => !notification.read);
    return notifications.filter((notification) => notification.category === filter);
  }, [filter, notifications]);

  useEffect(() => {
    if (filteredNotifications.some((notification) => notification.id === selectedNotificationId)) return;
    setSelectedNotificationId(filteredNotifications[0]?.id ?? null);
  }, [filteredNotifications, selectedNotificationId]);

  useEffect(() => {
    if (!selectedNotificationId && notifications.length > 0) {
      setSelectedNotificationId(notifications[0].id);
    }
  }, [notifications, selectedNotificationId]);

  const selectedNotification =
    filteredNotifications.find((notification) => notification.id === selectedNotificationId) ??
    notifications.find((notification) => notification.id === selectedNotificationId) ??
    null;

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const urgentCount = notifications.filter((notification) => notification.priority === 'high').length;
  const financeCount = notifications.filter((notification) => notification.category === 'finance').length;
  const todayCount = notifications.filter((notification) =>
    ['5m ago', '12m ago', '18m ago', '42m ago', '1h ago', '2h ago'].includes(notification.timeLabel)
  ).length;

  return (
    <div className="min-h-full bg-[#f7f5fb] p-6 md:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">Notification Center</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 md:text-base">
              Review live organizer alerts, operational activity, and workflow updates across orders,
              payouts, campaigns, and team actions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onOpenPreferences}
              className="rounded-2xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Notification Preferences
            </button>
            <button
              type="button"
              onClick={onMarkAllRead}
              className="rounded-2xl bg-[#7626c6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#6420a7]"
            >
              Mark all read
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="Unread"
            value={String(unreadCount)}
            helper="Needs organizer review or acknowledgement."
            tone="bg-violet-100 text-[#7626c6]"
          />
          <MetricCard
            label="Urgent"
            value={String(urgentCount)}
            helper="High-priority alerts tied to orders, payouts, or attendee issues."
            tone="bg-rose-100 text-rose-700"
          />
          <MetricCard
            label="Finance"
            value={String(financeCount)}
            helper="Payout, invoice, and settlement notices this cycle."
            tone="bg-amber-100 text-amber-700"
          />
          <MetricCard
            label="Today"
            value={String(todayCount)}
            helper="New activity across your organizer workspace in the last few hours."
            tone="bg-sky-100 text-sky-700"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6 lg:p-7">
            <div className="mb-5 flex flex-col gap-4 border-b border-gray-100 pb-4 sm:mb-6 sm:pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-950">Activity Feed</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Filter by alert type, review what changed, and jump directly into the affected workflow.
                </p>
              </div>
              <div className="rounded-full bg-[#f4ecfb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#7626c6]">
                Organizer Inbox
              </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {feedFilters.map((feedFilter) => (
                <button
                  key={feedFilter.id}
                  type="button"
                  onClick={() => setFilter(feedFilter.id)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    filter === feedFilter.id
                      ? 'bg-[#7626c6] text-white'
                      : 'border border-gray-200 bg-white text-gray-600 hover:border-[#7626c6] hover:text-[#7626c6]'
                  }`}
                >
                  {feedFilter.label}
                </button>
              ))}
            </div>

            {filteredNotifications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-14 text-center">
                <Bell className="mx-auto h-10 w-10 text-gray-300" />
                <div className="mt-4 text-lg font-semibold text-gray-900">No notifications in this view</div>
                <p className="mt-2 text-sm text-gray-500">
                  Try switching filters or wait for new organizer activity.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const Icon = getCategoryIcon(notification.category);
                  const isSelected = selectedNotificationId === notification.id;

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => {
                        setSelectedNotificationId(notification.id);
                        if (!notification.read) {
                          onToggleRead(notification.id);
                        }
                      }}
                      className={`w-full rounded-xl border p-4 text-left transition sm:p-5 ${
                        isSelected
                          ? 'border-[#7626c6]/30 bg-[#faf5ff] shadow-sm'
                          : 'border-gray-200 bg-white hover:border-[#7626c6]/20 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 rounded-xl p-3 ${getCategoryBadgeClass(notification.category)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className={`text-sm ${notification.read ? 'font-medium text-gray-700' : 'font-semibold text-gray-950'}`}>
                              {notification.title}
                            </div>
                            {!notification.read ? (
                              <span className="inline-flex rounded-full bg-[#f1e5fb] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7626c6]">
                                New
                              </span>
                            ) : null}
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${getPriorityBadgeClass(notification.priority)}`}>
                              {notification.priority}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-gray-600">{notification.message}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className={`inline-flex rounded-full px-2.5 py-1 font-semibold capitalize ${getCategoryBadgeClass(notification.category)}`}>
                              {notification.category}
                            </span>
                            {notification.eventLabel ? <span>{notification.eventLabel}</span> : null}
                            <span>{notification.timeLabel}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6 lg:p-7">
            <div className="mb-5 flex items-start justify-between gap-3 border-b border-gray-100 pb-4 sm:mb-6 sm:pb-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-950">Detail Review</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Inspect the selected notification and jump into the right organizer action.
                </p>
              </div>
              <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
                Live
              </div>
            </div>

            {selectedNotification ? (
              <div className="space-y-5">
                <div className="rounded-xl border border-gray-200 bg-[#faf5ff] p-4 sm:p-5">
                  <div className="flex items-center gap-2">
                    <Layers3 className="h-4 w-4 text-[#7626c6]" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7626c6]">
                      {selectedNotification.category} alert
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-gray-950">{selectedNotification.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{selectedNotification.message}</p>
                </div>

                <div className="space-y-3">
                  <DetailItem label="Priority" value={selectedNotification.priority} />
                  <DetailItem label="Received" value={selectedNotification.timeLabel} />
                  <DetailItem label="Event" value={selectedNotification.eventLabel || 'Organization level'} />
                  <DetailItem label="Follow-up" value={selectedNotification.detail || 'Open the linked workspace to continue.'} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedNotification.target ? (
                    <button
                      type="button"
                      onClick={() => onOpenNotification(selectedNotification)}
                      className="rounded-xl bg-[#7626c6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6420a7]"
                    >
                      {selectedNotification.ctaLabel || 'Open linked workflow'}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onToggleRead(selectedNotification.id)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    {selectedNotification.read ? 'Mark unread' : 'Mark read'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onArchive(selectedNotification.id)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Archive
                  </button>
                </div>

                <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50/60 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <CircleAlert className="mt-0.5 h-4 w-4 text-[#7626c6]" />
                    <p className="text-sm text-gray-600">
                      Keep urgent notifications reviewed here before jumping into refunds, payouts, or attendee support.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <MiniActionCard
                    icon={CheckCheck}
                    title="Triage Queue"
                    description="Use unread filtering to work through the latest organizer alerts first."
                  />
                  <MiniActionCard
                    icon={Mail}
                    title="Delivery Health"
                    description="Campaign and confirmation notices now live beside operational alerts."
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-12 text-center">
                <Bell className="mx-auto h-10 w-10 text-gray-300" />
                <div className="mt-4 text-lg font-semibold text-gray-900">No notification selected</div>
                <p className="mt-2 text-sm text-gray-500">
                  Choose an item from the feed to inspect the alert details.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-[#fafafa] p-4 sm:p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</div>
      <div className="mt-2 text-sm font-medium capitalize text-gray-900">{value}</div>
    </div>
  );
}

function MiniActionCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-[#fafafa] p-4 sm:p-5">
      <div className="inline-flex rounded-xl bg-gray-100 p-2 text-gray-700">
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-sm font-semibold text-gray-900">{title}</div>
      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </div>
  );
}
