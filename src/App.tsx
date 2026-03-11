import { Suspense, lazy, useMemo, useState } from 'react';
import { GlobalAIChat } from './components/GlobalAIChat';
import { Sidebar } from './components/Sidebar';
import { SettingsPage } from './components/SettingsPage';
import { TopBar } from './components/TopBar';
import { ContentState } from './components/ui/ContentState';
import { AppView, EventManagementTab, GlobalSearchResult, SettingsSection } from './types/navigation';
import { OrganizerNotification } from './types/notifications';
import { EventDraft, EventDraftUpdate, EventLifecycleStatus, EventSummary } from './types/event';

const Dashboard = lazy(() => import('./components/Dashboard').then((module) => ({ default: module.Dashboard })));
const EventCreation = lazy(() => import('./components/EventCreation').then((module) => ({ default: module.EventCreation })));
const EventManagement = lazy(() => import('./components/EventManagement').then((module) => ({ default: module.EventManagement })));
const Analytics = lazy(() => import('./components/Analytics').then((module) => ({ default: module.Analytics })));
const TeamManagement = lazy(() => import('./components/TeamManagement').then((module) => ({ default: module.TeamManagement })));
const Finance = lazy(() => import('./components/Finance').then((module) => ({ default: module.Finance })));
const NotificationCenter = lazy(() =>
  import('./components/NotificationCenter').then((module) => ({ default: module.NotificationCenter }))
);
const HelpCenter = lazy(() => import('./components/HelpCenter').then((module) => ({ default: module.HelpCenter })));

const defaultTeamEventOptions = [
  'Summer Music Festival 2026',
  'Tech Conference 2026',
  'Food & Wine Expo',
  'Georim Founders Circle'
];

const createEmptyEventDraft = (overrides: Partial<EventDraft> = {}): EventDraft => ({
  title: '',
  type: '',
  category: '',
  tags: [],
  locationType: '',
  location: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  isRecurring: false,
  mainImage: '',
  additionalImages: [],
  videoUrl: '',
  summary: '',
  description: '',
  ...overrides
});

const seededEventDetails: Record<string, EventDraft> = {
  '1': createEmptyEventDraft({
    title: 'Summer Music Festival 2026',
    type: 'Festival',
    category: 'Music',
    tags: ['music', 'outdoor', 'summer'],
    locationType: 'in-person',
    location: 'Central Park, New York',
    startDate: '2026-06-15',
    startTime: '18:00',
    endDate: '2026-06-15',
    endTime: '23:00',
    summary: 'A one-day summer music experience in Central Park.'
  }),
  '2': createEmptyEventDraft({
    title: 'Tech Conference 2026',
    type: 'Conference',
    category: 'Technology',
    tags: ['tech', 'conference', 'innovation'],
    locationType: 'online',
    location: 'Online Event',
    startDate: '2026-07-22',
    startTime: '09:00',
    endDate: '2026-07-24',
    endTime: '17:00',
    summary: 'Three days of keynotes, workshops, and networking.'
  }),
  '3': createEmptyEventDraft({
    title: 'Food & Wine Expo',
    type: 'Expo',
    category: 'Food',
    tags: ['food', 'wine', 'expo'],
    locationType: 'in-person',
    location: 'Downtown Convention Center',
    startDate: '2026-08-10',
    startTime: '11:00',
    endDate: '2026-08-10',
    endTime: '20:00',
    summary: 'Taste and explore top culinary brands and local chefs.'
  }),
  '4': createEmptyEventDraft({
    title: 'Georim Founders Circle',
    type: 'Private Event',
    category: 'Networking',
    tags: ['private', 'founders', 'networking'],
    locationType: 'in-person',
    location: 'Private Rooftop Venue, Chicago',
    startDate: '2026-09-03',
    startTime: '19:00',
    endDate: '2026-09-03',
    endTime: '22:00',
    summary: 'Invite-only networking for founders and community partners.'
  })
};

