import type { ReactNode } from 'react';
import { FormEvent, useId, useMemo, useState } from 'react';
import {
  CalendarClock,
  CheckCheck,
  Filter,
  Mail,
  Megaphone,
  Phone,
  Plus,
  Send,
  Sparkles,
  Target,
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
  {
    id: 'all-subscribers',
    label: 'All Subscribers',
    description: 'Entire opted-in audience across your organizer workspace.',
    countLabel: '10,240 contacts',
  },
  {
    id: 'ticket-holders',
    label: 'Ticket Holders',
    description: 'Confirmed buyers who already have a valid ticket.',
    countLabel: '3,482 contacts',
  },
  {
    id: 'vip-only',
    label: 'VIP Guests',
    description: 'High-value ticket holders and premium invitees.',
    countLabel: '426 contacts',
  },
  {
    id: 'waitlist',
    label: 'Waitlist',
    description: 'Interested attendees waiting for a release or upsell.',
    countLabel: '215 contacts',
  },
  {
    id: 'dormant',
    label: 'Dormant Fans',
    description: 'Past audience that has not engaged in the last 90 days.',
    countLabel: '1,108 contacts',
  },
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
    metrics: {
      delivered: '2,140 queued',
      engagement: 'Forecast 41% open',
      conversions: 'Projected 68 upgrades',
      revenue: '$8,640 projected',
    },
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
    metrics: {
      delivered: '9,882 delivered',
      engagement: '43.8% open rate',
      conversions: '312 purchases',
      revenue: '$18,720',
    },
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
    metrics: {
      delivered: 'Draft only',
      engagement: 'No delivery yet',
      conversions: 'No conversions yet',
      revenue: '$0',
    },
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
    metrics: {
      delivered: '3,214 delivered',
      engagement: '96.2% delivery',
      conversions: '188 check-in saves',
      revenue: '$3,240 add-ons',
    },
  },
];

const formatDateTimeLabel = (rawValue: string) => {
  if (!rawValue) return 'Not scheduled';
  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) return 'Not scheduled';
  return parsed.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const getCampaignStatusClass = (status: CampaignStatus) => {
  if (status === 'sent') return 'bg-emerald-100 text-emerald-700';
  if (status === 'scheduled') return 'bg-amber-100 text-amber-700';
  return 'bg-slate-200 text-slate-700';
};

