/** Interfaz que determina los atributos de la entidad notificación */
export interface Notification {
  /** Id de la notificación */
  _id: string;
  /** Descripción de la notificación */
  description: string;
  /** Fecha de la notificación */
  date: Date;
  /** Id del trabajo académico asociado a la notificación */
  workId: string;
  /** Lista de usuarios que deben recibir la notificación */
  usersIdReceivers: string[];
  /** Usuario responsable de que se produzca la notificación */
  userIdResponsible: string;

}