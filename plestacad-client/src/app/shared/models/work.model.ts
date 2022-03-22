import { WorkCategory } from "./category.enum";

export class Work {
    _id!: string;
    title!: string;
    teachers!: string[];
    students!: string[];
    category!: WorkCategory;
  }