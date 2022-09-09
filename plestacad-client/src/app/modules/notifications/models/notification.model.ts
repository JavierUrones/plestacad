export interface Notification {
    _id: string;
    description: string;
    date: Date;
    workId: string;
    usersIdReceivers: string[];
    userIdResponsible: string

  }