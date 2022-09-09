import {Task} from "./Task.model";

export interface TaskClassificator{
    _id: string;
    title: string;
    workId: string;
    order: number;
    tasks: Task[];
}