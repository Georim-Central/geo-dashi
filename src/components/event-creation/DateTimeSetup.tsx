import { EventDraft, EventDraftUpdate } from '../../types/event';
import { AppleCalendar, AppleIconSurface, AppleRepeat } from '../../apple-icons';

interface DateTimeSetupProps {
  data: EventDraft;
  onUpdate: (data: EventDraftUpdate) => void;
}

export function DateTimeSetup({ data, onUpdate }: DateTimeSetupProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Date & Time</h2>
        <p className="text-gray-600">When is your event happening?</p>
      </div>

      {/* Recurring Event Toggle */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.isRecurring}
            onChange={(e) => onUpdate({ isRecurring: e.target.checked })}
            className="w-5 h-5 text-[#7626c6] rounded focus:ring-[#7626c6]"
          />
          <div className="flex items-center gap-2">
            <AppleIconSurface tone="blue" className="h-10 w-10">
              <AppleRepeat className="w-5 h-5" />
            </AppleIconSurface>
            <span className="font-medium text-gray-900">This is a recurring event</span>
          </div>
        </label>
        <p className="text-sm text-gray-600 mt-2 ml-8">
          Enable this for events that happen multiple times (daily, weekly, etc.)
        </p>
      </div>

      {/* Start Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <div className="input-group-wrapper">
            <AppleCalendar className="icon-left w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={data.startDate}
              onChange={(e) => onUpdate({ startDate: e.target.value })}
              className="event-creation-input-with-icon pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={data.startTime}
            onChange={(e) => onUpdate({ startTime: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
          />
        </div>
      </div>

      {/* End Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date <span className="text-red-500">*</span>
          </label>
          <div className="input-group-wrapper">
            <AppleCalendar className="icon-left w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={data.endDate}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
              className="event-creation-input-with-icon pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            value={data.endTime}
            onChange={(e) => onUpdate({ endTime: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
          />
        </div>
      </div>

      {/* Recurring Event Options */}
      {data.isRecurring && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-900">Recurrence Pattern</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repeat Every
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                defaultValue="1"
                min="1"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
              />
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent">
                <option value="daily">Day(s)</option>
                <option value="weekly">Week(s)</option>
                <option value="monthly">Month(s)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ends On
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="recurrenceEnd" defaultChecked />
                <span className="text-sm">After</span>
                <input
                  type="number"
                  defaultValue="10"
                  min="1"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <span className="text-sm">occurrences</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="recurrenceEnd" />
                <span className="text-sm">On date</span>
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Timezone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent">
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="UTC">UTC</option>
        </select>
      </div>
    </div>
  );
}
