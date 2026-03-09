import { MapPin, Globe, Clock } from 'lucide-react';
import { EventDraft, EventDraftUpdate } from '../../types/event';

interface LocationSetupProps {
  data: EventDraft;
  onUpdate: (data: EventDraftUpdate) => void;
}

export function LocationSetup({ data, onUpdate }: LocationSetupProps) {
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

        <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
          <input
            type="radio"
            name="locationType"
            value="in-person"
            checked={data.locationType === 'in-person'}
            onChange={(e) => onUpdate({ locationType: e.target.value })}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-[#7626c6]" />
              <span className="font-medium text-gray-900">Venue</span>
            </div>
            <p className="text-sm text-gray-600">
              An in-person event at a physical location
            </p>
          </div>
        </label>

        <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
          <input
            type="radio"
            name="locationType"
            value="online"
            checked={data.locationType === 'online'}
            onChange={(e) => onUpdate({ locationType: e.target.value })}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-5 h-5 text-[#7626c6]" />
              <span className="font-medium text-gray-900">Online Event</span>
            </div>
            <p className="text-sm text-gray-600">
              A virtual event with online meeting links
            </p>
          </div>
        </label>

        <label className="flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
          <input
            type="radio"
            name="locationType"
            value="tba"
            checked={data.locationType === 'tba'}
            onChange={(e) => onUpdate({ locationType: e.target.value })}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-[#7626c6]" />
              <span className="font-medium text-gray-900">To Be Announced</span>
            </div>
            <p className="text-sm text-gray-600">
              Location details will be shared later
            </p>
          </div>
        </label>
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
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
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