const seededEventSummaries: Record<string, EventSummary> = {
  '1': {
    id: '1',
    title: 'Summer Music Festival 2026',
    date: 'June 15, 2026',
    location: 'Central Park, New York',
    status: 'published',
    ticketsSold: 847,
    totalTickets: 1000,
    revenue: 25410,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop'
  },
  '2': {
    id: '2',
    title: 'Tech Conference 2026',
    date: 'July 22-24, 2026',
    location: 'Online Event',
    status: 'draft',
    ticketsSold: 234,
    totalTickets: 500,
    revenue: 11700,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'
  },
  '3': {
    id: '3',
    title: 'Food & Wine Expo',
    date: 'August 10, 2026',
    location: 'Downtown Convention Center',
    status: 'published',
    ticketsSold: 512,
    totalTickets: 800,
    revenue: 15360,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop'
  },
  '4': {
    id: '4',
    title: 'Georim Founders Circle',
    date: 'September 3, 2026',
    location: 'Private Rooftop Venue, Chicago',
    status: 'private',
    ticketsSold: 64,
    totalTickets: 120,
    revenue: 9600,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop'
  }
};

const searchOrderEntries = [
  { id: 'order-5847239', label: 'Order #5847239', meta: 'Sarah Johnson • Summer Music Festival 2026', eventId: '1' },
  { id: 'order-5847238', label: 'Order #5847238', meta: 'Michael Chen • Summer Music Festival 2026', eventId: '1' },
  { id: 'order-7421001', label: 'Order #7421001', meta: 'VIP Bundle • Tech Conference 2026', eventId: '2' }
];

const searchAttendeeEntries = [
  { id: 'attendee-3901', label: 'Sarah Johnson', meta: 'ATT-3901 • Summer Music Festival 2026', eventId: '1' },
  { id: 'attendee-4420', label: 'Michael Chen', meta: 'ATT-4420 • Summer Music Festival 2026', eventId: '1' },
  { id: 'attendee-1187', label: 'Jessica Brown', meta: 'ATT-1187 • Food & Wine Expo', eventId: '3' }
];

const searchTeamEntries = [
  { id: 'team-alexandra', label: 'Alexandra Deff', meta: 'Admin • Team Management' },
  { id: 'team-edwin', label: 'Edwin Adenike', meta: 'Marketing • Team Management' }
];

