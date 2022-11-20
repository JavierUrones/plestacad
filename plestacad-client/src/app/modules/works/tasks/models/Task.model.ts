/** Interfaz de la entidad tareas */
export interface Task {
  /** Id de la tarea */
    _id: string;
    /** Título de la tarea */
    title: string;
    /** Descripción de la tarea */
    description: string;
    /** Fecha de inicio de la tarea */
    start: Date;
    /** Fecha de fin de la tarea */
    end: Date;
    /** Id del trabajo académico al que pertenece la tarea */
    workId: string,
    /** Id del usuario al que está asignada la tarea */
    userAssignedId: string,
    /** Id del apartado de clasificación en el que la tarea está clasificada */
    taskClassificatorId: string
  }