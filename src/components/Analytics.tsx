import { useState } from 'react';
import { TrendingUp, Users, DollarSign, Ticket, Download, Calendar, Eye, MousePointer } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { downloadReportPdf } from '../utils/reportExport';
import { ContentState } from './ui/ContentState';

interface AnalyticsProps {
  selectedEventId: string | null;
  selectedEventName?: string | null;
}

export function Analytics({ selectedEventId, selectedEventName }: AnalyticsProps) {
  const isEventView = !!selectedEventId;
  const [selectedRange, setSelectedRange] = useState('Last 7 days');
  const eventDisplayName = selectedEventName?.trim() || 'Selected Event';
  const analyticsError: string | null = null;
  const isLoading = false;

  const handleExportReport = () => {
    const metricLines = (isEventView ? eventMetrics : orgMetrics).map(
      (metric) => `${metric.label}: ${metric.value} (${metric.change})`
    );

    if (isEventView) {
      const eventSlug = eventDisplayName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'event';
      downloadReportPdf({
        fileName: `${eventSlug}-analytics-report.pdf`,
        title: `${eventDisplayName} Analytics Report`,
        subtitle: `${eventDisplayName} performance overview.`,
        metadata: [`Range: ${selectedRange}`],
        sections: [
          { heading: 'KPI Summary', lines: metricLines },
          {
            heading: 'Daily Ticket Sales',
            lines: eventSalesData.map((row) => `${row.date}: ${row.tickets} tickets`)
          },
          {
            heading: 'Ticket Type Breakdown',
            lines: eventTicketTypes.map((ticket) => `${ticket.name}: ${ticket.sold} sold, ${ticket.remaining} remaining`)
          },
          {
            heading: 'Event Page Traffic',
            lines: eventTrafficData.map((traffic) => `${traffic.date}: ${traffic.views} views, ${traffic.clicks} ticket clicks`)
          },
          {
            heading: 'Top Attendee Cities',
            lines: eventGeographyData.cities.map((city) => `${city.name}: ${city.count} attendees (${city.percentage}%)`)
          }
        ]
      });
      return;
    }

    downloadReportPdf({
      fileName: 'organization-analytics-report.pdf',
      title: 'Organization Analytics Report',
      subtitle: 'Cross-event performance summary for your organization.',
      metadata: [`Range: ${selectedRange}`],
      sections: [
        { heading: 'KPI Summary', lines: metricLines },
        {
          heading: 'Revenue and Ticket Trend',
          lines: orgRevenueData.map((row) => `${row.month}: $${row.revenue.toLocaleString()} revenue, ${row.tickets} tickets`)
        },
        {
          heading: 'Top Events by Revenue ($K)',
          lines: orgEventsPerformance.map((event) => `${event.event}: $${event.revenue}K`)
        },
        {
          heading: 'Top Attendee Cities',
          lines: orgGeographyData.cities.map((city) => `${city.name}: ${city.count} attendees (${city.percentage}%)`)
        }
      ]
    });
  };

  return (
    <div className="min-h-full bg-gray-50 p-8" aria-busy={isLoading}>
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEventView ? 'Event Analytics' : 'Organization Analytics'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEventView 
              ? `Performance metrics for ${eventDisplayName}` 
              : 'Real-time insights across all your events'}
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedRange}
            onChange={(event) => setSelectedRange(event.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>All time</option>
          </select>
          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ContentState
          isLoading={isLoading}
          error={analyticsError}
          isEmpty={(isEventView ? eventMetrics : orgMetrics).length === 0}
          emptyMessage="No metrics available."
          className="col-span-full py-14"
        >
          {(isEventView ? eventMetrics : orgMetrics).map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`${metric.bg} ${metric.color} p-3 rounded-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                    {metric.change}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              </div>
            );
          })}
        </ContentState>
      </div>

      {isEventView ? (
        // EVENT-SPECIFIC ANALYTICS
        <>
          {/* Ticket Sales Over Time */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Ticket Sales Performance</h2>
                <p className="text-sm text-gray-600 mt-1">Daily ticket sales and revenue trends</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="px-3 py-1.5 bg-[#7626c6] text-white btn-glass rounded-lg text-sm font-medium">
                  Sales
                </button>
                <button type="button" className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Revenue
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={eventSalesData}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7626c6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7626c6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" style={{ fontSize: '12px' }} />
                <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tickets" 
                  stroke="#7626c6" 
                  strokeWidth={2}
                  fill="url(#colorTickets)"
                  name="Tickets Sold"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Event-Specific Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Ticket Type Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Sales by Ticket Type</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={eventTicketTypes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Bar dataKey="sold" fill="#7626c6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="remaining" fill="#e5e7eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Page Views & Engagement */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Event Page Traffic</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={eventTrafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#666" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#7626c6" strokeWidth={2} name="Page Views" />
                  <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} name="Ticket Clicks" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendee Geography - Event Specific */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Attendee Geography</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Top Cities</h3>
                <div className="space-y-3">
                  <ContentState
                    isLoading={isLoading}
                    error={analyticsError}
                    isEmpty={eventGeographyData.cities.length === 0}
                    emptyMessage="No city data available."
                    className="py-8"
                  >
                    {eventGeographyData.cities.map((city, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{city.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#7626c6]"
                            style={{ width: `${city.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-16 text-right">
                          {city.count} ({city.percentage}%)
                        </span>
                      </div>
                    </div>
                    ))}
                  </ContentState>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Top States</h3>
                <div className="space-y-3">
                  <ContentState
                    isLoading={isLoading}
                    error={analyticsError}
                    isEmpty={eventGeographyData.states.length === 0}
                    emptyMessage="No state data available."
                    className="py-8"
                  >
                    {eventGeographyData.states.map((state, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{state.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${state.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-16 text-right">
                          {state.count} ({state.percentage}%)
                        </span>
                      </div>
                    </div>
                    ))}
                  </ContentState>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // ORGANIZATION-LEVEL ANALYTICS
        <>
          {/* Revenue & Ticket Sales Trend */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Revenue & Sales Overview</h2>
                <p className="text-sm text-gray-600 mt-1">Performance across all events</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="px-3 py-1.5 bg-[#7626c6] text-white btn-glass rounded-lg text-sm font-medium">
                  Both
                </button>
                <button type="button" className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Revenue Only
                </button>
                <button type="button" className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Tickets Only
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={orgRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="left" stroke="#666" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#666" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#7626c6" 
                  strokeWidth={3}
                  name="Revenue ($)"
                  dot={{ fill: '#7626c6', r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="tickets" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Tickets Sold"
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Organization Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Events Performance */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Events Performance</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={orgEventsPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="event" stroke="#666" style={{ fontSize: '11px' }} angle={-15} textAnchor="end" height={80} />
                  <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Bar dataKey="revenue" fill="#7626c6" radius={[8, 8, 0, 0]} name="Revenue ($K)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Active vs Past Events */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Event Status Distribution</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={orgEventStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="active" stackId="1" stroke="#10b981" fill="#10b981" name="Active Events" />
                  <Area type="monotone" dataKey="completed" stackId="1" stroke="#7626c6" fill="#7626c6" name="Completed Events" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Organization-wide Attendee Geography */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Attendee Geography (All Events)</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Top Cities</h3>
                <div className="space-y-3">
                  <ContentState
                    isLoading={isLoading}
                    error={analyticsError}
                    isEmpty={orgGeographyData.cities.length === 0}
                    emptyMessage="No city data available."
                    className="py-8"
                  >
                    {orgGeographyData.cities.map((city, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{city.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#7626c6]"
                            style={{ width: `${city.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-16 text-right">
                          {city.count} ({city.percentage}%)
                        </span>
                      </div>
                    </div>
                    ))}
                  </ContentState>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Top States</h3>
                <div className="space-y-3">
                  <ContentState
                    isLoading={isLoading}
                    error={analyticsError}
                    isEmpty={orgGeographyData.states.length === 0}
                    emptyMessage="No state data available."
                    className="py-8"
                  >
                    {orgGeographyData.states.map((state, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{state.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${state.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-16 text-right">
                          {state.count} ({state.percentage}%)
                        </span>
                      </div>
                    </div>
                    ))}
                  </ContentState>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
}

// ORGANIZATION METRICS
const orgMetrics = [
  { label: 'Total Revenue', value: '$124,560', change: '+23%', trend: 'up', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Total Tickets Sold', value: '4,328', change: '+18%', trend: 'up', icon: Ticket, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Events', value: '12', change: '+3', trend: 'up', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Total Attendees', value: '5,847', change: '+15%', trend: 'up', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' }
];

// EVENT METRICS
const eventMetrics = [
  { label: 'Event Revenue', value: '$28,450', change: '+23%', trend: 'up', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Tickets Sold', value: '847', change: '+18%', trend: 'up', icon: Ticket, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Page Views', value: '14.2K', change: '+31%', trend: 'up', icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Conversion Rate', value: '6.8%', change: '+2.1%', trend: 'up', icon: MousePointer, color: 'text-orange-600', bg: 'bg-orange-50' }
];

// ORGANIZATION DATA
const orgRevenueData = [
  { month: 'Jul', revenue: 18500, tickets: 425 },
  { month: 'Aug', revenue: 22300, tickets: 512 },
  { month: 'Sep', revenue: 19800, tickets: 468 },
  { month: 'Oct', revenue: 26500, tickets: 623 },
  { month: 'Nov', revenue: 31200, tickets: 745 },
  { month: 'Dec', revenue: 28900, tickets: 687 },
  { month: 'Jan', revenue: 35400, tickets: 834 },
  { month: 'Feb', revenue: 42100, tickets: 982 }
];

const orgEventsPerformance = [
  { event: 'Summer Fest', revenue: 28.5 },
  { event: 'Tech Conf', revenue: 42.3 },
  { event: 'Food Expo', revenue: 18.7 },
  { event: 'Art Gallery', revenue: 12.4 },
  { event: 'Music Night', revenue: 22.7 }
];

const orgEventStatusData = [
  { month: 'Jul', active: 8, completed: 3 },
  { month: 'Aug', active: 10, completed: 5 },
  { month: 'Sep', active: 9, completed: 7 },
  { month: 'Oct', active: 11, completed: 6 },
  { month: 'Nov', active: 13, completed: 8 },
  { month: 'Dec', active: 12, completed: 10 },
  { month: 'Jan', active: 12, completed: 12 },
  { month: 'Feb', active: 14, completed: 11 }
];

const orgGeographyData = {
  cities: [
    { name: 'New York, NY', percentage: 28, count: 1637 },
    { name: 'Los Angeles, CA', percentage: 22, count: 1286 },
    { name: 'Chicago, IL', percentage: 18, count: 1052 },
    { name: 'Boston, MA', percentage: 16, count: 935 },
    { name: 'Philadelphia, PA', percentage: 16, count: 937 }
  ],
  states: [
    { name: 'New York', percentage: 35, count: 2047 },
    { name: 'California', percentage: 28, count: 1637 },
    { name: 'Illinois', percentage: 20, count: 1169 },
    { name: 'Massachusetts', percentage: 10, count: 585 },
    { name: 'Pennsylvania', percentage: 7, count: 409 }
  ]
};

// EVENT-SPECIFIC DATA
const eventSalesData = [
  { date: 'Jan 1', tickets: 45 },
  { date: 'Jan 2', tickets: 32 },
  { date: 'Jan 3', tickets: 58 },
  { date: 'Jan 4', tickets: 51 },
  { date: 'Jan 5', tickets: 72 },
  { date: 'Jan 6', tickets: 68 },
  { date: 'Jan 7', tickets: 83 },
  { date: 'Jan 8', tickets: 95 },
  { date: 'Jan 9', tickets: 89 },
  { date: 'Jan 10', tickets: 103 },
  { date: 'Jan 11', tickets: 112 },
  { date: 'Jan 12', tickets: 98 }
];

const eventTicketTypes = [
  { name: 'Early Bird', sold: 387, remaining: 113 },
  { name: 'VIP', sold: 78, remaining: 22 },
  { name: 'Student', sold: 134, remaining: 66 },
  { name: 'Group', sold: 248, remaining: 52 }
];

const eventTrafficData = [
  { date: 'Jan 5', views: 1240, clicks: 184 },
  { date: 'Jan 6', views: 1580, clicks: 223 },
  { date: 'Jan 7', views: 1820, clicks: 267 },
  { date: 'Jan 8', views: 2140, clicks: 312 },
  { date: 'Jan 9', views: 1950, clicks: 289 },
  { date: 'Jan 10', views: 2380, clicks: 358 },
  { date: 'Jan 11', views: 2620, clicks: 401 }
];

const eventGeographyData = {
  cities: [
    { name: 'New York, NY', percentage: 34, count: 288 },
    { name: 'Brooklyn, NY', percentage: 22, count: 186 },
    { name: 'Newark, NJ', percentage: 18, count: 152 },
    { name: 'Stamford, CT', percentage: 15, count: 127 },
    { name: 'White Plains, NY', percentage: 11, count: 94 }
  ],
  states: [
    { name: 'New York', percentage: 56, count: 474 },
    { name: 'New Jersey', percentage: 24, count: 203 },
    { name: 'Connecticut', percentage: 15, count: 127 },
    { name: 'Pennsylvania', percentage: 5, count: 43 }
  ]
};
