import * as React from 'react';
import type { ReactNode } from 'react';

import {
  Bell,
  Building2,
  Camera,
  CheckCircle2,
  Clock3,
  ChevronDown,
  CreditCard,
  DollarSign,
  KeyRound,
  Laptop,
  Mail,
  MessageSquare,
  MoreVertical,
  PencilLine,
  Plus,
  Save,
  Shield,
  Sparkles,
  Smartphone,
  Wallet,
  X,
} from 'lucide-react';

import PricingTable, { type Plan } from '@/components/ui/modern-pricing-table';
import { PaymentMethodSelector } from '@/components/ui/payment-1';
import { PasswordField } from '@/components/ui/password-input';
import { OrangeToggle } from '@/components/ui/toggle';
import { SettingsSection } from '@/types/navigation';

interface SettingsPageProps {
  section: SettingsSection;
}

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
    id: 1,
    icon: (
      <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <CreditCard className="h-5 w-5" />
      </div>
    ),
    label: 'Visa **** 0912',
    description: 'Default card for organizer payouts and renewals.',
  },
  {
    id: 2,
    icon: (
      <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        <Building2 className="h-5 w-5" />
      </div>
    ),
    label: 'Mastercard **** 4821',
    description: 'Backup card used for premium plan renewals.',
  },
  {
    id: 3,
    icon: (
      <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <Wallet className="h-5 w-5" />
      </div>
    ),
    label: 'Georim Wallet',
    description: 'Use your account balance for campaign credits.',
  },
];

