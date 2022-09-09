export interface Task {
    _id: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
    workId: string,
    userAssignedId: string,
    taskClassificatorId: string
  }