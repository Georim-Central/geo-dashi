import type { ReactNode } from 'react';

import {
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  Mail,
  MoreVertical,
  Receipt,
  Search,
  UserRound,
  XCircle,
} from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { useModalA11y } from '../../hooks/useModalA11y';
import { ContentState } from '../ui/ContentState';

type OrderStatusValue = 'completed' | 'pending' | 'refunded';

type OrderRecord = {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    attendeeId: string;
  };
  ticketType: string;
  quantity: number;
  amount: string;
  status: OrderStatusValue;
  date: string;
  purchasedAt: string;
  paymentMethod: string;
  transactionId: string;
  promoCode: string | null;
  checkInStatus: string;
  notes: string;
};

type ExportState = 'idle' | 'exporting' | 'ready';

const initialOrders: OrderRecord[] = [
  {
    id: '5847239',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 113-9901',
      attendeeId: 'ATT-3901',
    },
    ticketType: 'Early Bird GA',
    quantity: 2,
    amount: '90.00',
    status: 'completed',
    date: 'Jan 8, 2026',
    purchasedAt: 'Jan 8, 2026, 10:24 AM',
    paymentMethod: 'Visa •••• 4821',
    transactionId: 'TXN-8F1A-3901',
    promoCode: 'SUMMER2026',
    checkInStatus: 'Checked in',
    notes: 'Requested ADA seating assistance.',
  },
  {
    id: '5847238',
    customer: {
      name: 'Michael Chen',
      email: 'mchen@email.com',
      phone: '+1 (555) 203-4420',
      attendeeId: 'ATT-4420',
    },
    ticketType: 'VIP Access',
    quantity: 1,
    amount: '150.00',
    status: 'completed',
    date: 'Jan 8, 2026',
    purchasedAt: 'Jan 8, 2026, 1:15 PM',
    paymentMethod: 'Mastercard •••• 1139',
    transactionId: 'TXN-0C3K-4420',
    promoCode: null,
    checkInStatus: 'Not checked in',
    notes: 'VIP lounge wristband pending pickup.',
  },
  {
    id: '5847237',
    customer: {
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '+1 (555) 774-2015',
      attendeeId: 'ATT-2015',
    },
    ticketType: 'Student Discount',
    quantity: 1,
    amount: '30.00',
    status: 'pending',
    date: 'Jan 7, 2026',
    purchasedAt: 'Jan 7, 2026, 8:42 PM',
    paymentMethod: 'Pending payment verification',
    transactionId: 'TXN-PEND-2015',
    promoCode: 'STUDENT10',
    checkInStatus: 'Not checked in',
    notes: 'Student ID validation still required.',
  },
  {
    id: '5847236',
    customer: {
      name: 'David Kim',
      email: 'davidk@email.com',
      phone: '+1 (555) 661-3372',
      attendeeId: 'ATT-3372',
    },
    ticketType: 'Early Bird GA',
    quantity: 4,
    amount: '180.00',
    status: 'completed',
    date: 'Jan 7, 2026',
    purchasedAt: 'Jan 7, 2026, 2:08 PM',
    paymentMethod: 'Amex •••• 7712',
    transactionId: 'TXN-9M2P-3372',
    promoCode: null,
    checkInStatus: 'Partially checked in',
    notes: '2 of 4 attendees already checked in.',
  },
  {
    id: '5847235',
    customer: {
      name: 'Jessica Brown',
      email: 'jbrown@email.com',
      phone: '+1 (555) 992-1187',
      attendeeId: 'ATT-1187',
    },
    ticketType: 'VIP Access',
    quantity: 2,
    amount: '300.00',
    status: 'refunded',
    date: 'Jan 6, 2026',
    purchasedAt: 'Jan 6, 2026, 11:51 AM',
    paymentMethod: 'Visa •••• 6304',
    transactionId: 'TXN-RFD-1187',
    promoCode: 'VIPACCESS',
    checkInStatus: 'Refunded',
    notes: 'Refunded due to schedule conflict.',
  },
  {
    id: '5847234',
    customer: {
      name: 'Omar Hassan',
      email: 'o.hassan@email.com',
      phone: '+1 (555) 348-8821',
      attendeeId: 'ATT-8821',
    },
    ticketType: 'Early Bird GA',
    quantity: 1,
    amount: '45.00',
    status: 'completed',
    date: 'Jan 6, 2026',
    purchasedAt: 'Jan 6, 2026, 9:05 AM',
    paymentMethod: 'Visa •••• 3310',
    transactionId: 'TXN-4L9R-8821',
    promoCode: null,
    checkInStatus: 'Not checked in',
    notes: 'No additional notes.',
  },
  {
    id: '5847233',
    customer: {
      name: 'Priya Nair',
      email: 'priya.n@email.com',
      phone: '+1 (555) 507-2293',
      attendeeId: 'ATT-2293',
    },
    ticketType: 'VIP Access',
    quantity: 1,
    amount: '150.00',
    status: 'completed',
    date: 'Jan 5, 2026',
    purchasedAt: 'Jan 5, 2026, 3:44 PM',
    paymentMethod: 'Mastercard •••• 5509',
    transactionId: 'TXN-7H2N-2293',
    promoCode: 'VIP20',
    checkInStatus: 'Not checked in',
    notes: 'Requested front-of-stage access.',
  },
  {
    id: '5847232',
    customer: {
      name: 'Lucas Ferreira',
      email: 'lferreira@email.com',
      phone: '+1 (555) 129-4470',
      attendeeId: 'ATT-4470',
    },
    ticketType: 'Student Discount',
    quantity: 2,
    amount: '60.00',
    status: 'pending',
    date: 'Jan 5, 2026',
    purchasedAt: 'Jan 5, 2026, 6:17 PM',
    paymentMethod: 'Pending payment verification',
    transactionId: 'TXN-PEND-4470',
    promoCode: 'STUDENT10',
    checkInStatus: 'Not checked in',
    notes: 'Group student booking — IDs pending.',
  },
  {
    id: '5847231',
    customer: {
      name: 'Aisha Okafor',
      email: 'aisha.ok@email.com',
      phone: '+1 (555) 883-6614',
      attendeeId: 'ATT-6614',
    },
    ticketType: 'Early Bird GA',
    quantity: 3,
    amount: '135.00',
    status: 'completed',
    date: 'Jan 4, 2026',
    purchasedAt: 'Jan 4, 2026, 11:22 AM',
    paymentMethod: 'Amex •••• 9901',
    transactionId: 'TXN-2K8W-6614',
    promoCode: 'SUMMER2026',
    checkInStatus: 'Not checked in',
    notes: 'No additional notes.',
  },
  {
    id: '5847230',
    customer: {
      name: 'Tom Nakamura',
      email: 'tnakamura@email.com',
      phone: '+1 (555) 441-7730',
      attendeeId: 'ATT-7730',
    },
    ticketType: 'VIP Access',
    quantity: 1,
    amount: '150.00',
    status: 'refunded',
    date: 'Jan 3, 2026',
    purchasedAt: 'Jan 3, 2026, 2:55 PM',
    paymentMethod: 'Visa •••• 0042',
    transactionId: 'TXN-RFD-7730',
    promoCode: null,
    checkInStatus: 'Refunded',
    notes: 'Refunded — event date conflict.',
  },
  {
    id: '5847229',
    customer: {
      name: 'Rachel Obi',
      email: 'rachel.obi@email.com',
      phone: '+1 (555) 670-3341',
      attendeeId: 'ATT-3341',
    },
    ticketType: 'Early Bird GA',
    quantity: 2,
    amount: '90.00',
    status: 'completed',
    date: 'Jan 3, 2026',
    purchasedAt: 'Jan 3, 2026, 10:14 AM',
    paymentMethod: 'Mastercard •••• 8812',
    transactionId: 'TXN-5Q1M-3341',
    promoCode: 'SUMMER2026',
    checkInStatus: 'Not checked in',
    notes: 'No additional notes.',
  },
  {
    id: '5847228',
    customer: {
      name: 'Carlos Mendez',
      email: 'c.mendez@email.com',
      phone: '+1 (555) 219-5566',
      attendeeId: 'ATT-5566',
    },
    ticketType: 'Student Discount',
    quantity: 1,
    amount: '30.00',
    status: 'pending',
    date: 'Jan 2, 2026',
    purchasedAt: 'Jan 2, 2026, 7:30 PM',
    paymentMethod: 'Pending payment verification',
    transactionId: 'TXN-PEND-5566',
    promoCode: 'STUDENT10',
    checkInStatus: 'Not checked in',
    notes: 'Student ID not yet verified.',
  },
  {
    id: '5847227',
    customer: {
      name: 'Nina Patel',
      email: 'nina.p@email.com',
      phone: '+1 (555) 334-9920',
      attendeeId: 'ATT-9920',
    },
    ticketType: 'VIP Access',
    quantity: 2,
    amount: '300.00',
    status: 'completed',
    date: 'Jan 2, 2026',
    purchasedAt: 'Jan 2, 2026, 1:48 PM',
    paymentMethod: 'Visa •••• 7741',
    transactionId: 'TXN-8B3X-9920',
    promoCode: 'VIP20',
    checkInStatus: 'Not checked in',
    notes: 'Backstage pass requested at will-call.',
  },
  {
    id: '5847226',
    customer: {
      name: 'James Okonkwo',
      email: 'j.okonkwo@email.com',
      phone: '+1 (555) 882-1104',
      attendeeId: 'ATT-1104',
    },
    ticketType: 'Early Bird GA',
    quantity: 3,
    amount: '135.00',
    status: 'completed',
    date: 'Jan 1, 2026',
    purchasedAt: 'Jan 1, 2026, 5:22 PM',
    paymentMethod: 'Amex •••• 6630',
    transactionId: 'TXN-3W7V-1104',
    promoCode: null,
    checkInStatus: 'Not checked in',
    notes: 'Group booking — single point of contact.',
  },
];

