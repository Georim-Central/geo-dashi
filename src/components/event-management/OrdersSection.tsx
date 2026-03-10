import { Search, Download, Filter, CheckCircle, XCircle, Clock, MoreVertical } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ContentState } from '../ui/ContentState';
import { useModalA11y } from '../../hooks/useModalA11y';

export function OrdersSection() {
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [activeOrderActionId, setActiveOrderActionId] = useState<string | null>(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<(typeof mockOrders)[number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const {
    dialogRef: orderDetailsDialogRef,
    titleId: orderDetailsTitleId,
    descriptionId: orderDetailsDescriptionId
  } = useModalA11y({
    isOpen: showOrderDetailsModal,
    onClose: () => setShowOrderDetailsModal(false)
  });

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
    'Quantity: 3+'
  ];

  const handleFilterClick = () => {
    setShowFilterOptions((current) => !current);
    console.log('[Orders] Filter options:', filterOptions);
  };

  const toggleFilterOption = (option: string) => {
    setSelectedFilters((currentFilters) => {
      const alreadySelected = currentFilters.includes(option);
      const nextFilters = alreadySelected
        ? currentFilters.filter((filter) => filter !== option)
        : [...currentFilters, option];
      console.log('[Orders] Selected filters:', nextFilters);
      return nextFilters;
    });
  };

  const handleRowActionClick = (order: (typeof mockOrders)[number]) => {
    setActiveOrderActionId((currentOrderId) => (currentOrderId === order.id ? null : order.id));
    console.log(`[Orders] Actions opened for order #${order.id}: More details`);
  };

  const handleOrderActionSelect = (order: (typeof mockOrders)[number], action: string) => {
    if (action === 'More details') {
      setSelectedOrder(order);
      setShowOrderDetailsModal(true);
      setActiveOrderActionId(null);
      console.log(`[Orders] Showing attendee details for order #${order.id}`);
      return;
    }
    console.log(`[Orders] ${action} selected for order #${order.id}`);
    setActiveOrderActionId(null);
  };

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const queryFilteredOrders = query
      ? mockOrders.filter((order) =>
          [
            order.id,
            order.customer.name,
            order.customer.email,
            order.customer.attendeeId,
            order.ticketType
          ].some((value) => value.toLowerCase().includes(query))
        )
      : mockOrders;

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
        if (selectedFilter === 'Date: Last 7 days') return true;
        if (selectedFilter === 'Date: Last 30 days') return true;
        return true;
      })
    );
  }, [searchQuery, selectedFilters]);

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

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Orders & Registration</h2>
          <button type="button" className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, name, or email..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={handleFilterClick}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-expanded={showFilterOptions}
            aria-controls="orders-filter-options"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilterOptions && (
          <div id="orders-filter-options" className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Filter Options</h3>
              <button
                type="button"
                onClick={() => setSelectedFilters([])}
                className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-white transition-colors"
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
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      isSelected
                        ? 'bg-[#7626c6] text-white border-[#7626c6]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#7626c6] hover:text-[#7626c6]'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-900">847</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-sm text-yellow-600 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-900">23</div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-red-600 mb-1">Refunded</div>
            <div className="text-2xl font-bold text-red-900">12</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-blue-900">$25,410</div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto overflow-y-visible">
        <ContentState
          isEmpty={filteredOrders.length === 0}
          emptyMessage="No orders match your current filters."
          className="py-16 m-6"
        >
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tickets
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-mono text-sm text-gray-900">#{order.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.ticketType}</div>
                  <div className="text-sm text-gray-500">Qty: {order.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">${order.amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <OrderStatus status={order.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="relative inline-block text-left" ref={activeOrderActionId === order.id ? actionMenuRef : null}>
                    <button
                      type="button"
                      aria-label={`Actions for order ${order.id}`}
                      onClick={() => handleRowActionClick(order)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-haspopup="menu"
                      aria-expanded={activeOrderActionId === order.id}
                      aria-controls={activeOrderActionId === order.id ? `order-actions-${order.id}` : undefined}
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>

                    {activeOrderActionId === order.id && (
                      <div
                        id={`order-actions-${order.id}`}
                        role="menu"
                        aria-label={`Order ${order.id} actions`}
                        className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-20 p-2"
                      >
                        <button
                          type="button"
                          onClick={() => handleOrderActionSelect(order, 'More details')}
                          className="w-full text-left px-3 py-2 text-sm rounded-md bg-[#7626c6]/10 text-[#7626c6] hover:bg-[#7626c6]/15 transition-colors font-medium"
                        >
                          More details
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </ContentState>
      </div>

      {showOrderDetailsModal && selectedOrder && (
        <div className="ticketing-modal-overlay">
          <div
            className="ticketing-modal-backdrop"
            onClick={() => setShowOrderDetailsModal(false)}
          />
          <div
            ref={orderDetailsDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={orderDetailsTitleId}
            aria-describedby={orderDetailsDescriptionId}
            tabIndex={-1}
            className="ticketing-modal-card bg-white rounded-2xl border border-gray-200 shadow-2xl p-6"
          >
            <h3 id={orderDetailsTitleId} className="text-xl font-semibold text-gray-900 mb-1">Attendee & Order Details</h3>
            <p id={orderDetailsDescriptionId} className="text-sm text-gray-600 mb-5">Order #{selectedOrder.id}</p>

            <div className="ticketing-modal-body space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Attendee Name</label>
                  <input
                    readOnly
                    value={selectedOrder.customer.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input
                    readOnly
                    value={selectedOrder.customer.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                  <input
                    readOnly
                    value={selectedOrder.customer.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Attendee ID</label>
                  <input
                    readOnly
                    value={selectedOrder.customer.attendeeId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Ticket Type</label>
                  <input
                    readOnly
                    value={selectedOrder.ticketType}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Quantity</label>
                  <input
                    readOnly
                    value={String(selectedOrder.quantity)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Amount</label>
                  <input
                    readOnly
                    value={`$${selectedOrder.amount}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                  <input
                    readOnly
                    value={selectedOrder.status}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800 capitalize"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Order Date</label>
                  <input
                    readOnly
                    value={selectedOrder.date}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Purchased At</label>
                  <input
                    readOnly
                    value={selectedOrder.purchasedAt}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Payment Method</label>
                  <input
                    readOnly
                    value={selectedOrder.paymentMethod}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Transaction ID</label>
                  <input
                    readOnly
                    value={selectedOrder.transactionId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Promo Code</label>
                  <input
                    readOnly
                    value={selectedOrder.promoCode || 'None'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Check-in Status</label>
                  <input
                    readOnly
                    value={selectedOrder.checkInStatus}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                <textarea
                  readOnly
                  rows={3}
                  value={selectedOrder.notes}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowOrderDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Waitlist</h3>
            <p className="text-sm text-gray-600">Manage customers waiting for tickets</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            15 waiting
          </span>
        </div>

        <div className="space-y-3">
          <ContentState
            isEmpty={mockWaitlist.length === 0}
            emptyMessage="No waitlist entries."
            className="py-14"
          >
            {mockWaitlist.map((person) => (
            <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{person.name}</div>
                  <div className="text-sm text-gray-500">{person.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">Wants {person.ticketsWanted} tickets</div>
                <button type="button" className="px-3 py-1 bg-[#7626c6] text-white btn-glass rounded text-sm hover:bg-[#5f1fa3] transition-colors">
                  Release Ticket
                </button>
              </div>
            </div>
            ))}
          </ContentState>
        </div>
      </div>

      {/* Custom Form Responses */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Form Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Dietary Restrictions</h4>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Vegetarian (47)</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Vegan (23)</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Gluten-Free (18)</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">None (712)</span>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">How did you hear about us?</h4>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Social Media (423)</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Friend (298)</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Email (89)</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Other (37)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderStatus({ status }: { status: string }) {
  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: 'text-green-700',
      bg: 'bg-green-100',
      label: 'Completed'
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-700',
      bg: 'bg-yellow-100',
      label: 'Pending'
    },
    refunded: {
      icon: XCircle,
      color: 'text-red-700',
      bg: 'bg-red-100',
      label: 'Refunded'
    }
  };

  const fallbackConfig = {
    icon: Clock,
    color: 'text-gray-700',
    bg: 'bg-gray-100',
    label: 'Unknown'
  };

  const config = statusConfig[status as keyof typeof statusConfig] ?? fallbackConfig;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

const mockOrders = [
  {
    id: '5847239',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 113-9901',
      attendeeId: 'ATT-3901'
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
    notes: 'Requested ADA seating assistance.'
  },
  {
    id: '5847238',
    customer: {
      name: 'Michael Chen',
      email: 'mchen@email.com',
      phone: '+1 (555) 203-4420',
      attendeeId: 'ATT-4420'
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
    notes: 'VIP lounge wristband pending pickup.'
  },
  {
    id: '5847237',
    customer: {
      name: 'Emily Rodriguez',
      email: 'emily.r@email.com',
      phone: '+1 (555) 774-2015',
      attendeeId: 'ATT-2015'
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
    notes: 'Student ID validation still required.'
  },
  {
    id: '5847236',
    customer: {
      name: 'David Kim',
      email: 'davidk@email.com',
      phone: '+1 (555) 661-3372',
      attendeeId: 'ATT-3372'
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
    notes: '2 of 4 attendees already checked in.'
  },
  {
    id: '5847235',
    customer: {
      name: 'Jessica Brown',
      email: 'jbrown@email.com',
      phone: '+1 (555) 992-1187',
      attendeeId: 'ATT-1187'
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
    notes: 'Refunded due to schedule conflict.'
  }
];

const mockWaitlist = [
  {
    id: '1',
    name: 'Alex Thompson',
    email: 'alex.t@email.com',
    ticketsWanted: 2
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.g@email.com',
    ticketsWanted: 1
  },
  {
    id: '3',
    name: 'James Wilson',
    email: 'jwilson@email.com',
    ticketsWanted: 3
  }
];