const seededNotifications: OrganizerNotification[] = [
  {
    id: 'notif-order-5847239',
    title: 'New VIP order confirmed',
    message: 'Sarah Johnson completed an order for 2 VIP tickets worth $240. Review attendee details or resend the confirmation.',
    timeLabel: '5m ago',
    category: 'order',
    priority: 'high',
    read: false,
    eventLabel: 'Summer Music Festival 2026',
    ctaLabel: 'Open orders',
    detail: 'Order #5847239 is ready for organizer review inside Orders & Registration.',
    target: {
      kind: 'event-tab',
      eventId: '1',
      tab: 'orders'
    }
  },
  {
    id: 'notif-ticket-threshold',
    title: 'Early Bird tier almost sold out',
    message: 'Early Bird GA has reached 80% capacity. Consider promoting the next pricing tier before the remaining inventory closes.',
    timeLabel: '12m ago',
    category: 'ticket',
    priority: 'medium',
    read: false,
    eventLabel: 'Summer Music Festival 2026',
    ctaLabel: 'Open ticketing',
    detail: 'Inventory pacing is above forecast and the next ticket tier should be reviewed.',
    target: {
      kind: 'event-tab',
      eventId: '1',
      tab: 'ticketing'
    }
  },
  {
    id: 'notif-finance-payout',
    title: 'Next payout queued for review',
    message: 'A payout batch of $6,200 is scheduled for March 14, 2026. Confirm the destination account and recent withdrawals.',
    timeLabel: '18m ago',
    category: 'finance',
    priority: 'high',
    read: false,
    eventLabel: 'Organization finance',
    ctaLabel: 'Open finance',
    detail: 'Finance requires a quick check before the next transfer run completes.',
    target: {
      kind: 'view',
      view: 'finance'
    }
  },
  {
    id: 'notif-marketing-campaign',
    title: 'Campaign delivery report is ready',
    message: 'The latest email campaign reached a 94% delivery rate. Review open rates and engagement before scheduling the next send.',
    timeLabel: '2h ago',
    category: 'marketing',
    priority: 'low',
    read: true,
    eventLabel: 'Tech Conference 2026',
    ctaLabel: 'Open marketing',
    detail: 'Campaign analytics were updated in the marketing workspace.',
    target: {
      kind: 'event-tab',
      eventId: '2',
      tab: 'marketing'
    }
  },
  {
    id: 'notif-team-invite',
    title: 'Team invite still pending',
    message: 'Alexandra Deff has not accepted the operations invite yet. You may want to resend the invitation or review role access.',
    timeLabel: '3h ago',
    category: 'team',
    priority: 'medium',
    read: true,
    eventLabel: 'Organization team',
    ctaLabel: 'Open team',
    detail: 'Pending invites can block coverage assignments for upcoming events.',
    target: {
      kind: 'view',
      view: 'team'
    }
  },
  {
    id: 'notif-milestone-audience',
    title: 'Attendance milestone reached',
    message: 'Summer Music Festival 2026 just passed 1,000 registered attendees. Review staffing, access lanes, and check-in readiness.',
    timeLabel: '1h ago',
    category: 'milestone',
    priority: 'medium',
    read: false,
    eventLabel: 'Summer Music Festival 2026',
    ctaLabel: 'Open check-in',
    detail: 'Operational readiness should be reviewed as attendance volume increases.',
    target: {
      kind: 'event-tab',
      eventId: '1',
      tab: 'checked-in'
    }
  },
  {
    id: 'notif-preferences-digest',
    title: 'Notification digest updated',
    message: 'Your quiet hours and delivery channel preferences were changed recently. Review alert routing if team members are missing updates.',
    timeLabel: 'Yesterday',
    category: 'team',
    priority: 'low',
    read: true,
    eventLabel: 'Notification settings',
    ctaLabel: 'Open settings',
    detail: 'Preference changes can affect who receives organizer reminders and payout notices.',
    target: {
      kind: 'settings',
      section: 'notifications'
    }
  }
];

