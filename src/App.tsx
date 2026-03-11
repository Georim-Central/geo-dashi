import { Suspense, lazy, useState } from 'react';
import { GlobalAIChat } from './components/GlobalAIChat';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ContentState } from './components/ui/ContentState';
import { AppView, EventManagementTab, ProfileSection } from './types/navigation';
import { EventDraft, EventDraftUpdate } from './types/event';

const Dashboard = lazy(() => import('./components/Dashboard').then((module) => ({ default: module.Dashboard })));
const EventCreation = lazy(() => import('./components/EventCreation').then((module) => ({ default: module.EventCreation })));
const EventManagement = lazy(() => import('./components/EventManagement').then((module) => ({ default: module.EventManagement })));
const Analytics = lazy(() => import('./components/Analytics').then((module) => ({ default: module.Analytics })));
const TeamManagement = lazy(() => import('./components/TeamManagement').then((module) => ({ default: module.TeamManagement })));
const Finance = lazy(() => import('./components/Finance').then((module) => ({ default: module.Finance })));
const ProfileSettings = lazy(() => import('./components/ProfileSettings').then((module) => ({ default: module.ProfileSettings })));
const HelpCenter = lazy(() => import('./components/HelpCenter').then((module) => ({ default: module.HelpCenter })));

const defaultTeamEventOptions = [
  'Summer Music Festival 2026',
  'Tech Conference 2026',
  'Food & Wine Expo',
  'Georim Founders Circle'
];

const profileSections: ProfileSection[] = [
  'profile',
  'security',
  'payments',
  'billing',
  'premium-subscriptions',
  'notifications'
];

const resolveInitialView = (): AppView => {
  if (typeof window === 'undefined') return 'dashboard';

  const requestedView = new URLSearchParams(window.location.search).get('view');
  return requestedView === 'profile' ? 'profile' : 'dashboard';
};

const resolveInitialProfileSection = (): ProfileSection => {
  if (typeof window === 'undefined') return 'profile';

  const requestedSection = new URLSearchParams(window.location.search).get('section');
  return profileSections.find((section) => section === requestedSection) ?? 'profile';
};

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

export default function App() {
  const currentUserFirstName = 'John';
  const [currentView, setCurrentView] = useState<AppView>(resolveInitialView);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventName, setSelectedEventName] = useState<string | null>(null);
  const [contextMode, setContextMode] = useState<'organization' | 'event'>('organization');
  const [eventManagementTab, setEventManagementTab] = useState<EventManagementTab>('details');
  const [activeProfileSection, setActiveProfileSection] = useState<ProfileSection>(resolveInitialProfileSection);
  const [teamEventOptions, setTeamEventOptions] = useState<string[]>(defaultTeamEventOptions);
  const [eventDetailsById, setEventDetailsById] = useState<Record<string, EventDraft>>(seededEventDetails);

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
        activeProfileSection={activeProfileSection}
        onProfileSectionChange={setActiveProfileSection}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          contextMode={contextMode}
          onOpenProfile={() => {
            setActiveProfileSection('profile');
            setCurrentView('profile');
          }}
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
                onCreateEvent={() => setCurrentView('create-event')}
                onEventSelect={handleEventSelect}
                onViewTeam={() => setCurrentView('team')}
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
                onUpdateEventDetails={(updates) => handleEventDetailsUpdate(selectedEventId, updates)}
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
              <TeamManagement eventOptions={teamEventOptions} />
            )}
            {currentView === 'finance' && (
              <Finance />
            )}
            {currentView === 'profile' && (
              <ProfileSettings activeSection={activeProfileSection} />
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