const mockWaitlist = [
  {
    id: '1',
    name: 'Alex Thompson',
    email: 'alex.t@email.com',
    ticketsWanted: 2,
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.g@email.com',
    ticketsWanted: 1,
  },
  {
    id: '3',
    name: 'James Wilson',
    email: 'jwilson@email.com',
    ticketsWanted: 3,
  },
];

const filterOptions = [
  'Status: Completed',
  'Status: Pending',
  'Status: Refunded',
  'Date: Last 7 days',
  'Date: Last 30 days',
  'Ticket: Early Bird GA',
  'Ticket: VIP Access',
  'Ticket: Student Discount',
  'Amount: Under $50',
  'Amount: $50 - $150',
  'Amount: Over $150',
  'Quantity: 1',
  'Quantity: 2',
  'Quantity: 3+',
];

export function OrdersSection() {
  const fieldIdPrefix = useId();
  const [orders, setOrders] = useState<OrderRecord[]>(initialOrders);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [activeOrderActionId, setActiveOrderActionId] = useState<string | null>(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(initialOrders[0].id);
  const [refundReason, setRefundReason] = useState('Customer requested cancellation');
  const [draftNotes, setDraftNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState('');
  const [exportState, setExportState] = useState<ExportState>('idle');
  const [showAllOrders, setShowAllOrders] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  const getFieldId = (field: string) => `${fieldIdPrefix}-${field}`;

  const {
    dialogRef: orderDetailsDialogRef,
    titleId: orderDetailsTitleId,
    descriptionId: orderDetailsDescriptionId,
  } = useModalA11y({
    isOpen: showOrderDetailsModal,
    onClose: () => setShowOrderDetailsModal(false),
  });

  const {
    dialogRef: refundDialogRef,
    titleId: refundTitleId,
    descriptionId: refundDescriptionId,
  } = useModalA11y({
    isOpen: showRefundModal,
    onClose: () => setShowRefundModal(false),
  });

  const {
    dialogRef: notesDialogRef,
    titleId: notesTitleId,
    descriptionId: notesDescriptionId,
  } = useModalA11y({
    isOpen: showNotesModal,
    onClose: () => setShowNotesModal(false),
  });

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const queryFilteredOrders = query
      ? orders.filter((order) =>
          [
            order.id,
            order.customer.name,
            order.customer.email,
            order.customer.attendeeId,
            order.ticketType,
          ].some((value) => value.toLowerCase().includes(query))
        )
      : orders;

    if (selectedFilters.length === 0) return queryFilteredOrders;

    return queryFilteredOrders.filter((order) =>
      selectedFilters.every((selectedFilter) => {
        if (selectedFilter === 'Status: Completed') return order.status === 'completed';
        if (selectedFilter === 'Status: Pending') return order.status === 'pending';
        if (selectedFilter === 'Status: Refunded') return order.status === 'refunded';
        if (selectedFilter === 'Ticket: Early Bird GA') return order.ticketType.includes('Early Bird GA');
        if (selectedFilter === 'Ticket: VIP Access') return order.ticketType.includes('VIP Access');
        if (selectedFilter === 'Ticket: Student Discount') return order.ticketType.includes('Student Discount');
        if (selectedFilter === 'Amount: Under $50') return Number(order.amount) < 50;
        if (selectedFilter === 'Amount: $50 - $150') {
          const amount = Number(order.amount);
          return amount >= 50 && amount <= 150;
        }
        if (selectedFilter === 'Amount: Over $150') return Number(order.amount) > 150;
        if (selectedFilter === 'Quantity: 1') return order.quantity === 1;
        if (selectedFilter === 'Quantity: 2') return order.quantity === 2;
        if (selectedFilter === 'Quantity: 3+') return order.quantity >= 3;
        return true;
      })
    );
  }, [orders, searchQuery, selectedFilters]);

  const stats = useMemo(() => {
    const completed = orders.filter((order) => order.status === 'completed').length;
    const pending = orders.filter((order) => order.status === 'pending').length;
    const refunded = orders.filter((order) => order.status === 'refunded').length;
    const revenue = orders
      .filter((order) => order.status !== 'refunded')
      .reduce((sum, order) => sum + Number(order.amount), 0);

    return { completed, pending, refunded, revenue };
  }, [orders]);

  useEffect(() => {
    if (!activeOrderActionId) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!actionMenuRef.current) return;
      const targetNode = event.target as Node;
      if (!actionMenuRef.current.contains(targetNode)) {
        setActiveOrderActionId(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveOrderActionId(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeOrderActionId]);

  useEffect(() => {
    if (exportState !== 'exporting') return;

    const timeoutId = window.setTimeout(() => {
      setExportState('ready');
      setActionNotice('Order export is ready. CSV prepared with current filters.');
    }, 850);

    return () => window.clearTimeout(timeoutId);
  }, [exportState]);

  const handleFilterClick = () => {
    setShowFilterOptions((current) => !current);
  };

  const toggleFilterOption = (option: string) => {
    setSelectedFilters((currentFilters) =>
      currentFilters.includes(option)
        ? currentFilters.filter((filter) => filter !== option)
        : [...currentFilters, option]
    );
  };

  const handleRowActionClick = (orderId: string) => {
    setActiveOrderActionId((currentOrderId) => (currentOrderId === orderId ? null : orderId));
  };

  const handleExport = () => {
    setExportState('exporting');
    setActionNotice('Preparing order export...');
  };

  const handleOrderActionSelect = (order: OrderRecord, action: string) => {
    setSelectedOrderId(order.id);

    if (action === 'More details') {
      setShowOrderDetailsModal(true);
      setActiveOrderActionId(null);
      return;
    }

    if (action === 'View attendee') {
      setActionNotice(`Attendee panel opened for ${order.customer.name}.`);
      setActiveOrderActionId(null);
      return;
    }

    if (action === 'Resend confirmation') {
      setActionNotice(`Confirmation resent for order #${order.id}.`);
      setActiveOrderActionId(null);
      return;
    }

    if (action === 'Mark paid') {
      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.id === order.id
            ? {
                ...currentOrder,
                status: 'completed',
                paymentMethod:
                  currentOrder.paymentMethod === 'Pending payment verification'
                    ? 'Manual payment confirmed'
                    : currentOrder.paymentMethod,
                notes: `${currentOrder.notes} Payment marked as collected by organizer.`,
              }
            : currentOrder
        )
      );
      setActionNotice(`Order #${order.id} marked as paid.`);
      setActiveOrderActionId(null);
      return;
    }

    if (action === 'Refund order') {
      setRefundReason('Customer requested cancellation');
      setShowRefundModal(true);
      setActiveOrderActionId(null);
      return;
    }

    if (action === 'Edit notes') {
      setDraftNotes(order.notes);
      setShowNotesModal(true);
      setActiveOrderActionId(null);
    }
  };

  const submitRefund = () => {
    if (!selectedOrder) return;

    setOrders((currentOrders) =>
      currentOrders.map((currentOrder) =>
        currentOrder.id === selectedOrder.id
          ? {
              ...currentOrder,
              status: 'refunded',
              checkInStatus: 'Refunded',
              notes: `${currentOrder.notes} Refund issued: ${refundReason}.`,
            }
          : currentOrder
      )
    );
    setActionNotice(`Refund issued for order #${selectedOrder.id}.`);
    setShowRefundModal(false);
  };

  const saveNotes = () => {
    if (!selectedOrder) return;

    setOrders((currentOrders) =>
      currentOrders.map((currentOrder) =>
        currentOrder.id === selectedOrder.id
          ? {
              ...currentOrder,
              notes: draftNotes.trim() || 'No organizer notes added.',
            }
          : currentOrder
      )
    );
    setActionNotice(`Notes saved for order #${selectedOrder.id}.`);
    setShowNotesModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-row items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Orders & Registration</h2>
            <p className="mt-1 text-sm text-gray-500">
              Track ticket payments, attendee details, refunds, and export-ready order history.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                id={getFieldId('search-orders')}
                aria-label="Search orders"
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-56 rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
              />
            </div>
            <button
              type="button"
              onClick={handleFilterClick}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-50"
              aria-expanded={showFilterOptions}
              aria-controls="orders-filter-options"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={exportState === 'exporting'}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              {exportState === 'exporting'
                ? 'Preparing…'
                : exportState === 'ready'
                  ? 'CSV Ready'
                  : 'Export CSV'}
            </button>
          </div>
        </div>

        {actionNotice ? (
          <div className="mb-5 rounded-xl border border-[#7626c6]/20 bg-[#f5ecfd] px-4 py-3 text-sm font-medium text-[#7626c6]" aria-live="polite">
            {actionNotice}
          </div>
        ) : null}

        {showFilterOptions ? (
          <div id="orders-filter-options" className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Filter Options</h3>
              <button
                type="button"
                onClick={() => setSelectedFilters([])}
                className="rounded border border-gray-300 px-2 py-1 text-xs transition-colors hover:bg-white"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const isSelected = selectedFilters.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleFilterOption(option)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      isSelected
                        ? 'border-[#7626c6] bg-[#7626c6] text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-[#7626c6] hover:text-[#7626c6]'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-4 gap-4">
          <StatCard label="Completed" value={String(stats.completed)} tone="green" />
          <StatCard label="Pending" value={String(stats.pending)} tone="yellow" />
          <StatCard label="Refunded" value={String(stats.refunded)} tone="red" />
          <StatCard label="Total Revenue" value={`$${stats.revenue.toFixed(2)}`} tone="blue" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_360px]">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
          <ContentState
            isEmpty={filteredOrders.length === 0}
            emptyMessage="No orders match your current filters."
            className="m-6 py-16"
          >
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tickets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(showAllOrders ? filteredOrders : filteredOrders.slice(0, 4)).map((order) => (
                  <tr
                    key={order.id}
                    className={`transition-colors hover:bg-gray-50 ${
                      selectedOrderId === order.id ? 'bg-[#faf6ff]' : ''
                    }`}
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setActionNotice(`Attendee panel opened for ${order.customer.name}.`);
                        }}
                        className="font-mono text-sm text-[#7626c6] transition hover:text-[#5f1fa3]"
                      >
                        #{order.id}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">{order.ticketType}</div>
                      <div className="text-sm text-gray-500">Qty: {order.quantity}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-gray-900">${order.amount}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <OrderStatus status={order.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.date}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div
                        className="relative inline-block text-left"
                        ref={activeOrderActionId === order.id ? actionMenuRef : null}
                      >
                        <button
                          type="button"
                          aria-label={`Actions for order ${order.id}`}
                          onClick={() => handleRowActionClick(order.id)}
                          className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                          aria-haspopup="menu"
                          aria-expanded={activeOrderActionId === order.id}
                          aria-controls={activeOrderActionId === order.id ? `order-actions-${order.id}` : undefined}
                        >
                          <MoreVertical className="h-4 w-4 text-gray-600" />
                        </button>

                        {activeOrderActionId === order.id ? (
                          <div
                            id={`order-actions-${order.id}`}
                            role="menu"
                            aria-label={`Order ${order.id} actions`}
                            className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-xl"
                          >
                            <ActionMenuButton
                              label="More details"
                              onClick={() => handleOrderActionSelect(order, 'More details')}
                            />
                            <ActionMenuButton
                              label="View attendee"
                              onClick={() => handleOrderActionSelect(order, 'View attendee')}
                            />
                            <ActionMenuButton
                              label="Resend confirmation"
                              onClick={() => handleOrderActionSelect(order, 'Resend confirmation')}
                            />
                            {order.status === 'pending' ? (
                              <ActionMenuButton
                                label="Mark paid"
                                onClick={() => handleOrderActionSelect(order, 'Mark paid')}
                              />
                            ) : null}
                            {order.status !== 'refunded' ? (
                              <ActionMenuButton
                                label="Refund order"
                                onClick={() => handleOrderActionSelect(order, 'Refund order')}
                              />
                            ) : null}
                            <ActionMenuButton
                              label="Edit notes"
                              onClick={() => handleOrderActionSelect(order, 'Edit notes')}
                            />
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ContentState>
          </div>
          {filteredOrders.length > 4 && (
            <div className="border-t border-gray-200 px-6 py-3 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAllOrders((prev) => !prev)}
                className="flex items-center gap-1 text-sm font-medium text-[#5f1fa3] hover:text-[#4d1c84] transition-colors"
              >
                {showAllOrders ? 'Show less' : `View all ${filteredOrders.length} orders`}
              </button>
            </div>
          )}
        </div>

        <aside className="overflow-hidden rounded-[28px] border border-gray-200 bg-white">

          {/* Card header */}
          <div className="border-b border-gray-100 px-6 py-6">
            <h3 className="ui-card-title">Attendee Detail</h3>
            <p className="mt-2 text-xs text-gray-500">Select an order to inspect the attendee.</p>
          </div>

          {selectedOrder ? (
            <div className="p-6 space-y-4">

              {/* Avatar + name subcard */}
              <div className="flex items-center gap-3 rounded-[22px] border border-gray-200 bg-gray-50 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#f1e5fb] text-sm font-semibold text-[#7626c6]">
                  {selectedOrder.customer.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{selectedOrder.customer.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500 truncate">{selectedOrder.customer.email}</p>
                </div>
              </div>

              {/* Metadata list subcard */}
              <div className="overflow-hidden rounded-[22px] border border-gray-200 divide-y divide-gray-100">
                {[
                  { label: 'Attendee ID', value: selectedOrder.customer.attendeeId },
                  { label: 'Order',       value: `#${selectedOrder.id}` },
                  { label: 'Contact',     value: selectedOrder.customer.phone },
                  { label: 'Check-in',    value: selectedOrder.checkInStatus },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-4 px-4 py-3">
                    <span className="w-20 flex-shrink-0 text-xs font-medium text-gray-400">{row.label}</span>
                    <span className="text-xs text-gray-700 capitalize leading-5">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Notes subcard */}
              <div className="rounded-[22px] border border-gray-200 bg-gray-50 p-4">
                <p className="mb-2 text-xs font-medium text-gray-400">Notes</p>
                <p className="text-sm leading-6 text-gray-700">{selectedOrder.notes}</p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => { setDraftNotes(selectedOrder.notes); setShowNotesModal(true); }}
                  className="ui-button ui-button--outline ui-button--size-sm"
                >
                  Edit notes
                </button>
                <button
                  type="button"
                  onClick={() => setShowOrderDetailsModal(true)}
                  className="ui-button ui-button--default ui-button--size-sm"
                >
                  Open full order
                </button>
              </div>

            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <UserRound className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-4 text-sm font-medium text-gray-900">No attendee selected</p>
              <p className="mt-2 text-xs text-gray-500">Select an order to open attendee details.</p>
            </div>
          )}
        </aside>
      </div>

      {showOrderDetailsModal && selectedOrder ? (
        <ModalShell onClose={() => setShowOrderDetailsModal(false)}>
          <div
            ref={orderDetailsDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={orderDetailsTitleId}
            aria-describedby={orderDetailsDescriptionId}
            tabIndex={-1}
            className="ticketing-modal-card rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
          >
            <h3 id={orderDetailsTitleId} className="mb-1 text-xl font-semibold text-gray-900">
              Attendee & Order Details
            </h3>
            <p id={orderDetailsDescriptionId} className="mb-5 text-sm text-gray-600">
              Order #{selectedOrder.id}
            </p>

            <div className="ticketing-modal-body space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ReadOnlyField id={getFieldId('attendee-name')} label="Attendee Name" value={selectedOrder.customer.name} />
                <ReadOnlyField id={getFieldId('attendee-email')} label="Email" value={selectedOrder.customer.email} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ReadOnlyField id={getFieldId('attendee-phone')} label="Phone" value={selectedOrder.customer.phone} />
                <ReadOnlyField id={getFieldId('attendee-id')} label="Attendee ID" value={selectedOrder.customer.attendeeId} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <ReadOnlyField id={getFieldId('ticket-type')} label="Ticket Type" value={selectedOrder.ticketType} />
                <ReadOnlyField id={getFieldId('ticket-quantity')} label="Quantity" value={String(selectedOrder.quantity)} />
                <ReadOnlyField id={getFieldId('ticket-amount')} label="Amount" value={`$${selectedOrder.amount}`} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <ReadOnlyField id={getFieldId('order-status')} label="Status" value={selectedOrder.status} capitalize />
                <ReadOnlyField id={getFieldId('order-date')} label="Order Date" value={selectedOrder.date} />
                <ReadOnlyField id={getFieldId('purchased-at')} label="Purchased At" value={selectedOrder.purchasedAt} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ReadOnlyField id={getFieldId('payment-method')} label="Payment Method" value={selectedOrder.paymentMethod} />
                <ReadOnlyField id={getFieldId('transaction-id')} label="Transaction ID" value={selectedOrder.transactionId} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ReadOnlyField id={getFieldId('promo-code')} label="Promo Code" value={selectedOrder.promoCode || 'None'} />
                <ReadOnlyField id={getFieldId('check-in-status')} label="Check-in Status" value={selectedOrder.checkInStatus} />
              </div>

              <div>
                <label htmlFor={getFieldId('order-notes')} className="mb-1 block text-xs font-medium text-gray-500">
                  Notes
                </label>
                <textarea
                  id={getFieldId('order-notes')}
                  readOnly
                  rows={3}
                  value={selectedOrder.notes}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3 border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={() => setShowOrderDetailsModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </ModalShell>
      ) : null}

      {showRefundModal && selectedOrder ? (
        <ModalShell onClose={() => setShowRefundModal(false)}>
          <div
            ref={refundDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={refundTitleId}
            aria-describedby={refundDescriptionId}
            tabIndex={-1}
            className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
          >
            <h3 id={refundTitleId} className="text-xl font-semibold text-gray-900">
              Refund order
            </h3>
            <p id={refundDescriptionId} className="mt-1 text-sm text-gray-600">
              Review the refund for order #{selectedOrder.id} before submitting it.
            </p>

            <div className="mt-5 space-y-4">
              <ReadOnlyField id={getFieldId('refund-order-id')} label="Order" value={`#${selectedOrder.id}`} />
              <ReadOnlyField id={getFieldId('refund-amount')} label="Refund Amount" value={`$${selectedOrder.amount}`} />

              <div>
                <label htmlFor={getFieldId('refund-reason')} className="mb-1 block text-xs font-medium text-gray-500">
                  Refund reason
                </label>
                <textarea
                  id={getFieldId('refund-reason')}
                  rows={3}
                  value={refundReason}
                  onChange={(event) => setRefundReason(event.target.value)}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={() => setShowRefundModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitRefund}
                className="rounded-lg bg-[#7626c6] px-4 py-2 text-white transition-colors hover:bg-[#5f1fa3]"
              >
                Confirm refund
              </button>
            </div>
          </div>
        </ModalShell>
      ) : null}

      {showNotesModal && selectedOrder ? (
        <ModalShell onClose={() => setShowNotesModal(false)}>
          <div
            ref={notesDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={notesTitleId}
            aria-describedby={notesDescriptionId}
            tabIndex={-1}
            className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
          >
            <h3 id={notesTitleId} className="text-xl font-semibold text-gray-900">
              Edit organizer notes
            </h3>
            <p id={notesDescriptionId} className="mt-1 text-sm text-gray-600">
              Update internal notes for order #{selectedOrder.id}.
            </p>

            <div className="mt-5">
              <label htmlFor={getFieldId('notes-editor')} className="mb-1 block text-xs font-medium text-gray-500">
                Notes
              </label>
              <textarea
                id={getFieldId('notes-editor')}
                rows={5}
                value={draftNotes}
                onChange={(event) => setDraftNotes(event.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={() => setShowNotesModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveNotes}
                className="rounded-lg bg-[#7626c6] px-4 py-2 text-white transition-colors hover:bg-[#5f1fa3]"
              >
                Save notes
              </button>
            </div>
          </div>
        </ModalShell>
      ) : null}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Waitlist</h3>
            <p className="text-sm text-gray-600">Manage customers waiting for tickets</p>
          </div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            15 waiting
          </span>
        </div>

        <div className="space-y-3">
          <ContentState isEmpty={mockWaitlist.length === 0} emptyMessage="No waitlist entries." className="py-14">
            {mockWaitlist.map((person) => (
              <div key={person.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-700">
                    {person.name
                      .split(' ')
                      .map((name) => name[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{person.name}</div>
                    <div className="text-sm text-gray-500">{person.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">Wants {person.ticketsWanted} tickets</div>
                  <button
                    type="button"
                    className="rounded bg-[#7626c6] px-3 py-1 text-sm text-white transition-colors hover:bg-[#5f1fa3]"
                  >
                    Release Ticket
                  </button>
                </div>
              </div>
            ))}
          </ContentState>
        </div>
      </div>
    </div>
  );
}

function ActionMenuButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-[#7626c6]/10 hover:text-[#7626c6]"
    >
      {label}
    </button>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: 'green' | 'yellow' | 'red' | 'blue' }) {
  const toneClass =
    tone === 'green'
      ? 'bg-green-50 text-green-900'
      : tone === 'yellow'
        ? 'bg-yellow-50 text-yellow-900'
        : tone === 'red'
          ? 'bg-red-50 text-red-900'
          : 'bg-blue-50 text-blue-900';

  const labelClass =
    tone === 'green'
      ? 'text-green-600'
      : tone === 'yellow'
        ? 'text-yellow-600'
        : tone === 'red'
          ? 'text-red-600'
          : 'text-blue-600';

  return (
    <div className={`rounded-lg p-4 ${toneClass}`}>
      <div className={`mb-1 text-sm ${labelClass}`}>{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
      <div className="rounded-lg bg-gray-100 p-2">
        <Icon className="h-4 w-4 text-gray-600" />
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">{label}</div>
        <div className="mt-1 text-sm font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );
}

function ReadOnlyField({
  id,
  label,
  value,
  capitalize = false,
}: {
  id: string;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-gray-500">
        {label}
      </label>
      <input
        id={id}
        readOnly
        value={value}
        className={`w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 ${
          capitalize ? 'capitalize' : ''
        }`}
      />
    </div>
  );
}

function ModalShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="ticketing-modal-overlay">
      <div className="ticketing-modal-backdrop" onClick={onClose} />
      {children}
    </div>
  );
}

function OrderStatus({ status }: { status: OrderStatusValue }) {
  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: 'text-green-700',
      bg: 'bg-green-100',
      label: 'Completed',
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-700',
      bg: 'bg-yellow-100',
      label: 'Pending',
    },
    refunded: {
      icon: XCircle,
      color: 'text-red-700',
      bg: 'bg-red-100',
      label: 'Refunded',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
