import { KeyboardEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Calendar, Ticket, Mail, BarChart3, CreditCard, Download, Settings as SettingsIcon, QrCode, Search, Phone, CheckCircle, UserRound, ChevronDown, ChevronLeft, ChevronRight, Bookmark, Share2, MapPin, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Iphone15Pro } from './ui/iphone-15-pro';
import { TicketingSection } from './event-management/TicketingSection';
import { OrdersSection } from './event-management/OrdersSection';
import { MarketingSection } from './event-management/MarketingSection';
import { downloadReportPdf } from '../utils/reportExport';
import { useModalA11y } from '../hooks/useModalA11y';
import { EventDraft, EventDraftUpdate, EventLifecycleStatus } from '../types/event';

interface EventManagementProps {
  eventId: string;
  eventName?: string | null;
  eventDetails?: EventDraft;
  eventStatus?: EventLifecycleStatus;
  onUpdateEventDetails?: (updates: EventDraftUpdate) => void;
  onUpdateEventStatus?: (status: EventLifecycleStatus) => void;
  onDuplicateEvent?: () => void;
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
  { attendeeId: 'ATT-3901', name: 'Sarah Johnson',    email: 'sarah.j@email.com',      ticketType: 'Early Bird GA',    orderId: '5847239' },
  { attendeeId: 'ATT-4420', name: 'Michael Chen',     email: 'mchen@email.com',         ticketType: 'VIP Access',       orderId: '5847238' },
  { attendeeId: 'ATT-2015', name: 'Emily Rodriguez',  email: 'emily.r@email.com',       ticketType: 'Student Discount', orderId: '5847237' },
  { attendeeId: 'ATT-3372', name: 'David Kim',        email: 'davidk@email.com',        ticketType: 'Early Bird GA',    orderId: '5847236' },
  { attendeeId: 'ATT-1187', name: 'Jessica Brown',    email: 'jbrown@email.com',        ticketType: 'VIP Access',       orderId: '5847235' },
  { attendeeId: 'ATT-5503', name: 'James Carter',     email: 'jcarter@email.com',       ticketType: 'General Admission',orderId: '5847234' },
  { attendeeId: 'ATT-6621', name: 'Olivia Park',      email: 'oliviapark@email.com',    ticketType: 'Early Bird GA',    orderId: '5847233' },
  { attendeeId: 'ATT-7744', name: 'Daniel Foster',    email: 'd.foster@email.com',      ticketType: 'VIP Access',       orderId: '5847232' },
  { attendeeId: 'ATT-8812', name: 'Ava Thompson',     email: 'ava.t@email.com',         ticketType: 'Student Discount', orderId: '5847231' },
  { attendeeId: 'ATT-9930', name: 'Noah Williams',    email: 'noahw@email.com',         ticketType: 'General Admission',orderId: '5847230' },
  { attendeeId: 'ATT-1045', name: 'Sophia Martinez',  email: 's.martinez@email.com',    ticketType: 'Early Bird GA',    orderId: '5847229' },
  { attendeeId: 'ATT-1156', name: 'Liam Anderson',    email: 'liam.a@email.com',        ticketType: 'VIP Access',       orderId: '5847228' },
  { attendeeId: 'ATT-1267', name: 'Isabella Taylor',  email: 'itaylor@email.com',       ticketType: 'General Admission',orderId: '5847227' },
  { attendeeId: 'ATT-1378', name: 'Mason Lee',        email: 'masonlee@email.com',      ticketType: 'Student Discount', orderId: '5847226' },
  { attendeeId: 'ATT-1489', name: 'Mia Harris',       email: 'mia.h@email.com',         ticketType: 'Early Bird GA',    orderId: '5847225' },
  { attendeeId: 'ATT-1590', name: 'Ethan Clark',      email: 'ethanc@email.com',        ticketType: 'VIP Access',       orderId: '5847224' },
  { attendeeId: 'ATT-1601', name: 'Charlotte Lewis',  email: 'c.lewis@email.com',       ticketType: 'General Admission',orderId: '5847223' },
  { attendeeId: 'ATT-1712', name: 'Lucas Robinson',   email: 'l.robinson@email.com',    ticketType: 'Early Bird GA',    orderId: '5847222' },
  { attendeeId: 'ATT-1823', name: 'Amelia Walker',    email: 'awalker@email.com',       ticketType: 'Student Discount', orderId: '5847221' },
  { attendeeId: 'ATT-1934', name: 'Henry Hall',       email: 'henry.h@email.com',       ticketType: 'VIP Access',       orderId: '5847220' },
  { attendeeId: 'ATT-2045', name: 'Harper Young',     email: 'hyoung@email.com',        ticketType: 'General Admission',orderId: '5847219' },
];

