/**
 * Modelo de solicitud de incorporación a trabajo académico.
 */
export class WorkRequest {
  /**
   * id de la solicitud.
   */
    _id!: string;
    /**
     * id del trabajo académico asociado.
     */
    workId!: string;
    /**
     * id del usuario receptor de la solicitud
     */
    userReceiverId!: string;
    /**
     * id del usuario que envía la solicitud
     */
    userSenderId!: string;
    /**
     * rol que va a tener el usuario receptor en el trabajo académico
     */
    role!: string;

  }