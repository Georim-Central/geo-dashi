import type { ReactNode } from 'react';
import { FormEvent, useId, useMemo, useState } from 'react';
import {
  CalendarClock,
  CheckCheck,
  Mail,
  Megaphone,
  Phone,
  Plus,
  Send,
  Sparkles,
} from 'lucide-react';

import { useModalA11y } from '../../hooks/useModalA11y';
import { ContentState } from '../ui/ContentState';

type ListingStatus = 'live' | 'paused';
type CampaignChannel = 'email' | 'sms';
type CampaignStatus = 'draft' | 'scheduled' | 'sent';

type ListingSettings = {
  status: ListingStatus;
  category: string;
  discoveryEnabled: boolean;
  pushNotifications: boolean;
  geoRadius: number;
};

type AudienceSegment = {
  id: string;
  label: string;
  description: string;
  countLabel: string;
};

type CampaignRecord = {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  audience: string[];
  sendAt: string;
  updatedLabel: string;
  subject: string;
  objective: string;
  metrics: {
    delivered: string;
    engagement: string;
    conversions: string;
    revenue: string;
  };
};

const audienceSegments: AudienceSegment[] = [
  { id: 'all-subscribers', label: 'All Subscribers',  description: 'Entire opted-in audience across your organizer workspace.', countLabel: '10,240 contacts' },
  { id: 'ticket-holders',  label: 'Ticket Holders',   description: 'Confirmed buyers who already have a valid ticket.',          countLabel: '3,482 contacts'  },
  { id: 'vip-only',        label: 'VIP Guests',        description: 'High-value ticket holders and premium invitees.',            countLabel: '426 contacts'    },
  { id: 'waitlist',        label: 'Waitlist',          description: 'Interested attendees waiting for a release or upsell.',      countLabel: '215 contacts'    },
  { id: 'dormant',         label: 'Dormant Fans',      description: 'Past audience that has not engaged in the last 90 days.',    countLabel: '1,108 contacts'  },
];

const initialCampaigns: CampaignRecord[] = [
  {
    id: 'cmp-4101',
    name: 'VIP upgrade push',
    channel: 'email',
    status: 'scheduled',
    audience: ['ticket-holders', 'vip-only'],
    sendAt: '2026-03-14T10:00',
    updatedLabel: 'Scheduled for Mar 14, 10:00 AM',
    subject: 'Upgrade before VIP pricing closes',
    objective: 'Drive tier upgrades before the final pricing change.',
    metrics: { delivered: '2,140 queued', engagement: 'Forecast 41% open', conversions: 'Projected 68 upgrades', revenue: '$8,640 projected' },
  },
  {
    id: 'cmp-4100',
    name: 'Last chance weekend reminder',
    channel: 'email',
    status: 'sent',
    audience: ['all-subscribers'],
    sendAt: '2026-03-11T08:15',
    updatedLabel: 'Sent today at 8:15 AM',
    subject: 'Last chance before prices increase',
    objective: 'Push undecided buyers into the next checkout window.',
    metrics: { delivered: '9,882 delivered', engagement: '43.8% open rate', conversions: '312 purchases', revenue: '$18,720' },
  },
  {
    id: 'cmp-4094',
    name: 'Group sales follow-up',
    channel: 'sms',
    status: 'draft',
    audience: ['vip-only', 'waitlist'],
    sendAt: 'Not scheduled',
    updatedLabel: 'Saved as draft 2h ago',
    subject: 'Reserved inventory still available',
    objective: 'Reconnect with high-intent leads that dropped out last week.',
    metrics: { delivered: 'Draft only', engagement: 'No delivery yet', conversions: 'No conversions yet', revenue: '$0' },
  },
  {
    id: 'cmp-4086',
    name: '24-hour event reminder',
    channel: 'sms',
    status: 'sent',
    audience: ['ticket-holders'],
    sendAt: '2026-03-10T17:30',
    updatedLabel: 'Sent Mar 10, 5:30 PM',
    subject: 'Doors open tomorrow at 6 PM',
    objective: 'Reduce no-shows and improve arrival readiness.',
    metrics: { delivered: '3,214 delivered', engagement: '96.2% delivery', conversions: '188 check-in saves', revenue: '$3,240 add-ons' },
  },
];

