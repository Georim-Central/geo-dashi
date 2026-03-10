import { useState } from 'react';
import { Plus, Mail, Shield, Edit2, Trash2, QrCode, CreditCard as CreditCardIcon, Ticket } from 'lucide-react';
import { ContentState } from './ui/ContentState';
import { useModalA11y } from '../hooks/useModalA11y';

type InviteRole = 'admin' | 'marketing' | 'operations' | 'custom';
type InviteAccess = 'all' | string;

interface TeamManagementProps {
  eventOptions?: string[];
}

type TeamMemberRole = 'Admin' | 'Marketing' | 'Operations';

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  events: string[];
  specialTickets: string[];
  lastActive: string;
};

export function TeamManagement({ eventOptions = defaultEventOptions }: TeamManagementProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<TeamMemberRole>('Admin');
  const [editError, setEditError] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<InviteRole>('admin');
  const [inviteCustomRole, setInviteCustomRole] = useState('');
  const [inviteAccess, setInviteAccess] = useState<InviteAccess>('all');
  const [inviteError, setInviteError] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const availableEventOptions = Array.from(new Set(eventOptions.map((eventName) => eventName.trim()).filter(Boolean)));
  const {
    dialogRef: inviteDialogRef,
    titleId: inviteTitleId,
    descriptionId: inviteDescriptionId
  } = useModalA11y({
    isOpen: showInviteModal,
    onClose: () => {
      setShowInviteModal(false);
      setInviteError('');
    }
  });
  const {
    dialogRef: ticketDialogRef,
    titleId: ticketTitleId,
    descriptionId: ticketDescriptionId
  } = useModalA11y({
    isOpen: showTicketModal,
    onClose: () => {
      setShowTicketModal(false);
      setSelectedMember(null);
    }
  });
  const {
    dialogRef: editDialogRef,
    titleId: editTitleId,
    descriptionId: editDescriptionId
  } = useModalA11y({
    isOpen: showEditModal,
    onClose: () => {
      closeEditModal();
    }
  });

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingMemberId(null);
    setEditName('');
    setEditEmail('');
    setEditRole('Admin');
    setEditError('');
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setEditName(member.name);
    setEditEmail(member.email);
    setEditRole(member.role);
    setEditError('');
    setShowEditModal(true);
  };

  const openInviteModal = () => {
    setInviteEmail('');
    setInviteRole('admin');
    setInviteCustomRole('');
    setInviteAccess('all');
    setInviteError('');
    setShowInviteModal(true);
  };

  const handleSaveMemberEdit = () => {
    if (!editingMemberId) return;

    const name = editName.trim();
    const email = editEmail.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name) {
      setEditError('Please enter a member name.');
      return;
    }

    if (!isValidEmail) {
      setEditError('Please enter a valid email address.');
      return;
    }

    setTeamMembers((previousMembers) => previousMembers.map((member) => (
      member.id === editingMemberId
        ? { ...member, name, email, role: editRole }
        : member
    )));
    closeEditModal();
  };

  const generateInviteLink = (roleValue: string, accessValue: InviteAccess) => {
    const token = Math.random().toString(36).slice(2, 12);
    const access = accessValue === 'all' ? 'all-events' : accessValue;
    return `https://georim.app/team-invite/${token}?role=${encodeURIComponent(roleValue)}&access=${encodeURIComponent(access)}`;
  };

  const getRoleLabel = (role: InviteRole, customRoleName: string) => {
    if (role === 'admin') return 'Admin';
    if (role === 'marketing') return 'Marketing';
    if (role === 'operations') return 'Operations';
    return customRoleName;
  };

  const handleSendInvite = () => {
    const email = inviteEmail.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      setInviteError('Please enter a valid email address.');
      return;
    }

    const customRoleName = inviteCustomRole.trim();
    if (inviteRole === 'custom' && !customRoleName) {
      setInviteError('Please enter a custom role name.');
      return;
    }

    setInviteLoading(true);
    const roleLabel = getRoleLabel(inviteRole, customRoleName);
    const inviteLink = generateInviteLink(roleLabel, inviteAccess);
    const accessLabel = inviteAccess === 'all' ? 'all events' : inviteAccess;
    const subject = 'You are invited to join Georim Team Management';
    const body = [
      'Hi there,',
      '',
      `You have been invited to join our Georim team as ${roleLabel} with access to ${accessLabel}.`,
      '',
      `Accept your invite here: ${inviteLink}`,
      '',
      'This invite link is unique to you.',
      '',
      'Best regards,',
      'Georim Team'
    ].join('\n');

    const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    console.log('[Team] Invite mailto generated', { email, role: inviteRole, access: inviteAccess, inviteLink });
    setShowInviteModal(false);
    setInviteError('');
    setInviteLoading(false);
  };

  return (
    <div className="min-h-full bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-1">Manage team access and permissions</p>
        </div>
        <button
          type="button"
          onClick={openInviteModal}
          className="flex items-center gap-2 bg-[#7626c6] text-white btn-glass px-4 py-2 rounded-lg hover:bg-[#5f1fa3] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Invite Team Member
        </button>
      </div>

      {/* Permission Roles Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">3 members</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin</h3>
          <p className="text-sm text-gray-600 mb-4">
            Full access to all events, settings, and team management
          </p>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>✓ Create & edit events</li>
            <li>✓ Manage tickets & orders</li>
            <li>✓ View financials</li>
            <li>✓ Invite team members</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">2 members</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing</h3>
          <p className="text-sm text-gray-600 mb-4">
            Access to marketing tools and email campaigns
          </p>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>✓ Send email campaigns</li>
            <li>✓ View analytics</li>
            <li>✓ Manage social media</li>
            <li>✗ Financial access</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <QrCode className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">5 members</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Operations</h3>
          <p className="text-sm text-gray-600 mb-4">
            On-site check-in and attendee management
          </p>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>✓ Check-in attendees</li>
            <li>✓ Scan QR codes</li>
            <li>✓ View attendee lists</li>
            <li>✗ Edit event details</li>
          </ul>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          <span className="text-sm text-gray-600">Click ticket icon to assign special tickets</span>
        </div>

        <ContentState
          isEmpty={teamMembers.length === 0}
          emptyMessage="No team members found."
          className="py-14 m-6"
        >
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Special Tickets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#7626c6] rounded-full flex items-center justify-center text-white font-medium">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    member.role === 'Admin'
                      ? 'bg-purple-100 text-purple-700'
                      : member.role === 'Marketing'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {member.specialTickets && member.specialTickets.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {member.specialTickets.map((ticket, idx) => (
                        <span key={idx} className="px-2 py-1 bg-[#7626c6] text-white text-xs rounded">
                          {ticket}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No tickets assigned</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setSelectedMember(member.id);
                        setShowTicketModal(true);
                      }}
                      className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Assign Special Tickets"
                      aria-haspopup="dialog"
                      aria-expanded={showTicketModal && selectedMember === member.id}
                    >
                      <Ticket className="w-4 h-4 text-[#7626c6]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(member)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label={`Edit ${member.name}`}
                      aria-haspopup="dialog"
                      aria-expanded={showEditModal && editingMemberId === member.id}
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button type="button" className="p-2 hover:bg-red-50 rounded-lg transition-colors" aria-label={`Remove ${member.name}`}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </ContentState>
      </div>

      {/* On-Site Tools */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">On-Site Event Tools</h2>

        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 border border-gray-300 rounded-lg hover:border-[#7626c6] transition-colors">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Organizer App</h3>
            <p className="text-sm text-gray-600 mb-4">
              Mobile app for QR code scanning and live check-in counts
            </p>
            <div className="flex gap-2">
              <button type="button" className="text-sm px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
                iOS
              </button>
              <button type="button" className="text-sm px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
                Android
              </button>
            </div>
          </div>

          <div className="p-6 border border-gray-300 rounded-lg hover:border-[#7626c6] transition-colors">
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <CreditCardIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">At-the-Door Sales</h3>
            <p className="text-sm text-gray-600 mb-4">
              Accept payments on-site with card readers
            </p>
            <button type="button" className="text-sm px-4 py-2 bg-[#7626c6] text-white btn-glass rounded hover:bg-[#5f1fa3] transition-colors">
              Get Card Reader
            </button>
          </div>

          <div className="p-6 border border-gray-300 rounded-lg hover:border-[#7626c6] transition-colors">
            <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Guest List Manager</h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage VIP lists and special access
            </p>
            <button type="button" className="text-sm px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              Manage Lists
            </button>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 sm:px-6"
          onClick={() => {
            setShowInviteModal(false);
            setInviteError('');
          }}
        >
          <div
            ref={inviteDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={inviteTitleId}
            aria-describedby={inviteDescriptionId}
            tabIndex={-1}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={inviteTitleId} className="text-xl font-semibold text-gray-900 mb-4">Invite Team Member</h2>
            <p id={inviteDescriptionId} className="sr-only">Add an email, role, and event access, then send invite.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(event) => {
                    setInviteEmail(event.target.value);
                    if (inviteError) setInviteError('');
                  }}
                  placeholder="colleague@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(event) => {
                    setInviteRole(event.target.value as InviteRole);
                    if (inviteError) setInviteError('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                >
                  <option value="admin">Admin - Full access</option>
                  <option value="marketing">Marketing - Marketing tools only</option>
                  <option value="operations">Operations - Check-in access</option>
                  <option value="custom">Custom role</option>
                </select>
              </div>

              {inviteRole === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Role Name
                  </label>
                  <input
                    type="text"
                    value={inviteCustomRole}
                    onChange={(event) => {
                      setInviteCustomRole(event.target.value);
                      if (inviteError) setInviteError('');
                    }}
                    placeholder="e.g. Sponsorship Manager"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Access
                </label>
                <select
                  value={inviteAccess}
                  onChange={(event) => {
                    setInviteAccess(event.target.value);
                    if (inviteError) setInviteError('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                >
                  <option value="all">All events</option>
                  {availableEventOptions.map((eventName) => (
                    <option key={eventName} value={eventName}>
                      {eventName}
                    </option>
                  ))}
                </select>
              </div>

              {inviteError && (
                <p className="text-sm text-red-600" role="alert">{inviteError}</p>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteError('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendInvite}
                  disabled={inviteLoading}
                  className="flex-1 px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors"
                >
                  Send Invite
                </button>
              </div>
            </div>
            <div className="sr-only" aria-live="polite">
              {inviteError}
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Member Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 sm:px-6"
          onClick={closeEditModal}
        >
          <div
            ref={editDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={editTitleId}
            aria-describedby={editDescriptionId}
            tabIndex={-1}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={editTitleId} className="text-xl font-semibold text-gray-900 mb-4">Edit Team Member</h2>
            <p id={editDescriptionId} className="sr-only">Update member details and save changes.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(event) => {
                    setEditName(event.target.value);
                    if (editError) setEditError('');
                  }}
                  placeholder="Member full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(event) => {
                    setEditEmail(event.target.value);
                    if (editError) setEditError('');
                  }}
                  placeholder="member@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={editRole}
                  onChange={(event) => setEditRole(event.target.value as TeamMemberRole)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                >
                  <option value="Admin">Admin</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              {editError && (
                <p className="text-sm text-red-600" role="alert">{editError}</p>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveMemberEdit}
                  className="flex-1 px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
            <div className="sr-only" aria-live="polite">
              {editError}
            </div>
          </div>
        </div>
      )}

      {/* Special Ticket Assignment Modal */}
      {showTicketModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 sm:px-6"
          onClick={() => {
            setShowTicketModal(false);
            setSelectedMember(null);
          }}
        >
          <div
            ref={ticketDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={ticketTitleId}
            aria-describedby={ticketDescriptionId}
            tabIndex={-1}
            className="bg-white rounded-xl p-6 max-w-lg w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#7626c6] rounded-lg">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 id={ticketTitleId} className="text-xl font-semibold text-gray-900">Assign Special Tickets</h2>
                <p id={ticketDescriptionId} className="text-sm text-gray-600">
                  {selectedMember && teamMembers.find(m => m.id === selectedMember)?.name}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Event
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent">
                  <option>Summer Music Festival 2026</option>
                  <option>Tech Conference 2026</option>
                  <option>Food & Wine Expo</option>
                  <option>Art Gallery Opening</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Ticket Types
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-[#7626c6] rounded focus:ring-[#7626c6]" />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">VIP Access</div>
                      <div className="text-xs text-gray-500">Backstage + front row seating</div>
                    </div>
                    <span className="text-sm text-gray-600">$250</span>
                  </label>

                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-[#7626c6] rounded focus:ring-[#7626c6]" />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">All Access Pass</div>
                      <div className="text-xs text-gray-500">Complete event access</div>
                    </div>
                    <span className="text-sm text-gray-600">$500</span>
                  </label>

                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-[#7626c6] rounded focus:ring-[#7626c6]" />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">Staff Pass</div>
                      <div className="text-xs text-gray-500">Working crew access</div>
                    </div>
                    <span className="text-sm text-gray-600">Free</span>
                  </label>

                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-[#7626c6] rounded focus:ring-[#7626c6]" />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">Media Pass</div>
                      <div className="text-xs text-gray-500">Press & photographer access</div>
                    </div>
                    <span className="text-sm text-gray-600">Free</span>
                  </label>

                  <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-[#7626c6] rounded focus:ring-[#7626c6]" />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">Comp Ticket</div>
                      <div className="text-xs text-gray-500">Complimentary general admission</div>
                    </div>
                    <span className="text-sm text-gray-600">Free</span>
                  </label>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-purple-800">
                    Special tickets assigned to team members will be automatically generated and sent to their email.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowTicketModal(false);
                    setSelectedMember(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTicketModal(false);
                    setSelectedMember(null);
                  }}
                  className="flex-1 px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors"
                >
                  Assign Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

const defaultEventOptions = [
  'Summer Music Festival 2026',
  'Tech Conference 2026',
  'Food & Wine Expo',
  'Georim Founders Circle'
];

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@eventcompany.com',
    role: 'Admin',
    events: [],
    specialTickets: ['VIP Access', 'All Access Pass'],
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    name: 'Sarah Miller',
    email: 'sarah.m@eventcompany.com',
    role: 'Admin',
    events: [],
    specialTickets: ['All Access Pass'],
    lastActive: 'Yesterday'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.j@eventcompany.com',
    role: 'Marketing',
    events: ['Summer Music Festival'],
    specialTickets: ['Staff Pass', 'Media Pass'],
    lastActive: '3 hours ago'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.w@eventcompany.com',
    role: 'Marketing',
    events: ['Tech Conference', 'Food Expo'],
    specialTickets: [],
    lastActive: 'Today'
  },
  {
    id: '5',
    name: 'Chris Brown',
    email: 'chris.b@eventcompany.com',
    role: 'Operations',
    events: ['Summer Music Festival'],
    specialTickets: ['Staff Pass'],
    lastActive: '5 mins ago'
  }
];
