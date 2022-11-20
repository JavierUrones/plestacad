import {Task} from "./Task.model";

/** Interfaz que define la entidad apartado de clasificación de tareas */
export interface TaskClassificator{
    /** Id del apartado de clasificación */
    _id: string;
    /** Título del apartado de clasificación */
    title: string;
    /** Id del trabajo académico */
    workId: string;
    /** Orden del apartado de clasificación dentro del tablero */
    order: number;
    /** Lista de tareas clasificadas */
    tasks: Task[];
}