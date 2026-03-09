import { useState } from 'react';
import { BasicInfo } from './event-creation/BasicInfo';
import { LocationSetup } from './event-creation/LocationSetup';
import { DateTimeSetup } from './event-creation/DateTimeSetup';
import { MediaGallery } from './event-creation/MediaGallery';
import { DescriptionEditor } from './event-creation/DescriptionEditor';
import { Check } from 'lucide-react';
import { EventDraft, EventDraftUpdate } from '../types/event';

interface EventCreationProps {
  onEventCreated: (eventId: string, eventName?: string) => void;
}

type Step = 'basic' | 'location' | 'datetime' | 'media' | 'description';

const steps = [
  { id: 'basic', label: 'Basic Info', number: 1 },
  { id: 'location', label: 'Location', number: 2 },
  { id: 'datetime', label: 'Date & Time', number: 3 },
  { id: 'media', label: 'Media', number: 4 },
  { id: 'description', label: 'Description', number: 5 }
];

export function EventCreation({ onEventCreated }: EventCreationProps) {
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);
  const [eventData, setEventData] = useState<EventDraft>({
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
    videoUrl: '',
    summary: '',
    description: ''
  });

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
    const eventName = eventData.title.trim() || 'Untitled Event';
    onEventCreated(eventId, eventName);
  };

  const updateEventData = (data: EventDraftUpdate) => {
    setEventData({ ...eventData, ...data });
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h1>
          
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      completedSteps.includes(step.id as Step)
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-[#7626c6] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {completedSteps.includes(step.id as Step) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
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
            ))}
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
              onClick={handleBack}
              disabled={currentStep === 'basic'}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            {currentStep === 'description' ? (
              <button
                onClick={handleFinish}
                className="px-6 py-2 bg-[#7626c6] text-white btn-glass rounded-lg font-medium hover:bg-[#5f1fa3] transition-colors"
              >
                Create Event
              </button>
            ) : (
              <button
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
