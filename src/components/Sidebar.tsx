import {
  Home,
  Calendar,
  BarChart3,
  Users,
  ArrowLeft,
  Ticket,
  CreditCard,
  Mail,
  Settings,
  DollarSign,
  MessageCircle,
  Repeat,
  Download,
  QrCode,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ComponentType, useEffect, useState } from 'react';

type EventTab = 'details' | 'ticketing' | 'orders' | 'checked-in' | 'marketing' | 'reports' | 'settings';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  contextMode: 'organization' | 'event';
  onBackToOrganization: () => void;
  selectedEventName?: string | null;
  activeEventTab: EventTab;
  onEventTabSelect: (tab: EventTab) => void;
}

type NavItem = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
  active: boolean;
};

export function Sidebar({
  currentView,
  onViewChange,
  contextMode,
  onBackToOrganization,
  selectedEventName,
  activeEventTab,
  onEventTabSelect,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogoClick = () => {
    if (contextMode === 'event') {
      onBackToOrganization();
      return;
    }
    onViewChange('dashboard');
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '5rem' : '16rem');
  }, [isCollapsed]);

  const organizationItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      onClick: () => onViewChange('dashboard'),
      active: currentView === 'dashboard',
    },
    {
      id: 'create-event',
      label: 'Create Event',
      icon: Calendar,
      onClick: () => onViewChange('create-event'),
      active: currentView === 'create-event',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      onClick: () => onViewChange('analytics'),
      active: currentView === 'analytics',
    },
    {
      id: 'team',
      label: 'Team',
      icon: Users,
      onClick: () => onViewChange('team'),
      active: currentView === 'team',
    },
  ];

  const eventItems: NavItem[] = [
    {
      id: 'details',
      label: 'Event Details',
      icon: Calendar,
      onClick: () => onEventTabSelect('details'),
      active: currentView === 'event-management' && activeEventTab === 'details',
    },
    {
      id: 'ticketing',
      label: 'Ticketing',
      icon: Ticket,
      onClick: () => onEventTabSelect('ticketing'),
      active: currentView === 'event-management' && activeEventTab === 'ticketing',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: CreditCard,
      onClick: () => onEventTabSelect('orders'),
      active: currentView === 'event-management' && activeEventTab === 'orders',
    },
    {
      id: 'checked-in',
      label: 'Checked-In',
      icon: QrCode,
      onClick: () => onEventTabSelect('checked-in'),
      active: currentView === 'event-management' && activeEventTab === 'checked-in',
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: Mail,
      onClick: () => onEventTabSelect('marketing'),
      active: currentView === 'event-management' && activeEventTab === 'marketing',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      onClick: () => onEventTabSelect('reports'),
      active: currentView === 'event-management' && activeEventTab === 'reports',
    },
    {
      id: 'event-settings',
      label: 'Settings',
      icon: Settings,
      onClick: () => onEventTabSelect('settings'),
      active: currentView === 'event-management' && activeEventTab === 'settings',
    },
  ];

  const eventUtilityItems: NavItem[] = [
    {
      id: 'team',
      label: 'Team',
      icon: Users,
      onClick: () => onViewChange('team'),
      active: currentView === 'team',
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: DollarSign,
      onClick: () => onViewChange('finance'),
      active: currentView === 'finance',
    },
  ];

  const generalItems: NavItem[] = [
    {
      id: 'profile-settings',
      label: 'Settings',
      icon: Settings,
      onClick: () => onViewChange('profile'),
      active: currentView === 'profile',
    },
    {
      id: 'help',
      label: 'Help',
      icon: MessageCircle,
      onClick: () => console.log('[Sidebar] Help clicked'),
      active: false,
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: Repeat,
      onClick: () => {
        console.log('[Sidebar] Logout clicked');
        onBackToOrganization();
      },
      active: false,
    },
  ];

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    return (
      <button
        type="button"
        key={item.id}
        onClick={item.onClick}
        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
          item.active ? 'bg-[#7626c6] text-white btn-glass' : 'text-gray-300 hover:bg-white/10'
        }`}
        title={isCollapsed ? item.label : ''}
        aria-current={item.active ? 'page' : undefined}
      >
        <Icon className="w-5 h-5" />
        {!isCollapsed && <span>{item.label}</span>}
      </button>
    );
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#05031B] text-white flex flex-col transition-all duration-300 relative`}>
      <button
        type="button"
        onClick={handleLogoClick}
        className="p-4 border-b border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
        title="Go to dashboard"
      >
        <img
          src={isCollapsed ? '/images/collasible logo.svg' : '/images/logo.svg'}
          alt="Georim logo"
          className={isCollapsed ? 'h-11 w-11 object-contain' : 'h-10 w-full max-w-[172px] object-contain'}
        />
      </button>

      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-[#7626c6] text-white btn-glass p-1.5 rounded-full hover:bg-[#5f1fa3] transition-colors z-10 shadow-lg"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <nav className="flex-1 p-4 overflow-y-auto" aria-label="Primary">
        {contextMode === 'organization' ? (
          <div className="space-y-2">
            {!isCollapsed && <div className="text-xs uppercase tracking-wide text-gray-400 px-4 py-2">Organization</div>}
            {organizationItems.map(renderNavItem)}
            {!isCollapsed && <div className="text-xs uppercase tracking-wide text-gray-400 px-4 pt-4 py-2">General</div>}
            {generalItems.map(renderNavItem)}
          </div>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={onBackToOrganization}
              className="w-full flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              {!isCollapsed && <span className="text-sm">Back to Organization</span>}
            </button>

            {!isCollapsed && (
              <>
                <div className="text-xs uppercase tracking-wide text-gray-400 px-4 py-2">Event Management</div>
                <div className="text-sm text-gray-400 px-4 py-1 mb-4">{selectedEventName || 'Selected Event'}</div>
              </>
            )}

            {eventItems.map(renderNavItem)}
            {eventUtilityItems.map(renderNavItem)}
            {!isCollapsed && <div className="text-xs uppercase tracking-wide text-gray-400 px-4 pt-4 py-2">General</div>}
            {generalItems.map(renderNavItem)}
          </div>
        )}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl p-4 border border-white/10 bg-gradient-to-br from-[#24123f] via-[#150c29] to-[#1f0d3a] shadow-[0_12px_24px_rgba(5,3,27,0.35)]">
            <div className="text-white text-sm font-semibold leading-tight">Download our Mobile App</div>
            <p className="text-xs text-gray-300 mt-1">Get easy in another way</p>
            <button
              type="button"
              onClick={() => console.log('[Sidebar] Download app clicked')}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-[#7626c6] text-white btn-glass px-3 py-2 rounded-lg hover:bg-[#5f1fa3] transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-3">© 2026 Georim</div>
        </div>
      )}

      {isCollapsed && (
        <div className="p-3 border-t border-white/10">
          <button
            type="button"
            onClick={() => console.log('[Sidebar] Download app clicked')}
            className="w-full flex items-center justify-center p-3 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
            title="Download Mobile App"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
