import { useEffect, useRef, useState } from 'react';
import { BasicInfo } from './event-creation/BasicInfo';
import { LocationSetup } from './event-creation/LocationSetup';
import { DateTimeSetup } from './event-creation/DateTimeSetup';
import { MediaGallery } from './event-creation/MediaGallery';
import { DescriptionEditor } from './event-creation/DescriptionEditor';
import { EventDraft, EventDraftUpdate } from '../types/event';
import {
  AppleAlignLeft,
  AppleCalendar,
  AppleCheck,
  AppleImage,
  AppleListBullet,
  AppleMapPin,
} from '../apple-icons';

interface EventCreationProps {
  onEventCreated: (eventId: string, eventData: EventDraft) => void;
}

type Step = 'basic' | 'location' | 'datetime' | 'media' | 'description';

type PersistedEventCreationDraft = {
  completedSteps: Step[];
  currentStep: Step;
  eventData: EventDraft;
  savedAt: string;
};

const EVENT_CREATION_DRAFT_STORAGE_KEY = 'georim:create-event-draft';

const steps = [
  { id: 'basic', label: 'Basic Info', number: 1, icon: AppleListBullet },
  { id: 'location', label: 'Location', number: 2, icon: AppleMapPin },
  { id: 'datetime', label: 'Date & Time', number: 3, icon: AppleCalendar },
  { id: 'media', label: 'Media', number: 4, icon: AppleImage },
  { id: 'description', label: 'Description', number: 5, icon: AppleAlignLeft }
];

const stepIds = new Set<Step>(steps.map((step) => step.id as Step));

function createEmptyEventDraft(): EventDraft {
  return {
    title: '',
    type: '',
    category: '',
    tags: [],
    locationType: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    isRecurring: false,
    mainImage: '',
    additionalImages: [],
    videoUrl: '',
    summary: '',
    description: ''
  };
}

function isStep(value: unknown): value is Step {
  return typeof value === 'string' && stepIds.has(value as Step);
}

function sanitizeDraftForStorage(draft: EventDraft): EventDraft {
  return {
    ...draft,
    mainImage: draft.mainImage.startsWith('blob:') ? '' : draft.mainImage,
    additionalImages: draft.additionalImages.filter((image) => !image.startsWith('blob:'))
  };
}

function hasEventDraftContent(draft: EventDraft): boolean {
  return Boolean(
    draft.title.trim() ||
    draft.type.trim() ||
    draft.category.trim() ||
    draft.tags.length ||
    draft.locationType.trim() ||
    draft.location.trim() ||
    draft.startDate.trim() ||
    draft.startTime.trim() ||
    draft.endDate.trim() ||
    draft.endTime.trim() ||
    draft.isRecurring ||
    draft.mainImage.trim() ||
    draft.additionalImages.length ||
    draft.videoUrl.trim() ||
    draft.summary.trim() ||
    draft.description.trim()
  );
}

function readStoredDraft(): PersistedEventCreationDraft | null {
  if (typeof window === 'undefined') return null;

  try {
    const rawDraft = window.localStorage.getItem(EVENT_CREATION_DRAFT_STORAGE_KEY);
    if (!rawDraft) return null;

    const parsedDraft = JSON.parse(rawDraft) as Partial<PersistedEventCreationDraft>;
    const currentStep = isStep(parsedDraft.currentStep) ? parsedDraft.currentStep : 'basic';
    const completedSteps = Array.isArray(parsedDraft.completedSteps)
      ? parsedDraft.completedSteps.filter((step, index, array): step is Step => isStep(step) && array.indexOf(step) === index)
      : [];

    return {
      currentStep,
      completedSteps,
      eventData: {
        ...createEmptyEventDraft(),
        ...(parsedDraft.eventData ?? {}),
      },
      savedAt: typeof parsedDraft.savedAt === 'string' ? parsedDraft.savedAt : '',
    };
  } catch {
    return null;
  }
}

