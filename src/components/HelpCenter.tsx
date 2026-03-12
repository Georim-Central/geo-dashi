import { FormEvent, useRef, useState } from 'react';
import { MessageCircle, Shield, Sparkles, X } from 'lucide-react';

import { FaqSection } from '@/components/ui/faq';
import { TestimonialsSection } from '@/components/ui/testimonials-with-marquee';
import { Button } from '@/components/ui/button';
import { useModalA11y } from '@/hooks/useModalA11y';

type HelpForm = {
  fullName: string;
  email: string;
  topic: string;
  message: string;
};

const defaultHelpForm: HelpForm = {
  fullName: 'John Doe',
  email: 'john.doe@georim.com',
  topic: 'dashboard',
  message: '',
};

const testimonials = [
  {
    author: {
      name: 'Maya Patel',
      handle: '@mayaops',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    },
    text: 'The Help Center made onboarding our event coordinators fast. We solved setup questions without waiting on a call.',
  },
  {
    author: {
      name: 'Daniel Kim',
      handle: '@danieldata',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    text: 'The support flows feel built for operators. The FAQ answers the real questions our team hits during live events.',
  },
  {
    author: {
      name: 'Sofia Rodriguez',
      handle: '@sofiaevents',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    },
    text: 'Submitting a support request from inside the dashboard is much cleaner now. We can explain issues without leaving our workflow.',
  },
];

const faqItems = [
  {
    question: 'How do I manage all events from the dashboard?',
    answer: 'Use Dashboard to open any event card, then switch to Event Management tabs for details, ticketing, orders, and reports.',
  },
  {
    question: 'How can I invite team members with event access?',
    answer: 'Go to Team, click Invite Team Member, choose role and event access, then send the invite.',
  },
  {
    question: 'Where do I edit or delete ticket types?',
    answer: 'Open an event, go to Ticketing, and use the Edit and Delete icons on each ticket type.',
  },
  {
    question: 'Where can I download reports?',
    answer: 'Inside Event Management, open Reports to export attendee and performance information.',
  },
  {
    question: 'How fast does support usually respond?',
    answer: 'Most dashboard and event-operations requests are reviewed quickly. Use the contact form for account issues, event blockers, or questions that need follow-up from the Georim team.',
  },
];

const supportHighlights = [
  {
    label: 'Coverage',
    value: 'Organizer support',
    detail: 'Dashboard, ticketing, and live event workflows',
  },
  {
    label: 'Response',
    value: 'Fast triage',
    detail: 'Built for active event-day questions and blockers',
  },
  {
    label: 'Submission',
    value: 'In-dashboard',
    detail: 'Send context-rich requests without leaving your workspace',
  },
];

export function HelpCenter() {
  const [helpForm, setHelpForm] = useState<HelpForm>(defaultHelpForm);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const initialFocusRef = useRef<HTMLTextAreaElement>(null);

  const { dialogRef, titleId, descriptionId } = useModalA11y({
    isOpen: isContactModalOpen,
    onClose: () => {
      setIsContactModalOpen(false);
      setNotice(null);
    },
    initialFocusRef,
  });

  const updateHelpField = <K extends keyof HelpForm>(field: K, value: HelpForm[K]) => {
    setHelpForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmitHelpRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = helpForm.message.trim();
    if (!message) {
      setNotice('Please add a message so we can help you.');
      return;
    }

    setNotice('Help request submitted. Our support team will reach out shortly.');
    setHelpForm((currentForm) => ({
      ...currentForm,
      message: '',
    }));
  };

  return (
    <div className="help-center-page p-8 space-y-6">
      <div className="help-center-hero">
        <div className="help-center-hero__top">
          <div className="help-center-hero__content">
            <div className="help-center-hero__eyebrow">
              <span className="help-center-hero__eyebrow-dot" />
              <span>Support workspace</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="help-center-hero__icon">
                <Shield className="w-5 h-5 text-[#7626c6]" />
              </div>
              <h1 className="help-center-hero__title">Help Center</h1>
            </div>
            <p className="text-sm text-gray-600 help-center-hero__copy">
              Browse proven workflows, common answers, and guided support for day-to-day event operations.
            </p>
          </div>
          <div className="help-center-hero__badge">
            <Sparkles className="w-4 h-4" />
            <span>In-app support for organizers and event teams</span>
          </div>
        </div>
        <div className="help-center-hero__metrics">
          {supportHighlights.map((item) => (
            <div key={item.label} className="help-center-hero__metric">
              <p className="help-center-hero__metric-label">{item.label}</p>
              <p className="help-center-hero__metric-value">{item.value}</p>
              <p className="help-center-hero__metric-detail">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <TestimonialsSection
        title="Teams rely on Georim support when the event clock is running"
        description="From setup questions to live operations, the Help Center keeps guidance close to the work."
        testimonials={testimonials}
      />

      <div className="help-center-support-grid">
        <div className="help-center-surface bg-white rounded-xl border border-gray-200 p-6">
          <div className="help-center-section-heading mb-4">
            <div className="help-center-section-heading__icon">
              <MessageCircle className="w-5 h-5 text-[#7626c6]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Browse Help Topics</h2>
              <p className="mt-1 text-sm text-gray-500">
                Common answers for dashboard, team, and event-management workflows.
              </p>
            </div>
          </div>
          <FaqSection
            title="FAQs"
            description="Find direct answers quickly, then open a support request when the workflow needs follow-up."
            items={faqItems}
            className="pt-0"
          />
        </div>

        <div className="help-faq-section__contact">
          <div className="help-faq-section__contact-icon">
            <MessageCircle className="w-4 h-4" />
          </div>
          <p className="help-faq-section__contact-title">Still have questions?</p>
          <p className="help-faq-section__contact-description">
            Open a support request and send the details directly from the dashboard.
          </p>
          <Button
            size="sm"
            onClick={() => {
              setNotice(null);
              setIsContactModalOpen(true);
            }}
          >
            Contact Support
          </Button>
        </div>
      </div>

      {isContactModalOpen && (
        <div className="help-center-modal-overlay">
          <div className="help-center-modal-backdrop" onClick={() => setIsContactModalOpen(false)} />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            className="help-center-modal-card bg-white rounded-2xl border border-gray-200"
          >
            <div className="help-center-modal-card__header">
              <div>
                <h2 id={titleId} className="text-xl font-semibold text-gray-900">Contact Support</h2>
                <p id={descriptionId} className="text-sm text-gray-600">
                  Your account details are prefilled to speed up submission.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="help-center-modal-card__close"
                aria-label="Close support form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitHelpRequest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="help-full-name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    id="help-full-name"
                    type="text"
                    value={helpForm.fullName}
                    onChange={(event) => updateHelpField('fullName', event.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="help-email-address" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    id="help-email-address"
                    type="email"
                    value={helpForm.email}
                    onChange={(event) => updateHelpField('email', event.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="help-topic" className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <select
                  id="help-topic"
                  value={helpForm.topic}
                  onChange={(event) => updateHelpField('topic', event.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="events">Event Management</option>
                  <option value="ticketing">Ticketing</option>
                  <option value="orders">Orders & Check-in</option>
                  <option value="account">Account & Login</option>
                </select>
              </div>

              <div>
                <label htmlFor="help-message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  id="help-message"
                  ref={initialFocusRef}
                  rows={5}
                  value={helpForm.message}
                  onChange={(event) => updateHelpField('message', event.target.value)}
                  placeholder="Describe the issue you need help with..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7626c6] focus:border-transparent resize-none"
                />
              </div>

              {notice && <p className="text-sm text-[#7626c6]" aria-live="polite">{notice}</p>}

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsContactModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#7626c6] text-white rounded-lg">
                  Send Help Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
