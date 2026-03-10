import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, Ticket, Mail, BarChart3, CreditCard, Download, Settings as SettingsIcon, QrCode, Search, Phone, CheckCircle } from 'lucide-react';
import { TicketingSection } from './event-management/TicketingSection';
import { OrdersSection } from './event-management/OrdersSection';
import { MarketingSection } from './event-management/MarketingSection';
import { downloadReportPdf } from '../utils/reportExport';
import { useModalA11y } from '../hooks/useModalA11y';

interface EventManagementProps {
  eventId: string;
  eventName?: string | null;
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

type Tab = 'details' | 'ticketing' | 'orders' | 'checked-in' | 'marketing' | 'reports' | 'settings';

type RegisteredAttendee = {
  attendeeId: string;
  name: string;
  email: string;
  ticketType: string;
  orderId: string;
};

type CheckInRecord = RegisteredAttendee & {
  checkedInAt: string;
  source: string;
  scanCode: string;
};

type ScanResult = {
  status: 'success' | 'warning' | 'error';
  message: string;
};

const registeredAttendees: RegisteredAttendee[] = [
  { attendeeId: 'ATT-3901', name: 'Sarah Johnson', email: 'sarah.j@email.com', ticketType: 'Early Bird GA', orderId: '5847239' },
  { attendeeId: 'ATT-4420', name: 'Michael Chen', email: 'mchen@email.com', ticketType: 'VIP Access', orderId: '5847238' },
  { attendeeId: 'ATT-2015', name: 'Emily Rodriguez', email: 'emily.r@email.com', ticketType: 'Student Discount', orderId: '5847237' },
  { attendeeId: 'ATT-3372', name: 'David Kim', email: 'davidk@email.com', ticketType: 'Early Bird GA', orderId: '5847236' },
  { attendeeId: 'ATT-1187', name: 'Jessica Brown', email: 'jbrown@email.com', ticketType: 'VIP Access', orderId: '5847235' }
];

const initialCheckInRecords: CheckInRecord[] = [
  {
    attendeeId: 'ATT-3901',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    ticketType: 'Early Bird GA',
    orderId: '5847239',
    checkedInAt: '2026-06-15T09:12:00.000Z',
    source: 'Main Gate - iPhone Scanner',
    scanCode: 'ATT-3901'
  }
];

export function EventManagement({ eventId, eventName, activeTab: requestedTab, onTabChange }: EventManagementProps) {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>(initialCheckInRecords);
  const resolvedEventName = eventName?.trim() || 'Selected Event';

  useEffect(() => {
    if (requestedTab) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  const handleAttendeeScan = useCallback((rawScanCode: string, source: string): ScanResult => {
    const normalizedCode = rawScanCode.trim().toUpperCase();
    if (!normalizedCode) {
      return { status: 'error', message: 'Please scan a valid QR code.' };
    }

    const attendee = registeredAttendees.find((candidate) => {
      const tokens = [candidate.attendeeId, candidate.orderId, `QR-${candidate.attendeeId}`];
      return tokens.some((token) => normalizedCode.includes(token.toUpperCase()));
    });

    if (!attendee) {
      return { status: 'error', message: 'No attendee found for this QR code.' };
    }

    let scanResult: ScanResult = { status: 'error', message: 'Unable to process scan.' };

    setCheckInRecords((current) => {
      const alreadyCheckedIn = current.some((record) => record.attendeeId === attendee.attendeeId);
      if (alreadyCheckedIn) {
        scanResult = { status: 'warning', message: `${attendee.name} is already checked in.` };
        return current;
      }

      const nextRecord: CheckInRecord = {
        ...attendee,
        checkedInAt: new Date().toISOString(),
        source,
        scanCode: rawScanCode.trim()
      };

      scanResult = { status: 'success', message: `${attendee.name} checked in successfully.` };
      console.log('[CheckIn] Attendee checked in', nextRecord);
      return [nextRecord, ...current];
    });

    return scanResult;
  }, []);

  useEffect(() => {
    const handleScannerEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ code?: string; source?: string }>;
      const scanCode = customEvent.detail?.code ?? '';
      const scanSource = customEvent.detail?.source ?? 'Mobile Scanner';
      if (!scanCode) return;
      handleAttendeeScan(scanCode, scanSource);
    };

    window.addEventListener('georim:attendee-scan', handleScannerEvent);
    return () => window.removeEventListener('georim:attendee-scan', handleScannerEvent);
  }, [handleAttendeeScan]);

  const tabs = [
    { id: 'details', label: 'Event Details', icon: Calendar },
    { id: 'ticketing', label: 'Ticketing', icon: Ticket },
    { id: 'orders', label: 'Orders', icon: CreditCard },
    { id: 'checked-in', label: 'Checked-In', icon: QrCode },
    { id: 'marketing', label: 'Marketing', icon: Mail },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <div className="min-h-full bg-gray-50">
      {/* Event Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{resolvedEventName}</h1>
              <p className="text-gray-600 mt-1">June 15, 2026 • Central Park, New York</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors">
                Publish
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 -mb-px overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => {
                    const nextTab = tab.id as Tab;
                    setActiveTab(nextTab);
                    onTabChange?.(nextTab);
                  }}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#7626c6] text-[#7626c6]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {activeTab === 'details' && <EventDetailsTab eventName={resolvedEventName} />}
        {activeTab === 'ticketing' && <TicketingSection />}
        {activeTab === 'orders' && <OrdersSection />}
        {activeTab === 'checked-in' && (
          <CheckedInTab
            records={checkInRecords}
            totalAttendees={registeredAttendees.length}
            onScan={handleAttendeeScan}
          />
        )}
        {activeTab === 'marketing' && <MarketingSection />}
        {activeTab === 'reports' && <ReportsTab eventName={resolvedEventName} />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

function CheckedInTab({
  records,
  totalAttendees,
  onScan
}: {
  records: CheckInRecord[];
  totalAttendees: number;
  onScan: (scanCode: string, source: string) => ScanResult;
}) {
  const [scanCode, setScanCode] = useState('');
  const [scanSource, setScanSource] = useState('Main Gate Scanner');
  const [searchQuery, setSearchQuery] = useState('');
  const [scanFeedback, setScanFeedback] = useState<ScanResult | null>(null);

  const pendingCount = Math.max(0, totalAttendees - records.length);
  const checkInRate = totalAttendees ? Math.min(100, Math.round((records.length / totalAttendees) * 100)) : 0;

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return records;
    return records.filter((record) =>
      [record.name, record.email, record.attendeeId, record.orderId, record.ticketType].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [records, searchQuery]);

  const handleSubmitScan = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = onScan(scanCode, scanSource);
    setScanFeedback(result);
    if (result.status === 'success') {
      setScanCode('');
    }
  };

  const simulatePhoneScan = () => {
    const uncheckedAttendees = registeredAttendees.filter((attendee) =>
      !records.some((record) => record.attendeeId === attendee.attendeeId)
    );
    if (uncheckedAttendees.length === 0) {
      setScanFeedback({ status: 'warning', message: 'All attendees are already checked in.' });
      return;
    }

    const nextAttendee = uncheckedAttendees[0];
    const result = onScan(nextAttendee.attendeeId, 'iPhone Scanner App');
    setScanFeedback(result);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[20px] border border-gray-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-6 md:p-7">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Checked-In Attendees</h2>
            <p className="text-sm text-gray-600 mt-1.5 max-w-2xl">
              Scan attendee QR codes from your phone or scanner device to log check-ins in real time.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap lg:justify-end lg:pr-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Live sync active
            </div>
            <button
              type="button"
              onClick={simulatePhoneScan}
              className="inline-flex h-12 items-center justify-center gap-2 px-6 bg-[#7626c6] text-white btn-glass rounded-xl hover:bg-[#5f1fa3] transition-colors text-sm font-medium"
            >
              <Phone className="w-4 h-4" />
              Simulate Scan
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmitScan} className="mt-6 rounded-2xl border border-gray-200 bg-[#fbfbfe] p-5 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-2">QR Code</label>
              <input
                value={scanCode}
                onChange={(event) => setScanCode(event.target.value)}
                placeholder="Scan or paste QR code (example: ATT-4420)"
                className="w-full h-12 px-4 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-2">Source Device</label>
              <input
                value={scanSource}
                onChange={(event) => setScanSource(event.target.value)}
                placeholder="Scanner source"
                className="w-full h-12 px-4 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-200 flex justify-end pr-1">
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 px-6 bg-[#7626c6] text-white btn-glass rounded-xl hover:bg-[#5f1fa3] transition-colors text-sm font-medium"
            >
              <QrCode className="w-4 h-4" />
              Log Check-in
            </button>
          </div>
        </form>

        {scanFeedback && (
          <div
            className={`mt-4 rounded-lg px-4 py-3 text-sm ${
              scanFeedback.status === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : scanFeedback.status === 'warning'
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
            }`}
            role="status"
            aria-live="polite"
          >
            {scanFeedback.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="rounded-2xl bg-blue-50/80 p-5 border border-blue-100">
            <div className="text-xs font-semibold tracking-wide uppercase text-blue-700/80 mb-2">Checked In</div>
            <div className="text-3xl font-semibold text-blue-900 leading-none">{records.length}</div>
            <div className="text-xs text-blue-700/80 mt-2">Attendees successfully scanned</div>
          </div>
          <div className="rounded-2xl bg-orange-50/80 p-5 border border-orange-100">
            <div className="text-xs font-semibold tracking-wide uppercase text-orange-700/80 mb-2">Pending Check-In</div>
            <div className="text-3xl font-semibold text-orange-900 leading-none">{pendingCount}</div>
            <div className="text-xs text-orange-700/80 mt-2">Awaiting arrival at venue</div>
          </div>
          <div className="rounded-2xl bg-green-50/80 p-5 border border-green-100">
            <div className="text-xs font-semibold tracking-wide uppercase text-green-700/80 mb-2">Check-In Rate</div>
            <div className="text-3xl font-semibold text-green-900 leading-none">{checkInRate}%</div>
            <div className="text-xs text-green-700/80 mt-2">Live venue attendance progress</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Check-In Log</h3>
          <div className="w-full sm:max-w-sm">
            <div className="flex items-center rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-[#7626c6] focus-within:border-transparent">
              <Search className="ml-3 mr-2 w-4 h-4 text-gray-400 shrink-0" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search attendee, ID, order..."
                className="w-full py-2 pr-4 text-gray-900 bg-transparent rounded-r-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendee ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                    No checked-in attendees match your search.
                  </td>
                </tr>
              )}
              {filteredRecords.map((record) => (
                <tr key={`${record.attendeeId}-${record.checkedInAt}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{record.name}</div>
                    <div className="text-sm text-gray-500">{record.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.ticketType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Checked In
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(record.checkedInAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">#{record.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{record.attendeeId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EventDetailsTab({ eventName }: { eventName: string }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
            <input
              type="text"
              defaultValue={eventName}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option>Festival</option>
              <option>Concert</option>
              <option>Conference</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          <button type="button" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="text-2xl mb-2">🎫</div>
            <div className="font-medium text-gray-900">Manage Tickets</div>
            <div className="text-sm text-gray-500">Configure ticket types</div>
          </button>
          <button type="button" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="text-2xl mb-2">✉️</div>
            <div className="font-medium text-gray-900">Send Email</div>
            <div className="text-sm text-gray-500">Email attendees</div>
          </button>
          <button type="button" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-gray-900">View Reports</div>
            <div className="text-sm text-gray-500">Check analytics</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportsTab({ eventName }: { eventName: string }) {
  const handleExportReport = () => {
    const eventSlug = eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'event';
    downloadReportPdf({
      fileName: `${eventSlug}-report.pdf`,
      title: `Event Reports: ${eventName}`,
      subtitle: 'Attendee issue log and performance snapshot.',
      sections: [
        {
          heading: 'Quick Stats',
          lines: [
            'Total Tickets Sold: 847',
            'Checked In: 796',
            'Check-in Rate: 94%',
            'No Shows: 51'
          ]
        },
        {
          heading: 'Attendee Report Issues',
          lines: [
            'High Priority: Ticket Scanning Issues (12 attendees, gates 2 and 3)',
            'Medium Priority: Missing Confirmation Emails (8 attendees)',
            'Medium Priority: Late Entry Requests (5 attendees)',
            'Low Priority: Name Mismatch on Tickets (6 attendees)',
            'Low Priority: Refund Processing Delays (4 attendees)'
          ]
        },
        {
          heading: 'Issue Summary',
          lines: [
            'Total Issues: 35',
            'High Priority: 1',
            'Medium Priority: 2',
            'Resolved: 23'
          ]
        }
      ]
    });
  };

  return (
    <div className="space-y-6">
      {/* Reports Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Event Reports</h2>
            <p className="text-gray-600 mt-1">Event attendee reports and analytics</p>
          </div>
          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg text-sm font-medium hover:bg-[#5f1fa3] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 mb-1">Total Tickets Sold</div>
            <div className="text-2xl font-bold text-purple-900">847</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 mb-1">Checked In</div>
            <div className="text-2xl font-bold text-blue-900">796</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 mb-1">Check-in Rate</div>
            <div className="text-2xl font-bold text-green-900">94%</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-sm text-orange-600 mb-1">No Shows</div>
            <div className="text-2xl font-bold text-orange-900">51</div>
          </div>
        </div>
      </div>

      {/* Attendee Report Issues */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendee Report Issues</h3>
        <p className="text-sm text-gray-600 mb-6">Issues and concerns reported by attendees for this event</p>

        <div className="space-y-3">
          {/* Issue 1 */}
          <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="bg-red-100 p-2 rounded flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-red-900">Ticket Scanning Issues</h4>
                <span className="text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-full font-medium">High Priority</span>
              </div>
              <p className="text-sm text-red-700 mb-2">
                12 attendees reported QR code scanning failures at entrance gates 2 & 3
              </p>
              <div className="flex items-center gap-4 text-xs text-red-600">
                <span>Reported: 2 hours ago</span>
                <span>•</span>
                <span>Affected: 12 attendees</span>
                <span>•</span>
                <span>Gate 2, Gate 3</span>
              </div>
            </div>
          </div>

          {/* Issue 2 */}
          <div className="flex items-start gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="bg-yellow-100 p-2 rounded flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-yellow-900">Missing Confirmation Emails</h4>
                <span className="text-xs px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">Medium Priority</span>
              </div>
              <p className="text-sm text-yellow-700 mb-2">
                8 attendees did not receive ticket confirmation emails after purchase
              </p>
              <div className="flex items-center gap-4 text-xs text-yellow-600">
                <span>Reported: 5 hours ago</span>
                <span>•</span>
                <span>Affected: 8 attendees</span>
                <span>•</span>
                <span>Email delivery issue</span>
              </div>
            </div>
          </div>

          {/* Issue 3 */}
          <div className="flex items-start gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="bg-orange-100 p-2 rounded flex-shrink-0">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-orange-900">Late Entry Requests</h4>
                <span className="text-xs px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">Medium Priority</span>
              </div>
              <p className="text-sm text-orange-700 mb-2">
                5 attendees arrived after official check-in closing time, requesting special entry
              </p>
              <div className="flex items-center gap-4 text-xs text-orange-600">
                <span>Reported: 3 hours ago</span>
                <span>•</span>
                <span>Affected: 5 attendees</span>
                <span>•</span>
                <span>Policy exception request</span>
              </div>
            </div>
          </div>

          {/* Issue 4 */}
          <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="bg-blue-100 p-2 rounded flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-blue-900">Name Mismatch on Tickets</h4>
                <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">Low Priority</span>
              </div>
              <p className="text-sm text-blue-700 mb-2">
                6 attendees reported name spelling errors on their digital tickets
              </p>
              <div className="flex items-center gap-4 text-xs text-blue-600">
                <span>Reported: 1 day ago</span>
                <span>•</span>
                <span>Affected: 6 attendees</span>
                <span>•</span>
                <span>Ticket reissue needed</span>
              </div>
            </div>
          </div>

          {/* Issue 5 */}
          <div className="flex items-start gap-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="bg-purple-100 p-2 rounded flex-shrink-0">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-purple-900">Refund Processing Delays</h4>
                <span className="text-xs px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">Low Priority</span>
              </div>
              <p className="text-sm text-purple-700 mb-2">
                4 attendees inquiring about refund status beyond standard 5-7 day processing time
              </p>
              <div className="flex items-center gap-4 text-xs text-purple-600">
                <span>Reported: 2 days ago</span>
                <span>•</span>
                <span>Affected: 4 attendees</span>
                <span>•</span>
                <span>Payment processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Summary</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">35</div>
            <div className="text-sm text-gray-600 mt-1">Total Issues</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">1</div>
            <div className="text-sm text-gray-600 mt-1">High Priority</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">2</div>
            <div className="text-sm text-gray-600 mt-1">Medium Priority</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">23</div>
            <div className="text-sm text-gray-600 mt-1">Resolved</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  const [eventVisibility, setEventVisibility] = useState<'Public' | 'Private' | 'Draft'>('Public');
  const [waitlistEnabled, setWaitlistEnabled] = useState(false);
  const [privateLink, setPrivateLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [cancellationDraft, setCancellationDraft] = useState('');
  const [policySavedNotice, setPolicySavedNotice] = useState('');
  const {
    dialogRef: cancellationDialogRef,
    titleId: cancellationTitleId,
    descriptionId: cancellationDescriptionId
  } = useModalA11y({
    isOpen: showCancellationModal,
    onClose: () => setShowCancellationModal(false)
  });

  const generatePrivateLink = () => {
    const token = Math.random().toString(36).slice(2, 10);
    return `https://georim.app/private/${token}`;
  };

  const handleVisibilityChange = (visibility: 'Public' | 'Private' | 'Draft') => {
    setEventVisibility(visibility);
    if (visibility === 'Private') {
      setPrivateLink((prev) => prev || generatePrivateLink());
      return;
    }

    setPrivateLink('');
    setLinkCopied(false);
  };

  const handleCopyPrivateLink = async () => {
    if (!privateLink || !navigator?.clipboard) return;
    await navigator.clipboard.writeText(privateLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1800);
  };

  const openCancellationPolicyModal = () => {
    setCancellationDraft(cancellationPolicy);
    setPolicySavedNotice('');
    setShowCancellationModal(true);
  };

  const saveCancellationPolicy = () => {
    setCancellationPolicy(cancellationDraft.trim());
    setShowCancellationModal(false);
    setPolicySavedNotice('Cancellation policy updated.');
    console.log('[Settings] Cancellation policy updated', { length: cancellationDraft.trim().length });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Event Visibility</h3>
              <p className="text-sm text-gray-500">Control who can see your event</p>
            </div>
            <select
              value={eventVisibility}
              onChange={(e) => handleVisibilityChange(e.target.value as 'Public' | 'Private' | 'Draft')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {eventVisibility === 'Private' && (
            <div className="mt-3 rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-medium text-purple-900">Private Access Link</h4>
                  <p className="text-sm text-purple-700">
                    Share this link with invited attendees so they can access this private event.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrivateLink(generatePrivateLink())}
                  className="px-3 py-1.5 text-sm border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  Regenerate
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <input
                  readOnly
                  value={privateLink}
                  className="flex-1 px-3 py-2 border border-purple-200 rounded-lg bg-white text-sm text-gray-700"
                />
                <button
                  type="button"
                  onClick={handleCopyPrivateLink}
                  className="px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg text-sm hover:bg-[#5f1fa3] transition-colors"
                >
                  {linkCopied ? 'Copied' : 'Copy Link'}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h3 className="font-medium text-gray-900">Waitlist</h3>
              <p className="text-sm text-gray-500">
                Enable waitlist when sold out
              </p>
              <p className={`text-xs mt-1 ${waitlistEnabled ? 'text-[#7626c6]' : 'text-gray-500'}`}>
                {waitlistEnabled ? 'Waitlist is active' : 'Waitlist is disabled'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={waitlistEnabled}
                onChange={(e) => setWaitlistEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7626c6]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{ backgroundColor: waitlistEnabled ? '#7626c6' : '#e5e7eb' }}
              ></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-gray-900">Cancellation Policy</h3>
              <p className="text-sm text-gray-500">Refund and cancellation rules</p>
              {!cancellationPolicy && <p className="text-xs mt-1 text-gray-500">No cancellation policy set yet.</p>}
            </div>
            {!cancellationPolicy && (
              <button
                type="button"
                onClick={openCancellationPolicyModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Configure
              </button>
            )}
          </div>

          {cancellationPolicy && (
            <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="text-sm font-semibold text-gray-900">Policy Write-up</h4>
                <button
                  type="button"
                  onClick={openCancellationPolicyModal}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-white transition-colors"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{cancellationPolicy}</p>
            </div>
          )}

          {policySavedNotice && <p className="text-xs mt-1 text-[#7626c6]" aria-live="polite">{policySavedNotice}</p>}
        </div>
      </div>

      {showCancellationModal && (
        <div className="ticketing-modal-overlay">
          <div
            className="ticketing-modal-backdrop"
            onClick={() => setShowCancellationModal(false)}
          />
          <div
            ref={cancellationDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={cancellationTitleId}
            aria-describedby={cancellationDescriptionId}
            tabIndex={-1}
            className="ticketing-modal-card bg-white rounded-2xl border border-gray-200 shadow-2xl p-6"
          >
            <h3 id={cancellationTitleId} className="text-xl font-semibold text-gray-900 mb-1">Configure Cancellation Policy</h3>
            <p id={cancellationDescriptionId} className="text-sm text-gray-600 mb-5">Set your full refund and cancellation terms.</p>

            <div className="ticketing-modal-body space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Policy Details</label>
                <textarea
                  value={cancellationDraft}
                  onChange={(event) => setCancellationDraft(event.target.value)}
                  rows={12}
                  placeholder="Type your full cancellation and refund policy here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent resize-y"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This text will be shown to attendees before checkout.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowCancellationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveCancellationPolicy}
                className="px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors"
              >
                Save Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
