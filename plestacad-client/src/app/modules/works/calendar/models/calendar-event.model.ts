/** Interfaz que define los atributos de la entidad evento */
export interface CalendarEvent {
    url: string;
  /** Id de la base de datos del evento */
    _id: string;
    /** Id que debe indicarse manualmente para que el componente fullcalendar entienda que se trata del id del evento */
    id: string;
    /** Título del evento */
    title: string;
    /** Descripción del evento */
    description: string;
    /** Id del trabajo académico asociado al evento */
    workId: string,
    /** Fecha de inicio del evento */
    start: Date;
    /** Fecha de fin del evento */
    end: Date;
    /** Lista de tags del evento */
    tag: string[];
    /** Id de la tarea que genera el evento en caso de que sea un evento generado a partir de una tarea con fecha de inicio y fecha de fin */
    taskOriginId: string;
    /** Color del evento en el componente fullcalendar */
    color: string;
    /** Determina si el evento es editable o no en el calendario, los eventos generados a partir de tareas no son editables */
    editable: boolean;
  }