const premiumPlans: Plan[] = [
  {
    title: 'Starter',
    price: {
      monthly: 9,
      yearly: 96,
    },
    description: 'Perfect for organizers testing one-off launches and simple event operations.',
    features: [
      'Up to 5 active events',
      'Basic organizer analytics',
      'Standard attendee exports',
      'Email support',
      'Single workspace',
    ],
    ctaText: 'Get Started',
    ctaHref: '#',
  },
  {
    title: 'Professional',
    price: {
      monthly: 29,
      yearly: 312,
    },
    description: 'Best for fast-growing teams running multiple campaigns and recurring events.',
    features: [
      'Up to 25 active events',
      'Advanced analytics dashboards',
      'Marketing and payout controls',
      'Priority support',
      'Team collaboration tools',
      'Custom event branding',
      'Integrations access',
    ],
    ctaText: 'Start Free Trial',
    ctaHref: '#',
    isFeatured: true,
  },
  {
    title: 'Enterprise',
    price: {
      monthly: 99,
      yearly: 1068,
    },
    description: 'For high-volume organizations that need security, scale, and advanced workflows.',
    features: [
      'Unlimited events',
      'Unlimited team members',
      '24/7 dedicated support',
      'Role-based access controls',
      'Advanced security and audit logs',
      'Custom integrations',
      'SSO authentication',
      'White-glove onboarding',
    ],
    ctaText: 'Contact Sales',
    ctaHref: '#',
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
  'premium-subscriptions': {
    title: 'Premium Subscriptions',
    subtitle: 'Control premium plan benefits, upgrades, and workspace entitlements.',
    icon: Sparkles,
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Choose how updates, reminders, and alerts are delivered.',
    icon: Bell,
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

function SettingsCard({
  title,
  children,
  className = '',
  headerRight,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
}) {
  return (
    <section className={`rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm ${className}`}>
      <div className="mb-7 flex items-start justify-between gap-4">
        <h2 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-gray-950">{title}</h2>
        {headerRight}
      </div>
      {children}
    </section>
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
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-[1.02rem] text-gray-900 shadow-sm outline-none transition focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10"
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b102f]/35 p-6">
      <div className="w-full max-w-xl rounded-[30px] border border-gray-200 bg-white p-8 shadow-[0_30px_80px_rgba(24,14,44,0.22)]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-gray-950">{title}</h2>
            <p className="text-sm leading-6 text-gray-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-800"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">{children}</div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saveDisabled}
            className="inline-flex items-center gap-2 rounded-xl bg-[#7626c6] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(118,38,198,0.22)] transition hover:bg-[#6620ab] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
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
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

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
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="space-y-6">
        {feedback ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-[22px] border border-[#e7d8fa] bg-[#fbf7ff] px-5 py-4 text-sm font-medium text-[#5c2a99]"
          >
            {feedback}
          </div>
        ) : null}

        <SettingsCard title="Your profile" headerRight={<span className="text-sm text-gray-500">Joined {profileInfo.joined}</span>}>
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_top_left,#4b4b58,#1f1f29_65%)] text-3xl font-semibold text-white shadow-sm">
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
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  aria-label="Profile image uploader"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white bg-[#eadbf8] text-[#3f2467] shadow-sm"
                  aria-label="Update profile image"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="text-[1.1rem] font-semibold tracking-[-0.02em] text-gray-950">{profileInfo.name}</div>
                <div className="text-[1.05rem] text-gray-500">{profileInfo.phone}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={openProfileEditor}
              className="inline-flex items-center gap-2 rounded-xl bg-[#f1e5fb] px-4 py-3 text-sm font-medium text-[#3f2467] transition hover:bg-[#ead9fb]"
            >
              <PencilLine className="h-4 w-4" />
              Edit
            </button>
          </div>
        </SettingsCard>

        <SettingsCard title="Emails">
          <div className="space-y-8">
            {visibleEmails.map((email) => (
              <div key={email.id} className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  {email.primary && (
                    <span className="inline-flex rounded-full bg-[#f1e5fb] px-4 py-1.5 text-sm font-medium text-[#7a29d5]">
                      Primary
                    </span>
                  )}
                  <div className="text-[1.05rem] text-gray-900">{email.value}</div>
                </div>
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
                      setEditor({
                        kind: 'email',
                        mode: 'edit',
                        id: email.id,
                        value: email.value,
                        primary: Boolean(email.primary),
                      });
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
          </div>

          <div className="mt-10 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAllEmails((current) => !current)}
              className="rounded-xl bg-[#f3e8fc] px-5 py-3 text-sm font-medium text-gray-800 transition hover:bg-[#ebdefb]"
              aria-pressed={showAllEmails}
            >
              {showAllEmails ? 'Show fewer emails' : `See all email (${emails.length})`}
            </button>
            <button
              type="button"
              onClick={() =>
                setEditor({
                  kind: 'email',
                  mode: 'add',
                  value: '',
                  primary: emails.every((email) => !email.primary),
                })
              }
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
              Add Email
            </button>
          </div>
        </SettingsCard>

        <SettingsCard title="Phone Number">
          <div className="space-y-8">
            {phones.map((phone) => (
              <div key={phone.id} className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  {phone.primary && (
                    <span className="inline-flex rounded-full bg-[#f1e5fb] px-4 py-1.5 text-sm font-medium text-[#7a29d5]">
                      Primary
                    </span>
                  )}
                  <div className="text-[1.05rem] text-gray-900">{phone.value}</div>
                </div>
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
                      setEditor({
                        kind: 'phone',
                        id: phone.id,
                        value: phone.value,
                        primary: Boolean(phone.primary),
                      });
                    }}
                  />
                </ActionMenu>
              </div>
            ))}
          </div>
        </SettingsCard>
      </div>

      <div className="space-y-6">
        <SettingsCard title="Address">
          <div className="space-y-8">
            {addresses.map((address) => (
              <div key={address.id} className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  {address.label && (
                    <span className="inline-flex rounded-full bg-[#f1e5fb] px-4 py-1.5 text-sm font-medium text-[#7a29d5]">
                      {address.label}
                    </span>
                  )}
                  <div className="space-y-0.5 text-[1.05rem] leading-8 text-gray-900">
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
                      setEditor({
                        kind: 'address',
                        id: address.id,
                        label: address.label || '',
                        line1: address.lines[0] || '',
                        line2: address.lines[1] || '',
                      });
                    }}
                  />
                </ActionMenu>
              </div>
            ))}
          </div>
        </SettingsCard>

        <SettingsCard title="Account Options">
          <div className="space-y-6">
            <label className="block">
              <span className="mb-3 block text-sm font-medium text-gray-500">Language</span>
              <div className="relative">
                <select className="h-14 w-full appearance-none rounded-2xl border border-gray-200 bg-[#fafafa] px-4 pr-12 text-[1.05rem] text-gray-900 shadow-sm focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10">
                  <option>Bangla</option>
                  <option>English</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-medium text-gray-500">Time zone</span>
              <div className="relative">
                <select className="h-14 w-full appearance-none rounded-2xl border border-gray-200 bg-[#fafafa] px-4 pr-12 text-[1.05rem] text-gray-900 shadow-sm focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10">
                  <option>(GMT+6) Time in Bangladesh</option>
                  <option>(GMT+1) Central European Time</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-medium text-gray-500">Nationality</span>
              <div className="relative">
                <select className="h-14 w-full appearance-none rounded-2xl border border-gray-200 bg-[#fafafa] px-4 pr-12 text-[1.05rem] text-gray-900 shadow-sm focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10">
                  <option>Bangladeshi</option>
                  <option>American</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-medium text-gray-500">Merchant ID</span>
              <input
                type="text"
                value="GRM-29384-2026"
                readOnly
                className="h-14 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-[1.05rem] text-gray-900 shadow-sm"
              />
            </label>
          </div>
        </SettingsCard>
      </div>

      {editor?.kind === 'profile' ? (
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
      ) : null}

      {editor?.kind === 'email' ? (
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
          <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-4">
            <input
              type="checkbox"
              checked={editor.primary}
              onChange={(event) => setEditor({ ...editor, primary: event.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#7626c6] focus:ring-[#7626c6]"
            />
            <span className="text-sm font-medium text-gray-700">Use as primary email</span>
          </label>
        </SettingsModal>
      ) : null}

      {editor?.kind === 'phone' ? (
        <SettingsModal
          title="Edit Phone Number"
          description="Update the phone number used for organizer communication and urgent alerts."
          onClose={() => setEditor(null)}
          onSave={handleSaveEditor}
          saveDisabled={!editor.value.trim()}
        >
          <FieldInput label="Phone Number" value={editor.value} onChange={(value) => setEditor({ ...editor, value })} />
          <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-4">
            <input
              type="checkbox"
              checked={editor.primary}
              onChange={(event) => setEditor({ ...editor, primary: event.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#7626c6] focus:ring-[#7626c6]"
            />
            <span className="text-sm font-medium text-gray-700">Use as primary phone number</span>
          </label>
        </SettingsModal>
      ) : null}

      {editor?.kind === 'address' ? (
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
      ) : null}
    </div>
  );
}

function PaymentsSettingsContent() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string | number>(1);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <PaymentMethodSelector
        title="Choose how to pay"
        actionText="Add new method"
        methods={paymentMethods}
        defaultSelectedId={selectedPaymentMethod}
        onActionClick={() => undefined}
        onSelectionChange={setSelectedPaymentMethod}
        className="max-w-none rounded-[28px] border-gray-200 p-8 shadow-sm"
      />

      <div className="space-y-6">
        <SettingsCard title="Payment Summary">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-5">
              <div className="mb-2 text-sm font-medium text-gray-500">Available Balance</div>
              <div className="text-3xl font-semibold tracking-[-0.03em] text-gray-950">$18,420</div>
              <div className="mt-2 text-sm text-emerald-600">Ready to withdraw</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-5">
              <div className="mb-2 text-sm font-medium text-gray-500">Pending Payouts</div>
              <div className="text-3xl font-semibold tracking-[-0.03em] text-gray-950">$4,860</div>
              <div className="mt-2 text-sm text-amber-600">2 transfers in review</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-5">
              <div className="mb-2 text-sm font-medium text-gray-500">Processing Fee</div>
              <div className="text-3xl font-semibold tracking-[-0.03em] text-gray-950">2.9%</div>
              <div className="mt-2 text-sm text-gray-500">Standard domestic rate</div>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Payout Preferences">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="mb-3 block text-sm font-medium text-gray-500">Default Payout Method</span>
              <div className="relative">
                <select className="h-14 w-full appearance-none rounded-2xl border border-gray-200 bg-[#fafafa] px-4 pr-12 text-[1.05rem] text-gray-900 shadow-sm focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10">
                  <option>Visa ending 0912</option>
                  <option>Mastercard ending 4821</option>
                  <option>Georim Wallet</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-medium text-gray-500">Payout Schedule</span>
              <div className="relative">
                <select className="h-14 w-full appearance-none rounded-2xl border border-gray-200 bg-[#fafafa] px-4 pr-12 text-[1.05rem] text-gray-900 shadow-sm focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10">
                  <option>Weekly on Friday</option>
                  <option>Daily</option>
                  <option>Monthly</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-medium text-gray-500">Settlement Currency</span>
              <div className="relative">
                <select className="h-14 w-full appearance-none rounded-2xl border border-gray-200 bg-[#fafafa] px-4 pr-12 text-[1.05rem] text-gray-900 shadow-sm focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10">
                  <option>USD</option>
                  <option>BDT</option>
                  <option>EUR</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </label>

            <label className="block">
              <span className="mb-3 block text-sm font-medium text-gray-500">Finance Contact</span>
              <input
                type="email"
                value="finance@georim.com"
                readOnly
                className="h-14 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-[1.05rem] text-gray-900 shadow-sm"
              />
            </label>
          </div>
        </SettingsCard>

        <SettingsCard title="Recent Transactions">
          <div className="space-y-4">
            {[
              { id: 'TX-2048', title: 'Summer Music Festival payout', amount: '+$6,240', status: 'Completed' },
              { id: 'TX-2049', title: 'Premium workspace renewal', amount: '-$199', status: 'Processed' },
              { id: 'TX-2050', title: 'Marketing credit top-up', amount: '-$350', status: 'Pending' },
            ].map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-[#fafafa] px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1e5fb] text-[#7626c6]">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-950">{transaction.title}</div>
                    <div className="text-sm text-gray-500">{transaction.id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-950">{transaction.amount}</div>
                  <div className="text-sm text-gray-500">{transaction.status}</div>
                </div>
              </div>
            ))}
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}

function SecuritySettingsContent() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <div className="space-y-6">
        <SettingsCard
          title="Password & Access"
          headerRight={<span className="rounded-full bg-[#f1e5fb] px-4 py-1.5 text-sm font-medium text-[#7a29d5]">Recommended</span>}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <PasswordField
                label="Previous Password"
                placeholder="Enter your previous password"
                hint="Use your last active password before applying a new one."
              />
            </div>
            <PasswordField
              label="Current Password"
              placeholder="Create a new secure password"
              hint="Use at least 8 characters with a mix of letters, numbers, and symbols."
            />
            <PasswordField
              label="Confirm Password"
              placeholder="Re-enter your new password"
              hint="Make sure this matches the new password exactly."
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-gray-200 bg-[#fafafa] px-5 py-4">
            <div>
              <div className="text-sm font-medium text-gray-900">Password strength</div>
              <div className="mt-1 text-sm text-gray-500">Strong enough for workspace admins and payout access.</div>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-[#7626c6] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(118,38,198,0.22)] transition hover:bg-[#6620ab]"
            >
              Update Password
            </button>
          </div>
        </SettingsCard>

        <SettingsCard title="Recent Security Activity">
          <div className="space-y-4">
            {[
              {
                id: 'activity-1',
                title: 'Password changed',
                detail: 'Today, 9:42 AM from Chicago, United States',
                icon: KeyRound,
              },
              {
                id: 'activity-2',
                title: 'New desktop session approved',
                detail: 'MacBook Pro, Safari 18.1',
                icon: Laptop,
              },
              {
                id: 'activity-3',
                title: 'Mobile login verified',
                detail: 'iPhone 16 Pro, Face ID challenge passed',
                icon: Smartphone,
              },
            ].map((activity) => {
              const Icon = activity.icon;

              return (
                <div key={activity.id} className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-[#fafafa] px-5 py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1e5fb] text-[#7626c6]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-950">{activity.title}</div>
                    <div className="text-sm text-gray-500">{activity.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </SettingsCard>
      </div>

      <div className="space-y-6">
        <SettingsCard title="Security Overview">
          <div className="space-y-4">
            {[
              {
                id: 'overview-1',
                title: 'Two-factor authentication',
                detail: 'Authenticator app connected and required for admin actions.',
              },
              {
                id: 'overview-2',
                title: 'Recovery options',
                detail: 'Backup email and device prompts are configured.',
              },
              {
                id: 'overview-3',
                title: 'Session monitoring',
                detail: '3 active devices trusted in the last 30 days.',
              },
            ].map((item) => (
              <div key={item.id} className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-[#fafafa] px-5 py-4">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-gray-950">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </SettingsCard>

        <SettingsCard title="Trusted Devices">
          <div className="space-y-4">
            {[
              {
                id: 'device-1',
                name: 'MacBook Pro 16"',
                detail: 'Chicago, United States',
                status: 'Current device',
                icon: Laptop,
              },
              {
                id: 'device-2',
                name: 'iPhone 16 Pro',
                detail: 'Organizer mobile access',
                status: 'Last active 2 hours ago',
                icon: Smartphone,
              },
            ].map((device) => {
              const Icon = device.icon;

              return (
                <div key={device.id} className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-[#fafafa] px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1e5fb] text-[#7626c6]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-950">{device.name}</div>
                      <div className="text-sm text-gray-500">{device.detail}</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm">
                    {device.status}
                  </span>
                </div>
              );
            })}
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}

function PremiumSubscriptionsContent() {
  return (
    <div className="space-y-6">
      <SettingsCard title="Current Subscription">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-5">
            <div className="mb-2 text-sm font-medium text-gray-500">Active Plan</div>
            <div className="text-3xl font-semibold tracking-[-0.03em] text-gray-950">Professional</div>
            <div className="mt-2 text-sm text-[#7626c6]">Renews annually on Aug 14</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-5">
            <div className="mb-2 text-sm font-medium text-gray-500">Team Seats</div>
            <div className="text-3xl font-semibold tracking-[-0.03em] text-gray-950">18 / 25</div>
            <div className="mt-2 text-sm text-gray-500">7 seats available</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-5">
            <div className="mb-2 text-sm font-medium text-gray-500">Savings This Year</div>
            <div className="text-3xl font-semibold tracking-[-0.03em] text-gray-950">$36</div>
            <div className="mt-2 text-sm text-emerald-600">Yearly discount applied</div>
          </div>
        </div>
      </SettingsCard>

      <section className="rounded-[28px] border border-gray-200 bg-white p-3 shadow-sm">
        <PricingTable plans={premiumPlans} />
      </section>
    </div>
  );
}

function NotificationToggle({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-[#fafafa] px-5 py-4">
      <div className="space-y-1">
        <div className="font-medium text-gray-950">{label}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      <OrangeToggle
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        checked={enabled}
        onChange={onToggle}
        className="h-7 w-12 bg-gray-300 before:left-[calc(1.5em_-_1.55em)] before:top-[calc(1.5em_-_1.55em)] before:h-[1.55em] before:w-[1.55em] before:border-gray-300 checked:bg-[#7626c6] checked:before:border-[#6b23b6] checked:hover:before:shadow-[0_0_0px_8px_rgba(118,38,198,0.16)]"
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
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <div className="space-y-6">
        <SettingsCard title="Delivery Channels">
          <div className="space-y-4">
            <NotificationToggle
              label="Email Notifications"
              description="Receive organizer summaries, attendee updates, and subscription notices by email."
              enabled={channelSettings.email}
              onToggle={() => toggleChannel('email')}
            />
            <NotificationToggle
              label="Push Notifications"
              description="Get live updates in-app for event activity, approvals, and urgent operational changes."
              enabled={channelSettings.push}
              onToggle={() => toggleChannel('push')}
            />
            <NotificationToggle
              label="SMS Alerts"
              description="Send critical reminders and payout alerts to your verified mobile number."
              enabled={channelSettings.sms}
              onToggle={() => toggleChannel('sms')}
            />
          </div>
        </SettingsCard>

        <SettingsCard title="Event Alerts">
          <div className="space-y-4">
            <NotificationToggle
              label="Ticket Sales"
              description="Instant notifications when ticket velocity spikes or a pricing tier sells out."
              enabled={alertSettings.ticketSales}
              onToggle={() => toggleAlert('ticketSales')}
            />
            <NotificationToggle
              label="Attendee Messages"
              description="Notify me when attendees send support questions or request refunds."
              enabled={alertSettings.attendeeMessages}
              onToggle={() => toggleAlert('attendeeMessages')}
            />
            <NotificationToggle
              label="Payout Updates"
              description="Keep me informed when payouts are processed, delayed, or require review."
              enabled={alertSettings.payoutUpdates}
              onToggle={() => toggleAlert('payoutUpdates')}
            />
            <NotificationToggle
              label="Event Reminders"
              description="Daily countdown reminders for upcoming events and publishing deadlines."
              enabled={alertSettings.eventReminders}
              onToggle={() => toggleAlert('eventReminders')}
            />
          </div>
        </SettingsCard>
      </div>

      <div className="space-y-6">
        <SettingsCard title="Notification Digest">
          <div className="space-y-4">
            {[
              {
                id: 'digest-email',
                title: 'Morning Organizer Brief',
                detail: 'Daily at 8:00 AM with sales, attendance, and campaign highlights.',
                icon: Mail,
              },
              {
                id: 'digest-inbox',
                title: 'Unread Conversations',
                detail: 'Bundle attendee replies and internal team mentions every 2 hours.',
                icon: MessageSquare,
              },
              {
                id: 'digest-system',
                title: 'Critical System Alerts',
                detail: 'Sent immediately for payment failures, permissions changes, and security notices.',
                icon: Bell,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.id} className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-[#fafafa] px-5 py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1e5fb] text-[#7626c6]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-950">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </SettingsCard>

        <SettingsCard title="Quiet Hours">
          <div className="space-y-6">
            <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-[#fafafa] px-5 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1e5fb] text-[#7626c6]">
                <Clock3 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="font-medium text-gray-950">Pause non-urgent notifications overnight</div>
                <div className="text-sm text-gray-500">Critical security and payment alerts still bypass quiet hours.</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-3 block text-sm font-medium text-gray-500">Quiet Hours Start</span>
                <div className="relative">
                  <select className="h-14 w-full appearance-none rounded-2xl border border-gray-200 bg-[#fafafa] px-4 pr-12 text-[1.05rem] text-gray-900 shadow-sm focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10">
                    <option>10:00 PM</option>
                    <option>11:00 PM</option>
                    <option>12:00 AM</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </label>

              <label className="block">
                <span className="mb-3 block text-sm font-medium text-gray-500">Quiet Hours End</span>
                <div className="relative">
                  <select className="h-14 w-full appearance-none rounded-2xl border border-gray-200 bg-[#fafafa] px-4 pr-12 text-[1.05rem] text-gray-900 shadow-sm focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10">
                    <option>7:00 AM</option>
                    <option>8:00 AM</option>
                    <option>9:00 AM</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
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
      <section className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm xl:col-span-2">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1e5fb] text-[#7626c6]">
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-gray-950">{sectionData.title}</h2>
            <p className="max-w-2xl text-base leading-7 text-gray-500">{sectionData.subtitle}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export function SettingsPage({ section }: SettingsPageProps) {
  const sectionData = settingsMeta[section];

  return (
    <div
      className="min-h-full p-8"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(118, 38, 198, 0.08), transparent 28%), linear-gradient(180deg, #f7f5fb 0%, #f4f5f8 100%)',
      }}
    >
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-10 space-y-2">
          <h1 className="text-5xl font-semibold tracking-[-0.04em] text-[#2c1451]">{sectionData.title}</h1>
          <p className="text-xl text-[#2c1451]/85">{sectionData.subtitle}</p>
        </div>

        {section === 'profile' ? <ProfileSettingsContent /> : null}
        {section === 'security' ? <SecuritySettingsContent /> : null}
        {section === 'payments' ? <PaymentsSettingsContent /> : null}
        {section === 'premium-subscriptions' ? <PremiumSubscriptionsContent /> : null}
        {section === 'notifications' ? <NotificationsSettingsContent /> : null}
        {section !== 'profile' &&
        section !== 'security' &&
        section !== 'payments' &&
        section !== 'premium-subscriptions' &&
        section !== 'notifications' ? (
          <PlaceholderSettingsContent section={section} />
        ) : null}
      </div>

      <button
        type="button"
        className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8f48eb] to-[#6c20c8] text-white shadow-[0_18px_30px_rgba(118,38,198,0.35)] transition hover:scale-[1.02]"
        aria-label="Open settings assistant"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    </div>
  );
}
