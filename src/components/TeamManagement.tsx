import type { ReactNode } from 'react';
import { useCallback, useId, useMemo, useState } from 'react';
import {
  Edit2,
  Mail,
  Plus,
  QrCode,
  Shield,
  Sparkles,
  Ticket,
  Trash2,
  Users,
} from 'lucide-react';

import { useModalA11y } from '../hooks/useModalA11y';
import { ContentState } from './ui/ContentState';

type PermissionPreset = 'admin' | 'marketing' | 'operations' | 'custom';
type InviteStatus = 'pending' | 'sent' | 'expired';
type AccessScope = 'all' | string[];

interface TeamManagementProps {
  eventOptions?: string[];
}

type TeamMember = {
  id: string;
  name: string;
  email: string;
  preset: PermissionPreset;
  customRoleName?: string;
  events: AccessScope;
  specialTickets: string[];
  lastActive: string;
  status: 'owner' | 'active';
};

type PendingInvite = {
  id: string;
  email: string;
  preset: PermissionPreset;
  customRoleName?: string;
  access: AccessScope;
  status: InviteStatus;
  sentAt: string;
};

const presetDefinitions: Record<
  PermissionPreset,
  {
    label: string;
    description: string;
    bullets: string[];
    badgeClass: string;
    cardTone: string;
  }
> = {
  admin: {
    label: 'Admin',
    description: 'Full control of events, team access, payouts, and settings.',
    bullets: [],
    badgeClass: 'bg-violet-100 text-violet-700',
    cardTone: 'bg-violet-50',
  },
  marketing: {
    label: 'Marketing',
    description: 'Campaign creation, audience targeting, and performance review.',
    bullets: [],
    badgeClass: 'bg-blue-100 text-blue-700',
    cardTone: 'bg-blue-50',
  },
  operations: {
    label: 'Operations',
    description: 'On-site attendee management, check-in, and guest support.',
    bullets: [],
    badgeClass: 'bg-emerald-100 text-emerald-700',
    cardTone: 'bg-emerald-50',
  },
  custom: {
    label: 'Custom',
    description: 'Flexible access for specialized roles and temporary coverage.',
    bullets: [],
    badgeClass: 'bg-amber-100 text-amber-700',
    cardTone: 'bg-amber-50',
  },
};

const defaultEventOptions = [
  'Summer Music Festival 2026',
  'Tech Conference 2026',
  'Food & Wine Expo',
  'Georim Founders Circle',
];

const initialTeamMembers: TeamMember[] = [
  {
    id: 'member-1',
    name: 'John Doe',
    email: 'john@eventcompany.com',
    preset: 'admin',
    events: 'all',
    specialTickets: ['VIP Access', 'All Access Pass'],
    lastActive: '2 hours ago',
    status: 'owner',
  },
  {
    id: 'member-2',
    name: 'Sarah Miller',
    email: 'sarah.m@eventcompany.com',
    preset: 'admin',
    events: 'all',
    specialTickets: ['All Access Pass'],
    lastActive: 'Yesterday',
    status: 'active',
  },
  {
    id: 'member-3',
    name: 'Mike Johnson',
    email: 'mike.j@eventcompany.com',
    preset: 'marketing',
    events: ['Summer Music Festival 2026', 'Tech Conference 2026'],
    specialTickets: ['Media Pass'],
    lastActive: '3 hours ago',
    status: 'active',
  },
  {
    id: 'member-4',
    name: 'Emma Wilson',
    email: 'emma.w@eventcompany.com',
    preset: 'operations',
    events: ['Tech Conference 2026', 'Food & Wine Expo'],
    specialTickets: ['Staff Pass'],
    lastActive: 'Today',
    status: 'active',
  },
];

const initialPendingInvites: PendingInvite[] = [
  {
    id: 'invite-1',
    email: 'alexandra@eventcompany.com',
    preset: 'operations',
    access: ['Summer Music Festival 2026'],
    status: 'pending',
    sentAt: 'Sent 20 minutes ago',
  },
  {
    id: 'invite-2',
    email: 'finance@eventcompany.com',
    preset: 'custom',
    customRoleName: 'Finance Reviewer',
    access: 'all',
    status: 'sent',
    sentAt: 'Resent yesterday',
  },
];

