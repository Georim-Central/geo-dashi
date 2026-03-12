import { Plus, Calendar, MapPin, Users, DollarSign, TrendingUp, MoreVertical, ArrowRight, Ticket, Copy, Archive, Eye } from 'lucide-react';
import { KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { ContentState } from './ui/ContentState';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { EventLifecycleStatus, EventSummary } from '../types/event';

interface DashboardProps {
  events: EventSummary[];
  onCreateEvent: () => void;
  onEventSelect: (eventId: string, eventName?: string) => void;
  onViewTeam: () => void;
  onInviteTeamMember: () => void;
  onViewActivity: () => void;
  onDuplicateEvent: (eventId: string) => void;
  onArchiveEvent: (eventId: string) => void;
  onUpdateEventStatus: (eventId: string, status: EventLifecycleStatus) => void;
  firstName: string;
}

// Platform Activity Data
const platformActivity = [
  {
    type: 'tickets',
    icon: Ticket,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    title: 'Ticket Sales',
    value: '1,247 sold',
    description: 'across all events',
    badge: '+18%'
  },
  {
    type: 'revenue',
    icon: DollarSign,
    color: 'text-green-600',
    bg: 'bg-green-50',
    title: 'Total Revenue',
    value: '$124,560',
    description: 'this month',
    badge: '+23%'
  },
  {
    type: 'events',
    icon: Calendar,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'Active Events',
    value: '12 live',
    description: '3 ending this week',
    badge: 'Live'
  },
  {
    type: 'attendees',
    icon: Users,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    title: 'Total Attendees',
    value: '3,428',
    description: 'registered this month',
    badge: '+15%'
  }
];

// Recent Activity Feed
const recentActivity = [
  {
    event: 'Summer Music Festival 2026',
    action: 'New order',
    detail: '2x VIP tickets purchased',
    time: '5 min ago',
    amount: '+$240',
    unread: true
  },
  {
    event: 'Summer Music Festival 2026',
    action: 'Ticket update',
    detail: 'Early Bird tickets 80% sold',
    time: '12 min ago',
    unread: true
  },
  {
    event: 'Tech Conference 2026',
    action: 'Marketing milestone',
    detail: 'Reached 10K impressions on Georim',
    time: '1 hour ago',
    unread: true
  },
  {
    event: 'Summer Music Festival 2026',
    action: 'Registration milestone',
    detail: 'Passed 1,000 attendees',
    time: '2 hours ago',
    unread: true
  },
  {
    event: 'Food & Wine Expo',
    action: 'Email campaign sent',
    detail: 'Event reminder - 94% delivery rate',
    time: '3 hours ago',
    unread: false
  }
];

const teamCollaborationMembers = [
  {
    name: 'Alexandra Deff',
    task: 'Overseeing workspace permissions, releases, and core platform operations.',
    role: 'Admin',
    initials: 'AD',
  },
  {
    name: 'Edwin Adenike',
    task: 'Driving campaigns, messaging, and growth initiatives across active events.',
    role: 'Marketing',
    initials: 'EA',
  },
  {
    name: 'Isaac Oluwatemilorun',
    task: 'Managing day-to-day workflow setup, reporting, and cross-team coordination.',
    role: 'Operations',
    initials: 'IO',
  },
  {
    name: 'David Oshodi',
    task: 'Handling team assistance, issue follow-ups, and workspace support coverage.',
    role: 'Support',
    initials: 'DO',
  },
];

function getTeamRoleBadgeClass(role: string) {
  if (role === 'Admin') return 'bg-violet-50 text-violet-700';
  if (role === 'Marketing') return 'bg-blue-50 text-blue-700';
  if (role === 'Operations') return 'bg-emerald-50 text-emerald-700';
  return 'bg-amber-50 text-amber-700';
}

function getEventStatusBadgeClass(status: EventLifecycleStatus) {
  if (status === 'published') return 'bg-emerald-50 text-emerald-700';
  if (status === 'private') return 'bg-violet-50 text-violet-700';
  if (status === 'archived') return 'bg-amber-50 text-amber-700';
  return 'bg-slate-100 text-slate-700';
}

function TeamCollaborationCard({
  onViewTeam,
  onInviteTeamMember,
}: {
  onViewTeam: () => void;
  onInviteTeamMember: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
        <h2 className="ui-card-title">Team Collaboration</h2>
        <Button type="button" variant="outline" size="sm" className="gap-1.5 text-sm" onClick={onInviteTeamMember}>
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      <div className="divide-y divide-gray-200">
        {teamCollaborationMembers.slice(0, 3).map((member) => (
          <div key={member.name} className="px-6 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-violet-50 text-violet-700">{member.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                  <p className="text-xs text-gray-600 mt-1 leading-5">{member.task}</p>
                </div>
              </div>
              <span className={`inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${getTeamRoleBadgeClass(member.role)}`}>
                {member.role}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <button
          type="button"
          onClick={onViewTeam}
          className="flex items-center gap-1 text-sm font-medium text-[#5f1fa3] hover:text-[#4d1c84]"
        >
          View more
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function Dashboard({
  events,
  onCreateEvent,
  onEventSelect,
  onViewTeam,
  onInviteTeamMember,
  onViewActivity,
  onDuplicateEvent,
  onArchiveEvent,
  onUpdateEventStatus,
  firstName
}: DashboardProps) {
  const isLoading = false;
  const dataError: string | null = null;
  const [selectedStatus, setSelectedStatus] = useState<'all' | EventLifecycleStatus>('all');
  const [sortMode, setSortMode] = useState<'recent' | 'revenue' | 'tickets'>('recent');
  const [activeMenuEventId, setActiveMenuEventId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeMenuEventId) return undefined;

    const handleDocumentClick = () => setActiveMenuEventId(null);
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setActiveMenuEventId(null);
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeMenuEventId]);

  const handleEventRowKeyDown = (event: KeyboardEvent<HTMLDivElement>, eventId: string, eventTitle: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onEventSelect(eventId, eventTitle);
    }
  };

  const filteredEvents = useMemo(() => {
    const statusFiltered = selectedStatus === 'all'
      ? events
      : events.filter((eventSummary) => eventSummary.status === selectedStatus);

    return [...statusFiltered].sort((left, right) => {
      if (sortMode === 'revenue') return right.revenue - left.revenue;
      if (sortMode === 'tickets') return right.ticketsSold - left.ticketsSold;
      return right.id.localeCompare(left.id);
    });
  }, [events, selectedStatus, sortMode]);

  const totalRevenue = events.reduce((sum, eventSummary) => sum + eventSummary.revenue, 0);
  const totalAttendees = events.reduce((sum, eventSummary) => sum + eventSummary.ticketsSold, 0);
  const publishedCount = events.filter((eventSummary) => eventSummary.status === 'published').length;
  const stats = [
    { label: 'Total Events', value: String(events.length), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Attendees', value: totalAttendees.toLocaleString(), icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Published', value: String(publishedCount), icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' }
  ];

  return (
    <div className="ui-page motion-page" aria-busy={isLoading}>
      {/* Header */}
      <div className="ui-page-header motion-row">
        <div>
          <h1 className="ui-page-title">Welcome {firstName}</h1>
          <p className="ui-page-subtitle">Manage and monitor all your events.</p>
        </div>
        <Button type="button" onClick={onCreateEvent} className="btn-glass gap-2 px-6" size="lg">
          <Plus className="w-5 h-5" />
          Create Event
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 motion-stagger">
        <ContentState
          isLoading={isLoading}
          error={dataError}
          isEmpty={stats.length === 0}
          emptyMessage="No metrics available."
          className="col-span-full py-14"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="rounded-[28px] border border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="ui-meta-text mb-2">{stat.label}</p>
                    <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`ui-icon-tile ${stat.bg} ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </ContentState>
      </div>

      {/* Platform Activity Summary */}
      <div className="mb-8 motion-row">
        <div className="ui-section-header">
          <h2 className="ui-section-title">Platform Activity</h2>
          <span className="text-sm text-gray-600">Live updates across all events</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 motion-stagger">
          <ContentState
            isLoading={isLoading}
            error={dataError}
            isEmpty={platformActivity.length === 0}
            emptyMessage="No platform activity available."
            className="col-span-full py-14"
          >
            {platformActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="group cursor-pointer rounded-[22px] border border-gray-200 bg-white p-5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`ui-icon-tile h-10 w-10 rounded-2xl ${activity.bg} ${activity.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="ui-card-title text-gray-700">{activity.title}</h3>
                        <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{activity.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="ui-meta-text text-gray-600">{activity.description}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.badge === 'Action Needed'
                        ? 'bg-rose-50 text-rose-700'
                        : activity.badge === 'Live'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {activity.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </ContentState>
        </div>
      </div>

      {/* Two Column Layout: Events + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 motion-row">
        {/* Events List - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="ui-card-title">Your Events</h2>
                  <p className="mt-1 text-sm text-gray-600">Manage lifecycle, track sales, and jump into event operations.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'published', label: 'Published' },
                    { id: 'draft', label: 'Draft' },
                    { id: 'private', label: 'Private' },
                    { id: 'archived', label: 'Archived' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setSelectedStatus(filter.id as 'all' | EventLifecycleStatus)}
                      className={`ui-chip ${selectedStatus === filter.id ? 'is-active' : ''}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                  <select
                    value={sortMode}
                    onChange={(event) => setSortMode(event.target.value as 'recent' | 'revenue' | 'tickets')}
                    className="ui-toolbar-select rounded-2xl border border-gray-200 px-4 py-2 text-sm text-gray-700"
                    aria-label="Sort events"
                  >
                    <option value="recent">Sort: Recent</option>
                    <option value="revenue">Sort: Revenue</option>
                    <option value="tickets">Sort: Tickets Sold</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200 motion-stagger">
              <ContentState
                isLoading={isLoading}
                error={dataError}
                isEmpty={filteredEvents.length === 0}
                emptyMessage="No events found."
                className="py-14"
              >
                {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="cursor-pointer p-6 transition-colors hover:bg-gray-50"
                  onClick={() => onEventSelect(event.id, event.title)}
                  onKeyDown={(keyEvent) => handleEventRowKeyDown(keyEvent, event.id, event.title)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex gap-6">
                    {/* Event Image */}
                    <div className="w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getEventStatusBadgeClass(event.status)}`}
                          >
                            {event.status}
                          </span>
                          <div className="relative">
                            <button
                              type="button"
                              aria-label={`Quick actions for ${event.title}`}
                              onClick={(clickEvent) => {
                                clickEvent.stopPropagation();
                                setActiveMenuEventId((current) => current === event.id ? null : event.id);
                              }}
                              className="rounded-xl p-2 hover:bg-gray-100"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-600" />
                            </button>
                            {activeMenuEventId === event.id && (
                              <div
                                className="ui-menu-panel absolute right-0 top-11 z-10 min-w-[210px] p-2"
                                onClick={(clickEvent) => clickEvent.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  aria-label={`Open ${event.title}`}
                                  onClick={() => {
                                    setActiveMenuEventId(null);
                                    onEventSelect(event.id, event.title);
                                  }}
                                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                >
                                  <Eye className="h-4 w-4" />
                                  Open Event
                                </button>
                                <button
                                  type="button"
                                  aria-label={event.status === 'published' ? `Move ${event.title} to draft` : `Publish ${event.title}`}
                                  onClick={() => {
                                    setActiveMenuEventId(null);
                                    onUpdateEventStatus(event.id, event.status === 'published' ? 'draft' : 'published');
                                  }}
                                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                >
                                  <Calendar className="h-4 w-4" />
                                  {event.status === 'published' ? 'Move to Draft' : 'Publish Event'}
                                </button>
                                <button
                                  type="button"
                                  aria-label={`Duplicate ${event.title}`}
                                  onClick={() => {
                                    setActiveMenuEventId(null);
                                    onDuplicateEvent(event.id);
                                  }}
                                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                >
                                  <Copy className="h-4 w-4" />
                                  Duplicate Event
                                </button>
                                <button
                                  type="button"
                                  aria-label={`Archive ${event.title}`}
                                  onClick={() => {
                                    setActiveMenuEventId(null);
                                    onArchiveEvent(event.id);
                                  }}
                                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-amber-700 transition hover:bg-amber-50"
                                >
                                  <Archive className="h-4 w-4" />
                                  Archive Event
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-8 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tickets Sold</p>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold text-gray-900">
                              {event.ticketsSold}/{event.totalTickets}
                            </p>
                            <div className="ui-progress-track w-24">
                              <div
                                className="ui-progress-indicator"
                                style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Revenue</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ${event.revenue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Lifecycle</p>
                          <p className="text-sm font-semibold capitalize text-gray-900">{event.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                ))}
              </ContentState>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed - Takes 1 column */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
                <h2 className="ui-card-title">Recent Activity</h2>
                {recentActivity.filter(a => a.unread).length > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-violet-500 text-white text-[10px] font-semibold leading-none">
                    {recentActivity.filter(a => a.unread).length}
                  </span>
                )}
              </div>

              <div className="divide-y divide-gray-200 motion-stagger">
                <ContentState
                  isLoading={isLoading}
                  error={dataError}
                  isEmpty={recentActivity.length === 0}
                  emptyMessage="No recent activity."
                  className="py-14"
                >
                  {recentActivity.map((activity, index) => (
                  <div key={index} className={`p-4 transition-colors ${activity.unread ? 'bg-violet-50/40 hover:bg-violet-50/60' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${activity.unread ? 'bg-violet-500 animate-pulse' : 'bg-violet-300'}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          {activity.amount && (
                            <span className="text-sm font-semibold text-green-600">
                              {activity.amount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{activity.detail}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">{activity.event}</p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
                </ContentState>
              </div>

              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onViewActivity}
                  className="flex items-center gap-1 text-sm font-medium text-[#5f1fa3] hover:text-[#4d1c84]"
                >
                  View all activity
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <TeamCollaborationCard onViewTeam={onViewTeam} onInviteTeamMember={onInviteTeamMember} />
          </div>
        </div>
      </div>
    </div>
  );
}
