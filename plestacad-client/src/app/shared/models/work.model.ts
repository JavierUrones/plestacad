import { WorkCategory } from "./category.enum";

export class Work {
    _id!: string;
    title!: string;
    authorId!: string;
    teachers!: string[];
    students!: string[];
    category!: WorkCategory;
    course!: number;
    description!: string;
  }