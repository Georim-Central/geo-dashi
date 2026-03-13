import { useState } from 'react';
import { EventDraft, EventDraftUpdate } from '../../types/event';
import {
  AppleAlignLeft,
  AppleBold,
  AppleCalendar,
  AppleGlobe,
  AppleLink,
  AppleListBullet,
  AppleMapPin,
  AppleVideo,
  AppleItalic,
} from '../../apple-icons';

interface DescriptionEditorProps {
  data: EventDraft;
  onUpdate: (data: EventDraftUpdate) => void;
}

export function DescriptionEditor({ data, onUpdate }: DescriptionEditorProps) {
  const [activeFormat, setActiveFormat] = useState<string[]>([]);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionContent, setSectionContent] = useState('');
  const [sectionError, setSectionError] = useState('');

  const suggestedSections = [
    { id: 'overview', label: 'Event Overview', title: 'Event Overview', icon: AppleListBullet, tone: 'neutral' as const },
    { id: 'speakers', label: 'Speakers/Performers', title: 'Speakers/Performers', icon: AppleVideo, tone: 'neutral' as const },
    { id: 'agenda', label: 'Agenda/Schedule', title: 'Agenda/Schedule', icon: AppleCalendar, tone: 'blue' as const },
    { id: 'audience', label: 'Who Should Attend', title: 'Who Should Attend', icon: AppleGlobe, tone: 'blue' as const },
    { id: 'info', label: 'Additional Information', title: 'Additional Information', icon: AppleLink, tone: 'neutral' as const },
    { id: 'venue', label: 'Venue Details', title: 'Venue Details', icon: AppleMapPin, tone: 'brand' as const }
  ];

  const toggleFormat = (format: string) => {
    setActiveFormat((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  const openSectionForm = (title: string) => {
    setSectionTitle(title);
    setSectionContent('');
    setSectionError('');
    setShowSectionForm(true);
  };

  const closeSectionForm = () => {
    setShowSectionForm(false);
    setSectionTitle('');
    setSectionContent('');
    setSectionError('');
  };

  const addSectionToDescription = () => {
    const title = sectionTitle.trim();
    const content = sectionContent.trim();

    if (!title) {
      setSectionError('Please enter a section title.');
      return;
    }

    const sectionBlock = content ? `${title}\n${content}` : title;
    const existingDescription = data.description.trim();
    const nextDescription = existingDescription
      ? `${existingDescription}\n\n${sectionBlock}`
      : sectionBlock;

    onUpdate({ description: nextDescription });
    closeSectionForm();
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
            type="button"
            onClick={() => toggleFormat('bold')}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormat.includes('bold') ? 'bg-gray-200' : ''
            }`}
            title="Bold"
          >
            <AppleBold className="w-4 h-4 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('italic')}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormat.includes('italic') ? 'bg-gray-200' : ''
            }`}
            title="Italic"
          >
            <AppleItalic className="w-4 h-4 text-gray-700" />
          </button>
          <div className="w-px h-8 bg-gray-300 mx-1"></div>
          <button
            type="button"
            onClick={() => toggleFormat('list')}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormat.includes('list') ? 'bg-gray-200' : ''
            }`}
            title="Bullet List"
          >
            <AppleListBullet className="w-4 h-4 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('align')}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormat.includes('align') ? 'bg-gray-200' : ''
            }`}
            title="Align"
          >
            <AppleAlignLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('link')}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              activeFormat.includes('link') ? 'bg-gray-200' : ''
            }`}
            title="Insert Link"
          >
            <AppleLink className="w-4 h-4 text-gray-700" />
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
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center text-sky-700">
            <AppleAlignLeft className="w-5 h-5" />
          </div>
          <h4 className="font-medium text-gray-900">Suggested Sections to Include</h4>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {suggestedSections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => openSectionForm(section.title)}
              className="flex items-center gap-3 text-left px-3 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm"
            >
              <div className={`flex h-9 w-9 items-center justify-center ${
                section.tone === 'brand'
                  ? 'text-[#6b3fb5]'
                  : section.tone === 'blue'
                  ? 'text-sky-700'
                  : 'text-slate-600'
              }`}>
                <section.icon className="w-4 h-4" />
              </div>
              <span>{section.label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => openSectionForm('')}
            className="flex items-center gap-3 text-left px-3 py-2 bg-white border border-dashed border-blue-300 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium text-blue-700"
          >
            <div className="flex h-9 w-9 items-center justify-center text-slate-600">
              <AppleLink className="w-4 h-4" />
            </div>
            <span>Custom Title</span>
          </button>
        </div>
      </div>

      {showSectionForm && (
        <div className="bg-white border border-blue-200 rounded-lg p-4">
          <h5 className="text-sm font-semibold text-gray-900 mb-3">Add Section</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={sectionTitle}
                onChange={(event) => {
                  setSectionTitle(event.target.value);
                  if (sectionError) setSectionError('');
                }}
                placeholder="e.g., Parking & Transportation"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Content
              </label>
              <textarea
                value={sectionContent}
                onChange={(event) => setSectionContent(event.target.value)}
                rows={4}
                placeholder="Add details for this section..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent resize-none"
              />
            </div>

            {sectionError && (
              <p className="text-sm text-red-600" role="alert">{sectionError}</p>
            )}

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={closeSectionForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addSectionToDescription}
                className="px-4 py-2 bg-[#7626c6] text-white btn-glass rounded-lg hover:bg-[#5f1fa3] transition-colors"
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
