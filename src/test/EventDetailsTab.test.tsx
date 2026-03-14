import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { EventManagement } from '../components/EventManagement';
import { EventDraft } from '../types/event';

const sampleEventDetails: EventDraft = {
  title: 'Original Event Title',
  type: 'Conference',
  category: 'Technology',
  tags: ['tech', 'community'],
  locationType: 'in-person',
  location: 'Austin Convention Center',
  startDate: '2026-11-12',
  startTime: '09:00',
  endDate: '2026-11-12',
  endTime: '18:00',
  isRecurring: false,
  mainImage: '',
  additionalImages: [],
  videoUrl: '',
  summary: 'Original summary',
  description: 'Original long description'
};

describe('Event details tab', () => {
  it('allows editing and saving event details', async () => {
    const user = userEvent.setup();
    const handleUpdateDetails = vi.fn();

    render(
      <EventManagement
        eventId="evt-42"
        eventName="Original Event Title"
        eventDetails={sampleEventDetails}
        onUpdateEventDetails={handleUpdateDetails}
      />
    );

    await user.click(screen.getByRole('button', { name: /edit details/i }));

    const titleInput = screen.getByLabelText(/event title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Event Title');

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(handleUpdateDetails).toHaveBeenCalled();
    expect(handleUpdateDetails.mock.calls[0][0]).toMatchObject({
      title: 'Updated Event Title'
    });
    expect(await screen.findByText(/event details updated/i)).toBeInTheDocument();
  });

  it('falls back to event details when the active tier drops to free', async () => {
    const { rerender } = render(
      <EventManagement
        activeTier="premium"
        eventId="evt-42"
        eventName="Original Event Title"
        eventDetails={sampleEventDetails}
        activeTab="orders"
      />
    );

    expect(await screen.findByRole('heading', { name: /orders & registration/i })).toBeInTheDocument();

    rerender(
      <EventManagement
        activeTier="free"
        eventId="evt-42"
        eventName="Original Event Title"
        eventDetails={sampleEventDetails}
        activeTab="orders"
      />
    );

    expect(await screen.findByRole('heading', { name: /original event title/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /^event details$/i, selected: true })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /^orders$/i })).not.toBeInTheDocument();
  });
});
