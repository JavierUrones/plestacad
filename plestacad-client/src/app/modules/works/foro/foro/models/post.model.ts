export interface Post {
    title: string;
    authorId: string;
    workId: string,
    interactions: string[];
    creationDate: Date;
    isFavorite: boolean;
    message: String;
    lastMessageDate: Date;
    authorFullName: string;
  }