const initialCheckInRecords: CheckInRecord[] = [
  { attendeeId: 'ATT-3901', name: 'Sarah Johnson',   email: 'sarah.j@email.com',   ticketType: 'Early Bird GA',    orderId: '5847239', checkedInAt: '2026-06-15T09:12:00.000Z', source: 'Main Gate Scanner',      scanCode: 'ATT-3901' },
  { attendeeId: 'ATT-4420', name: 'Michael Chen',    email: 'mchen@email.com',      ticketType: 'VIP Access',       orderId: '5847238', checkedInAt: '2026-06-15T09:15:00.000Z', source: 'VIP Entrance Scanner',   scanCode: 'ATT-4420' },
  { attendeeId: 'ATT-2015', name: 'Emily Rodriguez', email: 'emily.r@email.com',    ticketType: 'Student Discount', orderId: '5847237', checkedInAt: '2026-06-15T09:18:00.000Z', source: 'Main Gate Scanner',      scanCode: 'ATT-2015' },
  { attendeeId: 'ATT-3372', name: 'David Kim',       email: 'davidk@email.com',     ticketType: 'Early Bird GA',    orderId: '5847236', checkedInAt: '2026-06-15T09:21:00.000Z', source: 'iPhone Scanner App',     scanCode: 'ATT-3372' },
  { attendeeId: 'ATT-1187', name: 'Jessica Brown',   email: 'jbrown@email.com',     ticketType: 'VIP Access',       orderId: '5847235', checkedInAt: '2026-06-15T09:24:00.000Z', source: 'VIP Entrance Scanner',   scanCode: 'ATT-1187' },
  { attendeeId: 'ATT-5503', name: 'James Carter',    email: 'jcarter@email.com',    ticketType: 'General Admission',orderId: '5847234', checkedInAt: '2026-06-15T09:27:00.000Z', source: 'Main Gate Scanner',      scanCode: 'ATT-5503' },
  { attendeeId: 'ATT-6621', name: 'Olivia Park',     email: 'oliviapark@email.com', ticketType: 'Early Bird GA',    orderId: '5847233', checkedInAt: '2026-06-15T09:30:00.000Z', source: 'iPhone Scanner App',     scanCode: 'ATT-6621' },
  { attendeeId: 'ATT-7744', name: 'Daniel Foster',   email: 'd.foster@email.com',   ticketType: 'VIP Access',       orderId: '5847232', checkedInAt: '2026-06-15T09:33:00.000Z', source: 'VIP Entrance Scanner',   scanCode: 'ATT-7744' },
  { attendeeId: 'ATT-8812', name: 'Ava Thompson',    email: 'ava.t@email.com',      ticketType: 'Student Discount', orderId: '5847231', checkedInAt: '2026-06-15T09:36:00.000Z', source: 'Main Gate Scanner',      scanCode: 'ATT-8812' },
  { attendeeId: 'ATT-9930', name: 'Noah Williams',   email: 'noahw@email.com',      ticketType: 'General Admission',orderId: '5847230', checkedInAt: '2026-06-15T09:39:00.000Z', source: 'iPhone Scanner App',     scanCode: 'ATT-9930' },
  { attendeeId: 'ATT-1045', name: 'Sophia Martinez', email: 's.martinez@email.com', ticketType: 'Early Bird GA',    orderId: '5847229', checkedInAt: '2026-06-15T09:42:00.000Z', source: 'Main Gate Scanner',      scanCode: 'ATT-1045' },
  { attendeeId: 'ATT-1156', name: 'Liam Anderson',   email: 'liam.a@email.com',     ticketType: 'VIP Access',       orderId: '5847228', checkedInAt: '2026-06-15T09:45:00.000Z', source: 'VIP Entrance Scanner',   scanCode: 'ATT-1156' },
  { attendeeId: 'ATT-1267', name: 'Isabella Taylor', email: 'itaylor@email.com',    ticketType: 'General Admission',orderId: '5847227', checkedInAt: '2026-06-15T09:48:00.000Z', source: 'iPhone Scanner App',     scanCode: 'ATT-1267' },
  { attendeeId: 'ATT-1378', name: 'Mason Lee',       email: 'masonlee@email.com',   ticketType: 'Student Discount', orderId: '5847226', checkedInAt: '2026-06-15T09:51:00.000Z', source: 'Main Gate Scanner',      scanCode: 'ATT-1378' },
  { attendeeId: 'ATT-1489', name: 'Mia Harris',      email: 'mia.h@email.com',      ticketType: 'Early Bird GA',    orderId: '5847225', checkedInAt: '2026-06-15T09:54:00.000Z', source: 'iPhone Scanner App',     scanCode: 'ATT-1489' },
  { attendeeId: 'ATT-1590', name: 'Ethan Clark',     email: 'ethanc@email.com',     ticketType: 'VIP Access',       orderId: '5847224', checkedInAt: '2026-06-15T09:57:00.000Z', source: 'VIP Entrance Scanner',   scanCode: 'ATT-1590' },
  { attendeeId: 'ATT-1601', name: 'Charlotte Lewis', email: 'c.lewis@email.com',    ticketType: 'General Admission',orderId: '5847223', checkedInAt: '2026-06-15T10:00:00.000Z', source: 'Main Gate Scanner',      scanCode: 'ATT-1601' },
  { attendeeId: 'ATT-1712', name: 'Lucas Robinson',  email: 'l.robinson@email.com', ticketType: 'Early Bird GA',    orderId: '5847222', checkedInAt: '2026-06-15T10:03:00.000Z', source: 'iPhone Scanner App',     scanCode: 'ATT-1712' },
  { attendeeId: 'ATT-1823', name: 'Amelia Walker',   email: 'awalker@email.com',    ticketType: 'Student Discount', orderId: '5847221', checkedInAt: '2026-06-15T10:06:00.000Z', source: 'Main Gate Scanner',      scanCode: 'ATT-1823' },
  { attendeeId: 'ATT-1934', name: 'Henry Hall',      email: 'henry.h@email.com',    ticketType: 'VIP Access',       orderId: '5847220', checkedInAt: '2026-06-15T10:09:00.000Z', source: 'VIP Entrance Scanner',   scanCode: 'ATT-1934' },
  { attendeeId: 'ATT-2045', name: 'Harper Young',    email: 'hyoung@email.com',     ticketType: 'General Admission',orderId: '5847219', checkedInAt: '2026-06-15T10:12:00.000Z', source: 'Main Gate Scanner',      scanCode: 'ATT-2045' },
];

// ─── Phone Event Screen — based on IPhone16Pro10 Figma design ─────────────────

const DUMMY_HERO = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80';
const DUMMY_MAP = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80';
const DUMMY_AVATAR = 'https://i.pravatar.cc/150?img=5';

