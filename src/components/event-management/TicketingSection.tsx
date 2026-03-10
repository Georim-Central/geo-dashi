import { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Clock } from 'lucide-react';
import { ContentState } from '../ui/ContentState';
import { useModalA11y } from '../../hooks/useModalA11y';

type TicketType = {
  id: string;
  name: string;
  type: 'paid' | 'free' | 'donation';
  price: number;
  originalPrice?: number;
  description: string;
  quantity: number;
  sold: number;
  salesPeriod: string;
  isEarlyBird: boolean;
  addOns: string[];
  minPerOrder?: number;
  maxPerOrder?: number;
  reservedSeating?: boolean;
  timedEntry?: boolean;
};

type TicketFormState = {
  name: string;
  type: TicketType['type'];
  price: string;
  quantity: string;
  minPerOrder: string;
  maxPerOrder: string;
  description: string;
  isEarlyBird: boolean;
  reservedSeating: boolean;
  timedEntry: boolean;
};

export function TicketingSection() {
  const [tickets, setTickets] = useState<TicketType[]>(mockTickets);
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [showCreateCodeModal, setShowCreateCodeModal] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [ticketForm, setTicketForm] = useState<TicketFormState>(emptyTicketFormState);
  const [ticketFormError, setTicketFormError] = useState('');
  const [promoCodes, setPromoCodes] = useState(mockPromoCodes);

  const closeTicketModal = () => {
    setShowAddTicketModal(false);
    setEditingTicketId(null);
    setTicketForm(emptyTicketFormState);
    setTicketFormError('');
  };

  const openAddTicketModal = () => {
    setEditingTicketId(null);
    setTicketForm(emptyTicketFormState);
    setTicketFormError('');
    setShowAddTicketModal(true);
  };

  const openEditTicketModal = (ticket: TicketType) => {
    setEditingTicketId(ticket.id);
    setTicketForm({
      name: ticket.name,
      type: ticket.type,
      price: String(ticket.price),
      quantity: String(ticket.quantity),
      minPerOrder: String(ticket.minPerOrder ?? 1),
      maxPerOrder: String(ticket.maxPerOrder ?? 10),
      description: ticket.description,
      isEarlyBird: ticket.isEarlyBird,
      reservedSeating: Boolean(ticket.reservedSeating),
      timedEntry: Boolean(ticket.timedEntry)
    });
    setTicketFormError('');
    setShowAddTicketModal(true);
  };

  const handleTicketFormChange = <K extends keyof TicketFormState>(field: K, value: TicketFormState[K]) => {
    setTicketForm((currentForm) => ({ ...currentForm, [field]: value }));
    if (ticketFormError) setTicketFormError('');
  };

  const handleSaveTicket = () => {
    const ticketName = ticketForm.name.trim();
    const description = ticketForm.description.trim();
    const price = Number(ticketForm.price);
    const quantity = Number(ticketForm.quantity);
    const minPerOrder = Number(ticketForm.minPerOrder);
    const maxPerOrder = Number(ticketForm.maxPerOrder);

    if (!ticketName) {
      setTicketFormError('Please enter a ticket name.');
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setTicketFormError('Please enter a valid price.');
      return;
    }

    if (!Number.isFinite(quantity) || quantity < 1) {
      setTicketFormError('Please enter a valid quantity.');
      return;
    }

    if (!Number.isFinite(minPerOrder) || minPerOrder < 1 || !Number.isFinite(maxPerOrder) || maxPerOrder < minPerOrder) {
      setTicketFormError('Min/Max per order values are invalid.');
      return;
    }

    if (editingTicketId) {
      setTickets((currentTickets) =>
        currentTickets.map((ticket) => (
          ticket.id === editingTicketId
            ? {
              ...ticket,
              name: ticketName,
              type: ticketForm.type,
              price,
              quantity,
              sold: Math.min(ticket.sold, quantity),
              description: description || 'No description provided.',
              isEarlyBird: ticketForm.isEarlyBird,
              minPerOrder,
              maxPerOrder,
              reservedSeating: ticketForm.reservedSeating,
              timedEntry: ticketForm.timedEntry
            }
            : ticket
        ))
      );
      closeTicketModal();
      return;
    }

    const newTicket: TicketType = {
      id: `ticket-${Date.now()}`,
      name: ticketName,
      type: ticketForm.type,
      price,
      quantity,
      sold: 0,
      salesPeriod: 'Not set',
      description: description || 'No description provided.',
      isEarlyBird: ticketForm.isEarlyBird,
      addOns: [],
      minPerOrder,
      maxPerOrder,
      reservedSeating: ticketForm.reservedSeating,
      timedEntry: ticketForm.timedEntry
    };

    setTickets((currentTickets) => [newTicket, ...currentTickets]);
    closeTicketModal();
  };

  const handleDeleteTicket = (ticketId: string, ticketName: string) => {
    const shouldDelete = window.confirm(`Delete "${ticketName}" ticket type?`);
    if (!shouldDelete) return;

    setTickets((currentTickets) =>
      currentTickets.filter((ticket) => ticket.id !== ticketId)
    );

    if (editingTicketId === ticketId) {
      closeTicketModal();
    }
  };

  const {
    dialogRef: addTicketDialogRef,
    titleId: addTicketTitleId,
    descriptionId: addTicketDescriptionId
  } = useModalA11y({
    isOpen: showAddTicketModal,
    onClose: closeTicketModal
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
          onClick={openAddTicketModal}
          className="flex items-center gap-2 bg-[#7626c6] text-white btn-glass px-4 py-2 rounded-lg hover:bg-[#5f1fa3] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Ticket Type
        </button>
      </div>

      {/* Existing Tickets */}
      <div className="space-y-4">
        <ContentState
          isEmpty={tickets.length === 0}
          emptyMessage="No ticket types configured."
          className="py-14"
        >
          {tickets.map((ticket) => (
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
                      style={{ width: `${ticket.quantity > 0 ? (ticket.sold / ticket.quantity) * 100 : 0}%` }}
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
                  <button
                    type="button"
                    onClick={() => openEditTicketModal(ticket)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label={`Edit ${ticket.name}`}
                    aria-haspopup="dialog"
                    aria-expanded={showAddTicketModal && editingTicketId === ticket.id}
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTicket(ticket.id, ticket.name)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label={`Delete ${ticket.name}`}
                  >
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
            onClick={closeTicketModal}
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
            <h3 id={addTicketTitleId} className="text-xl font-semibold text-gray-900 mb-1">
              {editingTicketId ? 'Edit Ticket Type' : 'Add Ticket Type'}
            </h3>
            <p id={addTicketDescriptionId} className="text-sm text-gray-600 mb-5">
              {editingTicketId ? 'Update ticket details and pricing.' : 'Create a new ticket for this event.'}
            </p>

            <div className="ticketing-modal-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Name</label>
                  <input
                    type="text"
                    value={ticketForm.name}
                    onChange={(event) => handleTicketFormChange('name', event.target.value)}
                    placeholder="e.g., General Admission"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Type</label>
                  <select
                    value={ticketForm.type}
                    onChange={(event) => handleTicketFormChange('type', event.target.value as TicketType['type'])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  >
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
                    value={ticketForm.price}
                    onChange={(event) => handleTicketFormChange('price', event.target.value)}
                    placeholder="50.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={ticketForm.quantity}
                    onChange={(event) => handleTicketFormChange('quantity', event.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min/Max per Order</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={ticketForm.minPerOrder}
                      onChange={(event) => handleTicketFormChange('minPerOrder', event.target.value)}
                      placeholder="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={ticketForm.maxPerOrder}
                      onChange={(event) => handleTicketFormChange('maxPerOrder', event.target.value)}
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
                  value={ticketForm.description}
                  onChange={(event) => handleTicketFormChange('description', event.target.value)}
                  placeholder="Brief description of what's included"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ticketForm.isEarlyBird}
                    onChange={(event) => handleTicketFormChange('isEarlyBird', event.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Early Bird Pricing</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ticketForm.reservedSeating}
                    onChange={(event) => handleTicketFormChange('reservedSeating', event.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Reserved Seating</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ticketForm.timedEntry}
                    onChange={(event) => handleTicketFormChange('timedEntry', event.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Timed Entry</span>
                </label>
              </div>

              {ticketFormError && (
                <p className="text-sm text-red-600" role="alert">{ticketFormError}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-gray-200 bg-white">
              <button
                type="button"
                onClick={closeTicketModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTicket}
                className="px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors"
              >
                {editingTicketId ? 'Save Changes' : 'Create Ticket'}
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

const emptyTicketFormState: TicketFormState = {
  name: '',
  type: 'paid',
  price: '',
  quantity: '',
  minPerOrder: '1',
  maxPerOrder: '10',
  description: '',
  isEarlyBird: false,
  reservedSeating: false,
  timedEntry: false
};

const mockTickets: TicketType[] = [
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
    addOns: ['Parking Pass', 'Event T-Shirt'],
    minPerOrder: 1,
    maxPerOrder: 10,
    reservedSeating: false,
    timedEntry: false
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
    addOns: ['VIP Lounge', 'Meet & Greet'],
    minPerOrder: 1,
    maxPerOrder: 8,
    reservedSeating: true,
    timedEntry: true
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
    addOns: [],
    minPerOrder: 1,
    maxPerOrder: 4,
    reservedSeating: false,
    timedEntry: true
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
