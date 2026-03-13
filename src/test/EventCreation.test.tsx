import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EventCreation } from '../components/EventCreation';

const EVENT_CREATION_DRAFT_STORAGE_KEY = 'georim:create-event-draft';

describe('EventCreation draft persistence', () => {
  beforeEach(() => {
    window.localStorage.removeItem(EVENT_CREATION_DRAFT_STORAGE_KEY);
  });

  afterEach(() => {
    window.localStorage.removeItem(EVENT_CREATION_DRAFT_STORAGE_KEY);
  });

  it('restores the current step and event details after remounting', async () => {
    const user = userEvent.setup();
    const onEventCreated = vi.fn();
    const { unmount } = render(<EventCreation onEventCreated={onEventCreated} />);

    await user.type(screen.getByPlaceholderText(/give your event a clear, memorable title/i), 'Launch Party');
    await user.click(screen.getByRole('button', { name: /next step/i }));

    expect(await screen.findByRole('heading', { name: /^location$/i })).toBeInTheDocument();

    unmount();

    render(<EventCreation onEventCreated={onEventCreated} />);

    expect(await screen.findByRole('heading', { name: /^location$/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^back$/i }));
    expect(await screen.findByDisplayValue('Launch Party')).toBeInTheDocument();
  });

  it('clears the saved draft after the event is created', async () => {
    const user = userEvent.setup();
    const onEventCreated = vi.fn();

    window.localStorage.setItem(
      EVENT_CREATION_DRAFT_STORAGE_KEY,
      JSON.stringify({
        completedSteps: ['basic', 'location', 'datetime', 'media'],
        currentStep: 'description',
        eventData: {
          title: 'Saved Draft Event',
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
          description: 'Draft body',
        },
        savedAt: '2026-03-13T12:00:00.000Z',
      }),
    );

    render(<EventCreation onEventCreated={onEventCreated} />);

    await user.click(await screen.findByRole('button', { name: /create event/i }));

    expect(onEventCreated).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem(EVENT_CREATION_DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('clears the draft and resets the form when requested', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    window.localStorage.setItem(
      EVENT_CREATION_DRAFT_STORAGE_KEY,
      JSON.stringify({
        completedSteps: ['basic'],
        currentStep: 'location',
        eventData: {
          title: 'Saved Draft Event',
          type: 'Conference',
          category: 'Business',
          tags: ['launch'],
          locationType: 'venue',
          location: 'Austin Convention Center',
          startDate: '',
          startTime: '',
          endDate: '',
          endTime: '',
          isRecurring: false,
          mainImage: '',
          additionalImages: [],
          videoUrl: '',
          summary: '',
          description: '',
        },
        savedAt: '2026-03-13T12:00:00.000Z',
      }),
    );

    render(<EventCreation onEventCreated={vi.fn()} />);

    expect(await screen.findByRole('heading', { name: /^location$/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear draft/i }));

    expect(confirmSpy).toHaveBeenCalledWith('Clear this draft and restart the event setup?');
    expect(await screen.findByRole('heading', { name: /basic information/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/give your event a clear, memorable title/i)).toHaveValue('');
    expect(window.localStorage.getItem(EVENT_CREATION_DRAFT_STORAGE_KEY)).toBeNull();

    confirmSpy.mockRestore();
  });
});
