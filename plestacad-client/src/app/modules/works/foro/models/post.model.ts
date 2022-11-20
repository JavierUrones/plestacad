
/** Interfaz que define los atributos de un tema del trabajo académico. */
export interface Post {
  /** Id del tema */
    _id: string;
    /** Título del tema */
    title: string;
    /** Id del autor del tema */
    authorId: string;
    /** Id del trabajo académico al que pertenece el tema*/
    workId: string,
    /** Lista de ids de las respuestas del tema */
    interactions: string[];
    /** Fecha de creación del tema. */
    creationDate: Date;
    /** Atributo que determina si un tema es favorito */
    isFavorite: boolean;
    /** Contenido del tema */
    message: String;
    /** Fecha de la última respuesta del tema */
    lastMessageDate: Date;
    /** Nombre completo del autor del tema */
    authorFullName: string;
  }