export function EventCreation({ onEventCreated }: EventCreationProps) {
  const [initialDraft] = useState<PersistedEventCreationDraft | null>(() => readStoredDraft());
  const [currentStep, setCurrentStep] = useState<Step>(() => initialDraft?.currentStep ?? 'basic');
  const [completedSteps, setCompletedSteps] = useState<Step[]>(() => initialDraft?.completedSteps ?? []);
  const [eventData, setEventData] = useState<EventDraft>(() => initialDraft?.eventData ?? createEmptyEventDraft());
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(() => initialDraft?.savedAt || null);
  const skipNextAutosaveRef = useRef(false);
  const hasDraftToClear = currentStep !== 'basic' || completedSteps.length > 0 || hasEventDraftContent(eventData);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      return;
    }

    const savedAt = new Date().toISOString();
    const nextDraft: PersistedEventCreationDraft = {
      completedSteps,
      currentStep,
      eventData: sanitizeDraftForStorage(eventData),
      savedAt,
    };

    window.localStorage.setItem(EVENT_CREATION_DRAFT_STORAGE_KEY, JSON.stringify(nextDraft));
    setLastSavedAt(savedAt);
  }, [completedSteps, currentStep, eventData]);

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as Step);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as Step);
    }
  };

  const handleFinish = () => {
    // In a real app, this would save to a database
    const eventId = Math.random().toString(36).substring(7);
    const nextEventData: EventDraft = {
      ...eventData,
      title: eventData.title.trim() || 'Untitled Event'
    };

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(EVENT_CREATION_DRAFT_STORAGE_KEY);
    }

    onEventCreated(eventId, nextEventData);
  };

  const handleClearDraft = () => {
    if (typeof window !== 'undefined') {
      const shouldClearDraft = window.confirm('Clear this draft and restart the event setup?');
      if (!shouldClearDraft) return;

      skipNextAutosaveRef.current = true;
      window.localStorage.removeItem(EVENT_CREATION_DRAFT_STORAGE_KEY);
    }

    setCurrentStep('basic');
    setCompletedSteps([]);
    setEventData(createEmptyEventDraft());
    setLastSavedAt(null);
  };

  const updateEventData = (data: EventDraftUpdate) => {
    setEventData({ ...eventData, ...data });
  };

  return (
    <div className="event-creation-page app-page-background min-h-full">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center text-[#6b3fb5]">
                <AppleCalendar className="h-5 w-5" />
              </div>
              <div>
                <h1 className="ui-page-title ui-type-section text-gray-900">Create New Event</h1>
                <p className="ui-page-subtitle ui-type-subsection mt-1">Build the essentials, timing, media, and copy in one flow.</p>
                <p className="ui-meta-text mt-1">
                  {lastSavedAt
                    ? `Draft saved automatically · Last saved ${new Date(lastSavedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
                    : 'Draft saves automatically while you work.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearDraft}
              disabled={!hasDraftToClear}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear Draft
            </button>
          </div>
          
          <div className="flex items-center justify-between" role="list" aria-label="Event creation progress">
            {steps.map((step, index) => {
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex items-center flex-1" role="listitem" aria-current={currentStep === step.id ? 'step' : undefined}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        completedSteps.includes(step.id as Step)
                          ? 'bg-green-500 text-white shadow-[0_10px_24px_-18px_rgba(34,197,94,0.95)]'
                          : currentStep === step.id
                          ? 'bg-[#7626c6] text-white shadow-[0_16px_32px_-22px_rgba(118,38,198,0.9)]'
                          : 'bg-[#f3f4f8] text-gray-500 border border-white'
                      }`}
                    >
                      {completedSteps.includes(step.id as Step) ? (
                        <AppleCheck className="w-5 h-5" />
                      ) : (
                        <>
                          <StepIcon className="w-4 h-4" aria-hidden="true" />
                          <span className="sr-only">Step {step.number}</span>
                        </>
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        currentStep === step.id ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded transition-all ${
                        completedSteps.includes(steps[index + 1].id as Step)
                          ? 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {currentStep === 'basic' && (
            <BasicInfo data={eventData} onUpdate={updateEventData} />
          )}
          {currentStep === 'location' && (
            <LocationSetup data={eventData} onUpdate={updateEventData} />
          )}
          {currentStep === 'datetime' && (
            <DateTimeSetup data={eventData} onUpdate={updateEventData} />
          )}
          {currentStep === 'media' && (
            <MediaGallery data={eventData} onUpdate={updateEventData} />
          )}
          {currentStep === 'description' && (
            <DescriptionEditor data={eventData} onUpdate={updateEventData} />
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 'basic'}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            {currentStep === 'description' ? (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2 bg-[#7626c6] text-white btn-glass rounded-lg font-medium hover:bg-[#5f1fa3] transition-colors"
              >
                Create Event
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-[#7626c6] text-white btn-glass rounded-lg font-medium hover:bg-[#5f1fa3] transition-colors"
              >
                Next Step
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
