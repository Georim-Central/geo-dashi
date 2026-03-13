import { ArrowRightLeft, Bell, ChevronDown, CircleHelp, LogOut, Search, Settings, User, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useModalA11y } from '../hooks/useModalA11y';
import { AppView, GlobalSearchResult } from '../types/navigation';
import { OrganizerNotification } from '../types/notifications';

interface TopBarProps {
  contextMode: 'organization' | 'event';
  currentView: AppView;
  isShellScrolled: boolean;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  searchResults: GlobalSearchResult[];
  onSearchResultSelect: (result: GlobalSearchResult) => void;
  notifications: OrganizerNotification[];
  onMarkAllNotificationsRead: () => void;
  onNotificationOpen: (notification: OrganizerNotification) => void;
  onOpenNotificationCenter: () => void;
  onOpenHelpCenter: () => void;
  onOpenProfileSettings: () => void;
  onSwitchToAttending: () => void;
  onLogOut: () => void;
  onLogoClick: () => void;
}

function getSearchResultBadgeClass(type: GlobalSearchResult['type']) {
  if (type === 'event') return 'bg-[#f1e5fb] text-[#7626c6]';
  if (type === 'order') return 'bg-emerald-100 text-emerald-700';
  if (type === 'attendee') return 'bg-blue-100 text-blue-700';
  return 'bg-amber-100 text-amber-700';
}

