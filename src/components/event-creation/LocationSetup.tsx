import { EventDraft, EventDraftUpdate } from '../../types/event';
import { AppleClock, AppleGlobe, AppleMapPin } from '../../apple-icons';
import { cn } from '../../lib/utils';

interface LocationSetupProps {
  data: EventDraft;
  onUpdate: (data: EventDraftUpdate) => void;
}

export function LocationSetup({ data, onUpdate }: LocationSetupProps) {
  const locationOptions = [
    {
      value: 'in-person',
      label: 'Venue',
      description: 'An in-person event at a physical location',
      icon: AppleMapPin,
    },
    {
      value: 'online',
      label: 'Online Event',
      description: 'A virtual event with online meeting links',
      icon: AppleGlobe,
    },
    {
      value: 'tba',
      label: 'To Be Announced',
      description: 'Location details will be shared later',
      icon: AppleClock,
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Location</h2>
        <p className="text-gray-600">Where will your event take place?</p>
      </div>

      {/* Location Type Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Location Type <span className="text-red-500">*</span>
        </label>

        {locationOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = data.locationType === option.value;

          return (
            <label
              key={option.value}
              className={cn(
                'flex items-start gap-4 rounded-[24px] border p-4 cursor-pointer transition-all',
                isSelected
                  ? 'border-[#e5d4fb] bg-[#fbf8ff] shadow-[0_22px_38px_-32px_rgba(118,38,198,0.6)]'
                  : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300',
              )}
            >
              <input
                type="radio"
                name="locationType"
                value={option.value}
                checked={isSelected}
                onChange={(e) => onUpdate({ locationType: e.target.value })}
                className="mt-1"
              />
              <div className="flex flex-1 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center">
                  <Icon className={cn('w-5 h-5', isSelected ? 'text-[#7626c6]' : 'text-gray-500')} />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {option.description}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* Venue Address (for in-person) */}
      {data.locationType === 'in-person' && (
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => onUpdate({ location: e.target.value })}
              placeholder="Search for a venue or enter an address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">
              💡 Tip: Include venue name for better discoverability (e.g., "Madison Square Garden, New York, NY")
            </p>
          </div>

          {/* Google Maps Integration Placeholder */}
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <AppleMapPin className="mx-auto mb-3 w-6 h-6 text-gray-500" />
            <p className="text-sm text-gray-600">Map preview will appear here</p>
            <p className="text-xs text-gray-500 mt-1">Google Maps integration</p>
          </div>
        </div>
      )}

      {/* Online Event URL */}
      {data.locationType === 'online' && (
        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Online Event URL
          </label>
          <input
            type="url"
            value={data.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            placeholder="https://zoom.us/j/... or your event platform link"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-2">
            This link will be shared with ticket holders before the event
          </p>
        </div>
      )}
    </div>
  );
}
