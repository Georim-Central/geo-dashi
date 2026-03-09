import { Plus, Calendar, MapPin, Users, DollarSign, TrendingUp, MoreVertical, ArrowRight, Ticket } from 'lucide-react';

interface DashboardProps {
  onCreateEvent: () => void;
  onEventSelect: (eventId: string, eventName?: string) => void;
}

// Mock data
const mockEvents = [
  {
    id: '1',
    title: 'Summer Music Festival 2026',
    date: 'June 15, 2026',
    location: 'Central Park, New York',
    status: 'Published',
    ticketsSold: 847,
    totalTickets: 1000,
    revenue: 25410,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Tech Conference 2026',
    date: 'July 22-24, 2026',
    location: 'Online Event',
    status: 'Draft',
    ticketsSold: 234,
    totalTickets: 500,
    revenue: 11700,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    title: 'Food & Wine Expo',
    date: 'August 10, 2026',
    location: 'Downtown Convention Center',
    status: 'Published',
    ticketsSold: 512,
    totalTickets: 800,
    revenue: 15360,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    title: 'Georim Founders Circle',
    date: 'September 3, 2026',
    location: 'Private Rooftop Venue, Chicago',
    status: 'Private',
    ticketsSold: 64,
    totalTickets: 120,
    revenue: 9600,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop'
  }
];

const stats = [
  { label: 'Total Events', value: '12', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Total Attendees', value: '2.4K', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Total Revenue', value: '$89.2K', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Avg. Growth', value: '+23%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' }
];

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
    amount: '+$240'
  },
  {
    event: 'Summer Music Festival 2026',
    action: 'Ticket update',
    detail: 'Early Bird tickets 80% sold',
    time: '12 min ago'
  },
  {
    event: 'Tech Conference 2026',
    action: 'Marketing milestone',
    detail: 'Reached 10K impressions on Georim',
    time: '1 hour ago'
  },
  {
    event: 'Summer Music Festival 2026',
    action: 'Registration milestone',
    detail: 'Passed 1,000 attendees',
    time: '2 hours ago'
  },
  {
    event: 'Food & Wine Expo',
    action: 'Email campaign sent',
    detail: 'Event reminder - 94% delivery rate',
    time: '3 hours ago'
  }
];

export function Dashboard({ onCreateEvent, onEventSelect }: DashboardProps) {
  return (
    <div className="p-8 motion-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 motion-row">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all your events</p>
        </div>
        <button
          onClick={onCreateEvent}
          className="flex items-center gap-2 bg-[#7626c6] text-white btn-glass px-6 py-3 rounded-lg hover:bg-[#5f1fa3] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 motion-stagger">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Platform Activity Summary */}
      <div className="mb-8 motion-row">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Platform Activity</h2>
          <span className="text-sm text-gray-600">Live updates across all events</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 motion-stagger">
          {platformActivity.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`${activity.bg} ${activity.color} p-2.5 rounded-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-700">{activity.title}</h3>
                      <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{activity.value}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">{activity.description}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.badge === 'Action Needed'
                      ? 'bg-red-100 text-red-700'
                      : activity.badge === 'Live'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {activity.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Events + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 motion-row">
        {/* Events List - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Events</h2>
            </div>

            <div className="divide-y divide-gray-200 motion-stagger">
              {mockEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onEventSelect(event.id, event.title)}
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
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              event.status === 'Published'
                                ? 'bg-green-100 text-green-700'
                                : event.status === 'Private'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {event.status}
                          </span>
                          <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
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
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#7626c6]"
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed - Takes 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>

            <div className="divide-y divide-gray-200 motion-stagger">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#7626c6] rounded-full mt-2 flex-shrink-0"></div>
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
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <button className="text-sm text-[#7626c6] hover:text-[#5f1fa3] font-medium flex items-center gap-1">
                View all activity
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