const formatDateLabel = (draft: EventDraft) => {
  if (!draft.startDate) return 'Date not set';

  const start = new Date(`${draft.startDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) return 'Date not set';

  if (draft.endDate && draft.endDate !== draft.startDate) {
    const end = new Date(`${draft.endDate}T00:00:00`);
    if (!Number.isNaN(end.getTime())) {
      return `${start.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}-${end.toLocaleDateString(undefined, { day: 'numeric', year: 'numeric' })}`;
    }
  }

  return start.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
};

export default function App() {
  const currentUserFirstName = 'John';
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventName, setSelectedEventName] = useState<string | null>(null);
  const [contextMode, setContextMode] = useState<'organization' | 'event'>('organization');
  const [eventManagementTab, setEventManagementTab] = useState<EventManagementTab>('details');
  const [settingsSection, setSettingsSection] = useState<SettingsSection>('profile');
  const [teamEventOptions, setTeamEventOptions] = useState<string[]>(defaultTeamEventOptions);
  const [teamInviteRequestId, setTeamInviteRequestId] = useState(0);
  const [eventDetailsById, setEventDetailsById] = useState<Record<string, EventDraft>>(seededEventDetails);
  const [eventSummariesById, setEventSummariesById] = useState<Record<string, EventSummary>>(seededEventSummaries);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<OrganizerNotification[]>(seededNotifications);

  const eventSummaries = useMemo(
    () => Object.values(eventSummariesById).sort((left, right) => left.title.localeCompare(right.title)),
    [eventSummariesById]
  );

  const searchResults = useMemo<GlobalSearchResult[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const eventMatches = eventSummaries
      .filter((eventSummary) =>
        [eventSummary.title, eventSummary.location, eventSummary.date].some((value) =>
          value.toLowerCase().includes(query)
        )
      )
      .map((eventSummary) => ({
        id: `event-${eventSummary.id}`,
        type: 'event' as const,
        label: eventSummary.title,
        meta: `${eventSummary.date} • ${eventSummary.location}`,
        eventId: eventSummary.id
      }));

    const orderMatches = searchOrderEntries
      .filter((entry) => [entry.label, entry.meta].some((value) => value.toLowerCase().includes(query)))
      .map((entry) => ({ ...entry, type: 'order' as const }));

    const attendeeMatches = searchAttendeeEntries
      .filter((entry) => [entry.label, entry.meta].some((value) => value.toLowerCase().includes(query)))
      .map((entry) => ({ ...entry, type: 'attendee' as const }));

    const teamMatches = searchTeamEntries
      .filter((entry) => [entry.label, entry.meta].some((value) => value.toLowerCase().includes(query)))
      .map((entry) => ({ ...entry, type: 'team' as const }));

    return [...eventMatches, ...orderMatches, ...attendeeMatches, ...teamMatches].slice(0, 8);
  }, [eventSummaries, searchQuery]);

  const addTeamEventOption = (eventName?: string) => {
    const normalizedEventName = eventName?.trim();
    if (!normalizedEventName) return;

    setTeamEventOptions((previousOptions) => (
      previousOptions.some((existing) => existing.toLowerCase() === normalizedEventName.toLowerCase())
        ? previousOptions
        : [...previousOptions, normalizedEventName]
    ));
  };

  const handleEventCreated = (eventId: string, eventData: EventDraft) => {
    setSelectedEventId(eventId);
    const resolvedEventName = eventData.title.trim() || 'Untitled Event';
    setSelectedEventName(resolvedEventName);
    setEventDetailsById((currentEventDetails) => ({
      ...currentEventDetails,
      [eventId]: {
        ...eventData,
        title: resolvedEventName
      }
    }));
    setEventSummariesById((currentSummaries) => ({
      ...currentSummaries,
      [eventId]: {
        id: eventId,
        title: resolvedEventName,
        date: formatDateLabel(eventData),
        location: eventData.location.trim() || 'Location not set',
        status: 'draft',
        ticketsSold: 0,
        totalTickets: 100,
        revenue: 0,
        image: eventData.mainImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop'
      }
    }));
    addTeamEventOption(resolvedEventName);
    setContextMode('event');
    setEventManagementTab('details');
    setCurrentView('event-management');
  };

  const handleEventSelect = (eventId: string, eventName?: string) => {
    const selectedEventDetails = eventDetailsById[eventId];
    const resolvedEventName = selectedEventDetails?.title || eventName || 'Selected Event';

    setSelectedEventId(eventId);
    setSelectedEventName(resolvedEventName);
    if (!selectedEventDetails) {
      setEventDetailsById((currentEventDetails) => ({
        ...currentEventDetails,
        [eventId]: createEmptyEventDraft({ title: resolvedEventName })
      }));
    }
    addTeamEventOption(resolvedEventName);
    setContextMode('event');
    setEventManagementTab('details');
    setCurrentView('event-management');
  };

  const handleEventDetailsUpdate = (eventId: string, updates: EventDraftUpdate) => {
    setEventDetailsById((currentEventDetails) => {
      const existingDetails = currentEventDetails[eventId] || createEmptyEventDraft({ title: selectedEventName || 'Selected Event' });
      const mergedDetails: EventDraft = {
        ...existingDetails,
        ...updates
      };
      mergedDetails.title = mergedDetails.title.trim() || 'Untitled Event';

      return {
        ...currentEventDetails,
        [eventId]: mergedDetails
      };
    });

    if (typeof updates.title === 'string') {
      const nextTitle = updates.title.trim() || 'Untitled Event';
      setSelectedEventName(nextTitle);
      addTeamEventOption(nextTitle);
    }

    setEventSummariesById((currentSummaries) => {
      const existingSummary = currentSummaries[eventId];
      if (!existingSummary) return currentSummaries;

      const nextDraft = {
        ...(eventDetailsById[eventId] || createEmptyEventDraft({ title: selectedEventName || existingSummary.title })),
        ...updates
      };

      return {
        ...currentSummaries,
        [eventId]: {
          ...existingSummary,
          title: nextDraft.title.trim() || existingSummary.title,
          date: formatDateLabel(nextDraft),
          location: nextDraft.location.trim() || 'Location not set',
          image: nextDraft.mainImage || existingSummary.image
        }
      };
    });
  };

  const handleEventStatusChange = (eventId: string, status: EventLifecycleStatus) => {
    setEventSummariesById((currentSummaries) => {
      const existingSummary = currentSummaries[eventId];
      if (!existingSummary) return currentSummaries;

      return {
        ...currentSummaries,
        [eventId]: {
          ...existingSummary,
          status
        }
      };
    });
  };

  const handleDuplicateEvent = (eventId: string) => {
    const sourceDetails = eventDetailsById[eventId];
    const sourceSummary = eventSummariesById[eventId];
    if (!sourceDetails || !sourceSummary) return;

    const duplicateId = `evt-${Date.now()}`;
    const duplicateTitle = `${sourceSummary.title} Copy`;
    const duplicateDetails: EventDraft = {
      ...sourceDetails,
      title: duplicateTitle
    };

    setEventDetailsById((currentDetails) => ({
      ...currentDetails,
      [duplicateId]: duplicateDetails
    }));
    setEventSummariesById((currentSummaries) => ({
      ...currentSummaries,
      [duplicateId]: {
        ...sourceSummary,
        id: duplicateId,
        title: duplicateTitle,
        status: 'draft'
      }
    }));
    addTeamEventOption(duplicateTitle);
  };

  const handleArchiveEvent = (eventId: string) => {
    handleEventStatusChange(eventId, 'archived');
  };

  const handleSearchResultSelect = (result: GlobalSearchResult) => {
    setSearchQuery('');

    if (result.type === 'event' && result.eventId) {
      handleEventSelect(result.eventId, result.label);
      return;
    }

    if (result.type === 'order' && result.eventId) {
      const resolvedEventName = eventSummariesById[result.eventId]?.title || result.label;
      setSelectedEventId(result.eventId);
      setSelectedEventName(resolvedEventName);
      setContextMode('event');
      setEventManagementTab('orders');
      setCurrentView('event-management');
      return;
    }

    if (result.type === 'attendee' && result.eventId) {
      const resolvedEventName = eventSummariesById[result.eventId]?.title || result.label;
      setSelectedEventId(result.eventId);
      setSelectedEventName(resolvedEventName);
      setContextMode('event');
      setEventManagementTab('checked-in');
      setCurrentView('event-management');
      return;
    }

    if (result.type === 'team') {
      setCurrentView('team');
      setContextMode('organization');
    }
  };

  const handleEventTabSelect = (tab: EventManagementTab) => {
    if (!selectedEventId) return;
    setEventManagementTab(tab);
    setContextMode('event');
    setCurrentView('event-management');
  };

  const handleBackToOrganization = () => {
    setContextMode('organization');
    setSelectedEventId(null);
    setSelectedEventName(null);
    setEventManagementTab('details');
    setCurrentView('dashboard');
  };

  const openNotificationTarget = (notification: OrganizerNotification) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((currentNotification) =>
        currentNotification.id === notification.id ? { ...currentNotification, read: true } : currentNotification
      )
    );

    const target = notification.target;
    if (!target) {
      setCurrentView('notification-center');
      setContextMode('organization');
      return;
    }

    if (target.kind === 'view') {
      setCurrentView(target.view);
      setContextMode('organization');
      return;
    }

    if (target.kind === 'settings') {
      setSettingsSection(target.section);
      setCurrentView('settings');
      setContextMode('organization');
      return;
    }

    const eventName = eventSummariesById[target.eventId]?.title || 'Selected Event';
    setSelectedEventId(target.eventId);
    setSelectedEventName(eventName);
    addTeamEventOption(eventName);
    setEventManagementTab(target.tab);
    setContextMode('event');
    setCurrentView('event-management');
  };

  const handleToggleNotificationRead = (notificationId: string) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((currentNotification) =>
        currentNotification.id === notificationId
          ? { ...currentNotification, read: !currentNotification.read }
          : currentNotification
      )
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((currentNotification) => ({ ...currentNotification, read: true }))
    );
  };

  const handleArchiveNotification = (notificationId: string) => {
    setNotifications((currentNotifications) =>
      currentNotifications.filter((currentNotification) => currentNotification.id !== notificationId)
    );
  };

  const handleOpenNotificationCenter = () => {
    setCurrentView('notification-center');
    setContextMode('organization');
  };

  const handleOpenNotificationPreferences = () => {
    setSettingsSection('notifications');
    setCurrentView('settings');
    setContextMode('organization');
  };

  return (
    <div className="app-shell flex h-screen">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        contextMode={contextMode}
        onBackToOrganization={handleBackToOrganization}
        selectedEventName={selectedEventName}
        activeEventTab={eventManagementTab}
        onEventTabSelect={handleEventTabSelect}
        activeSettingsSection={settingsSection}
        onSettingsSectionSelect={setSettingsSection}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          contextMode={contextMode}
          currentView={currentView}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          searchResults={searchResults}
          onSearchResultSelect={handleSearchResultSelect}
          notifications={notifications}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onNotificationOpen={openNotificationTarget}
          onOpenNotificationCenter={handleOpenNotificationCenter}
        />
        
        <main className="flex-1 overflow-y-auto" aria-live="polite">
          <Suspense
            fallback={(
              <div className="p-8">
                <ContentState isLoading emptyMessage="" loadingMessage="Loading..." className="py-16">
                  <div />
                </ContentState>
              </div>
            )}
          >
            {currentView === 'dashboard' && (
              <Dashboard
                firstName={currentUserFirstName}
                events={eventSummaries}
                onCreateEvent={() => setCurrentView('create-event')}
                onEventSelect={handleEventSelect}
                onViewTeam={() => setCurrentView('team')}
                onInviteTeamMember={() => {
                  setTeamInviteRequestId((current) => current + 1);
                  setContextMode('organization');
                  setCurrentView('team');
                }}
                onViewActivity={handleOpenNotificationCenter}
                onDuplicateEvent={handleDuplicateEvent}
                onArchiveEvent={handleArchiveEvent}
                onUpdateEventStatus={handleEventStatusChange}
              />
            )}
            {currentView === 'create-event' && (
              <EventCreation onEventCreated={handleEventCreated} />
            )}
            {currentView === 'event-management' && selectedEventId && (
              <EventManagement
                eventId={selectedEventId}
                eventName={selectedEventName}
                eventDetails={eventDetailsById[selectedEventId]}
                eventStatus={eventSummariesById[selectedEventId]?.status}
                onUpdateEventDetails={(updates) => handleEventDetailsUpdate(selectedEventId, updates)}
                onUpdateEventStatus={(status) => handleEventStatusChange(selectedEventId, status)}
                onDuplicateEvent={() => handleDuplicateEvent(selectedEventId)}
                activeTab={eventManagementTab}
                onTabChange={setEventManagementTab}
              />
            )}
            {currentView === 'event-management' && !selectedEventId && (
              <div className="p-8">
                <ContentState
                  isEmpty
                  emptyMessage="No event is currently selected."
                  className="py-20"
                >
                  <div />
                </ContentState>
              </div>
            )}
            {currentView === 'analytics' && (
              <Analytics selectedEventId={selectedEventId} selectedEventName={selectedEventName} />
            )}
            {currentView === 'team' && (
              <TeamManagement eventOptions={teamEventOptions} inviteRequestId={teamInviteRequestId} />
            )}
            {currentView === 'finance' && (
              <Finance />
            )}
            {currentView === 'notification-center' && (
              <NotificationCenter
                notifications={notifications}
                onMarkAllRead={handleMarkAllNotificationsRead}
                onToggleRead={handleToggleNotificationRead}
                onArchive={handleArchiveNotification}
                onOpenNotification={openNotificationTarget}
                onOpenPreferences={handleOpenNotificationPreferences}
              />
            )}
            {currentView === 'settings' && (
              <SettingsPage section={settingsSection} />
            )}
            {currentView === 'help' && (
              <HelpCenter />
            )}
          </Suspense>
        </main>
      </div>
      <GlobalAIChat
        currentView={currentView}
        contextMode={contextMode}
        selectedEventName={selectedEventName}
      />
    </div>
  );
}