function PhoneEventScreen({
  eventName,
  eventDetails,
  eventHeaderDetails,
}: {
  eventName: string;
  eventDetails?: EventDraft;
  eventHeaderDetails: string;
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const dateStr = eventHeaderDetails.split(' • ')[0] || 'Date not set';
  const locationStr = eventDetails?.location?.trim() || '4517 Washington Ave.';
  const description = eventDetails?.summary?.trim() || eventDetails?.description?.trim() ||
    'Join us for an unforgettable night of live music. This world-class concert experience brings together incredible artists for a one-of-a-kind show you won\'t want to miss.';
  const heroSrc = eventDetails?.mainImage || DUMMY_HERO;
  const monthLabel = dateStr.split(' ')[0]?.slice(0, 3).toUpperCase() || 'SEP';
  const dayLabel = dateStr.match(/\d+/)?.[0] || '15';

  // iOS dark mode palette
  const C = {
    bg: '#000000',
    card: '#160c1e',
    cardElevated: '#2C2C2E',
    sep: '#38383A',
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E93',
    blue: '#910aff',
    red: '#FF453A',
    green: '#30D158',
    orange: '#FF9F0A',
    pink: '#FF375F',
  };

  const ios: Record<string, React.CSSProperties> = {
    root: {
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      background: C.bg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
    },
    scroll: { height: '100%', overflowY: 'auto', scrollbarWidth: 'none' as const },
    statusBar: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px 6px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
    },
    navBar: {
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '52px 16px 12px',
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
    },
    navBtn: {
      display: 'flex', alignItems: 'center', gap: 3,
      background: 'none', border: 'none', padding: 0, color: '#fff', cursor: 'pointer',
    },
    glassBtn: {
      width: 32, height: 32, borderRadius: '50%',
      background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: 'none', cursor: 'pointer',
    },
    section: { marginBottom: 8 },
    sectionHeader: {
      fontSize: 13, fontWeight: 400, color: C.textSecondary,
      padding: '0 16px 6px', margin: 0,
    },
    card: {
      background: C.card, overflow: 'hidden',
    },
    row: {
      display: 'flex', alignItems: 'center', padding: '12px 16px',
      borderBottom: `0.5px solid ${C.sep}`,
    },
    sectionLabel: {
      fontSize: 11, fontWeight: 600, color: C.textSecondary,
      textTransform: 'uppercase' as const, letterSpacing: 0.6, margin: '0 0 8px',
    },
  };

  return (
    <div style={ios.root}>
      <div ref={scrollRef} style={ios.scroll}>

        {/* ── HERO ── */}
        <div style={{ position: 'relative', height: 270, flexShrink: 0 }}>
          <img src={heroSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {/* Bottom fade into black */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom, transparent, #000)' }} />

          {/* Status bar */}
          <div style={ios.statusBar}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: -0.3 }}>9:41</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
                <rect x="0" y="6" width="3" height="6" rx="1" opacity="0.4" />
                <rect x="4.5" y="4" width="3" height="8" rx="1" opacity="0.6" />
                <rect x="9" y="2" width="3" height="10" rx="1" opacity="0.8" />
                <rect x="13.5" y="0" width="3" height="12" rx="1" />
              </svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
                <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                <path d="M3.5 6.5C4.9 5.1 6.4 4.4 8 4.4s3.1.7 4.5 2.1" strokeWidth="1.5" stroke="white" fill="none" strokeLinecap="round" />
                <path d="M1 4C3 2 5.4 1 8 1s5 1 7 3" strokeWidth="1.5" stroke="white" fill="none" strokeLinecap="round" opacity="0.5" />
              </svg>
              <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35" />
                <rect x="2" y="2" width="16" height="8" rx="2" fill="white" />
                <path d="M23 4v4a2 2 0 0 0 0-4Z" fill="white" fillOpacity="0.4" />
              </svg>
            </div>
          </div>

          {/* Nav bar */}
          <div style={ios.navBar}>
            <button type="button" style={ios.navBtn}>
              <ChevronLeft size={20} color="#fff" />
              <span style={{ fontSize: 17, color: '#fff', fontWeight: 400 }}>Events</span>
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" style={ios.glassBtn} onClick={() => setIsBookmarked(b => !b)}>
                <Bookmark size={15} color="#fff" fill={isBookmarked ? '#fff' : 'none'} />
              </button>
              <button type="button" style={ios.glassBtn}>
                <Share2 size={15} color="#fff" />
              </button>
            </div>
          </div>
        </div>

        {/* ── TITLE SECTION (full-width, no margin) ── */}
        <div style={{ background: C.card, padding: '16px 16px 14px', borderBottom: `0.5px solid ${C.sep}`, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: 0, lineHeight: 1.25, flex: 1 }}>
              {eventName || 'Billie Eilish Concert'}
            </h1>
            <span style={{
              fontSize: 11, fontWeight: 600, color: C.blue,
              background: 'rgba(10,132,255,0.18)', borderRadius: 6,
              padding: '3px 8px', whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2,
            }}>Outdoor</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex' }}>
              {[5, 6, 7].map((n, i) => (
                <img key={n} src={`https://i.pravatar.cc/50?img=${n}`} alt=""
                  style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${C.card}`, marginLeft: i > 0 ? -8 : 0, objectFit: 'cover' }} />
              ))}
            </div>
            <span style={{ fontSize: 13, color: C.textSecondary }}>
              <span style={{ color: C.blue, fontWeight: 600 }}>11k</span> people attending
            </span>
          </div>
        </div>

        {/* ── DATE & LOCATION GROUP ── */}
        <div style={{ ...ios.section }}>
          <div style={ios.card}>
            {/* Date row */}
            <div style={{ ...ios.row }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0, marginRight: 14 }}>
                <div style={{ height: 15, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: '#fff', letterSpacing: 0.5, textTransform: 'uppercase' }}>{monthLabel}</span>
                </div>
                <div style={{ height: 29, background: C.cardElevated, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>{dayLabel}</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, margin: 0 }}>{dateStr}</p>
                <p style={{ fontSize: 13, color: C.textSecondary, margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} color={C.textSecondary} strokeWidth={1.8} />
                  {eventDetails?.startTime || '7:30 AM – 9:00 AM'}
                </p>
              </div>
              <ChevronRight size={16} color={C.sep} />
            </div>
            {/* Location row */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0, marginRight: 14, position: 'relative' }}>
                <img src={DUMMY_MAP} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)' }}>
                  <MapPin size={16} color="#fff" />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, margin: 0 }}>
                  {locationStr.length > 24 ? locationStr.slice(0, 24) + '…' : locationStr}
                </p>
                <p style={{ fontSize: 13, color: C.blue, margin: '3px 0 0' }}>Get Directions</p>
              </div>
              <ChevronRight size={16} color={C.sep} />
            </div>
          </div>
        </div>

        {/* ── ABOUT GROUP ── */}
        <div style={{ ...ios.section }}>
          <div style={ios.card}>
            <div style={{ padding: '14px 16px' }}>
              <p style={ios.sectionLabel}>About</p>
              <p style={{ fontSize: 15, color: C.textPrimary, margin: 0, lineHeight: 1.55 }}>
                {description.length > 160 ? description.slice(0, 160) + '…' : description}
              </p>
              {description.length > 160 && (
                <button type="button" style={{ color: C.blue, fontSize: 15, fontWeight: 500, marginTop: 6, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                  Read More
                </button>
              )}
            </div>
            <div style={{ borderTop: `0.5px solid ${C.sep}`, padding: '10px 16px', display: 'flex', gap: 8 }}>
              {[['Recurring', C.pink], ['Live Music', C.orange], ['All Ages', C.green]].map(([label, color]) => (
                <span key={label} style={{ fontSize: 12, fontWeight: 500, color, background: `${color}22`, borderRadius: 7, padding: '4px 10px' }}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── ORGANIZER GROUP ── */}
        <div style={{ ...ios.section }}>
          <div style={ios.card}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: `0.5px solid ${C.sep}` }}>
              <div style={{ position: 'relative', flexShrink: 0, marginRight: 12 }}>
                <img src={DUMMY_AVATAR} alt="" style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.blue}` }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 13, height: 13, borderRadius: '50%', background: C.green, border: `2px solid ${C.card}` }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, margin: 0 }}>its_doggo</p>
                <p style={{ fontSize: 13, color: C.textSecondary, margin: '2px 0 0' }}>Event Organizer</p>
              </div>
              <button type="button" style={{ background: 'rgba(10,132,255,0.18)', borderRadius: 8, padding: '6px 16px', border: 'none', color: C.blue, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Follow
              </button>
            </div>
            <div style={{ display: 'flex' }}>
              <button type="button" style={{ flex: 1, padding: '13px 0', background: 'none', border: 'none', borderRight: `0.5px solid ${C.sep}`, color: C.blue, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
                Message
              </button>
              <button type="button" style={{ flex: 1, padding: '13px 0', background: 'none', border: 'none', color: C.blue, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
                Website
              </button>
            </div>
          </div>
        </div>

        {/* ── BUY TICKET ── */}
        <div style={{ padding: '4px 16px 16px' }}>
          <button type="button" style={{
            width: '100%', background: C.blue, borderRadius: 14,
            padding: '15px 0', border: 'none', color: '#fff',
            fontSize: 17, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: `0 4px 20px rgba(10,132,255,0.4)`,
          }}>
            <Ticket size={19} color="#fff" />
            Buy Ticket
          </button>
          <p style={{ fontSize: 12, color: C.textSecondary, textAlign: 'center', margin: '8px 0 0' }}>
            Secure checkout · Instant confirmation
          </p>
        </div>

        {/* Home indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 12px' }}>
          <div style={{ width: 134, height: 5, borderRadius: 3, background: '#fff', opacity: 0.25 }} />
        </div>

      </div>
    </div>
  );
}

export function EventManagement({
  eventId: _eventId,
  eventName,
  eventDetails,
  eventStatus = 'draft',
  onUpdateEventDetails,
  onUpdateEventStatus,
  onDuplicateEvent,
  activeTab: requestedTab,
  onTabChange
}: EventManagementProps) {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>(initialCheckInRecords);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [statusNotice, setStatusNotice] = useState('');
  const resolvedEventName = eventName?.trim() || 'Selected Event';
  const eventHeaderDetails = useMemo(() => {
    const dateLabel = eventDetails?.startDate
      ? new Date(`${eventDetails.startDate}T00:00:00`).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
      : 'Date not set';
    const locationLabel = eventDetails?.location?.trim() || 'Location not set';
    return `${dateLabel} • ${locationLabel}`;
  }, [eventDetails?.location, eventDetails?.startDate]);

  useEffect(() => {
    if (requestedTab) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  const {
    dialogRef: previewDialogRef,
    titleId: previewTitleId,
    descriptionId: previewDescriptionId
  } = useModalA11y({
    isOpen: showPreviewModal,
    onClose: () => setShowPreviewModal(false)
  });

  const eventStatusLabel = eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1);
  const eventStatusBadgeClass =
    eventStatus === 'published'
      ? 'bg-green-100 text-green-700'
      : eventStatus === 'private'
        ? 'bg-[#f1e5fb] text-[#7626c6]'
        : eventStatus === 'archived'
          ? 'bg-amber-100 text-amber-700'
          : 'bg-gray-100 text-gray-700';

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
  const tabIds = tabs.map((tab) => tab.id as Tab);

  const activateTab = (nextTab: Tab) => {
    setActiveTab(nextTab);
    onTabChange?.(nextTab);
  };

  const handleLifecycleChange = (nextStatus: EventLifecycleStatus) => {
    onUpdateEventStatus?.(nextStatus);
    setStatusNotice(`Event status updated to ${nextStatus}.`);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return;
    }

    event.preventDefault();

    if (event.key === 'Home') {
      activateTab(tabIds[0]);
      return;
    }

    if (event.key === 'End') {
      activateTab(tabIds[tabIds.length - 1]);
      return;
    }

    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (currentIndex + direction + tabIds.length) % tabIds.length;
    activateTab(tabIds[nextIndex]);
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Event Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{resolvedEventName}</h1>
              <p className="text-gray-600 mt-1">{eventHeaderDetails}</p>
              {statusNotice ? (
                <p className="mt-2 text-sm font-medium capitalize text-[#7626c6]" aria-live="polite">
                  {statusNotice}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${eventStatusBadgeClass}`}>
                {eventStatusLabel}
              </span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Preview Event
              </button>
              <button
                type="button"
                onClick={onDuplicateEvent}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Duplicate
              </button>
              <select
                aria-label="Lifecycle status"
                value={eventStatus}
                onChange={(event) => handleLifecycleChange(event.target.value as EventLifecycleStatus)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="private">Private</option>
                <option value="archived">Archived</option>
              </select>
              <button
                type="button"
                onClick={() => handleLifecycleChange(eventStatus === 'published' ? 'draft' : 'published')}
                className="px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors"
              >
                {eventStatus === 'published' ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 -mb-px overflow-x-auto pb-1" role="tablist" aria-label="Event management sections">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  type="button"
                  key={tab.id}
                  id={`event-tab-${tab.id}`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`event-panel-${tab.id}`}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  onClick={() => activateTab(tab.id as Tab)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors duration-[150ms] whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-gray-900 text-gray-900 font-semibold'
                      : 'border-transparent text-gray-400 font-medium hover:text-violet-400 hover:border-violet-200'
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
        <section id={`event-panel-${activeTab}`} role="tabpanel" aria-labelledby={`event-tab-${activeTab}`}>
          {activeTab === 'details' && (
            <EventDetailsTab
              eventName={resolvedEventName}
              eventDetails={eventDetails}
              onUpdateEventDetails={onUpdateEventDetails}
            />
          )}
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
        </section>
      </div>

      <AnimatePresence>
        {showPreviewModal && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
            animate={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
            exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
            transition={{ duration: 0.25 }}
          >
            <div className="overflow-y-auto max-h-screen py-10 px-6 flex items-start justify-center">
              <motion.div
                ref={previewDialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={previewTitleId}
                aria-describedby={previewDescriptionId}
                tabIndex={-1}
                className="flex flex-col items-center gap-3 outline-none"
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="text-center">
                  <h2 id={previewTitleId} className="text-sm font-semibold text-white">Event Preview</h2>
                  <p id={previewDescriptionId} className="text-xs text-white/60 mt-0.5">How attendees see your event.</p>
                </div>

                {/* 415 × 874 phone frame */}
                <div className="relative flex-shrink-0" style={{ width: 415, height: 874 }}>
                  {/* Close button — top-right corner of the phone frame */}
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(false)}
                    className="absolute -top-4 -right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/35 transition-colors"
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>
                  <Iphone15Pro width={415} height={874} />
                  {/* Screen fills the rounded screen area of the SVG */}
                  <div
                    className="absolute overflow-hidden"
                    style={{ top: 19, left: 20, width: 375, height: 836, borderRadius: 53 }}
                  >
                    <PhoneEventScreen
                      eventName={resolvedEventName}
                      eventDetails={eventDetails}
                      eventHeaderDetails={eventHeaderDetails}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const fieldIdPrefix = useId();
  const [scanCode, setScanCode] = useState('');
  const [scanSource, setScanSource] = useState('Main Gate Scanner');
  const [searchQuery, setSearchQuery] = useState('');
  const [scanFeedback, setScanFeedback] = useState<ScanResult | null>(null);
  const [showAllLog, setShowAllLog] = useState(false);
  const [ticketTypeFilter, setTicketTypeFilter] = useState('all');
  const getFieldId = (field: string) => `${fieldIdPrefix}-${field}`;

  const pendingCount = Math.max(0, totalAttendees - records.length);
  const checkInRate = totalAttendees ? Math.min(100, Math.round((records.length / totalAttendees) * 100)) : 0;

  const ticketTypes = useMemo(() => {
    const types = Array.from(new Set(records.map((r) => r.ticketType))).sort();
    return types;
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return records.filter((record) => {
      const matchesSearch = !query || [record.name, record.email, record.attendeeId, record.orderId, record.ticketType].some((value) =>
        value.toLowerCase().includes(query)
      );
      const matchesTicket = ticketTypeFilter === 'all' || record.ticketType === ticketTypeFilter;
      return matchesSearch && matchesTicket;
    });
  }, [records, searchQuery, ticketTypeFilter]);

  const handleSubmitScan = (event: React.SyntheticEvent<HTMLFormElement>) => {
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
      {/* Metric strip — sits outside the parent card, 24px gap, always 3-column */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Checked In',       value: records.length,   sub: 'Attendees successfully scanned', },
          { label: 'Pending Check-In', value: pendingCount,      sub: 'Awaiting arrival at venue',      },
          { label: 'Check-In Rate',    value: `${checkInRate}%`, sub: 'Live venue attendance progress', },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[28px] border border-gray-200 bg-white p-6">
            <p className="ui-meta-text mb-3">{stat.label}</p>
            <p className="text-3xl font-semibold tracking-tight text-gray-900 leading-none">{stat.value}</p>
            <p className="mt-2 text-xs text-gray-500">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[28px] border border-gray-200 shadow-[var(--ui-shadow-soft)]">

        {/* Card header */}
        <div className="flex items-start justify-between gap-4 px-6 py-6 border-b border-gray-100">
          <div>
            <h2 className="ui-card-title">Checked-In Attendees</h2>
            <p className="mt-1 text-xs text-gray-500">
              Scan attendee QR codes from your phone or scanner device to log check-ins in real time.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span
                  className="absolute h-2.5 w-2.5 rounded-full bg-emerald-400"
                  style={{ animation: 'ping 1.2s cubic-bezier(0,0,0.2,1) infinite', transformOrigin: 'center' }}
                />
                <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              Live sync active
            </div>
            <button
              type="button"
              onClick={simulatePhoneScan}
              className="ui-button ui-button--default ui-button--size-sm"
            >
              <Phone className="w-4 h-4" />
              Simulate Scan
            </button>
          </div>
        </div>

        <div className="p-6">
        <form onSubmit={handleSubmitScan} className="rounded-[22px] border border-gray-200 bg-gray-50 p-5 md:p-6">
          <div className="flex items-end gap-4">
            <input
              id={getFieldId('scan-code')}
              value={scanCode}
              onChange={(event) => setScanCode(event.target.value)}
              placeholder="Scan or paste QR code (e.g. ATT-4420)"
              aria-label="QR Code"
              className="flex-1 h-10 px-4 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-[#7626c6] focus:border-transparent text-sm"
            />
            <input
              id={getFieldId('scan-source')}
              value={scanSource}
              onChange={(event) => setScanSource(event.target.value)}
              placeholder="Scanner source"
              aria-label="Source Device"
              className="flex-1 h-10 px-4 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-[#7626c6] focus:border-transparent text-sm"
            />
            <button type="submit" className="ui-button ui-button--default flex-shrink-0 !min-h-0 !py-2 text-sm" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
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

        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900 flex-shrink-0">Live Check-In Log</h3>
          <div className="flex items-center gap-3 ml-auto">
            <select
              value={ticketTypeFilter}
              onChange={(e) => setTicketTypeFilter(e.target.value)}
              className="h-9 w-44 flex-shrink-0 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-[#7626c6] focus:outline-none focus:ring-2 focus:ring-[#7626c6]/20"
            >
              <option value="all">All ticket types</option>
              {ticketTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="relative flex-shrink-0 w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search attendee, ID, order..."
                className="w-full h-9 pl-11 pr-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7626c6]/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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
              {(showAllLog ? filteredRecords : filteredRecords.slice(0, 10)).map((record) => (
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
        {filteredRecords.length > 10 && (
          <div className="border-t border-gray-200 px-6 py-3 flex justify-end">
            <button
              type="button"
              onClick={() => setShowAllLog((prev) => !prev)}
              className="flex items-center gap-1 text-sm font-medium text-[#7626c6] hover:text-[#5f1fa3] transition-colors duration-[150ms]"
            >
              {showAllLog ? 'Show less' : `View all ${filteredRecords.length} check-ins`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EventDetailsTab({
  eventName,
  eventDetails,
  onUpdateEventDetails
}: {
  eventName: string;
  eventDetails?: EventDraft;
  onUpdateEventDetails?: (updates: EventDraftUpdate) => void;
}) {
  const fallbackEventDetails = useMemo<EventDraft>(() => ({
    title: eventName,
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
    description: ''
  }), [eventName]);
  const [isEditing, setIsEditing] = useState(false);
  const [detailsForm, setDetailsForm] = useState<EventDraft>(eventDetails ?? fallbackEventDetails);
  const [detailsNotice, setDetailsNotice] = useState('');
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const fieldIdPrefix = useId();
  const isBlobUrl = (url: string) => url.startsWith('blob:');
  const getFieldId = (field: string) => `${fieldIdPrefix}-${field}`;

  useEffect(() => {
    setDetailsForm(eventDetails ?? fallbackEventDetails);
    setIsEditing(false);
    setDetailsNotice('');
  }, [eventDetails, fallbackEventDetails]);

  const updateDetailField = <K extends keyof EventDraft>(field: K, value: EventDraft[K]) => {
    setDetailsForm((currentDetails) => ({
      ...currentDetails,
      [field]: value
    }));
  };

  const handleTagChange = (tagsValue: string) => {
    const nextTags = tagsValue
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    updateDetailField('tags', nextTags);
  };

  const handleMainImageUpload = (file: File | undefined) => {
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    if (detailsForm.mainImage && isBlobUrl(detailsForm.mainImage) && detailsForm.mainImage !== imageUrl) {
      URL.revokeObjectURL(detailsForm.mainImage);
    }
    updateDetailField('mainImage', imageUrl);
  };

  const handleRemoveMainImage = () => {
    if (detailsForm.mainImage && isBlobUrl(detailsForm.mainImage)) {
      URL.revokeObjectURL(detailsForm.mainImage);
    }
    updateDetailField('mainImage', '');
  };

  const handleAdditionalImagesUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const nextImages = Array.from(files).map((file) => URL.createObjectURL(file));
    const mergedImages = [...(detailsForm.additionalImages || []), ...nextImages];
    const allowedImages = mergedImages.slice(0, 10);
    const droppedImages = mergedImages.slice(10);
    droppedImages.forEach((image) => {
      if (isBlobUrl(image)) URL.revokeObjectURL(image);
    });
    updateDetailField('additionalImages', allowedImages);
  };

  const removeAdditionalImage = (index: number) => {
    const imageToRemove = detailsForm.additionalImages?.[index];
    if (imageToRemove && isBlobUrl(imageToRemove)) {
      URL.revokeObjectURL(imageToRemove);
    }
    updateDetailField(
      'additionalImages',
      (detailsForm.additionalImages || []).filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const handleCancelEdit = () => {
    const sourceMainImage = eventDetails?.mainImage || fallbackEventDetails.mainImage;
    if (
      detailsForm.mainImage &&
      detailsForm.mainImage !== sourceMainImage &&
      isBlobUrl(detailsForm.mainImage)
    ) {
      URL.revokeObjectURL(detailsForm.mainImage);
    }

    const sourceAdditionalImages = eventDetails?.additionalImages || fallbackEventDetails.additionalImages;
    (detailsForm.additionalImages || []).forEach((image) => {
      if (!sourceAdditionalImages.includes(image) && isBlobUrl(image)) {
        URL.revokeObjectURL(image);
      }
    });

    setDetailsForm(eventDetails ?? fallbackEventDetails);
    setIsEditing(false);
  };

  const handleSaveDetails = () => {
    const nextDetails: EventDraft = {
      ...detailsForm,
      title: detailsForm.title.trim() || 'Untitled Event',
      tags: detailsForm.tags.map((tag) => tag.trim()).filter(Boolean),
      additionalImages: (detailsForm.additionalImages || []).filter(Boolean)
    };
    setDetailsForm(nextDetails);
    onUpdateEventDetails?.(nextDetails);
    setDetailsNotice('Event details updated.');
    setIsEditing(false);
  };

  const inputClassName = `w-full px-4 py-2 border border-gray-300 rounded-lg ${isEditing ? 'focus:ring-2 focus:ring-[#7626c6] focus:border-transparent bg-white' : 'bg-gray-50 text-gray-700'}`;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Event Information</h2>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDetails}
                  className="px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors"
              >
                Edit Details
              </button>
            )}
          </div>
        </div>

        {detailsNotice && (
          <p className="text-sm text-[#7626c6] mb-4" aria-live="polite">{detailsNotice}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={getFieldId('title')} className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
            <input
              id={getFieldId('title')}
              type="text"
              value={detailsForm.title}
              onChange={(event) => updateDetailField('title', event.target.value)}
              disabled={!isEditing}
              className={inputClassName}
              placeholder="Not provided"
            />
          </div>
          <div>
            <label htmlFor={getFieldId('type')} className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
            <input
              id={getFieldId('type')}
              type="text"
              value={detailsForm.type}
              onChange={(event) => updateDetailField('type', event.target.value)}
              disabled={!isEditing}
              className={inputClassName}
              placeholder="Not provided"
            />
          </div>
          <div>
            <label htmlFor={getFieldId('category')} className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input
              id={getFieldId('category')}
              type="text"
              value={detailsForm.category}
              onChange={(event) => updateDetailField('category', event.target.value)}
              disabled={!isEditing}
              className={inputClassName}
              placeholder="Not provided"
            />
          </div>
          <div>
            <label htmlFor={getFieldId('tags')} className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input
              id={getFieldId('tags')}
              type="text"
              value={detailsForm.tags.join(', ')}
              onChange={(event) => handleTagChange(event.target.value)}
              disabled={!isEditing}
              className={inputClassName}
              placeholder="music, networking, vip"
            />
          </div>
          <div>
            <label htmlFor={getFieldId('location-type')} className="block text-sm font-medium text-gray-700 mb-2">Location Type</label>
            <input
              id={getFieldId('location-type')}
              type="text"
              value={detailsForm.locationType}
              onChange={(event) => updateDetailField('locationType', event.target.value)}
              disabled={!isEditing}
              className={inputClassName}
              placeholder="in-person or online"
            />
          </div>
          <div>
            <label htmlFor={getFieldId('location')} className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              id={getFieldId('location')}
              type="text"
              value={detailsForm.location}
              onChange={(event) => updateDetailField('location', event.target.value)}
              disabled={!isEditing}
              className={inputClassName}
              placeholder="Not provided"
            />
          </div>
          <div>
            <label htmlFor={getFieldId('start-date')} className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              id={getFieldId('start-date')}
              type="date"
              value={detailsForm.startDate}
              onChange={(event) => updateDetailField('startDate', event.target.value)}
              disabled={!isEditing}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor={getFieldId('start-time')} className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input
              id={getFieldId('start-time')}
              type="time"
              value={detailsForm.startTime}
              onChange={(event) => updateDetailField('startTime', event.target.value)}
              disabled={!isEditing}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor={getFieldId('end-date')} className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              id={getFieldId('end-date')}
              type="date"
              value={detailsForm.endDate}
              onChange={(event) => updateDetailField('endDate', event.target.value)}
              disabled={!isEditing}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor={getFieldId('end-time')} className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <input
              id={getFieldId('end-time')}
              type="time"
              value={detailsForm.endTime}
              onChange={(event) => updateDetailField('endTime', event.target.value)}
              disabled={!isEditing}
              className={inputClassName}
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor={getFieldId('main-image')} className="block text-sm font-medium text-gray-700">Main Event Image</label>
              {isEditing && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => mainImageInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {detailsForm.mainImage ? 'Replace Image' : 'Upload Image'}
                  </button>
                  {detailsForm.mainImage && (
                    <button
                      type="button"
                      onClick={handleRemoveMainImage}
                      className="px-3 py-1.5 text-xs border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>
            <input
              id={getFieldId('main-image')}
              ref={mainImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                handleMainImageUpload(event.target.files?.[0]);
                event.currentTarget.value = '';
              }}
            />
            {detailsForm.mainImage ? (
              <img
                src={detailsForm.mainImage}
                alt="Main event"
                className="w-full h-56 object-cover border border-gray-200 rounded-lg"
              />
            ) : (
              <div className="h-56 border border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center text-sm text-gray-500">
                No main image uploaded
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor={getFieldId('additional-images')} className="block text-sm font-medium text-gray-700">Additional Uploaded Images</label>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => additionalImagesInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Add Images
                </button>
              )}
            </div>
            <input
              id={getFieldId('additional-images')}
              ref={additionalImagesInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                handleAdditionalImagesUpload(event.target.files);
                event.currentTarget.value = '';
              }}
            />
            {(detailsForm.additionalImages || []).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(detailsForm.additionalImages || []).map((image, index) => (
                  <div key={`${image}-${index}`} className="relative rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={image} alt={`Event gallery ${index + 1}`} className="w-full h-28 object-cover" />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-24 border border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center text-sm text-gray-500">
                No additional images uploaded
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor={getFieldId('video-url')} className="block text-sm font-medium text-gray-700 mb-2">Event Video URL</label>
            <input
              id={getFieldId('video-url')}
              type="url"
              value={detailsForm.videoUrl}
              onChange={(event) => updateDetailField('videoUrl', event.target.value)}
              disabled={!isEditing}
              className={inputClassName}
              placeholder="https://..."
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={getFieldId('summary')} className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
            <textarea
              id={getFieldId('summary')}
              rows={2}
              value={detailsForm.summary}
              onChange={(event) => updateDetailField('summary', event.target.value)}
              disabled={!isEditing}
              className={`${inputClassName} resize-none`}
              placeholder="Not provided"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor={getFieldId('full-description')} className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
            <textarea
              id={getFieldId('full-description')}
              rows={8}
              value={detailsForm.description}
              onChange={(event) => updateDetailField('description', event.target.value)}
              disabled={!isEditing}
              className={`${inputClassName} resize-y`}
              placeholder="Not provided"
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor={getFieldId('is-recurring')} className="inline-flex items-center gap-2 cursor-pointer">
            <input
              id={getFieldId('is-recurring')}
              type="checkbox"
              checked={detailsForm.isRecurring}
              onChange={(event) => updateDetailField('isRecurring', event.target.checked)}
              disabled={!isEditing}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Recurring event</span>
          </label>
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
        { heading: 'Quick Stats', lines: ['Total Tickets Sold: 847', 'Checked In: 796', 'Check-in Rate: 94%', 'No Shows: 51'] },
        { heading: 'Attendee Report Issues', lines: [
          'High Priority: Ticket Scanning Issues (12 attendees, gates 2 and 3)',
          'Medium Priority: Missing Confirmation Emails (8 attendees)',
          'Medium Priority: Late Entry Requests (5 attendees)',
          'Low Priority: Name Mismatch on Tickets (6 attendees)',
          'Low Priority: Refund Processing Delays (4 attendees)',
        ]},
        { heading: 'Issue Summary', lines: ['Total Issues: 35', 'High Priority: 1', 'Medium Priority: 2', 'Resolved: 23'] },
      ]
    });
  };

  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [resolvedReports, setResolvedReports] = useState<{ id: string; attendee: string; orderId: string; detail: string; issueTitle: string }[]>([]);
  const [showAllResolved, setShowAllResolved] = useState(false);
  const [issueReports, setIssueReports] = useState<Record<string, { id: string; attendee: string; orderId: string; detail: string }[]>>({
    'Ticket Scanning Issues': [
      { id: 'ISS-001', attendee: 'Sarah Johnson',   orderId: '#5847239', detail: 'QR code not recognised at Gate 2. Manually admitted after 8-minute delay.' },
      { id: 'ISS-002', attendee: 'Michael Chen',    orderId: '#5847238', detail: 'Scanner at Gate 3 returned error code E-04 repeatedly. Issue escalated to tech.' },
      { id: 'ISS-003', attendee: 'Emily Rodriguez', orderId: '#5847237', detail: 'App-generated QR code failed. Backup PDF ticket accepted instead.' },
    ],
    'Missing Confirmation Emails': [
      { id: 'ISS-004', attendee: 'David Kim',      orderId: '#5847236', detail: 'Confirmation email not received. Resent manually — confirmed delivered.' },
      { id: 'ISS-005', attendee: 'Jessica Brown',  orderId: '#5847235', detail: 'Email bounced due to typo in address at checkout. Corrected and resent.' },
    ],
    'Late Entry Requests': [
      { id: 'ISS-006', attendee: 'James Carter',  orderId: '#5847234', detail: 'Arrived 25 minutes after closing. Entry granted via supervisor override.' },
      { id: 'ISS-007', attendee: 'Olivia Park',   orderId: '#5847233', detail: 'Delayed due to transport disruption. Entry denied per policy — refund requested.' },
    ],
    'Name Mismatch on Tickets': [
      { id: 'ISS-008', attendee: 'Daniel Foster',   orderId: '#5847232', detail: 'Name printed as "Forster" — ticket reissued with correct spelling.' },
      { id: 'ISS-009', attendee: 'Ava Thompson',    orderId: '#5847231', detail: 'Middle name included erroneously. Ticket reissue pending.' },
    ],
    'Refund Processing Delays': [
      { id: 'ISS-010', attendee: 'Noah Williams',   orderId: '#5847230', detail: 'Refund requested 9 days ago — still pending. Escalated to payments team.' },
      { id: 'ISS-011', attendee: 'Sophia Martinez', orderId: '#5847229', detail: 'Bank return failed on first attempt. Second attempt initiated.' },
    ],
  });

  const handleResolve = (issueTitle: string, reportId: string) => {
    const report = issueReports[issueTitle]?.find((r) => r.id === reportId);
    if (!report) return;
    setResolvedReports((prev) => [...prev, { ...report, issueTitle }]);
    setIssueReports((prev) => ({
      ...prev,
      [issueTitle]: prev[issueTitle].filter((r) => r.id !== reportId),
    }));
  };

  const issues = [
    { icon: QrCode,    title: 'Ticket Scanning Issues',     priority: 'high' as const,   description: 'QR code scanning failures at entrance gates 2 & 3.',                        meta: ['2 hours ago', '12 attendees', 'Gate 2, Gate 3']       },
    { icon: Mail,      title: 'Missing Confirmation Emails', priority: 'medium' as const, description: 'Attendees did not receive ticket confirmation after purchase.',              meta: ['5 hours ago', '8 attendees', 'Email delivery']        },
    { icon: Calendar,  title: 'Late Entry Requests',         priority: 'medium' as const, description: 'Attendees arrived after official check-in closing time.',                   meta: ['3 hours ago', '5 attendees', 'Policy exception']      },
    { icon: UserRound, title: 'Name Mismatch on Tickets',    priority: 'low' as const,    description: 'Spelling errors on attendee names on digital tickets.',                     meta: ['1 day ago', '6 attendees', 'Ticket reissue needed']   },
    { icon: CreditCard,title: 'Refund Processing Delays',    priority: 'low' as const,    description: 'Refund status inquiries beyond standard 5–7 day window.',                   meta: ['2 days ago', '4 attendees', 'Payment processing']     },
  ];

  const priorityBadge = (p: 'high' | 'medium' | 'low') => {
    if (p === 'high')   return 'bg-rose-50 text-rose-700 border border-rose-200';
    if (p === 'medium') return 'bg-amber-50 text-amber-700 border border-amber-200';
    return 'bg-gray-100 text-gray-600 border border-gray-200';
  };

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="ui-card-title">Event Reports</h2>
          <p className="mt-1 text-xs text-gray-500">Attendee issue log and performance snapshot.</p>
        </div>
        <button type="button" onClick={handleExportReport} className="ui-button ui-button--default ui-button--size-sm flex-shrink-0">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Metric strip */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Tickets Sold',   value: '847', sub: 'Total confirmed sales'       },
          { label: 'Checked In',     value: '796', sub: 'Attendees scanned at entry'  },
          { label: 'Check-in Rate',  value: '94%', sub: 'Of all ticket holders'       },
          { label: 'No Shows',       value: '51',  sub: 'Did not attend the event'    },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[28px] border border-gray-200 bg-white p-6">
            <p className="ui-meta-text mb-3">{stat.label}</p>
            <p className="text-3xl font-semibold tracking-tight text-gray-900 leading-none">{stat.value}</p>
            <p className="mt-2 text-xs text-gray-500">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Issue log */}
      <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-6">
          <div>
            <h3 className="ui-card-title">Attendee Report Issues</h3>
            <p className="mt-1 text-xs text-gray-500">Issues and concerns reported by attendees for this event.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700">1 high</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-medium text-amber-700">2 medium</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700">23 resolved</span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {issues.map((issue) => {
            const Icon = issue.icon;
            const isOpen = expandedIssue === issue.title;
            return (
              <div key={issue.title}>
                <button
                  type="button"
                  onClick={() => setExpandedIssue(isOpen ? null : issue.title)}
                  className="w-full flex items-start gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-[150ms]"
                >
                  <div className="flex-shrink-0 rounded-xl bg-gray-100 p-2 text-gray-500 mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-900">{issue.title}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${priorityBadge(issue.priority)}`}>
                          {issue.priority}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-[150ms] ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 leading-5">{issue.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-400">
                      {issue.meta.map((m, i) => (
                        <span key={m} className="flex items-center gap-2">
                          {i > 0 && <span>·</span>}
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 space-y-3">
                    {(issueReports[issue.title] ?? []).length === 0 ? (
                      <p className="text-xs text-gray-400 py-2">All reports in this category have been resolved.</p>
                    ) : (issueReports[issue.title] ?? []).map((report) => (
                      <div key={report.id} className="overflow-hidden rounded-[22px] border border-gray-200 bg-white divide-y divide-gray-100">
                        <div className="flex items-center gap-4 px-4 py-3">
                          <span className="w-16 flex-shrink-0 text-xs font-medium text-gray-400">Report</span>
                          <span className="text-xs font-medium text-gray-700">{report.id}</span>
                          <span className="ml-auto flex items-center gap-3">
                            <span className="text-xs text-gray-400">{report.orderId}</span>
                            <button
                              type="button"
                              onClick={() => handleResolve(issue.title, report.id)}
                              className="ui-button ui-button--outline ui-button--size-sm !py-1 text-xs"
                              style={{ paddingLeft: '0.625rem', paddingRight: '0.625rem' }}
                            >
                              Resolve
                            </button>
                          </span>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3">
                          <span className="w-16 flex-shrink-0 text-xs font-medium text-gray-400">Attendee</span>
                          <span className="text-xs text-gray-700">{report.attendee}</span>
                        </div>
                        <div className="flex items-start gap-4 px-4 py-3">
                          <span className="w-16 flex-shrink-0 text-xs font-medium text-gray-400">Detail</span>
                          <span className="text-xs text-gray-700 leading-5">{report.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Resolved Issues */}
      {resolvedReports.length > 0 && (
        <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white">
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-6">
            <div>
              <h3 className="ui-card-title">Resolved Issues</h3>
              <p className="mt-1 text-xs text-gray-500">{resolvedReports.length} report{resolvedReports.length !== 1 ? 's' : ''} marked as resolved.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {resolvedReports.length} resolved
            </span>
          </div>
          <div className="px-6 py-4 space-y-3">
            {(showAllResolved ? resolvedReports : resolvedReports.slice(-3).reverse()).map((report) => (
              <div key={report.id} className="overflow-hidden rounded-[22px] border border-gray-200 bg-gray-50 divide-y divide-gray-100">
                <div className="flex items-center gap-4 px-4 py-3">
                  <span className="w-16 flex-shrink-0 text-xs font-medium text-gray-400">Report</span>
                  <span className="text-xs font-medium text-gray-700">{report.id}</span>
                  <span className="ml-auto flex items-center gap-3">
                    <span className="text-xs text-gray-400">{report.orderId}</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-medium text-emerald-700">Resolved</span>
                  </span>
                </div>
                <div className="flex items-center gap-4 px-4 py-3">
                  <span className="w-16 flex-shrink-0 text-xs font-medium text-gray-400">Attendee</span>
                  <span className="text-xs text-gray-700">{report.attendee}</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-3">
                  <span className="w-16 flex-shrink-0 text-xs font-medium text-gray-400">Category</span>
                  <span className="text-xs text-gray-500">{report.issueTitle}</span>
                </div>
                <div className="flex items-start gap-4 px-4 py-3">
                  <span className="w-16 flex-shrink-0 text-xs font-medium text-gray-400">Detail</span>
                  <span className="text-xs text-gray-700 leading-5">{report.detail}</span>
                </div>
              </div>
            ))}
          </div>
          {resolvedReports.length > 3 && (
            <div className="flex justify-end border-t border-gray-100 px-6 py-3">
              <button
                type="button"
                onClick={() => setShowAllResolved((v) => !v)}
                className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors duration-[150ms]"
              >
                {showAllResolved ? 'Show less' : `View all ${resolvedReports.length} resolved`}
              </button>
            </div>
          )}
        </div>
      )}

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
              aria-label="Event visibility"
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
                <label htmlFor="event-policy-details" className="block text-sm font-medium text-gray-700 mb-2">Policy Details</label>
                <textarea
                  id="event-policy-details"
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
