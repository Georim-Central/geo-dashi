import { KeyboardEvent, useEffect, useMemo, useState } from 'react';
import {
  Archive,
  Calendar,
  Copy,
  DollarSign,
  Eye,
  MapPin,
  MoreVertical,
  Plus,
  TrendingUp,
  Users,
} from 'lucide-react';

import { isViewAllowed } from '@/lib/subscription-access';
import { SubscriptionTier } from '@/types/navigation';
import { EventLifecycleStatus, EventSummary } from '@/types/event';
import { ContentState } from './ui/ContentState';
import { Button } from './ui/button';

interface EventsPageProps {
  activeTier: SubscriptionTier;
  events: EventSummary[];
  onCreateEvent: () => void;
  onEventSelect: (eventId: string, eventName?: string) => void;
  onDuplicateEvent: (eventId: string) => void;
  onArchiveEvent: (eventId: string) => void;
  onUpdateEventStatus: (eventId: string, status: EventLifecycleStatus) => void;
}

function getEventStatusBadgeClass(status: EventLifecycleStatus) {
  if (status === 'published') return 'bg-emerald-50 text-emerald-700';
  if (status === 'private') return 'bg-violet-50 text-violet-700';
  if (status === 'archived') return 'bg-amber-50 text-amber-700';
  return 'bg-slate-100 text-slate-700';
}

export function EventsPage({
  activeTier,
  events,
  onCreateEvent,
  onEventSelect,
  onDuplicateEvent,
  onArchiveEvent,
  onUpdateEventStatus,
}: EventsPageProps) {
  const isLoading = false;
  const dataError: string | null = null;
  const [selectedStatus, setSelectedStatus] = useState<'all' | EventLifecycleStatus>('all');
  const [sortMode, setSortMode] = useState<'recent' | 'revenue' | 'tickets'>('recent');
  const [activeMenuEventId, setActiveMenuEventId] = useState<string | null>(null);
  const canOpenEvents = isViewAllowed(activeTier, 'event-management');
  const totalRevenue = events.reduce((sum, eventSummary) => sum + eventSummary.revenue, 0);
  const totalAttendees = events.reduce((sum, eventSummary) => sum + eventSummary.ticketsSold, 0);
  const publishedCount = events.filter((eventSummary) => eventSummary.status === 'published').length;
  const stats = [
    { label: 'Total Events', value: String(events.length), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Attendees', value: totalAttendees.toLocaleString(), icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Published', value: String(publishedCount), icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' }
  ];

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

  const handleEventRowKeyDown = (event: KeyboardEvent<HTMLButtonElement>, eventId: string, eventTitle: string) => {
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

  return (
    <div className="ui-page motion-page" aria-busy={isLoading}>
      <div className="ui-page-header motion-row">
        <div>
          <h1 className="ui-page-title ui-type-section">Events</h1>
          <p className="ui-page-subtitle ui-type-subsection">
            Browse every event, manage lifecycle states, and track sales performance.
          </p>
        </div>
        <Button type="button" onClick={onCreateEvent} className="btn-glass ui-type-ui gap-2 px-6" size="lg">
          <Plus className="w-5 h-5" />
          Create Event
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 motion-stagger">
        <ContentState
          isLoading={isLoading}
          error={dataError}
          isEmpty={stats.length === 0}
          emptyMessage="No metrics available."
          className="col-span-full py-14"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-[28px] border border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="ui-meta-text ui-type-meta mb-2">{stat.label}</p>
                    <p className="ui-type-section text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`ui-icon-tile ${stat.bg} ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </ContentState>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="ui-card-title ui-type-card">Your Events</h2>
              <p className="ui-type-subsection mt-1 text-gray-600">
                {canOpenEvents
                  ? activeTier === 'free'
                    ? 'Open event details, manage lifecycle, and track sales across your events.'
                    : 'Manage lifecycle, track sales, and jump into advanced event operations.'
                  : 'Track lifecycle, sales, and status across your events.'}
              </p>
            </div>
            <div className="flex w-full items-center gap-3 lg:flex-1 lg:pl-6">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
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
                  className="ui-toolbar-select ui-type-ui rounded-2xl border border-gray-200 px-4 py-2 text-gray-700"
                  aria-label="Sort events"
                >
                  <option value="recent">Most Recent</option>
                  <option value="revenue">Highest Revenue</option>
                  <option value="tickets">Most Tickets Sold</option>
                </select>
              </div>
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
              <div key={event.id} className={`p-6 transition-colors ${canOpenEvents ? 'hover:bg-gray-50' : ''}`}>
                <div className="flex gap-6">
                  <button
                    type="button"
                    aria-label={`Open event ${event.title}`}
                    onClick={canOpenEvents ? () => onEventSelect(event.id, event.title) : undefined}
                    onKeyDown={canOpenEvents ? (keyEvent) => handleEventRowKeyDown(keyEvent, event.id, event.title) : undefined}
                    disabled={!canOpenEvents}
                    className={`flex min-w-0 flex-1 gap-6 rounded-2xl text-left ${
                      canOpenEvents ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                      <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div>
                        <h3 className="ui-card-title ui-type-card mb-1 text-gray-900">{event.title}</h3>
                        <div className="ui-type-subsection flex items-center gap-4 font-normal text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-8">
                        <div>
                          <p className="ui-type-meta mb-1 text-gray-500">Tickets Sold</p>
                          <div className="flex items-center gap-2">
                            <p className="ui-type-card text-gray-900">
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
                          <p className="ui-type-meta mb-1 text-gray-500">Revenue</p>
                          <p className="ui-type-card text-gray-900">
                            ${event.revenue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="ui-type-meta mb-1 text-gray-500">Lifecycle</p>
                          <p className="ui-type-subsection capitalize text-gray-900">{event.status}</p>
                        </div>
                      </div>
                    </div>
                  </button>

                  <div className="flex items-start gap-2">
                    <span
                      className={`ui-type-meta rounded-full px-3 py-1 capitalize ${getEventStatusBadgeClass(event.status)}`}
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
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                      </button>
                      {activeMenuEventId === event.id && (
                        <div
                          className="ui-menu-panel absolute right-0 top-11 z-10 w-[320px] max-w-[calc(100vw-2rem)] p-5"
                          onClick={(clickEvent) => clickEvent.stopPropagation()}
                        >
                          <div className="flex flex-col gap-2.5">
                            {canOpenEvents ? (
                              <button
                                type="button"
                                aria-label={`Open ${event.title}`}
                                onClick={() => {
                                  setActiveMenuEventId(null);
                                  onEventSelect(event.id, event.title);
                                }}
                                className="ui-type-ui flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-gray-700 transition hover:bg-gray-50 whitespace-nowrap"
                              >
                                <Eye className="h-4 w-4" />
                                Open Event
                              </button>
                            ) : null}
                            <button
                              type="button"
                              aria-label={event.status === 'published' ? `Move ${event.title} to draft` : `Publish ${event.title}`}
                              onClick={() => {
                                setActiveMenuEventId(null);
                                onUpdateEventStatus(event.id, event.status === 'published' ? 'draft' : 'published');
                              }}
                              className="ui-type-ui flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-gray-700 transition hover:bg-gray-50 whitespace-nowrap"
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
                              className="ui-type-ui flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-gray-700 transition hover:bg-gray-50 whitespace-nowrap"
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
                              className="ui-type-ui flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-amber-700 transition hover:bg-amber-50 whitespace-nowrap"
                            >
                              <Archive className="h-4 w-4" />
                              Archive Event
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ContentState>
        </div>
      </div>
    </div>
  );
}
