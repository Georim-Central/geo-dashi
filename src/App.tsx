import { Suspense, lazy, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';

const Dashboard = lazy(() => import('./components/Dashboard').then((module) => ({ default: module.Dashboard })));
const EventCreation = lazy(() => import('./components/EventCreation').then((module) => ({ default: module.EventCreation })));
const EventManagement = lazy(() => import('./components/EventManagement').then((module) => ({ default: module.EventManagement })));
const Analytics = lazy(() => import('./components/Analytics').then((module) => ({ default: module.Analytics })));
const TeamManagement = lazy(() => import('./components/TeamManagement').then((module) => ({ default: module.TeamManagement })));
const Finance = lazy(() => import('./components/Finance').then((module) => ({ default: module.Finance })));
const ProfileSettings = lazy(() => import('./components/ProfileSettings').then((module) => ({ default: module.ProfileSettings })));

type View = 'dashboard' | 'create-event' | 'event-management' | 'analytics' | 'team' | 'finance' | 'profile';
type EventManagementTab = 'details' | 'ticketing' | 'orders' | 'checked-in' | 'marketing' | 'reports' | 'settings';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventName, setSelectedEventName] = useState<string | null>(null);
  const [contextMode, setContextMode] = useState<'organization' | 'event'>('organization');
  const [eventManagementTab, setEventManagementTab] = useState<EventManagementTab>('details');

  const handleEventCreated = (eventId: string, eventName?: string) => {
    setSelectedEventId(eventId);
    setSelectedEventName(eventName || 'Untitled Event');
    setContextMode('event');
    setEventManagementTab('details');
    setCurrentView('event-management');
  };

  const handleEventSelect = (eventId: string, eventName?: string) => {
    setSelectedEventId(eventId);
    setSelectedEventName(eventName || 'Selected Event');
    setContextMode('event');
    setEventManagementTab('details');
    setCurrentView('event-management');
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
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          contextMode={contextMode}
          onOpenProfile={() => setCurrentView('profile')}
        />
        
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<div className="p-8 text-sm text-gray-500">Loading...</div>}>
            {currentView === 'dashboard' && (
              <Dashboard
                onCreateEvent={() => setCurrentView('create-event')}
                onEventSelect={handleEventSelect}
              />
            )}
            {currentView === 'create-event' && (
              <EventCreation onEventCreated={handleEventCreated} />
            )}
          {currentView === 'event-management' && selectedEventId && (
            <EventManagement
              eventId={selectedEventId}
              eventName={selectedEventName}
              activeTab={eventManagementTab}
              onTabChange={setEventManagementTab}
            />
          )}
            {currentView === 'analytics' && (
              <Analytics selectedEventId={selectedEventId} selectedEventName={selectedEventName} />
            )}
            {currentView === 'team' && (
              <TeamManagement />
            )}
            {currentView === 'finance' && (
              <Finance />
            )}
            {currentView === 'profile' && (
              <ProfileSettings />
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
