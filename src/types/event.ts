export type EventLifecycleStatus = 'draft' | 'published' | 'private' | 'archived';

export type EventDraft = {
  title: string;
  type: string;
  category: string;
  tags: string[];
  locationType: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isRecurring: boolean;
  mainImage: string;
  additionalImages: string[];
  videoUrl: string;
  summary: string;
  description: string;
};

export type EventDraftUpdate = Partial<EventDraft>;

export type EventSummary = {
  id: string;
  title: string;
  date: string;
  location: string;
  status: EventLifecycleStatus;
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  image: string;
};