export function TopBar({
  contextMode,
  currentView,
  isShellScrolled,
  searchQuery,
  onSearchQueryChange,
  searchResults,
  onSearchResultSelect,
  notifications,
  onMarkAllNotificationsRead,
  onNotificationOpen,
  onOpenNotificationCenter,
  onOpenHelpCenter,
  onOpenProfileSettings,
  onSwitchToAttending,
  onLogOut,
  onLogoClick
}: TopBarProps) {
  const profileName = 'John Doe';
  const profileEmail = 'john.doe@georim.com';
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const {
    dialogRef: notificationsRef,
    titleId: notificationsTitleId,
    descriptionId: notificationsDescriptionId
  } = useModalA11y({
    isOpen: showNotifications,
    onClose: () => setShowNotifications(false)
  });
  const {
    dialogRef: profileMenuRef
  } = useModalA11y({
    isOpen: showProfileMenu,
    onClose: () => setShowProfileMenu(false)
  });

  const showSearchResults = searchQuery.trim().length > 0;
  const profileMenuItems: Array<{
    id: string;
    label: string;
    icon: LucideIcon;
    onSelect: () => void;
    danger?: boolean;
  }> = [
    {
      id: 'switch-to-attending',
      label: 'Switch to attending',
      icon: ArrowRightLeft,
      onSelect: onSwitchToAttending,
    },
    {
      id: 'help-center',
      label: 'Help Center',
      icon: CircleHelp,
      onSelect: onOpenHelpCenter,
    },
    {
      id: 'account-settings',
      label: 'Account Settings',
      icon: Settings,
      onSelect: onOpenProfileSettings,
    },
    {
      id: 'logout',
      label: 'Log out',
      icon: LogOut,
      onSelect: onLogOut,
      danger: true,
    },
  ] as const;

  const handleProfileMenuToggle = () => {
    setShowNotifications(false);
    setShowProfileMenu((currentState) => !currentState);
  };

  const handleProfileMenuAction = (onSelect: () => void) => {
    onSelect();
    setShowProfileMenu(false);
  };

  return (
    <div
      className={`glass-header app-shell__topbar sticky top-0 z-40 flex-shrink-0 h-16 w-full ${
        isShellScrolled ? 'is-shell-scrolled' : ''
      }`}
      data-shell-scrolled={isShellScrolled ? 'true' : 'false'}
    >
      <div className="flex h-full items-center justify-between gap-4 pl-2 pr-4 sm:pl-3 sm:pr-6 lg:pl-4 lg:pr-8">
        <div className="min-w-0 flex items-center gap-3">
          <button
            type="button"
            onClick={onLogoClick}
            className={`app-shell__topbar-logo flex shrink-0 items-center justify-center ${
              isShellScrolled ? 'is-hidden' : ''
            }`}
            aria-label="Go to home"
            title="Go to home"
            aria-hidden={isShellScrolled}
            tabIndex={isShellScrolled ? -1 : undefined}
          >
            <img
              src="/images/logo.svg?v=20260313"
              alt="Georim logo"
              className="h-8 w-auto max-w-[148px] object-contain"
            />
          </button>

          <div className="relative w-96 max-w-full">
            <div className="ui-search-field relative z-10 flex-1">
              <Search className="ui-search-field__icon" />
              <input
                type="text"
                aria-label="Search events, orders, attendees, and team"
                placeholder="Search events, orders, attendees..."
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)}
                className="ui-search-field__input ui-toolbar-select h-12 w-full rounded-2xl border border-gray-200 bg-white/90 pr-4 text-sm text-gray-700 shadow-sm"
                style={{ paddingLeft: '44px' }}
              />
            </div>
            {showSearchResults && (
              <div
                className="ui-menu-panel search-results-container absolute left-0 z-50 mt-3 w-full overflow-hidden"
                style={{ top: '100%' }}
              >
                <div className="border-b border-gray-200 py-4">
                  <div className="ui-card-title">Search Results</div>
                  <div className="ui-meta-text mt-1">
                    Organizer view: {currentView === 'event-management' ? 'event operations' : currentView}
                  </div>
                </div>
                {searchResults.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => onSearchResultSelect(result)}
                        className="flex min-h-12 w-full items-start justify-between gap-3 border-b border-gray-100 py-4 text-left transition hover:bg-gray-50"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-gray-900">{result.label}</div>
                          <div className="mt-1 text-xs text-gray-500">{result.meta}</div>
                        </div>
                        <span className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getSearchResultBadgeClass(result.type)}`}>
                          {result.type}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-sm text-gray-500">No organizer results matched “{searchQuery.trim()}”.</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="inline-flex h-10 items-center rounded-full border border-gray-200 bg-white/80 px-4 text-sm font-medium text-gray-600 shadow-sm">
            {contextMode === 'organization' ? 'Organization View' : 'Event View'}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(false);
                setShowNotifications(!showNotifications);
              }}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-white/70 text-gray-600 shadow-sm hover:border-gray-200 hover:bg-white"
              aria-expanded={showNotifications}
              aria-controls="notifications-panel"
              aria-label="Open notifications"
            >
              <span className="notification-wrapper">
                <Bell className="bell-icon text-gray-600" />
                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </span>
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />

                <div
                  id="notifications-panel"
                  ref={notificationsRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={notificationsTitleId}
                  aria-describedby={notificationsDescriptionId}
                  tabIndex={-1}
                  className="ui-menu-panel absolute right-0 z-50 mt-3 flex max-h-[500px] w-96 flex-col motion-pop"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div>
                      <h3 id={notificationsTitleId} className="ui-card-title">Notifications</h3>
                      <p id={notificationsDescriptionId} className="sr-only">
                        Notification updates and activity list
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={onMarkAllNotificationsRead}
                        className="text-sm font-medium text-[#5f1fa3] hover:text-[#4d1c84]"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <button
                            key={notification.id}
                            type="button"
                            onClick={() => {
                              onNotificationOpen(notification);
                              setShowNotifications(false);
                            }}
                            className={`w-full cursor-pointer p-4 text-left transition-colors hover:bg-gray-50 ${
                              !notification.read ? 'bg-violet-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  !notification.read ? 'bg-[#7626c6]' : 'bg-gray-300'
                                }`}
                              ></div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm ${
                                    !notification.read ? 'font-medium text-gray-900' : 'text-gray-700'
                                  }`}
                                >
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                  className={`px-2 py-0.5 rounded text-xs ${
                                      notification.category === 'order'
                                        ? 'bg-green-100 text-green-700'
                                        : notification.category === 'ticket'
                                        ? 'bg-blue-100 text-blue-700'
                                        : notification.category === 'milestone'
                                        ? 'bg-red-100 text-red-700'
                                        : notification.category === 'marketing'
                                        ? 'bg-purple-100 text-purple-700'
                                        : notification.category === 'finance'
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'bg-sky-100 text-sky-700'
                                    }`}
                                  >
                                    {notification.category}
                                  </span>
                                  <span className="text-xs text-gray-500">{notification.timeLabel}</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 bg-gray-50/80 p-3">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenNotificationCenter();
                        setShowNotifications(false);
                      }}
                      className="w-full text-center text-sm font-medium text-[#5f1fa3] hover:text-[#4d1c84]"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={handleProfileMenuToggle}
              className="flex items-center gap-3 rounded-full border border-transparent bg-white/70 px-3 py-2 text-left shadow-sm transition hover:border-gray-200 hover:bg-white"
              aria-expanded={showProfileMenu}
              aria-controls="profile-menu-panel"
              aria-label="Open profile menu"
            >
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#7626c6]">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{profileName}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
            </button>

            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />

                <div
                  id="profile-menu-panel"
                  ref={profileMenuRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Profile menu"
                  tabIndex={-1}
                  className="ui-menu-panel absolute right-0 z-50 mt-3 overflow-hidden motion-pop"
                  style={{ width: '240px', maxWidth: 'calc(100vw - 1rem)' }}
                >
                  <div className="border-b border-gray-200 px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{profileName}</div>
                    <div className="text-xs text-gray-500">{profileEmail}</div>
                  </div>
                  <div className="p-2">
                    {profileMenuItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleProfileMenuAction(item.onSelect)}
                          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
                            item.danger
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${item.danger ? 'text-rose-500' : 'text-gray-400'}`} aria-hidden="true" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
