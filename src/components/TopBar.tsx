import { Search, Bell, User } from 'lucide-react';
import { useState } from 'react';
import { useModalA11y } from '../hooks/useModalA11y';
import { AppView, GlobalSearchResult } from '../types/navigation';
import { OrganizerNotification } from '../types/notifications';

interface TopBarProps {
  contextMode: 'organization' | 'event';
  currentView: AppView;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  searchResults: GlobalSearchResult[];
  onSearchResultSelect: (result: GlobalSearchResult) => void;
  notifications: OrganizerNotification[];
  onMarkAllNotificationsRead: () => void;
  onNotificationOpen: (notification: OrganizerNotification) => void;
  onOpenNotificationCenter: () => void;
  onOpenProfileSettings: () => void;
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
  searchQuery,
  onSearchQueryChange,
  searchResults,
  onSearchResultSelect,
  notifications,
  onMarkAllNotificationsRead,
  onNotificationOpen,
  onOpenNotificationCenter,
  onOpenProfileSettings
}: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const {
    dialogRef: notificationsRef,
    titleId: notificationsTitleId,
    descriptionId: notificationsDescriptionId
  } = useModalA11y({
    isOpen: showNotifications,
    onClose: () => setShowNotifications(false)
  });

  const showSearchResults = searchQuery.trim().length > 0;

  return (
    <div className="glass-header sticky top-0 z-20 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="ui-search-field flex-1">
            <Search className="ui-search-field__icon" />
            <input
              type="text"
              aria-label="Search events, orders, attendees, and team"
              placeholder="Search events, orders, attendees..."
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              className="ui-search-field__input ui-toolbar-select h-12 w-96 rounded-2xl border border-gray-200 bg-white/90 pr-4 text-sm text-gray-700 shadow-sm"
              style={{ paddingLeft: '44px' }}
            />

            {showSearchResults && (
              <div className="ui-menu-panel absolute left-0 top-[calc(100%+12px)] z-20 w-[28rem] overflow-hidden">
                <div className="border-b border-gray-200 px-5 py-4">
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
                        className="flex min-h-12 w-full items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 text-left transition hover:bg-gray-50"
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
                  <div className="px-5 py-8 text-sm text-gray-500">No organizer results matched “{searchQuery.trim()}”.</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="inline-flex h-10 items-center rounded-full border border-gray-200 bg-white/80 px-4 text-sm font-medium text-gray-600 shadow-sm">
            {contextMode === 'organization' ? 'Organization View' : 'Event View'}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
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
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />

                <div
                  id="notifications-panel"
                  ref={notificationsRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={notificationsTitleId}
                  aria-describedby={notificationsDescriptionId}
                  tabIndex={-1}
                  className="ui-menu-panel absolute right-0 z-20 mt-3 flex max-h-[500px] w-96 flex-col motion-pop"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
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

          <button
            type="button"
            onClick={onOpenProfileSettings}
            className="flex items-center gap-3 rounded-full border border-transparent bg-white/70 px-3 py-2 text-left shadow-sm transition hover:border-gray-200 hover:bg-white"
            aria-label="Open profile settings"
          >
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#7626c6]">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">John Doe</span>
          </button>
        </div>
      </div>
    </div>
  );
}
