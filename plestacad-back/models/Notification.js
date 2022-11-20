/** Módulo que contiene el esquema de mongoose de los eventos del calendario.
 * @module models/Notification
 */
/** Módulo mongoose */
const mongoose = require("mongoose");
/** Esquema de mongoose de las notificaciones */
const notificationScheema = mongoose.Schema({
  /** Descripcion de la notificacion */
  description: {
    type: String,
    required: true,
  },
  /** Fecha de la notificación */
  date: {
    type: Date,
    required: true,
  },
  /** Id del trabajo que genera la notificación */
  workId: { type: mongoose.Schema.Types.ObjectId, ref: "Work" },
  /** Lista de usuarios receptores de la notificaciones */
  usersIdReceivers:[
    {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  ],
  /** Id del usuario responsable de haber generado la notificación */
  userIdResponsible: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  /** Recurso relacionado con la notificación */
  mainContent: {
    type: String
  },
});

module.exports = mongoose.model("Notification", notificationScheema);