const formatDateTimeLabel = (rawValue: string) => {
  if (!rawValue) return 'Not scheduled';
  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) return 'Not scheduled';
  return parsed.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

const getCampaignStatusClass = (status: CampaignStatus) => {
  if (status === 'sent') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (status === 'scheduled') return 'bg-amber-50 text-amber-700 border border-amber-200';
  return 'bg-gray-100 text-gray-600 border border-gray-200';
};

const getChannelAccent = (channel: CampaignChannel) =>
  channel === 'email' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200';

export function MarketingSection() {
  const fieldIdPrefix = useId();
  const [activeChannel, setActiveChannel] = useState<CampaignChannel>('email');
  const [historyFilter, setHistoryFilter] = useState<'all' | CampaignStatus>('all');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(initialCampaigns[0].id);
  const [isBoosted, setIsBoosted] = useState(false);
  const [marketingNotice, setMarketingNotice] = useState<string | null>(null);
  const [listingSettings, setListingSettings] = useState<ListingSettings>({
    status: 'live', category: 'Music Festivals', discoveryEnabled: true, pushNotifications: true, geoRadius: 25,
  });
  const [listingDraft, setListingDraft] = useState<ListingSettings>({
    status: 'live', category: 'Music Festivals', discoveryEnabled: true, pushNotifications: true, geoRadius: 25,
  });
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>(initialCampaigns);
  const [campaignDraft, setCampaignDraft] = useState({
    channel: 'email' as CampaignChannel,
    status: 'draft' as CampaignStatus,
    name: '', audience: ['all-subscribers'] as string[],
    sendAt: '', subject: '', objective: '', message: '',
  });

  const getFieldId = (field: string) => `${fieldIdPrefix}-${field}`;

  const { dialogRef: campaignDialogRef, titleId: campaignTitleId, descriptionId: campaignDescriptionId } = useModalA11y({
    isOpen: showCampaignModal, onClose: () => setShowCampaignModal(false),
  });
  const { dialogRef: listingDialogRef, titleId: listingTitleId, descriptionId: listingDescriptionId } = useModalA11y({
    isOpen: showListingModal, onClose: () => setShowListingModal(false),
  });

  const visibleCampaigns = useMemo(() =>
    campaigns.filter((c) => c.channel === activeChannel && (historyFilter === 'all' || c.status === historyFilter)),
    [activeChannel, campaigns, historyFilter]
  );

  const selectedCampaign =
    visibleCampaigns.find((c) => c.id === selectedCampaignId) ??
    campaigns.find((c) => c.id === selectedCampaignId) ?? null;

  const campaignStats = useMemo(() => {
    const ch = campaigns.filter((c) => c.channel === activeChannel);
    return {
      total: ch.length,
      drafts: ch.filter((c) => c.status === 'draft').length,
      scheduled: ch.filter((c) => c.status === 'scheduled').length,
      sent: ch.filter((c) => c.status === 'sent').length,
    };
  }, [activeChannel, campaigns]);

  const updateCampaignDraft = <T extends keyof typeof campaignDraft>(field: T, value: (typeof campaignDraft)[T]) =>
    setCampaignDraft((d) => ({ ...d, [field]: value }));

  const updateListingDraft = <T extends keyof ListingSettings>(field: T, value: ListingSettings[T]) =>
    setListingDraft((d) => ({ ...d, [field]: value }));

  const toggleAudienceSegment = (segmentId: string) => {
    setCampaignDraft((d) => {
      const exists = d.audience.includes(segmentId);
      const next = exists ? d.audience.filter((s) => s !== segmentId) : [...d.audience, segmentId];
      return { ...d, audience: next.length > 0 ? next : [segmentId] };
    });
  };

  const openCampaignModal = () => {
    setCampaignDraft({ channel: activeChannel, status: 'draft', name: '', audience: ['all-subscribers'], sendAt: '', subject: '', objective: '', message: '' });
    setShowCampaignModal(true);
  };

  const createCampaign = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const statusLabel =
      campaignDraft.status === 'draft' ? 'Saved as draft' :
      campaignDraft.status === 'scheduled' ? `Scheduled for ${formatDateTimeLabel(campaignDraft.sendAt)}` : 'Sent just now';

    const next: CampaignRecord = {
      id: `cmp-${Date.now()}`,
      name: campaignDraft.name.trim() || 'Untitled campaign',
      channel: campaignDraft.channel,
      status: campaignDraft.status,
      audience: campaignDraft.audience,
      sendAt: campaignDraft.sendAt,
      updatedLabel: statusLabel,
      subject: campaignDraft.subject.trim() || (campaignDraft.channel === 'email' ? 'Campaign subject' : 'SMS campaign'),
      objective: campaignDraft.objective.trim() || 'Organizer campaign objective pending.',
      metrics: {
        delivered: campaignDraft.status === 'sent' ? '1,240 delivered' : campaignDraft.status === 'scheduled' ? 'Queued audience' : 'Draft only',
        engagement: campaignDraft.status === 'sent' ? '34.2% engagement' : 'Not available yet',
        conversions: campaignDraft.status === 'sent' ? '24 conversions' : 'Pending send',
        revenue: campaignDraft.status === 'sent' ? '$1,440' : '$0',
      },
    };

    setCampaigns((c) => [next, ...c]);
    setSelectedCampaignId(next.id);
    setActiveChannel(next.channel);
    setHistoryFilter('all');
    setShowCampaignModal(false);
    setMarketingNotice(
      campaignDraft.status === 'draft' ? `${next.name} saved as a draft campaign.` :
      campaignDraft.status === 'scheduled' ? `${next.name} scheduled for ${formatDateTimeLabel(campaignDraft.sendAt)}.` :
      `${next.name} sent to the selected audience.`
    );
  };

  const saveListingSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = { ...listingDraft, geoRadius: Math.max(1, Number(listingDraft.geoRadius) || 1) };
    setListingSettings(next);
    setShowListingModal(false);
    setMarketingNotice(next.status === 'live' ? 'Georim Explore listing updated and visible.' : 'Georim Explore listing updated and paused.');
  };

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[14px] bg-[#f1e5fb]">
            <Megaphone className="h-5 w-5 text-[#7626c6]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Marketing Workspace</h2>
            <p className="mt-0.5 text-xs text-gray-500">Build campaigns, target segments, and monitor outreach performance.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsBoosted((prev) => {
                const next = !prev;
                setMarketingNotice(next ? 'Boost visibility enabled for this event listing.' : 'Boost visibility turned off.');
                return next;
              });
            }}
            className={`ui-button ui-button--size-sm ${isBoosted ? 'ui-button--default' : 'ui-button--outline'}`}
          >
            {isBoosted ? 'Boost Active' : 'Boost Visibility'}
          </button>
          <button
            type="button"
            onClick={() => { setListingDraft(listingSettings); setShowListingModal(true); }}
            className="ui-button ui-button--outline ui-button--size-sm"
          >
            Manage Listing
          </button>
        </div>
      </div>

      {/* Metric strip */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Total Campaigns', value: String(campaignStats.total),     sub: 'All campaigns on this channel'  },
          { label: 'Scheduled',       value: String(campaignStats.scheduled), sub: 'Queued and ready to send'       },
          { label: 'Sent',            value: String(campaignStats.sent),       sub: 'Delivered in the current cycle' },
          { label: 'Drafts',          value: String(campaignStats.drafts),     sub: 'Pending review or approval'     },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[28px] border border-gray-200 bg-white p-6">
            <p className="ui-meta-text mb-3">{stat.label}</p>
            <p className="text-2xl font-semibold leading-none tabular-nums text-gray-900">{stat.value}</p>
            <p className="mt-2 text-xs text-gray-500">{stat.sub}</p>
          </div>
        ))}
      </div>