const availableSpecialTickets = [
  'VIP Access',
  'All Access Pass',
  'Staff Pass',
  'Media Pass',
  'Comp Ticket',
];

const getPresetLabel = (preset: PermissionPreset, customRoleName?: string) =>
  preset === 'custom' ? customRoleName || 'Custom Role' : presetDefinitions[preset].label;

const getAccessLabel = (access: AccessScope) => (access === 'all' ? 'All events' : access.join(', '));

export function TeamManagement({ eventOptions = defaultEventOptions }: TeamManagementProps) {
  const fieldIdPrefix = useId();
  const availableEventOptions = Array.from(new Set(eventOptions.map((eventName) => eventName.trim()).filter(Boolean)));

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(initialPendingInvites);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(initialTeamMembers[0].id);
  const [notice, setNotice] = useState<string | null>(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePreset, setInvitePreset] = useState<PermissionPreset>('admin');
  const [inviteCustomRole, setInviteCustomRole] = useState('');
  const [inviteAccessMode, setInviteAccessMode] = useState<'all' | 'selected'>('all');
  const [inviteSelectedEvents, setInviteSelectedEvents] = useState<string[]>([]);
  const [inviteError, setInviteError] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPreset, setEditPreset] = useState<PermissionPreset>('admin');
  const [editCustomRole, setEditCustomRole] = useState('');
  const [editAccessMode, setEditAccessMode] = useState<'all' | 'selected'>('all');
  const [editSelectedEvents, setEditSelectedEvents] = useState<string[]>([]);
  const [editError, setEditError] = useState('');

  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSelections, setTicketSelections] = useState<string[]>([]);

  const getFieldId = (field: string) => `${fieldIdPrefix}-${field}`;

  const selectedMember = teamMembers.find((member) => member.id === selectedMemberId) ?? null;

  const presetCounts = useMemo(
    () => ({
      admin: teamMembers.filter((member) => member.preset === 'admin').length,
      marketing: teamMembers.filter((member) => member.preset === 'marketing').length,
      operations: teamMembers.filter((member) => member.preset === 'operations').length,
      custom: teamMembers.filter((member) => member.preset === 'custom').length + pendingInvites.filter((invite) => invite.preset === 'custom').length,
    }),
    [pendingInvites, teamMembers]
  );

  const closeInviteModal = useCallback(() => {
    setShowInviteModal(false);
    setInviteError('');
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setEditingMemberId(null);
    setEditName('');
    setEditEmail('');
    setEditPreset('admin');
    setEditCustomRole('');
    setEditAccessMode('all');
    setEditSelectedEvents([]);
    setEditError('');
  }, []);

  const closeTicketModal = useCallback(() => {
    setShowTicketModal(false);
    setTicketSelections([]);
  }, []);

  const {
    dialogRef: inviteDialogRef,
    titleId: inviteTitleId,
    descriptionId: inviteDescriptionId,
  } = useModalA11y({
    isOpen: showInviteModal,
    onClose: closeInviteModal,
  });

  const {
    dialogRef: editDialogRef,
    titleId: editTitleId,
    descriptionId: editDescriptionId,
  } = useModalA11y({
    isOpen: showEditModal,
    onClose: closeEditModal,
  });

  const {
    dialogRef: ticketDialogRef,
    titleId: ticketTitleId,
    descriptionId: ticketDescriptionId,
  } = useModalA11y({
    isOpen: showTicketModal,
    onClose: closeTicketModal,
  });

  const openInviteModal = useCallback(() => {
    setInviteEmail('');
    setInvitePreset('admin');
    setInviteCustomRole('');
    setInviteAccessMode('all');
    setInviteSelectedEvents([]);
    setInviteError('');
    setShowInviteModal(true);
  }, []);

  const toggleEventSelection = (currentValues: string[], eventName: string) =>
    currentValues.includes(eventName)
      ? currentValues.filter((currentValue) => currentValue !== eventName)
      : [...currentValues, eventName];

  const handleSendInvite = () => {
    const normalizedEmail = inviteEmail.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!isValidEmail) {
      setInviteError('Please enter a valid email address.');
      return;
    }

    if (invitePreset === 'custom' && !inviteCustomRole.trim()) {
      setInviteError('Please enter a custom role name.');
      return;
    }

    if (inviteAccessMode === 'selected' && inviteSelectedEvents.length === 0) {
      setInviteError('Choose at least one event for limited access.');
      return;
    }

    const nextInvite: PendingInvite = {
      id: `invite-${Date.now()}`,
      email: normalizedEmail,
      preset: invitePreset,
      customRoleName: invitePreset === 'custom' ? inviteCustomRole.trim() : undefined,
      access: inviteAccessMode === 'all' ? 'all' : inviteSelectedEvents,
      status: 'pending',
      sentAt: 'Sent just now',
    };

    setPendingInvites((currentInvites) => [nextInvite, ...currentInvites]);
    setShowInviteModal(false);
    setNotice(`Invite created for ${normalizedEmail}. Pending acceptance.`);
  };

  const handleResendInvite = (inviteId: string) => {
    setPendingInvites((currentInvites) =>
      currentInvites.map((invite) =>
        invite.id === inviteId ? { ...invite, status: 'sent', sentAt: 'Resent just now' } : invite
      )
    );
    setNotice('Invite resent with updated status tracking.');
  };

  const handleCancelInvite = (inviteId: string) => {
    setPendingInvites((currentInvites) => currentInvites.filter((invite) => invite.id !== inviteId));
    setNotice('Pending invite canceled.');
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setEditName(member.name);
    setEditEmail(member.email);
    setEditPreset(member.preset);
    setEditCustomRole(member.customRoleName || '');
    setEditAccessMode(member.events === 'all' ? 'all' : 'selected');
    setEditSelectedEvents(member.events === 'all' ? [] : member.events);
    setEditError('');
    setShowEditModal(true);
  };

  const handleSaveMemberEdit = () => {
    if (!editingMemberId) return;

    const normalizedName = editName.trim();
    const normalizedEmail = editEmail.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!normalizedName) {
      setEditError('Please enter a member name.');
      return;
    }

    if (!isValidEmail) {
      setEditError('Please enter a valid email address.');
      return;
    }

    if (editPreset === 'custom' && !editCustomRole.trim()) {
      setEditError('Please enter a custom role name.');
      return;
    }

    if (editAccessMode === 'selected' && editSelectedEvents.length === 0) {
      setEditError('Choose at least one event for limited access.');
      return;
    }

    setTeamMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.id === editingMemberId
          ? {
              ...member,
              name: normalizedName,
              email: normalizedEmail,
              preset: editPreset,
              customRoleName: editPreset === 'custom' ? editCustomRole.trim() : undefined,
              events: editAccessMode === 'all' ? 'all' : editSelectedEvents,
            }
          : member
      )
    );

    setSelectedMemberId(editingMemberId);
    closeEditModal();
    setNotice(`Permissions updated for ${normalizedName}.`);
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers((currentMembers) => currentMembers.filter((member) => member.id !== memberId));
    if (selectedMemberId === memberId && teamMembers.length > 1) {
      const fallbackMember = teamMembers.find((member) => member.id !== memberId);
      if (fallbackMember) setSelectedMemberId(fallbackMember.id);
    }
    setNotice('Team member removed from organizer access.');
  };

  const openTicketModal = (member: TeamMember) => {
    setSelectedMemberId(member.id);
    setTicketSelections(member.specialTickets);
    setShowTicketModal(true);
  };

  const saveTicketAssignments = () => {
    if (!selectedMember) return;

    setTeamMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.id === selectedMember.id ? { ...member, specialTickets: ticketSelections } : member
      )
    );
    closeTicketModal();
    setNotice(`Special ticket access updated for ${selectedMember.name}.`);
  };

  return (
    <div className="app-page-background min-h-full p-6 md:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="ui-page-header items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="ui-page-title ui-type-section">Team Management</h1>
            <p className="ui-page-subtitle ui-type-subsection mt-2 max-w-2xl">
              Clarify organizer permissions, review event-by-event access, and track every pending invite from one workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={openInviteModal}
            className="ml-4 inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-xl bg-[#7626c6] px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#5f1fa3]"
          >
            <Plus className="h-4 w-4" />
            Invite Team Member
          </button>
        </div>

        {notice ? (
          <div className="rounded-2xl border border-[#7626c6]/20 bg-[#f5ecfd] px-4 py-3 text-sm font-medium text-[#7626c6]" aria-live="polite">
            {notice}
          </div>
        ) : null}

        <div className="grid grid-cols-4 gap-4">
          {(['admin', 'marketing', 'operations', 'custom'] as const).map((preset) => (
            <PresetCard
              key={preset}
              preset={preset}
              memberCount={presetCounts[preset]}
            />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_380px]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                  <h2 className="ui-card-title">Pending Invites</h2>
                  <p className="ui-support-copy mt-1">
                    Track invite delivery, resend pending access, and expire outdated links.
                  </p>
                </div>
                <div className="rounded-full bg-[#f5ecfd] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7626c6]">
                  {pendingInvites.length} pending
                </div>
              </div>

              <ContentState isEmpty={pendingInvites.length === 0} emptyMessage="No pending invites." className="m-6 py-14">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Invitee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Preset</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Event Access</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Sent</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pendingInvites.map((invite) => (
                      <tr key={invite.id} className="transition hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center text-left">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7626c6] font-medium text-white">
                              {invite.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{invite.email}</div>
                              <div className="text-sm text-gray-500">Pending organizer access</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <RoleBadge preset={invite.preset} customRoleName={invite.customRoleName} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {getAccessLabel(invite.access)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <StatusBadge status={invite.status} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{invite.sentAt}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleResendInvite(invite.id)}
                              aria-label={`Resend invite for ${invite.email}`}
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition hover:bg-gray-50"
                            >
                              Resend Invite
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancelInvite(invite.id)}
                              aria-label={`Cancel invite for ${invite.email}`}
                              className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ContentState>
            </section>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                  <h2 className="ui-card-title">Team Members</h2>
                  <p className="ui-support-copy mt-1">Review role preset, event access scope, and special tickets per teammate.</p>
                </div>
              </div>

              <ContentState isEmpty={teamMembers.length === 0} emptyMessage="No team members found." className="m-6 py-14">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Member</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Preset</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Event Access</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Special Tickets</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Last Active</th>
                      <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teamMembers.map((member) => (
                      <tr
                        key={member.id}
                        className={`transition hover:bg-gray-50 ${selectedMemberId === member.id ? 'bg-[#faf5ff]' : ''}`}
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedMemberId(member.id)}
                            className="flex items-center text-left"
                            aria-label={`Select ${member.name}`}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7626c6] font-medium text-white">
                              {member.name
                                .split(' ')
                                .map((token) => token[0])
                                .join('')}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <RoleBadge preset={member.preset} customRoleName={member.customRoleName} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {getAccessLabel(member.events)}
                        </td>
                        <td className="px-6 py-4">
                          {member.specialTickets.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {member.specialTickets.map((ticketName) => (
                                <span key={ticketName} className="rounded-full bg-[#f5ecfd] px-2.5 py-1 text-xs font-medium text-[#7626c6]">
                                  {ticketName}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No tickets assigned</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{member.lastActive}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openTicketModal(member)}
                              className="rounded-lg p-2 transition hover:bg-violet-50"
                              aria-label={`Assign tickets for ${member.name}`}
                            >
                              <Ticket className="h-4 w-4 text-[#7626c6]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditModal(member)}
                              className="rounded-lg p-2 transition hover:bg-gray-100"
                              aria-label={`Edit ${member.name}`}
                            >
                              <Edit2 className="h-4 w-4 text-gray-600" />
                            </button>
                            {member.status !== 'owner' ? (
                              <button
                                type="button"
                                onClick={() => handleRemoveMember(member.id)}
                                className="rounded-lg p-2 transition hover:bg-red-50"
                                aria-label={`Remove ${member.name}`}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ContentState>
            </section>
          </div>

          <aside className="space-y-6">
            <PanelCard
              title="On-Site Tools"
              description="Operational tools tied to organizer permissions."
              badge="Ops"
            >
              <div className="grid gap-3 md:grid-cols-3">
                <ToolRow
                  icon={QrCode}
                  title="Organizer App"
                  description="QR scanning, check-in counts, and live attendee flow."
                />
                <ToolRow
                  icon={Ticket}
                  title="Guest List Manager"
                  description="Assign special access, staff comps, and VIP guest handling."
                />
                <ToolRow
                  icon={Users}
                  title="Coverage Planning"
                  description="Match roles and event access before doors open."
                />
              </div>
            </PanelCard>
          </aside>
        </div>

        {showInviteModal ? (
          <ModalShell onClose={closeInviteModal}>
            <div
              ref={inviteDialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={inviteTitleId}
              aria-describedby={inviteDescriptionId}
              tabIndex={-1}
              className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h2 id={inviteTitleId} className="ui-dialog-title">Invite Team Member</h2>
              <p id={inviteDescriptionId} className="ui-dialog-subtitle mt-1">
                Assign a permission preset and event scope before sending access.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="Email Address" htmlFor={getFieldId('invite-email')}>
                  <input
                    id={getFieldId('invite-email')}
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => {
                      setInviteEmail(event.target.value);
                      if (inviteError) setInviteError('');
                    }}
                    placeholder="colleague@example.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                  />
                </Field>
                <Field label="Permission Preset" htmlFor={getFieldId('invite-preset')}>
                  <select
                    id={getFieldId('invite-preset')}
                    value={invitePreset}
                    onChange={(event) => setInvitePreset(event.target.value as PermissionPreset)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                  >
                    <option value="admin">Admin</option>
                    <option value="marketing">Marketing</option>
                    <option value="operations">Operations</option>
                    <option value="custom">Custom</option>
                  </select>
                </Field>
              </div>

              {invitePreset === 'custom' ? (
                <div className="mt-4">
                  <Field label="Custom Role Name" htmlFor={getFieldId('invite-custom-role')}>
                    <input
                      id={getFieldId('invite-custom-role')}
                      type="text"
                      value={inviteCustomRole}
                      onChange={(event) => setInviteCustomRole(event.target.value)}
                      placeholder="e.g. Finance Reviewer"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                    />
                  </Field>
                </div>
              ) : null}

              <div className="mt-4">
                <div className="ui-field-label mb-2">Event Access</div>
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => setInviteAccessMode('all')}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${inviteAccessMode === 'all' ? 'bg-white text-[#7626c6] shadow-sm' : 'text-gray-600'}`}
                  >
                    All Events
                  </button>
                  <button
                    type="button"
                    onClick={() => setInviteAccessMode('selected')}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${inviteAccessMode === 'selected' ? 'bg-white text-[#7626c6] shadow-sm' : 'text-gray-600'}`}
                  >
                    Selected Events
                  </button>
                </div>
              </div>

              {inviteAccessMode === 'selected' ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {availableEventOptions.map((eventName) => (
                    <label
                      key={eventName}
                      htmlFor={getFieldId(`invite-event-${eventName}`)}
                      className={`cursor-pointer rounded-xl border p-3 transition ${
                        inviteSelectedEvents.includes(eventName)
                          ? 'border-[#7626c6]/30 bg-[#faf5ff]'
                          : 'border-gray-200 hover:border-[#7626c6]/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          id={getFieldId(`invite-event-${eventName}`)}
                          type="checkbox"
                          checked={inviteSelectedEvents.includes(eventName)}
                          onChange={() => setInviteSelectedEvents((currentValues) => toggleEventSelection(currentValues, eventName))}
                          className="mt-1 rounded"
                        />
                        <span className="text-sm font-medium text-gray-900">{eventName}</span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : null}

              {inviteError ? <p className="mt-4 text-sm text-red-600" role="alert">{inviteError}</p> : null}

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={closeInviteModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendInvite}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#7626c6] px-4 py-2 text-white transition hover:bg-[#5f1fa3]"
                >
                  <Mail className="h-4 w-4" />
                  Send Invite
                </button>
              </div>
            </div>
          </ModalShell>
        ) : null}

        {showEditModal ? (
          <ModalShell onClose={closeEditModal}>
            <div
              ref={editDialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={editTitleId}
              aria-describedby={editDescriptionId}
              tabIndex={-1}
              className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h2 id={editTitleId} className="ui-dialog-title">Edit Team Member</h2>
              <p id={editDescriptionId} className="ui-dialog-subtitle mt-1">
                Update role preset and event access for this teammate.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="Full Name" htmlFor={getFieldId('edit-name')}>
                  <input
                    id={getFieldId('edit-name')}
                    type="text"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                  />
                </Field>
                <Field label="Email Address" htmlFor={getFieldId('edit-email')}>
                  <input
                    id={getFieldId('edit-email')}
                    type="email"
                    value={editEmail}
                    onChange={(event) => setEditEmail(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                  />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="Permission Preset" htmlFor={getFieldId('edit-preset')}>
                  <select
                    id={getFieldId('edit-preset')}
                    value={editPreset}
                    onChange={(event) => setEditPreset(event.target.value as PermissionPreset)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                  >
                    <option value="admin">Admin</option>
                    <option value="marketing">Marketing</option>
                    <option value="operations">Operations</option>
                    <option value="custom">Custom</option>
                  </select>
                </Field>
                {editPreset === 'custom' ? (
                  <Field label="Custom Role Name" htmlFor={getFieldId('edit-custom-role')}>
                    <input
                      id={getFieldId('edit-custom-role')}
                      type="text"
                      value={editCustomRole}
                      onChange={(event) => setEditCustomRole(event.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                    />
                  </Field>
                ) : <div />}
              </div>

              <div className="mt-4">
                <div className="ui-field-label mb-2">Event Access</div>
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => setEditAccessMode('all')}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${editAccessMode === 'all' ? 'bg-white text-[#7626c6] shadow-sm' : 'text-gray-600'}`}
                  >
                    All Events
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditAccessMode('selected')}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${editAccessMode === 'selected' ? 'bg-white text-[#7626c6] shadow-sm' : 'text-gray-600'}`}
                  >
                    Selected Events
                  </button>
                </div>
              </div>

              {editAccessMode === 'selected' ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {availableEventOptions.map((eventName) => (
                    <label
                      key={eventName}
                      htmlFor={getFieldId(`edit-event-${eventName}`)}
                      className={`cursor-pointer rounded-xl border p-3 transition ${
                        editSelectedEvents.includes(eventName)
                          ? 'border-[#7626c6]/30 bg-[#faf5ff]'
                          : 'border-gray-200 hover:border-[#7626c6]/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          id={getFieldId(`edit-event-${eventName}`)}
                          type="checkbox"
                          checked={editSelectedEvents.includes(eventName)}
                          onChange={() => setEditSelectedEvents((currentValues) => toggleEventSelection(currentValues, eventName))}
                          className="mt-1 rounded"
                        />
                        <span className="text-sm font-medium text-gray-900">{eventName}</span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : null}

              {editError ? <p className="mt-4 text-sm text-red-600" role="alert">{editError}</p> : null}

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveMemberEdit}
                  className="rounded-lg bg-[#7626c6] px-4 py-2 text-white transition hover:bg-[#5f1fa3]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </ModalShell>
        ) : null}

        {showTicketModal && selectedMember ? (
          <ModalShell onClose={closeTicketModal}>
            <div
              ref={ticketDialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={ticketTitleId}
              aria-describedby={ticketDescriptionId}
              tabIndex={-1}
              className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-[#7626c6] p-2">
                  <Ticket className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 id={ticketTitleId} className="ui-dialog-title">Assign Special Tickets</h2>
                  <p id={ticketDescriptionId} className="ui-dialog-subtitle">{selectedMember.name}</p>
                </div>
              </div>

              <div className="space-y-3">
                {availableSpecialTickets.map((ticketName) => (
                  <label
                    key={ticketName}
                    htmlFor={getFieldId(`ticket-${ticketName}`)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                      ticketSelections.includes(ticketName)
                        ? 'border-[#7626c6]/30 bg-[#faf5ff]'
                        : 'border-gray-200 hover:border-[#7626c6]/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        id={getFieldId(`ticket-${ticketName}`)}
                        type="checkbox"
                        checked={ticketSelections.includes(ticketName)}
                        onChange={() =>
                          setTicketSelections((currentSelections) => toggleEventSelection(currentSelections, ticketName))
                        }
                        className="rounded"
                      />
                      <span className="ui-type-subsection text-gray-900">{ticketName}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={closeTicketModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveTicketAssignments}
                  className="rounded-lg bg-[#7626c6] px-4 py-2 text-white transition hover:bg-[#5f1fa3]"
                >
                  Assign Tickets
                </button>
              </div>
            </div>
          </ModalShell>
        ) : null}
      </div>
    </div>
  );
}

function PresetCard({ preset, memberCount }: { preset: PermissionPreset; memberCount: number }) {
  const definition = presetDefinitions[preset];
  const Icon = preset === 'admin' ? Shield : preset === 'marketing' ? Mail : preset === 'operations' ? QrCode : Sparkles;

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-2xl p-3 ${definition.cardTone}`}>
          <Icon className="h-5 w-5 text-gray-900" />
        </div>
        <span className="ui-type-subsection text-gray-500">{memberCount} assigned</span>
      </div>
      <h3 className="ui-card-title">{definition.label}</h3>
      <p className="ui-support-copy mt-2">{definition.description}</p>
      {definition.bullets.length > 0 ? (
        <div className="mt-4 space-y-2">
          {definition.bullets.map((bullet) => (
            <div key={bullet} className="ui-type-subsection flex items-start gap-2 text-gray-700">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#7626c6]" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RoleBadge({ preset, customRoleName }: { preset: PermissionPreset; customRoleName?: string }) {
  const definition = presetDefinitions[preset];
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${definition.badgeClass}`}>
      {getPresetLabel(preset, customRoleName)}
    </span>
  );
}

function StatusBadge({ status }: { status: InviteStatus }) {
  const className =
    status === 'pending'
      ? 'bg-amber-100 text-amber-700'
      : status === 'sent'
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-slate-200 text-slate-700';

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${className}`}>{status}</span>;
}

function PanelCard({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description: string;
  badge: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h2 className="ui-card-title">{title}</h2>
          <p className="ui-support-copy mt-1">{description}</p>
        </div>
        <div className="rounded-full bg-[#f5ecfd] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7626c6]">
          {badge}
        </div>
      </div>
      {children}
    </section>
  );
}

function ToolRow({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Users;
  title: string;
  description: string;
}) {
  return (
    <div className="h-full rounded-xl border border-gray-200 p-4">
      <div className="inline-flex rounded-xl bg-gray-100 p-2 text-gray-700">
        <Icon className="h-4 w-4" />
      </div>
      <div className="ui-type-subsection mt-3 text-gray-900">{title}</div>
      <p className="ui-support-copy mt-2">{description}</p>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="ui-field-label mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function ModalShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 sm:px-6" onClick={onClose}>
      <div onClick={(event) => event.stopPropagation()}>{children}</div>
    </div>
  );
}
