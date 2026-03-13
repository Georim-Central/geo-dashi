import * as React from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscriptionTierDetails } from '@/lib/subscription-access';

import {
  AtSign,
  Bell,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  DollarSign,
  KeyRound,
  Laptop,
  Mail,
  MapPinned,
  MessageSquare,
  MoreVertical,
  PencilLine,
  Phone,
  Plus,
  Save,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Smartphone,
  Ticket,
  UserRound,
  Wallet,
  X,
} from 'lucide-react';

import { PaymentMethodSelector } from '@/components/ui/payment-1';
import { PasswordField } from '@/components/ui/password-input';
import { OrangeToggle } from '@/components/ui/toggle';
import { Tabs as VercelTabs, TabsList as VercelTabsList, TabsTrigger as VercelTabsTrigger } from '@/components/ui/vercel-tabs';
import { SettingsSection, SubscriptionTier } from '@/types/navigation';

interface SettingsPageProps {
  activeTier: SubscriptionTier;
  onTierChange: (tier: SubscriptionTier) => void;
  section: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const settingsTabs: Array<{ id: SettingsSection; label: string; icon: typeof Shield }> = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'payments', label: 'Payments', icon: Wallet },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'subscriptions', label: 'Subscriptions', icon: SlidersHorizontal },
];

const SETTINGS_PAGE_BACKGROUND =
  'var(--app-page-background)';

const profileAddresses = [
  {
    id: 'address-1',
    label: 'Primary',
    lines: ['119 North Jafrabair, Dhaka 1294', 'Bangladesh'],
  },
  {
    id: 'address-2',
    lines: ['420 Fariada Palace, Pallibiddut Road', 'Patuakhali'],
  },
];

const profileEmails = [
  { id: 'email-1', value: 'maksud.design7@gmail.com', primary: true },
  { id: 'email-2', value: 'tamannamr7@gmail.com' },
];

const profilePhones = [
  { id: 'phone-1', value: '+880 19246 99597', primary: true },
];

const defaultProfileAvatar =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&h=320&fit=crop&crop=faces';

const paymentMethods = [
  {
    id: 'payment-1',
    icon: (
      <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <CreditCard className="h-5 w-5" />
      </div>
    ),
    label: 'Visa **** 0912',
    description: 'Default card for organizer payouts and renewals.',
  },
  {
    id: 'payment-2',
    icon: (
      <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        <Building2 className="h-5 w-5" />
      </div>
    ),
    label: 'Mastercard **** 4821',
    description: 'Backup card used for account renewals.',
  },
  {
    id: 'payment-3',
    icon: (
      <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <Wallet className="h-5 w-5" />
      </div>
    ),
    label: 'Georim Wallet',
    description: 'Use your account balance for campaign credits.',
  },
];

const settingsMeta: Record<SettingsSection, { title: string; subtitle: string; icon: typeof Shield }> = {
  profile: {
    title: 'Profile',
    subtitle: 'Update your profile picture, identity, and organizer details.',
    icon: Shield,
  },
  security: {
    title: 'Security',
    subtitle: 'Review sign-in protection, password policy, and access activity.',
    icon: Shield,
  },
  payments: {
    title: 'Payments',
    subtitle: 'Manage payout methods, default payment settings, and transaction preferences.',
    icon: Wallet,
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Choose how updates, reminders, and alerts are delivered.',
    icon: Bell,
  },
  subscriptions: {
    title: 'Subscriptions',
    subtitle: 'Control which frontend feature layer is active across the platform.',
    icon: CreditCard,
  },
};

type ProfileInfo = {
  name: string;
  phone: string;
  joined: string;
};

type EmailEntry = {
  id: string;
  value: string;
  primary?: boolean;
};

type PhoneEntry = {
  id: string;
  value: string;
  primary?: boolean;
};

type AddressEntry = {
  id: string;
  label?: string;
  lines: string[];
};

type ProfileEditorState =
  | {
      kind: 'profile';
      name: string;
      phone: string;
    }
  | {
      kind: 'email';
      mode: 'add' | 'edit';
      id?: string;
      value: string;
      primary: boolean;
    }
  | {
      kind: 'phone';
      id: string;
      value: string;
      primary: boolean;
    }
  | {
      kind: 'address';
      id: string;
      label: string;
      line1: string;
      line2: string;
    };

type PaymentMethodDraft = {
  label: string;
  description: string;
  provider: 'visa' | 'mastercard' | 'wallet';
};

