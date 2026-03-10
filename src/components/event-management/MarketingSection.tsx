import { Mail, Phone, Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { ContentState } from '../ui/ContentState';
import { useModalA11y } from '../../hooks/useModalA11y';

type ListingStatus = 'live' | 'paused';

type ListingSettings = {
  status: ListingStatus;
  category: string;
  discoveryEnabled: boolean;
  pushNotifications: boolean;
  geoRadius: number;
};

export function MarketingSection() {
  const [campaignType, setCampaignType] = useState<'email' | 'sms'>('email');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [georimNotice, setGeorimNotice] = useState<string | null>(null);
  const [listingSettings, setListingSettings] = useState<ListingSettings>({
    status: 'live',
    category: 'Music Festivals',
    discoveryEnabled: true,
    pushNotifications: true,
    geoRadius: 25
  });
  const [listingDraft, setListingDraft] = useState<ListingSettings>({
    status: 'live',
    category: 'Music Festivals',
    discoveryEnabled: true,
    pushNotifications: true,
    geoRadius: 25
  });
  const [campaignDraft, setCampaignDraft] = useState({
    channel: 'email' as 'email' | 'sms',
    name: '',
    audience: 'all-subscribers',
    sendAt: '',
    subject: '',
    message: ''
  });
  const {
    dialogRef: campaignDialogRef,
    titleId: campaignTitleId,
    descriptionId: campaignDescriptionId
  } = useModalA11y({
    isOpen: showCampaignModal,
    onClose: () => setShowCampaignModal(false)
  });
  const {
    dialogRef: listingDialogRef,
    titleId: listingTitleId,
    descriptionId: listingDescriptionId
  } = useModalA11y({
    isOpen: showListingModal,
    onClose: () => setShowListingModal(false)
  });

  const updateCampaignDraft = <T extends keyof typeof campaignDraft>(
    field: T,
    value: (typeof campaignDraft)[T]
  ) => {
    setCampaignDraft((prevDraft) => ({ ...prevDraft, [field]: value }));
  };

  const openCampaignModal = () => {
    setCampaignDraft({
      channel: campaignType,
      name: '',
      audience: 'all-subscribers',
      sendAt: '',
      subject: '',
      message: ''
    });
    setShowCampaignModal(true);
  };

  const closeCampaignModal = () => {
    setShowCampaignModal(false);
  };

  const toggleBoostVisibility = () => {
    setIsBoosted((currentValue) => {
      const nextValue = !currentValue;
      setGeorimNotice(nextValue ? 'Boost visibility enabled for this listing.' : 'Boost visibility turned off.');
      console.log(`[Georim] Boost visibility ${nextValue ? 'enabled' : 'disabled'}`);
      return nextValue;
    });
  };

  const openManageListing = () => {
    setListingDraft(listingSettings);
    setShowListingModal(true);
  };

  const closeManageListing = () => {
    setShowListingModal(false);
  };

  const updateListingDraft = <T extends keyof ListingSettings>(key: T, value: ListingSettings[T]) => {
    setListingDraft((currentDraft) => ({ ...currentDraft, [key]: value }));
  };

  const saveListingSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextSettings = {
      ...listingDraft,
      geoRadius: Math.max(1, Number(listingDraft.geoRadius) || 1)
    };
    setListingSettings(nextSettings);
    setShowListingModal(false);
    setGeorimNotice(
      nextSettings.status === 'live'
        ? 'Listing updated and visible on Georim Explore.'
        : 'Listing updated and currently paused.'
    );
    console.log('[Georim] Listing settings saved', nextSettings);
  };

  const createCampaign = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`[Marketing] New ${campaignDraft.channel.toUpperCase()} campaign created`, campaignDraft);
    setShowCampaignModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Georim Mobile Platform - Featured */}
      <div className="bg-gradient-to-r from-[#7626c6] to-[#5f1fa3] rounded-xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <div className="text-2xl">📱</div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Georim Explore Page</h2>
              <p className="text-white/90 mt-1">Your event's presence on the Georim mobile app</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 text-white rounded-full text-sm font-medium ${
                listingSettings.status === 'live' ? 'bg-green-500' : 'bg-amber-500'
              }`}
            >
              ● {listingSettings.status === 'live' ? 'Live' : 'Paused'}
            </span>
            {isBoosted && (
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium border border-white/30">
                Boosted
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-white/80 text-sm mb-1">Impressions</div>
            <div className="text-3xl font-bold">24.8K</div>
            <div className="text-sm text-green-300 mt-1">+34% this week</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-white/80 text-sm mb-1">Engagement</div>
            <div className="text-3xl font-bold">3.2K</div>
            <div className="text-sm text-green-300 mt-1">+12% this week</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-white/80 text-sm mb-1">Saves</div>
            <div className="text-3xl font-bold">847</div>
            <div className="text-sm text-green-300 mt-1">+28% this week</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-white/80 text-sm mb-1">Shares</div>
            <div className="text-3xl font-bold">234</div>
            <div className="text-sm text-green-300 mt-1">+19% this week</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-3">Georim Features</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Featured in "Trending Events"</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Category: {listingSettings.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-2 h-2 rounded-full ${
                  listingSettings.discoveryEnabled ? 'bg-green-400' : 'bg-white/50'
                }`}
              ></div>
              <span>
                Location-based discovery {listingSettings.discoveryEnabled ? 'enabled' : 'disabled'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-2 h-2 rounded-full ${
                  listingSettings.pushNotifications ? 'bg-green-400' : 'bg-white/50'
                }`}
              ></div>
              <span>Push notifications {listingSettings.pushNotifications ? 'enabled' : 'disabled'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Geo radius: {listingSettings.geoRadius} miles</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" className="px-4 py-2 bg-white text-[#7626c6] rounded-lg hover:bg-white/90 transition-colors font-medium">
            View on Georim App
          </button>
          <button
            type="button"
            onClick={toggleBoostVisibility}
            className={`px-4 py-2 backdrop-blur-sm rounded-lg transition-colors border ${
              isBoosted
                ? 'bg-white text-[#7626c6] border-white'
                : 'bg-white/20 text-white hover:bg-white/30 border-white/40'
            }`}
          >
            {isBoosted ? 'Boosted Visibility' : 'Boost Visibility'}
          </button>
          <button
            type="button"
            onClick={openManageListing}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors border border-white/40"
          >
            Manage Listing
          </button>
        </div>
        {georimNotice && <p className="mt-3 text-sm text-white/90">{georimNotice}</p>}
      </div>

      {/* Campaigns - Email or SMS */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg ${
                campaignType === 'email' ? 'bg-blue-100' : 'bg-green-100'
              }`}
            >
              {campaignType === 'email' ? (
                <Mail className="w-6 h-6 text-blue-600" />
              ) : (
                <Phone className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Campaigns</h2>
              <p className="text-sm text-gray-600">
                {campaignType === 'email'
                  ? 'Reach up to 10,000 contacts per day'
                  : 'Send SMS to attendees and interested contacts'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Campaign Type Toggle */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setCampaignType('email')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  campaignType === 'email'
                    ? 'bg-white text-[#7626c6] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Email</span>
              </button>
              <button
                type="button"
                onClick={() => setCampaignType('sms')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  campaignType === 'sms'
                    ? 'bg-white text-[#7626c6] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">SMS</span>
              </button>
            </div>
            <button
              type="button"
              onClick={openCampaignModal}
              className="flex items-center gap-2 bg-[#7626c6] text-white btn-glass px-4 py-2 rounded-lg hover:bg-[#5f1fa3] transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </button>
          </div>
        </div>

        {/* Campaign Templates */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {campaignType === 'email' ? (
            <>
              <div className="p-4 border border-gray-300 rounded-lg hover:border-[#7626c6] transition-colors cursor-pointer">
                <div className="text-2xl mb-2">📧</div>
                <h3 className="font-medium text-gray-900 mb-1">Event Announcement</h3>
                <p className="text-sm text-gray-600">Blast to all past attendees</p>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg hover:border-[#7626c6] transition-colors cursor-pointer">
                <div className="text-2xl mb-2">🎟️</div>
                <h3 className="font-medium text-gray-900 mb-1">Ticket Reminder</h3>
                <p className="text-sm text-gray-600">Send to ticket holders</p>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg hover:border-[#7626c6] transition-colors cursor-pointer">
                <div className="text-2xl mb-2">⏰</div>
                <h3 className="font-medium text-gray-900 mb-1">Last Chance</h3>
                <p className="text-sm text-gray-600">Final call before event</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 border border-gray-300 rounded-lg hover:border-[#7626c6] transition-colors cursor-pointer">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-medium text-gray-900 mb-1">Event Reminder</h3>
                <p className="text-sm text-gray-600">24-hour event reminder</p>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg hover:border-[#7626c6] transition-colors cursor-pointer">
                <div className="text-2xl mb-2">🎫</div>
                <h3 className="font-medium text-gray-900 mb-1">Ticket Confirmation</h3>
                <p className="text-sm text-gray-600">Send ticket details via SMS</p>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg hover:border-[#7626c6] transition-colors cursor-pointer">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-medium text-gray-900 mb-1">Flash Sale</h3>
                <p className="text-sm text-gray-600">Limited time offer alert</p>
              </div>
            </>
          )}
        </div>

        {/* Recent Campaigns */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Recent Campaigns</h3>
          <ContentState
            isEmpty={(campaignType === 'email' ? mockEmailCampaigns : mockSMSCampaigns).length === 0}
            emptyMessage="No campaign history yet."
            className="py-14"
          >
            {(campaignType === 'email' ? mockEmailCampaigns : mockSMSCampaigns).map(
              (campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  {campaignType === 'email' ? (
                    <Mail className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Phone className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-sm text-gray-600">
                      Sent to {campaign.recipients} recipients
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  {campaignType === 'email' ? (
                    <>
                      <div>
                        <div className="text-gray-600">Open Rate</div>
                        <div className="font-medium text-gray-900">{campaign.openRate}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Click Rate</div>
                        <div className="font-medium text-gray-900">{campaign.clickRate}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="text-gray-600">Delivered</div>
                        <div className="font-medium text-gray-900">{campaign.deliveryRate}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Click Rate</div>
                        <div className="font-medium text-gray-900">{campaign.clickRate}</div>
                      </div>
                    </>
                  )}
                  <div className="text-gray-500">{campaign.date}</div>
                </div>
              </div>
              )
            )}
          </ContentState>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCampaignModal && (
        <div className="ticketing-modal-overlay">
          <div
            className="ticketing-modal-backdrop"
            onClick={closeCampaignModal}
          />
          <div
            ref={campaignDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={campaignTitleId}
            aria-describedby={campaignDescriptionId}
            tabIndex={-1}
            className="ticketing-modal-card ticketing-modal-card--code bg-white rounded-2xl border border-gray-200 shadow-2xl p-6"
          >
            <h3 id={campaignTitleId} className="text-xl font-semibold text-gray-900 mb-1">Create Campaign</h3>
            <p id={campaignDescriptionId} className="text-sm text-gray-600 mb-5">Set up campaign details before sending.</p>

            <form onSubmit={createCampaign} className="flex flex-col min-h-0">
              <div className="ticketing-modal-body space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Channel</label>
                  <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => updateCampaignDraft('channel', 'email')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        campaignDraft.channel === 'email'
                          ? 'bg-white text-[#7626c6] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCampaignDraft('channel', 'sms')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                        campaignDraft.channel === 'sms'
                          ? 'bg-white text-[#7626c6] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                      SMS
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                  <input
                    required
                    type="text"
                    value={campaignDraft.name}
                    onChange={(event) => updateCampaignDraft('name', event.target.value)}
                    placeholder="e.g., VIP Ticket Launch Reminder"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
                    <select
                      value={campaignDraft.audience}
                      onChange={(event) => updateCampaignDraft('audience', event.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                    >
                      <option value="all-subscribers">All Subscribers</option>
                      <option value="ticket-holders">Ticket Holders</option>
                      <option value="vip-only">VIP Contacts</option>
                      <option value="waitlist">Waitlist</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Send Date</label>
                    <input
                      required
                      type="datetime-local"
                      value={campaignDraft.sendAt}
                      onChange={(event) => updateCampaignDraft('sendAt', event.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                    />
                  </div>
                </div>

                {campaignDraft.channel === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                    <input
                      required
                      type="text"
                      value={campaignDraft.subject}
                      onChange={(event) => updateCampaignDraft('subject', event.target.value)}
                      placeholder="e.g., Final 48 Hours: Tickets Selling Fast"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {campaignDraft.channel === 'email' ? 'Email Message' : 'SMS Message'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={campaignDraft.message}
                    onChange={(event) => updateCampaignDraft('message', event.target.value)}
                    placeholder={
                      campaignDraft.channel === 'email'
                        ? 'Write your email campaign content...'
                        : 'Write your SMS campaign content...'
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeCampaignModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Listing Modal */}
      {showListingModal && (
        <div className="ticketing-modal-overlay">
          <div
            className="ticketing-modal-backdrop"
            onClick={closeManageListing}
          />
          <div
            ref={listingDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={listingTitleId}
            aria-describedby={listingDescriptionId}
            tabIndex={-1}
            className="ticketing-modal-card ticketing-modal-card--code bg-white rounded-2xl border border-gray-200 shadow-2xl p-6"
          >
            <h3 id={listingTitleId} className="text-xl font-semibold text-gray-900 mb-1">Manage Georim Listing</h3>
            <p id={listingDescriptionId} className="text-sm text-gray-600 mb-5">Control how your event appears on Georim Explore.</p>

            <form onSubmit={saveListingSettings} className="flex flex-col min-h-0">
              <div className="ticketing-modal-body space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Listing Status</label>
                    <select
                      value={listingDraft.status}
                      onChange={(event) => updateListingDraft('status', event.target.value as ListingStatus)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                    >
                      <option value="live">Live</option>
                      <option value="paused">Paused</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={listingDraft.category}
                      onChange={(event) => updateListingDraft('category', event.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                    >
                      <option value="Music Festivals">Music Festivals</option>
                      <option value="Concerts">Concerts</option>
                      <option value="Nightlife">Nightlife</option>
                      <option value="Conferences">Conferences</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discovery Radius (miles)</label>
                  <input
                    type="number"
                    min={1}
                    value={listingDraft.geoRadius}
                    onChange={(event) => updateListingDraft('geoRadius', Number(event.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={listingDraft.discoveryEnabled}
                      onChange={(event) => updateListingDraft('discoveryEnabled', event.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Enable location-based discovery</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={listingDraft.pushNotifications}
                      onChange={(event) => updateListingDraft('pushNotifications', event.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Enable push notifications</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeManageListing}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors"
                >
                  Save Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const mockEmailCampaigns = [
  {
    id: '1',
    name: 'Early Bird Special Announcement',
    recipients: '3,248',
    openRate: '42.3%',
    clickRate: '8.7%',
    date: 'Jan 5, 2026'
  },
  {
    id: '2',
    name: 'VIP Ticket Launch',
    recipients: '1,542',
    openRate: '38.1%',
    clickRate: '12.4%',
    date: 'Dec 28, 2025'
  }
];

const mockSMSCampaigns = [
  {
    id: '1',
    name: 'Event Reminder',
    recipients: '2,500',
    deliveryRate: '95.2%',
    clickRate: '15.3%',
    date: 'Jan 10, 2026'
  },
  {
    id: '2',
    name: 'Ticket Confirmation',
    recipients: '1,800',
    deliveryRate: '98.4%',
    clickRate: '20.1%',
    date: 'Dec 30, 2025'
  }
];
