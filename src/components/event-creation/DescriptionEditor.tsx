import { useState } from 'react';
import { Bold, Italic, List, Link as LinkIcon, AlignLeft } from 'lucide-react';
import { EventDraft, EventDraftUpdate } from '../../types/event';

interface DescriptionEditorProps {
  data: EventDraft;
  onUpdate: (data: EventDraftUpdate) => void;
}

export function DescriptionEditor({ data, onUpdate }: DescriptionEditorProps) {
  const [activeFormat, setActiveFormat] = useState<string[]>([]);

  const toggleFormat = (format: string) => {
    setActiveFormat((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Description</h2>
        <p className="text-gray-600">Tell attendees what your event is about</p>
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Summary <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-3">
          A brief overview that appears in event listings (max 140 characters)
        </p>
        <textarea
          value={data.summary || ''}
          onChange={(e) => onUpdate({ summary: e.target.value })}
          placeholder="A compelling one-line description of your event"
          maxLength={140}
          rows={2}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent resize-none"
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {(data.summary || '').length}/140 characters
        </div>
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Description <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Provide detailed information about your event
        </p>

        {/* Toolbar */}
        <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex gap-1">
          <button
            onClick={() => toggleFormat('bold')}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormat.includes('bold') ? 'bg-gray-200' : ''
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => toggleFormat('italic')}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormat.includes('italic') ? 'bg-gray-200' : ''
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4 text-gray-700" />
          </button>
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          <button
            onClick={() => toggleFormat('list')}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormat.includes('list') ? 'bg-gray-200' : ''
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => toggleFormat('align')}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormat.includes('align') ? 'bg-gray-200' : ''
            }`}
            title="Align"
          >
            <AlignLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => toggleFormat('link')}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormat.includes('link') ? 'bg-gray-200' : ''
            }`}
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Editor */}
        <textarea
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="What should attendees expect from your event?

Include:
• Key highlights and activities
• What attendees will learn or experience
• Speaker or performer information
• Schedule overview
• Any special requirements"
          rows={12}
          className="w-full px-4 py-3 border border-gray-300 border-t-0 rounded-b-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent resize-none"
        />
      </div>

      {/* Suggested Sections */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">✍️ Suggested Sections to Include</h4>
        <div className="grid grid-cols-2 gap-3">
          <button className="text-left px-3 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm">
            📋 Event Overview
          </button>
          <button className="text-left px-3 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm">
            🎤 Speakers/Performers
          </button>
          <button className="text-left px-3 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm">
            📅 Agenda/Schedule
          </button>
          <button className="text-left px-3 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm">
            🎯 Who Should Attend
          </button>
          <button className="text-left px-3 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm">
            ℹ️ Additional Information
          </button>
          <button className="text-left px-3 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm">
            📍 Venue Details
          </button>
        </div>
      </div>
    </div>
  );
}
