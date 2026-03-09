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
  videoUrl: string;
  summary: string;
  description: string;
};

export type EventDraftUpdate = Partial<EventDraft>;
