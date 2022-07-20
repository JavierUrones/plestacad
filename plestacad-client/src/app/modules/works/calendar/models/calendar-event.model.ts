export interface CalendarEvent {
    _id: string;
    title: string;
    description: string;
    workId: string,
    start: Date;
    end: Date;
    tag: string[];
  }