export interface PostInteraction{
    _id?: string;
    message: string;
    authorId: string;
    date: Date;
    authorFullName: string;
    photo: any;
}