import { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Clock } from 'lucide-react';
import { ContentState } from '../ui/ContentState';
import { useModalA11y } from '../../hooks/useModalA11y';

export function TicketingSection() {
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [showCreateCodeModal, setShowCreateCodeModal] = useState(false);
  const [promoCodes, setPromoCodes] = useState(mockPromoCodes);
  const {
    dialogRef: addTicketDialogRef,
    titleId: addTicketTitleId,
    descriptionId: addTicketDescriptionId
  } = useModalA11y({
    isOpen: showAddTicketModal,
    onClose: () => setShowAddTicketModal(false)
  });
  const {
    dialogRef: createCodeDialogRef,
    titleId: createCodeTitleId,
    descriptionId: createCodeDescriptionId
  } = useModalA11y({
    isOpen: showCreateCodeModal,
    onClose: () => setShowCreateCodeModal(false)
  });

  const handleDeletePromoCode = (promoId: string, promoCode: string) => {
    setPromoCodes((currentPromoCodes) =>
      currentPromoCodes.filter((promo) => promo.id !== promoId)
    );
    console.log(`[Ticketing] Promo code removed: ${promoCode}`);
  };

  return (
    <div className="relative space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Ticket Types</h2>
          <p className="text-gray-600 mt-1">Configure your event tickets and pricing</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddTicketModal(true)}
          className="flex items-center gap-2 bg-[#7626c6] text-white btn-glass px-4 py-2 rounded-lg hover:bg-[#5f1fa3] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Ticket Type
        </button>
      </div>

      {/* Existing Tickets */}
      <div className="space-y-4">
        <ContentState
          isEmpty={mockTickets.length === 0}
          emptyMessage="No ticket types configured."
          className="py-14"
        >
          {mockTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{ticket.name}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      ticket.type === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : ticket.type === 'free'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {ticket.type.toUpperCase()}
                  </span>
                  {ticket.isEarlyBird && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                      EARLY BIRD
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{ticket.description}</p>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Sales: {ticket.salesPeriod}</span>
                  </div>
                  <div>
                    Sold: <span className="font-medium text-gray-900">{ticket.sold}</span> / {ticket.quantity}
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#7626c6]"
                      style={{ width: `${(ticket.sold / ticket.quantity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${ticket.price}</div>
                  {ticket.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">${ticket.originalPrice}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button type="button" className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label={`Edit ${ticket.name}`}>
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button type="button" className="p-2 hover:bg-red-50 rounded-lg transition-colors" aria-label={`Delete ${ticket.name}`}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>

            {ticket.addOns && ticket.addOns.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Available Add-ons:</h4>
                <div className="flex gap-2">
                  {ticket.addOns.map((addon, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {addon}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          ))}
        </ContentState>
      </div>

      {/* Promo Codes Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#7626c6]" />
            <h3 className="text-lg font-semibold text-gray-900">Promo Codes</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateCodeModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Code
          </button>
        </div>

        <div className="space-y-3">
          <ContentState
            isEmpty={promoCodes.length === 0}
            emptyMessage="No promo codes created yet."
            className="py-14"
          >
            {promoCodes.map((promo) => (
            <div key={promo.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-white px-4 py-2 rounded border border-gray-300 font-mono text-sm font-medium">
                  {promo.code}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{promo.discount}</div>
                  <div className="text-sm text-gray-600">{promo.used} uses • {promo.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">{promo.expires}</div>
                <button
                  type="button"
                  aria-label={`Delete promo code ${promo.code}`}
                  onClick={() => handleDeletePromoCode(promo.id, promo.code)}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            ))}
          </ContentState>
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ticket Add-ons</h3>
          <button type="button" className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {['Parking Pass - $20', 'Event T-Shirt - $25', 'VIP Lounge Access - $50'].map((addon, idx) => (
            <div key={idx} className="p-4 border border-gray-300 rounded-lg hover:border-[#7626c6] transition-colors">
              <div className="text-gray-900 font-medium mb-1">{addon}</div>
              <div className="text-sm text-gray-600">Available as add-on</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Ticket Type Modal */}
      {showAddTicketModal && (
        <div className="ticketing-modal-overlay">
          <div
            className="ticketing-modal-backdrop"
            onClick={() => setShowAddTicketModal(false)}
          />
          <div
            ref={addTicketDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={addTicketTitleId}
            aria-describedby={addTicketDescriptionId}
            tabIndex={-1}
            className="ticketing-modal-card bg-white rounded-2xl border border-gray-200 shadow-2xl p-6"
          >
            <h3 id={addTicketTitleId} className="text-xl font-semibold text-gray-900 mb-1">Add Ticket Type</h3>
            <p id={addTicketDescriptionId} className="text-sm text-gray-600 mb-5">Create a new ticket for this event.</p>

            <div className="ticketing-modal-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Name</label>
                  <input
                    type="text"
                    placeholder="e.g., General Admission"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent">
                    <option value="paid">Paid</option>
                    <option value="free">Free</option>
                    <option value="donation">Donation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    placeholder="50.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min/Max per Order</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of what's included"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700">Early Bird Pricing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700">Reserved Seating</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700">Timed Entry</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => setShowAddTicketModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowAddTicketModal(false)}
                className="px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Promo Code Modal */}
      {showCreateCodeModal && (
        <div className="ticketing-modal-overlay">
          <div
            className="ticketing-modal-backdrop"
            onClick={() => setShowCreateCodeModal(false)}
          />
          <div
            ref={createCodeDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={createCodeTitleId}
            aria-describedby={createCodeDescriptionId}
            tabIndex={-1}
            className="ticketing-modal-card ticketing-modal-card--code bg-white rounded-2xl border border-gray-200 shadow-2xl p-6"
          >
            <h3 id={createCodeTitleId} className="text-xl font-semibold text-gray-900 mb-1">Create Promo Code</h3>
            <p id={createCodeDescriptionId} className="text-sm text-gray-600 mb-5">Set discount rules and availability.</p>

            <div className="ticketing-modal-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                  <input
                    type="text"
                    placeholder="e.g., SUMMER2026"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent">
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
                  <input
                    type="number"
                    placeholder="20"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Applies To</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent">
                  <option>All ticket types</option>
                  <option>General Admission only</option>
                  <option>VIP tickets only</option>
                  <option>Student tickets only</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowCreateCodeModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowCreateCodeModal(false)}
                className="px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors"
              >
                Create Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const mockTickets = [
  {
    id: '1',
    name: 'Early Bird General Admission',
    type: 'paid',
    price: 45,
    originalPrice: 60,
    description: 'Get 25% off regular price. Limited availability!',
    quantity: 500,
    sold: 387,
    salesPeriod: 'Mar 1 - May 15',
    isEarlyBird: true,
    addOns: ['Parking Pass', 'Event T-Shirt']
  },
  {
    id: '2',
    name: 'VIP Access',
    type: 'paid',
    price: 150,
    description: 'Front row seating, backstage tour, exclusive lounge access',
    quantity: 100,
    sold: 78,
    salesPeriod: 'Mar 1 - Jun 15',
    isEarlyBird: false,
    addOns: ['VIP Lounge', 'Meet & Greet']
  },
  {
    id: '3',
    name: 'Student Discount',
    type: 'paid',
    price: 30,
    description: 'Valid student ID required at entry',
    quantity: 200,
    sold: 134,
    salesPeriod: 'Apr 1 - Jun 15',
    isEarlyBird: false,
    addOns: []
  }
];

const mockPromoCodes = [
  {
    id: '1',
    code: 'SUMMER2026',
    discount: '20% off',
    used: 47,
    type: 'Public',
    expires: 'Expires May 31'
  },
  {
    id: '2',
    code: 'VIPACCESS',
    discount: '$25 off VIP tickets',
    used: 12,
    type: 'Access Code',
    expires: 'Expires Jun 1'
  }
];