const getChannelAccent = (channel: CampaignChannel) =>
  channel === 'email'
    ? 'bg-blue-100 text-blue-700'
    : 'bg-emerald-100 text-emerald-700';

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
    status: 'live',
    category: 'Music Festivals',
    discoveryEnabled: true,
    pushNotifications: true,
    geoRadius: 25,
  });
  const [listingDraft, setListingDraft] = useState<ListingSettings>({
    status: 'live',
    category: 'Music Festivals',
    discoveryEnabled: true,
    pushNotifications: true,
    geoRadius: 25,
  });
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>(initialCampaigns);
  const [campaignDraft, setCampaignDraft] = useState({
    channel: 'email' as CampaignChannel,
    status: 'draft' as CampaignStatus,
    name: '',
    audience: ['all-subscribers'] as string[],
    sendAt: '',
    subject: '',
    objective: '',
    message: '',
  });

  const getFieldId = (field: string) => `${fieldIdPrefix}-${field}`;

  const {
    dialogRef: campaignDialogRef,
    titleId: campaignTitleId,
    descriptionId: campaignDescriptionId,
  } = useModalA11y({
    isOpen: showCampaignModal,
    onClose: () => setShowCampaignModal(false),
  });

  const {
    dialogRef: listingDialogRef,
    titleId: listingTitleId,
    descriptionId: listingDescriptionId,
  } = useModalA11y({
    isOpen: showListingModal,
    onClose: () => setShowListingModal(false),
  });

  const visibleCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      if (campaign.channel !== activeChannel) return false;
      if (historyFilter !== 'all' && campaign.status !== historyFilter) return false;
      return true;
    });
  }, [activeChannel, campaigns, historyFilter]);

  const selectedCampaign =
    visibleCampaigns.find((campaign) => campaign.id === selectedCampaignId) ??
    campaigns.find((campaign) => campaign.id === selectedCampaignId) ??
    null;

  const campaignStats = useMemo(() => {
    const channelCampaigns = campaigns.filter((campaign) => campaign.channel === activeChannel);
    return {
      total: channelCampaigns.length,
      drafts: channelCampaigns.filter((campaign) => campaign.status === 'draft').length,
      scheduled: channelCampaigns.filter((campaign) => campaign.status === 'scheduled').length,
      sent: channelCampaigns.filter((campaign) => campaign.status === 'sent').length,
    };
  }, [activeChannel, campaigns]);

  const selectedSegments = useMemo(
    () => audienceSegments.filter((segment) => campaignDraft.audience.includes(segment.id)),
    [campaignDraft.audience]
  );

  const updateCampaignDraft = <T extends keyof typeof campaignDraft>(
    field: T,
    value: (typeof campaignDraft)[T]
  ) => {
    setCampaignDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  };

  const updateListingDraft = <T extends keyof ListingSettings>(field: T, value: ListingSettings[T]) => {
    setListingDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  };

  const toggleAudienceSegment = (segmentId: string) => {
    setCampaignDraft((currentDraft) => {
      const exists = currentDraft.audience.includes(segmentId);
      const nextAudience = exists
        ? currentDraft.audience.filter((currentSegment) => currentSegment !== segmentId)
        : [...currentDraft.audience, segmentId];

      return {
        ...currentDraft,
        audience: nextAudience.length > 0 ? nextAudience : [segmentId],
      };
    });
  };

  const openCampaignModal = () => {
    setCampaignDraft({
      channel: activeChannel,
      status: 'draft',
      name: '',
      audience: ['all-subscribers'],
      sendAt: '',
      subject: '',
      objective: '',
      message: '',
    });
    setShowCampaignModal(true);
  };

  const createCampaign = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const statusLabel =
      campaignDraft.status === 'draft'
        ? 'Saved as draft'
        : campaignDraft.status === 'scheduled'
          ? `Scheduled for ${formatDateTimeLabel(campaignDraft.sendAt)}`
          : 'Sent just now';

    const nextCampaign: CampaignRecord = {
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

    setCampaigns((currentCampaigns) => [nextCampaign, ...currentCampaigns]);
    setSelectedCampaignId(nextCampaign.id);
    setActiveChannel(nextCampaign.channel);
    setHistoryFilter('all');
    setShowCampaignModal(false);
    setMarketingNotice(
      campaignDraft.status === 'draft'
        ? `${nextCampaign.name} saved as a draft campaign.`
        : campaignDraft.status === 'scheduled'
          ? `${nextCampaign.name} scheduled for ${formatDateTimeLabel(campaignDraft.sendAt)}.`
          : `${nextCampaign.name} sent to the selected audience.`
    );
  };

  const saveListingSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextSettings = {
      ...listingDraft,
      geoRadius: Math.max(1, Number(listingDraft.geoRadius) || 1),
    };
    setListingSettings(nextSettings);
    setShowListingModal(false);
    setMarketingNotice(
      nextSettings.status === 'live'
        ? 'Georim Explore listing updated and visible.'
        : 'Georim Explore listing updated and paused.'
    );
  };

  const selectedAudienceCountLabel =
    selectedSegments.length === 0
      ? 'No audience selected'
      : `${selectedSegments.length} segment${selectedSegments.length > 1 ? 's' : ''} selected`;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-[#7626c6] to-[#5f1fa3] p-6 text-white shadow-lg">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
              <Megaphone className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Marketing Workspace</h2>
              <p className="mt-1 max-w-2xl text-sm text-white/85">
                Build campaign history, schedule outreach, target audience segments, and monitor organizer performance in one place.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setIsBoosted((currentBoostState) => {
                  const nextState = !currentBoostState;
                  setMarketingNotice(
                    nextState ? 'Boost visibility enabled for this event listing.' : 'Boost visibility turned off.'
                  );
                  return nextState;
                });
              }}
              className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                isBoosted ? 'border-white bg-white text-[#7626c6]' : 'border-white/40 bg-white/15 text-white hover:bg-white/20'
              }`}
            >
              {isBoosted ? 'Boost Active' : 'Boost Visibility'}
            </button>
            <button
              type="button"
              onClick={() => {
                setListingDraft(listingSettings);
                setShowListingModal(true);
              }}
              className="rounded-2xl border border-white/40 bg-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              Manage Listing
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Total Campaigns" value={String(campaignStats.total)} helper="All campaigns on this channel" />
          <MetricCard title="Scheduled" value={String(campaignStats.scheduled)} helper="Queued and ready to send" />
          <MetricCard title="Sent" value={String(campaignStats.sent)} helper="Delivered in the current cycle" />
          <MetricCard title="Drafts" value={String(campaignStats.drafts)} helper="Pending review or approval" />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/85">
          <span className={`rounded-full px-3 py-1 font-medium ${listingSettings.status === 'live' ? 'bg-emerald-400/25 text-white' : 'bg-amber-400/25 text-white'}`}>
            {listingSettings.status === 'live' ? 'Listing Live' : 'Listing Paused'}
          </span>
          <span>Category: {listingSettings.category}</span>
          <span>Geo radius: {listingSettings.geoRadius} miles</span>
          <span>{listingSettings.discoveryEnabled ? 'Discovery enabled' : 'Discovery disabled'}</span>
          <span>{listingSettings.pushNotifications ? 'Push enabled' : 'Push disabled'}</span>
          {isBoosted ? <span className="rounded-full bg-white/15 px-3 py-1 font-medium">Boosted listing</span> : null}
        </div>
      </section>

      {marketingNotice ? (
        <div className="rounded-2xl border border-[#7626c6]/20 bg-[#f5ecfd] px-4 py-3 text-sm font-medium text-[#7626c6]" aria-live="polite">
          {marketingNotice}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_380px]">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 border-b border-gray-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Campaign History</h3>
              <p className="mt-1 text-sm text-gray-500">
                Review draft, scheduled, and sent campaigns with audience and performance context.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setActiveChannel('email')}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    activeChannel === 'email' ? 'bg-white text-[#7626c6] shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChannel('sms')}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    activeChannel === 'sms' ? 'bg-white text-[#7626c6] shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Phone className="h-4 w-4" />
                  SMS
                </button>
              </div>
              <button
                type="button"
                onClick={openCampaignModal}
                className="inline-flex items-center gap-2 rounded-xl bg-[#7626c6] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#5f1fa3]"
              >
                <Plus className="h-4 w-4" />
                New Campaign
              </button>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              <Filter className="h-3.5 w-3.5" />
              Status
            </div>
            {(['all', 'draft', 'scheduled', 'sent'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setHistoryFilter(status)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  historyFilter === status
                    ? 'bg-[#7626c6] text-white'
                    : 'border border-gray-200 text-gray-600 hover:border-[#7626c6] hover:text-[#7626c6]'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <ContentState isEmpty={visibleCampaigns.length === 0} emptyMessage="No campaign history matches this filter." className="py-16">
              {visibleCampaigns.map((campaign) => (
                <button
                  key={campaign.id}
                  type="button"
                  onClick={() => setSelectedCampaignId(campaign.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedCampaignId === campaign.id
                      ? 'border-[#7626c6]/30 bg-[#faf5ff] shadow-sm'
                      : 'border-gray-200 bg-white hover:border-[#7626c6]/20 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-semibold text-gray-900">{campaign.name}</h4>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getCampaignStatusClass(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${getChannelAccent(campaign.channel)}`}>
                          {campaign.channel}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{campaign.objective}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                        <span>{campaign.updatedLabel}</span>
                        <span>{campaign.audience.length} segment{campaign.audience.length > 1 ? 's' : ''}</span>
                        <span>{campaign.metrics.revenue} attributed</span>
                      </div>
                    </div>
                    <div className="grid shrink-0 grid-cols-2 gap-3 text-sm text-gray-600 sm:w-[20rem]">
                      <HistoryMetric label="Delivered" value={campaign.metrics.delivered} />
                      <HistoryMetric label="Engagement" value={campaign.metrics.engagement} />
                      <HistoryMetric label="Conversions" value={campaign.metrics.conversions} />
                      <HistoryMetric label="Revenue" value={campaign.metrics.revenue} />
                    </div>
                  </div>
                </button>
              ))}
            </ContentState>
          </div>
        </section>

        <aside className="space-y-6">
          <PanelCard
            title="Audience Targeting"
            description="Select who should receive your next organizer campaign."
            badge="Targeting"
          >
            <div className="space-y-3">
              {audienceSegments.map((segment) => {
                const isSelected = campaignDraft.audience.includes(segment.id);
                return (
                  <button
                    key={segment.id}
                    type="button"
                    onClick={() => toggleAudienceSegment(segment.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-[#7626c6]/30 bg-[#faf5ff]'
                        : 'border-gray-200 hover:border-[#7626c6]/20 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{segment.label}</div>
                        <p className="mt-1 text-sm leading-6 text-gray-500">{segment.description}</p>
                      </div>
                      <Target className={`h-4 w-4 ${isSelected ? 'text-[#7626c6]' : 'text-gray-300'}`} />
                    </div>
                    <div className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                      {segment.countLabel}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-violet-200 bg-violet-50/70 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7626c6]">Current selection</div>
              <div className="mt-2 text-sm font-medium text-gray-900">{selectedAudienceCountLabel}</div>
              <p className="mt-2 text-sm text-gray-600">
                The selected segments will prefill the next campaign you create in this workspace.
              </p>
            </div>
          </PanelCard>

          <PanelCard
            title="Performance Summary"
            description="Quick read on the currently selected campaign."
            badge="Live"
          >
            {selectedCampaign ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getCampaignStatusClass(selectedCampaign.status)}`}>
                      {selectedCampaign.status}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${getChannelAccent(selectedCampaign.channel)}`}>
                      {selectedCampaign.channel}
                    </span>
                  </div>
                  <h4 className="mt-3 text-lg font-semibold text-gray-900">{selectedCampaign.name}</h4>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{selectedCampaign.objective}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <SummaryChip icon={Send} label="Delivered" value={selectedCampaign.metrics.delivered} />
                  <SummaryChip icon={Sparkles} label="Engagement" value={selectedCampaign.metrics.engagement} />
                  <SummaryChip icon={CheckCheck} label="Conversions" value={selectedCampaign.metrics.conversions} />
                  <SummaryChip icon={CalendarClock} label="Timing" value={selectedCampaign.updatedLabel} />
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Audience</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedCampaign.audience.map((segmentId) => {
                      const segment = audienceSegments.find((candidate) => candidate.id === segmentId);
                      return (
                        <span key={segmentId} className="rounded-full bg-[#f5ecfd] px-3 py-1 text-xs font-medium text-[#7626c6]">
                          {segment?.label || segmentId}
                        </span>
                      );
                    })}
                  </div>
                  <div className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Subject / Hook</div>
                  <p className="mt-2 text-sm text-gray-700">{selectedCampaign.subject}</p>
                </div>
              </div>
            ) : (
              <ContentState isEmpty emptyMessage="Select a campaign to review performance." className="py-12">
                <div />
              </ContentState>
            )}
          </PanelCard>
        </aside>
      </div>

      {showCampaignModal ? (
        <ModalShell onClose={() => setShowCampaignModal(false)}>
          <div
            ref={campaignDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={campaignTitleId}
            aria-describedby={campaignDescriptionId}
            tabIndex={-1}
            className="ticketing-modal-card rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
          >
            <h3 id={campaignTitleId} className="mb-1 text-xl font-semibold text-gray-900">
              Create Campaign
            </h3>
            <p id={campaignDescriptionId} className="mb-5 text-sm text-gray-600">
              Build a draft, schedule a send, or launch a campaign to your selected audience.
            </p>

            <form onSubmit={createCampaign} className="flex flex-col min-h-0">
              <div className="ticketing-modal-body space-y-4">
                <div>
                  <p id={getFieldId('campaign-channel')} className="mb-2 block text-sm font-medium text-gray-700">
                    Campaign Channel
                  </p>
                  <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1" role="group" aria-labelledby={getFieldId('campaign-channel')}>
                    <button
                      type="button"
                      onClick={() => updateCampaignDraft('channel', 'email')}
                      className={`flex items-center gap-2 rounded-md px-4 py-2 transition ${
                        campaignDraft.channel === 'email' ? 'bg-white text-[#7626c6] shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCampaignDraft('channel', 'sms')}
                      className={`flex items-center gap-2 rounded-md px-4 py-2 transition ${
                        campaignDraft.channel === 'sms' ? 'bg-white text-[#7626c6] shadow-sm' : 'text-gray-600'
                      }`}
                    >
                      <Phone className="h-4 w-4" />
                      SMS
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField label="Campaign Name" htmlFor={getFieldId('campaign-name')}>
                    <input
                      id={getFieldId('campaign-name')}
                      required
                      type="text"
                      value={campaignDraft.name}
                      onChange={(event) => updateCampaignDraft('name', event.target.value)}
                      placeholder="e.g., VIP Ticket Launch Reminder"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                    />
                  </FormField>
                  <FormField label="Campaign Status" htmlFor={getFieldId('campaign-status')}>
                    <select
                      id={getFieldId('campaign-status')}
                      value={campaignDraft.status}
                      onChange={(event) => updateCampaignDraft('status', event.target.value as CampaignStatus)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                    >
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="sent">Send Now</option>
                    </select>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField label="Send Time" htmlFor={getFieldId('campaign-send-date')}>
                    <input
                      id={getFieldId('campaign-send-date')}
                      type="datetime-local"
                      value={campaignDraft.sendAt}
                      onChange={(event) => updateCampaignDraft('sendAt', event.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                    />
                  </FormField>
                  <FormField label="Objective" htmlFor={getFieldId('campaign-objective')}>
                    <input
                      id={getFieldId('campaign-objective')}
                      required
                      type="text"
                      value={campaignDraft.objective}
                      onChange={(event) => updateCampaignDraft('objective', event.target.value)}
                      placeholder="What should this campaign achieve?"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                    />
                  </FormField>
                </div>

                {campaignDraft.channel === 'email' ? (
                  <FormField label="Subject Line" htmlFor={getFieldId('campaign-subject')}>
                    <input
                      id={getFieldId('campaign-subject')}
                      required
                      type="text"
                      value={campaignDraft.subject}
                      onChange={(event) => updateCampaignDraft('subject', event.target.value)}
                      placeholder="Subject line for your email"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                    />
                  </FormField>
                ) : null}

                <div>
                  <div className="mb-2 block text-sm font-medium text-gray-700">Audience Segments</div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {audienceSegments.map((segment) => {
                      const isSelected = campaignDraft.audience.includes(segment.id);
                      return (
                        <label
                          key={segment.id}
                          htmlFor={getFieldId(`segment-${segment.id}`)}
                          className={`cursor-pointer rounded-xl border p-3 transition ${
                            isSelected ? 'border-[#7626c6]/30 bg-[#faf5ff]' : 'border-gray-200 hover:border-[#7626c6]/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              id={getFieldId(`segment-${segment.id}`)}
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleAudienceSegment(segment.id)}
                              className="mt-1 rounded"
                            />
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{segment.label}</div>
                              <div className="mt-1 text-sm text-gray-500">{segment.description}</div>
                              <div className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                                {segment.countLabel}
                              </div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <FormField
                  label={campaignDraft.channel === 'email' ? 'Email Message' : 'SMS Message'}
                  htmlFor={getFieldId('campaign-message')}
                >
                  <textarea
                    id={getFieldId('campaign-message')}
                    required
                    rows={4}
                    value={campaignDraft.message}
                    onChange={(event) => updateCampaignDraft('message', event.target.value)}
                    placeholder={campaignDraft.channel === 'email' ? 'Write your email content...' : 'Write your SMS content...'}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                  />
                </FormField>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#7626c6] px-4 py-2 text-white transition hover:bg-[#5f1fa3]"
                >
                  {campaignDraft.status === 'draft'
                    ? 'Save Draft'
                    : campaignDraft.status === 'scheduled'
                      ? 'Schedule Campaign'
                      : 'Send Campaign'}
                </button>
              </div>
            </form>
          </div>
        </ModalShell>
      ) : null}

      {showListingModal ? (
        <ModalShell onClose={() => setShowListingModal(false)}>
          <div
            ref={listingDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={listingTitleId}
            aria-describedby={listingDescriptionId}
            tabIndex={-1}
            className="ticketing-modal-card rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
          >
            <h3 id={listingTitleId} className="mb-1 text-xl font-semibold text-gray-900">
              Manage Georim Listing
            </h3>
            <p id={listingDescriptionId} className="mb-5 text-sm text-gray-600">
              Control discovery, push, and category targeting for your Explore listing.
            </p>

            <form onSubmit={saveListingSettings} className="flex flex-col min-h-0">
              <div className="ticketing-modal-body space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField label="Listing Status" htmlFor={getFieldId('listing-status')}>
                    <select
                      id={getFieldId('listing-status')}
                      value={listingDraft.status}
                      onChange={(event) => updateListingDraft('status', event.target.value as ListingStatus)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                    >
                      <option value="live">Live</option>
                      <option value="paused">Paused</option>
                    </select>
                  </FormField>
                  <FormField label="Category" htmlFor={getFieldId('listing-category')}>
                    <select
                      id={getFieldId('listing-category')}
                      value={listingDraft.category}
                      onChange={(event) => updateListingDraft('category', event.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                    >
                      <option value="Music Festivals">Music Festivals</option>
                      <option value="Concerts">Concerts</option>
                      <option value="Nightlife">Nightlife</option>
                      <option value="Conferences">Conferences</option>
                    </select>
                  </FormField>
                </div>

                <FormField label="Discovery Radius (miles)" htmlFor={getFieldId('listing-radius')}>
                  <input
                    id={getFieldId('listing-radius')}
                    type="number"
                    min={1}
                    value={listingDraft.geoRadius}
                    onChange={(event) => updateListingDraft('geoRadius', Number(event.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#7626c6]"
                  />
                </FormField>

                <div className="space-y-3">
                  <label htmlFor={getFieldId('listing-discovery')} className="flex cursor-pointer items-center gap-2">
                    <input
                      id={getFieldId('listing-discovery')}
                      type="checkbox"
                      checked={listingDraft.discoveryEnabled}
                      onChange={(event) => updateListingDraft('discoveryEnabled', event.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Enable location-based discovery</span>
                  </label>
                  <label htmlFor={getFieldId('listing-push-notifications')} className="flex cursor-pointer items-center gap-2">
                    <input
                      id={getFieldId('listing-push-notifications')}
                      type="checkbox"
                      checked={listingDraft.pushNotifications}
                      onChange={(event) => updateListingDraft('pushNotifications', event.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Enable push notifications</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={() => setShowListingModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#7626c6] px-4 py-2 text-white transition hover:bg-[#5f1fa3]"
                >
                  Save Listing
                </button>
              </div>
            </form>
          </div>
        </ModalShell>
      ) : null}
    </div>
  );
}

function MetricCard({ title, value, helper }: { title: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
      <div className="text-sm text-white/75">{title}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
      <div className="mt-2 text-sm text-white/80">{helper}</div>
    </div>
  );
}

function HistoryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">{label}</div>
      <div className="mt-2 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
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
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className="rounded-full bg-[#f5ecfd] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7626c6]">
          {badge}
        </div>
      </div>
      {children}
    </section>
  );
}

function SummaryChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Send;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <div className="inline-flex rounded-xl bg-gray-100 p-2 text-gray-700">
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</div>
      <div className="mt-2 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function FormField({
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
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
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
