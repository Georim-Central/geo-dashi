import { Search, Bell, User } from 'lucide-react';
import { useState } from 'react';
import { useModalA11y } from '../hooks/useModalA11y';

interface TopBarProps {
  contextMode: 'organization' | 'event';
  onOpenProfile: () => void;
}

export function TopBar({ contextMode, onOpenProfile }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', message: 'New order: 2x VIP tickets ($240)', time: '5m ago', read: false },
    { id: 2, type: 'ticket', message: 'Early Bird tickets 80% sold', time: '12m ago', read: false },
    { id: 3, type: 'milestone', message: 'Event passed 1,000 attendees', time: '1h ago', read: false },
    { id: 4, type: 'marketing', message: 'Email campaign: 94% delivery rate', time: '2h ago', read: true },
    { id: 5, type: 'order', message: 'Refund request for Order #1234', time: '3h ago', read: true }
  ]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const {
    dialogRef: notificationsRef,
    titleId: notificationsTitleId,
    descriptionId: notificationsDescriptionId
  } = useModalA11y({
    isOpen: showNotifications,
    onClose: () => setShowNotifications(false)
  });

  const markAllAsRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  return (
    <div className="glass-header sticky top-0 z-20 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, orders, attendees..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-96 focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
            {contextMode === 'organization' ? 'Organization View' : 'Event View'}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
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
                  className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 max-h-[500px] flex flex-col motion-pop"
                >
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 id={notificationsTitleId} className="font-semibold text-gray-900">Notifications</h3>
                      <p id={notificationsDescriptionId} className="sr-only">
                        Notification updates and activity list
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-sm text-[#7626c6] hover:text-[#5f1fa3] font-medium"
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
                            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                              !notification.read ? 'bg-blue-50/50' : ''
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
                                      notification.type === 'order'
                                        ? 'bg-green-100 text-green-700'
                                        : notification.type === 'ticket'
                                        ? 'bg-blue-100 text-blue-700'
                                        : notification.type === 'milestone'
                                        ? 'bg-red-100 text-red-700'
                                        : notification.type === 'marketing'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-orange-100 text-orange-700'
                                    }`}
                                  >
                                    {notification.type}
                                  </span>
                                  <span className="text-xs text-gray-500">{notification.time}</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button type="button" className="text-sm text-[#7626c6] hover:text-[#5f1fa3] font-medium w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="w-8 h-8 bg-[#7626c6] rounded-full flex items-center justify-center overflow-hidden">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">John Doe</span>
          </button>
        </div>
      </div>
    </div>
  );
}