const PRIMARY_BUTTON_CLASS =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[#7626c6] px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_20px_rgba(118,38,198,0.20)] transition duration-[150ms] hover:bg-[#6620ab] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';
const SECONDARY_BUTTON_CLASS =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition duration-[150ms] hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';
const SETTINGS_PAGE_STACK_CLASS = 'space-y-8';
const SETTINGS_SECTION_GRID_CLASS = 'grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-8';
const SETTINGS_COLUMN_STACK_CLASS = 'space-y-6';
const SETTINGS_CONTENT_STACK_CLASS = 'space-y-4';
const SETTINGS_PANEL_CLASS = 'rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-4';
const SETTINGS_CARD_PADDING_CLASS = 'p-6';

function createPaymentMethodVisual(provider: PaymentMethodDraft['provider']) {
  if (provider === 'visa') {
    return (
      <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <CreditCard className="h-5 w-5" />
      </div>
    );
  }

  if (provider === 'mastercard') {
    return (
      <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        <Building2 className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
      <Wallet className="h-5 w-5" />
    </div>
  );
}

function SettingsCard({
  title,
  children,
  className = '',
  headerRight,
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
}) {
  return (
    <section className={`rounded-[28px] border border-gray-200 bg-white shadow-sm ${SETTINGS_CARD_PADDING_CLASS} ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6 lg:mb-7">
        <h2 className="ui-card-title">{title}</h2>
        {headerRight}
      </div>
      {children}
    </section>
  );
}

function SettingsFeedback({
  message,
}: {
  message: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-[#e7d8fa] bg-[#fbf7ff] px-5 py-4 ui-type-subsection text-[#5c2a99] sm:px-6 sm:py-5"
    >
      {message}
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="ui-type-meta uppercase tracking-[0.08em] text-gray-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-sm text-gray-900 shadow-sm outline-none transition duration-[150ms] placeholder:text-gray-400 focus:border-[#7626c6] focus:bg-white focus:ring-4 focus:ring-[#7626c6]/10"
      />
    </label>
  );
}

function ActionMenu({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
        aria-label={label}
        aria-expanded={isOpen}
      >
        <MoreVertical className="h-5 w-5" />
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-12 z-20 min-w-[180px] rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_16px_32px_rgba(15,23,42,0.12)]">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function ActionMenuButton({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-[#f6f0fc] hover:text-[#4b237d]"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SettingsModal({
  title,
  description,
  onClose,
  onSave,
  saveLabel = 'Save Changes',
  saveDisabled = false,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  onSave: () => void;
  saveLabel?: string;
  saveDisabled?: boolean;
  children: ReactNode;
}) {
  const titleId = React.useId();
  const descriptionId = React.useId();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
      animate={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.14)]"
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pb-5 pt-6">
          <div>
            <h2 id={titleId} className="ui-dialog-title">{title}</h2>
            <p id={descriptionId} className="ui-dialog-subtitle mt-1.5">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition duration-[150ms] hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7626c6]/20"
            aria-label="Close dialog"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="border-t border-gray-100" />

        {/* Body */}
        <div className="space-y-4 px-6 py-5">{children}</div>

        <div className="border-t border-gray-100" />

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className={SECONDARY_BUTTON_CLASS}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saveDisabled}
            className={PRIMARY_BUTTON_CLASS}
          >
            <Save className="h-4 w-4" />
            {saveLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProfileCardTitle({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center text-gray-600">
        {icon}
      </span>
      <span className="ui-type-ui tracking-tight text-gray-900">{title}</span>
    </span>
  );
}

function ProfileMetric({
  icon,
  label,
  value,
  detail,
  progress,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  progress?: number;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center text-gray-500">
          {icon}
        </div>
        <span className="ui-type-card tracking-[-0.03em] text-gray-950">{value}</span>
      </div>
      <div>
        <div className="ui-type-meta mb-1.5 uppercase tracking-[0.12em] text-gray-400">{label}</div>
        {progress !== undefined && (
          <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#7626c6] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <p className="ui-meta-text leading-5">{detail}</p>
      </div>
    </div>
  );
}

function getMaskedEmail(value: string) {
  const [localPart, domain] = value.split('@');

  if (!localPart || !domain) {
    return value;
  }

  const visibleLocal = localPart.slice(0, Math.min(2, localPart.length));
  const maskedLocal = `${visibleLocal}${localPart.length > 2 ? '***' : '*'}`;

  return `${maskedLocal}@${domain}`;
}

function ProfileSettingsContent() {
  const [profileInfo, setProfileInfo] = React.useState<ProfileInfo>({
    name: 'Maksudur Rahman',
    phone: '+880 1924699597',
    joined: '2/6/23',
  });
  const [emails, setEmails] = React.useState<EmailEntry[]>(profileEmails);
  const [phones, setPhones] = React.useState<PhoneEntry[]>(profilePhones);
  const [addresses, setAddresses] = React.useState<AddressEntry[]>(profileAddresses);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(defaultProfileAvatar);
  const [editor, setEditor] = React.useState<ProfileEditorState | null>(null);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [showAllEmails, setShowAllEmails] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const avatarInputId = React.useId();

  React.useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timer = window.setTimeout(() => setFeedback(null), 2800);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const visibleEmails = showAllEmails ? emails : emails.slice(0, 2);
  const initials = profileInfo.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const primaryEmail = emails.find((email) => email.primary) ?? emails[0] ?? null;
  const primaryAddress = addresses.find((address) => address.label?.toLowerCase() === 'primary') ?? addresses[0] ?? null;
  const completedProfileFields = [
    Boolean(profileInfo.name.trim()),
    Boolean(profileInfo.phone.trim()),
    Boolean(primaryEmail?.value.trim()),
    Boolean(primaryAddress?.lines[0]),
    Boolean(avatarPreview),
  ].filter(Boolean).length;
  const profileCompleteness = Math.round((completedProfileFields / 5) * 100);
  const connectedChannels = emails.length + phones.length;
  const primaryEmailPreview = primaryEmail ? getMaskedEmail(primaryEmail.value) : null;

  const promotePrimary = <T extends { id: string; primary?: boolean }>(items: T[], id: string) =>
    items.map((item) => ({ ...item, primary: item.id === id }));

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFeedback('Please upload an image file for the profile photo.');
      event.target.value = '';
      return;
    }

    const applyPreview = (preview: string) => {
      setAvatarPreview(preview);
      setFeedback(`Profile picture updated with ${file.name}.`);
      event.target.value = '';
    };

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          applyPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    applyPreview(`data:${file.type};base64,`);
  };

  const openProfileEditor = () => {
    setActiveMenu(null);
    setEditor({
      kind: 'profile',
      name: profileInfo.name,
      phone: profileInfo.phone,
    });
  };

  const handleSaveEditor = () => {
    if (!editor) {
      return;
    }

    if (editor.kind === 'profile') {
      setProfileInfo((current) => ({
        ...current,
        name: editor.name.trim() || current.name,
        phone: editor.phone.trim() || current.phone,
      }));
      setFeedback('Profile details updated.');
    }

    if (editor.kind === 'email') {
      const nextValue = editor.value.trim();
      if (!nextValue) {
        return;
      }

      setEmails((current) => {
        const nextEntries =
          editor.mode === 'add'
            ? [...current, { id: `email-${Date.now()}`, value: nextValue, primary: editor.primary }]
            : current.map((entry) =>
                entry.id === editor.id ? { ...entry, value: nextValue, primary: editor.primary } : entry
              );

        return editor.primary ? promotePrimary(nextEntries, editor.mode === 'add' ? nextEntries[nextEntries.length - 1].id : editor.id || '') : nextEntries;
      });
      setFeedback(editor.mode === 'add' ? 'Email address added.' : 'Email address updated.');
    }

    if (editor.kind === 'phone') {
      const nextValue = editor.value.trim();
      if (!nextValue) {
        return;
      }

      setPhones((current) => {
        const nextEntries = current.map((entry) =>
          entry.id === editor.id ? { ...entry, value: nextValue, primary: editor.primary } : entry
        );
        return editor.primary ? promotePrimary(nextEntries, editor.id) : nextEntries;
      });
      setFeedback('Phone number updated.');
    }

    if (editor.kind === 'address') {
      const nextLine1 = editor.line1.trim();
      const nextLine2 = editor.line2.trim();

      if (!nextLine1 || !nextLine2) {
        return;
      }

      setAddresses((current) =>
        current.map((entry) =>
          entry.id === editor.id
            ? {
                ...entry,
                label: editor.label.trim() || undefined,
                lines: [nextLine1, nextLine2],
              }
            : entry
        )
      );
      setFeedback('Address details updated.');
    }

    setEditor(null);
  };

  return (
    <div className={SETTINGS_PAGE_STACK_CLASS}>
      {feedback ? <SettingsFeedback message={feedback} /> : null}

      <div className={SETTINGS_SECTION_GRID_CLASS}>
        <div className={SETTINGS_COLUMN_STACK_CLASS}>
          <SettingsCard
            title={<ProfileCardTitle icon={<UserRound className="h-4 w-4" />} title="Your Profile" />}
            headerRight={
              <button
                type="button"
                onClick={openProfileEditor}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm transition duration-[150ms] hover:bg-gray-50 hover:text-gray-900"
              >
                <PencilLine className="h-3.5 w-3.5" />
                Edit
              </button>
            }
          >
            <div className="space-y-6">
              {/* Avatar + identity */}
              <div className="flex items-start gap-6">
                <div className="relative flex-shrink-0 pb-2 pr-2">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-xl font-semibold text-white ring-4 ring-white shadow-md">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt={`${profileInfo.name} profile`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <input
                    id={avatarInputId}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    aria-label="Profile image uploader"
                  />
                  <label
                    htmlFor={avatarInputId}
                    className="absolute -bottom-1.5 -right-1.5 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900 text-white shadow-md transition duration-[150ms] hover:bg-gray-700"
                    aria-label="Update profile image"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </label>
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="mb-1 inline-flex items-center rounded-full bg-[#f1e5fb] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7626c6]">
                    Lead Organizer
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-gray-950">{profileInfo.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-gray-500">
                    {primaryEmailPreview ? <span>{primaryEmailPreview}</span> : null}
                    {primaryEmailPreview ? <span className="text-gray-300">·</span> : null}
                    <span>{profileInfo.phone}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">
                    Joined {profileInfo.joined} · Identity used across invoices, receipts, and organizer surfaces.
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-4">
                <ProfileMetric
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  label="Profile Completeness"
                  value={`${profileCompleteness}%`}
                  detail="Identity, contact, and billing fields."
                  progress={profileCompleteness}
                />
                <ProfileMetric
                  icon={<Sparkles className="h-4 w-4" />}
                  label="Connected Channels"
                  value={`${connectedChannels}`}
                  detail="Active contact routes for support and alerts."
                />
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            title={<ProfileCardTitle icon={<AtSign className="h-4 w-4" />} title="Emails" />}
            headerRight={<span className="text-sm font-medium text-gray-500">{emails.length} total</span>}
            className="shadow-[0_18px_42px_rgba(15,23,42,0.06)]"
          >
            <div className="divide-y divide-gray-100">
              {visibleEmails.map((email) => (
                <div key={email.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-900">{email.value}</div>
                    <div className="text-xs text-gray-400">{email.primary ? 'Primary email' : 'Secondary email'}</div>
                  </div>
                  {email.primary ? (
                    <span className="flex-shrink-0 rounded-full bg-[#f1e5fb] px-2.5 py-0.5 text-xs font-medium text-[#7626c6]">Primary</span>
                  ) : null}
                  <ActionMenu
                    label={`Email actions for ${email.value}`}
                    isOpen={activeMenu === email.id}
                    onToggle={() => setActiveMenu((current) => (current === email.id ? null : email.id))}
                  >
                    <ActionMenuButton
                      label="Edit Email"
                      icon={<PencilLine className="h-4 w-4" />}
                      onClick={() => {
                        setActiveMenu(null);
                        setEditor({ kind: 'email', mode: 'edit', id: email.id, value: email.value, primary: Boolean(email.primary) });
                      }}
                    />
                    {!email.primary ? (
                      <ActionMenuButton
                        label="Set as Primary"
                        icon={<Sparkles className="h-4 w-4" />}
                        onClick={() => {
                          setEmails((current) => promotePrimary(current, email.id));
                          setActiveMenu(null);
                          setFeedback('Primary email updated.');
                        }}
                      />
                    ) : null}
                  </ActionMenu>
                </div>
              ))}

              <div className="flex flex-wrap items-center gap-2 pt-4">
                {emails.length > 2 ? (
                  <button
                    type="button"
                    onClick={() => setShowAllEmails((current) => !current)}
                    className="text-sm font-medium text-[#7626c6] transition duration-[150ms] hover:text-[#5f1fa3]"
                    aria-pressed={showAllEmails}
                  >
                    {showAllEmails ? 'Show fewer' : `Show all ${emails.length}`}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setEditor({ kind: 'email', mode: 'add', value: '', primary: emails.every((e) => !e.primary) })}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm transition duration-[150ms] hover:bg-gray-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Email
                </button>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard
            title={<ProfileCardTitle icon={<Phone className="h-4 w-4" />} title="Phone Number" />}
            className="shadow-[0_18px_42px_rgba(15,23,42,0.06)]"
          >
            <div className="divide-y divide-gray-100">
              {phones.map((phone) => (
                <div key={phone.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-gray-400">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">{phone.value}</div>
                    <div className="text-xs text-gray-400">{phone.primary ? 'Primary number' : 'Secondary number'}</div>
                  </div>
                  {phone.primary ? (
                    <span className="flex-shrink-0 rounded-full bg-[#f1e5fb] px-2.5 py-0.5 text-xs font-medium text-[#7626c6]">Primary</span>
                  ) : null}
                  <ActionMenu
                    label={`Phone actions for ${phone.value}`}
                    isOpen={activeMenu === phone.id}
                    onToggle={() => setActiveMenu((current) => (current === phone.id ? null : phone.id))}
                  >
                    <ActionMenuButton
                      label="Edit Number"
                      icon={<PencilLine className="h-4 w-4" />}
                      onClick={() => {
                        setActiveMenu(null);
                        setEditor({ kind: 'phone', id: phone.id, value: phone.value, primary: Boolean(phone.primary) });
                      }}
                    />
                  </ActionMenu>
                </div>
              ))}
            </div>
          </SettingsCard>
        </div>

        <div className={SETTINGS_COLUMN_STACK_CLASS}>
          <SettingsCard
            title={<ProfileCardTitle icon={<MapPinned className="h-4 w-4" />} title="Address" />}
            headerRight={<span className="text-sm font-medium text-gray-500">{addresses.length} saved</span>}
            className="shadow-[0_18px_42px_rgba(15,23,42,0.06)]"
          >
            <div className="divide-y divide-gray-100">
              {addresses.map((address) => (
                <div key={address.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center text-gray-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {address.label ? (
                      <div className="mb-1 inline-flex rounded-full bg-[#f1e5fb] px-2.5 py-0.5 text-xs font-medium text-[#7626c6]">
                        {address.label}
                      </div>
                    ) : null}
                    <div className="space-y-0.5 text-sm font-medium text-gray-900">
                      {address.lines.map((line) => (
                        <div key={line}>{line}</div>
                      ))}
                    </div>
                  </div>
                  <ActionMenu
                    label={`Address actions for ${address.lines[0]}`}
                    isOpen={activeMenu === address.id}
                    onToggle={() => setActiveMenu((current) => (current === address.id ? null : address.id))}
                  >
                    <ActionMenuButton
                      label="Edit Address"
                      icon={<PencilLine className="h-4 w-4" />}
                      onClick={() => {
                        setActiveMenu(null);
                        setEditor({ kind: 'address', id: address.id, label: address.label || '', line1: address.lines[0] || '', line2: address.lines[1] || '' });
                      }}
                    />
                  </ActionMenu>
                </div>
              ))}
            </div>
          </SettingsCard>

          <SettingsCard
            title={<ProfileCardTitle icon={<SlidersHorizontal className="h-4 w-4" />} title="Account Options" />}
            className="shadow-[0_18px_42px_rgba(15,23,42,0.06)]"
          >
            <div className="space-y-5">
              <p className="text-sm text-gray-400">
                These preferences shape how dates, identity, and operational details appear across Home.
              </p>

              <div className="grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">Language</span>
                  <select className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 shadow-sm outline-none transition duration-[150ms] focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10">
                    <option>Bangla</option>
                    <option>English</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">Time Zone</span>
                  <select className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 shadow-sm outline-none transition duration-[150ms] focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10">
                    <option>(GMT+6) Time in Bangladesh</option>
                    <option>(GMT+1) Central European Time</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">Nationality</span>
                  <select className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 shadow-sm outline-none transition duration-[150ms] focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10">
                    <option>Bangladeshi</option>
                    <option>American</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">Merchant ID</span>
                  <div className="flex h-11 w-full items-center rounded-xl border border-gray-200 bg-gray-50 pl-3.5 pr-4">
                    <span className="flex-1 text-sm text-gray-500 font-mono">GRM-29384-2026</span>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400">Read-only</span>
                  </div>
                </label>
              </div>
            </div>
          </SettingsCard>
        </div>
      </div>

      <AnimatePresence>
        {editor?.kind === 'profile' && (
          <SettingsModal
            title="Edit Profile"
            description="Update your organizer name and primary contact number."
            onClose={() => setEditor(null)}
            onSave={handleSaveEditor}
            saveDisabled={!editor.name.trim() || !editor.phone.trim()}
          >
            <FieldInput label="Full Name" value={editor.name} onChange={(value) => setEditor({ ...editor, name: value })} />
            <FieldInput label="Phone Number" value={editor.phone} onChange={(value) => setEditor({ ...editor, phone: value })} />
          </SettingsModal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editor?.kind === 'email' && (
          <SettingsModal
            title={editor.mode === 'add' ? 'Add Email' : 'Edit Email'}
            description="Keep your notification and recovery email addresses up to date."
            onClose={() => setEditor(null)}
            onSave={handleSaveEditor}
            saveLabel={editor.mode === 'add' ? 'Add Email' : 'Save Email'}
            saveDisabled={!editor.value.trim()}
          >
            <FieldInput
              label="Email Address"
              type="email"
              value={editor.value}
              onChange={(value) => setEditor({ ...editor, value })}
              placeholder="name@example.com"
            />
            <label className={`flex items-center gap-3 ${SETTINGS_PANEL_CLASS}`}>
              <input
                type="checkbox"
                checked={editor.primary}
                onChange={(event) => setEditor({ ...editor, primary: event.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#7626c6] focus:ring-[#7626c6]"
              />
              <span className="text-sm font-medium text-gray-700">Use as primary email</span>
            </label>
          </SettingsModal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editor?.kind === 'phone' && (
          <SettingsModal
            title="Edit Phone Number"
            description="Update the phone number used for organizer communication and urgent alerts."
            onClose={() => setEditor(null)}
            onSave={handleSaveEditor}
            saveDisabled={!editor.value.trim()}
          >
            <FieldInput label="Phone Number" value={editor.value} onChange={(value) => setEditor({ ...editor, value })} />
            <label className={`flex items-center gap-3 ${SETTINGS_PANEL_CLASS}`}>
              <input
                type="checkbox"
                checked={editor.primary}
                onChange={(event) => setEditor({ ...editor, primary: event.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#7626c6] focus:ring-[#7626c6]"
              />
              <span className="text-sm font-medium text-gray-700">Use as primary phone number</span>
            </label>
          </SettingsModal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editor?.kind === 'address' && (
          <SettingsModal
            title="Edit Address"
            description="Adjust the organizer address shown across invoices, receipts, and account details."
            onClose={() => setEditor(null)}
            onSave={handleSaveEditor}
            saveDisabled={!editor.line1.trim() || !editor.line2.trim()}
          >
            <FieldInput label="Label" value={editor.label} onChange={(value) => setEditor({ ...editor, label: value })} placeholder="Primary" />
            <FieldInput label="Address Line 1" value={editor.line1} onChange={(value) => setEditor({ ...editor, line1: value })} />
            <FieldInput label="Address Line 2" value={editor.line2} onChange={(value) => setEditor({ ...editor, line2: value })} />
          </SettingsModal>
        )}
      </AnimatePresence>
    </div>
  );
}

function PaymentsSettingsContent() {
  const [methods, setMethods] = React.useState(paymentMethods);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string | number>('payment-1');
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [paymentDraft, setPaymentDraft] = React.useState<PaymentMethodDraft | null>(null);

  React.useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timer = window.setTimeout(() => setFeedback(null), 2800);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleSelectionChange = (id: string | number) => {
    setSelectedPaymentMethod(id);
    const method = methods.find((entry) => entry.id === id);
    if (method) {
      setFeedback(`${method.label} is now your active payment method.`);
    }
  };

  const handleAddPaymentMethod = () => {
    setPaymentDraft({
      label: '',
      description: '',
      provider: 'visa',
    });
  };

  const handleSavePaymentMethod = () => {
    if (!paymentDraft) {
      return;
    }

    const nextLabel = paymentDraft.label.trim();
    const nextDescription = paymentDraft.description.trim();

    if (!nextLabel || !nextDescription) {
      return;
    }

    const nextMethod = {
      id: `payment-${Date.now()}`,
      icon: createPaymentMethodVisual(paymentDraft.provider),
      label: nextLabel,
      description: nextDescription,
    };

    setMethods((current) => [...current, nextMethod]);
    setSelectedPaymentMethod(nextMethod.id);
    setPaymentDraft(null);
    setFeedback(`${nextMethod.label} added and selected for future billing actions.`);
  };

  return (
    <div className={SETTINGS_PAGE_STACK_CLASS}>
      {feedback ? <SettingsFeedback message={feedback} /> : null}

      <div className={SETTINGS_SECTION_GRID_CLASS}>
        <div className={SETTINGS_COLUMN_STACK_CLASS}>
          <PaymentMethodSelector
            title="Choose how to pay"
            actionText="Add new method"
            methods={methods}
            defaultSelectedId={selectedPaymentMethod}
            onActionClick={handleAddPaymentMethod}
            onSelectionChange={handleSelectionChange}
            className="max-w-none rounded-[28px] border-gray-200 shadow-sm"
          />

          <SettingsCard title={<ProfileCardTitle icon={<Wallet className="h-4 w-4" />} title="Payout Preferences" />}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">Default Payout Method</span>
                <select className="h-16 w-full rounded-2xl border border-gray-200 bg-white text-base font-medium text-gray-900 shadow-sm outline-none transition duration-[150ms] hover:border-gray-300 focus:border-[#7626c6] focus:ring-[3px] focus:ring-[#7626c6]/15">
                  {methods.map((method) => (
                    <option key={method.id}>{method.label}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">Payout Schedule</span>
                <select className="h-16 w-full rounded-2xl border border-gray-200 bg-white text-base font-medium text-gray-900 shadow-sm outline-none transition duration-[150ms] hover:border-gray-300 focus:border-[#7626c6] focus:ring-[3px] focus:ring-[#7626c6]/15">
                  <option>Weekly on Friday</option>
                  <option>Daily</option>
                  <option>Monthly</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">Settlement Currency</span>
                <select className="h-16 w-full rounded-2xl border border-gray-200 bg-white text-base font-medium text-gray-900 shadow-sm outline-none transition duration-[150ms] hover:border-gray-300 focus:border-[#7626c6] focus:ring-[3px] focus:ring-[#7626c6]/15">
                  <option>USD</option>
                  <option>BDT</option>
                  <option>EUR</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">Finance Contact</span>
                <div className="flex h-11 w-full items-center rounded-xl border border-gray-200 bg-gray-50 pl-3.5 pr-4 shadow-sm">
                  <span className="flex-1 truncate text-sm text-gray-500">finance@georim.com</span>
                  <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-400">Read-only</span>
                </div>
              </label>
            </div>
          </SettingsCard>
        </div>

        <div className={SETTINGS_COLUMN_STACK_CLASS}>
          <SettingsCard
            title={<ProfileCardTitle icon={<Clock3 className="h-4 w-4" />} title="Recent Transactions" />}
            headerRight={
              <button type="button" className="text-xs font-medium text-[#7626c6] transition duration-150 hover:text-[#6620ab]">
                View all
              </button>
            }
          >
            <div className={SETTINGS_CONTENT_STACK_CLASS}>
              {[
                { id: 'TX-2048', title: 'Summer Music Festival payout', amount: '+$6,240', status: 'Completed', positive: true },
                { id: 'TX-2049', title: 'Premium workspace renewal', amount: '-$199', status: 'Processed', positive: false },
                { id: 'TX-2050', title: 'Marketing credit top-up', amount: '-$350', status: 'Pending', positive: false },
              ].map((transaction) => (
                <div key={transaction.id} className={`flex items-center justify-between ${SETTINGS_PANEL_CLASS} transition duration-[150ms] hover:bg-gray-50`}>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center ${transaction.positive ? 'text-emerald-600' : 'text-[#7626c6]'}`}>
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-950">{transaction.title}</div>
                      <div className="text-xs text-gray-400">{transaction.id}</div>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5 pl-4">
                    <span className={`text-sm font-semibold ${transaction.positive ? 'text-emerald-600' : 'text-gray-950'}`}>{transaction.amount}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      transaction.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      transaction.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{transaction.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </SettingsCard>
        </div>
      </div>

      {paymentDraft ? (
        <SettingsModal
          title="Add Payment Method"
          description="Save a new card or wallet so it can be selected for payouts and renewals."
          onClose={() => setPaymentDraft(null)}
          onSave={handleSavePaymentMethod}
          saveLabel="Add Method"
          saveDisabled={!paymentDraft.label.trim() || !paymentDraft.description.trim()}
        >
          <FieldInput
            label="Payment Method Label"
            value={paymentDraft.label}
            onChange={(value) => setPaymentDraft((current) => (current ? { ...current, label: value } : current))}
            placeholder="Visa **** 4821"
          />
          <FieldInput
            label="Description"
            value={paymentDraft.description}
            onChange={(value) => setPaymentDraft((current) => (current ? { ...current, description: value } : current))}
            placeholder="Default card for organizer payouts"
          />
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">Provider</span>
            <select
              value={paymentDraft.provider}
              onChange={(event) =>
                setPaymentDraft((current) =>
                  current ? { ...current, provider: event.target.value as PaymentMethodDraft['provider'] } : current
                )
              }
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 shadow-sm outline-none transition duration-[150ms] focus:border-[#7626c6] focus:bg-white focus:ring-4 focus:ring-[#7626c6]/10"
            >
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
              <option value="wallet">Wallet</option>
            </select>
          </label>
        </SettingsModal>
      ) : null}
    </div>
  );
}

function SecuritySettingsContent() {
  const [passwords, setPasswords] = React.useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [feedbackType, setFeedbackType] = React.useState<'success' | 'error'>('success');

  React.useEffect(() => {
    if (!feedback) return undefined;
    const timer = window.setTimeout(() => setFeedback(null), 3000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const passwordMismatch = Boolean(passwords.next && passwords.confirm && passwords.next !== passwords.confirm);
  const passwordTooShort = Boolean(passwords.next && passwords.next.length < 8);
  const canUpdatePassword =
    Boolean(passwords.current.trim()) &&
    Boolean(passwords.next.trim()) &&
    Boolean(passwords.confirm.trim()) &&
    !passwordMismatch &&
    !passwordTooShort;

  const getPasswordStrength = (pwd: string): number => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(passwords.next);
  const strengthConfig = [
    null,
    { label: 'Weak', color: 'bg-rose-400', text: 'text-rose-500' },
    { label: 'Fair', color: 'bg-amber-400', text: 'text-amber-500' },
    { label: 'Good', color: 'bg-blue-400', text: 'text-blue-500' },
    { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' },
  ] as const;

  const handleUpdatePassword = () => {
    if (!passwords.current.trim() || !passwords.next.trim() || !passwords.confirm.trim()) {
      setFeedbackType('error');
      setFeedback('Complete all password fields before updating access.');
      return;
    }
    if (passwords.next.length < 8) {
      setFeedbackType('error');
      setFeedback('Use at least 8 characters for the new password.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setFeedbackType('error');
      setFeedback('The new password and confirmation must match.');
      return;
    }
    setPasswords({ current: '', next: '', confirm: '' });
    setFeedbackType('success');
    setFeedback('Password updated. All active sessions remain protected.');
  };

  return (
    <div className={SETTINGS_PAGE_STACK_CLASS}>
      {/* Feedback banner */}
      <AnimatePresence>
        {feedback ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-live="polite"
            className={`rounded-2xl border px-5 py-4 text-sm font-medium ${
              feedbackType === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {feedback}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className={SETTINGS_SECTION_GRID_CLASS}>
        {/* LEFT COLUMN */}
        <div className={SETTINGS_COLUMN_STACK_CLASS}>
          {/* Password & Access */}
          <SettingsCard
            title="Password & Access"
            headerRight={
              <span className="rounded-full border border-[#e2d0f7] bg-[#f7f0ff] px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#7626c6]">
                Recommended
              </span>
            }
          >
            <div className="space-y-4">
              <PasswordField
                label="Current Password"
                placeholder="Enter your current password"
                hint="The password you use to sign in right now."
                value={passwords.current}
                onChange={(value) => setPasswords((s) => ({ ...s, current: value }))}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <PasswordField
                    label="New Password"
                    placeholder="Create a strong new password"
                    hint="8+ characters · mix of letters, numbers, and symbols."
                    value={passwords.next}
                    onChange={(value) => setPasswords((s) => ({ ...s, next: value }))}
                  />
                  {/* Strength meter */}
                  {passwords.next ? (
                    <div className="mt-3 space-y-1.5">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              level <= passwordStrength
                                ? (strengthConfig[passwordStrength]?.color ?? 'bg-gray-200')
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${strengthConfig[passwordStrength]?.text ?? 'text-gray-400'}`}>
                          {strengthConfig[passwordStrength]?.label ?? ''}
                        </span>
                        <span className="text-xs text-gray-400">{passwords.next.length} characters</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <PasswordField
                    label="Confirm New Password"
                    placeholder="Re-enter your new password"
                    hint="Must exactly match the new password above."
                    value={passwords.confirm}
                    onChange={(value) => setPasswords((s) => ({ ...s, confirm: value }))}
                  />
                  {passwordMismatch ? (
                    <p className="mt-2 text-xs font-medium text-rose-500">Passwords do not match.</p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={handleUpdatePassword}
                  disabled={!canUpdatePassword}
                  className={PRIMARY_BUTTON_CLASS}
                >
                  Update Password
                </button>
              </div>
            </div>
          </SettingsCard>

          {/* Security Overview */}
          <SettingsCard title="Security Overview">
            <div className={SETTINGS_CONTENT_STACK_CLASS}>
              {([
                {
                  id: 'overview-1',
                  title: 'Two-factor authentication',
                  detail: 'Authenticator app active · required for admin actions',
                  status: 'Enabled',
                },
                {
                  id: 'overview-2',
                  title: 'Recovery options',
                  detail: 'Backup email and device prompts configured',
                  status: 'Configured',
                },
                {
                  id: 'overview-3',
                  title: 'Session monitoring',
                  detail: '3 devices trusted in the last 30 days',
                  status: 'Active',
                },
              ] as const).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`flex w-full items-center justify-between gap-4 ${SETTINGS_PANEL_CLASS} text-left transition duration-150 hover:bg-gray-50 hover:shadow-sm`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-950">{item.title}</div>
                      <div className="mt-0.5 text-xs text-gray-500">{item.detail}</div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      {item.status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </SettingsCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className={SETTINGS_COLUMN_STACK_CLASS}>
          {/* Security Score Banner */}
          <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center text-emerald-600">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-950">Account security is strong</div>
                  <div className="mt-0.5 text-sm text-gray-500">
                    2FA active · Password updated today · 2 devices
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-1.5">
                <span className="text-4xl font-semibold tracking-tight text-emerald-600">92</span>
                <span className="mb-1 text-sm font-medium text-gray-400">/ 100</span>
              </div>
            </div>
            <div className="mt-5">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: '92%' }} />
              </div>
              <div className="mt-2 flex justify-between text-xs font-medium text-gray-400">
                <span>Security Score</span>
                <span className="text-emerald-600">Excellent</span>
              </div>
            </div>
          </div>

          {/* Recent Security Activity */}
          <SettingsCard
            title="Recent Activity"
            headerRight={
              <button type="button" className="text-xs font-medium text-[#7626c6] transition duration-150 hover:text-[#6620ab]">
                View all
              </button>
            }
          >
            <div className={SETTINGS_CONTENT_STACK_CLASS}>
              {([
                {
                  id: 'activity-1',
                  title: 'Password changed',
                  detail: 'Chicago, United States',
                  time: 'Today 9:42 AM',
                  icon: KeyRound,
                  color: 'text-amber-600',
                },
                {
                  id: 'activity-2',
                  title: 'Desktop session approved',
                  detail: 'MacBook Pro · Safari 18.1',
                  time: 'Today 8:15 AM',
                  icon: Laptop,
                  color: 'text-blue-600',
                },
                {
                  id: 'activity-3',
                  title: 'Mobile login verified',
                  detail: 'iPhone 16 Pro · Face ID',
                  time: 'Yesterday 11:30 PM',
                  icon: Smartphone,
                  color: 'text-gray-600',
                },
              ] as const).map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className={`flex items-center gap-4 ${SETTINGS_PANEL_CLASS} transition duration-150 hover:bg-gray-50`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center ${activity.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-950">{activity.title}</div>
                      <div className="mt-0.5 text-xs text-gray-500">{activity.detail}</div>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-gray-400">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </SettingsCard>

          {/* Trusted Devices */}
          <SettingsCard
            title="Trusted Devices"
            headerRight={
              <span className="text-sm font-medium text-gray-400">2 devices</span>
            }
          >
            <div className={SETTINGS_CONTENT_STACK_CLASS}>
              {([
                {
                  id: 'device-1',
                  name: 'MacBook Pro 16"',
                  detail: 'Chicago, United States',
                  time: 'Active now',
                  isCurrent: true,
                  icon: Laptop,
                },
                {
                  id: 'device-2',
                  name: 'iPhone 16 Pro',
                  detail: 'Organizer mobile · Face ID',
                  time: '2 hours ago',
                  isCurrent: false,
                  icon: Smartphone,
                },
              ] as const).map((device) => {
                const Icon = device.icon;
                return (
                  <div
                    key={device.id}
                    className={`flex items-center gap-4 ${SETTINGS_PANEL_CLASS} transition duration-150 hover:bg-gray-50`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center ${device.isCurrent ? 'text-[#7626c6]' : 'text-gray-500'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-950">{device.name}</span>
                        {device.isCurrent ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                            Current
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">{device.detail}</div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="text-xs text-gray-400">{device.time}</span>
                      {!device.isCurrent ? (
                        <button
                          type="button"
                          className="rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-500 transition duration-150 hover:bg-rose-50 hover:text-rose-600 active:scale-95"
                        >
                          Revoke
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}

function getAssistantSuggestions(section: SettingsSection) {
  const suggestions: Record<SettingsSection, string[]> = {
    profile: [
      'Review primary email and phone details before sending organizer invoices.',
      'Update your public-facing identity before inviting collaborators or publishing events.',
      'Use the profile editor to keep payout and recovery contact information aligned.',
    ],
    security: [
      'Rotate your password regularly and keep confirmations matched before saving.',
      'Review trusted devices when you change hardware or sign in from a new location.',
      'Keep recovery methods current so admin access is not blocked during critical events.',
    ],
    payments: [
      'Set the default payout method before adjusting your payout schedule.',
      'Use a dedicated finance contact so settlement updates go to the right inbox.',
      'Review recent transactions after adding or switching billing methods.',
    ],
    notifications: [
      'Keep urgent payout and security alerts enabled even when digest summaries are reduced.',
      'Pair quiet hours with push alerts so critical day-of-event updates still surface.',
      'Review channel settings after onboarding new team members or changing workflows.',
    ],
    subscriptions: [
      'Use Free to review the core organizer workspace without premium operational screens.',
      'Switch to Premium when you want event management, analytics, and finance visible together.',
      'Switch to Business / Enterprise when you need team management and full collaboration controls.',
    ],
  };

  return suggestions[section];
}

function SettingsAssistantModal({
  section,
  onClose,
}: {
  section: SettingsSection;
  onClose: () => void;
}) {
  const sectionData = settingsMeta[section];
  const suggestions = getAssistantSuggestions(section);

  return (
    <SettingsModal
      title={`${sectionData.title} Assistant`}
      description={`Quick guidance for this ${sectionData.title.toLowerCase()} section.`}
      onClose={onClose}
      onSave={onClose}
      saveLabel="Close Assistant"
    >
      <div className="space-y-3 sm:space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion} className={`${SETTINGS_PANEL_CLASS} text-sm leading-6 text-gray-600`}>
            {suggestion}
          </div>
        ))}
      </div>
    </SettingsModal>
  );
}

function NotificationToggle({
  icon,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`flex items-center gap-4 ${SETTINGS_PANEL_CLASS} transition duration-[150ms] hover:bg-gray-50`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#7626c6]">
        {icon}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="text-sm font-semibold text-gray-950">{label}</div>
        <div className="text-xs leading-relaxed text-gray-500">{description}</div>
      </div>
      <OrangeToggle
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        checked={enabled}
        onChange={onToggle}
        className="h-7 w-12 shrink-0 bg-gray-300 before:left-[calc(1.5em_-_1.55em)] before:top-[calc(1.5em_-_1.55em)] before:h-[1.55em] before:w-[1.55em] before:border-gray-300 checked:bg-[#7626c6] checked:before:border-[#6b23b6] checked:hover:before:shadow-[0_0_0px_8px_rgba(118,38,198,0.16)]"
      />
    </div>
  );
}

function NotificationsSettingsContent() {
  const [channelSettings, setChannelSettings] = React.useState({
    email: true,
    push: true,
    sms: false,
  });
  const [alertSettings, setAlertSettings] = React.useState({
    ticketSales: true,
    attendeeMessages: true,
    payoutUpdates: true,
    eventReminders: false,
  });

  const toggleChannel = (key: keyof typeof channelSettings) => {
    setChannelSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  const toggleAlert = (key: keyof typeof alertSettings) => {
    setAlertSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className={SETTINGS_SECTION_GRID_CLASS}>
      <div className={SETTINGS_COLUMN_STACK_CLASS}>
        <SettingsCard title={<ProfileCardTitle icon={<Bell className="h-4 w-4" />} title="Delivery Channels" />}>
          <div className={SETTINGS_CONTENT_STACK_CLASS}>
            <NotificationToggle
              icon={<Mail className="h-4 w-4" />}
              label="Email Notifications"
              description="Receive organizer summaries, attendee updates, and billing notices by email."
              enabled={channelSettings.email}
              onToggle={() => toggleChannel('email')}
            />
            <NotificationToggle
              icon={<Smartphone className="h-4 w-4" />}
              label="Push Notifications"
              description="Get live updates in-app for event activity, approvals, and urgent operational changes."
              enabled={channelSettings.push}
              onToggle={() => toggleChannel('push')}
            />
            <NotificationToggle
              icon={<Phone className="h-4 w-4" />}
              label="SMS Alerts"
              description="Send critical reminders and payout alerts to your verified mobile number."
              enabled={channelSettings.sms}
              onToggle={() => toggleChannel('sms')}
            />
          </div>
        </SettingsCard>

        <SettingsCard title={<ProfileCardTitle icon={<Sparkles className="h-4 w-4" />} title="Notification Digest" />}>
          <div className={SETTINGS_CONTENT_STACK_CLASS}>
            {[
              {
                id: 'digest-email',
                title: 'Morning Organizer Brief',
                detail: 'Sales, attendance, and campaign highlights.',
                badge: 'Daily 8 AM',
                icon: Mail,
              },
              {
                id: 'digest-inbox',
                title: 'Unread Conversations',
                detail: 'Attendee replies and internal team mentions bundled.',
                badge: 'Every 2 hrs',
                icon: MessageSquare,
              },
              {
                id: 'digest-system',
                title: 'Critical System Alerts',
                detail: 'Payment failures, permission changes, and security notices.',
                badge: 'Instant',
                icon: Bell,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className={`flex items-center gap-4 ${SETTINGS_PANEL_CLASS} transition duration-[150ms] hover:bg-gray-50`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#7626c6]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="text-sm font-semibold text-gray-950">{item.title}</div>
                    <div className="text-xs leading-relaxed text-gray-500">{item.detail}</div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${item.badge === 'Instant' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </SettingsCard>
      </div>

      <div className={SETTINGS_COLUMN_STACK_CLASS}>
        <SettingsCard title={<ProfileCardTitle icon={<SlidersHorizontal className="h-4 w-4" />} title="Event Alerts" />}>
          <div className={SETTINGS_CONTENT_STACK_CLASS}>
            <NotificationToggle
              icon={<Ticket className="h-4 w-4" />}
              label="Ticket Sales"
              description="Instant notifications when ticket velocity spikes or a pricing tier sells out."
              enabled={alertSettings.ticketSales}
              onToggle={() => toggleAlert('ticketSales')}
            />
            <NotificationToggle
              icon={<MessageSquare className="h-4 w-4" />}
              label="Attendee Messages"
              description="Notify me when attendees send support questions or request refunds."
              enabled={alertSettings.attendeeMessages}
              onToggle={() => toggleAlert('attendeeMessages')}
            />
            <NotificationToggle
              icon={<DollarSign className="h-4 w-4" />}
              label="Payout Updates"
              description="Keep me informed when payouts are processed, delayed, or require review."
              enabled={alertSettings.payoutUpdates}
              onToggle={() => toggleAlert('payoutUpdates')}
            />
            <NotificationToggle
              icon={<Bell className="h-4 w-4" />}
              label="Event Reminders"
              description="Daily countdown reminders for upcoming events and publishing deadlines."
              enabled={alertSettings.eventReminders}
              onToggle={() => toggleAlert('eventReminders')}
            />
          </div>
        </SettingsCard>

        <SettingsCard title={<ProfileCardTitle icon={<Clock3 className="h-4 w-4" />} title="Quiet Hours" />}>
          <div className={SETTINGS_CONTENT_STACK_CLASS}>
            <div className={`flex items-center gap-4 ${SETTINGS_PANEL_CLASS}`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center text-amber-500">
                <Clock3 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="text-sm font-semibold text-gray-950">Pause non-urgent notifications overnight</div>
                <div className="text-xs leading-relaxed text-gray-500">Critical security and payment alerts still bypass quiet hours.</div>
              </div>
              <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600">Active</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">Starts</span>
                <select className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-900 shadow-sm focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10">
                  <option>10:00 PM</option>
                  <option>11:00 PM</option>
                  <option>12:00 AM</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">Ends</span>
                <select className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-900 shadow-sm focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10">
                  <option>7:00 AM</option>
                  <option>8:00 AM</option>
                  <option>9:00 AM</option>
                </select>
              </label>
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}

function PlaceholderSettingsContent({ section }: { section: SettingsSection }) {
  const sectionData = settingsMeta[section];
  const Icon = sectionData.icon;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <section className={`rounded-xl border border-gray-200 bg-white shadow-sm xl:col-span-2 ${SETTINGS_CARD_PADDING_CLASS}`}>
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center text-[#7626c6]">
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="ui-card-title">{sectionData.title}</h2>
            <p className="ui-support-copy max-w-2xl">{sectionData.subtitle}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SubscriptionSettingsContent({
  activeTier,
  onTierChange,
}: {
  activeTier: SubscriptionTier;
  onTierChange: (tier: SubscriptionTier) => void;
}) {
  const tierBenefits: Record<SubscriptionTier, string[]> = {
    free: ['Home base workspace', 'Create Event flow', 'Notification Center, Settings, and AI chat'],
    premium: ['Everything in Free', 'Event Management, Analytics, and Finance', 'Premium Home insights'],
    business: ['Everything in Premium', 'Team Management workspace', 'Full collaboration controls across the platform'],
  };

  return (
    <div className={SETTINGS_PAGE_STACK_CLASS}>
      <SettingsCard
        title={<ProfileCardTitle icon={<CreditCard className="h-4 w-4" />} title="Platform Subscription Layers" />}
        className="shadow-[0_18px_42px_rgba(15,23,42,0.06)]"
      >
        <div className="space-y-6">
          <p className="max-w-3xl text-sm leading-6 text-gray-500">
            Switch the frontend workspace between Free, Premium, and Business / Enterprise. This is a UI-only control for the MVP and changes feature visibility immediately across the platform.
          </p>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {(['free', 'premium', 'business'] as SubscriptionTier[]).map((tier) => {
              const isActive = activeTier === tier;
              const tierDetail = subscriptionTierDetails[tier];

              return (
                <button
                  key={tier}
                  type="button"
                  onClick={() => onTierChange(tier)}
                  aria-pressed={isActive}
                  className={`rounded-[24px] border p-5 text-left transition duration-[150ms] ${
                    isActive
                      ? 'border-[#7626c6] bg-[#f8f1ff] shadow-[0_18px_42px_rgba(118,38,198,0.12)]'
                      : 'border-gray-200 bg-white hover:border-[#d5baf2] hover:bg-[#fcf9ff]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold tracking-[-0.02em] text-gray-950">{tierDetail.label}</p>
                      <p className="mt-1 text-sm font-medium text-[#7626c6]">{tierDetail.subtitle}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${
                        isActive ? 'bg-[#7626c6] text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {isActive ? 'Active' : 'Select'}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-gray-600">{tierDetail.description}</p>

                  <div className="mt-5 space-y-2">
                    {tierBenefits[tier].map((benefit) => (
                      <div key={benefit} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <CheckCircle2 className={`mt-0.5 h-4 w-4 flex-shrink-0 ${isActive ? 'text-[#7626c6]' : 'text-gray-400'}`} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}

export function SettingsPage({ activeTier, onTierChange, section, onSectionChange }: SettingsPageProps) {
  const [assistantOpen, setAssistantOpen] = React.useState(false);

  return (
    <div
      className="min-h-full p-5 sm:p-6 lg:p-8"
      style={{
        background: SETTINGS_PAGE_BACKGROUND,
      }}
    >
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-8 space-y-2 sm:mb-9 sm:space-y-3 lg:mb-10">
          <h1 className="ui-page-title ui-type-section text-[#2c1451]">Settings</h1>
          <p className="ui-page-subtitle ui-type-subsection text-[#2c1451]/85">
            Manage your organizer profile, security, payouts, alerts, and subscription controls from one workspace.
          </p>
        </div>

        <div
          className="sticky top-0 z-30 mb-8 p-3"
          style={{ background: SETTINGS_PAGE_BACKGROUND }}
        >
          <VercelTabs
            value={section}
            onValueChange={(value) => onSectionChange(value as SettingsSection)}
            className="w-full"
          >
            <VercelTabsList className="w-full">
              {settingsTabs.map((tab) => (
                <VercelTabsTrigger key={tab.id} value={tab.id}>
                  <tab.icon className="h-4 w-4" aria-hidden="true" />
                  <span>{tab.label}</span>
                </VercelTabsTrigger>
              ))}
            </VercelTabsList>
          </VercelTabs>
        </div>

        {section === 'profile' ? <ProfileSettingsContent /> : null}
        {section === 'security' ? <SecuritySettingsContent /> : null}
        {section === 'payments' ? <PaymentsSettingsContent /> : null}
        {section === 'notifications' ? <NotificationsSettingsContent /> : null}
        {section === 'subscriptions' ? (
          <SubscriptionSettingsContent activeTier={activeTier} onTierChange={onTierChange} />
        ) : null}
        {section !== 'profile' &&
        section !== 'security' &&
        section !== 'payments' &&
        section !== 'notifications' &&
        section !== 'subscriptions' ? (
          <PlaceholderSettingsContent section={section} />
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setAssistantOpen(true)}
        className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8f48eb] to-[#6c20c8] text-white shadow-[0_18px_30px_rgba(118,38,198,0.35)] transition hover:scale-[1.02]"
        aria-label="Open settings assistant"
      >
        <Sparkles className="h-6 w-6" />
      </button>

      {assistantOpen ? <SettingsAssistantModal section={section} onClose={() => setAssistantOpen(false)} /> : null}
    </div>
  );
}
