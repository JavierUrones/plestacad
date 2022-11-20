/** Interfaz que define los atributos de una respuesta a un tema del trabajo académico. */
export interface PostInteraction{
    /** Id de la respuesta */
    _id?: string;
    /** Contenido de la respuesta */
    message: string;
    /** Id del autor de la respuesta */
    authorId: string;
    /** Fecha de la respuesta */
    date: Date;
    /** Nombre completo del autor de la respuesta */
    authorFullName: string;
    /** Foto del autor de la respuesta */
    photo: any;
}