{marketingNotice && (
        <div className="rounded-[22px] border border-[#7626c6]/20 bg-[#f1e5fb] px-4 py-3 text-sm font-medium text-[#7626c6]" aria-live="polite">
          {marketingNotice}
        </div>
      )}

      {/* Main content grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_380px]">

        {/* Campaign History */}
        <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white">
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-6">
            <div>
              <h3 className="ui-card-title">Campaign History</h3>
              <p className="mt-1 text-xs text-gray-500">Draft, scheduled, and sent campaigns with audience context.</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
                {(['email', 'sms'] as const).map((ch) => (
                  <button key={ch} type="button" onClick={() => setActiveChannel(ch)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-[150ms] ${
                      activeChannel === ch ? 'bg-white text-[#7626c6] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {ch === 'email' ? <Mail className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
                    {ch === 'email' ? 'Email' : 'SMS'}
                  </button>
                ))}
              </div>
              <button type="button" onClick={openCampaignModal} className="ui-button ui-button--default ui-button--size-sm">
                <Plus className="h-4 w-4" />
                New Campaign
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-6 py-4">
            {(['all', 'draft', 'scheduled', 'sent'] as const).map((status) => (
              <button key={status} type="button" onClick={() => setHistoryFilter(status)}
                className={`ui-chip ${historyFilter === status ? 'is-active' : ''}`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="py-2">
            <ContentState isEmpty={visibleCampaigns.length === 0} emptyMessage="No campaigns match this filter." className="py-16">
              {visibleCampaigns.map((campaign) => (
                <button key={campaign.id} type="button" onClick={() => setSelectedCampaignId(campaign.id)}
                  className="w-full px-3 py-1 text-left focus-visible:outline-none"
                >
                  <div className={`rounded-[20px] px-4 py-3 transition-colors duration-[150ms] ${
                    selectedCampaignId === campaign.id ? 'bg-violet-50 ring-1 ring-violet-200/60' : 'hover:bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">{campaign.name}</p>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${getCampaignStatusClass(campaign.status)}`}>
                            {campaign.status}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium uppercase ${getChannelAccent(campaign.channel)}`}>
                            {campaign.channel}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-gray-500 line-clamp-1">{campaign.objective}</p>
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-400">
                          <span>{campaign.updatedLabel}</span>
                          <span>·</span>
                          <span>{campaign.audience.length} segment{campaign.audience.length > 1 ? 's' : ''}</span>
                          <span>·</span>
                          <span>{campaign.metrics.revenue}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-semibold text-gray-900">{campaign.metrics.delivered}</p>
                        <p className="mt-0.5 text-xs text-gray-400">{campaign.metrics.engagement}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </ContentState>
          </div>
        </section>

        {/* Right aside */}
        <aside className="space-y-6">
          {/* Performance Summary */}
          <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-6">
              <h3 className="ui-card-title">Performance Summary</h3>
              <p className="mt-1 text-xs text-gray-500">Selected campaign metrics at a glance.</p>
            </div>

            {selectedCampaign ? (
              <div className="p-6 space-y-4">
                <div className="rounded-[22px] border border-gray-200 bg-gray-50 p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${getCampaignStatusClass(selectedCampaign.status)}`}>
                      {selectedCampaign.status}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium uppercase ${getChannelAccent(selectedCampaign.channel)}`}>
                      {selectedCampaign.channel}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedCampaign.name}</p>
                  <p className="mt-1.5 text-xs leading-5 text-gray-600">{selectedCampaign.objective}</p>
                </div>

                <div className="overflow-hidden rounded-[22px] border border-gray-200 divide-y divide-gray-100">
                  {[
                    { icon: Send,          label: 'Delivered',   value: selectedCampaign.metrics.delivered   },
                    { icon: Sparkles,      label: 'Engagement',  value: selectedCampaign.metrics.engagement  },
                    { icon: CheckCheck,    label: 'Conversions', value: selectedCampaign.metrics.conversions },
                    { icon: CalendarClock, label: 'Timing',      value: selectedCampaign.updatedLabel        },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3 px-4 py-3">
                      <span className="w-20 flex-shrink-0 text-xs font-medium text-gray-400">{row.label}</span>
                      <span className="text-xs text-gray-700 leading-5">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-[22px] border border-gray-200 p-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-2">Audience</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCampaign.audience.map((segId) => {
                        const seg = audienceSegments.find((s) => s.id === segId);
                        return (
                          <span key={segId} className="rounded-full bg-[#f1e5fb] px-2.5 py-0.5 text-xs font-medium text-[#7626c6]">
                            {seg?.label || segId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-1">Subject</p>
                    <p className="text-xs text-gray-700">{selectedCampaign.subject}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <Megaphone className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-4 text-sm font-medium text-gray-900">No campaign selected</p>
                <p className="mt-2 text-xs text-gray-500">Select a campaign to review its performance.</p>
              </div>
            )}
          </section>
        </aside>
      </div>

      {/* Create Campaign Modal */}
      {showCampaignModal && (
        <ModalShell onClose={() => setShowCampaignModal(false)}>
          <div ref={campaignDialogRef} role="dialog" aria-modal="true"
            aria-labelledby={campaignTitleId} aria-describedby={campaignDescriptionId}
            tabIndex={-1} className="ticketing-modal-card rounded-[28px] border border-gray-200 bg-white p-6 shadow-2xl"
          >
            <h3 id={campaignTitleId} className="ui-card-title mb-1">Create Campaign</h3>
            <p id={campaignDescriptionId} className="mb-5 text-xs text-gray-500">
              Build a draft, schedule a send, or launch a campaign to your selected audience.
            </p>
            <form onSubmit={createCampaign} className="flex flex-col min-h-0">
              <div className="ticketing-modal-body space-y-4">
                <div>
                  <p id={getFieldId('campaign-channel')} className="mb-2 text-xs font-medium text-gray-500">Channel</p>
                  <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 w-fit" role="group" aria-labelledby={getFieldId('campaign-channel')}>
                    {(['email', 'sms'] as const).map((ch) => (
                      <button key={ch} type="button" onClick={() => updateCampaignDraft('channel', ch)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-[150ms] ${campaignDraft.channel === ch ? 'bg-white text-[#7626c6] shadow-sm' : 'text-gray-600'}`}
                      >
                        {ch === 'email' ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                        {ch === 'email' ? 'Email' : 'SMS'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField label="Campaign Name" htmlFor={getFieldId('campaign-name')}>
                    <input id={getFieldId('campaign-name')} required type="text" value={campaignDraft.name}
                      onChange={(e) => updateCampaignDraft('name', e.target.value)}
                      placeholder="e.g., VIP Ticket Launch Reminder"
                      className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm focus:border-[#7626c6]/50 focus:outline-none" />
                  </FormField>
                  <FormField label="Status" htmlFor={getFieldId('campaign-status')}>
                    <select id={getFieldId('campaign-status')} value={campaignDraft.status}
                      onChange={(e) => updateCampaignDraft('status', e.target.value as CampaignStatus)}
                      className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm focus:border-[#7626c6]/50 focus:outline-none">
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="sent">Send Now</option>
                    </select>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField label="Send Time" htmlFor={getFieldId('campaign-send-date')}>
                    <input id={getFieldId('campaign-send-date')} type="datetime-local" value={campaignDraft.sendAt}
                      onChange={(e) => updateCampaignDraft('sendAt', e.target.value)}
                      className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm focus:border-[#7626c6]/50 focus:outline-none" />
                  </FormField>
                  <FormField label="Objective" htmlFor={getFieldId('campaign-objective')}>
                    <input id={getFieldId('campaign-objective')} required type="text" value={campaignDraft.objective}
                      onChange={(e) => updateCampaignDraft('objective', e.target.value)}
                      placeholder="What should this achieve?"
                      className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm focus:border-[#7626c6]/50 focus:outline-none" />
                  </FormField>
                </div>

                {campaignDraft.channel === 'email' && (
                  <FormField label="Subject Line" htmlFor={getFieldId('campaign-subject')}>
                    <input id={getFieldId('campaign-subject')} required type="text" value={campaignDraft.subject}
                      onChange={(e) => updateCampaignDraft('subject', e.target.value)}
                      placeholder="Subject line for your email"
                      className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm focus:border-[#7626c6]/50 focus:outline-none" />
                  </FormField>
                )}

                <div>
                  <p className="mb-2 text-xs font-medium text-gray-500">Audience Segments</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {audienceSegments.map((seg) => {
                      const isSelected = campaignDraft.audience.includes(seg.id);
                      return (
                        <label key={seg.id} htmlFor={getFieldId(`seg-${seg.id}`)}
                          className={`cursor-pointer rounded-[18px] border p-3 transition-colors duration-[150ms] ${isSelected ? 'border-[#7626c6]/30 bg-[#f1e5fb]' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="flex items-start gap-2">
                            <input id={getFieldId(`seg-${seg.id}`)} type="checkbox" checked={isSelected}
                              onChange={() => toggleAudienceSegment(seg.id)} className="mt-0.5 rounded" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{seg.label}</p>
                              <p className="mt-0.5 text-xs text-gray-500">{seg.countLabel}</p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <FormField label={campaignDraft.channel === 'email' ? 'Email Message' : 'SMS Message'} htmlFor={getFieldId('campaign-message')}>
                  <textarea id={getFieldId('campaign-message')} required rows={4} value={campaignDraft.message}
                    onChange={(e) => updateCampaignDraft('message', e.target.value)}
                    placeholder={campaignDraft.channel === 'email' ? 'Write your email content...' : 'Write your SMS content...'}
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#7626c6]/50 focus:outline-none" />
                </FormField>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-5">
                <button type="button" onClick={() => setShowCampaignModal(false)} className="ui-button ui-button--outline ui-button--size-sm">Cancel</button>
                <button type="submit" className="ui-button ui-button--default ui-button--size-sm">
                  {campaignDraft.status === 'draft' ? 'Save Draft' : campaignDraft.status === 'scheduled' ? 'Schedule Campaign' : 'Send Campaign'}
                </button>
              </div>
            </form>
          </div>
        </ModalShell>
      )}

      {/* Manage Listing Modal */}
      {showListingModal && (
        <ModalShell onClose={() => setShowListingModal(false)}>
          <div ref={listingDialogRef} role="dialog" aria-modal="true"
            aria-labelledby={listingTitleId} aria-describedby={listingDescriptionId}
            tabIndex={-1} className="ticketing-modal-card rounded-[28px] border border-gray-200 bg-white p-6 shadow-2xl"
          >
            <h3 id={listingTitleId} className="ui-card-title mb-1">Manage Georim Listing</h3>
            <p id={listingDescriptionId} className="mb-5 text-xs text-gray-500">
              Control discovery, push, and category targeting for your Explore listing.
            </p>
            <form onSubmit={saveListingSettings} className="flex flex-col min-h-0">
              <div className="ticketing-modal-body space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField label="Listing Status" htmlFor={getFieldId('listing-status')}>
                    <select id={getFieldId('listing-status')} value={listingDraft.status}
                      onChange={(e) => updateListingDraft('status', e.target.value as ListingStatus)}
                      className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm focus:border-[#7626c6]/50 focus:outline-none">
                      <option value="live">Live</option>
                      <option value="paused">Paused</option>
                    </select>
                  </FormField>
                  <FormField label="Category" htmlFor={getFieldId('listing-category')}>
                    <select id={getFieldId('listing-category')} value={listingDraft.category}
                      onChange={(e) => updateListingDraft('category', e.target.value)}
                      className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm focus:border-[#7626c6]/50 focus:outline-none">
                      <option value="Music Festivals">Music Festivals</option>
                      <option value="Concerts">Concerts</option>
                      <option value="Nightlife">Nightlife</option>
                      <option value="Conferences">Conferences</option>
                    </select>
                  </FormField>
                </div>
                <FormField label="Discovery Radius (miles)" htmlFor={getFieldId('listing-radius')}>
                  <input id={getFieldId('listing-radius')} type="number" min={1} value={listingDraft.geoRadius}
                    onChange={(e) => updateListingDraft('geoRadius', Number(e.target.value))}
                    className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm focus:border-[#7626c6]/50 focus:outline-none" />
                </FormField>
                <div className="space-y-3">
                  <label htmlFor={getFieldId('listing-discovery')} className="flex cursor-pointer items-center gap-2">
                    <input id={getFieldId('listing-discovery')} type="checkbox" checked={listingDraft.discoveryEnabled}
                      onChange={(e) => updateListingDraft('discoveryEnabled', e.target.checked)} className="rounded" />
                    <span className="text-sm text-gray-700">Enable location-based discovery</span>
                  </label>
                  <label htmlFor={getFieldId('listing-push-notifications')} className="flex cursor-pointer items-center gap-2">
                    <input id={getFieldId('listing-push-notifications')} type="checkbox" checked={listingDraft.pushNotifications}
                      onChange={(e) => updateListingDraft('pushNotifications', e.target.checked)} className="rounded" />
                    <span className="text-sm text-gray-700">Enable push notifications</span>
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-5">
                <button type="button" onClick={() => setShowListingModal(false)} className="ui-button ui-button--outline ui-button--size-sm">Cancel</button>
                <button type="submit" className="ui-button ui-button--default ui-button--size-sm">Save Listing</button>
              </div>
            </form>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function FormField({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-xs font-medium text-gray-500">{label}</label>
      {children}
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
