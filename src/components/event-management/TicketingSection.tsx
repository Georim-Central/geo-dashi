import { useId, useState } from 'react';
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

type PromoCode = {
  id: string;
  code: string;
  access: 'public' | 'access';
  discountType: 'percent' | 'fixed';
  discountValue: number;
  appliesTo: string;
  used: number;
  usageLimit: number | null;
  validFrom: string;
  validUntil: string;
};

type PromoFormState = {
  code: string;
  access: PromoCode['access'];
  discountType: PromoCode['discountType'];
  discountValue: string;
  usageLimit: string;
  validFrom: string;
  validUntil: string;
  appliesTo: string;
};

export function TicketingSection() {
  const ticketFormIdPrefix = useId();
  const promoFormIdPrefix = useId();
  const [tickets, setTickets] = useState<TicketType[]>(mockTickets);
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [showCreateCodeModal, setShowCreateCodeModal] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [ticketForm, setTicketForm] = useState<TicketFormState>(emptyTicketFormState);
  const [ticketFormError, setTicketFormError] = useState('');
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(mockPromoCodes);
  const [promoForm, setPromoForm] = useState<PromoFormState>(emptyPromoFormState);
  const [promoFormError, setPromoFormError] = useState('');
  const getTicketFieldId = (field: string) => `${ticketFormIdPrefix}-${field}`;
  const getPromoFieldId = (field: string) => `${promoFormIdPrefix}-${field}`;

  const closeTicketModal = () => {
    setShowAddTicketModal(false);
    setEditingTicketId(null);
    setTicketForm(emptyTicketFormState);
    setTicketFormError('');
  };

  const closeCreateCodeModal = () => {
    setShowCreateCodeModal(false);
    setPromoForm(emptyPromoFormState);
    setPromoFormError('');
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
    onClose: closeCreateCodeModal
  });

  const handleDeletePromoCode = (promoId: string) => {
    setPromoCodes((currentPromoCodes) =>
      currentPromoCodes.filter((promo) => promo.id !== promoId)
    );
  };

  const handlePromoFormChange = <K extends keyof PromoFormState>(field: K, value: PromoFormState[K]) => {
    setPromoForm((currentForm) => ({ ...currentForm, [field]: value }));
    if (promoFormError) setPromoFormError('');
  };

  const handleSavePromoCode = () => {
    const code = promoForm.code.trim().toUpperCase();
    const discountValue = Number(promoForm.discountValue);
    const usageLimit = promoForm.usageLimit.trim() ? Number(promoForm.usageLimit) : null;

    if (!code) {
      setPromoFormError('Please enter a promo code.');
      return;
    }

    if (promoCodes.some((promo) => promo.code.toLowerCase() === code.toLowerCase())) {
      setPromoFormError('This promo code already exists.');
      return;
    }

    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      setPromoFormError('Please enter a valid discount value.');
      return;
    }

    if (promoForm.discountType === 'percent' && discountValue > 100) {
      setPromoFormError('Percentage discounts must be 100 or less.');
      return;
    }

    if (usageLimit !== null && (!Number.isFinite(usageLimit) || usageLimit < 1)) {
      setPromoFormError('Usage limit must be at least 1.');
      return;
    }

    if (!promoForm.validFrom || !promoForm.validUntil) {
      setPromoFormError('Please set both a start date and an end date.');
      return;
    }

    if (promoForm.validUntil < promoForm.validFrom) {
      setPromoFormError('End date must be on or after the start date.');
      return;
    }

    const nextPromoCode: PromoCode = {
      id: `promo-${Date.now()}`,
      code,
      access: promoForm.access,
      discountType: promoForm.discountType,
      discountValue,
      appliesTo: promoForm.appliesTo,
      used: 0,
      usageLimit,
      validFrom: promoForm.validFrom,
      validUntil: promoForm.validUntil,
    };

    setPromoCodes((currentPromoCodes) => [nextPromoCode, ...currentPromoCodes]);
    closeCreateCodeModal();
  };

  const formatPromoDiscount = (promo: PromoCode) => {
    if (promo.discountType === 'percent') {
      return `${promo.discountValue}% off`;
    }

    return `$${promo.discountValue} off`;
  };

  const formatPromoUsage = (promo: PromoCode) => (
    promo.usageLimit === null ? `${promo.used} uses • Unlimited` : `${promo.used} / ${promo.usageLimit} uses`
  );

  const formatPromoWindow = (promo: PromoCode) => {
    const start = new Date(`${promo.validFrom}T00:00:00`);
    const end = new Date(`${promo.validUntil}T00:00:00`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 'Validity window not set';
    }

    return `Valid ${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
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
              <div className="flex items-start gap-4">
                <div className="bg-white px-4 py-2 rounded border border-gray-300 font-mono text-sm font-medium">
                  {promo.code}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-medium text-gray-900">{formatPromoDiscount(promo)}</div>
                    <span className={`px-2 py-1 rounded text-[11px] font-medium ${
                      promo.discountType === 'percent'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {promo.discountType === 'percent' ? 'Percent' : 'Fixed'}
                    </span>
                    <span className="px-2 py-1 rounded text-[11px] font-medium bg-violet-100 text-violet-700">
                      {promo.access === 'public' ? 'Public' : 'Access Code'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{formatPromoUsage(promo)} • {promo.appliesTo}</div>
                  <div className="text-xs text-gray-500 mt-1">{formatPromoWindow(promo)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Delete promo code ${promo.code}`}
                  onClick={() => handleDeletePromoCode(promo.id)}
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
                  <label htmlFor={getTicketFieldId('name')} className="block text-sm font-medium text-gray-700 mb-2">Ticket Name</label>
                  <input
                    id={getTicketFieldId('name')}
                    type="text"
                    value={ticketForm.name}
                    onChange={(event) => handleTicketFormChange('name', event.target.value)}
                    placeholder="e.g., General Admission"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor={getTicketFieldId('type')} className="block text-sm font-medium text-gray-700 mb-2">Ticket Type</label>
                  <select
                    id={getTicketFieldId('type')}
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
                  <label htmlFor={getTicketFieldId('price')} className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    id={getTicketFieldId('price')}
                    type="number"
                    value={ticketForm.price}
                    onChange={(event) => handleTicketFormChange('price', event.target.value)}
                    placeholder="50.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor={getTicketFieldId('quantity')} className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    id={getTicketFieldId('quantity')}
                    type="number"
                    value={ticketForm.quantity}
                    onChange={(event) => handleTicketFormChange('quantity', event.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor={getTicketFieldId('min-per-order')} className="block text-sm font-medium text-gray-700 mb-2">Min/Max per Order</label>
                  <div className="flex gap-2">
                    <input
                      id={getTicketFieldId('min-per-order')}
                      aria-label="Minimum per order"
                      type="number"
                      value={ticketForm.minPerOrder}
                      onChange={(event) => handleTicketFormChange('minPerOrder', event.target.value)}
                      placeholder="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                    />
                    <input
                      id={getTicketFieldId('max-per-order')}
                      aria-label="Maximum per order"
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
                <label htmlFor={getTicketFieldId('description')} className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  id={getTicketFieldId('description')}
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
            onClick={closeCreateCodeModal}
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
                  <label htmlFor={getPromoFieldId('code')} className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                  <input
                    id={getPromoFieldId('code')}
                    type="text"
                    value={promoForm.code}
                    onChange={(event) => handlePromoFormChange('code', event.target.value)}
                    placeholder="e.g., SUMMER2026"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor={getPromoFieldId('access-type')} className="block text-sm font-medium text-gray-700 mb-2">Code Access</label>
                  <select
                    id={getPromoFieldId('access-type')}
                    value={promoForm.access}
                    onChange={(event) => handlePromoFormChange('access', event.target.value as PromoCode['access'])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="access">Access Code</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={getPromoFieldId('discount-type')} className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                  <select
                    id={getPromoFieldId('discount-type')}
                    value={promoForm.discountType}
                    onChange={(event) => handlePromoFormChange('discountType', event.target.value as PromoCode['discountType'])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={getPromoFieldId('discount-value')} className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
                  <input
                    id={getPromoFieldId('discount-value')}
                    type="number"
                    value={promoForm.discountValue}
                    onChange={(event) => handlePromoFormChange('discountValue', event.target.value)}
                    placeholder={promoForm.discountType === 'percent' ? '20' : '25'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor={getPromoFieldId('usage-limit')} className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                  <input
                    id={getPromoFieldId('usage-limit')}
                    type="number"
                    value={promoForm.usageLimit}
                    onChange={(event) => handlePromoFormChange('usageLimit', event.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={getPromoFieldId('start-date')} className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    id={getPromoFieldId('start-date')}
                    type="date"
                    value={promoForm.validFrom}
                    onChange={(event) => handlePromoFormChange('validFrom', event.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor={getPromoFieldId('end-date')} className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    id={getPromoFieldId('end-date')}
                    type="date"
                    value={promoForm.validUntil}
                    onChange={(event) => handlePromoFormChange('validUntil', event.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={getPromoFieldId('applies-to')} className="block text-sm font-medium text-gray-700 mb-2">Applies To</label>
                <select
                  id={getPromoFieldId('applies-to')}
                  value={promoForm.appliesTo}
                  onChange={(event) => handlePromoFormChange('appliesTo', event.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                >
                  <option value="All ticket types">All ticket types</option>
                  <option value="General Admission only">General Admission only</option>
                  <option value="VIP tickets only">VIP tickets only</option>
                  <option value="Student tickets only">Student tickets only</option>
                </select>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Discount Rules</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Percent discounts must stay between 1% and 100%.</li>
                  <li>• Fixed discounts are entered as dollar amounts.</li>
                  <li>• Promo codes require both a start and end date.</li>
                  <li>• Usage limits cap the total number of successful redemptions.</li>
                </ul>
              </div>

              {promoFormError && (
                <p className="text-sm text-red-600" role="alert">{promoFormError}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={closeCreateCodeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePromoCode}
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

const emptyPromoFormState: PromoFormState = {
  code: '',
  access: 'public',
  discountType: 'percent',
  discountValue: '',
  usageLimit: '',
  validFrom: '',
  validUntil: '',
  appliesTo: 'All ticket types'
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

const mockPromoCodes: PromoCode[] = [
  {
    id: '1',
    code: 'SUMMER2026',
    access: 'public',
    discountType: 'percent',
    discountValue: 20,
    appliesTo: 'All ticket types',
    used: 47,
    usageLimit: 100,
    validFrom: '2026-05-01',
    validUntil: '2026-05-31'
  },
  {
    id: '2',
    code: 'VIPACCESS',
    access: 'access',
    discountType: 'fixed',
    discountValue: 25,
    appliesTo: 'VIP tickets only',
    used: 12,
    usageLimit: 25,
    validFrom: '2026-05-10',
    validUntil: '2026-06-01'
  }
];
